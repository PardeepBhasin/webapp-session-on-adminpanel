'use client'
import { fetchUsers } from '@/util/UserAction';
import userStore from '@/util/store';
import React, { useEffect, useState } from 'react'
import UserComponent from './UserComponent';
import { useSession } from 'next-auth/react';

const UserInfo = () => {
  const setUserDetails = userStore((state) => state.setUserDetails);
  const userDetails = userStore((state) => state.userDetails);
  const [loader, setLoader] = useState(false);
  const { data: session } = useSession();
  useEffect(() => {
    const getUsers = async () => {
      setLoader(true);
      const role = session?.user.role || '';
      const email = session?.user.email || '';
      const userDetails = await fetchUsers(role, email);
      const { data } = userDetails;
      console.log("data", data)
      setUserDetails(data);
      setLoader(false);
    };
    if (session) {
      getUsers();
    }
  }, [session]);

  if (loader) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <div className='border-8 border-red-400 border-t-green-300 animate-spin h-20 w-20 '></div>
      </div>
    )
  }

  return (
    <>
      {
        session ? <div className='flex gap-2 p-4'>
          {
            userDetails && userDetails.map((user: any) => {
              return (
                <UserComponent user={user} />
              )
            })
          }
        </div> : (
          <div className='font-bold text-white text-center p-4'>
            Please sign in to view the user profiles.
          </div>
        )
      }
    </>
  )
}

export default UserInfo