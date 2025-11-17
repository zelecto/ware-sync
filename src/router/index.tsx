import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import Home from "@/page/Home";
import Login from "@/page/auth/Login";
import Dashboard from "@/page/Dasboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);
