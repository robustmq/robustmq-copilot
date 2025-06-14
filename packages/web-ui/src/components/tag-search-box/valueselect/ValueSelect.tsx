import React, { Component } from "react";
import { PureInput } from "@/components/tag-search-box/valueselect/PureInput";
import { SingleValueSelect } from "@/components/tag-search-box/valueselect/SingleValueSelect";
import { MultipleValueSelect } from "@/components/tag-search-box/valueselect/MultipleValueSelect";
import { AttributeValue } from "@/components/tag-search-box/AttributeSelect";
import { Value } from "@/components/tag-search-box/AttributeSelect";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Loading } from "@/components/tag-search-box/valueselect/Loading";
import { Empty } from "@/components/tag-search-box/valueselect/Empty";

interface ValueSelectProps {
  /**
   * 值选择组件类型，用于选择不同组件
   */
  type: AttributeValue["type"];
  /**
   * 值选择组件可选值的集合
   */
  values?: AttributeValue["values"];
  /**
   * 当前输入值
   */
  inputValue: string;
  /**
   * 自定义渲染
   */
  render?: AttributeValue["render"];
  onChange?: (value: Value[]) => void;
  onSelect?: (value: Value[]) => void;
  onCancel?: () => void;
  offset: number;
  maxHeight: number;
}

interface ValueSelectRef {
  handleKeyDown: (keyCode: string | number) => boolean | void;
  handleKeyDownForRenderMode: (operationalKey: string) => boolean;
}

interface ValueSelectState {
  values: any[];
}

export class ValueSelect extends Component<
  ValueSelectProps & {
    forwardRef?: React.Ref<ValueSelectRef>;
  },
  ValueSelectState
> {
  private mount: boolean = false;
  private select: any = null;
  private operationalKeyDownListener: (key: string) => void = () => {};

  constructor(props: ValueSelectProps) {
    super(props);
    this.state = {
      values: Array.isArray(props.values) ? props.values : [],
    };
  }

  componentDidMount() {
    this.mount = true;
    const { values: propsValues } = this.props;

    if (typeof propsValues === "function") {
      const result = propsValues();

      // Promise处理
      if (result && "then" in result) {
        result.then((fetchedValues) => {
          if (this.mount) {
            this.setState({ values: fetchedValues });
          }
        });
      } else {
        if (this.mount) {
          this.setState({ values: result });
        }
      }
    }
  }

  componentWillUnmount() {
    this.mount = false;
  }

  handleKeyDown = (keyCode: string | number) => {
    if (this.select && this.select.handleKeyDown) {
      return this.select.handleKeyDown(keyCode);
    }
    return true;
  };

  handleKeyDownForRenderMode = (operationalKey: string) => {
    if (this.props.render) {
      this.operationalKeyDownListener(operationalKey);
    }
    return true;
  };

  render() {
    const { values } = this.state;
    const {
      type,
      inputValue,
      onChange,
      onSelect,
      onCancel,
      offset = 0,
      maxHeight,
      render,
    } = this.props;

    // 如果提供了自定义渲染函数
    if (render) {
      return (
        <DropdownMenu>
          {render({
            onOperationalKeyDown: (listener) => {
              this.operationalKeyDownListener = listener as any;
            },
            inputValue,
            onSelect: onSelect!,
            onCancel: onCancel!,
          })}
        </DropdownMenu>
      );
    }

    // 处理组件类型
    let typeOptions: [string, any];

    if (Array.isArray(type)) {
      typeOptions = type;
    } else {
      typeOptions = [type, {}];
    }

    const commonProps = {
      values,
      inputValue,
      onChange,
      onSelect,
      onCancel,
      offset,
      maxHeight,
    };

    // 根据不同类型渲染不同组件
    switch (typeOptions[0]) {
      case "input":
        // PureInput requires all callbacks to be non-optional
        const inputProps = {
          values,
          inputValue: inputValue || "",
          onChange: onChange || (() => {}),
          onSelect: onSelect || (() => {}),
          onCancel: onCancel || (() => {}),
          offset,
          maxHeight,
        };
        return (
          <PureInput
            ref={(select) => (this.select = select) as any}
            {...inputProps}
          />
        );

      case "single":
        const singleOptions = typeOptions[1];

        if (!Array.isArray(values)) {
          return <Loading offset={offset} />;
        }

        if (!values.length) {
          return (
            <Empty {...singleOptions} offset={offset} onCancel={onCancel} />
          );
        }

        return (
          <SingleValueSelect
            {...commonProps}
            {...singleOptions}
            ref={(select) => (this.select = select)}
          />
        );

      case "multiple":
        const multipleOptions = typeOptions[1];

        if (!Array.isArray(values)) {
          return <Loading offset={offset} />;
        }

        if (!values.length) {
          return (
            <Empty {...multipleOptions} offset={offset} onCancel={onCancel} />
          );
        }

        return (
          <MultipleValueSelect
            {...commonProps}
            {...multipleOptions}
            ref={(select) => (this.select = select)}
          />
        );

      default:
        return null;
    }
  }
}
