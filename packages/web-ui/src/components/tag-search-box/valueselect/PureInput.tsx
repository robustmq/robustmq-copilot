import { useEffect, forwardRef, useImperativeHandle } from "react";

const keys: Record<string, string> = {
  "9": "tab",
  "13": "enter",
};

const getValue = (value: string) => {
  return value.split("|").map((item) => ({
    name: item.trim(),
  }));
};

export interface PureInputProps {
  inputValue: string;
  onChange: (value: any[]) => void;
  onSelect: (value: any[]) => void;
}

interface PureInputRef {
  handleKeyDown: (keyCode: string) => boolean;
}

export const PureInput = forwardRef<PureInputRef, PureInputProps>(
  ({ onChange, inputValue, onSelect }, ref) => {
    useEffect(() => {
      // 编辑完成时 inputValue 被置空，此时 onChange 会导致标签键寻找失败
      if (inputValue.trim()) {
        onChange(getValue(inputValue));
      }
    }, [inputValue, onChange]);

    const handleKeyDown = (keyCode: string) => {
      if (!keys[keyCode]) {
        return false;
      }

      switch (keys[keyCode]) {
        case "tab":
        case "enter":
          if (inputValue.length <= 0) return false;

          if (onSelect) {
            onSelect(getValue(inputValue).filter((i) => !!i.name));
          }
          return false;
      }
      return false;
    };

    useImperativeHandle(ref, () => ({
      handleKeyDown,
    }));

    return null;
  }
);

PureInput.displayName = "PureInput";
