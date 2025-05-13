import { lazy } from "react";
import ProtectedRoute from "@components/Auth/ProtectedRoute";
import MainLayout from "@layouts/MainLayout";
const Devices = lazy(() => import("@pages/Devices"));
const Home = lazy(() => import("@pages/Home"));
import Login from "@pages/Login";
const Products = lazy(() => import("@pages/Products"));
const History = lazy(() => import("@pages/History"));
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoadingSuspance from "@components/feedback/LoadingSuspance";
import IsAdmin from "@components/Auth/IsAdmin";
import UseResetScroll from "@hooks/useResetScroll";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <UseResetScroll />
        <MainLayout />
      </>
    ),
    errorElement: <div>Error</div>,
    children: [
      {
        index: true,
        element: <Login />,
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
        path: "info",
        element: (
          <ProtectedRoute>
            <LoadingSuspance>
              <Home />
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
        path: "history",
        element: (
          <ProtectedRoute>
            <IsAdmin>
              <LoadingSuspance>
                <History />
              </LoadingSuspance>
            </IsAdmin>
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
