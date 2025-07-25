import { useState, useEffect } from 'react';
import { Box, Grid, Fade, Grow, Snackbar, Alert, Typography } from '@mui/material';
import TodoColumn from './TodoColumn';
import todoIndexedDB from '../utils/indexedDB';

const STATUS = {
  NEW: 'New',
  ONGOING: 'Ongoing',
  DONE: 'Done',
};

const STATUS_COLORS = {
  New: {
    primary: '#2196f3',
    gradient: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
    light: '#e3f2fd',
  },
  Ongoing: {
    primary: '#ff9800',
    gradient: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
    light: '#fff3e0',
  },
  Done: {
    primary: '#4caf50',
    gradient: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
    light: '#e8f5e8',
  },
};

function KanbanBoard() {
  const [todos, setTodos] = useState([]);
  const [overdueAlert, setOverdueAlert] = useState({ open: false, message: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize IndexedDB and load data on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        await todoIndexedDB.init();
        const savedTodos = await todoIndexedDB.getAllTodos();
        
        if (savedTodos.length > 0) {
          setTodos(savedTodos);
        } else {
          // Load default sample data if no saved data exists
          const defaultTodos = [
            {
              id: 1,
              title: "Design System Setup",
              description: "Create a comprehensive design system with Material-UI components for consistent styling across the application.",
              status: STATUS.NEW,
              createdAt: new Date().toISOString(),
              priority: "high"
            },
            {
              id: 2,
              title: "API Integration",
              description: "Integrate REST API endpoints for CRUD operations on todo items with proper error handling.",
              status: STATUS.ONGOING,
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              dueDate: new Date(Date.now() + 86400000).toISOString(), // Due tomorrow
              priority: "high"
            },
            {
              id: 3,
              title: "User Authentication",
              description: "Implement secure user authentication system with JWT tokens and protected routes.",
              status: STATUS.DONE,
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              completedAt: new Date(Date.now() - 86400000).toISOString(),
              priority: "medium"
            },
            {
              id: 4,
              title: "Database Optimization",
              description: "Optimize database queries and implement proper indexing for better performance.",
              status: STATUS.ONGOING,
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              dueDate: new Date(Date.now() - 1800000).toISOString(), // Overdue by 30 minutes
              priority: "high"
            },
            {
              id: 5,
              title: "Code Review Process",
              description: "Establish a comprehensive code review process to maintain code quality and knowledge sharing.",
              status: STATUS.NEW,
              createdAt: new Date(Date.now() - 7200000).toISOString(),
              priority: "low"
            },
            {
              id: 6,
              title: "Testing Framework Setup",
              description: "Set up unit testing and integration testing frameworks for better code reliability.",
              status: STATUS.DONE,
              createdAt: new Date(Date.now() - 259200000).toISOString(),
              completedAt: new Date(Date.now() - 172800000).toISOString(),
              priority: "medium"
            },
          ];
          setTodos(defaultTodos);
          await todoIndexedDB.saveTodos(defaultTodos);
        }
      } catch (error) {
        console.error('Failed to initialize data:', error);
        // Fallback to default data if IndexedDB fails
        setTodos([]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  // Save todos to IndexedDB whenever todos change
  useEffect(() => {
    if (!isLoading && todos.length >= 0) {
      const saveTodos = async () => {
        try {
          await todoIndexedDB.saveTodos(todos);
        } catch (error) {
          console.error('Failed to save todos:', error);
        }
      };
      saveTodos();
    }
  }, [todos, isLoading]);

  // Check for overdue tasks
  useEffect(() => {
    const checkOverdue = () => {
      const now = new Date();
      const overdueTasks = todos.filter(todo => 
        todo.status === STATUS.ONGOING && 
        todo.dueDate && 
        new Date(todo.dueDate) < now
      );
      
      if (overdueTasks.length > 0) {
        const taskTitles = overdueTasks.map(task => task.title).join(', ');
        setOverdueAlert({
          open: true,
          message: `Overdue tasks: ${taskTitles}`
        });
      }
    };

    if (!isLoading) {
      checkOverdue();
      const interval = setInterval(checkOverdue, 60000); 
      return () => clearInterval(interval);
    }
  }, [todos, isLoading]);

  const addTodo = (title, description, priority = 'medium', dueDate = null) => {
    const newTodo = {
      id: Date.now(),
      title,
      description,
      status: STATUS.NEW,
      createdAt: new Date().toISOString(),
      priority,
    };
    
    // Add due date if provided
    if (dueDate) {
      newTodo.dueDate = new Date(dueDate).toISOString();
    }
    
    // Add new tasks at the top of the New column
    setTodos([newTodo, ...todos]);
  };

  const moveTodo = (id, newStatus, dueDate = null) => {
    setTodos(todos.map(todo => {
      if (todo.id === id) {
        const updatedTodo = { 
          ...todo, 
          status: newStatus, 
          updatedAt: new Date().toISOString(),
          completedAt: null
        };
        
        // Add completion date for Done status
        if (newStatus === STATUS.DONE) {
          updatedTodo.completedAt = new Date().toISOString();
          updatedTodo.dueDate = null; 
        }
        
        // Add due date for Ongoing status
        if (newStatus === STATUS.ONGOING && dueDate) {
          updatedTodo.completedAt = null;
          updatedTodo.dueDate = dueDate;
        }
        
        return updatedTodo;
      }
      return todo;
    }));
  };

  

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
      <Box sx={{ flexGrow: 1, height: '100%' }}>
        {isLoading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%',
              minHeight: '400px'
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Loading your tasks...
            </Typography>
          </Box>
        ) : (
          <Grid 
            container 
            spacing={3} 
            sx={{ 
              height: 'calc(100vh - 200px)',
              alignItems: 'stretch',
              flexWrap: 'nowrap',
              '@media (max-width: 900px)': {
                flexWrap: 'wrap', 
                height: 'auto',
              }
            }}
          >
            {Object.values(STATUS).map((status, index) => (
              <Grow
                key={status}
                in={true}
                timeout={500 + index * 200}
              >
                <Grid
                  sx={{ 
                    display: 'flex',
                    minHeight: 0,
                    minWidth: 0,
                    maxWidth: { lg: '33.333333%' },
                    flex: { lg: '1 1 33.333333%' }, 
                  }}
                >
                  <TodoColumn
                    status={status}
                    todos={todos.filter(todo => todo.status === status)}
                    statusColors={STATUS_COLORS[status]}
                    moveTodo={moveTodo}
                    deleteTodo={deleteTodo}
                    addTodo={addTodo}
                    isNewColumn={status === STATUS.NEW}
                    totalTodos={todos.length}
                  />
                </Grid>
              </Grow>
            ))}
          </Grid>
        )}
        
        <Snackbar
          open={overdueAlert.open}
          autoHideDuration={6000}
          onClose={() => setOverdueAlert({ ...overdueAlert, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setOverdueAlert({ ...overdueAlert, open: false })} 
            severity="warning"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {overdueAlert.message}
          </Alert>
        </Snackbar>
      </Box>
  );
}

export default KanbanBoard;
