import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import React from 'react'
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Thanks from "./components/Thanks"
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'
import Checkout from "./components/Checkout";

export const config = {
  endpoint: `https://qkart-frontend-by-tushar.herokuapp.com/api/v1`,
};

function App() {
  
  return (
    <div className="App">
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
          {/* <Register /> */}
          
            {/* <React.StrictMode>
            <ThemeProvider theme = {theme}>
              <Login/>
              </ThemeProvider>
            </React.StrictMode>  */}
            <ThemeProvider theme ={theme}>
            <Switch>
              <Route  path="/login">
                    <Login />
                  </Route>  
                  <Route  path='/thanks' >
                    <Thanks />
                  </Route>
                <Route  path='/register' >
                    <Register />
                  </Route>
                  <Route  path='/checkout' >
                    <Checkout />
                  </Route>
                  <Route exact path="/">
                      <Products/>
                  </Route>         
                  
            </Switch> 
        </ThemeProvider>
          
    </div>
  );
}

export default App;
