// app/components/InputAuth.tsx
'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
}

const InputAuth: React.FC<InputProps> = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <input
      {...props}
      className="w-full px-4 py-2 pl-10 bg-[#3B4C79] text-white placeholder-gray-400 rounded-md
      focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
  </div>
);

export default InputAuth;
