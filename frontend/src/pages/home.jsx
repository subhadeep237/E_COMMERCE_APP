import React from 'react'
import LatestCollection from '../components/LatestCollection'
import BestSeller from '../components/BestSeller'
import OurPolicy from '../components/OurPolicy'
import NewsLetterBox from '../components/NewsLetterBox'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
const home = () => {
  return (
    <div>
      <Hero  />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
      <NewsLetterBox />
      <Footer />
    </div>
  )
}

export default home
