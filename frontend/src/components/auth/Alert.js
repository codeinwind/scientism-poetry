import React, { useEffect } from 'react';
import PropTypes from 'prop-types';


const Alert = ({ 
  message, 
  type = 'info', 
  onClose, 
  autoClose = true,
  autoCloseDuration = 5000 
}) => {
  useEffect(() => {
    if (autoClose && message) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoCloseDuration);
      return () => clearTimeout(timer);
    }
  }, [message, autoClose, autoCloseDuration, onClose]);

  if (!message) return null;

  const typeStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700'
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-50 p-4 rounded-md border ${typeStyles[type]} transition-all duration-300`}
      role="alert"
    >
      <div className="flex items-center space-x-2">
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="opacity-70 hover:opacity-100 transition-opacity"
        >
         
        </button>
      </div>
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  onClose: PropTypes.func.isRequired,
  autoClose: PropTypes.bool,
  autoCloseDuration: PropTypes.number
};

export default Alert;