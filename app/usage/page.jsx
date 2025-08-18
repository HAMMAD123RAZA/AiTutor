'use client'
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '../../context/UserContext'
import { getCourses, getTotalCalls } from '../../utils/Operations';
import UsageChart from '../components/Chart'; // Adjust the import path as needed

function page() {
    const [Course, setCourse] = useState([])
    const [Calls, setCalls] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, loadingUser } = useUser();
    const userId = user?._id

    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses(userId)
        setCourse(coursesData)
      } catch (error) {
        console.error('Error fetching Course:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchTotalCalls = async () => { 
      try {
        const totalCallsData = await getTotalCalls(userId)
        setCalls(totalCallsData)
      } catch (error) {
        console.error('Error fetching Total Calls:', error)
      }
      finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      if (!loadingUser && user) {
        fetchCourses()
        fetchTotalCalls()
      }
    }, [loadingUser, user])
    
    if (loading || loadingUser) {
      return <Wrapper>Loading...</Wrapper>
    }

  return (
    <Wrapper>
      <h1 className="text-2xl  font-bold py-2 my-2">Usage Statistics</h1>
      
      <UsageChart 
        data={Course} 
        dataType="courses" 
        title="Course Usage Over Time" 
      />
      
      <UsageChart 
        data={Calls} 
        dataType="calls" 
        title="Call Usage Over Time" 
      />
    </Wrapper>
  )
}

export default page