import React from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

const SelectDemo = ({ setFont }) => (
  <Select.Root
    onValueChange={(value) => setFont(value)}
    defaultValue="sans"
  >
    <Select.Trigger
      className="inline-flex items-center justify-center rounded px-[10px] text-[15px] leading-none h-[35px] gap-[5px] text-black dark:text-white data-[placeholder]:text-black outline-none"
      aria-label="Fonts"
    >
      <Select.Value placeholder="Select a font..." />
      <Select.Icon className="text-violet-800 dark:text-white">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
        <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-violet-800 cursor-default">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="p-[5px]">
          <Select.Group>
            <SelectItem value="serif">Serif</SelectItem>
            <SelectItem value="sans">Sans</SelectItem>
            <SelectItem value="mono">Mono</SelectItem>
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet-800 cursor-default">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const SelectItem = React.forwardRef(
  ({ children, className, ...props }, forwardedRef) => {
    return (
      <Select.Item
        className={classnames(
          "text-[13px] leading-none text-violet-800 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-blue-500 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-violet-100 data-[highlighted]:text-violet-900",
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

export default SelectDemo;
