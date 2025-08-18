import React, { useRef, useState } from 'react'
import { useUser } from '../../context/UserContext';
import { apiUsage } from '../../utils/Operations';

function CallSection({agentClass,containerClass,preCallClass}) {
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [callStage, setCallStage] = useState('precall'); // 'precall', 'active', 'ended'
  const [selectedAgent, setSelectedAgent] = useState(null);
  const recognitionRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
    const { user, loadingUser } = useUser();
  const userEmail=user?.email
    const userId=user?._id

  const voiceAgents = [
    // { id: 'en-US-AriaNeural', name: 'Aria (US English)', gender: 'Female' },
    { id: 'en-US-GuyNeural', name: 'MITCH ', gender: 'Male' },
    { id: 'en-US-JennyNeural', name: 'JENNY ', gender: 'Female' },
    { id: 'en-GB-RyanNeural', name: 'RYAN ', gender: 'Male' },
    { id: 'en-GB-LibbyNeural', name: 'LIBBY ', gender: 'Female' },
  ];

  const startListening = () => {
    if (!selectedAgent) {
      alert("Please select an agent first");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setFinalTranscript(transcript);

      // Reset the silence timer every time speech is detected
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = setTimeout(() => {
        if (transcript.trim()) {
          handleSendToAI(transcript);
          setFinalTranscript("");
        }
      }, 2000); // 2s silence
    };

    recognition.onend = () => {
      // Auto restart listening unless user manually stopped it
      if (isRecording) recognition.start();
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setCallStage('active');
  };

  const stopListening = () => {
    setIsRecording(false);
    setCallStage('ended');
    clearTimeout(silenceTimeoutRef.current);
    recognitionRef.current?.stop();
    
    // Reset after 3 seconds
    setTimeout(() => {
      setCallStage('precall');
      setSelectedAgent(null);
    }, 3000);
  };

  const handleSendToAI = async (text) => {
    setIsProcessing(true);
    console.log("Sending to AI:", text);

    try {
      // 1️⃣ Get AI response
      const api = await fetch("/api/aiAgent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text,user })
      });

      const data = await api.json();
      const aiText = data?.reply || data?.text || "";
      
//tracking api 


    const apiType='Valuable'
    const routeName='/api/aiAgent'

    await apiUsage(userId, routeName, userEmail,apiType)
      if (!aiText) return;

      // 2️⃣ Get speech from Edge TTS with selected agent
      const speechApi = await fetch("http://127.0.0.1:8000/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: aiText,
          voice: selectedAgent.id 
        })
      });


//tracking api 
          const type='Valuable'
    const route='/python/speak'

    await apiUsage(userId, route, userEmail,type)


      const speechBlob = await speechApi.blob();
      const url = URL.createObjectURL(speechBlob);
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Error in AI processing:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (

      <div className={`${containerClass} flex flex-col items-center`}>
  {callStage === 'precall' && (
    <div className={`${preCallClass}`}>
      <h2 className="text-2xl font-bold text-center text-gray-800">Select Your Agent</h2>
      <p className="text-gray-600 text-center">Choose a voice agent to speak with.</p>

<div className={`${agentClass} flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3`}>
        {voiceAgents.map((agent) => (
          <div 
               key={agent.id}
      onClick={() => setSelectedAgent(agent)}
      className={`p-4 w-full sm:w-64 border-2 rounded-lg cursor-pointer transition-all ${
        selectedAgent?.id === agent.id 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-blue-300'
      }`}

          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${agent.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                {agent.gender === 'Female' ? '♀' : '♂'}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{agent.name}</h3>
                <p className="text-sm text-gray-500">{agent.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        disabled={!selectedAgent}
        onClick={startListening}
        className={`mt-4 w-full py-3 px-4 rounded-lg font-medium transition-colors ${selectedAgent 
          ? 'bg-gradient-to-r from-[#c7b48c] via-[#95854c] to-[#675853] text-white hover:from-[#5b504d] hover:to-[#3b322f] cursor-pointer' 
          : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
      >
        Start Call with {selectedAgent?.name || 'Agent'}
      </button>
    </div>
  )}

 {(callStage === 'active' || callStage === 'ended') && (
  <div className="text-center">
    <div className={`animate-spin-slow ${isRecording ? 'animate-pulse' : ''} rounded-full flex items-center justify-center w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-[#c7b48c] via-[#95854c] to-[#675853]`}>
      <div className="text-center">
        <div className="mb-4 text-white font-medium">
          {selectedAgent?.name}
          <span className="block text-sm opacity-80">{selectedAgent?.id}</span>
        </div>
        
        <button
          className="bg-black font-bold text-white px-4 py-2 rounded-full cursor-pointer hover:bg-white hover:text-black border-2 border-white hover:border-black"
          onClick={stopListening}
        >
          {isProcessing ? "Processing..." : "End Call"}
        </button>
      </div>
    </div>

    {finalTranscript && (
      <div className="mt-4 p-3 bg-white rounded-lg shadow-sm max-w-xs mx-auto">
        <p className="text-sm text-gray-700">{finalTranscript}</p>
      </div>
    )}

    {callStage === 'ended' && (
      <div className="mt-4 text-green-600 font-medium">
        Call ended. Preparing for next call...
      </div>
    )}
  </div>
)}

</div>

  )
}

export default CallSection;