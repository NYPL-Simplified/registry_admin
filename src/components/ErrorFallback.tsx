import React from 'react';
import { Notification } from '@nypl/design-system-react-components';

const ErrorFallback = ({ error }: { error: Error }) => {
  return (
    <Notification
      id='error-fallback'
      notificationContent={error.message}
      notificationHeading='Something went wrong:'
      notificationType='warning'
    />
  );
};

export default ErrorFallback;
