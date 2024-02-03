'use client'
import { saveUserWithPrisma } from '@/util/UserAction';
import { signIn, useSession } from 'next-auth/react';
import React from 'react'
import { useFormStatus } from 'react-dom';

const SignUpButton = () => {
    const { pending } = useFormStatus();
    if (pending) {
        return (
            <div className='border-8 border-red-400 border-t-green-300 rounded-3xl animate-spin h-10 w-10 self-center'></div>
        )
    }
    return (
        <button className='bg-gradient-to-t from-red-400 to-green-400 text-white font-bold py-2 px-4 rounded'>
            Sign Up
        </button>
    )
}
const SignInButton = () => {
    const { pending } = useFormStatus();
    const { data: session } = useSession();
    if (pending) {
        return (
            <div className='border-8 border-red-400 border-t-green-300 rounded-3xl animate-spin h-10 w-10 self-center'></div>
        )
    }
    return (
        <button disabled={session ? true : false} className={` text-white font-bold py-2 px-4 rounded  ${session ? 'bg-gray-300' : 'bg-gradient-to-t from-red-400 to-green-400'}`}>
            Sign In
        </button>
    )
}
const LeftPanel = () => {
    const [isLoginView, setIsLoginView] = React.useState(true);
    const { data: session } = useSession();
    const signUpUser = async (formData: FormData) => {
        console.log('signUpUser', formData);
        const data = await saveUserWithPrisma(formData);
        if (data) {
            alert('User Added Successfully');
        }
    }
    const signInUser = async (formData: FormData) => {
        await signIn('credentials', {
            redirect: true,
            email: formData.get('email'),
            password: formData.get('password')
        });
    }
    return (
        <div className='flex p-4 justify-center flex-col align-middle'>
            <span className='text-center mb-4 font-extrabold'>Please toggle the button to see the view</span>
            <div className='flex gap-5 justify-center mb-6'>
                <button onClick={() => setIsLoginView(true)} className={`border-solid border-2 font-bold py-2 px-4 rounded ${isLoginView && 'bg-blue-400 text-white'}`}>
                    Sign In
                </button>
                {session && session.user.role === 'admin' && <button onClick={() => setIsLoginView(false)} className={`border-solid border-2 font-bold py-2 px-4 rounded ${!isLoginView && 'bg-blue-400 text-white'}`} >
                    Sign Up
                </button>}
            </div>
            {
                isLoginView ? (
                    <div className='flex flex-col'>
                        <span className='text-center mb-5 font-bold'>
                            Login Form
                        </span>
                        <form className='flex flex-col gap-4' action={(formData) => signInUser(formData)}>
                            <input type='email' className='border  rounded-md p-2 focus-within:outline-green-400' name='email' placeholder='Email' />
                            <input type='password' className='border  rounded-md p-2 focus-within:outline-green-400' name='password' placeholder='Password' />
                            <SignInButton />
                        </form>
                    </div>
                ) : (
                    <div className='flex flex-col'>
                        <span className='text-center mb-5 font-bold'>
                            Fill your detail to add user
                        </span>
                        <form className='flex flex-col gap-4' action={(formData) => signUpUser(formData)}>
                            <input type='text' className='border  rounded-md p-2 focus-within:outline-green-400' name='username' placeholder='Username' />
                            <input type='password' className='border  rounded-md p-2 focus-within:outline-green-400' name='password' placeholder='Password' />
                            <input type='email' className='border  rounded-md p-2 focus-within:outline-green-400' name='email' placeholder='Email' />
                            <input type='text' className='border  rounded-md p-2 focus-within:outline-green-400' name='phoneNumber' placeholder='PhoneNo' />
                            <SignUpButton />
                        </form>
                    </div>
                )
            }
        </div >
    )
}

export default LeftPanel