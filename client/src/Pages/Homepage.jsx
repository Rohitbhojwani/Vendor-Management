import React from 'react'
import { Navbar, Welcome, Footer, Services, Transactions } from "../components";

const Homepage = () => {
  return (
    <div className="min-h-screen">
   <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
    </div>
    <Services />
    <Footer />
    </div>
  )
}

export default Homepage