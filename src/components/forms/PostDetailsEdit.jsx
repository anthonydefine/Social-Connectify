import React, { useState } from 'react'
import { Input, Button, message } from 'antd';
import { updatePost } from '../../lib/appwrite/api';
import { useGetPostById } from '../../lib/react-query/queriesAndmutations';
import { useParams } from 'react-router-dom';

const { TextArea } = Input;

const PostDetailsEdit = () => {
  const [ caption, setCaption ] = useState('');
  const [ tags, setTags ] = useState('');

  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || '');

  const handleUpdatePost = async () => {
    const newData = await updatePost({ postId: post.$id, caption, tags });
    return newData;
  }

  return (
    <div className='w-full'>
      <form className='flex flex-col gap-3' onSubmit={handleUpdatePost}>
        <p>Caption</p>
        <TextArea 
          className='w-full bg-dark-4 text-light-2 placeholder:text-light-3' 
          rows={4}
          placeholder={post?.caption}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          />
        <p>Tags</p>
        <Input 
          className='bg-dark-4 text-light-2 placeholder:text-light-3' 
          type='text' 
          placeholder={post?.tags}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          />
        <Button htmlType='submit' className='shad-button_primary w-full'>Update post</Button>
      </form>
    </div>
  )
}

export default PostDetailsEdit