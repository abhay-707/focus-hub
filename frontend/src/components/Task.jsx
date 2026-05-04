import api from "../api/axios";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Task({ task, deleteFunction, onToggle }) {
  const [complete, setComplete] = useState(task.completed);

  useEffect(() => {
    setComplete(task.completed);
  }, [task.completed]);

  const handleToggle = async (event) => {
    const newCompleted = event.target.checked;
    setComplete(newCompleted);

    try {
      await api.put(`/tasks/${task.id}`, { completed: newCompleted });
      onToggle(task.id, newCompleted);
    } catch (error) {
      console.error(error);
      setComplete(!newCompleted);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{ gap: 1, width: "100%" }}
    >
      <Checkbox color="success" checked={complete} onChange={handleToggle} />
      <Typography
        sx={{
          flexGrow: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "flex",
          justifyContent: "flex-start",
          textDecoration: complete ? "line-through" : "none",
          opacity: complete ? 0.5 : 1,
          transition: "opacity 0.2s",
        }}
        variant="body1"
      >
        {task.title}
      </Typography>
      <IconButton color="danger" onClick={deleteFunction}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
