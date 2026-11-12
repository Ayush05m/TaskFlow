"use client";
import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export function MultiSelect({ options, value, onChange, placeholder }: any) {
  const [open, setOpen] = useState(false);

  const toggleOption = (val: any) => {
    const newVal = value.includes(val)
      ? value.filter((v: any) => v !== val)
      : [...value, val];
    onChange(newVal);
  };

  const selectedLabels = options
    .filter((o: any) => value.includes(o.value))
    .map((o: any) => o.label)
    .join(", ");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedLabels || placeholder}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <Command>
          <CommandInput placeholder="Search member..." />
          <CommandList>
            {options.map((opt: any) => (
              <CommandItem
                key={opt.value}
                onSelect={() => toggleOption(opt.value)}
                className="flex justify-between"
              >
                {opt.label}
                {value.includes(opt.value) && <Check className="h-4 w-4 text-primary" />}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
