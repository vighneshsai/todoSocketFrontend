import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask, updateTask, insertTask } from '../actions/taskActions';
import { toast } from 'react-toastify';
import backgroundImage from "../public/todoBackground.jpg"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  TablePagination,
  IconButton,
  Button,
  TextField,
  TableSortLabel,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import io from 'socket.io-client';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditTaskDialog from '../components/taskDialog';
import Header from '../components/header';
import { json } from 'react-router-dom';
const socket = io('ws://localhost:8080');

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  paginationControls: {
    display: 'flex!important',
    flexDirection: "row!important",
    alignItems: 'center',
  },
  addButton: {
    marginBottom: '20px!important',
    marginTop: '10px!important',
    display: 'flex',
    justifyContent: "flex-end",
    width: "100%"
  },
  head: {
    width: "100%",
    background: "rgb(245, 245, 245)",
    padding: "10px 0",
    fontWeight: "bold !important",
    fontFamily: "Roboto !important",
    fontSize: "36px !important",
    lineHeight: "42px !important",
    display: "flex",
    justifyContent: "center"
  },
  searchInput: {
    marginBottom: '20px!important',
  },
  tableContainer: {
    maxWidth: "90%!important",
    padding: "0px !important"
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100px',
  },
  completed: {
    backgroundColor: '#d4edda',
    padding: "10px",
    borderRadius: "10px"
  },
  inProgress: {
    backgroundColor: '#FFFF00',
    padding: "10px",
    borderRadius: "10px"
  },
  pending: {
    backgroundColor: '#f8d7da',
    padding: "10px",
    borderRadius: "10px"
  },
  evenRow: {
    backgroundColor: '#f2f2f2',
  },
  rowLabel: {
    marginRight: "10px"
  }
});

const TaskTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { tasks, loading, error, totalPages } = useSelector((state) => state.tasks);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('taskName');
  const [order, setOrder] = useState('asc');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isEditMode, setIsEditMode] = useState(true);
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    dispatch(fetchTasks(page + 1, rowsPerPage)); 
    // Fetch tasks for the current page
  }, [dispatch, page]);

  useEffect(() => {
    socket.on('message', (message) => {
      console.log(message)
  });
  }, [])

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you need to delete the task")
    if (confirm) {
      dispatch(deleteTask(id));
    }
  };

  const handleEditClick = (task) => {
    setIsEditMode(true)
    setCurrentTask(task);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTaskChange = (task) => {
    setCurrentTask(task);
  };

  const handleSave = async () => {
    setSearch("")
    // setPage(0)
    if (isEditMode) {
      dispatch(updateTask(currentTask.id, currentTask));
    } else {
      dispatch(insertTask(currentTask));
    }
    setOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    dispatch(fetchTasks(page + 1, rowsPerPage, e.target.value, sort, order));
    setPage(0);
  };

  const handleSortChange = (property) => {
    const isAsc = sort === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setSort(property);
    dispatch(fetchTasks(1, rowsPerPage, search, property, isAsc ? 'desc' : 'asc'));
  };

  const handleAddClick = () => {
    setCurrentTask({
      taskName: '',
      name: '',
      description: '',
      dueDate: '',
      status: 'pending',
    });
    setIsEditMode(false);
    setOpen(true);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    dispatch(fetchTasks(page + 1, parseInt(event.target.value, 10), search, sort, order));
  };

  const getStatusClass = (status) => {
    if (status === 'Completed') return `${classes.status} ${classes.completed}`;
    if (status === 'In Progress') return `${classes.status} ${classes.inProgress}`;
    if (status === 'Pending') return `${classes.status} ${classes.pending}`;
    return classes.status;
  };

  return (
    <div>
      <Header />
      <img src={backgroundImage} style={{ width: "100%", height: "300px" }} />
      <Typography variant="h4" component="h2" gutterBottom className={classes.head}>
        Task List
      </Typography>
      <Container className={classes.tableContainer}>
        <div className={classes.addButton}>
          <Button
            variant="contained"
            color="primary"

            onClick={(e) => handleAddClick(e)}
          >
            Add Task
          </Button>
        </div>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          className={classes.searchInput}
          value={search}
          onChange={(e) => handleSearchChange(e)}
        />
        {loading ? <div className={classes.spinnerContainer}>
          <CircularProgress />
        </div> :
          <div>
            <TableContainer component={Paper} >
              <Table className={classes.table}>
                <TableHead>
                  <TableRow >
                    <TableCell style={{ border: '1px solid #ddd', fontSize: "16px", fontWeight: "600" }}>
                      <TableSortLabel
                        active={sort === 'taskName'}
                        direction={sort === 'taskName' ? order : 'asc'}
                        onClick={() => handleSortChange('taskName')}
                      >
                        Task Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontSize: "16px", fontWeight: "600" }}>
                      <TableSortLabel
                        active={sort === 'name'}
                        direction={sort === 'name' ? order : 'asc'}
                        onClick={() => handleSortChange('name')}
                      >
                        Assigned To
                      </TableSortLabel>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontSize: "16px", fontWeight: "600" }}>
                      <TableSortLabel
                        active={sort === 'description'}
                        direction={sort === 'description' ? order : 'asc'}
                        onClick={() => handleSortChange('description')}
                      >
                        Description
                      </TableSortLabel></TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontSize: "16px", fontWeight: "600" }}>
                      <TableSortLabel
                        active={sort === 'dueDate'}
                        direction={sort === 'dueDate' ? order : 'asc'}
                        onClick={() => handleSortChange('dueDate')}
                      >
                        Due Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontSize: "16px", fontWeight: "600" }}>
                      <TableSortLabel
                        active={sort === 'status'}
                        direction={sort === 'status' ? order : 'asc'}
                        onClick={() => handleSortChange('status')}
                      >
                        Status
                      </TableSortLabel>
                    </TableCell>
                    <TableCell style={{ border: '1px solid #ddd', fontSize: "16px", fontWeight: "600" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task, index) => (
                    <TableRow key={task.id} className={index % 2 === 0 ? classes.evenRow : ''}>
                      <TableCell style={{ border: '1px solid #ddd' }}>{task.taskName}</TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>{task.name}</TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>{task.description}</TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>
                        <span className={getStatusClass(task.status)}>{task.status == "In Progress" ?'In_Progress' :task.status}</span></TableCell>
                      <TableCell style={{ border: '1px solid #ddd' }}>
                        <IconButton onClick={() => {/* handle edit */ }}>
                          <EditIcon color="primary" onClick={() => handleEditClick(task)} />
                        </IconButton>
                        <IconButton color="primary" onClick={() => handleDelete(task.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalPages}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className={classes.pagination}
          /> */}

            <div className={classes.pagination}>
              <IconButton
                onClick={() => handleChangePage(page - 1)}
                disabled={page === 0}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <div className={classes.paginationControls}>
                <InputLabel className={classes.rowLabel}>Rows per page</InputLabel>
                <Select
                  className={classes.rowLabel}
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={25}>25</MenuItem>
                </Select>
              </div>
              <Typography>
                Page {page + 1} of {totalPages}
              </Typography>
              <IconButton
                onClick={() => handleChangePage(page + 1)}
                disabled={page >= totalPages - 1}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </div>
            {/* <div className={classes.pagination}>
        <IconButton
          onClick={() => handleChangePage(page - 1)}
          disabled={page === 0}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <div className={classes.paginationControls}>
          <Typography>
            Page {page + 1} of {totalPages}
          </Typography>
        </div>
        <IconButton
          onClick={() => handleChangePage(page + 1)}
          disabled={page >= totalPages - 1}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </div> */}
          </div>}
        {currentTask && (
          <EditTaskDialog
            open={open}
            handleClose={handleClose}
            currentTask={currentTask}
            handleTaskChange={handleTaskChange}
            handleSave={handleSave}
            isEditMode={isEditMode}
          />
        )}
      </Container>
    </div>
  );
};

export default TaskTable;
