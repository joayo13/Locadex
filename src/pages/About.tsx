import React, { useEffect } from 'react';

const NotificationComponent = () => {
  useEffect(() => {
    // Check if the browser supports notifications
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications');
    } else {
      // Request permission to show notifications
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // Set a timer to send a notification after 1 minute
          const timer = setTimeout(() => {
            new Notification('Pomodoro Timer', {
              body: '1 minute has passed! Time to focus!',
              icon: '/path-to-your-icon.png', // Optional icon
            });
          }, 5 * 1000); // 1 minute in milliseconds

          // Clear the timer if the component is unmounted
          return () => clearTimeout(timer);
        } else {
          alert('Notifications are blocked. Please allow them.');
        }
      });
    }
  }, []);

  return (
    <div>
      <h1>Pomodoro Timer</h1>
      <p>You'll receive a notification after 1 minute.</p>
    </div>
  );
};

export default NotificationComponent;

