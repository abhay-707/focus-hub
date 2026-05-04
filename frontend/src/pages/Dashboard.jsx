import { useRecoilState, useRecoilValue } from "recoil";
import { tasksState } from "../state/tasksAtom";
import { authState } from "../state/authAtom";
import api from "../api/axios";
import { useEffect, useMemo } from "react";
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
import LinearProgress from "@mui/material/LinearProgress";

// Dashboard.jsx
export default function Dashboard() {
  const [tasks, setTasks] = useRecoilState(tasksState);
  const auth = useRecoilValue(authState);
  const { logout } = useAuth();

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  const resetTasks = async () => {
    try {
      const res = await api.put("/tasks/reset");
      setTasks(res.data.map((t) => ({ ...t })));
    } catch (error) {
      console.error("Couldn't reset:", error);
    }
  };

  // Called by Task after a successful toggle — keeps Recoil in sync
  const handleTaskToggle = (taskId, newCompleted) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: newCompleted } : t,
      ),
    );
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

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const progressPercent =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const groupedTasks = useMemo(() => {
    const acc = tasks.reduce((acc, task) => {
      const day = task.day_of_week;
      if (!acc[day]) acc[day] = [];
      acc[day].push(task);
      return acc;
    }, {});
    dayOrder.forEach((day) => {
      if (!acc[day]) acc[day] = [];
    });
    return acc;
  }, [tasks]);

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
          <Typography variant="h4">Focus Hub</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle1">
              Hello, {auth.user?.name || "User"}
            </Typography>
            <Button variant="outlined" color="danger" onClick={logout}>
              Logout
            </Button>
          </Box>
        </Toolbar>

        <Box sx={{ px: 3, pb: 1.5 }}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" color="text.secondary">
              Weekly progress
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {completedTasks} / {totalTasks} · {progressPercent}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            color="success"
            sx={{ borderRadius: 1, height: 6 }}
          />
        </Box>
      </AppBar>

      <Fab
        variant="extended"
        onClick={resetTasks}
        sx={{
          backgroundColor: "transparent",
          border: "2px solid",
          borderColor: "error.main",
          color: "error.main",
          "&:hover": { backgroundColor: "transparent" },
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <RestartAltIcon sx={{ m: 1 }} />
        Reset Week
      </Fab>

      <div className="cards-space">
        {dayOrder.map((day) => (
          <DayCard
            key={day}
            day={day}
            tasks={groupedTasks[day]}
            onTaskToggle={handleTaskToggle}
          />
        ))}
      </div>
    </>
  );
}
