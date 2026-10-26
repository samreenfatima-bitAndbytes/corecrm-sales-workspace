import { Navigate, Route, Routes } from "react-router-dom";
import { ROLE_HOME } from "./data/demo";
import { useAuth } from "./hooks/useAuth";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Leads from "./pages/Leads";
import LeadKanban from "./pages/LeadKanban";
import Companies from "./pages/Companies";
import Deals from "./pages/Deals";
import Tasks from "./pages/Tasks";
import SalesManager from "./pages/SalesManager";
import Analytics from "./pages/Analytics";

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || "/app/home"} replace />;
  }
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={ROLE_HOME[user?.role] || "/app/home"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/app"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomeRedirect />} />
        <Route
          path="home"
          element={
            <PrivateRoute roles={["viewer"]}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <PrivateRoute roles={["admin"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="users"
          element={
            <PrivateRoute roles={["admin"]}>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="leads"
          element={
            <PrivateRoute roles={["admin", "sales", "salesmanager", "viewer"]}>
              <Leads />
            </PrivateRoute>
          }
        />
        <Route
          path="leads/kanban"
          element={
            <PrivateRoute roles={["admin", "sales", "salesmanager", "viewer"]}>
              <LeadKanban />
            </PrivateRoute>
          }
        />
        <Route
          path="companies"
          element={
            <PrivateRoute roles={["admin", "salesmanager"]}>
              <Companies />
            </PrivateRoute>
          }
        />
        <Route
          path="deals"
          element={
            <PrivateRoute roles={["admin", "salesmanager"]}>
              <Deals />
            </PrivateRoute>
          }
        />
        <Route
          path="tasks"
          element={
            <PrivateRoute roles={["admin", "sales"]}>
              <Tasks />
            </PrivateRoute>
          }
        />
        <Route
          path="salesmanager"
          element={
            <PrivateRoute roles={["admin", "salesmanager"]}>
              <SalesManager />
            </PrivateRoute>
          }
        />
        <Route
          path="analytics"
          element={
            <PrivateRoute roles={["admin", "salesmanager", "viewer"]}>
              <Analytics />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
