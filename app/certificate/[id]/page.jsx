'use client'
import axios from 'axios';
import { useParams } from 'next/navigation'
import React, { useState, useEffect, useRef } from 'react'
import { FaAward, FaIdBadge, FaSignature, FaUserGraduate } from 'react-icons/fa6';
import CanvasSignature from '../../components/signature';
import { useReactToPrint } from 'react-to-print';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import domtoimage from "dom-to-image-more";
 import { FaTrophy, FaScroll, FaGraduationCap, FaCheck, FaCalendarAlt, FaIdCard, FaLock } from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';
import { BsBook } from 'react-icons/bs';
import { PiConfettiFill } from 'react-icons/pi';
import AdminWrapper from '../../components/Wrapper';
function CertificatePage({params}) {
  const { id } = useParams();
   const certificateRef = useRef();

  const [certificateData, setCertificateData] = useState({
    userName: '',
    courseName: '',
    userEmail: '',
    completionDate: ''
  });
  const [loading, setLoading] = useState(true);

  const fetchCertificate = async () => {
    try {
      const res = await axios.post('/api/getCertificate?action=find', {certificateId: id});
      setCertificateData(res.data.data);
      console.log('api:',res.data)
      setLoading(false);
    } catch (error) {
      console.log('Error getting certificate:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  useEffect(() => {
    console.log('Current certificate data:', certificateData);
  }, [certificateData]);

const handleDownload = async () => {
  // Add a fixed width to ensure consistent rendering
  const certificateElement = certificateRef.current;
  const originalWidth = certificateElement.style.width;
  certificateElement.style.width = '800px'; // Fixed width for PDF
  
  // Add a small delay to allow DOM to update
  await new Promise(resolve => setTimeout(resolve, 100));
  
  try {
    const dataUrl = await domtoimage.toPng(certificateElement, {
      quality: 1,
      bgcolor: '#ffffff',
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      }
    });
    
    const pdf = new jsPDF('landscape', 'pt', [800, 600]); // Fixed dimensions
    pdf.addImage(dataUrl, 'PNG', 0, 0, 800, 600);
    pdf.save('certificate.pdf');
  } catch (error) {
    console.error('Error generating certificate:', error);
  } finally {
    // Restore original width
    certificateElement.style.width = originalWidth;
  }
};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-[#675853] text-xl">Loading certificate...</div>
      </div>
    );
  }

  const formattedDate = new Date(certificateData.completionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  

  return (
    <>
  
  <AdminWrapper>
                    
<div className="flex justify-center items-center">

               <button 
        onClick={handleDownload}
        className="mb-8 px-6 py-3 transition-colors  flex items-center cursor-pointer border-2 border-black bg-black hover:bg-white hover:text-black text-white duration-300 font-bold "
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Certificate
      </button>
</div>

<div className="min-h-screen py-12 px-4 bg-white flex items-center justify-center">
  <div ref={certificateRef} className="rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-10 border-8 border-[#95854c] bg-gradient-to-br from-[#c7b48c] via-[#95854c] to-[#675853] text-white relative overflow-hidden">
    {/* Decorative elements */}
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f1e8c6] via-[#95854c] to-[#675853]"></div>
    <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-[#675853] via-[#95854c] to-[#f1e8c6]"></div>
    
    {/* Certificate Seal */}
    <div className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#c7b48c] border-4 border-white flex items-center justify-center">
      <FaTrophy className="text-3xl sm:text-4xl text-white" />
    </div>
    
    {/* Certificate Header */}
    <div className="text-center mb-8 sm:mb-10 relative">
      <div className="flex justify-center mb-4">
        <FaScroll className="text-4xl mr-2 text-white/80" />
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f1e8c6]">
          Certificate of Completion
        </h1>
        <FaGraduationCap className="text-4xl ml-2 text-white/80" />
      </div>
      <p className="text-lg sm:text-xl flex items-center justify-center">
        <GiSparkles className="mr-2" /> This is to certify that <GiSparkles className="ml-2" />
      </p>
    </div>
    
    {/* Certificate Body */}
    <div className="text-center">
      <h2 className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f1e8c6]">
        {certificateData.userName} 
      </h2>
      <h2 className="text-md sm:text-xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#f1e8c6]">
        {certificateData.userEmail} 
      </h2>
      <p className="text-lg sm:text-xl mb-6 sm:mb-8 flex items-center justify-center">
        <FaCheck className="mr-2" /> has successfully completed the course <BsBook className="ml-2" />
      </p>
      <h3 className="text-2xl sm:text-3xl font-semibold mb-8 sm:mb-10 border-b-2 border-t-2 border-white/50 py-3 px-6 inline-block">
        {certificateData.courseName}
      </h3>
      
      <div className="my-6 sm:my-8 border-t-2 border-b-2 border-white/70 py-4 relative">
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-white"></div>
        <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full bg-white"></div>
        
        <p className="mb-2 flex items-center justify-center">
          <FaCalendarAlt className="mr-2" /> Completed on: <span className="font-bold ml-2">{formattedDate}</span>
        </p>
        <p className="flex items-center justify-center">
          <FaIdCard className="mr-2" /> Certificate ID: <span className="font-bold ml-2">{id}</span>
        </p>
      </div>
      
      <p className="mt-8 sm:mt-10 mb-6 text-lg flex flex-col items-center">
        <PiConfettiFill className="mb-2 text-2xl" />
        <span>We congratulate you on this achievement and wish you continued success.</span>
      </p>
    </div>
    
    {/* Certificate Footer */}
    <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row justify-between items-center">
      <CanvasSignature
        signerName="HAMMAD RAZA" 
        role="CEO & DEV" 
      />
      <div className="text-center">
        <p className="text-sm font-bold flex items-center justify-center">
          <FaLock className="mr-2" /> Certificate ID: {id}
        </p>
      </div>
    </div>
    
    {/* Corner decorations */}
    <div className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-white"></div>
    <div className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-white"></div>
   
   
    <div className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-white"></div>
    <div className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-white"></div>
  </div>
</div>

  </AdminWrapper>

</>
  );
}

export default CertificatePage;
