'use client'
import React, { useState } from 'react'
import AdminWrapper from './Wrapper'
import { FiCheckCircle, FiMessageSquare, FiBook, FiMap } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

  const features = [
    { icon: <FiBook size={24} />, text: "Unlimited Courses and Guides" },
    { icon: <FiCheckCircle size={24} />, text: "No limits on number of courses, guides, and quizzes" },
    { icon: <FiMessageSquare size={24} />, text: "Extended Chat Limits" },
    { icon: <FiMessageSquare size={24} />, text: "Chat with AI Tutor and Roadmaps without limits" },
    { icon: <FiMap size={24} />, text: "Custom Roadmaps" },
    { icon: <FiCheckCircle size={24} />, text: "Create upto 100 custom roadmap" },
    { icon: <FiBook size={24} />, text: "Access your AI Tutor and roadmap chats later" }
  ]


function Home() {
const [show, setshow] = useState(false)
const [Input, setInput] = useState('')
const [loading, setLoading] = useState(false);
const [Error, setError] = useState('')

const router=useRouter()

const courseCheck=async(prompt)=>{
  try {
    const api=await fetch('/api/CheckCourse',{
      method:'POST',
body:JSON.stringify({prompt})

    })
    const data=await api.json()
    console.log('data:',data)

    if (api.ok && data.length>0) {
      console.log("AI-generated course:", data[0]);
        return data[0]
        
    } else {
      console.error("Error:", data.error);
      return null
    }
    
  } catch (error) {
   console.log('err :',error) 
   return null
  }
}


const handleGenrate=async()=>{

  if (!Input.trim()) {
    setError('ENTER COURSE TO GENRATE')
    setTimeout(() => {
      setError('')
    }, 3000);
    return 
  }

  console.log('value:',Input)
  setInput('')
  setLoading(true)
  
try {
        const courseExists = await courseCheck(Input)
      
      if (courseExists) {
                router.push(`/course/${courseExists._id}`)
        setLoading(false)
return
      }
      

  const res=await fetch('/api/AiApi',{
    method:'POST',
headers:{
  'Content-Type':'application/json'
},
body:JSON.stringify({prompt:Input})

})

const data=await res.json();

    if (res.ok) {
      console.log("AI-generated course:", data?.course);
            router.push(`/course/${data?.dbId}`);

    } else {
      console.error("Error:", data.error);
    }
} catch (error) {
  console.error('err:',error)
} finally {
    setLoading(false);
  }
}


    const renderModal=()=>{
    setshow(true)
}

  const closeModal = () => {
    setshow(false)
  }

  return (
    <>
    <AdminWrapper>

    <div className='flex flex-col  items-center py-3' >
        <div className="py-3 flex flex-row items-center gap-4">
            <p>You are on the free plan</p>
             <button onClick={renderModal} className="md font-bold cursor-pointer bg-yellow-700 text-white py-1 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 border-2 border-white hover:border-yellow-600 hover:text-yellow-700  focus:ring-yellow-500">Upgrade To Pro</button>
        </div>

    {show && (
          <div className="fixed inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center ">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 text-center">Pro Features</h2>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">{feature.icon}</span>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={closeModal}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        )}
                
   <h1 className='font-bold text-4xl py-2 ' > What can I help you learn?</h1>
<h1 className='text-lg py-3'>  Enter a topic below to generate a personalized course for it </h1>
<div className='my-5'>

<p>   What can I help you learn?</p>
<input
value={Input}
onKeyDown={(e)=>{
  if (e.key==='Enter') {
    handleGenrate()
  }
}}
onChange={(e)=>setInput(e.target.value)}
type="text" 
placeholder='search here...'
 className='border-2 border-gray-400 rounded-lg bg-white p-4 min-w-md my-3' 
 />
    </div>
    {Error && <p className="text-red-500 text-lg font-bold pb-2"> ❌{Error}</p>}

    <button    
         disabled={loading} 
         onClick={handleGenrate} 
         className="min-w-md font-bold cursor-pointer flex flex-row items-center justify-center bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 border-2 border-white hover:border-black hover:text-black  focus:ring-gray-500"
> {loading ? (
    <svg
      className="animate-spin h-5 w-5 hover:text-black  text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  ) : (
    'Generate'
  )} </button>
    </div>

    </AdminWrapper>

    </>
  )
}

export default Home