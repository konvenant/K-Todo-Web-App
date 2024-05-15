import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Todo.css'; // Import CSS file
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';
import html2canvas from 'html2canvas';
import  { useRef } from 'react';
import ShareIcon from '@mui/icons-material/Share';
import { useNavigate } from 'react-router-dom';
import myLogo from '../logo.png'; // Import the image file

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const { username, category } = useParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState('');
    const [isSharing, setIsSharing] = useState(false);
    const navigate = useNavigate();
  


  useEffect(() => {
    fetchTodos();
  }, []); // Fetch todos when category changes

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`https://ktodoapi.onrender.com/api/todo/${username}/${category}`);
      setTodos(response.data.todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError(error.response?.data?.message || 'Something went wrong');
    } finally{
      setLoading(false);
    }
  };

  const addTodo = async (event) => {
      event.preventDefault()
    try {
      await axios.post(`https://ktodoapi.onrender.com/api/todo/`, { name: newTodo, username:username, category:category });
      setNewTodo('');
      fetchTodos(); // Refresh todos after adding
      setSuccess("Todo Added Successfully")
      setTimeout(() => {
       setSuccess("")
      }, 3000);
    } catch (error) {
      console.error('Error adding todo:', error);
      setError(error.response?.data?.message || 'Something went wrong');
      setTimeout(() => {
       setError("")
      }, 3000);
    } finally{
      setLoading(false);
    }
  };

  const toggleTodo = async (todoId, completed) => {
    try {
      await axios.put(`https://ktodoapi.onrender.com/api/todo`, { checked: completed, id: todoId });
      fetchTodos(); // Refresh todos after updating
      setSuccess(`Todo ${completed ? "checked" : "unchecked"} `);
      setTimeout(() => {
        setSuccess("")
       }, 3000);
    } catch (error) {
      console.error('Error updating todo:', error);
      setError(error.response?.data?.message || 'Something went wrong');
       setTimeout(() => {
       setError("")
      }, 3000);
    } finally{
      setLoading(false);
    }
  };

  const deleteTodo = async (todoId) => {
    // Display a confirmation prompt
    const confirmed = window.confirm("Are you sure you want to delete this todo?");
  
    // If user confirms deletion
    if (confirmed) {

      setLoading(true);
      console.log(todoId)
      try {
        await axios.delete(`https://ktodoapi.onrender.com/api/todo/${todoId}`);
        fetchTodos(); // Refresh todos after deleting
        setSuccess("Todo Deleted Successfully");
        setTimeout(() => {
          setSuccess("")
         }, 3000);
      } catch (error) {
        console.error('Error deleting todo:', error);
        setError(error.response?.data?.message || 'Something went wrong');
        setTimeout(() => {
          setError("")
         }, 3000);
      } finally {
        setLoading(false);
      }
      
    }
  };
  
  const handleShareClick = async () => {
  
   console.log("rueehh")
    try {
     
      const canvas = await html2canvas(document.body);
      const image = canvas.toDataURL('image/png'); // Convert to PNG
      const link = document.createElement('a');
      link.href = image;
      link.download = `${username} ${category}-list.png`;
      link.click();
      
    } catch (error) {
      console.error('Error sharing Todo List:', error);
    } finally {
      setTimeout(() => {
        setIsSharing(false);
      }, 2000);
    }
  };


 



  return (
    <div className="todo-page">
    <div className="header"> <img src={myLogo} alt='logo' />   <h1>{category}</h1>
      </div>
    
      {error && <p className="error-message">{error}</p>}
      
   {success && <p className="success-message">{success} <CheckIcon />  </p>}
      <div className="add-todo">
       

       <form className="add-todo" onSubmit={addTodo}>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => {
            setNewTodo(e.target.value)
            setError("")
            setSuccess("")
          }}
        placeholder="Add a new todo"
        className="todo-input"
      />
      <button type="submit" className="add-btn">Add</button>
    </form>
      </div>
      <div className="todo-list">
        { loading ? 
        <div>
        <div className={`loading-modal ${loading ? 'show' : ''}`}>
      <div className="loading-spinner"></div>
    </div>
        </div>  : todos.map(todo => (
          <div key={todo._id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.checked}
              onChange={() => toggleTodo(todo._id, !todo.checked)}
            />
            <span className={ todo.checked ? 'completed' : ''}>{todo.name}</span>
            <button className='delete' onClick={() => deleteTodo(todo._id)}><DeleteIcon color="info" /></button>
          </div>
        ))}
      </div>
      {!isSharing && <button onClick={()=>{
        setIsSharing(true);
         setTimeout(() => {
          handleShareClick()
      }, 2000);
        
      }}>
      <ShareIcon />
      </button>}
      <p style={{color: "Gray", fontFamily: "cursive", textAlign: "right"}} >{username}</p>
    </div>
  );
}




export default TodoPage;
