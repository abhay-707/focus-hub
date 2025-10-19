import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    if (email === "" || password === "") return;
    e.preventDefault();
    console.log("Sending:", { email, password });
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/app");
    } catch (error) {
      setError(error.response?.data?.error || "Login Failed");
    } finally {
      setLoading(false);
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
          {loading ? "logging..." : "Log In"}
        </Button>
        {error && <Box color={"danger.main"}>{error}</Box>}
        <Typography color="success">
          New user? <Link to="/register"> Register here</Link>
        </Typography>
      </div>
    </>
  );
}
