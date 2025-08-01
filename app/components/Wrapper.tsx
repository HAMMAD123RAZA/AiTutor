import React, { useState } from 'react';
import SideBar from './Sidebar';
import { FiMenu, FiX } from 'react-icons/fi';
export default function AdminWrapper({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-700 text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transform fixed md:relative inset-y-0 left-0 z-40 
        w-64 transition duration-200 ease-in-out bg-gray-700`}
      >
        <SideBar />
      </div>

      {/* Main content area - modified */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* <AdminNavbar /> */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100 w-full">
          <div className="w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}