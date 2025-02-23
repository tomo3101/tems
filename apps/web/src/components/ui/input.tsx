'use client';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';
import { Input, InputProps } from '@heroui/input';
import { useState } from 'react';

export const InputPassword = (props: InputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      endContent={
        <button
          aria-label="toggle password visibility"
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeSlashIcon className="size-6 text-default-400 pointer-events-none" />
          ) : (
            <EyeIcon className="size-6 text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
      {...props}
    />
  );
};
