'use client'

import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '../../context/UserContext'
import Link from 'next/link'

function page() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const { user, loadingUser } = useUser()
    
    const fetchCourse = async (userId) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/GetOne/${userId}?action=all`)
            const res = await response.json()
            console.log('users courses : ', res)
            setData(res)
        } catch (error) {
            console.error('Error fetching course:', error)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        // Only fetch courses when user is available and has an ID
        if (user?._id) {
            fetchCourse(user._id)
        }
    }, [user]) // Add user as dependency

    return (
        <Wrapper>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Your Courses</h1>
                
                {loadingUser || loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
                    </div>
                ) : data.length === 0 ? (
                    <p className="text-gray-500">No courses found.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.map((item, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
<h2 className="text-xl font-semibold mb-2">
  {item?.content ? JSON.parse(item.content).modules[0]?.title : 'Course Title'}
</h2>                                    <p className="text-gray-600 mb-4">
  {item?.content ? JSON.parse(item.content).modules[0]?.subModules[0]?.title  : 'Description not available'}...
</p>
                                    <div className="flex justify-between items-center">
<span className="text-sm text-gray-500">
  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
</span>
                                        <Link href={`/course/${item._id}`} 
            className="font-bold border-2 border-white bg-black hover:bg-white hover:text-black hover:border-black text-white px-4 py-2 rounded-lg"
                                        >
                                            View Course
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Wrapper>
    )
}

export default page
