import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from '@mui/material';

const EditTaskDialog = ({ open, handleClose, currentTask, handleTaskChange, handleSave, isEditMode }) => {
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{isEditMode ? 'Edit Task' : 'Add Task'}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please {isEditMode ? 'update' : 'fill in'} the task details below.
                </DialogContentText>
                <TextField
                    margin="dense"
                    label="Task Name"
                    type="text"
                    fullWidth
                    value={currentTask.taskName || ''}
                    onChange={(e) => handleTaskChange({ ...currentTask, taskName: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Assigned To"
                    type="text"
                    fullWidth
                    value={currentTask.name || ''}
                    onChange={(e) => handleTaskChange({ ...currentTask, name: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    value={currentTask.description || ''}
                    onChange={(e) => handleTaskChange({ ...currentTask, description: e.target.value })}
                />
                <TextField
                    margin="dense"
                    label="Due Date"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formatDate(currentTask.dueDate)}
                    onChange={(e) => handleTaskChange({ ...currentTask, dueDate: e.target.value })}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={currentTask.status || 'pending'}
                        onChange={(e) => handleTaskChange({ ...currentTask, status: e.target.value })}
                        label="Status"
                    >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="inProgress">In Progress</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    {isEditMode ? 'Save' : 'Add'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditTaskDialog;
