import Home from "@/pages/Home";
import { createBrowserRouter, Navigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/BTCUSDT" replace />,
  },
  {
    path: "/:symbol",
    element: <Home />,
  },
  {
    path: "*", // 這是 404 fallback route
    element: <Navigate to="/" replace />,
  },
]);

export default router;
