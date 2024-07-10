import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

function IpDialog({ open, handleClose, ip, setIp, url, setUrl, port, setPort, handleAddCard }) {
  const [isCustomUrl, setIsCustomUrl] = useState(false);

  const handleAddUrl = () => {
    setIsCustomUrl(true);
  };

  const handleBackToIp = () => {
    setIsCustomUrl(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isCustomUrl ? 'Add Custom URL' : 'Add IP Address'}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isCustomUrl ? 'Please enter the custom URL.' : 'Please enter the IP address and port for the new node.'}
        </DialogContentText>
        {isCustomUrl ? (
          <TextField
            autoFocus
            margin="dense"
            label="Custom URL"
            type="text"
            fullWidth
            variant="standard"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        ) : (
          <>
            <TextField
              autoFocus
              margin="dense"
              label="IP Address"
              type="text"
              fullWidth
              variant="standard"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Port"
              type="text"
              fullWidth
              variant="standard"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        {isCustomUrl ? (
          <>
            <Button onClick={handleBackToIp}>Back</Button>
            <Button onClick={handleAddCard}>Add URL</Button>
          </>
        ) : (
          <>
            <Button onClick={handleAddUrl}>Add Custom URL</Button>
            <Button onClick={handleAddCard}>Add Node</Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default IpDialog;
