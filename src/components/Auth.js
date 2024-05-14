import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Auth.css" 
import axios from 'axios';
import myLogo from '../logo.png'; // Import the image file

function AuthPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [color, setColor] = useState('');
  const [getUsername, setGetUserName] = useState('');
  const [favColor, setFavColor] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // To switch between login/signup
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [showModalForUsername, setShowModalForUsername] = useState(false);
  const [showModalForFavColor, setShowModalForFavcolor] = useState(false);
  const [showModalForNewPassword, setShowModalForNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errorModal, setErrorModal] = useState('');
  const [successModal, setSuccessModal] = useState('');
  const navigate = useNavigate();

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Make API request
      const response = await axios.post(
        isLogin ? 'https://ktodoapi.onrender.com/api/login' : `https://ktodoapi.onrender.com/api/signup`, // Conditional API endpoint
        { username, password,color }
      );
    
        // Handle success
        setSuccess("Authorized"+ response.data.userFound.name);
        onLogin(); // Notify parent component (App) about successful login
        const name = response.data.userFound.name;
        console.log('Success:', response.data.userFound.name);
        localStorage.setItem('user', response.data.userFound.name); // Store username locally (optional)
        navigate('/categories/'+name);
        setTimeout(() => {
          setSuccess("")
         }, 3000);
    } catch (error) {
      console.log(error)
      // Handle error
      setError(error.response?.data?.message || 'Something went wrong');
      setTimeout(() => {
       setError("")
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   // Check for existing user in local storage (optional)
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     navigate('/categories'); // Redirect to categories if already logged in
  //   }
  // }, []); // Run only once

  const verifyUsername = async () => {
    setLoadingModal(true)
    try{
      const response = await axios.post('https://ktodoapi.onrender.com/api/getUsername',
      { username : getUsername}
    );
    setGetUserName(response.data.userFound.name)
    setShowModalForFavcolor(true)
    setSuccessModal("User Verified")
    setTimeout(() => {
      setSuccessModal("")
     }, 3000);
    setShowModalForUsername(false)
    } catch(error){
      setErrorModal(error.response?.data?.message || 'Something went wrong');
      setTimeout(() => {
       setErrorModal("")
      }, 3000);
    } finally {
      setLoadingModal(false);
    }
  }


  const verifyUserFavColor = async () => {
    setShowModalForFavcolor(true)
    setLoadingModal(true)
    try{
      const response = await axios.post('https://ktodoapi.onrender.com/api/checkUserFavoriteColor',
      { username : getUsername, color: favColor }
    );
    setGetUserName(response.data.userFound.name)
    setShowModalForFavcolor(false)
    setShowModalForNewPassword(true)
    setSuccessModal("User Favorite Color Correct")
    setTimeout(() => {
      setSuccessModal("")
     }, 3000);
    } catch(error){
      setErrorModal(error.response?.data?.message || 'Something went wrong');
      setTimeout(() => {
       setErrorModal("")
      }, 3000);
    } finally {
      setLoadingModal(false);
    }
  }


  const changeUserPassword = async (categoryId,categoryName) => {
    
      setLoading(true);
      try {
        await axios.put(`https://ktodoapi.onrender.com/api/password`,{password:newPassword, username: getUsername});
        setSuccess("Password changed")
      setTimeout(() => {
        setSuccess("")
       }, 3000);
       setShowModalForUsername(false)
    setShowModalForFavcolor(false)
    setShowModalForNewPassword(false)
      } catch (error) {
        console.error('Error deleting category:', error);
        setError(error.response?.data?.message || 'Something went wrong: Error changing password');
        setTimeout(() => {
          setError("")
         }, 3000);
      } finally{
        setLoading(false);
      }
    
  };



  return (
    <div className="container">
      <div className="header"> <img src={myLogo} alt='logo' /> <h1>Welcome to K-Todo App</h1></div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
       {!isLogin  && <div className="form-group">
          <label htmlFor="color">your favorite color</label>
          <input
            type="text"
            id="color"
            value={color}
            required
            onChange={(e) => setColor(e.target.value)}
          />
        </div>}
        <button type="submit" disabled={loading}>{loading? <span>Loading</span> : (isLogin ? 'Login' : 'Sign Up')}</button>
      </form>
      <p>{isLogin ? "Don't have an account?" : "Already have an account?"} <button onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Sign up' : 'Login'}</button></p>
       {isLogin &&  <p onClick={() => {setShowModalForUsername(true)}}>forgot password?</p>}


       { 
    loadingModal && <div>
    <div  className={`loading-modal ${loadingModal ? 'show' : ''}`}>
      <div className="loading-spinner"></div>
    </div>
    </div>


    }

       <div className="add-category">
        {showModalForUsername && (
          <div className="modal">
          {errorModal && <p className="error-message">{errorModal}</p>}
      {successModal && <p className="success-message">{successModal}</p>}
            <input
              type="text"
              placeholder="Enter your username"
              value={getUsername}
              onChange={(e) => setGetUserName(e.target.value)}
            />
            <button onClick={verifyUsername}>Continue</button>
            <button onClick={() => setShowModalForUsername(false)}>Cancel</button>
          </div>
        )}
      </div>

      <div className="add-category">
        {showModalForFavColor && (
          <div className="modal">
          {errorModal && <p className="error-message">{errorModal}</p>}
      {successModal && <p className="success-message">{successModal}</p>}
            <input
              type="text"
              placeholder="Enter your Favorite Color"
              value={favColor}
              onChange={(e) => setFavColor(e.target.value)}
            />
            <button onClick={verifyUserFavColor}>Continue</button>
            <button onClick={() => setShowModalForFavcolor(false)}>Cancel</button>
          </div>
        )}
      </div>


      <div className="add-category">
        {showModalForNewPassword && (
          <div className="modal">
          {errorModal && <p className="error-message">{errorModal}</p>}
      {successModal && <p className="success-message">{successModal}</p>}
            <input
              type="text"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={changeUserPassword}>Finish</button>
            <button onClick={() => setShowModalForNewPassword(false)}>Cancel</button>
          </div>
        )}
      </div>



    </div>
  );
}


export default AuthPage;
