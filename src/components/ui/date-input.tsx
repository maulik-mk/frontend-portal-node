'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './select';

interface DateInputProps {
   value?: Date | string | null;
   onChange?: (date: Date | null) => void;
   className?: string;
   disabled?: boolean;
}

const months = [
   { name: 'January', value: '01' },
   { name: 'February', value: '02' },
   { name: 'March', value: '03' },
   { name: 'April', value: '04' },
   { name: 'May', value: '05' },
   { name: 'June', value: '06' },
   { name: 'July', value: '07' },
   { name: 'August', value: '08' },
   { name: 'September', value: '09' },
   { name: 'October', value: '10' },
   { name: 'November', value: '11' },
   { name: 'December', value: '12' },
];

const DateInput = React.forwardRef<HTMLDivElement, DateInputProps>(
   ({ value, onChange, className, disabled }, ref) => {
      const [month, setMonth] = React.useState('');
      const [day, setDay] = React.useState('');
      const [year, setYear] = React.useState('');

      const currentYearNum = new Date().getFullYear();
      const years = React.useMemo(() => {
         const yearArray = [];
         for (let i = currentYearNum; i >= 1950; i--) {
            yearArray.push(i.toString());
         }
         return yearArray;
      }, [currentYearNum]);

      const maxDays = React.useMemo(() => {
         if (!month) return 31;
         const m = parseInt(month);
         const y = year ? parseInt(year) : 2024;
         return new Date(y, m, 0).getDate();
      }, [month, year]);

      const days = React.useMemo(() => {
         return Array.from({ length: maxDays }, (_, i) => (i + 1).toString().padStart(2, '0'));
      }, [maxDays]);

      React.useEffect(() => {
         if (value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
               setMonth((d.getMonth() + 1).toString().padStart(2, '0'));
               setDay(d.getDate().toString().padStart(2, '0'));
               setYear(d.getFullYear().toString());
            }
         }
      }, [value]);

      React.useEffect(() => {
         if (day && parseInt(day) > maxDays) {
            setDay(maxDays.toString().padStart(2, '0'));
         }
      }, [maxDays, day]);

      const handleDateChange = (m: string, d: string, y: string) => {
         if (m && d && y) {
            const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            if (!isNaN(date.getTime()) && date.getMonth() === parseInt(m) - 1) {
               onChange?.(date);
            } else {
               onChange?.(null);
            }
         } else {
            onChange?.(null);
         }
      };

      return (
         <div ref={ref} className={cn('flex items-center gap-2', className)}>
            {/* Month Select */}
            <div className="flex-1 min-w-[120px]">
               <Select
                  value={month}
                  onValueChange={(val) => {
                     setMonth(val);
                     handleDateChange(val, day, year);
                  }}
                  disabled={disabled}
               >
                  <SelectTrigger className="h-10 w-full border-border bg-dark-input/30 text-foreground hover:border-border">
                     <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent
                     position="popper"
                     className="bg-surface-container border-border text-foreground max-h-56 overflow-y-auto"
                  >
                     {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                           {m.name}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div>
               <p className="text-muted-foreground">/</p>
            </div>

            {/* Day Select */}
            <div className="w-[80px]">
               <Select
                  value={day}
                  onValueChange={(val) => {
                     setDay(val);
                     handleDateChange(month, val, year);
                  }}
                  disabled={disabled}
               >
                  <SelectTrigger className="h-10 w-full border-border bg-dark-input/30 text-foreground hover:border-border">
                     <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent
                     position="popper"
                     className="bg-surface-container border-border text-foreground max-h-56 overflow-y-auto"
                  >
                     {days.map((d) => (
                        <SelectItem key={d} value={d}>
                           {d}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div>
               <p className="text-muted-foreground">/</p>
            </div>

            {/* Year Select */}
            <div className="w-[100px]">
               <Select
                  value={year}
                  onValueChange={(val) => {
                     setYear(val);
                     handleDateChange(month, day, val);
                  }}
                  disabled={disabled}
               >
                  <SelectTrigger className="h-10 w-full border-border bg-dark-input/30 text-foreground hover:border-border">
                     <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent
                     position="popper"
                     className="bg-surface-container border-border text-foreground max-h-56 overflow-y-auto"
                  >
                     {years.map((y) => (
                        <SelectItem key={y} value={y}>
                           {y}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         </div>
      );
   },
);

DateInput.displayName = 'DateInput';

export { DateInput };
