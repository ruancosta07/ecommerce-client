import React, { Suspense } from 'react'
import Login from './_components/Login'

const page = () => {
  return (
    <>
      <Suspense>
      <Login/>
      </Suspense>
    </>
  )
}

export default page
