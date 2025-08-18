import { useRef, useEffect } from 'react';

const CanvasSignature = ({ signerName = "Hammad Raza", role = "CEO & DEV" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Signature styling
    ctx.font = "italic 500 28px 'Dancing Script', cursive";
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#ffffff";
    
    // Simulate signature (adjust coordinates as needed)
    ctx.beginPath();
    ctx.moveTo(10, 30);
    ctx.lineTo(40, 15);
    ctx.lineTo(80, 35);
    ctx.stroke();
    
    // Add printed name below
    ctx.font = "normal 12px 'Arial', sans-serif";
    ctx.fillText(signerName, 10, 50);
  }, [signerName]);

  return (
    <div className="text-center">
      <canvas 
        ref={canvasRef} 
        width={150} 
        height={60}
        className="mx-auto"
      />
      <div className="h-0.5 w-24 bg-white mx-auto my-1"></div>
      <p className="text-xs opacity-80">{role}</p>
    </div>
  );
};

export default CanvasSignature