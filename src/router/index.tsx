import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import Home from "@/page/Home";
import Login from "@/page/auth/Login";
import Dashboard from "@/page/Dasboard/Dashboard";
import Users from "@/page/Users/Index";
import Contacts from "@/page/Contacts/Index";
import NotFound from "@/page/NotFound";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { PublicRoute } from "@/components/auth/PublicRoute";

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
        element: <PublicRoute />,
        children: [
          {
            path: "login",
            element: <Login />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
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
      {
        path: "/users",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Users />,
          },
        ],
      },
      {
        path: "/contacts",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Contacts />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
