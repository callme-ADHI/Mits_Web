import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { initSmoothScroll } from './ui/smoothScroll'
import Navbar from './ui/components/Navbar'
import Footer from './ui/components/Footer'
import FloatingContactButton from './ui/components/FloatingContactButton'
import Home from './pages/Home'
import Events from './pages/Events'
import Achievements from './pages/Achievements'
import About from './pages/About'
import Contact from './pages/Contact'

function ScrollToTop() {
  // Scroll to top on route change — Lenis handles this after mount
  useEffect(() => { window.scrollTo(0, 0) })
  return null
}

export default function App() {
  useEffect(() => {
    initSmoothScroll()
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"             element={<Home />}         />
          <Route path="/events"       element={<Events />}       />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/about"        element={<About />}        />
          <Route path="/contact"      element={<Contact />}      />
        </Routes>
      </main>
      <Footer />
      <FloatingContactButton />
    </BrowserRouter>
  )
}
