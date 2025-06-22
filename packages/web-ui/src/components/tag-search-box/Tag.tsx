import React, { Component, createRef } from 'react';
import { TagInput } from '@/components/tag-search-box/TagInput';
import { FocusPosType } from '@/components/tag-search-box/TagSearchBox';
import { X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Value, AttributeValue } from '@/components/tag-search-box/AttributeSelect';

export interface TagValue {
  /**
   * 标签属性
   */
  attr?: AttributeValue;
  /**
   * 标签属性值
   */
  values?: Value[];
}

interface TagProps {
  /**
   * 标签属性
   */
  attr?: AttributeValue;
  /**
   * 标签属性值
   */
  values?: Value[];
  /**
   * 触发标签相关事件
   */
  dispatchTagEvent?: (type: string, payload?: any) => void;
  /**
   * 所有属性集合
   */
  attributes: AttributeValue[];
  /**
   * 当前聚焦状态
   */
  focused: FocusPosType | null;
  /**
   * 最大长度
   */
  maxWidth?: number | null;
  /**
   * 搜索框是否处于展开状态
   */
  active: boolean;
}

interface TagRef {
  focusTag: () => void;
  focusInput: () => void;
  resetInput: () => void;
  setInputValue: (value: string, callback?: () => void) => void;
  getInputValue: () => string | undefined;
  addTagByInputValue: () => boolean | undefined;
  addTagByEditInputValue: () => boolean | undefined;
  setInfo: (info: any, callback?: () => void) => void;
  moveToEnd: () => void;
  getInfo: any;
  edit: (pos: string) => void;
  editDone: () => void;
}

const keys: Record<string, string> = {
  '8': 'backspace',
  '13': 'enter',
  '37': 'left',
  '38': 'up',
  '39': 'right',
  '40': 'down',
};

export class Tag extends Component<TagProps, { inEditing: boolean }> implements TagRef {
  private contentRef = createRef<HTMLDivElement>();
  private inputInsideRef: any = null;
  private inputRef: any = null;

  constructor(props: TagProps) {
    super(props);
    this.state = {
      inEditing: false,
    };
  }

  handleTagClick = (e: React.MouseEvent, pos?: string) => {
    e.stopPropagation();
    this.props.dispatchTagEvent?.('click', pos);
  };

  handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    this.props.dispatchTagEvent?.('del');
  };

  handleKeyDown = (e: React.KeyboardEvent) => {
    if (!keys[e.keyCode]) return;

    e.preventDefault();

    switch (keys[e.keyCode]) {
      case 'tab':
      case 'enter':
        this.props.dispatchTagEvent?.('click', 'value');
        break;
      case 'backspace':
        this.props.dispatchTagEvent?.('del', 'keyboard');
        break;
    }
  };

  focusTag = () => {
    this.inputInsideRef?.focusInput();
  };

  focusInput = () => {
    this.inputRef?.focusInput();
  };

  resetInput = () => {
    this.inputInsideRef?.resetInput();
  };

  setInputValue = (value: string, callback?: () => void) => {
    this.inputRef?.setInputValue(value, callback);
  };

  getInputValue = () => {
    return this.inputRef?.getInputValue();
  };

  addTagByInputValue = () => {
    return this.inputRef?.addTagByInputValue();
  };

  addTagByEditInputValue = () => {
    if (!this.inputInsideRef) return;
    return this.inputInsideRef?.addTagByInputValue();
  };

  setInfo = (info: any, callback?: () => void) => {
    return this.inputRef?.setInfo(info, callback);
  };

  moveToEnd = () => {
    return this.inputRef?.moveToEnd();
  };

  getInfo = () => {
    const { attr, values } = this.props;
    const info = { attr, values };
    return info;
  };

  edit = (pos: string) => {
    this.setState({ inEditing: true });
    const input = this.inputInsideRef;
    input?.setInfo(this.getInfo(), () => {
      if (pos === 'attr') {
        return input.selectAttr();
      }
      return input.selectValue();
    });
  };

  editDone = () => {
    this.setState({ inEditing: false });
  };

  render() {
    const { attr, values, dispatchTagEvent, attributes, focused, maxWidth, active } = this.props;
    const { inEditing } = this.state;

    const formattedAttrStr = attr && attr.name ? `${attr.name}: ` : '';
    const valueStr = (values || []).map(item => item.name).join(' | ');
    const removeable = attr && 'removeable' in attr ? attr.removeable : true;

    return (
      <div onClick={e => this.handleTagClick(e)} tabIndex={0} role="button" ref={this.contentRef}>
        <div
          className={cn(
            'group relative inline-flex items-center gap-1',
            'rounded-md border border-input bg-background px-2 py-1',
            'text-sm transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'cursor-text',
            'focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1',
            'mt-[3px] mr-[3px]',
          )}
          style={{
            display: inEditing ? 'none' : undefined,
          }}
        >
          {attr && (
            <span
              className="text-muted-foreground/80 text-xs"
              onClick={e => {
                e.stopPropagation();
                this.handleTagClick(e, 'attr');
              }}
            >
              {formattedAttrStr}
            </span>
          )}
          <span
            className="font-medium text-xs"
            onClick={e => {
              e.stopPropagation();
              this.handleTagClick(e, 'value');
            }}
          >
            {valueStr}
          </span>
          {removeable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      'ml-1 rounded-sm opacity-70 ring-offset-background',
                      'transition-opacity hover:opacity-100',
                      'focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1',
                      'disabled:pointer-events-none disabled:opacity-50',
                    )}
                    onClick={this.handleDelete}
                    disabled={!active}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove tag</span>
                  </button>
                </TooltipTrigger>
                {active && (
                  <TooltipContent side="bottom" className="text-xs">
                    <p>Click to remove tag</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {active && (
          <TooltipProvider>
            <Tooltip>
              <TooltipContent side="bottom" className="text-xs">
                <p>Click to modify. Press Enter to finish.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TagInput
          type="edit"
          hidden={!inEditing}
          maxWidth={maxWidth!}
          handleKeyDown={this.handleKeyDown}
          active={active}
          ref={(input: any) => (this.inputInsideRef = input) as any}
          attributes={attributes}
          dispatchTagEvent={dispatchTagEvent!}
          isFocused={focused === FocusPosType.INPUT_EDIT}
        />
      </div>
    );
  }
}
