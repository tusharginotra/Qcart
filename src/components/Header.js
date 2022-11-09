import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import {useHistory,Link} from 'react-router-dom';
import {useState} from 'react';
import {
  InputAdornment,
  TextField
} from "@mui/material";
import { Search} from "@mui/icons-material";

const Header = ({ children, hasHiddenAuthButtons }) => {

    const history = useHistory();
    //const [islog,setlog] = useState();

    const logout = ()=>{
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      localStorage.removeItem('balance');
      history.push("/");
      
      window.location.reload();
      //setlog(false);

    }
    const username = localStorage.getItem('username');
    return (
      
      <Box className="header">
        <Box className="header-title">
            <img src="logo_light.svg" alt="QKart-icon"></img>
            
        </Box>
        {children}
        { !hasHiddenAuthButtons  &&
          <>
          
          <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={()=>{history.push("/")}}
        >
          Back to explore
        </Button>
        
        </>
        }
        {/* for logged in users Products page view */}
        {
          hasHiddenAuthButtons &&  localStorage.getItem('username') && 
          <div>
           <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
            <Avatar alt={username} username={username} src="avatar.png" />
        <p>{username}</p>
        

        <Button type="Button" variant="contained" onClick={logout}>

        LOGOUT

        </Button> 

        
        </Stack> 
            </div>
        }
        {
          hasHiddenAuthButtons && !localStorage.getItem('username') &&
            <div>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={4}>
    
            <Button className="button" variant="contained" onClick={()=>{history.push("/register")}}>REGISTER</Button>
            
            
            
            <Button className="button" variant="contained" onClick={()=>{ history.push("/login")}}>LOGIN</Button>
            
            </Stack>
            </div>
           
        }
      </Box>
      

    );
};

export default Header;
