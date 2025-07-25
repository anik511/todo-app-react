import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Box, 
  Typography,
  useTheme,
  alpha,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Add as AddIcon,
  PostAdd as FormIcon
} from '@mui/icons-material';

function NewTodoForm({ addTodo, statusColors }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    addTodo(title, description, priority, dueDate || null);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setIsExpanded(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        background: isDark
          ? `linear-gradient(135deg, ${alpha(statusColors.primary, 0.1)} 0%, ${alpha(statusColors.primary, 0.05)} 100%)`
          : `linear-gradient(135deg, ${alpha(statusColors.primary, 0.05)} 0%, ${alpha(statusColors.primary, 0.02)} 100%)`,
        border: `2px dashed ${alpha(statusColors.primary, 0.3)}`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: alpha(statusColors.primary, 0.5),
          transform: isExpanded ? 'none' : 'translateY(-1px)',
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {!isExpanded ? (
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              py: 2,
              cursor: 'pointer',
              '&:hover': {
                '& .add-icon': {
                  transform: 'scale(1.1)',
                }
              }
            }}
            onClick={() => setIsExpanded(true)}
          >
            <FormIcon 
              className="add-icon"
              sx={{ 
                mr: 1, 
                color: statusColors.primary,
                transition: 'transform 0.2s ease'
              }} 
            />
            <Typography 
              variant="body1" 
              sx={{ 
                color: statusColors.primary,
                fontWeight: 600
              }}
            >
              Add New Todo
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: statusColors.primary,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '1rem'
                }}
              >
                <FormIcon fontSize="small" />
                Create New Task
              </Typography>
              <IconButton
                size="small"
                onClick={handleCancel}
                sx={{ 
                  color: 'text.secondary',
                  transform: 'rotate(45deg)',
                  '&:hover': {
                    color: 'error.main',
                    transform: 'rotate(45deg) scale(1.1)',
                  }
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            
            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Task Title"
                variant="outlined"
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                placeholder="Enter a descriptive title"
                autoFocus
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: statusColors.primary,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: statusColors.primary,
                  },
                }}
              />
              
              <TextField
                label="Description"
                variant="outlined"
                size="small"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                fullWidth
                multiline
                rows={2}
                placeholder="Provide detailed information about the task"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: statusColors.primary,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: statusColors.primary,
                  },
                }}
              />

              <FormControl fullWidth size="small">
                <InputLabel 
                  sx={{
                    '&.Mui-focused': {
                      color: statusColors.primary,
                    },
                  }}
                >
                  Priority
                </InputLabel>
                <Select
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value)}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: statusColors.primary,
                    },
                  }}
                >
                  <MenuItem value="low">🟢 Low</MenuItem>
                  <MenuItem value="medium">🟡 Medium</MenuItem>
                  <MenuItem value="high">🔴 High</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Due Date & Time (Optional)"
                variant="outlined"
                size="small"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                placeholder="Set when this task must be completed"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().slice(0, 16) // Prevent selecting past dates
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: statusColors.primary,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: statusColors.primary,
                  },
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={!title.trim() || !description.trim()}
                  sx={{ 
                    flex: 1,
                    background: statusColors.gradient,
                    color: 'white',
                    fontWeight: 600,
                    boxShadow: `0 4px 12px ${alpha(statusColors.primary, 0.3)}`,
                    '&:hover': {
                      background: statusColors.gradient,
                      boxShadow: `0 6px 16px ${alpha(statusColors.primary, 0.4)}`,
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      background: alpha(statusColors.primary, 0.3),
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                >
                  Add Task
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ 
                    minWidth: 'auto',
                    px: 2,
                    borderColor: alpha(statusColors.primary, 0.3),
                    color: statusColors.primary,
                    '&:hover': {
                      borderColor: statusColors.primary,
                      backgroundColor: alpha(statusColors.primary, 0.05),
                    }
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default NewTodoForm;