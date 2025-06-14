import React, { Component } from "react";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { CommandItem, Command, CommandGroup } from "@/components/ui/command";
import { TagSearchBoxContext } from "@/components/tag-search-box/TagSearchboxContext";
import { cn } from "@/lib/utils";

export interface Value {
  /**
   * 项标识
   */
  key?: string;
  /**
   * 属性展示值
   */
  name: string;
  /**
   * 项渲染样式
   */
  style?: React.CSSProperties;
}
export interface AttributeRenderProps {
  /**
   * 当前输入值
   */
  inputValue: string;
  /**
   * 监听某些操作键位被按下
   */
  onOperationalKeyDown?: (
    listener: (key: "ArrowDown" | "ArrowUp" | "Enter" | "Tab") => void
  ) => void;
  /**
   * 确认选择
   */
  onSelect: (value: Value[]) => void;
  /**
   * 取消
   */
  onCancel: () => void;
}
export type AttributeType = "input" | "single" | "multiple" | "render";
export type AttributeTypeOptions =
  | ["input", {}]
  | ["render", {}]
  | [
      "single",
      {
        /**
         * 是否启用搜索
         * @default false
         * @since 2.5.0
         */
        searchable?: boolean;
        /**
         * 无可选项时提示内容
         */
        emptyText?: React.ReactNode;
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
    ]
  | [
      "multiple",
      {
        /**
         * 是否开启全选
         * @default true
         */
        all?: boolean;
        /**
         * 是否启用搜索
         * @default false
         * @since 2.5.0
         */
        searchable?: boolean;
        /**
         * 无可选项时提示内容
         */
        emptyText?: React.ReactNode;
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
    ];
export interface AttributeValue {
  /**
   * 为资源属性需求值的类型
   *
   * 可使用数组形式进行详细配置，如：
   *
   * ```js
   * ["multiple", { all: true }]
   * ```
   *
   * 其中：
   *
   *`"single"`：
   *  - `searchable` 是否启用搜索
   *  - `emptyText` 无可选项时提示内容
   *  - `maxWidth` 列表最大宽度
   *  - `itemRender` 自定义渲染列表项
   *
   *`"multiple"`：
   *  - `all` 是否启用全选
   *  - `searchable` 是否启用搜索
   *  - `emptyText` 无可选项时提示内容
   *  - `maxWidth` 列表最大宽度
   *  - `itemRender` 自定义渲染列表项
   *
   * @docType "input" | "single" | "multiple" | "render" | [AttributeType, AttributeOptions]
   */
  type: AttributeType | AttributeTypeOptions;
  /**
   * 属性的唯一标识，会在结果中返回
   */
  key: string;
  /**
   * 资源属性值名称
   */
  name: string;
  /**
   * 资源属性可用值
   * @docType Value[] | (() => Value[]) | (() => Promise<Value[]>)
   */
  values?: Value[] | (() => Value[]) | (() => Promise<Value[]>);
  /**
   * 该属性是否可重复选择
   * @default false
   */
  reusable?: boolean;
  /**
   * 该属性是否可移除
   * @default true
   */
  removeable?: boolean;
  /**
   * 自定义渲染
   */
  render?: (props: AttributeRenderProps) => React.ReactNode;
}
export interface AttributeSelectProps {
  attributes: AttributeValue[];
  inputValue: string;
  onSelect?: (attribute: AttributeValue) => void;
  maxHeight: number;
}
export interface AttributeSelectState {
  select: number;
  lastInputValue: string;
}

const keys: Record<
  string,
  "backspace" | "tab" | "enter" | "left" | "up" | "right" | "down"
> = {
  "8": "backspace",
  "9": "tab",
  "13": "enter",
  "37": "left",
  "38": "up",
  "39": "right",
  "40": "down",
};

export class AttributeSelect extends Component<
  AttributeSelectProps,
  AttributeSelectState
> {
  static contextType = TagSearchBoxContext;
  declare context: React.ContextType<typeof TagSearchBoxContext>;

  constructor(props: AttributeSelectProps) {
    super(props);
    this.state = {
      select: -1,
      lastInputValue: props.inputValue,
    };
  }

  static getDerivedStateFromProps(
    props: AttributeSelectProps,
    state: AttributeSelectState
  ) {
    if (state.lastInputValue !== props.inputValue) {
      return { select: -1, lastInputValue: props.inputValue };
    }
    return null;
  }

  getUseableList() {
    const { attributes, inputValue } = this.props;
    const { disableAttributesFilter } = this.context;

    if (disableAttributesFilter) {
      return attributes;
    }
    // 获取冒号前字符串模糊查询
    const fuzzyValue = /(.*?)(:|：).*/.test(inputValue)
      ? RegExp.$1
      : inputValue;
    return attributes.filter(
      (item) => item.name.includes(inputValue) || item.name.includes(fuzzyValue)
    );
  }

  getAttribute(selectIndex: number) {
    const list = this.getUseableList();
    if (selectIndex < list.length) {
      return list[selectIndex];
    }
  }

  move = (step: number) => {
    const list = this.getUseableList();
    if (list.length <= 0) return;
    this.setState((prevState) => ({
      select: (prevState.select + step + list.length) % list.length,
    }));
  };

  handleKeyDown = (keyCode: string) => {
    if (!keys[keyCode]) return;

    const { onSelect } = this.props;
    const { select } = this.state;

    switch (keys[keyCode]) {
      case "enter":
      case "tab":
        if (select < 0) break;
        if (onSelect) {
          onSelect(this.getAttribute(select)!);
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

  handleClick = (index: number) => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(this.getAttribute(index)!);
    }
  };

  render() {
    const { maxHeight } = this.props;
    const { select } = this.state;
    const { attributesSelectTips } = this.context;

    const list = this.getUseableList().map((item, index) => (
      <CommandItem
        key={index}
        onSelect={(e) => this.handleClick(index)}
        className={cn(
          "flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm outline-none",
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
          select === index && "bg-accent text-accent-foreground"
        )}
      >
        {item.name}
      </CommandItem>
    ));

    if (list.length === 0) return null;

    return (
      <DropdownMenu>
        <Command style={{ maxHeight: maxHeight }}>
          <CommandGroup>
            {attributesSelectTips && (
              <CommandItem disabled>{attributesSelectTips}</CommandItem>
            )}
            {list}
          </CommandGroup>
        </Command>
      </DropdownMenu>
    );
  }
}
