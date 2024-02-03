import { saveUserRole } from '@/util/UserAction'
import { UserObj } from '@/util/store'
import Link from 'next/link'
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const UserComponent = ({
    user
}: {
    user: UserObj
}) => {
    const { data: session } = useSession();
    const [selectedRole, setSelectedRole] = useState<string | undefined>();
    const handleUserRole = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const userRole = e.target.value;
        setSelectedRole(userRole);
        const data = await saveUserRole(userRole, user.email);
        if (data) {
            alert("user role sucessfully saved");
        }
    }
    useEffect(() => {
        if (user && user.role) {
            setSelectedRole(user.role.name);
        }
    }, []);
    return (
        <div className='flex flex-col bg-white font-bold flex-wrap '>
            <Link href='/dashboard'>
                <div className='border-solid border-b-2 p-4 underline'>Go to Dashboard</div>
            </Link>
            <div className='p-4'>
                <div>Name: {user.username}</div>
                <div> Email: {user.email}</div>
            </div>
            <div className='flex flex-col p-4'>
                <span>Role:</span>
                {
                    (user.email === session?.user?.email && session?.user?.role === 'admin') ? <span className='text-red-500'>No one can change admin role</span> : (
                        <div className='gap-2'>
                            <label>Editor </label>
                            <input className='mr-2' disabled={session?.user?.role !== 'admin'} type='radio' name={`role-${user.email}`} checked={selectedRole === 'editor'} value='editor' onChange={(e) => handleUserRole(e)} />
                            <label>Reviewer </label>
                            <input className='mr-2' disabled={session?.user?.role !== 'admin'} type='radio' name={`role-${user.email}`} checked={selectedRole === 'reviewer'} value='reviewer' onChange={(e) => handleUserRole(e)} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default UserComponent