import { createBrowserRouter } from "react-router-dom";
import RootLayout from "@/layouts/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import Home from "@/page/Home";
import Login from "@/page/auth/Login";
import Dashboard from "@/page/Dasboard/Dashboard";
import Users from "@/page/Users/Index";
import CreateUser from "@/page/Users/Create";
import EditUser from "@/page/Users/Edit";
import Contacts from "@/page/Contacts/Index";
import CreateContact from "@/page/Contacts/Create";
import EditContact from "@/page/Contacts/Edit";
import Products from "@/page/Products/Index";
import CreateProduct from "@/page/Products/Create";
import EditProduct from "@/page/Products/Edit";
import ShowProduct from "@/page/Products/Show";
import Warehouses from "@/page/Warehouses/Index";
import CreateWarehouse from "@/page/Warehouses/Create";
import EditWarehouse from "@/page/Warehouses/Edit";
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
          {
            path: "create",
            element: <CreateUser />,
          },
          {
            path: "edit/:id",
            element: <EditUser />,
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
          {
            path: "create",
            element: <CreateContact />,
          },
          {
            path: "edit/:id",
            element: <EditContact />,
          },
        ],
      },
      {
        path: "/products",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Products />,
          },
          {
            path: "create",
            element: <CreateProduct />,
          },
          {
            path: ":id",
            element: <ShowProduct />,
          },
          {
            path: "edit/:id",
            element: <EditProduct />,
          },
        ],
      },
      {
        path: "/warehouses",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Warehouses />,
          },
          {
            path: "create",
            element: <CreateWarehouse />,
          },
          {
            path: "edit/:id",
            element: <EditWarehouse />,
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
