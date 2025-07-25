import { Box, Card, Grid, CardContent, Chip, Grow, Paper, Typography, Badge, Tooltip,  useTheme, alpha, Button, IconButton, CardActions } from "@mui/material";
import { 
  PlayArrow as StartIcon, 
  Check as CompleteIcon,
  Delete as DeleteIcon,
  Undo as UndoIcon,
  FiberNew as NewIcon,
} from '@mui/icons-material';
import { useEffect, useState } from "react";
const STATUS = {
  NEW: 'New',
  ONGOING: 'Ongoing',
  DONE: 'Done',
};
function KanbanBoard() {
  const [todos, setTodos] = useState([]);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  // Get priority colors and display
  const getPriorityDisplay = (priority) => {
    switch (priority) {
      case 'high':
        return { color: '#f44336', icon: '🔴', label: 'High' };
      case 'medium':
        return { color: '#ff9800', icon: '🟡', label: 'Medium' };
      case 'low':
        return { color: '#4caf50', icon: '🟢', label: 'Low' };
      default:
        return { color: '#ff9800', icon: '🟡', label: 'Medium' };
    }
  };

  const priorityDisplay = getPriorityDisplay('medium');
  const getActionButtons = (todo) => {
    const buttons = [];
    
    if (todo.status === 'New') {
      buttons.push(
        <Button
          key="start"
          variant="contained"
          size="small"
          startIcon={<StartIcon />}
          sx={{ 
            background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
              boxShadow: '0 6px 16px rgba(255, 152, 0, 0.4)',
            }
          }}
        >
          Start
        </Button>
      );
    }
    
    if (todo.status === 'Ongoing') {
      buttons.push(
        <Button
          key="complete"
          variant="contained"
          size="small"
          startIcon={<CompleteIcon />}
          sx={{ 
            background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #388e3c 0%, #4caf50 100%)',
              boxShadow: '0 6px 16px rgba(76, 175, 80, 0.4)',
            }
          }}
        >
          Complete
        </Button>
      );
    }
    
    if (todo.status === 'Done') {
      buttons.push(
        <Tooltip title="Reopen task" key="reopen">
          <Button
            variant="outlined"
            size="small"
            startIcon={<UndoIcon />}
            sx={{
              borderColor: '#2196f3',
              color: '#2196f3',
              '&:hover': {
                borderColor: '#2196f3',
                backgroundColor: alpha('#2196f3', 0.1),
              }
            }}
          >
            Reopen
          </Button>
        </Tooltip>
      );
    }
    
    return buttons;
  };
  useEffect(() => {
    const initializeData = async () => { 
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
    }
    initializeData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, height: '100%', width: '100%' }}>
      <Grid 
        container 
        spacing={3} 
        sx={{ height: 'calc(100vh - 200px)', alignItems: 'stretch', 
          flexWrap: 'nowrap', '@media (max-width: 900px)': { flexWrap: 'wrap', height: 'auto'}
        }}
      >
        <Grow in timeout={1000}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 2 }}>
              <Paper sx={{ p: 2, height: '100%', width: '100%', maxWidth: '100%', display: 'flex',
                flexDirection: 'column', 
                justifyContent: 'space-between',
                backgroundColor: '#5493c7ff',
                border: `2px solid #2196f3`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                transform: 'scale(1)',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: `0 12px 24px #2196f3`,
                  backgroundColor: '#1976d2',
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{ 
                        color: '#2196f3',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <NewIcon />
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="h2" 
                      sx={{ 
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
                        
                      }}
                    >
                      New
                    </Typography>
                  </Box>
                  <Badge 
                    badgeContent= '2'
                    color="primary"
                    sx={{
                      '& .MuiBadge-badge': {
                        backgroundColor: '#2196f3',
                        color: 'white',
                        fontWeight: 600,
                      }
                    }}
                  >
                    <Box sx={{ width: 24, height: 24 }} />
                  </Badge>
                </Box>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 2,
                    flex: 1, 
                    overflowY: 'auto', 
                    overflowX: 'hidden',
                    minHeight: 0, 
                    paddingRight: 1, 
                    marginRight: -1, 
                    
                  }}
                >
                  
                  {todos.map((todo, index) => (
                    <Box
                      key={todo.id}
                      sx={{
                        animation: `slideIn 0.3s ease ${index * 0.1}s both`,
                        flexShrink: 0,
                        '@keyframes slideIn': {
                          from: {
                            opacity: 0,
                            transform: 'translateY(20px)',
                          },
                          to: {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      }}
                    >
                      <Card 
                        elevation={0}
                        sx={{ 
                          background: isDark 
                            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
                            : 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                          border: `2px solid ${alpha('#2196f3', 0.2)}`,
                          borderRadius: 3,
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          minHeight: { xs: '180px', sm: '200px', md: '220px' }, // Responsive minimum height
                          width: '100%', 
                          maxWidth: '100%',
                          minWidth: 0, 
                          display: 'flex',
                          flexDirection: 'column',
                          wordBreak: 'break-word', 
                          overflowWrap: 'break-word', 
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 4,
                            height: '100%',
                            background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
                          },
                          '&:hover': { 
                            boxShadow: `0 8px 24px ${alpha('#2196f3', 0.2)}`,
                            borderColor: alpha('#2196f3', 0.4),
                        }
                      }}
                    >
                      <CardContent sx={{ 
                        pb: 1, 
                        pl: 3, 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        overflow: 'hidden',
                        minWidth: 0, // Allow shrinking
                        width: '100%' // Take full width
                      }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexShrink: 0 }}>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                                <Chip 
                                  label={todo.status} 
                                  size="small"
                                  sx={{ 
                                    background: 'linear-gradient(135deg, #2196f3 0%, #21cbf3 100%)',
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    height: 24,
                                    boxShadow: `0 2px 8px ${alpha('#2196f3', 0.3)}`,
                                    flexShrink: 0, // Prevent chip from shrinking
                                  }}
                                />
                                <Chip 
                                  label={`${priorityDisplay.icon} ${priorityDisplay.label}`}
                                  size="small"
                                  sx={{ 
                                    backgroundColor: alpha(priorityDisplay.color, 0.1),
                                    color: priorityDisplay.color,
                                    border: `1px solid ${alpha(priorityDisplay.color, 0.3)}`,
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    height: 24,
                                    flexShrink: 0,
                                  }}
                                />
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                                <Tooltip title="Delete task">
                                  <IconButton 
                                    size="small" 
                                    sx={{ 
                                      color: 'error.main',
                                      '&:hover': {
                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                      }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                        
                        <Typography 
                          variant="h6" 
                          component="h3" 
                          sx={{ 
                            fontWeight: 600,
                            lineHeight: 1.3,
                            color: 'text.primary',
                            mb: 1,
                            flexShrink: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2, // Limit title to 2 lines
                            WebkitBoxOrient: 'vertical',
                            wordBreak: 'break-word', // Break long words
                            overflowWrap: 'break-word', // Handle long text
                            width: '100%', // Take full width
                            minWidth: 0, // Allow shrinking
                          }}
                        >
                          {todo.title}
                        </Typography>
                        
                        <Box sx={{ flex: 1, overflow: 'hidden', minHeight: 0, width: '100%', minWidth: 0 }}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              lineHeight: 1.5,
                              
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              wordBreak: 'break-word', 
                              overflowWrap: 'break-word',
                              width: '100%', 
                              minWidth: 0, 
                            }}
                          >
                            {todo.description}
                          </Typography>
                        </Box>
                      </CardContent>
                      
                      <CardActions sx={{ pt: 0, pb: 2, px: 3, justifyContent: 'flex-start', flexShrink: 0, mt: 'auto' }}>
                        {getActionButtons(todo)}
                      </CardActions>
                    </Card>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grow>
        <Grow in timeout={1500}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 2 }}>
              <Typography variant="h6">Column 2</Typography>
            </Box>
          </Grid>
        </Grow>
        <Grow in timeout={2000}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 2 }}>
              <Typography variant="h6">Column 3</Typography>
            </Box>
          </Grid>
        </Grow>
      </Grid>
    </Box>
  );
}
export default KanbanBoard;