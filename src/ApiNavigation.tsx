import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, SwipeableDrawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Menu as MenuIcon, List as ListIcon, AccountBox as AccountBoxIcon, Logout as LogoutIcon } from '@mui/icons-material';

interface ApiNavigationProps {
  drawerOpen: boolean;
  onToggleDrawer: (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  onOpenModal: () => void;
  onLogout: () => void;
  onProfile: () => void;
}

const ApiNavigation: React.FC<ApiNavigationProps> = ({ 
  drawerOpen,
  onToggleDrawer,
  onOpenModal,
  onLogout,
  onProfile
}) => (
  <>
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>API Tool</Typography>
        <IconButton color="inherit" onClick={onToggleDrawer(true)}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>

    <SwipeableDrawer
      anchor="right"
      open={drawerOpen}
      onClose={onToggleDrawer(false)}
      onOpen={onToggleDrawer(true)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onOpenModal}>
            <ListItemIcon><ListIcon /></ListItemIcon>
            <ListItemText primary="Copy" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={onProfile}>
            <ListItemIcon><AccountBoxIcon /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={onLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </SwipeableDrawer>
  </>
);

export default ApiNavigation;
