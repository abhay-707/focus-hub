import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Task from "./Task";
import api from "../api/axios";
import { useRecoilState } from "recoil";
import { tasksState } from "../state/tasksAtom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

export default function DayCard({ day, tasks, onTaskToggle }) {
  const [globalTasks, setGlobalTasks] = useRecoilState(tasksState);
  const [taskName, setTaskName] = useState("");

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setGlobalTasks(globalTasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAdd = async (title, dayOfWeek) => {
    try {
      const res = await api.post("/tasks", { title, dayOfWeek });
      setGlobalTasks([...globalTasks, res.data]);
      setTaskName("");
    } catch (error) {
      console.error("couldn't add");
    }
  };

  return (
    <Card variant="outlined" className="day-card">
      <b>{day}</b>
      <center>
        <Stack
          spacing={2}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
          }}
        >
          <Stack spacing={2}>
            {tasks.map((t) => (
              <Task
                key={t.id}
                task={t}
                deleteFunction={() => handleDelete(t.id)}
                onToggle={onTaskToggle}
              />
            ))}
          </Stack>
          <TextField
            color="success"
            placeholder="Add New Task"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <Button
            color="success"
            variant="outlined"
            onClick={() => handleAdd(taskName, day)}
          >
            <AddIcon />
          </Button>
        </Stack>
      </center>
    </Card>
  );
}
