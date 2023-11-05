import React, { useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import logo from '../../../public/assets/icons/newlogo.svg'
import logout from '../../../public/assets/icons/logout.svg';
import { useSignOutAccount } from '../../lib/react-query/queriesAndmutations';
import { useUserContext } from '../../context/AuthContext'
import { sidebarLinks } from '../../constants';
import UserProfileModal from '../modals/UserProfileModal';
import Notification from './Notification';

const LeftSidebar = () => {
  const { pathname } = useLocation();

  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate('/sign-in');
  }, [isSuccess])
  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to='/' className='flex gap-3 items-center'>
          <img src={logo} alt='logo' width={54} height={54} />
          <h1 className='h3-bold lg:h1-bold'>Connectify</h1>
        </Link>
        <UserProfileModal />
        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.route;
            return (
              <li 
                key={link.label} 
                className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}
              >
                <NavLink to={link.route} className='flex gap-4 items-center p-4'>
                  <img 
                    src={link.imgURL} 
                    alt={link.label} 
                    className={`group-hover:invert-white ${isActive && 'invert-white'}`} 
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
          <Notification />
        </ul>
      </div>
      {/* button from ui library ghost variant */}
      <button className='flex items-center gap-6' onClick={() => signOut()}>
        <img src={logout} alt='logout' />
        <p className='small-medium lg:base-medium'>Logout</p>
      </button>
    </nav>
  )
}

export default LeftSidebar