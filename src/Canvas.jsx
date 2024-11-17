import React, { useEffect, useRef, useState } from "react";
import canvasImage from "./canvasimage"
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
function Canvas({ details }) {
    const { startIndex, numImages, duration, size, top, left, zIndex } = details;
    const [index, setIndex] = useState({ value: startIndex });
    const canvasRef = useRef(null);

    useGSAP(()=>{
        gsap.to(index, {
            value: startIndex + numImages-1,
            duration: duration,
            ease: "linear",
            repeat: -1,
            onUpdate: () => {
                setIndex({ value: Math.round(index.value) });
            }
        })
        gsap.from(canvasRef.current,{
            opacity:0,
            scale:0.8,
            duration:1,
            ease:"power2.inOut"
        })
    })

    useEffect(()=>{
        const scale =window.devicePixelRatio;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        
        const image = new Image();
        image.src = canvasImage[index.value];
        
        image.onload = () => {
            canvas.width =canvas.offsetWidth * scale;
            canvas.height = canvas.offsetWidth * scale;
            canvas.style.width = canvas.offsetWidth + "px";
            canvas.style.height = canvas.offsetWidth + "px";
            ctx.scale(scale, scale);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
    },[index])
    return (
    <canvas 
        data-scroll
        data-scroll-speed={Math.random().toFixed(1)}
        className="absolute" 
        ref={canvasRef} 
        style={{
            width: `${size * 1.6}px`, 
            height: `${size * 1.6}px`, 
            top: `${top}%`, 
            left: `${left}%`, 
            zIndex: `${zIndex}`
        }} 
        id="canvas"></canvas>
    )
}

export default Canvas