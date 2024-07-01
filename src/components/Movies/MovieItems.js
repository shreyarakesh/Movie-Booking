import React, { useState } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const MovieItem = ({ title, releaseDate, posterUrl, id, admin }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility

  const handleBookClick = () => {
    const userId = localStorage.getItem("userId");
    const adminId = localStorage.getItem("adminId");

    if (!userId && !adminId) {
      navigate("/auth"); // Redirect to login if userId is not present in localStorage
    } else if (adminId) {
      setOpenDialog(true); // Open dialog for admins
    } else {
      navigate(`/booking/${id}`); // Navigate to booking page if userId is present
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close dialog
  };

  return (
    <Card
      sx={{
        margin: 1,
        width: 250,
        height: 350,
        borderRadius: 5,
        ":hover": {
          boxShadow: "10px 10px 20px #ccc",
        },
      }}
    >
      <CardMedia
        component="img"
        image={`/poster/${posterUrl}`}
        alt={title}
        sx={{
          height: "50%", // 50% of card height
          width: "100%",
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date(releaseDate).toDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleBookClick} sx={{ margin: "auto" }} size="small">
          Book
        </Button>
      </CardActions>

      {/* Dialog box for admins */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Admins are not allowed to book tickets.</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Please logout and login as a user to book tickets.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default MovieItem; 
