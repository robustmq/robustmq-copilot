import { createContext } from 'react';

export interface TagSearchBoxContextValue {
  attributesSelectTips?: string;
  disableAttributesFilter?: boolean;
  close?: () => void;
}

export const TagSearchBoxContext = createContext<TagSearchBoxContextValue>({});
