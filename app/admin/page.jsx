import React from 'react'
import AdminWrapper from '../adminComponents/wrapper'
import AdminRoute from '../../utils/protectionRoute'

function Admin() {
  return (
    <AdminRoute>
    <AdminWrapper>
        
        Hi
    </AdminWrapper>
    </AdminRoute>
  )
}

export default Admin


