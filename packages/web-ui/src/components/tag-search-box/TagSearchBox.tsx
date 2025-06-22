import React, { Component, createRef, forwardRef } from "react";
import clone from "clone";
import { Tag, TagValue } from "@/components/tag-search-box/Tag";
import { TagInput } from "@/components/tag-search-box/TagInput";
import { mergeRefs } from "@/components/tag-search-box/utils/MergeRefs";
import { TagSearchBoxContext } from "@/components/tag-search-box/TagSearchboxContext";
import { withOutsideClick } from "@/components/tag-search-box/utils/withOutsideClick";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { X, Info, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttributeValue } from "@/components/tag-search-box/AttributeSelect";

export type { AttributeValue, TagValue };

/**
 * 焦点所在位置类型
 */
export enum FocusPosType {
  INPUT = 0,
  INPUT_EDIT = 1,
  TAG = 2,
}

let COUNTER = 0;

interface TagSearchBoxProps {
  /**
   * 要选择过滤的资源属性的集合
   */
  attributes?: AttributeValue[];
  /**
   * 搜索框中默认包含的标签值的集合
   */
  defaultValue?: TagValue[];
  /**
   * 配合 onChange 作为受控组件使用
   */
  value?: TagValue[];
  /**
   * 当新增/修改/减少标签时调用此函数
   *
   * **💡 用于触发搜索**
   */
  onChange?: (tags: TagValue[]) => void;
  /**
   * 搜索框收起后宽度
   * @default 210
   */
  minWidth?: string | number;
  /**
   * 是否禁用
   * @default false
   * @since 2.4.1
   */
  disabled?: boolean;
  /**
   * 搜索框中提示语
   *
   * @default "多个关键字用竖线 "|" 分隔，多个过滤标签用回车键分隔" （已处理国际化）
   */
  tips?: string;
  /**
   * 资源属性选择下拉框提示
   *
   * @default "选择资源属性进行过滤" （已处理国际化）
   */
  attributesSelectTips?: string;
  /**
   * 隐藏帮助按钮
   *
   * @default false
   */
  hideHelp?: boolean;
  /**
   * 清空按钮点击回调
   *
   * @since 2.2.2
   */
  onClearButtonClick?: (e: React.MouseEvent) => void;
  /**
   * 帮助按钮点击回调
   *
   * 返回 `false` 阻止默认提示行为
   *
   * @since 2.2.2
   */
  onHelpButtonClick?: (e: React.MouseEvent) => void | false;
  /**
   * 搜索按钮点击回调
   *
   * @since 2.2.2
   */
  onSearchButtonClick?: (e: React.MouseEvent, value: TagValue[]) => void;
  /**
   * 禁用根据输入值过滤资源属性选项
   *
   * **新增或修改标签时将展示全部资源属性**
   *
   * @since 2.4.0
   * @default false
   */
  disableAttributesFilter?: boolean;
  /**
   * 删除单个标签的回调
   *
   * 返回 `false` 阻止删除
   *
   * @since 2.7.4
   */
  onDeleteTag?: (tag: TagValue) => Promise<boolean> | boolean;
}

interface TagSearchBoxState {
  active: boolean;
  curPos: number;
  curPosType: FocusPosType;
  showSelect: boolean;
  tags: TagValue[];
  lastValue?: TagValue[];
}

class ITagSearchBox extends Component<
  TagSearchBoxProps & {
    forwardRef?: React.Ref<HTMLDivElement>;
  },
  TagSearchBoxState
