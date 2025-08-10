'use client'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { AiFillApi } from 'react-icons/ai'
import { BiSearchAlt, BiTestTube } from 'react-icons/bi'
import { FaMagento } from 'react-icons/fa'
import { FaBookSkull } from 'react-icons/fa6'

const SidebarData=[
    {
        title:'Create With Ai',
        link:'/',
        icon:<AiFillApi/>
    },
     {
        title:'Test My Skills',
        link:'/test',
        icon:<BiTestTube />
    },
     {
        title:'Ask Ai',
        link:'/search',
                icon:<BiSearchAlt/>

    }, {
        title:'My Courses',
        link:'/courses',
                icon:<FaBookSkull/>

    },
]

function Sidebar() {
  return (
    <>
        <div className="w-64 h-screen bg-gray-100 p-4 flex flex-col border-r border-gray-200">
        <Image src="https://www.shutterstock.com/image-vector/abstract-ai-logo-set-sleek-600nw-2590920659.jpg" alt="" width={42} height={64} />
        <div className='py-3 px-2'>
            <p className='font-bold text-2xl'>
            Ai Tutor </p>    
            <p>By Ideatez</p>
         <div className='py-2' >
          <p>Your personalized learning companion for any topic</p>
                </div>
                  </div>   

            <nav>
                <ul className='space-y-2'>
                {SidebarData.map((item, id)=>{
                    return (
                        <div key={id}>
                        <Link href={item.link}   className={`${id===0?'bg-gray-300':''} flex gap-2 hover:bg-gray-200 p-2`} >
                            <div className='mr-2'>{item?.icon}</div>
                            <div>{item?.title}</div>
                        </Link >
                        </div>
                    )
                })}
                </ul>
            </nav>
    </div>
    </>
  )
}

export default Sidebar

