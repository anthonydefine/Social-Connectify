import React, { useState } from 'react'
import { useDeletePost, useGetPostById } from '../../lib/react-query/queriesAndmutations';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Loader from '../../components/shared/Loader';
import { formatTimestamp } from '../../constants';
import { Button, Tag, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useUserContext } from '../../context/AuthContext';
import PostStats from '../../components/shared/PostStats';
import ProfileModal from '../../components/modals/ProfileModal';
import PostDetailsEdit from '../../components/forms/PostDetailsEdit';
import back from '../../../public/assets/icons/back.svg'

const PostDetails = () => {
  const [ edit, setEdit ] = useState(false);
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');
  const { user } = useUserContext();

  const navigate = useNavigate();

  const { mutate: deletePost } = useDeletePost();

  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId })
    navigate( -1 );
  };

  const editText = <span>Edit post</span>
  const deleteText = <span>Delete post</span>

  return (
    <div className='post_details-container'>
      <Link className='place-self-start flex gap-2 items-center hover:underline underline-offset-2' onClick={() => navigate(-1)}>
        <img src={back} alt='back' />
        <p>Back</p>
      </Link>
      {isPending ? <Loader /> : (
        <div className='post_details-card'>
          <img
            src={post?.imageUrl} 
            alt='post'
            className='post_details-img'
          />
          <div className='post_details-info'>
            <div className='flex-between w-full'>
              <span className='flex items-center gap-3'>
                <ProfileModal post={post} />
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
              </span>
              <div className='flex-center gap-4'>
                {user.id === post?.creator.$id ? (
                  <span className='flex gap-3'>
                    <Tooltip placement='bottom' title={editText}>
                      <Button type='link' icon={<EditOutlined />} onClick={() => setEdit(!edit)}></Button>
                    </Tooltip>
                    <Tooltip placement='bottom' title={deleteText}>
                      <Button danger type='link' icon={<DeleteOutlined />} onClick={handleDeletePost}></Button>
                    </Tooltip>
                  </span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <hr className='border w-full border-dark-4/80' />
            {edit ? (
              <PostDetailsEdit />
            ) : (
              <>
                <div className='flex flex-col flex-1 w-full small-medium lg:base-medium'>
                  <p>{post?.caption}</p>
                  <ul className='flex gap-1 mt-2'>
                    {post?.tags?.map((tag) => {
                      return (
                        <li key={tag} className='text-light-3'>
                          <Tag color='blue' bordered={false}>#{tag}</Tag>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <div className='w-full'>
                  <PostStats post={post} userId={user?.id} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails