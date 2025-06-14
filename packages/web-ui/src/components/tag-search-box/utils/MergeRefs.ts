import { MutableRefObject, LegacyRef } from 'react';

/**
 * 合并多个 refs 到一个回调函数中
 * @param refs 要合并的 refs 数组
 * @returns 合并后的 ref 回调函数
 */
export function mergeRefs<T = any>(...refs: Array<LegacyRef<T> | undefined>): (instance: T | null) => void {
  return (instance: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref && typeof ref === 'object') {
        try {
          (ref as MutableRefObject<T | null>).current = instance;
        } catch (_) {
          // ignore
        }
      }
    }
  };
}
