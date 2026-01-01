import React from 'react';
import { GrossNetTool } from './components/GrossNetTool';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f9fafb] flex justify-center items-start pt-6 pb-12 px-4 font-sans text-gray-900">
      <div className="w-full max-w-[460px] mx-auto">
        <GrossNetTool />
      </div>
    </div>
  );
}