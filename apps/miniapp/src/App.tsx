import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ClaimSubmission from './components/ClaimSubmission'
import PublicVerifier from './components/PublicVerifier'
import AdjusterView from './components/AdjusterView'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-xl font-bold text-blue-400">
                  Defake
                </Link>
                <span className="ml-2 text-sm text-gray-400">
                  Agentic Media Integrity
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Submit Claim
                </Link>
                <Link 
                  to="/verify" 
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Verify Proof
                </Link>
                <Link 
                  to="/adjuster" 
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Adjuster View
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<ClaimSubmission />} />
            <Route path="/verify" element={<PublicVerifier />} />
            <Route path="/adjuster" element={<AdjusterView />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App