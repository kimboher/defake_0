import { useState } from 'react'

interface Claim {
  id: string
  claimantName: string
  incidentType: string
  location: string
  description: string
  submittedAt: string
  status: 'pending' | 'under_review' | 'approved' | 'denied'
  proofId: string
  merkleRoot: string
  txHash: string
  fileCount: number
  isDuplicate: boolean
  riskScore: number
  anomalies: string[]
}

const mockClaims: Claim[] = [
  {
    id: 'CLM-001',
    claimantName: 'John Smith',
    incidentType: 'Auto Accident',
    location: '123 Main St, San Francisco, CA',
    description: 'Rear-ended at intersection during rush hour traffic',
    submittedAt: '2024-01-15T10:30:00Z',
    status: 'under_review',
    proofId: 'proof_1705312200123',
    merkleRoot: '0xa1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    txHash: '0x9876543210fedcba0987654321fedcba09876543210fedcba0987654321fedcba',
    fileCount: 4,
    isDuplicate: false,
    riskScore: 15,
    anomalies: ['Timestamp inconsistency in metadata']
  },
  {
    id: 'CLM-002',
    claimantName: 'Sarah Johnson',
    incidentType: 'Property Damage',
    location: '456 Oak Ave, Los Angeles, CA',
    description: 'Water damage from burst pipe in kitchen',
    submittedAt: '2024-01-14T14:22:00Z',
    status: 'pending',
    proofId: 'proof_1705225320456',
    merkleRoot: '0xb2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567',
    txHash: '0x8765432109edcba09876543210edcba098765432109edcba09876543210edcba0',
    fileCount: 6,
    isDuplicate: true,
    riskScore: 85,
    anomalies: ['Duplicate image detected', 'Suspicious editing patterns', 'Metadata tampering']
  },
  {
    id: 'CLM-003',
    claimantName: 'Mike Chen',
    incidentType: 'Theft',
    location: '789 Pine St, Seattle, WA',
    description: 'Laptop stolen from coffee shop',
    submittedAt: '2024-01-13T09:15:00Z',
    status: 'approved',
    proofId: 'proof_1705138500789',
    merkleRoot: '0xc3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
    txHash: '0x765432108dcba09876543210dcba0987654321087654321087654321087654321',
    fileCount: 3,
    isDuplicate: false,
    riskScore: 5,
    anomalies: []
  }
]

export default function AdjusterView() {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredClaims = mockClaims.filter(claim => 
    filterStatus === 'all' || claim.status === filterStatus
  )

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-600 bg-green-100'
    if (score < 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-blue-600 bg-blue-100'
      case 'under_review': return 'text-yellow-600 bg-yellow-100'
      case 'approved': return 'text-green-600 bg-green-100'
      case 'denied': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Adjuster Dashboard</h1>
              <p className="mt-1 text-sm text-gray-600">
                Review claims with blockchain-anchored evidence and integrity checks
              </p>
            </div>
            <div className="flex space-x-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Claims</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!selectedClaim ? (
            <div>
              <div className="grid grid-cols-1 gap-4">
                {filteredClaims.map((claim) => (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim)}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{claim.id}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                            {claim.status.replace('_', ' ').toUpperCase()}
                          </span>
                          {claim.isDuplicate && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                              DUPLICATE
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>{claim.claimantName}</strong> • {claim.incidentType}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">{claim.location}</p>
                        <p className="text-sm text-gray-700">{claim.description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium mb-2 ${getRiskColor(claim.riskScore)}`}>
                          Risk: {claim.riskScore}%
                        </div>
                        <p className="text-xs text-gray-500">
                          {claim.fileCount} files
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(claim.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {claim.anomalies.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-red-600 font-medium">
                          ⚠️ {claim.anomalies.length} anomal{claim.anomalies.length === 1 ? 'y' : 'ies'} detected
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setSelectedClaim(null)}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to Claims List
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Claim Details</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Claim ID</label>
                      <p className="text-sm text-gray-900">{selectedClaim.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Claimant</label>
                      <p className="text-sm text-gray-900">{selectedClaim.claimantName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Incident Type</label>
                      <p className="text-sm text-gray-900">{selectedClaim.incidentType}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <p className="text-sm text-gray-900">{selectedClaim.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="text-sm text-gray-900">{selectedClaim.description}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Submitted</label>
                      <p className="text-sm text-gray-900">{new Date(selectedClaim.submittedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Blockchain Proof</h2>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Proof ID</label>
                      <p className="text-xs font-mono text-gray-900 break-all">{selectedClaim.proofId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Merkle Root</label>
                      <p className="text-xs font-mono text-gray-900 break-all">{selectedClaim.merkleRoot}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NEAR Transaction</label>
                      <a
                        href={`https://testnet.nearblocks.io/txns/${selectedClaim.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono text-blue-600 hover:text-blue-800 break-all"
                      >
                        {selectedClaim.txHash}
                      </a>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Files Anchored</label>
                      <p className="text-sm text-gray-900">{selectedClaim.fileCount} files</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Risk Assessment</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className={`p-4 rounded-lg ${getRiskColor(selectedClaim.riskScore)}`}>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Risk Score</span>
                        <span className="text-2xl font-bold">{selectedClaim.riskScore}%</span>
                      </div>
                      <div className="mt-2 text-sm">
                        {selectedClaim.riskScore < 30 && 'Low risk - evidence appears authentic'}
                        {selectedClaim.riskScore >= 30 && selectedClaim.riskScore < 70 && 'Medium risk - requires review'}
                        {selectedClaim.riskScore >= 70 && 'High risk - potential fraud detected'}
                      </div>
                    </div>
                  </div>

                  <div>
                    {selectedClaim.isDuplicate && (
                      <div className="p-4 rounded-lg bg-red-100 text-red-800">
                        <div className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="font-medium">Duplicate Claim Detected</span>
                        </div>
                        <p className="text-sm mt-1">
                          Similar evidence found in previous claims
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedClaim.anomalies.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Detected Anomalies</h3>
                    <div className="space-y-2">
                      {selectedClaim.anomalies.map((anomaly, index) => (
                        <div key={index} className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <svg className="h-5 w-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-yellow-800">{anomaly}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex space-x-4">
                <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Approve Claim
                </button>
                <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                  Deny Claim
                </button>
                <button className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                  Request More Info
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
