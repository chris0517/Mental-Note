import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

const pages = ['Home', 'Calander'];
const settings = ['Profile', 'Account', 'Logout'];

function NavBar() {
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);

  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  // Function to handle navigation
  const handleNavigate = (page) => {
    const path = `/${page.toLowerCase()}`; // Convert to lowercase for URLs
    if (page === 'Home') navigate('/');
    else{
      navigate(path);
      handleCloseNavMenu();
    }

  };

  return (
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundImage: 'linear-gradient(to bottom, #537692, #b3cde4)',
          margin: 0, 
          padding: 0,
          top: 0,
          left: 0,
          right: 0
        }}
      > 
      <Container maxWidth="xl" disableGutters> {/* Add disableGutters prop */}
        <Toolbar 
          disableGutters 
          sx={{ 
            minHeight: '50px !important',
            width: '100%', // Ensure full width
            display: 'flex',
            justifyContent: 'space-between' // Improve space distribution
          }}
        >
          {/* Left section - Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/color_icon.png" 
              alt="Mental Note Logo" 
              style={{ height: '55px', width: '55px', marginRight: '10px', marginLeft: '10px' }} 
            />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Mental Note
            </Typography>
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" color="inherit" onClick={handleOpenNavMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleNavigate(page)}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page} sx={{ my: 2, color: 'white', display: 'block' }} onClick={() => handleNavigate(page)}>
                {page}
              </Button>
            ))}
          </Box>

          {/* Profile Menu */}
          <Box sx={{ 
            flexGrow: 0,
            marginRight: '25px' // Forces the profile to the end
          }}>            
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar 
                  alt="Profile" 
                  src="/huihui.jpg" 
                  sx={{ width: 54, height: 54 }} // Adjust size here
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavBar;
