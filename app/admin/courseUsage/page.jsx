'use client'
import React, { useEffect, useState } from 'react'
import AdminWrapper from '../../adminComponents/wrapper'
import { getCourseCreatedUsage } from '../../../utils/Operations'
import AdminRoute from '../../../utils/protectionRoute'

function Admin() {
  const [courseData, setCourseData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCourseCreatedUsage()
      setCourseData(data)
      setLoading(false)
    }
    
    fetchData()
  }, [])

  // Format timestamp to readable date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleString()
  }

  return (
            <AdminRoute>

    <AdminWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Course Creation Usage</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CreatedBy</th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prompt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courseData.length > 0 ? (
                  courseData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">{item.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">{item?.userEmail}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">{item.courseId}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{item.prompt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.generatedAt)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(item.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No course creation data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminWrapper>
            </AdminRoute>

  )
}

export default Admin