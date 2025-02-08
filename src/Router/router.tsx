import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../Layouts/HomeLayout/HomeLayout";
import HomePage from "../Pages/HomePage/HomePage";
import EventsPage from "../Pages/EventsPage/EventsPage";
import AboutPage from "../Pages/AboutPage/AboutPage";
import ContactPage from "../Pages/ContactPage/ContactPage";
import LoginPage from "../Pages/LoginPage/LoginPage";
import RegisterPage from "../Pages/RegisterPage/RegisterPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/events",
        element: <EventsPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },
]);
