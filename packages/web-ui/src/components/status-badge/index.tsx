import React from 'react';

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'warning' | 'error' | ({} & string);
  label?: string;
  customColors?: {
    bg: string;
    text: string;
    darkBg: string;
    darkText: string;
  };
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, customColors }) => {
  const getStatusColors = () => {
    if (customColors) {
      return `bg-${customColors.bg} text-${customColors.text} dark:bg-${customColors.darkBg} dark:text-${customColors.darkText}`;
    }

    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'offline':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const getLabel = () => {
    if (label) return label;

    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'warning':
        return 'Warning';
      case 'error':
        return 'Error';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusColors()}`}>
      {getLabel()}
    </span>
  );
};

export default StatusBadge;
