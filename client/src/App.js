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
import ContributionToUniversity from "./component/ContributionToUniversitySchool";
import ContributionToDepartment from "./component/ContributionToDepartment";
import ContributionToSociety from "./component/ContributionToSociety";
import Home from "./component/Home";
import { ToastContainer, toast } from "react-toastify";
import AssessmentOfFunctionalHead from "./component/AssessmentOfFunctionalHead";
import ApiScoreSummary from "./component/ApiScoreSummary";
import Review from "./component/Review";
import HodDashboard from "./component/HodPage";
import UserDetail from "./component/FacDets";
import Header from "./component/Header";

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
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/academicWork/part-a" element={<AcademicWorkI />} />
            <Route path="/academicWork/part-b" element={<AcademicWorkII />} />
            <Route
              path="/research-and-development/conformation"
              element={<Conformation />}
            />
            <Route
              path="/research-and-development/partA"
              element={<RDPartA />}
            />
            <Route
              path="/research-and-development/partB"
              element={<RDPartB />}
            />
            <Route
              path="/research-and-development/partC"
              element={<RDPartC />}
            />
            <Route
              path="/research-and-development/partD"
              element={<RDPartD />}
            />
            <Route
              path="/contribution-to-university-school"
              element={<ContributionToUniversity />}
            />
            <Route
              path="/contribution-to-department"
              element={<ContributionToDepartment />}
            />
            <Route
              path="/contribution-to-society"
              element={<ContributionToSociety />}
            />
            <Route path="/summary" element={<Review />} />
            <Route
              path="/assessment-of-the-functional-head/hod"
              element={<AssessmentOfFunctionalHead />}
            />
            {/* <Route path="/hod" element={<HODProtectedRoute />}>
              <Route path="/hod/dashboard" element={<HodDashboard />} />
            </Route> */}
            <Route path="/hod-dashboard" element={<HodDashboard />} />
            <Route path="/api-score-summary" element={<ApiScoreSummary />} />
            <Route path="/user-detail/:userId" element={<UserDetail />} />
            <Route path="*" element={<Navigate replace to="/Home" />} />
          </Route>
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
        </Routes>
      )}
      <ToastContainer
        position="bottom-center"
        autoClose={7000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="colored"
      />
    </>
  );
}

export default App;
