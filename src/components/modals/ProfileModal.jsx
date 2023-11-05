import React, { useState, useEffect } from 'react'
import { Modal, Button, message, Tabs } from 'antd'
import profilePlaceholder from '../../../public/assets/icons/profile-placeholder.svg';
import { formatTimestamp } from '../../constants';
import { UserAddOutlined, EditOutlined, CheckOutlined } from '@ant-design/icons';
import GridPostList from '../shared/GridPostList';
import { useGetUserById } from '../../lib/react-query/queriesAndmutations';
import Loader from '../shared/Loader';
import { useUserContext } from '../../context/AuthContext';
import { followFriend, getUserById } from '../../lib/appwrite/api';


const ProfileModal = ({ post, friend }) => {
  const [modal1Open, setModal1Open] = useState(false);
  const [friendDetails, setFriendDetails] = useState([]);
  const [isFriends, setIsFriends] = useState(false);
  const [toggleDetails, setToggleDetails] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const { user } = useUserContext();

  const items = [
    {
      key: '1',
      label: 'Posts',
    }
  ]

  const userIdToDisplay = friend ? friend?.$id : post?.creator?.$id;
  const { data: currentUser } = useGetUserById(userIdToDisplay);

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

  const alreadyFriends = () => {
    messageApi.open({
      type: 'success',
      content: `You are already friends with ${currentUser.name}!`
    });
  };

    const handleFriendRequest = async () => {
      try {
        await followFriend(user?.id, currentUser?.$id);
        messageApi.open({
          type: 'success',
          content: `You have added ${currentUser.name} as a friend!`
        });
      } catch (error) {
        messageApi.open({
          type: 'error',
          content: `There was a problem adding ${currentUser.name} as a friend!`
        });
        console.error('Error sending friend request:', error);
      }
    };

  return (
    <>
      {contextHolder}
        <button type="primary" onClick={() => setModal1Open(true)}>
          <img src={currentUser?.imageUrl || profilePlaceholder} alt='creator' className='rounded-full w-12 h-12 lg:h-16 lg:w-16' />
        </button>
      <Modal
        title="Full profile"
        centered
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        width={850}
        footer={!isFriends ? (
          <Button
            icon={<UserAddOutlined />}
            className='shad-button_primary'
            onClick={handleFriendRequest}
          >
            Add Friend
          </Button>
        ) : (
          <Button icon={<CheckOutlined />} className='shad-button_primary' onClick={alreadyFriends}>
            Friends
          </Button>
        )}
      >
        <div className=''>
          <div className='flex justify-between items-start p-2 mb-8'>
            <div className='flex items-center gap-3'>
              <img src={currentUser?.imageUrl || profilePlaceholder} alt='profile' className="w-28 h-28 lg:h-36 lg:w-36 rounded-full" />
              <div className='flex flex-col gap-2'>
                <h1 className="text-start xl:text-left text-light-2 h3-bold md:h1-semibold w-full">
                  {currentUser?.name}
                </h1>
                <p className="small-regular md:body-medium text-light-3 text-left">
                  @{currentUser?.username}
                </p>
                <p className='text-xs font-thin'>
                  Joined - <span className='text-base font-semibold'>{formatTimestamp(currentUser?.$createdAt)}</span>
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
            {user?.id === currentUser?.$id ? (
              <Button 
              icon={<EditOutlined />}
              className='shad-button_primary'
            >
              Edit
            </Button>
            ) : ''}
          </div>
          <hr className='border w-full border-dark-4/80' />
          {currentUser?.bio ? (
            <div className='my-8 text-light-2'>
              <p className='text-2xl font-bold'>Bio</p>
              <p>
                {currentUser?.bio}
              </p>
            </div>
            ) : ''}
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
        </div>
      </Modal>
    </>
  )
}

export default ProfileModal