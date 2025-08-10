// components/AudioRecorder.js
"use client";


export   async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "audio_upload"); // Your unsigned preset

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/doti8hbup/video/upload", // replace with your cloud name
      { method: "POST", body: formData }
    );

    const data = await res.json();
    return data.secure_url; // Cloudinary file URL
  }

