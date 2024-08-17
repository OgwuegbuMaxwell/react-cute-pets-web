import React, { useState, useEffect } from 'react';
import './App.css'
import './Post.css'

const BASE_URL = 'http://localhost:8000/';

function Post({ post }) {

    const [imageUrl, setImageUrl] = useState('')
    const [comments, setComments] = useState([])

    useEffect(() => {
        if (post.image_url_type == 'absolute') {
            setImageUrl(post.image_url)
        } else {
            setImageUrl(BASE_URL + post.image_url)
        }
    }, [])

    useEffect(() => {
        setComments(post.comments)
    }, [])

    return (
        // the div that will contain all the information for the post
        <div className='post'>

            {/* Image */}
            <img
                className='post_image'
                src={imageUrl}
            />

            {/* The image caption */}
            <h4 className='post_text'>{post.caption}</h4>

            {/* Comments */}
            <div className='post_comments'>
                {
                    comments.map((comment) => (
                        <p>
                            <strong>{comment.username}: {comment.text}</strong>
                        </p>
                    ))
                }
            </div>


        </div>
    )
}




export default Post