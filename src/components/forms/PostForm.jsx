import React, { useState } from 'react'
import { Button, Upload, Form, Input, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useUserContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCreatePost } from '../../lib/react-query/queriesAndmutations';

const { TextArea } = Input;
const { Dragger } = Upload;

const convertFileToUrl = (file) => URL.createObjectURL(file);

const PostForm = () => {
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');

  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const beforeUpload = (file) => {
    setFile(file); // Set the file object to the state
    setFileUrl(convertFileToUrl(file))
    return false; // Prevent automatic upload
  };

  const submitPost = async (e) => {
    e.preventDefault();
    try {
      if (!file) {
        // Handle case where no file is uploaded
        message.error('Please upload a file.');
        return;
      }
      const newPost = await createPost({
        caption: caption,
        location: location,
        tags: tags,
        userId: user.id,
        file: file, // Pass the array of file URLs to your createPost function
      });
      if (newPost) {
        navigate('/');
        messageApi.open({
          type: 'success',
          content: `Your post has been created!`
        });
      } else {
        // Handle post creation failure
        console.error('Post creation failed.');
        messageApi.open({
          type: 'error',
          content: `There has been an error creating your post`
        });
      }
    } catch (error) {
      // Handle errors (file upload failure, post creation failure)
      console.error('Error:', error);
      // Notify the user about the error (e.g., show a notification)
    }
  };

  return (
    <>
      {contextHolder}
      <form className='w-3/4 text-light-2 flex flex-col gap-4' onSubmit={submitPost}>
        <p>Add a picture</p>
        {!file ? (
          <Dragger 
          fileList={file ? [file] : []} 
          beforeUpload={beforeUpload} 
          className='bg-dark-3 flex flex-center flex-col rounded-xl file-uploader-box'
          >
            <p className="ant-upload-drag-icon pt-10">
              <UploadOutlined />
            </p>
            <p className="text-gray-200 pb-10">Click or drag file to this area to upload</p>
          </Dragger>
        ) : (
          <img src={fileUrl} alt='upload preview' className='rounded-xl object-cover max-h-80' />
        )}
        <p>Caption</p>
        <TextArea 
          className='w-full bg-dark-4 text-light-2' 
          rows={4} 
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <p>Location</p>
        <Input 
          className='bg-dark-4 text-light-2' 
          type='text' 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <p>Tags</p>
        <Input 
          className='bg-dark-4 text-light-2' 
          type='text' 
          placeholder='Art, History, Travel' 
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <Button 
          size='large' 
          className='shad-button_primary mt-2' 
          htmlType='submit'
        >
          Submit
        </Button>
      </form>
    </>
    
  )
}

export default PostForm