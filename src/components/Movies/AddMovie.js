import React, { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Checkbox,
  // Import Image from @mui/material
} from "@mui/material";
import { styled } from "@mui/system";
import { ChakraProvider, Image, VStack, StackDivider } from "@chakra-ui/react";
import { addMovie } from "../../api-helpers/api-helpers"; // Import the addMovie function
import { useNavigate } from "react-router-dom";

const StyledBox = styled(Box)(({ theme }) => ({
  width: "50%",
  margin: "auto",
  padding: theme.spacing(3),
  borderRadius: "10px",
  boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.1)", // Updated box shadow
}));

const labelProps = {
  mt: 2,
  mb: 1,
};

const AddMovie = () => {
  const [actors, setActors] = useState([""]); // State for actors input fields
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  
  const handleAddActor = () => {
    setActors([...actors, ""]); // Add a new empty actor input field
  };

  const handleChangeActor = (index, value) => {
    const newActors = [...actors];
    newActors[index] = value;
    setActors(newActors);
  };

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    actors: "",
    releaseDate: "",
    posterUrl: "",
    featured: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const movieData = {
      ...inputs,
      actors: actors.filter((actor) => actor.trim() !== ""), // Filter out empty actors
    };

    try {
      await addMovie(movieData);
      setShowPopup(true);
    } catch (err) {
      console.error("Error adding movie:", err);
      alert("Failed to add movie. Please try again.");
    }
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePopupResponse = (addMore) => {
    setShowPopup(false);
    if (addMore) {
      setInputs({
        title: "",
        description: "",
        releaseDate: "",
        posterUrl: "",
        featured: false,
      });
      setActors([""]); // Reset actors field
    } else {
      navigate("/");
    }
  };

  return (
    <StyledBox>
      <Box display="flex" alignItems="center" mb={3}>
        {/* Using Chakra-UI's Image component */}
        <Image
          boxSize="100px"
          borderRadius="full"
          src="./logo/addMov.png"
          alt="userLogo"
          marginBottom={2}
        />
        <Typography variant="h4" align="center" ml={1} fontFamily="fantasy">
          Add New Movie
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
              required
              value={inputs.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={4}
              value={inputs.description}
              onChange={handleChange}
            />
          </Grid>

          {actors.map((actor, index) => (
            <Grid item xs={12} key={index}>
              <TextField
                name={`actor${index + 1}`}
                label={`Actor ${index + 1}`}
                variant="outlined"
                fullWidth
                value={actor}
                onChange={(e) => handleChangeActor(index, e.target.value)}
                required
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button variant="outlined" onClick={handleAddActor}>
              Add Another Actor
            </Button>
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="releaseDate"
              label="Release Date"
              type="date"
              variant="outlined"
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
              value={inputs.releaseDate}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              name="posterUrl"
              label="Poster URL"
              variant="outlined"
              fullWidth
              required
              value={inputs.posterUrl}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <Checkbox
              name="featured"
              checked={inputs.featured}
              onClick={(e) =>
                setInputs((prevState) => ({
                  ...prevState,
                  featured: e.target.checked,
                }))
              }
            />
            <Typography variant="body1">Featured?</Typography>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              size="large"
            >
              Add New Movie
            </Button>
          </Grid>
        </Grid>
      </form>

      {showPopup && (
            <Box
              position="fixed"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              bgcolor="white"
              p={3}
              boxShadow="0px 0px 20px rgba(0, 0, 0, 0.2)"
              borderRadius="10px"
              textAlign="center"
            >
              <Typography variant="h6">
                Movie added successfully. Do you want to add more movies?
              </Typography>
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handlePopupResponse(true)}
                  style={{ marginRight: "10px" }}
                >
                  Yes
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handlePopupResponse(false)}
                >
                  No
                </Button>
              </Box>
            </Box>
          )}


    </StyledBox>
  );
};

export default AddMovie;

