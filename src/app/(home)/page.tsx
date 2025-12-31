import React from 'react'
import { HeroSection } from './_components/hero-section'
import { auth } from '@clerk/nextjs/server'

const HomePage = async () => {

  // check if user is auth.
  const { isAuthenticated } = await auth()

  return (
    <div className="bg-background min-h-screen">
      <HeroSection isAuthenticated={isAuthenticated} />
    </div>
  )
}

export default HomePage