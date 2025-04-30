import ProtectedRoute from "@components/Auth/ProtectedRoute";
import MainLayout from "@layouts/MainLayout";
import Devices from "@pages/Devices";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Products from "@pages/Products";
import Revenues from "@pages/Revenues";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div>Error</div>,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "devices",
        element: (
          <ProtectedRoute>
            <Devices />
          </ProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        ),
      },
      {
        path: "revenues",
        element: (
          <ProtectedRoute>
            <Revenues />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
