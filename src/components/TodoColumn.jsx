import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  Badge,
  useTheme,
  alpha
} from '@mui/material';
import { 
  FiberNew as NewIcon,
  PlayCircle as OngoingIcon,
  CheckCircle as DoneIcon
} from '@mui/icons-material';
import { useDrop } from 'react-dnd';
import TodoItem from './TodoItem';
import NewTodoForm from './NewTodoForm';

const getStatusIcon = (status) => {
  switch (status) {
    case 'New': return <NewIcon />;
    case 'Ongoing': return <OngoingIcon />;
    case 'Done': return <DoneIcon />;
    default: return null;
  }
};

function TodoColumn({ 
  status, 
  todos, 
  statusColors, 
  moveTodo, 
  deleteTodo, 
  addTodo, 
  isNewColumn, 
  allStatuses,
  onDrop
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Set up drop target
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TODO_ITEM',
    drop: (item) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [status, onDrop]);

  // Sort todos based on status and priority
  const sortedTodos = [...todos].sort((a, b) => {
    // First sort by priority (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority] || 2;
    const bPriority = priorityOrder[b.priority] || 2;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    // Then sort by status-specific criteria
    if (status === 'New') {
      // New tasks: newest first (added to top)
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (status === 'Ongoing') {
      // Ongoing tasks: moved to ongoing first
      return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
    } else if (status === 'Done') {
      // Done tasks: completed first
      return new Date(b.completedAt || b.updatedAt || b.createdAt) - new Date(a.completedAt || a.updatedAt || a.createdAt);
    }
    return 0;
  });

  return (
    <Paper 
      ref={drop}
      elevation={0}
      sx={{ 
        p: 3,
        height: '100%',
        width: '100%',
        minWidth: 0,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: isDark 
          ? `linear-gradient(135deg, ${alpha(statusColors.primary, 0.05)} 0%, ${alpha(statusColors.primary, 0.1)} 100%)`
          : `linear-gradient(135deg, ${statusColors.light} 0%, ${alpha(statusColors.primary, 0.05)} 100%)`,
        border: `2px solid ${alpha(statusColors.primary,0.2)}`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        transform: isOver ? 'scale(1.05)' : 'scale(1)',
        backgroundColor: 'transparent',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: statusColors.gradient,
          borderRadius: '12px 12px 0 0',
        },
        '&:hover': {
          transform: isOver ? 'scale(1.05)' : 'translateY(-2px)',
          boxShadow: `0 12px 24px ${alpha(statusColors.primary, 0.15)}`,
        }
      }}
    >
      <Box sx={{ mb: 3, pt: 1, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box 
              sx={{ 
                color: statusColors.primary,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {getStatusIcon(status)}
            </Box>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: 700,
                background: statusColors.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {status}
            </Typography>
          </Box>
          <Badge 
            badgeContent={todos.length} 
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: statusColors.primary,
                color: 'white',
                fontWeight: 600,
              }
            }}
          >
            <Box sx={{ width: 24, height: 24 }} />
          </Badge>
        </Box>
        
        <Divider 
          sx={{ 
            background: statusColors.gradient,
            height: 2,
            borderRadius: 1,
            opacity: 0.8
          }} 
        />
      </Box>
      
      {isNewColumn && (
        <Box sx={{ mb: 3, flexShrink: 0 }}>
          <NewTodoForm addTodo={addTodo} statusColors={statusColors} />
        </Box>
      )}
      
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
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(statusColors.primary, 0.1),
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(statusColors.primary, 0.3),
            borderRadius: 3,
            '&:hover': {
              background: alpha(statusColors.primary, 0.5),
            },
          },
        }}
      >
        {todos.length === 0 && !isNewColumn && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 6,
              opacity: 0.6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No {status.toLowerCase()} tasks yet. Move tasks here or add new ones.
            </Typography>
          </Box>
        )}
        {sortedTodos.map((todo, index) => (
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
            <TodoItem
              todo={todo}
              statusColors={statusColors}
              moveTodo={moveTodo}
              deleteTodo={deleteTodo}
              allStatuses={allStatuses}
              currentStatus={status}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default TodoColumn;
