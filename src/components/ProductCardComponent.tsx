'use client'
import { updateProductStatus } from '@/util/UserAction';
import Image from 'next/image'
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const ProductSelector = ({ item }: any) => {
    const { data: session } = useSession();
    const [checked, setChecked] = React.useState(false);
    useEffect(() => {
        setChecked(item.status === 'approved');
    }, [])
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
        const data = await updateProductStatus(item.id, 'approved');
        if (data) {
            alert('Status Updated Successfully');
        }
    }
    return (
        <input type='checkbox' disabled={session?.user.role === 'editor' || session?.user.role === 'admin'} name={item.name} checked={checked} onChange={(e) => handleChange(e)} />
    )
}
function ProductCardComponent({ item }: {
    item: any
}) {
    return (
        <div className="bg-gradient-to-r from-red-500 to-green-500 p-6 rounded-lg shadow-md">
            <ProductSelector item={item} />
            <div className="relative">
                <Image src={item.image} width={300} height={200} alt="Product Image" className="w-full h-64 rounded-lg" />
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-semibold text-white">{item.name}</h3>
                <p className="text-gray-200 mt-2">{item.description}</p>
            </div>
        </div>
    )
}

export default ProductCardComponent