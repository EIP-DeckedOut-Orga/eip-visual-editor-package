import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { Check, ChevronDown } from "lucide-react";
import {
  CommandInput,
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../command";
import { Label } from "../label";

type AnyItemWithIdAndTitle = { id: string | number; title: string };

type ComboboxProps<T extends AnyItemWithIdAndTitle> = {
  identifier: string;
  trigger?: React.ReactNode;
  selectedValue: T;
  values: T[];
  label?: string;
  placeholder?: string;
  notFoundText?: string;
  wrapperClassName?: string;
  emptyStateText?: string;
  className?: string;
  itemsListWrapperClassName?: string;
  showLabel?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  setValue: (value: T) => void;
  commandItemRenderer?: (item: T, selectedValue: T) => React.ReactNode;
};

export function Combobox<T extends AnyItemWithIdAndTitle>({
  identifier,
  trigger,
  selectedValue,
  values,
  wrapperClassName,
  className,
  itemsListWrapperClassName,
  label,
  placeholder,
  emptyStateText = "None",
  notFoundText,
  showLabel = true,
  side = "bottom",
  align = "start",
  sideOffset = 0,
  setValue,
  commandItemRenderer,
}: ComboboxProps<T>) {
  const [open, setOpen] = useState(false);

  const defaultCommandItem = (v: T, selectedValue: T) => {
    return (
      <>
        <span className="truncate overflow-hidden text-left flex-1">{v.title}</span>
        <Check
          className={`ml-2 flex-shrink-0 ${
            v.id === selectedValue.id ? "opacity-100" : "opacity-0"
          }`}
        />
      </>
    );
  };

  const commandItemWrapper = (v: T) => {
    return (
      <CommandItem
        className={`flex justify-between items-center w-auto h-auto min-w-fit px-2 py-1 rounded-md cursor-pointer hover:bg-accent flex-shrink-0 ${
          v.id === selectedValue.id ? "bg-primary" : ""
        }`}
        value={`${v.id?.toString()}|${v?.title}`}
        onSelect={(currentValue) => {
          // Extract the ID from the combined value (ID is always the first part before the space)
          const idPart = currentValue.split("|")[0];
          const found = values.find(
            (item) => item.id?.toString() === idPart || item.title === currentValue
          );
          setValue(found || selectedValue);
          setOpen(false);
        }}
      >
        {commandItemRenderer
          ? commandItemRenderer(v, selectedValue)
          : defaultCommandItem(v, selectedValue)}
      </CommandItem>
    );
  };

  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      {showLabel && (
        <Label className="text-md font-bold text-foreground">{label || "Selected Item"}</Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {trigger || (
            <Button
              id={identifier}
              test-id={identifier}
              variant="outline"
              role="Combobox"
              aria-expanded={open}
              className={`w-full justify-between ${className}`}
            >
              <span className="truncate overflow-hidden text-left min-w-0">
                {selectedValue.title || emptyStateText}
              </span>
              <ChevronDown className="opacity-50 flex-shrink-0 ml-2" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          className={`w-[var(--radix-popover-trigger-width)] px-2 py-1 ${className}`}
          side={side}
          align={align}
          sideOffset={sideOffset}
        >
          <Command>
            <CommandInput placeholder={placeholder} className="focus:outline-none h-8" />
            <CommandList className="w-full max-h-full">
              <CommandEmpty>{notFoundText || "No items found."}</CommandEmpty>
              <CommandGroup>
                <div
                  key={"items-list-wrapper"}
                  className={itemsListWrapperClassName || "flex flex-col gap-2"}
                >
                  {values.map((v) => (
                    <React.Fragment key={v.id}>
                      {commandItemWrapper(v)}
                    </React.Fragment>
                  ))}
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
