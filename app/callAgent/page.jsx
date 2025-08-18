'use client'
import React, { useEffect, useRef } from 'react'
import AdminWrapper from '../components/Wrapper'
import CallSection from '../components/callSection'
import { apiUsage } from '../../utils/Operations'
import { useUser } from '../../context/UserContext'


function Page() {
  //Api track code 
  const { user, loadingUser } = useUser();
const hasTracked = useRef(false);

  const uid=user?._id 
console.log('userId from callAgent:',uid)
const userEmail=user?.email
const routeName='/CallAgent'
const type='Non Valuable'

  const trackApi=async()=>{
    try {
      const track=await apiUsage(uid, routeName, userEmail,type)
      console.log('track successfully')
    } catch (error) {
      console.log('err here:',error)
    }
  }

  useEffect(()=>{
    if (!hasTracked.current && uid) {
      trackApi();
      hasTracked.current = true;
    }
  },[uid])

  return (
    <>
    <AdminWrapper>
<CallSection
 agentClass='grid grid-cols-2 gap-3' 
 preCallClass="max-w-2xl  p-6 space-y-6"
 containerClass="w-full flex items-center justify-center p-4"  />
    </AdminWrapper>
    </>
  )
}

export default Page