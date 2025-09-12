import { useState } from 'react'

interface ClaimData {
  incidentType: string
  location: string
  description: string
}

interface DFICChatProps {
  onComplete: (data: ClaimData) => void
}

interface ChatMessage {
  id: string
  text: string
  sender: 'dfic' | 'user'
  timestamp: Date
}

const INCIDENT_TYPES = [
  'Auto Accident',
  'Property Damage', 
  'Theft',
  'Medical Emergency',
  'Travel Incident',
  'Other'
]

export default function DFICChat({ onComplete }: DFICChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hi! I'm DFIC, your claims assistant. I'll help you submit a complete claim quickly. What type of incident are you reporting?",
      sender: 'dfic',
      timestamp: new Date()
    }
  ])
  
  const [currentStep, setCurrentStep] = useState<'incident' | 'location' | 'description' | 'complete'>('incident')
  const [claimData, setClaimData] = useState<ClaimData>({
    incidentType: '',
    location: '',
    description: ''
  })
  const [inputValue, setInputValue] = useState('')

  const addMessage = (text: string, sender: 'dfic' | 'user') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleIncidentSelect = (type: string) => {
    setClaimData(prev => ({ ...prev, incidentType: type }))
    addMessage(type, 'user')
    
    setTimeout(() => {
      addMessage("Got it! Where did this incident occur? Please provide the address or location.", 'dfic')
      setCurrentStep('location')
    }, 500)
  }

  const handleLocationSubmit = () => {
    if (!inputValue.trim()) return
    
    setClaimData(prev => ({ ...prev, location: inputValue }))
    addMessage(inputValue, 'user')
    setInputValue('')
    
    setTimeout(() => {
      addMessage("Thanks! Please describe what happened in a few sentences. Include any relevant details.", 'dfic')
      setCurrentStep('description')
    }, 500)
  }

  const handleDescriptionSubmit = () => {
    if (!inputValue.trim()) return
    
    const finalData = { ...claimData, description: inputValue }
    setClaimData(finalData)
    addMessage(inputValue, 'user')
    setInputValue('')
    
    setTimeout(() => {
      addMessage("Perfect! Now I'll guide you through uploading evidence. This will include photos, documents, or videos related to your claim.", 'dfic')
      setCurrentStep('complete')
      
      setTimeout(() => {
        onComplete(finalData)
      }, 1000)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (currentStep === 'location') {
        handleLocationSubmit()
      } else if (currentStep === 'description') {
        handleDescriptionSubmit()
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-700 rounded-lg p-4 h-96 overflow-y-auto mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 text-gray-100 shadow-sm'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-300'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {currentStep === 'incident' && (
        <div className="space-y-2">
          <p className="text-sm text-gray-300 mb-3">Select your incident type:</p>
          <div className="grid grid-cols-2 gap-2">
            {INCIDENT_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleIncidentSelect(type)}
                className="p-3 text-left border border-gray-600 rounded-lg hover:border-blue-400 hover:bg-gray-600 transition-colors bg-gray-700"
              >
                <span className="text-sm font-medium text-gray-100">{type}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {(currentStep === 'location' || currentStep === 'description') && (
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              currentStep === 'location' 
                ? "Enter the location where the incident occurred..."
                : "Describe what happened..."
            }
            className="flex-1 p-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none bg-gray-700 text-gray-100 placeholder-gray-400"
            rows={currentStep === 'description' ? 3 : 1}
          />
          <button
            onClick={currentStep === 'location' ? handleLocationSubmit : handleDescriptionSubmit}
            disabled={!inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      )}

      {currentStep === 'complete' && (
        <div className="text-center py-4">
          <div className="animate-pulse text-blue-400">
            Preparing file upload interface...
          </div>
        </div>
      )}
    </div>
  )
}
