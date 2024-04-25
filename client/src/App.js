import { Route, Routes, Navigate } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { GlobalStyle } from "./GolablStyle/StyledComponents";
import { useEffect, useState } from "react";
import LoginRegister from "./component/LoginRegister";
import ProtectedRoute from "./component/ProtectedRoute";
import ProfilePage from "./component/Profile";
import ResetPassword from "./component/ResetPassword";
import SmallDevice from "./component/SmallDevice";
import AcademicWorkI from "./component/AcademicWork-I/Part A";
import AcademicWorkII from "./component/AcademicWork-I/Part B";

function App() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <GlobalStyle />
      {width < 992 ? (
        <SmallDevice />
      ) : (
        <Routes>
          <Route path="/" element={<LoginRegister />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/academicWork/part-a" element={<AcademicWorkI />} />
          </Route>
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="/academicWork/part-b" element={<AcademicWorkII />} />
          </Route>
          <Route path="*" element={<Navigate replace to="/" />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
        </Routes>
      )}
    </>
  );
}

export default App;
