import React, { Component } from "react";
import { searchFilter } from "@/components/tag-search-box/utils/SearchFilter";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Value } from "@/components/tag-search-box/AttributeSelect";

const keys: Record<string, string> = {
  "8": "backspace",
  "9": "tab",
  "13": "enter",
  "37": "left",
  "38": "up",
  "39": "right",
  "40": "down",
};

interface IMultipleValueSelectProps {
  values: Value[];
  inputValue: string;
  onChange: (value: Value[]) => void;
  onSelect: (value: Value[]) => void;
  onCancel: () => void;
  offset: number;
  maxHeight: number;
  /**
   * 是否支持全选
   * @default true
   */
  all?: boolean;
  /**
   * 是否支持搜索
   * @default false
   * @since 2.5.0
   */
  searchable?: boolean;
  /**
   * 列表最大宽度
   * @since 2.7.9
   */
  maxWidth?: number | string;
  /**
   * 自定义渲染项
   * @since 2.7.9
   */
  itemRender?: (text: string, value: Value) => React.ReactNode;
}

interface IMultipleValueSelectRef {
  handleKeyDown: (keyCode: string | number) => boolean | undefined;
}

interface IMultipleValueSelectState {
  curIndex: number;
  select: number[];
  searchValue: string;
  lastInputValue: string;
}

class IMultipleValueSelect extends Component<
  IMultipleValueSelectProps,
  IMultipleValueSelectState
