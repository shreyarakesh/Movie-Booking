import React, { useEffect, useState } from "react";
import { ChakraProvider, extendTheme, Image, Heading } from "@chakra-ui/react";
import { AppBar, Toolbar, Autocomplete, TextField, Tab, Tabs } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from "@mui/system";
import { Link } from 'react-router-dom';

import { getAllMovies } from '../api-helpers/api-helpers.js';
import { useDispatch, useSelector } from "react-redux";
import { adminActions, userActions } from "../store/index.js";

const chakraTheme = extendTheme({
  colors: {
    brand: {
      900: '#ff007a', // Deep pink
      500: '#f971a3', // Lighter pink
    },
  },
  fonts: {
    heading: '"Segoe UI", sans-serif', // Replace with your preferred font
  },
});

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#ff007a',
    },
    secondary: {
      main: '#f971a3',
    },
  },
  typography: {
    fontWeightBold: 600, // Set bold font weight for all components
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            color: 'white', // Text color
          },
          '& .MuiInputLabel-root': {
            color: 'white', // Label color
          },
          '& .MuiInput-underline:before': {
            borderBottomColor: 'white', // Underline color before focus
          },
          '& .MuiInput-underline:after': {
            borderBottomColor: 'white', // Underline color after focus
          },
          '& ::placeholder': {
            color: 'white', // Placeholder text color
            fontWeight: 'bold', // Placeholder text weight
          },
        },
      },
    },
  },
});

const Header = () => {
  const [value, setValue] = useState(0);
  const [movies, setMovies] = useState([]);
  const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
  const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllMovies()
      .then((data) => setMovies(data.movies))
      .catch((err) => console.log(err));
  }, []);

  const logout = (isAdmin) => {
    dispatch(isAdmin ? adminActions.logout() : userActions.logout());
  };

  return (
    <ChakraProvider theme={chakraTheme}>
      <ThemeProvider theme={muiTheme}>
        <AppBar position="sticky">
          <Toolbar>
            <Box width="30%" display="flex" alignItems="center">
              <Link to="/">
                <Image boxSize="70px" src="./logo/mvLogo2.png" mr={4} alt="MyLogo" />
              </Link>
              <Heading as='h1' fontSize="2xl" noOfLines={1} color="white">
                M.N.N.I.T MULTIPLEX
              </Heading>
            </Box>

            <Box width="30%" mx="auto">
              {movies.length === 0 ? (
                <TextField variant="standard" disabled placeholder="Loading..." />
              ) : (
                <Autocomplete
                  freeSolo
                  options={movies.map((option) => option.title)}
                  renderInput={(params) => (
                    <TextField 
                      variant="standard" 
                      {...params} 
                      placeholder="SEARCH ACROSS MOVIES" 
                      InputProps={{
                        ...params.InputProps,
                        style: { color: 'white', backgroundColor: 'rgba(0,0,0,0.1)', padding: '5px 10px', borderRadius: '5px' }
                      }}
                      InputLabelProps={{
                        style: { color: 'white' }
                      }}
                    />
                  )}
                />
              )}
            </Box>

            <Box display="flex" marginLeft="auto">
              <Tabs
                textColor="inherit"
                indicatorColor="secondary"
                value={value}
                onChange={(e, val) => setValue(val)}
              >
                <Tab LinkComponent={Link} to="/movies" label="Movies" />
                {!isAdminLoggedIn && !isUserLoggedIn && (
                  <>
                    <Tab LinkComponent={Link} to="/admin" label="Admin" />
                    <Tab LinkComponent={Link} to="/auth" label="Auth" />
                  </>
                )}

                {isUserLoggedIn && (
                  < >
                    <Tab LinkComponent={Link} to="/user" label="Profile" />
                    <Tab 
                      onClick={() => logout(false)}
                      label="Logout" 
                      LinkComponent={Link} to="/"
                    />
                  </>
                )}

                {isAdminLoggedIn && (
                  <>
                    <Tab LinkComponent={Link} to="/add" label="Add Movies" />
                    <Tab LinkComponent={Link} to="/profile" label="Admin Profile" />
                    <Tab 
                      
                      onClick={() => logout(true)} 
                      label="Logout" 
                      LinkComponent={Link} to="/"
                    />
                  </>
                )}
              </Tabs>
            </Box>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default Header;
