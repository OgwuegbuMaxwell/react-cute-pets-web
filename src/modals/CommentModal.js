import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Avatar, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function CommentModal({ open, handleClose, comments, authToken }) {
  const [newComment, setNewComment] = useState('');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  

  // Update window width on resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768; // Example breakpoint for mobile devices

  const style = {
    position: 'absolute',
    bottom: 0,  // Anchor the modal to the bottom
    left: '50%',  // Center the modal horizontally
    transform: 'translateX(-50%)',  // Correct horizontal positioning
    width: '100%',  // Full width to match the screen's width
    maxWidth: isMobile ? '100%' : '500px',  // Adjust width based on device
    height: '70%',  // The modal covers 70% of the screen height from the bottom
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',  // Allow scrolling within the modal
    display: 'flex',
    flexDirection: 'column',  // Stack content vertically
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      sx={{
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center'
      }}
    >
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="h2" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Comments
          </Typography>
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ my: 2 }} /> {/* Horizontal line after header */}
        <Box sx={{ flex: 1, overflowY: 'auto' }}> {/* Container for comments */}
          {comments.map((comment, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Avatar src={comment.avatar} alt={comment.username} sx={{ marginRight: 2 }} />
              <Typography sx={{ flexGrow: 1 }}>{comment.text}</Typography>
            </Box>

          ))}
        </Box>


        <Divider sx={{ my: 2 }} /> {/* Horizontal line before comment form */}

        {
            !authToken ? 
            (
            <div className="loginPrompt">
                <h3>You need to log in to comment...</h3>
            </div>
            )
            :
        

        
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}> {/* Comment input box at the bottom */}
            <Avatar src="your-avatar-url" alt="" /> {/* Replace with dynamic data if available */}
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ marginX: 2, flex: 1 }}
            />
            <Button variant="contained" onClick={() => console.log(newComment)}>Send</Button>
            </Box>
        }
      </Box>
    </Modal>
  );
}

export default CommentModal;
