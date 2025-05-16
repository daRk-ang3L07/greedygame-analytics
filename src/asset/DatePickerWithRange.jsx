"use client";
import * as React from "react";
import { addDays, format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Utility for class names, replace with your own or remove if not needed
function cn(...args) {
  return args.filter(Boolean).join(" ");
}

export function DatePickerWithRange({
  className,
  onChange,
  startDate,
  endDate,
}) {
  // Convert string dates to Date objects if provided
  const initialFrom = startDate ? parseISO(startDate) : new Date(2022, 0, 20);
  const initialTo = endDate ? parseISO(endDate) : addDays(initialFrom, 6);

  const [date, setDate] = React.useState({
    from: initialFrom,
    to: initialTo,
  });

  React.useEffect(() => {
    if (onChange && date?.from && date?.to) {
      onChange({ from: date.from, to: date.to });
    }
    // eslint-disable-next-line
  }, [date]);

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
