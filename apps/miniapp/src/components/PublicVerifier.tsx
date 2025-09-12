import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface VerificationResult {
  verified: boolean
  proofId: string
  merkleRoot: string
  txHash: string
  timestamp: string
  message: string
}

export default function PublicVerifier() {
  const [verificationMethod, setVerificationMethod] = useState<'proofId' | 'files'>('proofId')
  const [proofId, setProofId] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploadedFiles(acceptedFiles)
    setResult(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  })

  const verifyByProofId = async () => {
    if (!proofId.trim()) return

    setIsVerifying(true)
    
    // Simulate API call - replace with actual verification
    setTimeout(() => {
      // Mock verification result
      const mockResult: VerificationResult = {
        verified: Math.random() > 0.3, // 70% chance of verification success
        proofId: proofId,
        merkleRoot: '0x' + Math.random().toString(16).substr(2, 64),
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        message: Math.random() > 0.3 
          ? 'Proof verified successfully on NEAR blockchain'
          : 'Proof not found or verification failed'
      }
      
      setResult(mockResult)
      setIsVerifying(false)
    }, 2000)
  }

  const verifyByFiles = async () => {
    if (uploadedFiles.length === 0) return

    setIsVerifying(true)
    
    // Simulate file hashing and verification
    setTimeout(() => {
      const mockResult: VerificationResult = {
        verified: Math.random() > 0.4, // 60% chance of success
        proofId: `proof_${Date.now()}`,
        merkleRoot: '0x' + Math.random().toString(16).substr(2, 64),
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        message: Math.random() > 0.4
          ? 'Files match existing proof on blockchain'
          : 'Files do not match any existing proof'
      }
      
      setResult(mockResult)
      setIsVerifying(false)
    }, 3000)
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    setResult(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Public Proof Verifier</h1>
          <p className="mt-1 text-sm text-gray-600">
            Verify the authenticity of evidence by checking against NEAR blockchain records
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setVerificationMethod('proofId')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  verificationMethod === 'proofId'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Verify by Proof ID
              </button>
              <button
                onClick={() => setVerificationMethod('files')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  verificationMethod === 'files'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Verify by Files
              </button>
            </div>
          </div>

          {verificationMethod === 'proofId' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Proof ID
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={proofId}
                  onChange={(e) => {
                    setProofId(e.target.value)
                    setResult(null)
                  }}
                  placeholder="proof_1234567890..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={verifyByProofId}
                  disabled={!proofId.trim() || isVerifying}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          )}

          {verificationMethod === 'files' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Files to Verify
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {isDragActive ? (
                  <p className="text-blue-600">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600">
                      Drag & drop files here, or <span className="text-blue-600 underline">browse</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Upload the same files that were originally submitted
                    </p>
                  </div>
                )}
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">
                      Files to Verify ({uploadedFiles.length})
                    </h3>
                    <button
                      onClick={verifyByFiles}
                      disabled={isVerifying}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isVerifying ? 'Hashing & Verifying...' : 'Verify Files'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {isVerifying && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">
                {verificationMethod === 'proofId' 
                  ? 'Checking NEAR blockchain...'
                  : 'Hashing files and checking blockchain...'
                }
              </p>
            </div>
          )}

          {result && (
            <div className={`p-6 rounded-lg ${
              result.verified 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center mb-4">
                {result.verified ? (
                  <svg className="h-6 w-6 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <h3 className={`text-lg font-semibold ${
                  result.verified ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.verified ? 'Verification Successful' : 'Verification Failed'}
                </h3>
              </div>
              
              <p className={`mb-4 ${
                result.verified ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message}
              </p>

              {result.verified && (
                <div className="space-y-2 text-sm">
                  <p><strong>Proof ID:</strong> <code className="bg-white px-2 py-1 rounded">{result.proofId}</code></p>
                  <p><strong>Merkle Root:</strong> <code className="bg-white px-2 py-1 rounded">{result.merkleRoot}</code></p>
                  <p><strong>Transaction:</strong> 
                    <a 
                      href={`https://testnet.nearblocks.io/txns/${result.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-1 text-blue-600 underline"
                    >
                      View on NEAR Explorer
                    </a>
                  </p>
                  <p><strong>Anchored:</strong> {new Date(result.timestamp).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
