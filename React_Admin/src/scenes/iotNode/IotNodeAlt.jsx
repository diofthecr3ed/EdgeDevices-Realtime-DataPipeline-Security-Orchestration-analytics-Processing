import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import ACardInvertedColors from './CardAlternate.jsx';
import IpDialog from './IpDialogue.jsx'; // Ensure the correct import path
import './IotNode.css';

function IotNodeAlt() {
  const [cards, setCards] = useState(() => {
    const savedCards = localStorage.getItem('cards');
    if (savedCards) {
      try {
        return JSON.parse(savedCards);
      } catch (e) {
        console.error('Error parsing saved cards from localStorage', e);
        return [];
      }
    } else {
      return [];
    }
  });

  const [open, setOpen] = useState(false);
  const [ip, setIp] = useState('');
  const [url, setUrl] = useState('');
  const [port, setPort] = useState('');
  const [isCustomUrl, setIsCustomUrl] = useState(false);

  // Save cards to localStorage whenever they are updated
  useEffect(() => {
    try {
      localStorage.setItem('cards', JSON.stringify(cards));
      console.log(cards);
    } catch (e) {
      console.error('Error saving cards to localStorage', e);
    }
  }, [cards]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIp('');
    setUrl('');
    setPort('');
    setIsCustomUrl(false);
  };

  const handleAddCard = () => {
    if (isCustomUrl) {
      setCards([...cards, { id: cards.length, url }]);
    } else {
      setCards([...cards, { id: cards.length, ip, port }]);
    }
    handleClose();
  };

  const handleAddUrl = () => {
    setIsCustomUrl(true);
  };

  const handleRemoveCard = (index) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className='topbar'>
        <div className='topbar-left'>
          <h2>Node Monitoring Dashboard</h2>
        </div>
        <div className='topbar-right'>
          <button className="button-28" role="button" onClick={handleClickOpen}>Add Card</button>
        </div>
      </div>
      <Box 
        display="flex" 
        justifyContent="space-evenly" 
        alignItems="center" 
        sx={{ mt: 2, flexWrap: 'wrap' }}
      >
        {cards.map((card, index) => (
          <Box 
            key={index} 
            sx={{ 
              width: '30%', 
              position: 'relative', 
              m: 1, 
              minWidth: '250px' 
            }}
          >
            <ACardInvertedColors ip={card.ip} url={card.url} port={card.port} />
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={() => handleRemoveCard(index)}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              Remove
            </Button>
          </Box>
        ))}
      </Box>
      <IpDialog
        open={open}
        handleClose={handleClose}
        ip={ip}
        setIp={setIp}
        url={url}
        setUrl={setUrl}
        port={port}
        setPort={setPort}
        isCustomUrl={isCustomUrl}
        handleAddCard={handleAddCard}
        handleAddUrl={handleAddUrl}
      />
    </div>
  );
}

export default IotNodeAlt;
