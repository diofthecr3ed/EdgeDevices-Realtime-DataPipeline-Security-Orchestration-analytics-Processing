import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Button } from '@mui/material';

function IpDialog({ open, handleClose, ip, setIp, handleAddCard }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add IP Address</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the IP address for the new node.
        </DialogContentText>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAddCard}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

export default IpDialog;
