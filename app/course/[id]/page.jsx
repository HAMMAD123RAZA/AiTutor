'use client'
import { use, useEffect, useState } from "react";
import { FaAngleRight, FaAngleDown } from "react-icons/fa6";

export default function CoursePage({ params }) {
  const [data, setData] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [selectedSubmodule, setSelectedSubmodule] = useState(null);
  const { id } = use( params);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/GetOne/${id}`);
      const res = await response.json();
      setData(res);
      
      // Initialize expanded state for modules
      const initialExpandedState = {};
      res?.modules?.forEach((_, index) => {
        initialExpandedState[index] = false;
      });
      setExpandedModules(initialExpandedState);
      
      // Set first submodule of first module as default selected
      if (res?.modules?.[0]?.subModules?.[0]) {
        setSelectedSubmodule(res.modules[0].subModules[0]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const handleToggle = (moduleIndex) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleIndex]: !prev[moduleIndex]
    }));
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  if (!data) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Loading Course...</h1>
        <p>Please wait while we load the course content</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
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
                      className={`py-2 px-2 text-sm rounded cursor-pointer ${selectedSubmodule?.title === subModule.title ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                      onClick={() => setSelectedSubmodule(subModule)}
                    >
                      {subModule.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="fle overflow-y-auto py-3">
        {selectedSubmodule ? (
          <div className="max-w-4xl mx-auto bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold font-sans mb-4">{selectedSubmodule.title}</h2>
            <div className="prose max-w-none">
              {selectedSubmodule.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-xl font-serif">{paragraph}  </p>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
            <p>Select a submodule to view its content</p>
          </div>
        )}
      </div>
    </div>
  );
}