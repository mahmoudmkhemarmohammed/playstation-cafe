import { lazy } from "react";
import ProtectedRoute from "@components/Auth/ProtectedRoute";
import MainLayout from "@layouts/MainLayout";
const Devices = lazy(() => import("@pages/Devices"));
import Home from "@pages/Home";
import Login from "@pages/Login";
const Products = lazy(() => import("@pages/Products"));
const Revenues = lazy(() => import("@pages/Revenues"));
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoadingSuspance from "@components/feedback/LoadingSuspance";

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
            <LoadingSuspance>
              <Devices />
            </LoadingSuspance>
          </ProtectedRoute>
        ),
      },
      {
        path: "products",
        element: (
          <ProtectedRoute>
            <LoadingSuspance>
              <Products />
            </LoadingSuspance>
          </ProtectedRoute>
        ),
      },
      {
        path: "revenues",
        element: (
          <ProtectedRoute>
            <LoadingSuspance>
              <Revenues />
            </LoadingSuspance>
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
