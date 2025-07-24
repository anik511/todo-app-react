import { Box, Grid, Grow, Paper, Typography } from "@mui/material";

function KanbanBoard() {
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
                <Typography variant="h6">New</Typography>
                <Typography variant="body2" color="text.secondary">
                  lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Typography>
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