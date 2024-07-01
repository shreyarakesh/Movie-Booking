import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ChakraProvider, Image, VStack, StackDivider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// Create a MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h6: {
      fontWeight: 500,
    },
  },
});

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <ChakraProvider>
      <ThemeProvider theme={theme}>
        <Box
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding={1}
          bgcolor="#f5f5f5"
          height="100vh" // Use height instead of minHeight
        >
          <Paper elevation={3} sx={{ padding: 4, textAlign: 'center' }}>
            <VStack spacing={4} divider={<StackDivider borderColor="gray.200" />}>
              <Image
                boxSize="400px"
                src="./logo/movlogo2.png"
                alt="Error"
              />
              <Typography variant="h4" color="secondary" gutterBottom>
                Error
              </Typography>
              <Typography variant="body1" gutterBottom>
                Access denied. You do not have permission to view this page.
              </Typography>
              <Button variant="contained" color="primary" onClick={handleGoBack}>
                Go to Home Page
              </Button>
            </VStack>
          </Paper>
        </Box>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default ErrorPage;
