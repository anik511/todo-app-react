import { useState } from 'react';
import {
  Card, CardContent, Typography, Chip, Box, Button, IconButton, CardActions,
  Collapse, useTheme, alpha, Tooltip
} from '@mui/material';
import {
  PlayArrow as StartIcon, Check as CompleteIcon, Delete as DeleteIcon,
  Undo as UndoIcon, ExpandMore as ExpandIcon, Schedule as TimeIcon,
  Person as PersonIcon, Warning as WarningIcon, Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useDrag } from 'react-dnd';

function TodoItem({ todo, statusColors, moveTodo, deleteTodo }) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Set up drag functionality
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TODO_ITEM',
    item: { id: todo.id, status: todo.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [todo.id, todo.status]);

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

  const priorityDisplay = getPriorityDisplay(todo.priority || 'medium');

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date();
  const getActionButtons = () => {
    const buttons = [];

    if (todo.status === 'New') {
      buttons.push(
        <Button
          key="start"
          variant="contained"
          size="small"
          startIcon={<StartIcon />}
          onClick={() => moveTodo(todo.id, 'Ongoing')}
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
          onClick={() => moveTodo(todo.id, 'Done')}
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
      buttons.push(
        <Tooltip title="Move back to New" key="back">
          <Button
            variant="outlined"
            size="small"
            startIcon={<UndoIcon />}
            onClick={() => moveTodo(todo.id, 'New')}
            sx={{
              ml: 1,
              borderColor: statusColors.primary,
              color: statusColors.primary,
              '&:hover': {
                borderColor: statusColors.primary,
                backgroundColor: alpha(statusColors.primary, 0.1),
              }
            }}
          >
            Back
          </Button>
        </Tooltip>
      );
    }

    if (todo.status === 'Done') {
      buttons.push(
        <Tooltip title="Reopen task" key="reopen">
          <Button
            variant="outlined"
            size="small"
            startIcon={<UndoIcon />}
            onClick={() => moveTodo(todo.id, 'Ongoing')}
            sx={{
              borderColor: statusColors.primary,
              color: statusColors.primary,
              '&:hover': {
                borderColor: statusColors.primary,
                backgroundColor: alpha(statusColors.primary, 0.1),
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Card
        ref={drag}
        elevation={0}
        sx={{
          background: isDark
            ? `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`
            : 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
          border: `2px solid ${alpha(statusColors.primary, 0.2)}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: expanded ? 'auto' : { xs: '180px', sm: '200px', md: '220px' },
          minHeight: { xs: '180px', sm: '200px', md: '220px' },
          maxHeight: expanded ? '500px' : { xs: '180px', sm: '200px', md: '220px' },
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          opacity: isDragging ? 1 : 1,
          cursor: isDragging ? 'grabbing' : 'grab',
          '&::before': { content: '""', position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: statusColors.gradient },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 24px ${alpha(statusColors.primary, 0.2)}`,
            borderColor: alpha(statusColors.primary, 0.4),
          }
        }}
      >
        <CardContent sx={{ pb: 1, pl: 3, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Chip
                label={todo.status}
                size="small"
                sx={{ background: statusColors.gradient, color: 'white', fontWeight: 600, fontSize: '0.75rem', height: 24, boxShadow: `0 2px 8px ${alpha(statusColors.primary, 0.3)}` }}
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
                }}
              />
              {isOverdue && (
                <Chip
                  icon={<WarningIcon />}
                  label="Overdue"
                  size="small"
                  color="error"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    height: 24,
                  }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, }}>
              <Tooltip title="Show details">
                <IconButton
                  size="small"
                  onClick={() => setExpanded(!expanded)}
                  sx={{
                    color: statusColors.primary,
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  <ExpandIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete task">
                <IconButton
                  size="small"
                  onClick={() => deleteTodo(todo.id)}
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
              overflow: 'hidden',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              width: '100%',
              minWidth: 0,
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
                overflow: expanded ? 'visible' : 'hidden',
                overflowWrap: 'break-word',
                width: '100%',

              }}
            >
              {todo.description}
            </Typography>

            <Collapse in={expanded}>
              <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${alpha(statusColors.primary, 0.1)}` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(todo.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="caption" sx={{ color: priorityDisplay.color, fontWeight: 600 }}>
                    {priorityDisplay.icon} Priority: {priorityDisplay.label}
                  </Typography>
                </Box>
                {todo.dueDate && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <ScheduleIcon fontSize="small" sx={{ color: isOverdue ? 'error.main' : 'text.secondary' }} />
                    <Typography variant="caption" color={isOverdue ? 'error.main' : 'text.secondary'}>
                      Due: {formatDate(todo.dueDate)}
                    </Typography>
                  </Box>
                )}
                {todo.updatedAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Updated: {formatDate(todo.updatedAt)}
                    </Typography>
                  </Box>
                )}
                {todo.completedAt && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CompleteIcon fontSize="small" sx={{ color: 'success.main' }} />
                    <Typography variant="caption" color="success.main">
                      Completed: {formatDate(todo.completedAt)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Box>
        </CardContent>

        <CardActions sx={{ pt: 0, pb: 2, px: 3, justifyContent: 'flex-start', mt: 'auto' }}>
          {getActionButtons()}
        </CardActions>
      </Card>
    </>
  );
}

export default TodoItem;
