'use client'

import React, { useEffect, useState } from 'react'
import AdminWrapper from '../../adminComponents/wrapper'
import { getUsers } from '../../../utils/Operations'
import AdminRoute from '../../../utils/protectionRoute'

function Admin() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await getUsers()
        setUsers(userData)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
        <AdminRoute>
    
    <AdminWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Users Management</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by email or name..."
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Credits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LogAt</th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.email} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.plan === 'premium' ? 'bg-green-100 text-green-800' : 
                            user.plan === 'basic' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {user.plan || 'free'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.totalCredits || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.creditUsed || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {(user.totalCredits || 0) - (user.creditUsed || 0)}
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user?.loggedInAt && user.loggedInAt.toDate().toLocaleString()}

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      {users.length === 0 ? 'No users found' : 'No matching users found'}
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