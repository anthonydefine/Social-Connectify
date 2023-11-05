import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getUserById, likePost, savePost, searchPosts, signInAccount, signOutAccount, updateUser } from '../appwrite/api';

export const useCreateUserAccount= () => {
  return useMutation({
    mutationFn: (user) => createUserAccount(user)
  })
}

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user) => signInAccount(user)
  })
}

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: (user) => signOutAccount(user)
  })
}

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_RECENT_POSTS]
      })
    }
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [import.meta.env.VITE_GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  })
}

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, likesArray }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_POST_BY_ID, data?.$id]
      })
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_CURRENT_USER]
      })
    }
  })
}

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }) => savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_CURRENT_USER]
      })
    }
  })
}

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (savedRecordId) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_RECENT_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_POSTS]
      })
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_CURRENT_USER]
      })
    }
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [import.meta.env.VITE_GET_CURRENT_USER],
    queryFn: getCurrentUser
  })
}

export const useGetUserById = (userId) => {
  return useQuery({
    queryKey: [import.meta.env.VITE_GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useGetPostById = (postId) => {
  return useQuery({
    queryKey: [import.meta.env.VITE_GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId
  })
}

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, imageId }) => deletePost(postId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_RECENT_POSTS]
      })
    }
  })
}

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [import.meta.env.VITE_GET_INFINITE_POSTS],
    queryFn: getInfinitePosts,
    getNextPageParam: (lastPage) => {
      if(lastPage && lastPage.documents.length === 0) {
        return null;
      }

      const lastId = lastPage.documents[lastPage?.documents.length -1].$id;
      return lastId;
    }
  })
}

export const useSearchPosts = (searchTerm) => {
  return useQuery({
    queryKey: [import.meta.env.VITE_SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [import.meta.env.VITE_GET_USER_BY_ID, data?.$id],
      });
    },
  });
};