> {
  static displayName = "TagSearchBox";

  private searchWrapRef = createRef<HTMLDivElement>();
  private searchBoxRef = createRef<HTMLDivElement>();
  private tagRefs: { [key: string]: any } = {};

  constructor(props: TagSearchBoxProps) {
    super(props);
    this.tagRefs = {};

    const { defaultValue = [], value } = props;
    const initialTags = defaultValue.map((item) => {
      const newItem = clone(item);
      // @ts-ignore
      newItem["_key"] = COUNTER++;
      return newItem;
    });

    this.state = {
      active: false,
      curPos: 0,
      curPosType: FocusPosType.INPUT,
      showSelect: true,
      tags: initialTags,
      lastValue: value,
    };
  }

  componentDidUpdate(prevProps: TagSearchBoxProps) {
    const { value } = this.props;
    if (value !== prevProps.value) {
      const tagValue =
        value?.map((item) => {
          const newItem = clone(item);
          if (!("_key" in newItem)) {
            // @ts-ignore
            newItem["_key"] = COUNTER++;
          }
          return newItem;
        }) || [];

      this.setState({
        tags: clone(tagValue),
        lastValue: value,
      });
    }
  }

  // 重置标签状态
  private resetTagsState = (
    props: TagSearchBoxProps,
    callback?: () => void
  ) => {
    if ("value" in props) {
      const tagValue =
        props.value?.map((item) => {
          const newItem = clone(item);
          if (!("_key" in newItem)) {
            // @ts-ignore
            newItem["_key"] = COUNTER++;
          }
          return newItem;
        }) || [];

      this.setState({ tags: clone(tagValue) }, () => {
        if (callback) setTimeout(callback, 0);
      });
    }
  };

  // 打开搜索框
  open = () => {
    const { disabled } = this.props;
    const { active, tags = [] } = this.state;

    if (disabled) {
      return;
    }

    if (!active) {
      this.setState({ active: true });
      this.setState({ curPosType: FocusPosType.INPUT, curPos: tags.length });
    } else {
      this.handleTagEvent("click-input", tags.length);
    }
    this.setState({ showSelect: true });

    setTimeout(() => {
      this.tagRefs[`tag-${tags.length}`]?.moveToEnd();
    }, 100);
  };

  // 关闭搜索框
  close = () => {
    const { active, tags } = this.state;
    const updatedTags = tags.map((item, index) => {
      const newItem = clone(item);
      // @ts-ignore
      if (newItem["_edit"]) {
        this.tagRefs[`tag-${index}`]?.editDone();
        // @ts-ignore
        newItem["_edit"] = false;
      }
      return newItem;
    });

    this.setTags(
      updatedTags,
      () => {
        this.setState({ showSelect: false }, () => {
          if (active) {
            this.setState({ active: false }, () => {
              this.setState({ curPos: -1 });
              if (this.searchBoxRef.current) {
                this.searchBoxRef.current.scrollLeft = 0;
              }
            });
          }
        });
      },
      false
    );
  };

  // 获取标签值
  private getValue = (tags: TagValue[]) => {
    const result: TagValue[] = [];

    tags.forEach((item) => {
      const { values, attr = undefined } = item;
      if (values && values.length > 0) {
        result.push({
          attr,
          values,
          // @ts-ignore
          _key: item["_key"],
          // @ts-ignore
          _edit: item["_edit"],
        });
      }
    });

    return result;
  };

  // 通知变更
  private notify = (tags: TagValue[]) => {
    const { onChange = () => {} } = this.props;
    onChange(this.getValue(tags));
  };

  // 设置标签状态
  private setTags = (
    newTags: TagValue[],
    callback?: (() => void) | null,
    shouldNotify = true
  ) => {
    const { value } = this.props;
    const cb = () => {
      if (shouldNotify) {
        this.notifyChange(newTags);
      }
      if (callback) {
        callback();
      }
    };

    // 受控模式
    if (shouldNotify && value) {
      this.resetTagsState(this.props, cb);
    } else {
      this.setState({ tags: newTags }, () => {
        setTimeout(cb, 0);
      });
    }
  };

  // 通知标签变更
  private notifyChange = (tags: TagValue[]) => {
    this.notify(tags);
  };

  // 处理清除按钮点击
  private handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { onClearButtonClick = () => {} } = this.props;
    onClearButtonClick(e);

    const { tags } = this.state;
    const nextTags = tags.filter((i) => i.attr && i.attr.removeable === false);
    const index = `tag-${nextTags.length}`;

    if (tags.length <= 0) {
      this.tagRefs[index]?.setInputValue("");
      return;
    }

    this.setTags(nextTags, () => {
      return setTimeout(() => {
        this.tagRefs[index]?.setInputValue("");
        this.tagRefs[index]?.focusInput();
      }, 0);
    });

    this.setState({
      curPos: 0,
      curPosType: FocusPosType.INPUT,
    });

    // 刷新下拉列表位置
    const input = this.tagRefs[`tag-${tags.length}`];
    if (input) {
      input?.scheduleUpdate?.();
    }
  };

  // 处理帮助按钮点击
  private handleHelp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { onHelpButtonClick = () => {} } = this.props;

    if (onHelpButtonClick(e) === false) {
      return;
    }
  };

  // 处理搜索按钮点击
  private handleSearch = (e: React.MouseEvent) => {
    const { active, tags } = this.state;
    const { onSearchButtonClick = () => {} } = this.props;

    if (!active) {
      // 如果监听了按钮点击，此时点击按钮不激活搜索框
      if ("onSearchButtonClick" in this.props) {
        e.stopPropagation();
        onSearchButtonClick(e, this.getValue(tags));
      }
      return;
    }

    e.stopPropagation();

    // 输入值生成标签操作会异步改变 tags
    // 此处保证 tags 状态变化完成后再进行回调
    setTimeout(() => {
      onSearchButtonClick(e, this.getValue(tags));
    }, 100);

    let flag = false;

    const input = this.tagRefs[`tag-${tags.length}`];
    if (input && input.addTagByInputValue) {
      if (input.addTagByInputValue()) {
        flag = true;
      }
    }

    for (let i = 0; i < tags.length; ++i) {
      const tagInput = this.tagRefs[`tag-${i}`];
      if (!tagInput || !tagInput.addTagByEditInputValue) return;

      // @ts-ignore
      if (tags[i]["_edit"] && tagInput.addTagByEditInputValue()) {
        flag = true;
      }
    }

    if (flag) return;

    this.notify(tags);
    input.focusInput();
  };

  // 处理标签事件
  private handleTagEvent = async (
    type: string,
    index: number,
    payload?: any
  ) => {
    const { tags } = this.state;
    const newTags = clone(tags);

    switch (type) {
      case "add":
        payload["_key"] = COUNTER++;
        newTags.splice(++index, 0, payload);
        this.setTags(newTags, () => {
          this.tagRefs[`tag-${index}`]?.focusInput();
        });
        this.setState({ showSelect: false });
        break;

      case "edit":
        this.tagRefs[`tag-${index}`]?.editDone();
        newTags[index].attr = payload.attr;
        newTags[index].values = payload.values;
        // @ts-ignore
        newTags[index]["_edit"] = false;
        this.setTags(newTags);
        index++;
        this.setState({
          showSelect: false,
          curPosType: FocusPosType.INPUT,
        });
        break;

      case "edit-cancel":
        this.tagRefs[`tag-${index}`]?.editDone();
        this.setTags(newTags, () => null, false);
        this.setState({
          showSelect: false,
          curPosType: FocusPosType.INPUT,
        });
        break;

      case "editing":
        if ("attr" in payload && newTags[index])
          newTags[index].attr = payload.attr;
        if ("values" in payload && newTags[index])
          newTags[index].values = payload.values;
        this.setTags(newTags, null, false);
        break;

      case "del":
        if (payload === "keyboard") index--;
        if (!newTags[index]) break;

        const { onDeleteTag } = this.props;
        const canDeleteTag = await onDeleteTag?.(newTags[index]);
        if (onDeleteTag && !Boolean(canDeleteTag)) break;

        const attr = newTags[index].attr;
        if (attr && attr?.removeable === false) {
          break;
        }

        newTags.splice(index, 1);
        this.setTags(newTags, () => {
          this.setState({ curPosType: FocusPosType.INPUT });
        });

        if (payload !== "edit") {
          this.setState({ showSelect: false });
        }
        break;

      case "click":
        if (!this.state.active) {
          this.open();
          return;
        }

        const pos = payload;
        // @ts-ignore
        newTags[index]["_edit"] = true;
        this.setTags(
          newTags,
          () => {
            this.setState({ showSelect: true }, () => {
              this.tagRefs[`tag-${index}`]?.edit(pos);
            });
          },
          false
        );
        this.setState({ curPosType: FocusPosType.INPUT_EDIT });
        break;

      case "click-input":
        if (payload === "edit") {
          this.setState({ curPosType: FocusPosType.INPUT_EDIT });
        } else {
          this.setState({ curPosType: FocusPosType.INPUT });
        }

        if (!this.state.active) {
          this.setState({ active: true });
        }

        this.setState({ showSelect: true });
        break;
    }

    this.setState({ curPos: index });
  };

  render() {
    const {
      attributes = [],
      hideHelp,
      tips = 'Separate keywords with "|"; press Enter to separate filter tags',
      attributesSelectTips = "Select a filter",
      disableAttributesFilter,
      disabled,
      forwardRef,
    } = this.props;

    const { active, curPos, curPosType, showSelect, tags } = this.state;

    // 用于计算 focused 及 isFocused, 判断是否显示选择组件
    let focusedInputIndex = -1;
    if (
      curPosType === FocusPosType.INPUT ||
      curPosType === FocusPosType.INPUT_EDIT
    ) {
      focusedInputIndex = curPos;
    }

    // 渲染标签列表
    const tagList = tags.map((item, index) => {
      // 补全 attr 属性
      attributes.forEach((attrItem) => {
        if (item.attr && attrItem.key && attrItem.key == item.attr.key) {
          item.attr = Object.assign({}, item.attr, attrItem);
        }
      });

      const selectedAttrKeys: string[] = [];
      tags.forEach((tag) => {
        if (
          tag.attr &&
          item.attr &&
          // @ts-ignore
          item["_edit"] &&
          item.attr.key === tag.attr.key
        ) {
          return null;
        }
        if (tag.attr && tag.attr.key && !tag.attr.reusable) {
          selectedAttrKeys.push(tag.attr.key);
        }
      });

      const useableAttributes = attributes.filter(
        (item) => selectedAttrKeys.indexOf(item.key) < 0
      );

      return (
        <Tag
          ref={(tag) => (this.tagRefs[`tag-${index}`] = tag) as any}
          active={active}
          // @ts-ignore
          key={item["_key"]}
          attributes={useableAttributes}
          attr={item.attr}
          values={item.values}
          maxWidth={
            this.searchWrapRef.current
              ? this.searchWrapRef.current.clientWidth
              : null
          }
          focused={
            focusedInputIndex === index && showSelect ? curPosType : null
          }
          dispatchTagEvent={(type, payload) =>
            this.handleTagEvent(type, index, payload)
          }
        />
      );
    });

    // 过滤可用属性
    const selectedAttrKeys = tags
      .map((item) => (item.attr && !item.attr.reusable ? item.attr.key : null))
      .filter((item) => !!item);

    const useableAttributes = attributes.filter(
      (item) => selectedAttrKeys.indexOf(item.key) < 0
    );

    // 添加输入标签
    tagList.push(
      <TagInput
        key="__input__"
        ref={(input) => (this.tagRefs[`tag-${tags.length}`] = input) as any}
        active={active}
        maxWidth={
          this.searchWrapRef.current
            ? this.searchWrapRef.current.clientWidth
            : null
        }
        attributes={useableAttributes}
        isFocused={focusedInputIndex === tags.length && showSelect}
        dispatchTagEvent={(type, payload) =>
          this.handleTagEvent(type, tags.length, payload)
        }
      />
    );

    return (
      <div className="w-full">
        <div
          className={cn(
            "w-full relative rounded-md border border-input",
            "pl-2 py-0",
            "bg-background text-sm leading-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "box-border",
            !active && ["overflow-hidden", "h-[34px]"],
            !disabled && [
              "cursor-text",
              active && "border-primary",
              active && "ring-4 ring-primary/20",
            ]
          )}
          ref={mergeRefs(this.searchWrapRef, forwardRef)}
          onClick={this.open}
        >
          <div
            className="inline-flex align-top flex-wrap"
            ref={mergeRefs(this.searchBoxRef)}
          >
            <TagSearchBoxContext.Provider
              value={{
                attributesSelectTips,
                disableAttributesFilter,
                close: this.close,
              }}
            >
              <React.Fragment>{tagList}</React.Fragment>
            </TagSearchBoxContext.Provider>
          </div>

          <div
            className={cn(
              "inline-block overflow-hidden",
              "pointer-events-none text-muted-foreground/70 text-sm whitespace-nowrap",
              "h-8 leading-8"
            )}
          >
            {tips}
          </div>

          <div
            className={cn(
              "inline-block absolute right-0 h-8",
              "bg-transparent"
            )}
          >
            {!!active && tags.length > 0 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 hover:bg-muted rounded-none"
                      onClick={this.handleClear}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Clear all tags
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {!!active && !hideHelp && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 hover:bg-muted rounded-none"
                      onClick={this.handleHelp}
                    >
                      <Info className="h-4 w-4" />
                      <span className="sr-only">Help</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    Show help
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-[30px] w-[30px] p-0 hover:bg-muted rounded-none rounded-r-md",
                      active && "text-primary"
                    )}
                    disabled={disabled}
                    onClick={this.handleSearch}
                  >
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Search</span>
                  </Button>
                </TooltipTrigger>
                {active && (
                  <TooltipContent side="bottom" className="text-xs">
                    Search
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Dialog>
          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-base">Help</DialogTitle>
            </DialogHeader>
            {/* <TagSearchBoxHelp /> */}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export const TagSearchBoxWithOutsideClick = withOutsideClick("close")(
  ITagSearchBox,
  {
    ignoreClasses: ["ignore-outside-click"],
  }
);

export const TagSearchBox = forwardRef<HTMLDivElement, TagSearchBoxProps>(
  (props, ref) => {
    return <TagSearchBoxWithOutsideClick {...props} forwardRef={ref} />;
  }
);

TagSearchBox.displayName = "TagSearchBox";
