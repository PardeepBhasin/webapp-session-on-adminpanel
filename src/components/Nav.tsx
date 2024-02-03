'use client'
import React from 'react';
import { useSession, signOut } from 'next-auth/react';

const Nav = () => {
    const { data: session } = useSession();
    console.log('session++++++++++++', session);
    return (
        <div className='flex bg-gradient-to-t from-red-400 to-green-400 p-5 text-white justify-between font-bold'>
            <h1>Inventory System</h1>
            {session ? <span className='cursor-pointer' onClick={() => signOut()}>Sign Out</span> : <span>Please sign in to access the services.</span>}
        </div>
    )
}

export default Nav