import React, { useState } from 'react';
import { Button, TextField, IconButton, Box, hexToRgb } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './ImageUpload.css';
const BASE_URL = 'http://localhost:8000/';

function ImageUpload({authToken, authTokenType, userId}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [visible, setVisible] = useState(false);

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = (e) => {
        e?.preventDefault();

        const formData = new FormData();
        formData.append('image', image)

        const requestOptions = {
            method: 'POST',
            // headers: {
            //     'Authorization': `Bearer ${authToken}`
            //   },
            headers: new Headers({
                'Authorization': `${authTokenType} ${authToken}`
            }),
            body: formData
        }
        

        console.log(requestOptions)
        console.log(requestOptions.headers)

        fetch(BASE_URL + 'post/image', requestOptions) 
            .then(response => {
                console.log(response);
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then(data => {
                // create post
                createPost(data.filename);
            })
            .catch(error => {
                error.json().then(body => {
                    console.log(body.detail); // FastAPI often sends details in the 'detail' key
                });
            })
            .finally(() => {
                setCaption(caption)
                setImage(null)
                document.getElementById('fileInput').value = null
            })

    };

    const createPost = (imageUrl) => {

        const json_string = JSON.stringify({
            'image_url': imageUrl,
            'image_url_type': 'relative',
            'caption': caption,
            'creator_id': userId
        })
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': `${authTokenType} ${authToken}`,
                'Content-Type': 'application/json'

            }),
            body: json_string
        }

        fetch(BASE_URL + 'post', requestOptions) 
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then(data => {
                window.location.reload()
                window.scrollTo(0, 0)
            })
            .catch(error => {
                console.log(error)
            })

    }

    const toggleFormVisibility = () => {
        setVisible(!visible);
    };

    return (
        <Box className='ImageUpload' sx={{
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '500px', // Max width of 500px
            zIndex: 1000,
            boxShadow: '0px 2px 10px rgba(0,0,0,0.1)', // Shadow for aesthetics
            backgroundColor: 'background.paper' // Ensure background is consistent
        }}>
            <IconButton onClick={toggleFormVisibility} sx={{ color: 'primary.main', margin: '0 auto', display: 'block' }}>
                <CloudUploadIcon />
            </IconButton>
            {visible && (
                <Box sx={{ padding: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter a caption..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload File
                        <input
                            type="file"
                            id='fileInput'
                            hidden
                            onChange={handleChange}
                        />
                    </Button>
                    <Button
                        className='Imageupload_button'
                        onClick={handleUpload}
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                    >
                        Upload
                    </Button>
                </Box>
            )}
        </Box>
    );
}

export default ImageUpload;
