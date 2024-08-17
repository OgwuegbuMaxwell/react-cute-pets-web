import React, { useState, useEffect } from 'react';
import './App.css';
import './Post.css';
import './Button.css';
import { ReactComponent as LoveIcon } from './assets/icons/love.svg';
import { getTimeElapsed } from './utils/dateUtils';
import { Avatar, Button, Divider, IconButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';



import CommentModal from './modals/CommentModal'; // Import the CommentModal

const BASE_URL = 'http://localhost:8000/';
const placeholderImage = process.env.PUBLIC_URL + '/loading.png'; // Placeholder image path
// const defaultProfileImage = process.env.PUBLIC_URL + '/default_profile.png';

function Post({ post, authToken, authTokenType, username }) {
    const [imageUrl, setImageUrl] = useState(placeholderImage);
    const [comments, setComments] = useState([]);
    const [openCommentModal, setOpenCommentModal] = useState(false); // State to manage modal visibility
    const [anchorEl, setAnchorEl] = useState(null); // For handling the menu position
    const [newComment, setNewComment] = useState('')

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
      };
    
      const open = Boolean(anchorEl);
      const id = open ? 'simple-popper' : undefined;

    useEffect(() => {
        setImageUrl(post.image_url_type === 'absolute' ? post.image_url : BASE_URL + post.image_url);
        setComments(post.comments.map(comment => ({
            ...comment,
            timeElapsed: getTimeElapsed(comment.timestamp)
        })));
    }, [post]);

    const handleOpenComments = () => {
        setOpenCommentModal(true);
    };

    const handleCloseComments = () => {
        setOpenCommentModal(false);
    };

    const commentText = comments.length === 0 ? "comments(0)" :
                        comments.length <= 3 ? `comments(${comments.length})` :
                        <Button onClick={handleOpenComments} className="view-comments-button">view all ({comments.length}) comments</Button>;

    const handleDelete = (event) => {
        event.preventDefault();

        const requestOptions = {
            method: 'Delete',
            headers: new Headers({
            'Authorization': `${authTokenType} ${authToken}`
            })
        }

        fetch(BASE_URL + 'post/delete/' + post.id, requestOptions)
            .then(response => {
                if (response.ok) {
                    window.location.reload()
                }
                throw response
            })
            .catch(error => {
                console.log(error)
            })
    }


    const postComment = (event) => {
        event.preventDefault();

        const json_string = JSON.stringify({
            'username': username,
            'text': newComment,
            'post_id': post.id
        })

        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Authorization': `${authTokenType} ${authToken}`,
                'Content-Type': 'application/json'
            }),
            body: json_string
        }
        console.log(username)
        console.log(requestOptions)
        console.log(`${authTokenType} ${authToken}`)
        

        fetch(BASE_URL + 'comment', requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then(data => {
                fetchComments()
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setNewComment('')
            })

    }

    const fetchComments = () => {
        fetch(BASE_URL + 'comment/all/' + post.id) 
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                throw response
            })
            .then(data => {
                setComments(data)
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div className='post'>
            <div className='post_header'>
                <Avatar alt='Profile' src={post.userImage} />
                <div className='post_headerInfo'>
                    <h3>{post.user.username}</h3>
                    {/* <Button className='post_delete button danger_btn' onClick={handleDelete}> Delete </Button> */}
                    {username === post.user.username && (
                    <>
                    <IconButton
                    aria-describedby={id}
                    type="button"
                    onClick={handleClick}
                    >
                    <MoreHorizIcon />
                    </IconButton>
                    <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-start">
                    <Paper>
                        <MenuList>
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                        </MenuList>
                    </Paper>
                    </Popper>
                </>
                )}


                </div>
            </div>
            <img className='post_image' src={imageUrl} alt={post.caption} />
            <h4 className='post_caption'>{post.caption}</h4>
            <p className='post_comments_header'>{commentText}</p>
            <div className='post_comments'>
                {comments.slice(0, 3).map((comment, index) => (
                    <div key={index} className='comment'>
                        <Avatar className='comment_profile_image' src={comment.userImage} alt="Profile" />
                        <div className='comment_text'>
                            <strong>{comment.username} <span className='comment_time'>{comment.timeElapsed}</span></strong>
                            <p>{comment.text}</p>
                        </div>
                        <div className='comment_likes'>
                            <LoveIcon className='love_icon' />
                            <span className='like_count'>({comment.likes || 0})</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comment interface below the displayed comment */}
            {
                authToken && (
                    
                    <div className='post_commentbox_con'>
                        <Divider sx={{ my: 2 }} /> {/* Horizontal line before comment form */}
                        <form className='post_commentbox'>
                            <input
                            className='post_input'
                                type='text' 
                                placeholder='Add a comment..'
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button
                                className='post_button'
                                type='submit'
                                disabled={!newComment}
                                onClick={postComment}
                            >
                                Post
                            </button>
                        </form>
                    </div>
                )
            }


            {/* CommentModal ===== this is for when the user click view all comments */}
            <CommentModal open={openCommentModal} handleClose={handleCloseComments} comments={comments} authToken={authToken} />
        </div>
    );
}

export default Post;
