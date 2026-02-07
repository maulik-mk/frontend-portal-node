'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface OTPInputProps {
   value: string;
   onChange: (value: string) => void;
   maxLength?: number;
   containerClassName?: string;
   inputClassName?: string;
   disabled?: boolean;
}

const OTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(
   ({ value, onChange, maxLength = 6, containerClassName, inputClassName, disabled }, ref) => {
      const inputRef = React.useRef<HTMLInputElement>(null);
      const [isFocused, setIsFocused] = React.useState(false);

      React.useImperativeHandle(ref, () => inputRef.current!);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
         const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, maxLength);
         onChange(newValue);
      };

      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
         if (e.key === 'Enter' && value.length === maxLength) {
         }
      };

      const handleClick = () => {
         inputRef.current?.focus();
      };

      const digits = value.split('');
      const boxes = Array.from({ length: maxLength });

      return (
         <div
            className={cn('relative flex items-center justify-center gap-2', containerClassName)}
            onClick={handleClick}
         >
            <input
               ref={inputRef}
               type="text"
               inputMode="numeric"
               pattern="[0-9]*"
               maxLength={maxLength}
               value={value}
               onChange={handleChange}
               onKeyDown={handleKeyDown}
               onFocus={() => setIsFocused(true)}
               onBlur={() => setIsFocused(false)}
               disabled={disabled}
               className="absolute inset-0 z-10 cursor-default opacity-0"
               style={{ caretColor: 'transparent' }}
            />

            {boxes.map((_, index) => {
               const isCurrentFocus =
                  isFocused &&
                  (index === value.length ||
                     (index === maxLength - 1 && value.length === maxLength));
               const hasValue = index < value.length;

               return (
                  <div
                     key={index}
                     className={cn(
                        'flex size-11 items-center justify-center rounded-md border text-lg font-medium transition-all duration-200 sm:size-12',
                        'bg-background border-border text-foreground shadow-sm',
                        isCurrentFocus && 'border-primary ring-2 ring-primary/20',
                        !hasValue && !isCurrentFocus && 'text-muted-foreground/30',
                        disabled && 'cursor-not-allowed opacity-50',
                        inputClassName,
                     )}
                  >
                     {hasValue ? digits[index] : ''}
                     {isCurrentFocus && !hasValue && (
                        <div className="h-5 w-0.5 animate-pulse bg-primary" />
                     )}
                  </div>
               );
            })}
         </div>
      );
   },
);

OTPInput.displayName = 'OTPInput';

export { OTPInput };
