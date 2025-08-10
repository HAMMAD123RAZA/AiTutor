'use client'
import { use, useEffect, useRef, useState } from "react";
import { FaAngleRight, FaAngleDown, FaVolumeHigh, FaVolumeOff } from "react-icons/fa6";
import { useUser } from "../../../context/UserContext";
import axios from 'axios';
import { FaMicrophone, FaStopCircle } from 'react-icons/fa';
import { uploadToCloudinary } from "../../utils/uploadCloud";

export default function CoursePage({ params }) {
  const [data, setData] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);
  const [audio, setAudio] = useState(null);
  const contentRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { user, loadingUser } = useUser()
    const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
const [isProcessing, setIsProcessing] = useState(false);


  const userId=user._id
  const { id } = use( params);


const startRecording = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  chunksRef.current = [];
  mediaRecorderRef.current = mediaRecorder;

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunksRef.current.push(event.data);
  };

  mediaRecorder.onstop = async () => {
    setIsProcessing(true);
    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const file = new File([blob], "recording.webm", { type: "audio/webm" });
    const cloudUrl = await uploadToCloudinary(file);
    console.log('cloudUrl:',cloudUrl)
    setAudioUrl(cloudUrl);
    setIsProcessing(false);
  };

  mediaRecorder.start();
  setIsRecording(true);
};

const stopRecording = () => {
  mediaRecorderRef.current?.stop();
  setIsRecording(false);
};

// Button onClick
const handleRecordingClick = () => {
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
};


useEffect(() => {
  // Add a small delay to ensure DOM is updated
  setTimeout(() => {
    const container = contentRef.current;
    if (!container) return;

    const codeBlocks = container.querySelectorAll("pre");
    
    codeBlocks.forEach((pre) => {
      // Avoid adding duplicate buttons
      if (pre.querySelector(".copy-btn")) return;

      const button = document.createElement("button");
      button.textContent = "Copy Code";
      button.className =
        "copy-btn bg-blue-500 text-white px-3 py-1 text-sm rounded mb-2 hover:bg-blue-600 absolute top-2 right-2 z-10";

      button.onclick = () => {
        const code = pre.querySelector('code')?.innerText || pre.innerText;
        navigator.clipboard.writeText(code).then(() => {
          button.textContent = "Copied!";
          setTimeout(() => (button.textContent = "Copy Code"), 1500);
        });
      };

      pre.style.position = 'relative'; // Ensure relative positioning
      pre.appendChild(button); // Use appendChild instead of prepend
    });
  }, 100);
}, [selectedSubmodule]);


const toggleSpeakContent = async () => {
  if (!selectedSubmodule) return;

  // If audio is playing, stop it
  if (isPlaying && audio) {
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    return;
  }

  try {
    // Extract clean text from HTML content
    const cleanText = selectedSubmodule.content.replace(/<[^>]*>/g, ' ');
    
    const res = await fetch('http://127.0.0.1:8000/speak', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleanText }),
    });

    if (!res.ok) {
      throw new Error('Failed to fetch speech');
    }

    const audioBlob = await res.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const newAudio = new Audio(audioUrl);
    
    // Set up event listeners
    newAudio.onplay = () => setIsPlaying(true);
    newAudio.onended = () => setIsPlaying(false);
    newAudio.onpause = () => setIsPlaying(false);
    
    // Store the audio object in state
    setAudio(newAudio);
    newAudio.play();
    
  } catch (error) {
    console.error('TTS error:', error);
    setIsPlaying(false);
  }
};


