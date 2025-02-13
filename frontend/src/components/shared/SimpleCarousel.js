import React, { useState, useEffect } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

const SimpleCarousel = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, items.length]);

  const goToPrev = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setTimeout(() => setAutoPlay(true), 10000); 
  };

  const goToNext = () => {
    setAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setTimeout(() => setAutoPlay(true), 10000);
  };

  return (
    <Paper elevation={3} sx={{ 
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 2,
      height: { xs: 300, md: 500 }
    }}>
      {/* Picture container */}
      <Box sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        transition: 'transform 0.5s ease',
        transform: `translateX(-${currentIndex * 100}%)`
      }}>
        {items.map((item, index) => (
          <Box
            key={index}
            component="img"
            src={item.image}
            alt={item.alt}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />
        ))}
      </Box>

      {/* Navigation button */}
      <IconButton
        onClick={goToPrev}
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.8)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
        }}
      >
        <ArrowBack />
      </IconButton>

      <IconButton
        onClick={goToNext}
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255,255,255,0.8)',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
        }}
      >
        <ArrowForward />
      </IconButton>

      {/* indicator */}
      <Box sx={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 1
      }}>
        {items.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentIndex(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor: index === currentIndex ? 'primary.main' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default SimpleCarousel;