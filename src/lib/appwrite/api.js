import { ID, Query } from 'appwrite';
import { account, appwriteConfig, avatars, databases, storage } from './config';


export async function createUserAccount(user) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    );

    if(!newAccount) throw error;
    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    })
    return newUser;
  } catch (error) {
    console.log(error)
    return error;
  }
}

export async function saveUserToDB(user) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser, newFriendList;
  } catch (error) {
    console.log(error)
  }
}

export async function signInAccount(user) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error)
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current');

    return session
  } catch (error) {
    console.log(error)
  }
}

export async function createPost(post) {
  try {
    // Upload file to appwrite storage
    const uploadedFile = await uploadFile(post.file);

    if (!uploadedFile) throw Error;

    // Get file url
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    // Convert tags into array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Create post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(updatedPostData) {
  try {
    // Extract updated post data
    const { postId, caption, tags } = updatedPostData;
    // Convert tags into array
    const tagsArray = tags.replace(/ /g, "").split(",") || [];
    // Update post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        caption: caption,
        tags: tagsArray,
      }
    );
    return updatedPost;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error; // Throw the error for further handling, if needed
  }
};


// ============================== UPLOAD FILE
export async function uploadFile(file) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET FILE URL
export function getFilePreview(fileId) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc('$createdAt', Query.limit(20))]
  )
  if(!posts) throw Error;
  return posts;
}

export async function likePost(postId, likesArray) {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )
    if(!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error)
  }
}

//saved post
export async function savePost(postId, userId) {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId
      }
    )
    if(!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error)
  }
}

export async function deleteSavedPost(savedRecordId) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    )
    if(!statusCode) throw Error;
    return { status: 'ok' };
  } catch (error) {
    console.log(error)
  }
}

export async function getPostById(postId) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    return post;
  } catch (error) {
    console.log(error)
  }
}

export async function deletePost(postId, imageId) {
  if (!postId || !imageId) return;

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;

    await deleteFile(imageId);

    return { status: "Ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }) {
  const queries = [Query.orderDesc('$updatedAt'), Query.limit(9)]

  if(pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    )
    if(!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error)
  }
}

export async function searchPosts(searchTerm) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    )
    if(!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error)
  }
}

// ============================== GET USER BY ID
export async function getUserById(userId) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
}

// ============================== Friend Activity
export async function followFriend(userId, targetId) {
  try {
    // Fetch current user data
    const currentUserResponse = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, userId);
    const currentUser = currentUserResponse;
    // Fetch target user data
    const targetUserResponse = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, targetId);
    const targetUser = targetUserResponse;
    // Check if both users exist in the database
    if (!currentUser || !targetUser) {
      throw new Error('Invalid user data');
    }
    // Get current user's friends list or initialize it if it doesn't exist
    const currentUserFriends = currentUser.friends || [];
    // Get target user's friends list or initialize it if it doesn't exist
    const targetUserFriends = targetUser.friends || [];
    // Check if the users are already friends
    if (currentUserFriends.includes(targetId) || targetUserFriends.includes(userId)) {
      throw new Error('Users are already friends');
    }
    // Add the new friend to the users' friends list
    currentUserFriends.push(targetId);
    targetUserFriends.push(userId);
    // Update the current user document with the updated friends list
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        friends: currentUserFriends,
      }
    );
    // Update the target user document with the updated friends list
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      targetId,
      {
        friends: targetUserFriends,
      }
    );
    console.log('Friend request sent successfully.');
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
}

export async function removeFriend(userId, targetId) {
  try {
    // Fetch current user data
    const currentUserResponse = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, userId);
    const currentUser = currentUserResponse;
    // Fetch target user data
    const targetUserResponse = await databases.getDocument(appwriteConfig.databaseId, appwriteConfig.userCollectionId, targetId);
    const targetUser = targetUserResponse;
    // Check if both users exist in the database
    if (!currentUser || !targetUser) {
      throw new Error('Invalid user data');
    }
    // Get current user's friends list
    const currentUserFriends = currentUser.friends || [];
    // Get target user's friends list
    const targetUserFriends = targetUser.friends || [];
    // Check if the users are friends
    const currentUserIndex = currentUserFriends.indexOf(targetId);
    const targetUserIndex = targetUserFriends.indexOf(userId);
    if (currentUserIndex === -1 || targetUserIndex === -1) {
      throw new Error('Users are not friends');
    }
    // Remove friend from the users' friends list
    currentUserFriends.splice(currentUserIndex, 1);
    targetUserFriends.splice(targetUserIndex, 1);
    // Update the current user document with the updated friends list
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        friends: currentUserFriends,
      }
    );
    // Update the target user document with the updated friends list
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      targetId,
      {
        friends: targetUserFriends,
      }
    );
    console.log('Friend removed successfully.');
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
}

// ============================== Update Activity
export async function updateUser(updatedUserData) {
  const { name, bio, userId, file } = updatedUserData;
  try {
    let imageUrl;
    let imageId;
    if (file) {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(file);
      if (!uploadedFile) throw Error;
      // Get file url
      imageUrl = getFilePreview(uploadedFile.$id);
      if (!imageUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
      imageId = uploadedFile.$id;
    }
    const updatedAccount = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      {
        name: name,
        bio: bio,
        ...(file && { imageUrl: imageUrl, imageId: imageId }), // Conditionally update image-related fields
      }
    );
    if (!updatedAccount && file) {
      await deleteFile(imageId);
      throw Error;
    }
    return updatedAccount;
  } catch (error) {
    console.log(error);
  }
}




