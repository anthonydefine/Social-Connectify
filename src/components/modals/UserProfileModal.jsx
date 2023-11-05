import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import profilePlaceholder from '../../../public/assets/icons/profile-placeholder.svg';
import { formatTimestamp } from '../../constants';
import { useUserContext } from '../../context/AuthContext';
import GridPostList from '../shared/GridPostList';
import { useGetUserById, useSignOutAccount } from '../../lib/react-query/queriesAndmutations';
import Loader from '../shared/Loader';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import UpdateUserForm from '../forms/UpdateUserForm';
import ProfileModal from './ProfileModal';
import { getUserById } from '../../lib/appwrite/api';

const UserProfileModal = ({ nameDetails = true }) => {
  const [modal1Open, setModal1Open] = useState(false);
  const [edit, setEdit] = useState(false);
  const [toggleDetails, setToggleDetails] = useState(true);
  const [friendDetails, setFriendDetails] = useState([]);
  const [isFriends, setIsFriends] = useState(false);
  const navigate = useNavigate();
  

  const { user } = useUserContext();

  const { data: currentUser } = useGetUserById(user.id || "");

  const { mutate: signOut, isSuccess } = useSignOutAccount();

  useEffect(() => {
    const fetchFriendDetails = async () => {
      try {
        const details = await Promise.all(
          currentUser.friends.map(async (friendId) => {
            const user = await getUserById(friendId);
            const result = user.friends.includes(currentUser?.$id);
            setIsFriends(result);
            return user; // Return user details for each friend
          })
        );
        setFriendDetails(details);
      } catch (error) {
        console.error('Error fetching friend details:', error);
      }
    };

    fetchFriendDetails();
  }, [currentUser?.friends, currentUser?.$id]);

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess])

  return (
    <>
      <button type="primary" className='flex gap-3 items-center text-left' onClick={() => setModal1Open(true)}>
        <img src={user.imageUrl || {profilePlaceholder}} alt='profile' className='h-10 md:h-14 w-10 md:w-14 rounded-full border-2 border-primary-500' />
        {nameDetails ? (
          <div className='flex flex-col'>
            <p className='body-bold'>
              {user.name}
            </p>
            <p className='small-regular text-light-3'>
              @{user.username}
            </p>
          </div>
        ) : ''}
        
      </button>
      <Modal
        title={
          <Button 
            icon={<EditOutlined />}
            onClick={() => setEdit(!edit)}
            className='shad-button_primary'
          >
            Edit Profile
          </Button>
        }
        centered
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        width={850}
        footer={
          <>
            <Button
            className='shad-button_primary w-1/4'
            onClick={() => setModal1Open(false)}
            >
              Close
            </Button>
            <Button type='ghost' className='bg-light-3 text-light-1 hover:bg-light-4' onClick={() => signOut()}>
              Log out
            </Button>
          </>
          
        }
      >
        <div className='bg-dark-3'>
          {!currentUser ? (
            <Loader />
          ) : (
            <>
              {edit ? (
                <UpdateUserForm currentUser={currentUser} />
              ) : (
                <div className='flex flex-col items-start p-2'>
                  <div className='flex items-center gap-3'>
                    <img src={currentUser.imageUrl || profilePlaceholder} alt='profile' className="w-16 h-16 lg:h-36 lg:w-36 rounded-full" />
                    <div className='flex flex-col gap-2'>
                      <h1 className="text-start xl:text-left text-light-2 h3-bold md:h1-semibold w-full">
                        {currentUser.name}
                      </h1>
                      <p className="small-regular md:body-medium text-light-3 text-left">
                        @{currentUser.username}
                      </p>
                      <p className='text-xs font-thin'>
                        Joined - <span className='text-small font-semibold'>{formatTimestamp(currentUser.$createdAt)}</span>
                      </p>
                      <div className='flex gap-4'>
                        <p onClick={() => setToggleDetails(true)} className={`text-light-3 ${toggleDetails ? 'underline underline-offset-3' : ''} hover:underline cursor-pointer`}>
                          <span className='text-primary-500'>
                            {currentUser?.posts?.length}
                          </span>
                          {currentUser?.friends?.length > 1 || currentUser?.friends?.length === 0 ? ' Posts' : ' Post'}
                          </p>
                        <p onClick={() => setToggleDetails(false)} className={`text-light-3 ${toggleDetails ? '' : 'underline underline-offset-3'} hover:underline cursor-pointer`}>
                          <span className='text-primary-500'>
                            {currentUser?.friends?.length}
                          </span>
                          {currentUser?.friends?.length > 1 || currentUser?.friends?.length === 0 ? ' Friends' : ' Friend'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <hr className='border w-full border-dark-4/80' />
                  {currentUser.bio ? (
                    <div className='px-4 my-8 text-light-2'>
                      <p className='text-2xl font-bold'>Bio</p>
                      <p>
                        {currentUser.bio}
                      </p>
                    </div>
                  ) : ''}
                </div>
              )}
              {!edit ? (
                <div className='px-4'>
                {toggleDetails ? (
                  <>
                    <p className='text-2xl font-bold pb-4'>Top Posts</p>
                    <div className='max-h-96 overflow-scroll custom-scrollbar overflow-x-hidden px-1'>
                      <GridPostList posts={currentUser?.posts} showUser={false} />
                    </div>
                  </>
                ) : (
                  <>
                    <p className='text-2xl font-bold pb-4'>Friends</p>
                    <ul className='grid grid-cols-2 max-h-96 overflow-scroll custom-scrollbar overflow-x-hidden px-1'>
                      {friendDetails.map((friend) => (
                        <li key={friend.id} className='flex flex-col gap-3 items-center hover:bg-dark-1 py-4 rounded-xl'>
                          <ProfileModal friend={friend} />
                          <p className='text-2xl font-bold'>{friend.name}</p>
                          <p className='text-light-3'>@{friend.username}</p>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
              ) : ''}
            </>
          )}
        </div>
      </Modal>
    </>
  )
}

export default UserProfileModal;