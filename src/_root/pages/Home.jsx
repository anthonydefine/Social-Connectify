import React, { useState, useEffect } from 'react'
import Loader from '../../components/shared/Loader';
import { useGetRecentPosts, useGetUserById } from '../../lib/react-query/queriesAndmutations';
import PostCard from '../../components/shared/PostCard';
import { useUserContext } from '../../context/AuthContext';
import { formatTimestamp } from '../../constants';
import portfolio from '../../../public/assets/images/portfolio.png';
import { GithubOutlined, LinkedinOutlined, MailOutlined, RocketOutlined } from '@ant-design/icons';
import { Tag, Switch } from 'antd';
import UserProfileModal from '../../components/modals/UserProfileModal';
import creatorheadshot from '../../../public/assets/images/headshot.jpeg';
import { getUserById } from '../../lib/appwrite/api';
import ProfileModal from '../../components/modals/ProfileModal';

const Home = () => {
  const [friendDetails, setFriendDetails] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const { user } = useUserContext();
  const { data: currentUser } = useGetUserById(user.id || "");

  const { data: posts, isPending: isPostLoading, isError: isErrorPosts} = useGetRecentPosts();

  useEffect(() => {
    const fetchFriendDetails = async () => {
      try {
        const details = [];
        for (const friendId of currentUser?.friends || []) {
          const user = await getUserById(friendId);
          details.push(user);
        }
        setFriendDetails(details);
      } catch (error) {
        console.error('Error fetching friend details:', error);
      }
    };
    fetchFriendDetails();
  }, [currentUser?.friends, currentUser?.$id]);

  const handleSwitch = () => {
    setIsChecked(!isChecked);
  }

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
          <div className='w-full flex justify-between items-center'>
            <h2 className='h3-bold md:h2-bold text-left w-full'>Home Feed</h2>
            <div className='flex items-center gap-2'>
              <p className='text-sm lg:text-base'>Friends</p>
              <Switch
                checked={isChecked}
                onChange={handleSwitch}
                className=''
              />
              <p className='whitespace-nowrap text-sm lg:text-base'>All Posts</p>
            </div>
          </div>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className='flex flex-col flex-1 gap-9 w-full'>
              {posts?.documents.map((post) => {
                const isCurrentUserPost = post?.creator?.$id === currentUser?.$id;
                const isFriendPost = currentUser?.friends?.includes(post?.creator?.$id);
                if (!isChecked && (isCurrentUserPost || isFriendPost)) {
                  // Render current user's posts and their friends' posts when switch is unchecked
                  return (
                    <li key={post?.$id}>
                      <PostCard post={post} />
                    </li>
                  );
                } else if (isChecked) {
                  // Render all posts when switch is checked
                  return (
                    <li key={post?.$id}>
                      <PostCard post={post} />
                    </li>
                  );
                }
                return null; // Do not render post if it doesn't meet the criteria
              })}
            </ul>
          )}
        </div>
      </div>
      <div className='home-creators'>
          <div className='post-card flex flex-col items-start gap-4'>
            <UserProfileModal />
            <div className='flex gap-4'>
              <p className='text-light-3'>
                <span className='text-primary-500'>
                  {currentUser?.posts?.length}
                </span>
                {currentUser?.posts?.length > 1 ? ' Posts' : ' Post'}
              </p>
              <p className='text-light-3'>
                <span className='text-primary-500'>
                  {currentUser?.friends?.length}
                </span>
                {currentUser?.friends?.length > 1 || currentUser?.friends?.length === 0 ? ' Friends' : ' Friend'}
              </p>
            </div>
            <div>
              <p className='font-bold'>Bio</p>
              <p className='small-medium text-light-3'>
                {user.bio || 'Let users know more about you'}
              </p>
              <p className='text-xs xl:text-sm mt-4 font-thin'>
                Joined <span className='font-semibold'>{formatTimestamp(currentUser?.$createdAt)}</span>
              </p>
            </div>
          </div>
          <div className='post-card'>
            <h2 className='text-center text-2xl tracking-wider font-bold pb-2'>Friend List</h2>
            <ul className='grid grid-cols-2 max-h-56 overflow-scroll custom-scrollbar overflow-x-hidden px-1'>
              {friendDetails.map((friend) => (
                <li key={friend?.$id} className='flex flex-col gap-3 items-center hover:bg-dark-1 p-2 rounded-xl'>
                  <ProfileModal friend={friend} />
                  <p className='text-lg font-bold'>{friend.name}</p>
                  <p className='text-light-3'>@{friend.username}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className='post-card'>
            <div className='flex items-start gap-3'>
              <img src={creatorheadshot} alt='profile' className="w-12 h-12 rounded-full" />
              <div className='flex flex-col gap-1'>
                <h1 className="text-light-2 text-xl font-bold w-full">
                  Anthony Define
                </h1>
                <p className="md:small-medium text-light-3 text-left">
                  @anthonydefine
                </p>
              </div>
            </div>
            <div className='my-3'>
              <p className='text-light-2 text-sm'>Check out my developer portfolio below!</p>
              <a href='https://anthonydefine.github.io/My-Portfolio/' target='blank'>
                <img className='object-cover rounded-3xl py-3' src={portfolio} />
              </a>
            </div>
            <div className='flex justify-evenly mt-3'>
              <a href='https://github.com/anthonydefine' target='blank'>
                <Tag color='cyan' icon={<GithubOutlined />}>Github</Tag>
              </a>
              <a href='https://anthonydefine.github.io/My-Portfolio/' target='blank'>
                <Tag color='purple' icon={<RocketOutlined />}>Portfolio</Tag>
              </a>
              <a href='https://www.linkedin.com/in/anthony-define/' target='blank'>
                <Tag color='processing' icon={<LinkedinOutlined />}>LinkedIn</Tag>
              </a>
              <a href='mailto:defineworkspace00@gmail.com.com'>
                <Tag color='magenta' icon={<MailOutlined />}>Email</Tag>
              </a>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Home