import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';
import "../Categories.css" 
import AddIcon from '@mui/icons-material/Add';
import CategoryItem from './CategoryItem';
import { Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import ShareIcon from '@mui/icons-material/Share';
import LogoutIcon from '@mui/icons-material/Logout';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import myLogo from '../logo.png'; // Import the image file



function CategoriesPage({ onLogout }) {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { username } = useParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [noCategory, setNoCategory] = useState(false);
  const navigate = useNavigate();
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [atoz, setAtoz] = useState(false);
  useEffect(() => {
    fetchCategories();
    
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://ktodoapi.onrender.com/api/categories/'+username);
      setCategories(response.data.categories);
      setFilteredCategories(response.data.categories);
      setNoCategory(response.data.categories.length === 0)
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.response?.data?.message || 'Something went wrong');
      setTimeout(() => {
       setError("")
      }, 3000);
    } finally{
      setLoading(false);
    }

    
  };

  const addCategory = async () => {
    setLoading(true);
    try {
      await axios.post('https://ktodoapi.onrender.com/api/category', { name: newCategory, username: username });
      setNewCategory('');
      fetchCategories();
      setShowModal(false); // Close modal after adding category
      setSuccess("Category Added")
      setTimeout(() => {
        setSuccess("")
       }, 3000);
    } catch (error) {
      console.error('Error adding category:', error);
      setError(error.response?.data?.message || 'Something went wrong: Error adding category');
      setTimeout(() => {
        setError("")
       }, 3000);
    } finally{
      setLoading(false);
    }
  };

  const deleteCategory = async (categoryId,categoryName) => {
    // Display a confirmation prompt
    const confirmed = window.confirm("Are you sure you want to delete this category?,note that all todos under this category will be deleted");
  
    // If user confirms deletion
    if (confirmed) {
      setLoading(true);
      try {
        await axios.delete(`https://ktodoapi.onrender.com/api/category/${categoryId}/${categoryName}`);
        fetchCategories();
        setSuccess("Category Deleted")
      setTimeout(() => {
        setSuccess("")
       }, 3000);
      } catch (error) {
        console.error('Error deleting category:', error);
        setError(error.response?.data?.message || 'Something went wrong: Error deleting category');
        setTimeout(() => {
          setError("")
         }, 3000);
      } finally{
        setLoading(false);
      }
    }
  };
  

  const changeUserPassword = async (categoryId,categoryName) => {
    // Display a confirmation prompt
    const confirmed = window.confirm("Are you sure you want to change password");
  setShowProfile(false)
    // If user confirms deletion
    if (confirmed) {
      setLoading(true);
      try {
        await axios.put(`https://ktodoapi.onrender.com/api/password`,{password:newPassword, username: username});
        fetchCategories();
        setSuccess("Password changed")
      setTimeout(() => {
        setSuccess("")
       }, 3000);
      } catch (error) {
        console.error('Error deleting category:', error);
        setError(error.response?.data?.message || 'Something went wrong: Error changing password');
        setTimeout(() => {
          setError("")
         }, 3000);
      } finally{
        setLoading(false);
      }
    }
  };
  

  // Define function to sort categories
  const sortAlphabetically = () => {
    const sortedCategories = [...categories].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    const sortedCategoriesB = [...categories].sort((a, b) => {
      return b.name.localeCompare(a.name);
    });
    setFilteredCategories(atoz? sortedCategories : sortedCategoriesB);
    setAtoz((prev)=>{
      return !prev;
    })
  };


  const filteredCategoriesbyName = () => { 
    const sortedCategories = categories ? categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];
  setFilteredCategories(sortedCategories);
}
  

  const navigateCategory = async(categoryName) => {
    navigate(`/todo/${username}/${categoryName}`)
  }


  return (
    <div className="categories-container">
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="header"> <img src={myLogo} alt='logo' /> <h1>Welcome back {username}</h1>
      </div>
       <h2> My Todo Categories</h2>
      
      <div className="add-category">
        {showModal && (
          <div className="modal">
            <input
              type="text"
              placeholder="New Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={addCategory}>Add</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        )}
      </div>

      <div className="add-category">
        {showProfile && (
          <div className="modal">
          <div>
            <h1>Username : {username}</h1>
          </div>
            <input
              type="text"
              placeholder="Change Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={changeUserPassword}>Update Password</button>
            <button onClick={() => setShowProfile(false)}>Cancel</button>
          </div>
        )}
      </div>

      {!noCategory && <div className="search-container">
      <button
        className="search-icon"
        onClick={()=> {setIsSearch((prev)=>{
          setSearchTerm(" ")
          return !prev;
        })}}
      >
        <SearchIcon  color="info" />
        
      </button>
      {isSearch && (
        <input
          type="text"
          placeholder="Search Categories"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            filteredCategoriesbyName()
            }}
        />
      )}
      <button
  className="sort-icon"
  onClick={ sortAlphabetically}
>
  <SortIcon color="info" />
</button>
    </div>}
      {
        loading ? <div>
        <div  className={`loading-modal ${loading ? 'show' : ''}`}>
      <div className="loading-spinner"></div>
    </div>
        </div>  : <ul className="category-list">
        {/* <li><Link to="/todos/ade/work">Work</Link></li> */}
       
        {filteredCategories.map(category => (
          <CategoryItem key={category._id} name={category.name} deleteCategory={()=> deleteCategory(category._id,category.name)}  onClick={()=> navigateCategory(category.name)}/>
        ))}
      </ul>
      }
      { noCategory && 
  <div class="no-category-message">
    <p>No categories found</p>
    <p>Click on the add button to create a new category</p>
  </div>
}

<button className="logout" onClick={()=>{
       onLogout()
       navigate("/") 
      }}>
      <LogoutIcon />
      </button>
      
      <button className="person" onClick={()=>{
         setShowProfile(true)
      }}>
      <PermIdentityIcon />
      </button>

      <button className="fab" onClick={() => setShowModal(true)}><AddIcon/></button>
    </div>
  );
}



export default CategoriesPage;