useEffect(() => {
  return () => {
    // Clean up audio when component unmounts
    if (audio) {
      audio.pause();
      URL.revokeObjectURL(audio.src);
    }
  };
}, [audio]);



  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/GetOne/${id}?action=one&userId=${userId}`);
      const res = await response.json();
      setData(res);
      
      // Initialize expanded state for modules
      const initialExpandedState = {};
      res?.modules?.forEach((_, index) => {
        initialExpandedState[index] = false;
      });
      setExpandedModules(initialExpandedState);
      
      // Set first submodule of first module as default selected
      if (res?.modules?.[0]?.subModules?.[0]) {
        setSelectedSubmodule(res.modules[0].subModules[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const handleToggle = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (!data) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Loading Course...</h1>
        <p>Please wait while we load the course content</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 sticky top-0 bg-white border-b border-gray-200">
          <h1 className="text-xl font-bold">{data.prompt || 'Course Modules'}</h1>
        </div>
        <div className="p-2">
          {data?.modules?.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-1">
              <div 
                className="flex justify-between items-center py-2 px-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => handleToggle(moduleIndex)}
              >
                <p className="font-medium">{module.title}</p>
                {expandedModules[moduleIndex] ? <FaAngleDown /> : <FaAngleRight />}
              </div>
              {expandedModules[moduleIndex] && (
                <div className="ml-4">
                  {module.subModules?.map((subModule, subIndex) => (
                    <div 
                      key={subIndex}
                      className={`py-2 px-2 text-sm rounded cursor-pointer ${selectedSubmodule?.title === subModule.title ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                      onClick={() => setSelectedSubmodule(subModule)}
                    >
                      {subModule.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      
    <div className="flex-shrink-0 overflow-y-auto py-3" style={{ width: '56%' }}>
        {selectedSubmodule ? (
          <div className="max-w-2xl mx-auto bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold font-sans mb-4">{selectedSubmodule.title}</h2>
             <button
              onClick={toggleSpeakContent}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
  title={isPlaying ? "Stop reading" : "Read aloud"}
            >
{                isPlaying?<FaVolumeOff/> : <FaVolumeHigh size={20} />
}            </button>
           <div
      ref={contentRef}
      className="prose max-w-none"
      dangerouslySetInnerHTML={{
        __html: selectedSubmodule.content
          .replace(/<h2/g, '<h2 class="text-2xl font-bold mt-6 mb-3 text-gray-700"')
          .replace(/<h3/g, '<h3 class="text-xl font-semibold mt-5 mb-2 text-gray-700"')
          .replace(/<p/g, '<p class="mb-4 text-lg text-gray-600 leading-relaxed"')
          .replace(/<ul/g, '<ul class="list-disc pl-5 mb-4"')
          .replace(/<li/g, '<li class="mb-2 text-gray-600 font-bold "')
          .replace(/<pre/g, '<pre class="bg-gray-100 p-4 rounded-md overflow-x-auto mb-4 relative group"')
          .replace(
            /<pre><code>/g,
            '<pre class="!bg-gray-800 text-gray-500 font-bold p-4 rounded-md overflow-x-auto mb-4 whitespace-pre-wrap relative"><code class="block">'
          )
          .replace(/<\/code><\/pre>/g, "</code></pre>")
          .replace(/\n/g, "<br/>"),
      }}
    ></div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            <p>Select a submodule to view its content</p>
          </div>
        )}
      </div>
 
{/* start call section */}
<div className="flex-1">
<div className="p-3 flex justify-center  ">
        <div className="rounded-full flex items-center justify-center w-64 h-64 bg-gradient-to-br from-[#c7b48c] via-[#95854c] to-[#675853] ">

<button
  onClick={handleRecordingClick}
  disabled={isProcessing}
  className={`font-bold text-white border-2 rounded-full py-3 px-6 flex items-center gap-2 ${
    isRecording ? 'bg-red-500' : 'bg-black'
  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white hover:text-black hover:border-black'}`}
>
  {isRecording ? (
    <>
      <FaStopCircle className="animate-pulse" />
      Stop Recording
    </>
  ) : (
    <>
      <FaMicrophone />
      Test Call
    </>
  )}
</button>
       </div>
</div>
</div>
      
    </div>
  );
}