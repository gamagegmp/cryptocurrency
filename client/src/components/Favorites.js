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

const Favorites = () => {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("token")));
  const [filteredCryptos, setFilteredCryptos] = useState([]);

  useEffect(() => {
    const refreshTimeout = setTimeout(() => {
      window.location.reload();
    }, 10000);

    return () => clearTimeout(refreshTimeout);
  }, []);

  const token = user?.token;

  const headers = {
    Authorization: `Bearer ${token}`,
  };

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

  useEffect(() => {
    if (data && user && user.selected) {
      const selectedCryptos = user.selected;
      const filtered = data.cryptos.filter((crypto) =>
        selectedCryptos.includes(crypto.name)
      );
      setFilteredCryptos(filtered);
    }
  }, [data, user]);

  const handleRemoveFavorites = (cryptoName, userId) => {
    axios
      .post(
        `http://localhost:8080/user/removeSelectedCrypto/${userId}`,
        {
          cryptoName,
        },
        { headers }
      )
      .then((response) => {
        const updatedUser = response.data.user;
        const storedToken = JSON.parse(localStorage.getItem("token")) || {};
        storedToken.selected = updatedUser.selectedCryptos || [];
        localStorage.setItem("token", JSON.stringify(storedToken));

        window.location.reload();
      })
      .catch((error) => {
        console.error("Error removing from favorites:", error);
      });
  };

  if (!data?.cryptos) {
    return <LinearProgress style={{ marginTop: "300px" }} />;
  }

  return (
    <Container style={{ marginTop: "100px" }}>
      <Grid container spacing={2}>
        {filteredCryptos.map((crypto) => (
          <Grid item xs={3} textAlign="center" key={crypto.name}>
            <Card
              variant="filled"
              color="primary"
              style={{ backgroundColor: "#f0faf1" }}
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
                    color="secondary"
                    textAlign="center"
                    onClick={() => handleRemoveFavorites(crypto.name, user.id)}
                  >
                    REMOVE
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

export default Favorites;
