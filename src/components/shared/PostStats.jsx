import React, { useState, useEffect } from 'react'
import like from '../../../public/assets/icons/like.svg';
import liked from '../../../public/assets/icons/liked.svg';
import save from '../../../public/assets/icons/save.svg';
import saved from '../../../public/assets/icons/saved.svg';
import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from '../../lib/react-query/queriesAndmutations';
import { checkIsLiked } from '../../constants';
import Loader from './Loader';
import { message } from 'antd';

const PostStats = ({ post, userId }) => {
  const likesList = post?.likes?.map((user) => user?.$id)

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: currentUser } = useGetCurrentUser();

  const savePostRecord = currentUser?.save.find((record) => record.post.$id === post.$id);

  useEffect(() => {
    setIsSaved(!!savePostRecord)
  }, [currentUser])

  const handleLikePost = (e) => {
    e.stopPropagation();
    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId)

    if(hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId)
    } else {
      newLikes.push(userId)
    }

    setLikes(newLikes);
    likePost({ postId: post.$id || '', newLikes })
    messageApi.open({
      type: 'success',
      content: `You have liked ${post.creator.name}'s post`
    });
  }

  const handleSavePost = (e) => {
    e.stopPropagation();
    if(savePostRecord) {
      setIsSaved(false);
      deleteSavedPost(savePostRecord.$id);
      messageApi.open({
        type: 'success',
        content: `You have un-saved ${post.creator.name}'s post`
      });
    } else {
      savePost({ postId: post.$id || '', userId });
      setIsSaved(true);
      messageApi.open({
        type: 'success',
        content: `You have saved ${post.creator.name}'s post`
      });
    }
  }

  return (
    <>
      {contextHolder}
      <div className='flex justify-between items-center z-20'>
        <div className='flex gap-2 mr-5'>
          <img 
            src={checkIsLiked(likes, userId) ? liked : like} 
            alt='like' 
            width={20} 
            height={20} 
            onClick={handleLikePost}
            className='cursor-pointer'
          />
          <p className='small-medium lg:base-medium'>{likes?.length}</p>
        </div>
        <div className='flex gap-2'>
        {isSavingPost || isDeletingSaved ?
          <Loader /> :
          <img 
            src={isSaved ? saved : save} 
            alt='like' 
            width={20} 
            height={20} 
            onClick={handleSavePost}
            className='cursor-pointer'
          /> }
        </div>
      </div>
    </>
    
  )
}

export default PostStats