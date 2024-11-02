// components/InputAuth.tsx

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputAuthProps {
    id: string;
    name: string;
    type: string;
    autoComplete?: 'none' | 'inline' | 'list' | 'both' | 'new-password';
    icon: LucideIcon;
    placeholder?: string;
    defaultValue?: string | number | undefined;
}

const InputAuth: React.FC<InputAuthProps> = ({ id, name, type, autoComplete, icon: Icon, placeholder, defaultValue }) => {
    return (
        <div className="relative">
            <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
                id={id}
                name={name}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                defaultValue={defaultValue} // Use defaultValue in the input element
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                aria-autocomplete={autoComplete === 'new-password' ? 'list' : autoComplete}
            />
        </div>
    );
};

export default InputAuth;