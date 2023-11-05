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
  if(!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
    return { status: 'ok' };
  } catch (error) {
    console.log(error)
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


// ============================== Update Activity
export async function updateUser(user) {
  try {
    const updatedUser = { // Prepare user data to update
      name: user.name,
      bio: user.bio,
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };
    if (user.file && user.file.length > 0) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      
      if (!uploadedFile) {
        throw new Error('Error uploading file to storage');
      }
      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw new Error('Error getting file URL');
      }
      // Update user with new image data
      updatedUser.imageUrl = fileUrl;
      updatedUser.imageId = uploadedFile.$id;
    }
    // Update user document in the database
    const response = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      updatedUser
    );
    // Handle the response or return it to the caller
    return response;
  } catch (error) {
    // Handle errors appropriately, such as logging or notifying the user
    console.error('Error updating user:', error);
    throw error; // Rethrow the error to propagate it to the caller
  }
}


