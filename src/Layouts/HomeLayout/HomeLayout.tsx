import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import { useEffect, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Footer from "../../Components/Footer/Footer";
import Aos from "aos";
import "aos/dist/aos.css";

const HomeLayout = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const handleTheme = (): void => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  useEffect(() => {
    Aos.init();
  }, []);

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
        <div className="min-h-screen">
          <Outlet />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default HomeLayout;
