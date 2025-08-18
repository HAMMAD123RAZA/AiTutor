'use client'

import React, { useEffect, useState } from 'react'
import AdminWrapper from '../../adminComponents/wrapper'
import { getAllApiUsage } from '../../../utils/Operations'
import AdminRoute from '../../../utils/protectionRoute'

function Admin() {
  const [apiUsageData, setApiUsageData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllApiUsage()
      setApiUsageData(data)
      setLoading(false)
    }
    
    fetchData()
  }, [])

  return (
        <AdminRoute>
    
    <AdminWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">API Usage</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiUsageData.length > 0 ? (
                  apiUsageData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.userEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.routeName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.uid}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item?.createdAt?.toDate().toLocaleString()}</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No API usage data found
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