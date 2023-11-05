import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../../public/assets/icons/newlogo.svg';
import { useSignOutAccount } from '../../lib/react-query/queriesAndmutations';
import { useUserContext } from '../../context/AuthContext'
import notifications from '../../../public/assets/icons/chat.svg';
import UserProfileModal from '../modals/UserProfileModal';

const Topbar = () => {

  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess])

  return (
    <section className='topbar'>
      <div className='flex-between py-4 px-5'>
        <Link to='/' className='flex gap-3 items-center'>
          <img src={logo} alt='logo' width={54} height={54} />
          <h1 className='h3-bold lg:h1-bold'>Connectify</h1>
        </Link>
        <div className='flex gap-4'>
          <img src={notifications} alt='notifications' />
          <UserProfileModal nameDetails={false} />
        </div>
      </div>
    </section>
  )
}

export default Topbar