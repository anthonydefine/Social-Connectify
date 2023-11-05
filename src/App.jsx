import { Route, Routes } from 'react-router-dom';
import './globals.css';
import React from 'react'
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import { CreatePost, Explore, Home, PostDetails, Saved, UpdateProfile } from './_root/pages';

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path='/sign-up' element={<SignupForm />} />
          <Route path='/sign-in' element={<SigninForm />} />
        </Route>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path='/explore' element={<Explore />} />
          <Route path='/saved' element={<Saved />} />
          <Route path='/create-post' element={<CreatePost />} />
          <Route path='/posts/:id' element={<PostDetails />} />
          <Route path='/update-profile/:id' element={<UpdateProfile />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App