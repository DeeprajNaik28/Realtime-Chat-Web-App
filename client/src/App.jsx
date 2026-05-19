import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo")
  );

  return (
    <Routes>

      <Route
        path="/signup"
        element={
          userInfo
            ? <Navigate to="/" replace />
            : <Signup />
        }
      />

      <Route
        path="/login"
        element={
          userInfo
            ? <Navigate to="/" replace />
            : <Login />
        }
      />

      <Route
        path="/"
        element={
          userInfo
            ? <Dashboard />
            : <Navigate to="/login" replace />
        }
      />

    </Routes>
  );
}

export default App;