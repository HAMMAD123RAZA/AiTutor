import React from 'react';
import { MdGolfCourse, MdOutlineDashboardCustomize } from 'react-icons/md';
import { IoPeopleCircleOutline } from 'react-icons/io5';
import { IoIosContact } from 'react-icons/io';
import { BsInfoSquareFill } from 'react-icons/bs';
import Link from 'next/link';

const SideBar = () => {
  return (
    <div className="w-64 bg-gray-700 text-white h-full flex flex-col">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <nav className="flex flex-col flex-1 px-2 py-4 gap-6">
          <div className="flex justify-center my-3">
            <div className="py-2">
             <p className='font-bold text-xl' >AiTutor</p>
            </div>
          </div>

          {/* Menu sections */}
          <div className="flex flex-col gap-1 ml-2">
            <Link
              href='/admin'
              className="flex gap-2 items-center hover:bg-gray-600 p-3 rounded transition-colors"
            >
              <MdOutlineDashboardCustomize size={22} />
              <span className="text-white">Dashboard</span>
            </Link>

            <Link
href={'/admin/apiUsage'}
className="flex gap-2 items-center hover:bg-gray-600 p-3 rounded transition-colors"
            >
              <MdOutlineDashboardCustomize size={22} />
              <span className="text-white">Api Usage</span>
            </Link>
               <Link
href={'/admin/courseUsage'}
className="flex gap-2 items-center hover:bg-gray-600 p-3 rounded transition-colors"
            >
              <MdOutlineDashboardCustomize size={22} />
              <span className="text-white">Course Usage</span>
            </Link>
            <Link
              href='/admin/users'
              className="flex gap-2 items-center hover:bg-gray-600 p-3 rounded transition-colors"
            >
              <MdOutlineDashboardCustomize size={22} />
              <span className="text-white">Users</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
