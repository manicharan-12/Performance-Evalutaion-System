import { Route, Routes, Navigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import LoginRegister from "./component/LoginRegister";
import ProtectedRoute from "./component/ProtectedRoute";
import Home from "./component/Home";
import { useEffect, useState } from "react";
import ResetPassword from "./component/ResetPassword";

function App() {
  const [width, setWidth] = useState(window.innerWidth);
  console.log(width);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {width < 992 ? (
        ""
      ) : (
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          <Route path="*" element={<Navigate replace to="/" />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
        </Routes>
      )}
    </>
  );
}

export default App;
