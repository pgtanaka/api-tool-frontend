import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import type { SnackbarProps } from '@mui/material';

// Propsの型定義
interface StatusNotificationProps {
  open: boolean;
  message: string;
	onClose: SnackbarProps['onClose'];
}

const StatusNotification: React.FC<StatusNotificationProps> = ({
  open,
  message,
  onClose
}) => (
  <Snackbar
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
  >
    <Alert
      onClose={onClose as any}
      severity="success"
      variant="filled"
      sx={{ width: '100%' }}
    >
      {message}
    </Alert>
  </Snackbar>
);

export default StatusNotification;
