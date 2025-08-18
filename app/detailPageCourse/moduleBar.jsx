import React from 'react'
import { FaAngleDown, FaAngleRight } from 'react-icons/fa6';

function ModuleBar({data, handleToggle, handleSubmoduleClick, setSelectedSubmodule,selectedSubmodule, expandedModules, completedSubmodules}) {
  return (
    <>
     <div className="w-full md:w-64 bg-white border-r border-gray-200 overflow-y-auto max-h-screen">
        <div className="p-4 sticky top-0 bg-white border-b border-gray-200">
          <h1 className="text-xl font-bold">{data.prompt || 'Course Modules'}</h1>
        </div>
        <div className="p-2">
          {data?.modules?.map((module, moduleIndex) => (
            <div key={moduleIndex} className="mb-1">
              <div
                className="flex justify-between items-center py-2 px-2 hover:bg-gray-100 rounded cursor-pointer"
                onClick={() => handleToggle(moduleIndex)}
              >
                <p className="font-medium">{module.title}</p>
                {expandedModules[moduleIndex] ? <FaAngleDown /> : <FaAngleRight />}
              </div>
              {expandedModules[moduleIndex] && (
                <div className="ml-4">
                  {module.subModules?.map((subModule, subIndex) => (
                    <div
                      key={subIndex}
                      className={`py-2 px-2 text-sm rounded cursor-pointer ${
                        selectedSubmodule?.title === subModule.title
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-100'
                      }`}
          onClick={() => {
            setSelectedSubmodule(subModule);
            handleSubmoduleClick(subModule); 
          }}
                    >
                   <span>   {subModule.title}</span>
                          {completedSubmodules?.includes(subModule._id) && (
              <span className="text-green-500">✓</span>
            )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ModuleBar

