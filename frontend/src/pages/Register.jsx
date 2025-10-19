import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    if (email === "" || password === "" || name === "") return;
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <>
      <AppBar position="static" color="secondary">
        <Toolbar
          sx={{
            height: "15vh",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h4" component="div">
            Login to Focus Hub
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle1">Hello, {"User"}</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <div className="login-form" color="primary">
        <TextField
          type="name"
          color="success"
          variant="outlined"
          label="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <TextField
          type="email"
          color="success"
          variant="outlined"
          label="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          type="password"
          color="success"
          variant="outlined"
          label="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          color="success"
          variant="outlined"
          disabled={loading}
          onClick={submit}
        >
          {loading ? "logging..." : "Register"}
        </Button>
        {error && <div color="danger.main">{error}</div>}
        <Typography color="success">
          Already registered? <Link to="/login"> login here</Link>
        </Typography>
      </div>
    </>
  );
}
