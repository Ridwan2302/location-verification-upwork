import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ fullScreen = false, message = 'Chargement...' }) => {
  const inner = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        {inner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      {inner}
    </div>
  );
};
