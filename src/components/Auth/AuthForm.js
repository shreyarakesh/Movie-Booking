import React, { useState } from "react";
import { Box, Button, FormLabel, IconButton } from "@mui/material";
import { Dialog, TextField, Typography } from "@mui/material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

const labelStyle = { mt: 1, mb: 1 };

const AuthForm = ({onSubmit, isAdmin}) => {
    const [isSignup, setIsSignup] = useState(false);
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({inputs, signup : isAdmin ? false : isSignup});
        // Add your form submission logic here
    };

    const handleClose = () => {
        // Add logic to close the dialog if needed
    };

    return (
        <Dialog PaperProps={{ style: { borderRadius: 20 }}} open={true} onClose={handleClose}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={handleClose}>
                    <CloseRoundedIcon />
                </IconButton>
            </Box>
            <Typography variant="h4" textAlign={"center"} sx={{ mt: 1 }}>
                {isSignup ? "Signup" : "Login"}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box
                    padding={6}
                    display={"flex"}
                    justifyContent={"center"}
                    flexDirection="column"
                    width={400}
                    margin="auto"
                    alignContent={"center"}
                >
                    {!isAdmin && isSignup && (
                        < >
                            <FormLabel sx={labelStyle}>Name</FormLabel>
                            <TextField
                                value={inputs.name}
                                onChange={handleChange}
                                margin="normal"
                                variant="standard"
                                type="text"
                                name="name"
                            />
                        </>
                    )}
                    <FormLabel sx={labelStyle}>Email</FormLabel>
                    <TextField
                        value={inputs.email}
                        onChange={handleChange}
                        margin="normal"
                        variant="standard"
                        type="email"
                        name="email"
                    />
                    <FormLabel sx={labelStyle}>Password</FormLabel>
                    <TextField
                        value={inputs.password}
                        onChange={handleChange}
                        margin="normal"
                        variant="standard"
                        type="password"
                        name="password"
                    />
                    <Button
                        sx={{
                            color: "white",
                            borderColor: "#f971a3",
                            borderRadius: 10,
                            bgcolor: "#2b2d42",
                            mt: 3,
                            ":hover": {
                                bgcolor: "#ff007a",
                                borderColor: "#ff007a",
                                color: "white",
                            },
                            transition: "all 0.3s ease-in-out",
                        }}
                        variant="contained"
                        type="submit"
                    >
                        {isSignup ? "Signup" : "Login"}
                    </Button>
                    {
                        !isAdmin && (
                            <Button
                        onClick={() => setIsSignup(!isSignup)}
                        sx={{
                            mt: 3,
                            borderRadius: 10,
                            bgcolor: "#e0e0e0",
                            ":hover": {
                                bgcolor: "#bdbdbd",
                            },
                            transition: "all 0.3s ease-in-out",
                        }}
                        fullWidth
                    >
                        Switch To {isSignup ? "Login" : "Signup"}
                    </Button>

                    )}
                    
                </Box>
            </form>
        </Dialog>
    );
};

export default AuthForm;
