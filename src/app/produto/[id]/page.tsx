import Header from '@/app/_components/Header'
import type { Product } from '@/types/Product'
import React from 'react'
import SingleProduct from './_components/SingleProduct'
import { Metadata } from 'next'
import Footer from '@/app/_components/Footer'
export async function generateMetadata({params}: {params: Promise<{id:string}>}):Promise<Metadata>{
    const {id} = await  params
    const product = await (await (fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/products/${id}`))).json() as Product
    return {
        title: product.name,
        description: product.description,
    }
}

const Product = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params
    const product = await (await (fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/products/${id}`))).json() as Product
    return (
        <>
            <Header />
            <main className='mt-[1rem] lg:mt-[4rem] container-width mb-[8vh]'>
                <SingleProduct {...product}/>
            </main>
            <Footer/>
        </>
    )
}

export default Product
