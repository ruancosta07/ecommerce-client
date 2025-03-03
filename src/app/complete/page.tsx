import React from 'react'
import Success from './_components/Success'
import DayJs from '@/utils/Dayjs';
import { redirect } from 'next/navigation';
interface Order {
  total:number;
  products: Array<{id:string;name:string;images:string;price:number;quantity:number }>;
  created:number
  expiresAt:number;
}


export const metadata = {
  title: "Compra concluída"
}

const Complete = async({searchParams}: {searchParams: Promise<{session_id: string}>}) => {
  const {session_id} = await searchParams
  const order = await fetch(`${process.env.NEXT_PUBLIC_API_PROD_URL}/orders/successfull/${session_id}`)
  const result = await order.json() as Order
  const timestampToDate = result.expiresAt * 1000
  const expiresDate = DayJs(timestampToDate).subtract(23, "hour")
  
  if(DayJs().isAfter(expiresDate)){
    redirect("/")
  }
  return (
    <>
      <Success order={result}/>
      {/* <Progress/> */}
    </>
  )
}

export default Complete
