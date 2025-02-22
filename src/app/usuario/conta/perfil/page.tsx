import Header from '@/app/_components/Header'
import React from 'react'
import Container from '../_components/Container'
import Profile from '../_components/Profile'
import { Metadata } from 'next'

export const metadata:Metadata = {
  title: "Perfil"
}

const Conta = () => {
  return (
    <>
      <Header/>
      <Container>
        <Profile/>
      </Container>
    </>
  )
}

export default Conta
