import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import DFICChat from './DFICChat'
import FileUploader from './FileUploader'
import ProofReceipt from './ProofReceipt'

interface ClaimData {
  incidentType: string
  location: string
  description: string
  files: File[]
}

interface ProofReceiptData {
  proofId: string
  merkleRoot: string
  txHash: string
  timestamp: string
}

export default function ClaimSubmission() {
  const [step, setStep] = useState<'chat' | 'upload' | 'processing' | 'receipt'>('chat')
  const [claimData, setClaimData] = useState<ClaimData>({
    incidentType: '',
    location: '',
    description: '',
    files: []
  })
  const [receipt, setReceipt] = useState<ProofReceiptData | null>(null)

  const handleChatComplete = (data: Partial<ClaimData>) => {
    setClaimData(prev => ({ ...prev, ...data }))
    setStep('upload')
  }

  const handleFilesUploaded = (files: File[]) => {
    setClaimData(prev => ({ ...prev, files }))
    setStep('processing')
    
    // Simulate processing
    setTimeout(() => {
      // Mock receipt data - replace with actual NEAR contract call
      setReceipt({
        proofId: `proof_${Date.now()}`,
        merkleRoot: '0x' + Math.random().toString(16).substr(2, 64),
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        timestamp: new Date().toISOString()
      })
      setStep('receipt')
    }, 3000)
  }

  const handleStartOver = () => {
    setStep('chat')
    setClaimData({ incidentType: '', location: '', description: '', files: [] })
    setReceipt(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">Submit Insurance Claim</h1>
          <p className="mt-1 text-sm text-gray-300">
            DFIC will guide you through the process step by step
          </p>
        </div>

        <div className="p-6">
          {step === 'chat' && (
            <DFICChat onComplete={handleChatComplete} />
          )}
          
          {step === 'upload' && (
            <FileUploader 
              claimData={claimData}
              onFilesUploaded={handleFilesUploaded}
            />
          )}
          
          {step === 'processing' && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-300">Processing your claim...</p>
              <p className="text-sm text-gray-400">
                Hashing files, generating Merkle root, anchoring on NEAR...
              </p>
            </div>
          )}
          
          {step === 'receipt' && receipt && (
            <ProofReceipt 
              receipt={receipt}
              claimData={claimData}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </div>
    </div>
  )
}
