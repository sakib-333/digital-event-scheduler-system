import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const HomeLayout = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleTheme = (): void => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const darkTheme = createTheme({
    palette: {
      mode: theme,
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="max-w-screen-2xl mx-auto">
        <Navbar theme={theme} handleTheme={handleTheme} />
        <Outlet />
      </div>
    </ThemeProvider>
  );
};

export default HomeLayout;
