import axios  from 'axios'
import React from 'react'
import { FaVolumeHigh, FaVolumeOff } from 'react-icons/fa6'
import { useUser } from '../../context/UserContext'
import { useRouter } from 'next/navigation'
import { create } from 'domain'

function ContentArea({showCallSection,progressData,toggleSpeakContent,showModal,isPlaying,handleNoClick,handleYesClick,selectedSubmodule,contentRef,userId,userEmail,userName,courseId,data}) {
  const router=useRouter()
   
const courseName=data?.prompt
      const createCertificate=async()=>{
        const response=await axios.post('/api/postCertificate', {userId,userEmail,userName,courseId,courseName})
        console.log(response?.data)
        router.push(`/certificate/${response?.data?.certificateId}`)
      }

  return (
    <>
      <div className={`flex flex-col overflow-y-auto py-3 flex-1 max-h-screen ${showCallSection ? 'lg:w-8/12' : 'w-full'}`}>
      
      {/* Progress Bar - now inside content area */}
      <div className="bg-white border-b border-gray-200 p-2">
        <div className="mx-auto max-w-3xl flex flex-col md:flex-row md:justify-between md:items-center ">
          { !progressData.completed && (
    <p 
            className="md font-bold text-md px-6  bg-gradient-to-br from-[#c7b48c] via-[#95854c] to-[#675853] text-white py-1 w-full md:w-fit rounded-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-500
  hover:from-[#d8c9a5] hover:via-[#a6975d] hover:to-[#786963] 
  hover:shadow-lg hover:shadow-[#c7b48c]/50 
  hover:-translate-y-0.5 
  transition-all duration-300 ease-in-out 
  transform hover:scale-105"
           >
  Course Progress: {parseFloat(progressData.progress.toFixed(2))}%
         
          </p>
          )
      
}
{
    progressData.completed &&(
        <>
        <p
         className=" font-bold cursor-pointer text-center bg-gray-900 text-white py-1 px-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 border-2 border-white hover:border-black hover:text-black  focus:ring-gray-500"
         onClick={createCertificate}
         >Get Certificate</p>
        </>
    )

}   
       <p 
            className="hidden md:block font-bold text-md px-6  bg-gradient-to-br from-[#c7b48c] via-[#95854c] to-[#675853] text-white py-1 w-full md:w-fit rounded-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-yellow-500
  hover:from-[#d8c9a5] hover:via-[#a6975d] hover:to-[#786963] 
  hover:shadow-lg hover:shadow-[#c7b48c]/50 
  hover:-translate-y-0.5 
  transition-all duration-300 ease-in-out 
  transform hover:scale-105"
           >
  Completed: {progressData.completed ? 'Yes' : 'Pending'}
          </p>
        </div>
      </div>



      {/* Content */}
      <div className={`mx-auto ${showCallSection ? 'max-w-3xl' : 'max-w-4xl px-4'}`}>
        {selectedSubmodule ? (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex md:flex-row flex-col  md:justify-between md:items-center">
              <button
                onClick={toggleSpeakContent}
    className={`p-2 md:my-0my-3 text-black hover:bg-blue-50 rounded-full ${
      showModal ? "order-last md:order-none" : ""
    }`}
                title={isPlaying ? "Stop reading" : "Read aloud"}
              >
                {isPlaying ? <FaVolumeOff size={32} /> : <FaVolumeHigh size={34} />}
              </button>

              {/* Call Modal */}
             {showModal && (
    <div className="w-full md:w-80 md:h-auto p-2 rounded-2xl bg-gradient-to-br from-[#c7b48c] via-[#95854c] to-[#675853]">
      <p className="text-white font-mono text-md md:text-lg pb-1">
        Need Help? Call Our Agent
      </p>
      <div className="flex md:flex-row flex-col md:justify-between gap-2 md:items-center">
        <button
          onClick={handleYesClick}
          className="bg-black font-bold text-sm text-white px-7 md:h-auto h-7 py-1 rounded-lg cursor-pointer hover:bg-white hover:text-black border-2 border-white hover:border-black"
        >
          Yes
        </button>
        <button
          onClick={handleNoClick}
          className="bg-white font-bold text-sm text-black px-7 md:h-auto h-7 py-1 rounded-lg cursor-pointer hover:bg-black hover:text-white border-2 border-black hover:border-white"
        >
          No
        </button>
      </div>
    </div>
  )}
            </div>

            <h2 className="text-2xl py-2 md:py-1 font-bold font-sans mb-4">{selectedSubmodule.title}</h2>

            <div
              ref={contentRef}
  className="prose max-w-none overflow-y-auto max-h-[calc(100vh-150px)] px-4"
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
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p>Select a submodule to view its content</p>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default ContentArea

