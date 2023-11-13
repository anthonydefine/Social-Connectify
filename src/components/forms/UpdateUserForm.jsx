import React, { useState } from 'react'
import { Input, Button, message, Upload } from 'antd'
import Loader from '../shared/Loader';
import profilePlaceholder from '../../../public/assets/icons/profile-placeholder.svg';
import { useUpdateUser } from '../../lib/react-query/queriesAndmutations';
import { useNavigate } from 'react-router';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';


const convertFileToUrl = (file) => URL.createObjectURL(file);

const UpdateUserForm = ({ currentUser }) => {
  const [bio, setBio] = useState(currentUser?.bio);
  const [name, setName] = useState(currentUser?.name);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState('');
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutateAsync: updateUser, isLoading: isLoadingUpdate } = useUpdateUser();

  const { TextArea } = Input;

  const beforeUpload = (file) => {
    setFile(file); // Set the file object to the state
    setFileUrl(convertFileToUrl(file))
    return false; // Prevent automatic upload
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      // Update user's image data
      const updatedUser = await updateUser({ userId: currentUser?.$id, bio, name, file });
      if (updatedUser) {
        navigate('/');
        messageApi.open({
          type: 'success',
          content: `Your profile has been updated!`
        });
      } else {
        // Handle post creation failure
        console.error('Profile update failed.');
        messageApi.open({
          type: 'error',
          content: `There was an error updating your profile!`
        });
      }
      window.location.reload();
      // Handle the updated user object as needed
    } catch (error) {
      // Handle upload or update errors
      console.error('Error updating user image:', error);
    }
  };

  const uploadButton = (
    <div className='text-light-2'>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <>
      {contextHolder}
      {!currentUser ? (
        <Loader />
      ) : (
        <form className='flex flex-col gap-4 items-start p-2' onSubmit={handleUpload}>
          <div className='flex flex-col items-start w-1/2'>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              fileList={file ? [file] : []}
            >
              {fileUrl || currentUser.imageUrl ? (
                <img
                  src={fileUrl || currentUser.imageUrl || profilePlaceholder}
                  alt="avatar"
                  className="w-full h-full rounded-full"
                />
              ) : (
                uploadButton
              )}
            </Upload>
            <div className='flex flex-col place gap-2 w-full'>
              <p className="text-start xl:text-left text-light-2 text-2xl font-bold w-full">
                Change name
              </p>
              <Input
                className='bg-dark-3 text-light-2 p-2' 
                type='text' 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p className="small-regular md:body-medium text-light-3 text-left">
                @{currentUser?.username}
              </p>
            </div>
          </div>
          <hr className='border w-full border-dark-4/80 my-2' />
          <div className='text-light-2 flex flex-col place gap-2 w-full'>
            <p className='text-2xl font-bold'>Change bio</p>
            <TextArea
              className='bg-dark-3 text-light-2 p-2 placeholder:text-light-3' 
              type='text'
              placeholder={currentUser?.bio || 'Let other users know you better'}
              value={bio}
              onChange={(e) => setBio(e.target.value)} 
            />
          </div>
          <Button htmlType='submit' className='shad-button_primary'>
            Update Profile
          </Button>
        </form>
      )}
    </>
  )
}

export default UpdateUserForm