> {
  constructor(props: IMultipleValueSelectProps) {
    super(props);

    // Initialize selection
    const list = props.inputValue.split("|").map((i) => i.trim());
    const select: number[] = [];

    const formattedValues = props.values.map((item) => ({
      ...item,
      name: item.name.trim(),
    }));

    formattedValues.forEach((item, index) => {
      if (list.indexOf(item.name) >= 0) {
        select.push(index);
      }
    });

    this.state = {
      curIndex: 0,
      select,
      searchValue: "",
      lastInputValue: props.inputValue,
    };
  }

  componentDidMount() {
    const { select } = this.state;
    const { onSelect } = this.props;

    if (select.length <= 0 && onSelect) {
      onSelect(this.getValue(select));
    }
  }

  static getDerivedStateFromProps(
    props: IMultipleValueSelectProps,
    state: IMultipleValueSelectState
  ) {
    if (state.lastInputValue !== props.inputValue) {
      const list = props.inputValue.split("|").map((i) => i.trim());
      const select: number[] = [];

      const formattedValues = props.values.map((item) => ({
        ...item,
        name: item.name.trim(),
      }));

      formattedValues.forEach((item, index) => {
        if (list.indexOf(item.name) >= 0) {
          select.push(index);
        }
      });

      return { select, lastInputValue: props.inputValue };
    }
    return null;
  }

  getValue = (selectedIndexes: number[]) => {
    return selectedIndexes.map((i) => this.props.values[i]);
  };

  handleKeyDown = (keyCode: string | number) => {
    if (!keys[keyCode as keyof typeof keys]) return;

    const { curIndex, select } = this.state;
    const { onChange, onSelect } = this.props;

    switch (keys[keyCode as keyof typeof keys]) {
      case "tab":
        if (curIndex < 0) return false;
        if (curIndex === 0) {
          this.handleSelectAll();
          return false;
        }

        const newSelect = [...select];
        const pos = newSelect.indexOf(curIndex - 1);

        if (pos >= 0) {
          newSelect.splice(pos, 1);
        } else {
          newSelect.push(curIndex - 1);
        }

        this.setState({ select: newSelect });
        onChange?.(this.getValue(newSelect));
        return false;

      case "enter":
        onSelect?.(this.getValue(select));
        return false;

      case "up":
        this.move(-1);
        break;

      case "down":
        this.move(1);
        break;
    }
  };

  move = (step: number) => {
    const { values } = this.props;
    if (values.length <= 0) return;

    this.setState((prevState) => ({
      curIndex:
        (prevState.curIndex + step + (values.length + 1)) % (values.length + 1),
    }));
  };

  handleClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();

    if (
      (e.target as HTMLElement).tagName === "LABEL" ||
      (e.target as HTMLElement).tagName === "SPAN"
    ) {
      return;
    }

    const { select } = this.state;
    const { onChange } = this.props;
    const newSelect = [...select];
    const pos = newSelect.indexOf(index);

    if (pos >= 0) {
      newSelect.splice(pos, 1);
    } else {
      newSelect.push(index);
    }

    this.setState({ select: newSelect });
    onChange?.(this.getValue(newSelect));
  };

  handleSelectAll = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const { select } = this.state;
    const { values, onChange } = this.props;

    if (select.length === values.length) {
      this.setState({ select: [] });
      onChange?.([]);
    } else {
      const newSelect = values.map((_, index) => index);
      this.setState({ select: newSelect });
      onChange?.(values);
    }
  };

  handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { select } = this.state;
    const { onSelect } = this.props;
    onSelect?.(this.getValue(select));
  };

  handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { onCancel } = this.props;
    onCancel?.();
  };

  render() {
    const { curIndex, select, searchValue } = this.state;
    const {
      values,
      offset = 0,
      all = true,
      maxHeight = 350,
      searchable = false,
      maxWidth,
      itemRender = (x) => x,
    } = this.props;

    const filteredItems = values
      .map((item, index) => ({ ...item, index }))
      .filter(({ name }) => searchFilter(name, searchValue))
      .map(({ index, ...item }) => (
        <div
          key={index}
          className={cn(
            "flex items-center p-2 rounded-md cursor-pointer hover:bg-slate-100 transition-colors",
            curIndex === index + 1 ? "bg-slate-100" : ""
          )}
          onClick={(e) => this.handleClick(e, index)}
        >
          <div className="flex items-center gap-2">
            <Checkbox
              checked={select.indexOf(index) >= 0}
              id={`item-${index}`}
              className="data-[state=checked]:bg-blue-500"
            />
            <label
              htmlFor={`item-${index}`}
              className="text-sm cursor-pointer"
              style={item.style || {}}
              title={item.name}
            >
              {itemRender(item.name, item)}
            </label>
          </div>
        </div>
      ));

    return (
      <Card
        className="w-auto border-none shadow-none py-0 gap-0"
        style={{
          maxWidth: maxWidth || 300,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {searchable && (
          <div className="p-2 border-b">
            <Input
              placeholder="搜索..."
              value={searchValue}
              onChange={(e) => this.setState({ searchValue: e.target.value })}
              className="h-8"
            />
          </div>
        )}

        <CardContent className="p-0">
          <ScrollArea
            className="h-full max-h-[300px]"
            style={{ maxHeight: maxHeight - 50 }}
          >
            <div className="p-1">
              {all && !searchValue && (
                <div
                  className={cn(
                    "flex items-center p-2 rounded-md cursor-pointer hover:bg-slate-100 transition-colors",
                    curIndex === 0 ? "bg-slate-100" : ""
                  )}
                  onClick={this.handleSelectAll}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={select.length === values.length}
                      id="select-all"
                      className="data-[state=checked]:bg-blue-500"
                    />
                    <label
                      htmlFor="select-all"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Select All
                    </label>
                  </div>
                </div>
              )}

              {filteredItems.length === 0 ? (
                <div className="flex items-center justify-center p-4 text-sm text-slate-500">
                  没有匹配的结果
                </div>
              ) : (
                filteredItems
              )}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex justify-end p-2 [.border-t]:pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={this.handleSubmit}
              disabled={select.length === 0}
              variant="default"
              className="h-7 font-normal text-sm"
            >
              OK
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={this.handleCancel}
              className="h-7 font-normal text-sm"
            >
              Cancel
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
}

// Create a forwardRef wrapper to maintain the ref functionality
const MultipleValueSelect = React.forwardRef<
  IMultipleValueSelectRef,
  IMultipleValueSelectProps
>((props, ref) => {
  const componentRef = React.useRef<IMultipleValueSelect>(null);

  React.useImperativeHandle(ref, () => ({
    handleKeyDown: (keyCode: string | number) => {
      return componentRef.current?.handleKeyDown(keyCode);
    },
  }));

  return <IMultipleValueSelect {...props} ref={componentRef} />;
});

export { MultipleValueSelect };
