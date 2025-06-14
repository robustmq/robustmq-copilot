import React, { forwardRef, ComponentType, Component, Ref } from "react";

export interface OutsideClickConfig {
  ignoreClasses?: string[];

  disabled?: boolean;

  enableOnClickOutside?: boolean;
}

type BaseProps = {
  forwardedRef?: Ref<any>;
  disabled?: boolean;
};

export function withOutsideClick(methodName: string) {
  return function <P extends object>(
    WrappedComponent: ComponentType<P>,
    config: OutsideClickConfig = {}
  ) {
    const {
      ignoreClasses = [],
      disabled: defaultDisabled = false,
      enableOnClickOutside = true,
    } = config;

    type Props = P & BaseProps;

    class OutsideClickWrapper extends Component<Props> {
      private instance: any;
      private __clickOutsideHandlerProp: string;
      private __outsideClickIgnoreClass: string[];
      private __disabled: boolean;
      private __enableOnClickOutside: boolean;

      constructor(props: Props) {
        super(props);
        this.__clickOutsideHandlerProp = methodName;
        this.__outsideClickIgnoreClass = ignoreClasses;
        this.__disabled = props.disabled ?? defaultDisabled;
        this.__enableOnClickOutside = enableOnClickOutside;
        this.instance = null;
      }

      componentDidMount() {
        if (this.__enableOnClickOutside) {
          this.enableOnClickOutside();
        }
      }

      componentDidUpdate(prevProps: Props) {
        if (this.props.disabled !== prevProps.disabled) {
          this.__disabled = this.props.disabled ?? defaultDisabled;
          if (this.__disabled) {
            this.disableOnClickOutside();
          } else {
            this.enableOnClickOutside();
          }
        }
      }

      componentWillUnmount() {
        this.disableOnClickOutside();
      }

      private handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (this.__disabled) {
          return;
        }

        const target = event.target as Element;
        if (this.isIgnoredElement(target)) {
          return;
        }

        if (this.instance.searchWrapRef.current?.contains(target)) {
          return;
        }

        if (
          this.instance &&
          typeof this.instance[this.__clickOutsideHandlerProp] === "function"
        ) {
          this.instance[this.__clickOutsideHandlerProp](event);
        }
      };

      private isIgnoredElement = (element: Element | null): boolean => {
        if (!element) return false;

        if (
          this.__outsideClickIgnoreClass.some((className) =>
            element.classList.contains(className)
          )
        ) {
          return true;
        }

        return this.isIgnoredElement(element.parentElement);
      };

      private enableOnClickOutside = () => {
        document.addEventListener("mousedown", this.handleClickOutside);
        document.addEventListener("touchstart", this.handleClickOutside);
      };

      private disableOnClickOutside = () => {
        document.removeEventListener("mousedown", this.handleClickOutside);
        document.removeEventListener("touchstart", this.handleClickOutside);
      };

      render() {
        const { forwardedRef, ...rest } = this.props;

        return (
          <WrappedComponent
            {...(rest as P)}
            ref={(instance: any) => {
              this.instance = instance;
              if (typeof forwardedRef === "function") {
                forwardedRef(instance);
              } else if (forwardedRef) {
                (forwardedRef as React.MutableRefObject<any>).current =
                  instance;
              }
            }}
          />
        );
      }
    }

    const ForwardedOutsideClickWrapper = forwardRef<
      any,
      Omit<P, "ref"> & { disabled?: boolean }
    >((props, ref) => {
      // @ts-ignore
      return <OutsideClickWrapper {...props} forwardedRef={ref} />;
    });

    return ForwardedOutsideClickWrapper;
  };
}
