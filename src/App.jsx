import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  Container, 
  Typography, 
  Box
} from '@mui/material';
import TopAppBar from './components/TopAppBar';
import KanbanBoard from './components/KanbanBoard';

function App() {
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'system';
  });

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const getActualTheme = () => {
    if (themeMode === 'system') {
      return getSystemTheme();
    }
    return themeMode;
  };

  const theme = createTheme({
    palette: {
      mode: getActualTheme(),
      primary: {
        main: getActualTheme() === 'dark' ? '#90caf9' : '#1976d2',
      },
      secondary: {
        main: getActualTheme() === 'dark' ? '#f48fb1' : '#dc004e',
      },
      background: {
        default: getActualTheme() === 'dark' ? '#121212' : '#fafafa',
        paper: getActualTheme() === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h3: {
        fontWeight: 700,
        background: getActualTheme() === 'dark' 
          ? 'linear-gradient(45deg, #90caf9 30%, #f48fb1 90%)'
          : 'linear-gradient(45deg, #1976d2 30%, #dc004e 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: getActualTheme() === 'dark' 
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: getActualTheme() === 'dark' 
                ? '0 16px 48px rgba(0,0,0,0.4)'
                : '0 16px 48px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <TopAppBar 
          themeMode={themeMode}
          onThemeChange={handleThemeChange}
          actualTheme={getActualTheme()}
        />

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom
              sx={{ 
                mb: 2,
                textAlign: 'center'
              }}
            >
              Todo Board
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Organize your tasks efficiently. 
              Move tasks through different stages and boost your productivity.
            </Typography>
          </Box>
          <KanbanBoard />
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
