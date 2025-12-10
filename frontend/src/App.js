// src/App.js
import { useEffect, useState } from "react";
import "./styles.css";

import Auth from "./components/Auth";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import { getCurrentUser } from "./api/authMock";

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  useEffect(() => {
    const handlePop = () => {
      setPath(window.location.pathname);
      setUser(getCurrentUser());
    };

    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const navigate = (to) => {

    window.history.pushState({}, "", to);
    setPath(to);
    setUser(getCurrentUser());
  };

  if (!user && path !== "/login") {
    return <Auth navigate={navigate} />;
  }

  if (path === "/login") {
    return <Auth navigate={navigate} />;
  }

  if (path === "/dashboard") {
    return <Dashboard navigate={navigate} />;
  }

  if (path === "/" || path === "/home") {
    return <Home user={user} navigate={navigate} />;
  }

  return <Home user={user} navigate={navigate} />;
}

export default App;