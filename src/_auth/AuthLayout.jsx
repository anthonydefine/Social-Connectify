import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import backgroundImg from '../../public/assets/images/background-splash.png';

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to='/' />
      ) : (
        <>
          <section className='flex flex-1 justify-center items-center flex-col py-10'>
            <Outlet />
          </section>
          <img 
            className='hidden xl:block h-screen w-1/2 object-cover bg-no-repeat' 
            alt='logo'
            src={backgroundImg} />
        </>
      )}
    </>
  )
}

export default AuthLayout