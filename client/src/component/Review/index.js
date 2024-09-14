import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
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
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Review = () => {
  const reviewRef = useRef();

  const handleDownloadPDF = async () => {
    const input = reviewRef.current;
    const canvas = await html2canvas(input, { scale: 2 }); // Adjust scale for better quality
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('review.pdf');
  };

  return (
    <>
      <div ref={reviewRef}>
        <h2 style={{ marginTop: "2rem", marginBottom: "0", paddingLeft: "20px" }}>
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
    
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '2rem',  }}>
        <ReactToPrint
          trigger={() => <button style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: "12px",
            borderRadius: "8px",
            backgroundImage:
              "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
            color: "#fff",
            border: "none",}}>Print this review</button>}
          content={() => reviewRef.current}
        />

        <button
          style={{ padding: '10px 20px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer',padding: "12px",
            borderRadius: "8px",
            backgroundImage:
              "linear-gradient(127deg, #c02633 -40%, #233659 100%)",
            color: "#fff",
            border: "none", }}
          onClick={handleDownloadPDF}
        >
          Download as PDF
        </button>
      </div>
    </>
  );
};

export default Review;
