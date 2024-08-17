import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import SignInModal from './modals/signInModal';
import SignUpModal from './modals/SignUpModal';
import ImageUpload from './ImageUpload'
import Post from './Post';
import './App.css';
import './Button.css';
import './utils/utilities.css'

const BASE_URL = 'http://localhost:8000/';
const logo1 = process.env.PUBLIC_URL + '/logo_black.png';
// const default_profile = process.env.PUBLIC_URL + '/default_profile.png';

function App() {
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [openSignUp, setOpenSignUp] = useState(false);

  // Authentication states
  const [authToken, setAuthToken] = useState(null);
  const [authTokenType, setAuthTokenType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState('');

  // Managed the comment State here in App.js:
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [comments, setComments] = useState([]); // This would be fetched or passed down as needed



  // Load authentication state from local storage
  // for persistent sign in. so we can't lose data after refreshing the browser
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedTokenType = localStorage.getItem('authTokenType');
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');

    if (storedToken && storedTokenType && storedUserId) {
      setAuthToken(storedToken);
      setAuthTokenType(storedTokenType);
      setUserId(storedUserId);
      setUsername(storedUsername);
    }
  }, [authToken]);


  // Function to handle login data passed from SignInModal
  // call handleLogin after successfult sign in attempt
  // Save authentication data to local storage on login
  const handleLogin = (data) => {
    localStorage.setItem('authToken', data.access_token);
    localStorage.setItem('authTokenType', data.token_type);
    localStorage.setItem('userId', data.user_id);
    localStorage.setItem('username', data.username);

    setAuthToken(data.access_token);
    setAuthTokenType(data.token_type);
    setUserId(data.user_id);
    setUsername(data.username);

    // Close the sign-in modal on successful login
    setOpenSignIn(false);  
  };

  

  // Clear authentication data from local storage on logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authTokenType');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');

    setAuthToken(null);
    setAuthTokenType(null);
    setUserId(null);
    setUsername('');
  };


  const handleSignUp = (data) => {
    // log in the user directly after signup
    handleLogin(data);  
  };


  useEffect(() => {
    fetch(BASE_URL + 'post/all')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const sortedData = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setPosts(sortedData);  // Set the sorted data to the state
      })
      .catch(error => {
        console.error("Fetch error:", error);
        alert("An error occurred. Please check the console for details.");
      });
  }, []);

  return (
    <div className='app'>
      <div className='app_header'>
        <img className='app_header_image' src={logo1} alt='ImageConnect' />
        {/* If authenticated, display logout button. else display Login and Signup */}
        {authToken ? (
            <Button className='button danger_btn' onClick={handleLogout}>Logout</Button>
          ) :
          <div>
            <Button className='button primary_btn' onClick={() => setOpenSignIn(true)}>Login</Button>
            <Button className='button primary_btn ml-1' onClick={() => setOpenSignUp(true)}>Sign Up</Button>
          </div>
        }
        {/* Sign in Modal */}
        <SignInModal
          open={openSignIn}
          handleClose={() => setOpenSignIn(false)}
          onLogin={handleLogin}  // Pass the handleLogin to manage authentication state
        />
        {/* Sign up modal */}
        <SignUpModal 
        open={openSignUp} handleClose={() => setOpenSignUp(false)} 
        onSignUp={handleSignUp} />
      </div>

      { posts.length > 0 ?
      <div className='app_posts'>
        {posts.map(post => (
          <Post key={post.id} 
            post={post} 
            authToken={authToken} 
            authTokenType={authTokenType}
            username={username}
          />
        ))}
      </div> :
      (
        <h3 className='no-posts'>No posts found</h3>
      )
      }

      {
        authToken ? (
          <ImageUpload 
            authToken={authToken}
            authTokenType={authTokenType}
            userId={userId}
          />
        )
        :
        (
        <div className="loginPrompt">
          <h3>You need to log in to upload...</h3>
        </div>
        )
      }
    </div>
  );
}

export default App;
