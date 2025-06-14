import React, { Component } from "react";
import { searchFilter } from "@/components/tag-search-box/utils/SearchFilter";

import {
  Card,
  CardContent
} from "@/components/ui/card";
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

interface SingleValueSelectProps {
    values: Value[];
    inputValue: string;
    onChange?: (value: Value[]) => void;
    onSelect?: (value: Value[]) => void;
    offset: number;
    maxHeight: number;
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

interface SingleValueSelectRef {
  handleKeyDown: (keyCode: string | number) => boolean | undefined;
}

interface SingleValueSelectState {
  select: number;
  searchValue: string;
}

class SingleValueSelect extends Component<SingleValueSelectProps, SingleValueSelectState> {
  constructor(props: SingleValueSelectProps) {
    super(props);
    
    // Initialize selection
    let selectIndex = -1;
    props.values.forEach((item, index) => {
      if (item.name === props.inputValue) {
        selectIndex = index;
      }
    });


    this.state = {
      select: selectIndex,
      searchValue: ""
    };
  }

  componentDidMount() {
    const { select } = this.state;
    const { onSelect } = this.props;
    
    if (select < 0 && onSelect) {
      onSelect(this.getValue(select));
    }
  }

  static getDerivedStateFromProps(props: SingleValueSelectProps) {
    const list = props.values.map(item => item.name);
    const select = list.indexOf(props.inputValue);
    return { select };
  }

  getValue = (selectIndex: number) => {
    if (selectIndex < 0) return [];
    
    const { values, inputValue } = this.props;
    const list = values;
    
    if (selectIndex < list.length) {
      return [list[selectIndex]];
    } else {
      const newSelectIndex = list.map(item => item.name).indexOf(inputValue);
      this.setState({ select: newSelectIndex });
      
      if (newSelectIndex < 0) return [];
      return [list[newSelectIndex]];
    }
  };

  handleKeyDown = (keyCode: string | number) => {
    if (!keys[keyCode as keyof typeof keys]) return;

    const { onSelect } = this.props;
    const { select } = this.state;

    switch (keys[keyCode as keyof typeof keys]) {
      case "enter":
      case "tab":
        if (onSelect) {
          onSelect(this.getValue(select));
        }
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
    const list = values;
    if (list.length <= 0) return;
    
    this.setState(prevState => ({
      select: (prevState.select + step + list.length) % list.length
    }));
  };

  handleClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(this.getValue(index));
    }
  };

  render() {
    const { select, searchValue } = this.state;
    const {
      values,
      offset = 0,
      maxHeight = 300,
      searchable = false,
      maxWidth,
      itemRender = (x) => x
    } = this.props;

    const filteredItems = values
      .map((item, index) => ({ ...item, index }))
      .filter(({ name }) => searchFilter(name, searchValue))
      .map(({ index, ...item }) => (
        <div 
          key={index} 
          className={cn(
            "px-3 py-2 cursor-pointer text-sm rounded-md transition-colors",
            select === index 
              ? "bg-blue-100 text-blue-900" 
              : "hover:bg-slate-100"
          )}
          onClick={(e) => this.handleClick(e, index)}
        >
          <span 
            title={item.name} 
            style={item.style || {}}
            className="block truncate"
          >
            {itemRender(item.name, item)}
          </span>
        </div>
      ));

    return (
      <Card 
        className="border-none shadow-none py-0"
        style={{ 
          maxWidth: maxWidth || 300
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
        
        <CardContent className="p-1">
          <ScrollArea className="h-full" style={{ maxHeight: maxHeight }}>
            <div className="space-y-1 py-1">
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
      </Card>
    );
  }
}

// Create a forwardRef wrapper to maintain the ref functionality
const SingleValueSelectWithRef = React.forwardRef<SingleValueSelectRef, SingleValueSelectProps>((props, ref) => {
  const componentRef = React.useRef<SingleValueSelect>(null);

  React.useImperativeHandle(ref, () => ({
    handleKeyDown: (keyCode: string | number) => {
      return componentRef.current?.handleKeyDown(keyCode);
    }
  }));

  return <SingleValueSelect {...props} ref={componentRef} />;
});

export { SingleValueSelectWithRef as SingleValueSelect };