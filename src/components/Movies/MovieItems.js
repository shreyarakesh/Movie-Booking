import React from "react";
import { Card, CardMedia, CardContent, Typography, Button, CardActions } from "@mui/material";
import { Link } from "react-router-dom";

const MovieItem = ({ title, releaseDate, posterUrl, id , admin}) => {
  return (
    <Card sx={{ 
      margin: 1,
      width: 250, 
      height: 350, 
      borderRadius: 5,
      ":hover": {
        boxShadow: "10px 10px 20px #ccc"
      } 
    }}>
      <CardMedia
        component="img"
        image={posterUrl}
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
        <Button 
          component={Link}
          to={`/booking/${id}`} // 
          sx={{ margin: "auto" }} 
          size="small"
        >
          Book
        </Button>
      </CardActions>
    </Card>
  );
};

export default MovieItem;
