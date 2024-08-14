import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    tasks: [],
    loading: false,
    error: null,
    totalPages: 0,
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        fetchTasksRequest(state) {
            state.loading = true;
        },
        fetchTasksSuccess(state, action) {
            state.loading = false;
            state.tasks = action.payload.tasks;
            state.totalPages = action.payload.totalPages;
        },
        fetchTasksFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        insertTaskRequest(state) {
            state.loading = true;
        },
        insertTaskSuccess(state, action) {
            state.loading = false;
        },
        insertTaskFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateTaskRequest(state) {
            state.loading = true;
        },
        updateTaskSuccess(state, action) {
            state.loading = false;
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },
        updateTaskFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteTaskRequest(state) {
            state.loading = true;
        },
        deleteTaskSuccess(state, action) {
            state.loading = false;
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },
        deleteTaskFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
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
} = taskSlice.actions;

export default taskSlice.reducer;
