import React, { useState } from 'react'
import { Popover } from 'antd'
import notification from '../../../public/assets/icons/chat.svg';
import { useGetCurrentUser } from '../../lib/react-query/queriesAndmutations';

const Notification = () => {
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const handlePopoverVisibleChange = (visible) => {
    setIsPopoverVisible(visible);
  };

  const { data: currentUser } = useGetCurrentUser()

  const title = <span>Notifications</span>
  const content = (
    <>
      <p>0 Notifications currently</p>
    </>
  )

  return (
    <li className={`leftsidebar-link group hover:bg-primary-500 ${isPopoverVisible ? 'bg-primary-500' : ''}`}>
      <Popover 
        placement='right' 
        title={title} 
        content={content}
        className='flex gap-4 items-center p-4'
        visible={isPopoverVisible}
        onVisibleChange={handlePopoverVisibleChange}
      >
        <img 
        src={notification} 
        alt='notification' 
        className={`'group-hover:invert-white' ${isPopoverVisible ? 'invert-white' : ''}`} />
        Notifications
      </Popover>
    </li>
  )
}

export default Notification