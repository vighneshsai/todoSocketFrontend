import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const TaskCard = ({ task }) => {
  return (
    <Card style={{ margin: '16px', padding: '16px', backgroundColor: '#f9f9f9' }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {task.taskName}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Assigned to: {task.name}
        </Typography>
        <Typography variant="body2" component="p">
          Description: {task.description}
        </Typography>
        <Typography variant="body2" component="p">
          Due Date: {task.dueDate}
        </Typography>
        <Typography variant="body2" component="p">
          Status: {task.status}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
