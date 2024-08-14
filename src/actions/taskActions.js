import {
    fetchTasksRequest,
    fetchTasksSuccess,
    fetchTasksFailure,
    insertTaskRequest,
    insertTaskSuccess,
    insertTaskFailure,
    updateTaskRequest,
    updateTaskSuccess,
    updateTaskFailure,
    deleteTaskRequest,
    deleteTaskSuccess,
    deleteTaskFailure,
} from '../reducers/taskReducers';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { toURLString } from '../utils/request';

// Fetch Tasks
export const fetchTasks = (page, limit, search, sort, order) => async (dispatch) => {
    dispatch(fetchTasksRequest());
    try {
        let requestURL = '/api/task'
        let params = {
            page: page,
            limit
        }
        if (search && search != "") {
            params.search = search
        }
        if (sort && sort != "") {
            params.sort = sort;
            params.order = order
        }
        requestURL = requestURL + toURLString(params)
        const response = await api.get(requestURL);
        dispatch(fetchTasksSuccess(response.data));
    } catch (error) {
        dispatch(fetchTasksFailure(error.message));
    }
};

// Insert Task
export const insertTask = (task) => async (dispatch) => {
    dispatch(insertTaskRequest());
    try {
        const response = await api.post('/api/todoTask', task);
        dispatch(insertTaskSuccess(response.data));
        dispatch(fetchTasks(1, 5))
        toast.success('Task added successfully!');

    } catch (error) {
        dispatch(insertTaskFailure(error?.response?.data?.message));
        toast.error(`Failed to add task.${error?.response?.data?.message}`);

    }
};

// Update Task
export const updateTask = (id, updatedTask) => async (dispatch) => {
    dispatch(updateTaskRequest());
    try {
        const response = await api.put(`/api/task?id=${id}`, updatedTask);
        dispatch(updateTaskSuccess(response.data));
        toast.success('Task updated successfully!');

    } catch (error) {
        dispatch(updateTaskFailure(error?.response?.data?.message));
        toast.error(`Failed to update task.${error?.response?.data?.message}`);

    }
};

// Delete Task
export const deleteTask = (id) => async (dispatch) => {
    dispatch(deleteTaskRequest());
    try {
        await api.delete(`/api/task?id=${id}`);
        dispatch(deleteTaskSuccess(id));
        toast.success('Task deleted successfully!');
    } catch (error) {
        dispatch(deleteTaskFailure(error?.response?.data?.message));
        toast.error(`Failed to delete task.${error?.response?.data?.message}`);
    }
};
