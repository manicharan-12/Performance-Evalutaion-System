import React, { useRef, useCallback } from "react";
import ReactToPrint from "react-to-print";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

import AcademicWorkI from "../AcademicWork-I/Part A";
import AcademicWorkII from "../AcademicWork-I/Part B";
import ContributionToDepartment from "../ContributionToDepartment";
import ContributionToSociety from "../ContributionToSociety";
import ContributionToUniversity from "../ContributionToUniversitySchool";
import Conformation from "../ResearchAndDevelopment/Conformation";
import RDPartA from "../ResearchAndDevelopment/PartA";
import RDPartB from "../ResearchAndDevelopment/PartB";
import RDPartC from "../ResearchAndDevelopment/PartC";
import RDPartD from "../ResearchAndDevelopment/PartD";

const Review = () => {
  const reviewRef = useRef();
  const navigate = useNavigate();

  const handleDownloadPDF = useCallback(async () => {
    const input = reviewRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("review.pdf");
  }, []);

  const onClickSubmitForm = useCallback(async () => {
    await toast.success("Your Form has been successfully submitted", {
      position: "bottom-center",
      autoClose: 6969,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
    navigate("/home");
  }, [navigate]);

  const buttonStyle = {
    padding: "12px",
    borderRadius: "8px",
    backgroundImage: "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  };

  return (
    <>
      <div ref={reviewRef}>
        <h2
          style={{ marginTop: "2rem", marginBottom: "0", paddingLeft: "20px" }}
        >
          Review Your data before submitting
        </h2>
        <AcademicWorkI />
        <AcademicWorkII />
        <Conformation />
        <RDPartA />
        <RDPartB />
        <RDPartC />
        <RDPartD />
        <ContributionToUniversity />
        <ContributionToDepartment />
        <ContributionToSociety />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginTop: "2rem",
        }}
      >
        <ReactToPrint
          trigger={() => <button style={buttonStyle}>Print this review</button>}
          content={() => reviewRef.current}
        />
        <button style={buttonStyle} onClick={handleDownloadPDF}>
          Download as PDF
        </button>
        <button style={buttonStyle} onClick={onClickSubmitForm}>
          Submit
        </button>
      </div>
    </>
  );
};

export default Review;
