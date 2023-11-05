import React from 'react'
import { useGetPostById } from '../../lib/react-query/queriesAndmutations';
import { useParams, Link } from 'react-router-dom';
import Loader from '../../components/shared/Loader';
import { formatTimestamp } from '../../constants';
import { Button, Tag, Dropdown } from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { useUserContext } from '../../context/AuthContext';
import PostStats from '../../components/shared/PostStats';
import ProfileModal from '../../components/modals/ProfileModal';

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');
  const { user } = useUserContext();

  const items = [
    {
      key: 1,
      label: (
        <Button type='ghost' icon={<DeleteOutlined />}>Delete post</Button>
      ),
    },
    {
      key: 2,
      label: (
        <Button type='ghost' icon={<EditOutlined />}>Update post</Button>
      ),
    },
  ];

  return (
    <div className='post_details-container'>
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
                  <span>
                    <Dropdown
                    menu={{items,}}
                    placement='bottom'
                    className={`${user?.id !== post?.creator?.$id && 'hidden'}`}
                    >
                      <MoreOutlined type='ghost' className='cursor-pointer' />
                    </Dropdown>
                  </span>
                ) : (
                  ''
                )}
              </div>
            </div>
            <hr className='border w-full border-dark-4/80' />
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
          </div>
        </div>
      )}
    </div>
  )
}

export default PostDetails