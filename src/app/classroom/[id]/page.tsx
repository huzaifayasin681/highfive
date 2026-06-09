"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useGlobal } from '@/context/GlobalContext';
import { useParams } from 'next/navigation';
import { Mic, MicOff, Video as VideoIcon, VideoOff, MonitorUp, PhoneOff, Edit3, MessageSquare, Paperclip, Sparkles, Upload, Loader2 } from 'lucide-react';

function WhiteboardCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set actual size in memory (scaled to account for high DPI devices if needed, but keeping it simple here)
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#1E40AF';
        ctx.lineWidth = 3;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  return (
    <div className="absolute inset-4 border-2 border-slate-300 rounded-2xl bg-white overflow-hidden cursor-crosshair">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        onMouseMove={draw}
        onTouchStart={startDrawing}
        onTouchEnd={endDrawing}
        onTouchMove={draw}
      />
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs text-slate-500 pointer-events-none font-medium">
        Try drawing on the canvas!
      </div>
    </div>
  );
}

export default function ClassroomPage() {
  const { state } = useGlobal();
  const params = useParams();
  const lessonId = params?.id as string;
  const lesson = state.lessons.find(l => l.id === lessonId);
  const [activeTab, setActiveTab] = useState('whiteboard');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [isGeneratingRecap, setIsGeneratingRecap] = useState(false);
  const [recapData, setRecapData] = useState(false);

  const handleGenerateRecap = () => {
    setIsGeneratingRecap(true);
    setTimeout(() => {
      setIsGeneratingRecap(false);
      setRecapData(true);
    }, 2000);
  };

  if (!lesson) {
    return <div className="p-20 text-center font-bold text-xl">Classroom not found</div>;
  }

  const tutor = state.tutors.find(t => t.id === lesson.tutorId);
  const student = state.students.find(s => s.id === lesson.studentId);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 bg-slate-800 border-b border-slate-700">
        <div className="font-bold text-lg">HighFive Classroom <span className="text-slate-400 font-normal ml-2">| {tutor?.name} & {student?.name}</span></div>
        <div className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm animate-pulse flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          Live 00:14:32
        </div>
      </div>

      <div className="flex flex-grow overflow-hidden">
        {/* Left Video Area */}
        <div className="w-1/2 p-4 flex flex-col gap-4 border-r border-slate-700">
          {/* Tutor Video */}
          <div className="flex-1 bg-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center">
            {camOn ? (
              <img src={tutor?.avatar} alt={tutor?.name} className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center text-4xl">{tutor?.name.charAt(0)}</div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg text-sm">{tutor?.name} (Tutor)</div>
          </div>
          
          {/* Student Video */}
          <div className="flex-1 bg-slate-800 rounded-2xl relative overflow-hidden flex items-center justify-center">
            <img src="https://i.pravatar.cc/150?u=s1" alt={student?.name} className="w-full h-full object-cover opacity-80" />
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg text-sm">{student?.name} (You)</div>
          </div>

          {/* Controls */}
          <div className="h-20 bg-slate-800 rounded-2xl flex items-center justify-center space-x-4">
            <button onClick={() => setMicOn(!micOn)} className={`p-4 rounded-full ${micOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'} transition-colors`}>
              {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>
            <button onClick={() => setCamOn(!camOn)} className={`p-4 rounded-full ${camOn ? 'bg-slate-700 hover:bg-slate-600' : 'bg-red-500 hover:bg-red-600'} transition-colors`}>
              {camOn ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
            <button className="p-4 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors">
              <MonitorUp className="w-6 h-6" />
            </button>
            <button className="p-4 rounded-full bg-red-500 hover:bg-red-600 transition-colors">
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Right Tools Area */}
        <div className="w-1/2 flex flex-col bg-slate-50 text-slate-900">
          <div className="flex border-b border-slate-200">
            <button onClick={() => setActiveTab('whiteboard')} className={`flex-1 py-4 font-semibold text-center border-b-2 transition-colors ${activeTab === 'whiteboard' ? 'border-highfive-blue text-highfive-blue bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}><Edit3 className="w-5 h-5 inline mr-2"/> Whiteboard</button>
            <button onClick={() => setActiveTab('chat')} className={`flex-1 py-4 font-semibold text-center border-b-2 transition-colors ${activeTab === 'chat' ? 'border-highfive-blue text-highfive-blue bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}><MessageSquare className="w-5 h-5 inline mr-2"/> Chat</button>
            <button onClick={() => setActiveTab('files')} className={`flex-1 py-4 font-semibold text-center border-b-2 transition-colors ${activeTab === 'files' ? 'border-highfive-blue text-highfive-blue bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}><Paperclip className="w-5 h-5 inline mr-2"/> Files</button>
            <button onClick={() => setActiveTab('recap')} className={`flex-1 py-4 font-semibold text-center border-b-2 transition-colors ${activeTab === 'recap' ? 'border-highfive-blue text-highfive-blue bg-white' : 'border-transparent text-slate-500 hover:bg-slate-100'}`}><Sparkles className="w-5 h-5 inline mr-2"/> Recap</button>
          </div>

          <div className="flex-grow p-4 relative">
            {activeTab === 'whiteboard' && <WhiteboardCanvas />}
            {activeTab === 'chat' && (
              <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex-grow p-4 overflow-y-auto space-y-4">
                  <div className="flex flex-col items-start">
                    <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                      <p className="text-sm text-slate-800">Hello! Ready to start the lesson?</p>
                    </div>
                    <span className="text-xs text-slate-400 mt-1">10:02 AM</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="bg-highfive-blue text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
                      <p className="text-sm">Yes, let's go over the homework first.</p>
                    </div>
                    <span className="text-xs text-slate-400 mt-1">10:03 AM</span>
                  </div>
                </div>
                <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center">
                  <input type="text" placeholder="Type a message..." className="flex-grow bg-white border border-slate-300 rounded-full px-4 py-2 outline-none focus:border-highfive-blue" />
                  <button className="ml-2 bg-highfive-blue text-white p-2 rounded-full"><MessageSquare className="w-5 h-5" /></button>
                </div>
              </div>
            )}
            {activeTab === 'files' && (
              <div className="h-full border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-white flex-col relative">
                <Upload className="w-12 h-12 text-highfive-blue mb-4" />
                <p className="text-slate-900 font-bold">Drag and drop files here</p>
                <p className="text-slate-500 mb-6 text-sm">PDF, DOCX, JPG up to 10MB</p>
                <label className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-200 cursor-pointer">
                  Browse Files
                  <input type="file" className="hidden" onChange={(e) => {
                    if(e.target.files && e.target.files.length > 0) {
                      alert(`Mock upload: ${e.target.files[0].name} shared with the class.`);
                    }
                  }} />
                </label>
              </div>
            )}
            {activeTab === 'recap' && (
              <div className="h-full bg-white rounded-2xl border border-slate-200 p-8 flex flex-col justify-center overflow-y-auto">
                {!isGeneratingRecap && !recapData ? (
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-highfive-blue mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">5-Minute Lesson Recap</h3>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">Generate an AI-powered summary of key concepts, formulas, and homework assigned during this session.</p>
                    <button 
                      onClick={handleGenerateRecap}
                      className="bg-gradient-to-r from-highfive-blue to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all w-fit mx-auto"
                    >
                      Generate Summary
                    </button>
                  </div>
                ) : isGeneratingRecap ? (
                  <div className="text-center text-slate-500">
                    <Loader2 className="w-12 h-12 text-highfive-blue mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Generating Recap...</h3>
                    <p>Our AI is analyzing the transcript and whiteboard.</p>
                  </div>
                ) : (
                  <div className="text-left space-y-4">
                    <div className="flex items-center space-x-2 text-purple-600 font-bold text-xl mb-4">
                      <Sparkles className="w-6 h-6" /> <span>AI Lesson Recap</span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-900 mb-2">Key Concepts Covered</h4>
                      <ul className="list-disc pl-5 text-slate-700 space-y-1">
                        <li>Introduction to Limits and continuity.</li>
                        <li>Evaluating limits algebraically.</li>
                        <li>L'Hopital's rule basics.</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-2">Assigned Homework</h4>
                      <p className="text-blue-800">Complete exercises 1-15 on page 42 of the textbook. Practice finding limits as x approaches infinity.</p>
                    </div>
                    <button onClick={() => setRecapData(false)} className="text-sm text-slate-400 hover:text-slate-600 mt-4 underline">Generate New Recap</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
