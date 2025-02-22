import Header from '@/app/_components/Header'
import React from 'react'
import Container from '../_components/Container'
import Orders from './_components/Orders'
import { Metadata } from 'next'


export const metadata:Metadata = {
  title: "Minhas compras"
}

const Conta = () => {
  return (
    <>
      <Header/>
      <Container>
        <Orders/>
      </Container>
    </>
  )
}

export default Conta
