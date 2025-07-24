import { useState } from 'react';
import { 
  AppBar as MuiAppBar, 
  Toolbar, 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Chip,
  Typography
} from '@mui/material';
import { 
  Brightness6 as ThemeIcon,
  LightMode as LightIcon,
  DarkMode as DarkIcon,
  SettingsBrightness as SystemIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

function TopAppBar({ themeMode, onThemeChange, actualTheme }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleThemeMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (mode) => {
    onThemeChange(mode);
    handleThemeMenuClose();
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light': return <LightIcon />;
      case 'dark': return <DarkIcon />;
      default: return <SystemIcon />;
    }
  };

  return (
    <MuiAppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: actualTheme === 'dark' 
          ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 0,
      }}
    >
      <Toolbar>
        <DashboardIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Todo Board
        </Typography>
        <Chip 
          label={themeMode.charAt(0).toUpperCase() + themeMode.slice(1)} 
          size="small" 
          sx={{ mr: 2, color: 'white', backgroundColor: 'rgba(255,255,255,0.2)' }}
        />
        <IconButton
          size="large"
          edge="end"
          color="inherit"
          onClick={handleThemeMenuClick}
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.1)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
          }}
        >
          {getThemeIcon()}
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleThemeMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleThemeChange('light')}>
            <ListItemIcon><LightIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Light Mode</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleThemeChange('dark')}>
            <ListItemIcon><DarkIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Dark Mode</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleThemeChange('system')}>
            <ListItemIcon><SystemIcon fontSize="small" /></ListItemIcon>
            <ListItemText>System Mode</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </MuiAppBar>
  );
}

export default TopAppBar;
