import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

function CategoryItem(props){
    return <li >
    <span onClick={()=> props.onClick(props.name)}><RadioButtonCheckedIcon color='info' fontSize='small'/>              {props.name}</span>
    <button onClick={() => props.deleteCategory(props._id)}><DeleteIcon /></button>
  </li>
}

export default CategoryItem;