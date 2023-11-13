import React from 'react'
import { Link } from 'react-router-dom'
import profilePlaceholder from '../../../public/assets/icons/profile-placeholder.svg';
import { DeleteOutlined } from '@ant-design/icons';
import { useUserContext } from '../../context/AuthContext';
import PostStats from './PostStats';
import { formatTimestamp } from '../../constants';
import { Button, Tag, Tooltip } from 'antd';
import { useDeletePost, useGetUserById } from '../../lib/react-query/queriesAndmutations';
import ProfileModal from '../modals/ProfileModal';
import UserProfileModal from '../modals/UserProfileModal';

const PostCard = ({ post }) => {

  const { user } = useUserContext();
  const { data: currentUser } = useGetUserById(user.id || "");

  const { mutate: deletePost } = useDeletePost();

  const handleDeletePost = () => {
    deletePost({ postId: post?.$id, imageId: post?.imageId })
  };

  const deleteText = <span>Delete post</span>

  return (
    <div className='post-card p-6'>
      <div className='flex-between'>
        <div className='flex items-center gap-3'>
          <span>
            {currentUser?.$id === post?.creator?.$id ? (
              <UserProfileModal nameDetails={false} />
            ) : (
              <ProfileModal post={post} />
            )}
          </span>
          <div className='flex flex-col'>
            <p className='base-medium lg:body-bold text-light-1'>{post?.creator?.name}</p>
            <div className='flex-center gap-2 text-light-3'>
              <p className='subtle-semibold lg:small-regular'>
                {formatTimestamp(post?.$createdAt)}
              </p>
              -
              <p className='subtle-semibold lg:small-regular'>
                {post?.location}
              </p>
            </div>
          </div>
        </div>
        {user.id === post?.creator.$id ? (
          <Tooltip placement='bottom' title={deleteText}>
            <Button danger type='link' icon={<DeleteOutlined />} onClick={handleDeletePost}></Button>
          </Tooltip>
        ) : (
          ''
        )}
      </div>
      <Link to={`/posts/${post?.$id}`}>
        <div className='small-medium lg:base-medium py-5'>
          <p>{post?.caption}</p>
          
        </div>
        <img src={post?.imageUrl || profilePlaceholder} className='post-card_img' alt='post image' />
      </Link>
      <ul className='flex gap-1 my-4'>
        {post?.tags?.map((tag) => {
          return (
            <li key={tag} className='text-light-3'>
              <Tag color='blue' bordered={false}>#{tag}</Tag>
            </li>
          )
        })}
      </ul>
      <PostStats post={post} userId={user.id} />
    </div>
  )
}

export default PostCard