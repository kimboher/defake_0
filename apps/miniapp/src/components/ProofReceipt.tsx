interface ProofReceiptData {
  proofId: string
  merkleRoot: string
  txHash: string
  timestamp: string
}

interface ClaimData {
  incidentType: string
  location: string
  description: string
  files: File[]
}

interface ProofReceiptProps {
  receipt: ProofReceiptData
  claimData: ClaimData
  onStartOver: () => void
}

export default function ProofReceipt({ receipt, claimData, onStartOver }: ProofReceiptProps) {
  const nearExplorerUrl = `https://testnet.nearblocks.io/txns/${receipt.txHash}`
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Claim Submitted Successfully!</h2>
        <p className="text-gray-600 mt-2">
          Your evidence has been anchored on NEAR blockchain for tamper-proof verification
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Proof Receipt</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Proof ID</label>
            <div className="mt-1 flex">
              <input
                type="text"
                value={receipt.proofId}
                readOnly
                className="flex-1 p-2 border border-gray-300 rounded-l-md bg-white text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(receipt.proofId)}
                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Merkle Root</label>
            <div className="mt-1 flex">
              <input
                type="text"
                value={receipt.merkleRoot}
                readOnly
                className="flex-1 p-2 border border-gray-300 rounded-l-md bg-white text-sm font-mono"
              />
              <button
                onClick={() => copyToClipboard(receipt.merkleRoot)}
                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002 2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">NEAR Transaction</label>
            <div className="mt-1 flex">
              <input
                type="text"
                value={receipt.txHash}
                readOnly
                className="flex-1 p-2 border border-gray-300 rounded-l-md bg-white text-sm font-mono"
              />
              <a
                href={nearExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-blue-50 hover:bg-blue-100 text-blue-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Timestamp</label>
            <input
              type="text"
              value={new Date(receipt.timestamp).toLocaleString()}
              readOnly
              className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Claim Summary</h4>
        <div className="text-sm text-blue-700">
          <p><strong>Type:</strong> {claimData.incidentType}</p>
          <p><strong>Location:</strong> {claimData.location}</p>
          <p><strong>Files:</strong> {claimData.files.length} uploaded</p>
          <p className="mt-2 text-xs">
            Your evidence is now tamper-proof and can be verified by anyone using the Proof ID above.
          </p>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onStartOver}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Submit Another Claim
        </button>
        <a
          href="/verify"
          className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
        >
          Verify This Proof
        </a>
      </div>

      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Keep this receipt for your records. Your claim is now being reviewed by our team.
        </p>
      </div>
    </div>
  )
}
