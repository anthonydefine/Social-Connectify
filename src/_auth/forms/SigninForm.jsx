import React, { useState } from 'react'
import Loader from '../../components/shared/Loader';
import * as Form from '@radix-ui/react-form';
import logo from '../../../public/assets/icons/newlogo.svg'
import { Link, useNavigate } from 'react-router-dom';
import { useSignInAccount } from '../../lib/react-query/queriesAndmutations';
import { useUserContext } from '../../context/AuthContext';
import { Button } from 'antd';

const SigninForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const { checkAuthUser, isPending: isUserLoading } = useUserContext();

  const { mutateAsync: signInAccount } = useSignInAccount();

  const onSubmit = async (e) => {
    e.preventDefault();
    const session = await signInAccount({
      email: email,
      password: password
    })
    if(!session) {
      return;
      //toast here - sign in failed please try in again
    }
    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn) {
      setEmail('');
      setPassword('');
      navigate('/')
    } else {
      return;
      // toast here - sign up failed please try again
    }};

  return (
    <>
    <div className='sm:w-420 flex-center flex-col'>
      <span className='flex items-center gap-3'>
        <img src={logo} alt='logo' width={54} height={54} />
        <h1 className='h2-bold lg:h1-bold'>Connectify</h1>
      </span>
      <h2 className='h3-bold md:h2-bold pt-5 sm:pt-6'>Log in to your account</h2>
      <p className='text-light-3 small-medium md:base-regular my-4'>Welcome back, please enter log in details.</p>
      <Form.Root onSubmit={onSubmit} className='w-5/6 flex flex-col gap-2'>
        <Form.Field>
          <Form.Label className='text-white'>Email</Form.Label>
          <Form.Control asChild>
            <input 
            className='bg-slate-800 w-full py-1 pl-1 text-light-3 rounded-lg' 
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required />
          </Form.Control>
        </Form.Field>
        <Form.Field>
          <Form.Label className='text-white'>Password</Form.Label>
          <Form.Control asChild>
            <input 
            className='bg-slate-800 w-full py-1 pl-1 text-light-3 rounded-lg' 
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <Button htmlType='submit' size='large' className='shad-button_primary my-4 rounded-xl'>
            {isUserLoading ? (
              <div className='flex-center gap-2'>
                <Loader /> Loading...
              </div>
            ) : 'Sign in'}
          </Button>
          
        </Form.Submit>
      </Form.Root>
      <p className='text-small-regular text-light-2 text-center mt-2'>
        Don't have an account?
        <Link to='/sign-up' className='text-primary-500 text-small-semibold ml-1'> Sign up</Link>
      </p>
    </div>
      
    </>
  )
}

export default SigninForm