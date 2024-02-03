
import Products from '@/components/Products';
import { getProducts } from '@/util/UserAction';
import React from 'react'

const fetchProducts = async () => {
    const productData = await getProducts();
    return productData;
}
const Dashboard = async () => {
    const data = await fetchProducts();
    return (
        <Products data={data} />
    )
}

export default Dashboard