// components/AudioRecorder.js
"use client";
import { useState, useRef } from "react";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    chunksRef.current = [];
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const file = new File([blob], "recording.webm", { type: "audio/webm" });
      const cloudUrl = await uploadToCloudinary(file);
      setAudioUrl(cloudUrl);

    
    };

    mediaRecorder.start();
    setRecording(true);
  };
f
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  async function uploadToCloudinary(file) {
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

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {audioUrl && (
        <div>
          <p>Uploaded Audio:</p>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}
