import React, { useState, useEffect } from 'react';
import { BorderColor } from '@/components/notification/border-color';

interface NotificationProps {
  id: number;
  message: string;
  onClose: (id: number) => void;
  index: number;
  borderColor: BorderColor;
}

const Notification: React.FC<NotificationProps> = ({ id, message, onClose, index, borderColor }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(id), 300); // wait for the animation to complete before removing the notification
  };

  useEffect(() => {
    const timer = setTimeout(handleClose, 8000); // auto close after 8 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed bottom-0 right-0 mb-4 mr-4 p-4 bg-black text-white rounded-lg shadow-lg transform transition-transform border-2 ${borderColor} ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        width: '350px',
        height: '80px',
        marginTop: '',
        marginBottom: `${ visible ? 20 + index * 90 : 0 }px`, // Adjust this value based on the height of your notification
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className="flex justify-between items-center w-full">
        <div className="font-bold">{message}</div>
        <button onClick={handleClose} className="ml-4 text-white text-[26px]">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
