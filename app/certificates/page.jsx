'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Wrapper from '../components/Wrapper'
import { useUser } from '../../context/UserContext'
import Link from 'next/link'
import { FaCertificate, FaChevronRight } from 'react-icons/fa'

function Page() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()
  const userId = user?._id

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const response = await axios.post('/api/getCertificate?action=all', { userId })
      setData(response?.data?.data || [])
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchCertificates()
    }
  }, [userId])

  const  formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Wrapper>
      <div className="min-h-screen py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Certificates</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
                    </div>
          ) : data.length === 0 ? (
            <div className="text-center py-12">
              <FaCertificate className="mx-auto text-5xl text-gray-400 mb-4" />
              <p className="text-xl text-gray-600">No certificates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((certificate) => (
                <div 
                  key={certificate._id} 
                  className="bg-white border-2 border-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="bg-black text-white p-3 rounded-full mr-4">
                        <FaCertificate className="text-xl" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {certificate.courseName}
                      </h2>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div>
                        <p className="text-sm text-gray-500">Recipient</p>
                        <p className="font-medium">{certificate.userName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Completed</p>
                        <p className="font-medium">{formatDate(certificate.completionDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Certificate ID</p>
                        <p className="font-medium truncate">{certificate._id}</p>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/certificate/${certificate?.certificateId}`}
                      className="w-full flex items-center justify-between font-bold border-2 border-black bg-black hover:bg-white hover:text-black text-white px-4 py-3 rounded-lg transition-colors duration-300"
                    >
                      View Certificate
                      <FaChevronRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  )
}

export default Page