import api from "../api/axios";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Task({ task, deleteFunction }) {
  const [complete, setComplete] = useState(task.completed);

  const handleToggle = async (event) => {
    const newCompleted = event.target.checked;
    setComplete(newCompleted);

    try {
      await api.put(`/tasks/${task.id}`, { completed: newCompleted });
      console.log(`Task ${task.id} updated successfully`);
    } catch (error) {
      console.error(error);
      setComplete(!newCompleted);
    }
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center" // vertical alignment
        justifyContent="space-between" // optional if you want spacing
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
          }}
          variant="body1"
        >
          {task.title}
        </Typography>
        <IconButton color="danger" onClick={deleteFunction}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </>
  );
}
