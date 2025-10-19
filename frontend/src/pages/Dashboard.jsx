import { useRecoilState } from "recoil";
import { tasksState } from "../state/tasksAtom";
import { authState } from "../state/authAtom";
import api from "../api/axios";
import { useEffect } from "react";
import Grid from "@mui/material/Grid";
import DayCard from "../components/DayCard";
import Button from "@mui/material/Button";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useAuth from "../hooks/useAuth";
import Fab from "@mui/material/Fab";
export default function Dashboard() {
  const [tasks, setTasks] = useRecoilState(tasksState);
  const [auth, setAuth] = useRecoilState(authState);
  const { logout } = useAuth();
  const fetchTasks = async () => {
    const res = await api.get("/tasks");

    console.log(res.data);

    setTasks(res.data);
  };

  const resetTasks = async () => {
    try {
      await api.put("/tasks/reset");
      const res = await api.get("/tasks");
      setTasks([...res.data]);
    } catch (error) {
      console.error("Couldn't reset:", error);
    }
  };

  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const groupedTasks = tasks.reduce((acc, task) => {
    const day = task.day_of_week;
    if (!acc[day]) acc[day] = [];
    acc[day].push(task);
    return acc;
  }, {});

  dayOrder.forEach((day) => {
    if (!groupedTasks[day]) groupedTasks[day] = [];
  });
  console.log("Updated tasks state:", tasks);

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
            Focus Hub
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle1">
              Hello, {auth.user?.name || "User"}
            </Typography>
            <Button
              variant="outlined"
              color="danger"
              onClick={() => {
                logout();
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Fab
        variant="extended"
        color="danger"
        onClick={() => {
          resetTasks();
          window.location.reload();
        }}
        sx={{
          position: "fixed", // fixed on screen
          bottom: 16, // distance from bottom
          right: 16, // distance from right
          zIndex: 1000, // make sure it stays above other content
        }}
      >
        <RestartAltIcon sx={{ m: 1 }} />
        Reset Week
      </Fab>
      <div className="cards-space">
        {dayOrder.map((day) => (
          <DayCard key={day} day={day} tasks={groupedTasks[day]} />
        ))}
      </div>

      <center>
        <Button
          color="danger"
          variant="outlined"
          sx={{ m: 10, width: "50vw" }}
          onClick={() => {
            resetTasks();
            window.location.reload();
          }}
        >
          Reset week
          <RestartAltIcon />
        </Button>
      </center>
    </>
  );
}
