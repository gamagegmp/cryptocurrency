import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Container,
  Grid,
  Avatar,
  LinearProgress,
} from "@mui/material";
import "./style.css";

const Home = () => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("token")));

  const token = user?.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    const refreshTimeout = setTimeout(() => {
      window.location.reload();
    }, 10000);

    return () => clearTimeout(refreshTimeout);
  }, []);

  useEffect(() => {
    // Make a GET request to the backend API
    axios
      .get("http://localhost:8080/crypto")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleAddToFavorites = (cryptoName, userId) => {
    axios
      .post(
        `http://localhost:8080/user/addSelectedCrypto/${userId}`,
        {
          cryptoName,
        },
        { headers }
      )
      .then((response) => {
        const updatedUser = response.data.user;
        const storedToken = JSON.parse(localStorage.getItem("token")) || {};
        console.log("storedToken:", storedToken);
        storedToken.selected = updatedUser.selectedCryptos || [];
        localStorage.setItem("token", JSON.stringify(storedToken));
      })
      .catch((error) => {
        console.error("Error adding to favorites:", error);
      });
  };

  if (!data?.cryptos) {
    return <LinearProgress style={{ marginTop: "400px" }} />;
  }

  return (
    <Container style={{ marginTop: "100px" }}>
      <Grid container spacing={2}>
        {data.cryptos.map((crypto) => (
          <Grid item xs={3} textAlign="center" key={crypto.name}>
            <Card
              variant="filled"
              color="primary"
              style={{ backgroundColor: "#f0f9fa" }}
            >
              <CardContent orientation="horizontal">
                <CardContent>
                  <Avatar
                    alt="Remy Sharp"
                    src={crypto.logo}
                    sx={{ width: 50, height: 50 }}
                    style={{ margin: "auto" }}
                  />
                  <Typography variant="h2" textAlign="center" fontSize="40px">
                    {crypto.name}
                  </Typography>
                  <Typography variant="h5">$ {crypto.price}</Typography>
                </CardContent>
                <Typography variant="body2">
                  updated: {crypto.updatedAt}
                </Typography>
              </CardContent>
              <CardActions>
                {user && (
                  <Button
                    fullWidth
                    variant="outlined"
                    size="sm"
                    textAlign="center"
                    onClick={() => handleAddToFavorites(crypto.name, user.id)}
                  >
                    Add to Favorites
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
