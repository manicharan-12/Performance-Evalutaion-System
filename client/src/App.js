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
import Conformation from "./component/ResearchAndDevelopment/Conformation";
import RDPartA from "./component/ResearchAndDevelopment/PartA";
import RDPartB from "./component/ResearchAndDevelopment/PartB";
import RDPartC from "./component/ResearchAndDevelopment/PartC";
import RDPartD from "./component/ResearchAndDevelopment/PartD";
import ContributionToUniversity from "./component/ContributionToUniveristySchool";
import ContributionToDepartment from "./component/ContributionToDepartment";
import ContributionToSociety from "./component/ContributionToSociety";

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
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/research-and-development/conformation"
              element={<Conformation />}
            />
          </Route>
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/research-and-development/partA"
              element={<RDPartA />}
            />
          </Route>
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/research-and-development/partB"
              element={<RDPartB />}
            />
          </Route>
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/research-and-development/partC"
              element={<RDPartC />}
            />
          </Route>
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/research-and-development/partD"
              element={<RDPartD />}
            />
          </Route>
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/contribution-to-university-school"
              element={<ContributionToUniversity />}
            />
          </Route>
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/contribution-to-department"
              element={<ContributionToDepartment />}
            />
          </Route>
          <Route path="/" element={<ProtectedRoute />}>
            <Route
              path="/contribution-to-society"
              element={<ContributionToSociety />}
            />
          </Route>
          <Route path="*" element={<Navigate replace to="/" />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
        </Routes>
      )}
    </>
  );
}

export default App;
