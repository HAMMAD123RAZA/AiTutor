'use client'
import { use, useEffect, useRef, useState } from "react";
import { FaAngleRight, FaAngleDown, FaVolumeHigh, FaVolumeOff } from "react-icons/fa6";
import { useUser } from "../../../context/UserContext";
import axios from 'axios';
import { FaMicrophone, FaStopCircle } from 'react-icons/fa';
import { uploadToCloudinary } from "../../utils/uploadCloud";
import CallSection from "../../components/callSection";
import ModuleBar from "../../detailPageCourse/moduleBar";
import ContentArea from "../../detailPageCourse/ContentArea";
import { apiUsage } from "../../../utils/Operations";

export default function CoursePage({ params }) {

  const [data, setData] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);
  const [audio, setAudio] = useState(null);
  const contentRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [showCallSection, setShowCallSection] = useState(false);
  const [progressData, setprogressData] = useState({
    completed: false,
    progress: 0,
    lastAccessed: null
  });
  const [loading, setLoading] = useState(true);
  const { user, loadingUser } = useUser()
  console.log('user from detail:',user)
  const userId=user?._id
  const userEmail=user?.email
  const userName=user?.name
  const { id } = use( params);
const [completedSubmodules, setCompletedSubmodules] = useState([]);

// Calculate total submodules count
const totalSubmodules = data?.modules?.reduce(
  (total, module) => total + (module.subModules?.length || 0), 
  0
) || 1; // Fallback to 1 to avoid division by zero
  // Add this function to handle progress updates when a submodule is clicked
const handleSubmoduleClick = async (subModule) => {
  // 1. Always update the selected submodule
  setSelectedSubmodule(subModule);
  
  // 2. Check if this submodule was already completed
  if (completedSubmodules.includes(subModule._id)) {
    return; // Skip if already completed
  }

  // 3. Calculate new progress
  const progressIncrement = 100 / totalSubmodules;
  const newProgress = Math.min(
    progressData.progress + progressIncrement,
    100
  );

  try {
    // 4. Update progress via API
    const response = await axios.post('/api/getCourseProgress?action=update', {
      userId,
      courseId: id,
      progress: newProgress
    });

    // 5. Update local state
    setprogressData(response.data);
    setCompletedSubmodules(prev => [...prev, subModule._id]);
    
  } catch (error) {
    console.error('Error updating progress:', error);
  }
};



const fetchProgress = async () => {
  try {
    setLoading(true);
    const api = await axios.post('/api/getCourseProgress?action=find', {userId, courseId:id});
    setprogressData(api.data);
    console.log("course progress:", api.data);
  } catch (error) {
    console.error('Error fetching progress:', error);
  } finally {
    setLoading(false);
  }
}

 const handleYesClick = () => {
    setShowModal(false);
    setShowCallSection(true);
  };

  const handleNoClick = () => {
    setShowModal(false);
  };

useEffect(() => {
  if (progressData.progress === 100) {
    // Mark all submodules as completed if course is 100% done
    const allSubmoduleIds = data?.modules?.flatMap(module => 
      module.subModules?.map(sub => sub._id) || []
    ) || [];
    setCompletedSubmodules(allSubmoduleIds);
  }
}, [progressData, data]);

  useEffect(() => {
  if (userId && id) {
    fetchProgress();
  }
  console.log('here u go:',progressData.progress)
}, [userId, id]);


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
    // const track code 
    const routeName='/python/speak'
    const apiType='Valuable'
        await apiUsage(userId, routeName, userEmail,apiType)


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
  if (!loadingUser && userId) {
    fetchCourse();
  }
}, [id, userId, loadingUser]);


  if (!data) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Loading Course...</h1>
        <p>Please wait while we load the course content</p>
      </div>
    );
  }

  return (
    <>
<div className="flex flex-col md:flex-row h-screen bg-gray-50">
  {/* Left Sidebar - Course Modules */}
  <ModuleBar 
  data={data}
  handleToggle={handleToggle}
  expandedModules={expandedModules}
  selectedSubmodule={selectedSubmodule}
  setSelectedSubmodule={setSelectedSubmodule}
  handleSubmoduleClick={handleSubmoduleClick}
completedSubmodules={completedSubmodules}
  />

  {/* Main Content Area */}
  <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto max-h-screen">
    {/* Content Section */}
   <ContentArea
     data={data}

   courseId={id}
   userId={userId}
   userName={userName}
   userEmail={userEmail}
   showCallSection={showCallSection}
   progressData={progressData}
   toggleSpeakContent={toggleSpeakContent}
   showModal={showModal}
   isPlaying={isPlaying}
   handleNoClick={handleNoClick}
   handleYesClick={handleYesClick}
   selectedSubmodule={selectedSubmodule}
   contentRef={contentRef}
   />

    {/* Right Sidebar - Agent Selection */}
    {showCallSection && (
<div className="w-full lg:w-4/12 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50 flex items-center justify-center p-4 overflow-y-auto max-h-screen">
        <CallSection
          preCallClass="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6"
          containerClass="w-full flex justify-center"
          agentClass="space-y-3"
        />
      </div>    )}
  </div>
</div>
</>
  );
}

