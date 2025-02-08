import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Link, NavLink } from "react-router-dom";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

interface NavbarProps {
  theme: "light" | "dark";
  handleTheme: () => void;
}

type Links = "home" | "events" | "about" | "contact" | "";

const pages: Links[] = ["home", "events", "about", "contact"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Navbar = ({ theme, handleTheme }: NavbarProps) => {
  const [actvLink, setActvLink] = React.useState<Links>("home");
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Event
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <NavLink key={page} to={`/${page === "home" ? "" : page}`}>
                  <MenuItem
                    onClick={() => {
                      handleCloseNavMenu();
                      setActvLink(`${page}`);
                    }}
                  >
                    <Typography
                      sx={{
                        textAlign: "center",
                        textTransform: "uppercase",
                        textDecoration: `${
                          page === actvLink ? "underline" : "none"
                        }`,
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {page}
                    </Typography>
                  </MenuItem>
                </NavLink>
              ))}
              <Button
                onClick={() => {
                  handleTheme();
                }}
              >
                {theme === "light" ? <BedtimeIcon /> : <WbSunnyIcon />}
              </Button>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Event
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
            }}
          >
            {pages.map((page) => (
              <NavLink key={page} to={`/${page === "home" ? "" : page}`}>
                <Button
                  onClick={() => {
                    handleCloseNavMenu();
                    setActvLink(`${page}`);
                  }}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    textDecoration: `${
                      page === actvLink ? "underline" : "none"
                    }`,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  {page}
                </Button>
              </NavLink>
            ))}
            <Button
              onClick={handleTheme}
              sx={{
                color: "#fff",
              }}
            >
              {theme === "light" ? <BedtimeIcon /> : <WbSunnyIcon />}
            </Button>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <NavLink to={"/login"}>
              <Button
                sx={{
                  color: "white",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                onClick={() => setActvLink("")}
              >
                Login
              </Button>
            </NavLink>
            {/* <Tooltip title="Open menu">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
