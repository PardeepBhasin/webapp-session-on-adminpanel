'use client'
import { addProduct } from '@/util/UserAction';
import React from 'react'
import { useFormStatus } from 'react-dom';
import ProductCardComponent from './ProductCardComponent';
import { useSession } from 'next-auth/react';

const AddNewProductButton = () => {
    const { data: session } = useSession();
    const { pending } = useFormStatus();
    const isEditor = session?.user.role === 'editor';
    if (pending) {
        return (
            <div className='border-8 border-red-400 border-t-green-300 rounded-3xl animate-spin h-10 w-10 self-center'></div>
        )
    }
    return (
        <button disabled={!isEditor} className={`text-white font-bold py-2 px-4 rounded ${isEditor ? 'bg-gradient-to-t from-red-400 to-green-400' : 'bg-gray-300'}`}>
            Add New Product
        </button>
    )
}
const Products = ({ data }: { data: any }) => {
    const addNewProduct = async (formData: FormData) => {
        const data = await addProduct(formData);
        if (data) {
            alert('Product Added Successfully');
        }
    }
    return (
        <div className="grid grid-flow-col h-screen">
            <div className=" col-span-1 p-4">
                <div className='flex flex-col'>
                    <span className='text-center mb-5 font-bold'>
                        Add New Product
                    </span>
                    <form className='flex flex-col gap-4' action={(formData: FormData) => addNewProduct(formData)}>
                        <input type='text' className='border  rounded-md p-2 focus-within:outline-green-400' name='name' placeholder='Product Name' />
                        <input type='text' className='border  rounded-md p-2 focus-within:outline-green-400' name='description' placeholder='Product Description' />
                        <input type='text' className='border  rounded-md p-2 focus-within:outline-green-400' name='price' placeholder='Product Price' />
                        <AddNewProductButton />
                    </form>
                </div>
            </div>
            <div className="col-span-4  bg-green-400">
                <div className='grid grid-cols-5 gap-2 p-4'>
                    {
                        data && data.map((item: any) => {
                            return <ProductCardComponent key={Math.random()} item={item} />
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Products;