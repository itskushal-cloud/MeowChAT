import { useState } from 'react'

import Navbar from '../component/Navbar'
import Hero from '../component/Hero'
import ValueStrip from '../component/ValueStrip'
import SupportOptions from '../component/SupportOptions'
import HowItWorks from '../component/HowItWorks'
import OurApproach from '../component/OurApproach'
import CommunityPreview from '../component/CommunityPreview'
import ResourcesPreview from '../component/ResourcesPreview'
import FinalCTA from '../component/FinalCTA'
import Footer from '../component/Footer'
import DemoModal from '../component/DemoModal'

// The public landing page (what App.jsx used to render)
function HomePage() {
  // Empty string = modal closed. Any text = modal open with that title.
  const [demoTitle, setDemoTitle] = useState('')
  const closeDemo = () => setDemoTitle('')

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ValueStrip />
        <SupportOptions onDemo={setDemoTitle} />
        <HowItWorks />
        <OurApproach />
        <CommunityPreview onDemo={setDemoTitle} />
        <ResourcesPreview onDemo={setDemoTitle} />
        <FinalCTA />
      </main>
      <Footer onDemo={setDemoTitle} />
      <DemoModal title={demoTitle} onClose={closeDemo} />
    </>
  )
}

export default HomePage
