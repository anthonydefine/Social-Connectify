import React from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const Loader = () => {
  return (
    <div className='flex flex-col gap-2'>
      <h2 className='text-light-3'>Hold on one moment...</h2>
      <Spin className='text-light-2' indicator={antIcon} />
    </div>
  )
}

export default Loader