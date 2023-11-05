import React, { useState } from 'react'
import { Input, Button, message } from 'antd'
import Loader from '../shared/Loader';
import profilePlaceholder from '../../../public/assets/icons/profile-placeholder.svg';
import { useUpdateUser } from '../../lib/react-query/queriesAndmutations';
import { useNavigate } from 'react-router';

const UpdateUserForm = ({ currentUser }) => {
  const [bio, setBio] = useState(currentUser?.bio);
  const [name, setName] = useState(currentUser?.name);

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutateAsync: updateUser, isLoading: isLoadingUpdate } = useUpdateUser();

  const { TextArea } = Input;

  const handleUpload = async () => {
    try {
      // Update user's image data
      const updatedUser = await updateUser({
        userId: user.userId,
        name: name,
        bio: bio,
      });
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
      // Handle the updated user object as needed
    } catch (error) {
      // Handle upload or update errors
      console.error('Error updating user image:', error);
    }
  };

  return (
    <>
      {contextHolder}
      {!currentUser ? (
        <Loader />
      ) : (
        <form className='flex flex-col items-start p-2' onSubmit={handleUpload}>
          <div className='flex flex-col items-start gap-3 w-1/2'>
            <img
              src={currentUser.imageUrl || profilePlaceholder}
              className="w-16 h-16 lg:h-36 lg:w-36 rounded-full"
              alt="avatar" 
            />
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
              <div className='gap-4 hidden'>
                <p className='text-light-3'><span className='text-purple-500'>0</span> Posts</p>
                <p className='text-light-3'><span className='text-purple-500'>0</span> Friends</p>
              </div>
            </div>
          </div>
          <hr className='border w-full border-dark-4/80' />
          {currentUser?.bio ? (
            <div className='my-8 text-light-2 w-full'>
              <p className='text-2xl font-bold'>Change bio</p>
              <TextArea
                className='bg-dark-3 text-light-2 p-2' 
                type='text' 
                value={bio}
                onChange={(e) => setBio(e.target.value)} 
              />
            </div>
          ) : ''}
          <Button htmlType='submit' className='shad-button_primary'>
            Update Profile
          </Button>
        </form>
      )}
    </>
  )
}

export default UpdateUserForm