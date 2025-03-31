"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, FileText, Printer } from "lucide-react";

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
    summary: string;
  };
  workExperience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  skills: string[];
  achievements: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  selectedTemplate: string;
}

interface ResumePreviewProps {
  resumeData: ResumeData;
}

export function ResumePreview({ resumeData }: ResumePreviewProps) {
  const resumeRef = React.useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!resumeRef.current) return;

    try {
      // Create a clone of the resume element to modify for PDF export
      const resumeClone = resumeRef.current.cloneNode(true) as HTMLElement;

      // Apply specific styling for PDF export while preserving content formatting
      resumeClone.style.boxShadow = "none";
      resumeClone.style.border = "none";
      resumeClone.style.maxWidth = "100%";
      resumeClone.style.width = "210mm"; // A4 width
      resumeClone.style.minHeight = "297mm"; // A4 height
      resumeClone.style.margin = "0";
      resumeClone.style.padding = "20mm"; // Standard margin
      resumeClone.style.backgroundColor = "white";

      // Copy computed styles from the original element
      const computedStyle = window.getComputedStyle(resumeRef.current);
      resumeClone.style.fontFamily = computedStyle.fontFamily;
      resumeClone.style.fontSize = computedStyle.fontSize;
      resumeClone.style.lineHeight = computedStyle.lineHeight;
      resumeClone.style.color = computedStyle.color;

      // Create a temporary container for the clone
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "-9999px";
      tempContainer.style.width = "210mm";
      tempContainer.style.minHeight = "297mm";
      tempContainer.style.backgroundColor = "white";
      tempContainer.appendChild(resumeClone);
      document.body.appendChild(tempContainer);

      // Dynamically import html2pdf to avoid SSR issues
      const html2pdf = (await import("html2pdf.js")).default;
      const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`;

      const opt = {
        margin: 0, // We're handling margins in the container
        filename: fileName,
        image: { type: "jpeg", quality: 1 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          removeContainer: true,
          backgroundColor: "white",
          windowWidth: 794, // A4 width in pixels at 96 DPI
          windowHeight: 1123, // A4 height in pixels at 96 DPI
        },
        jsPDF: { 
          unit: "mm", 
          format: "a4", 
          orientation: "portrait",
          compress: true
        },
      };

      // Generate PDF from the clone
      await html2pdf().set(opt).from(resumeClone).save();

      // Clean up the temporary container
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating your PDF. Please try again.");
    }
  };

  const handlePrint = () => {
    if (!resumeRef.current) return;

    // Create a new window with just the resume content
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print your resume.");
      return;
    }

    // Get the styles from the current page
    const styles = Array.from(document.styleSheets)
      .map((styleSheet) => {
        try {
          return Array.from(styleSheet.cssRules)
            .map((rule) => rule.cssText)
            .join("");
        } catch (e) {
          return "";
        }
      })
      .join("");

    // Clone the resume element to modify for printing
    const resumeClone = resumeRef.current.cloneNode(true) as HTMLElement;
    resumeClone.style.boxShadow = "none";
    resumeClone.style.border = "none";

    // Keep original padding to preserve layout
    const originalPadding = window.getComputedStyle(resumeRef.current).padding;
    resumeClone.style.padding = originalPadding;

    // Write the HTML to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>${resumeData.personalInfo.fullName || "Resume"}</title>
          <style>
            ${styles}
            @page { margin: 15mm; }
            body { margin: 0; padding: 0; }
            .print-container { width: 100%; max-width: 210mm; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="print-container">${resumeClone.outerHTML}</div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    // Print after the content is loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleExportDOCX = () => {
    // In a real app, we would use a library like docx.js
    // For this demo, we'll simulate a download
    const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_") || "Resume"}_Resume.docx`;
    alert(
      `Downloading ${fileName}\n\nIn a production app, this would generate a real DOCX file using a library like docx.js.`,
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Template-specific styling
  const getTemplateStyles = () => {
    switch (resumeData.selectedTemplate) {
      case "modern":
        return {
          card: "p-8 max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 text-black shadow-lg",
          header:
            "border-l-4 border-blue-500 pl-4 mb-6 flex flex-col md:flex-row md:justify-between md:items-end",
          name: "text-3xl font-bold text-blue-700",
          sectionTitle:
            "text-lg font-bold text-blue-600 border-b border-blue-200 pb-1 mb-3 flex items-center",
          skillTag: "text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full",
        };
      case "minimal":
        return {
          card: "p-8 max-w-4xl mx-auto bg-white text-black shadow-sm border",
          header: "mb-6",
          name: "text-2xl font-medium",
          sectionTitle:
            "text-md uppercase tracking-wider font-medium text-gray-500 mb-3",
          skillTag: "text-sm border border-gray-200 px-2 py-0.5 rounded",
        };
      case "creative":
        return {
          card: "p-8 max-w-4xl mx-auto bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 text-black shadow-lg rounded-xl",
          header:
            "text-center mb-8 pb-4 border-b-2 border-dashed border-purple-300",
          name: "text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600",
          sectionTitle:
            "text-lg font-bold text-pink-600 mb-3 flex items-center before:content-[''] before:block before:w-6 before:h-[2px] before:bg-purple-400 before:mr-2 after:content-[''] after:block after:w-full after:h-[2px] after:bg-purple-400 after:ml-2",
          skillTag:
            "text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1 rounded-lg shadow-sm",
        };
      case "executive":
        return {
          card: "p-8 max-w-4xl mx-auto bg-slate-50 text-slate-900 shadow-lg border-t-8 border-slate-700",
          header:
            "border-b-2 border-slate-300 pb-4 mb-8 flex flex-col md:flex-row md:justify-between md:items-end",
          name: "text-3xl font-bold text-slate-800 uppercase tracking-wide",
          sectionTitle:
            "text-lg font-bold text-slate-800 uppercase tracking-wider border-b border-slate-300 pb-1 mb-4",
          skillTag:
            "text-sm bg-slate-200 text-slate-800 px-2 py-1 rounded-sm uppercase tracking-wide",
        };
      case "technical":
        return {
          card: "p-8 max-w-4xl mx-auto bg-gradient-to-r from-emerald-50 to-teal-50 text-black shadow-lg rounded-md font-mono",
          header: "mb-6 pb-4 border-b border-dashed border-emerald-300",
          name: "text-3xl font-bold text-emerald-700 font-mono",
          sectionTitle:
            "text-lg font-bold text-emerald-700 border-b border-emerald-200 pb-1 mb-3 flex items-center font-mono",
          skillTag:
            "text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md font-mono border border-emerald-200",
        };
      case "professional":
      default:
        return {
          card: "p-8 max-w-4xl mx-auto bg-white text-black shadow-lg",
          header: "text-center mb-6",
          name: "text-3xl font-bold",
          sectionTitle: "text-lg font-bold border-b pb-1 mb-3",
          skillTag: "text-sm bg-gray-100 px-2 py-1 rounded",
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Resume Preview</h2>
        <p className="text-muted-foreground mb-6">
          Review your resume and make any final adjustments before exporting.
        </p>
      </div>

      <div className="flex justify-end gap-4 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={handleExportDOCX}
        >
          <FileText className="h-4 w-4" />
          Export as DOCX
        </Button>
        <Button
          size="sm"
          className="flex items-center gap-2"
          onClick={handleExportPDF}
          data-export-pdf
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className={styles.card} ref={resumeRef} id="resume-preview">
        <div className="space-y-6">
          {/* Header / Personal Info */}
          <div className={styles.header}>
            <h1 className={styles.name}>
              {resumeData.personalInfo.fullName || "Your Name"}
            </h1>

            <div className="flex flex-wrap justify-center gap-x-4 mt-2 text-sm">
              {resumeData.personalInfo.email && (
                <span>{resumeData.personalInfo.email}</span>
              )}
              {resumeData.personalInfo.phone && (
                <span>{resumeData.personalInfo.phone}</span>
              )}
              {resumeData.personalInfo.location && (
                <span>{resumeData.personalInfo.location}</span>
              )}
              {resumeData.personalInfo.linkedin && (
                <span>{resumeData.personalInfo.linkedin}</span>
              )}
              {resumeData.personalInfo.website && (
                <span>{resumeData.personalInfo.website}</span>
              )}
            </div>
          </div>

          {/* Summary */}
          {resumeData.personalInfo.summary && (
            <div>
              <h2 className={styles.sectionTitle}>
                {resumeData.selectedTemplate === "technical"
                  ? "<Professional Summary />"
                  : resumeData.selectedTemplate === "creative"
                    ? "About Me"
                    : resumeData.selectedTemplate === "executive"
                      ? "EXECUTIVE SUMMARY"
                      : "Professional Summary"}
              </h2>
              <p
                className={
                  resumeData.selectedTemplate === "creative"
                    ? "italic text-purple-800"
                    : ""
                }
              >
                {resumeData.personalInfo.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {resumeData.workExperience.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>
                {resumeData.selectedTemplate === "technical"
                  ? "<Work Experience />"
                  : resumeData.selectedTemplate === "creative"
                    ? "Work History"
                    : resumeData.selectedTemplate === "executive"
                      ? "PROFESSIONAL EXPERIENCE"
                      : "Work Experience"}
              </h2>
              <div
                className={`space-y-4 ${resumeData.selectedTemplate === "creative" ? "pl-4 border-l-2 border-pink-200" : ""}`}
              >
                {resumeData.workExperience.map((job) => (
                  <div key={job.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{job.jobTitle}</h3>
                        <p className="text-sm">
                          {job.company}
                          {job.location ? `, ${job.location}` : ""}
                        </p>
                      </div>
                      <p className="text-sm">
                        {formatDate(job.startDate)} -{" "}
                        {job.current ? "Present" : formatDate(job.endDate)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resumeData.education.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>
                {resumeData.selectedTemplate === "technical"
                  ? "<Education />"
                  : resumeData.selectedTemplate === "creative"
                    ? "Academic Background"
                    : resumeData.selectedTemplate === "executive"
                      ? "EDUCATION"
                      : "Education"}
              </h2>
              <div
                className={`space-y-4 ${resumeData.selectedTemplate === "creative" ? "pl-4 border-l-2 border-purple-200" : ""}`}
              >
                {resumeData.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">
                          {edu.degree} in {edu.fieldOfStudy}
                        </h3>
                        <p className="text-sm">
                          {edu.school}
                          {edu.location ? `, ${edu.location}` : ""}
                        </p>
                      </div>
                      <p className="text-sm">
                        {formatDate(edu.startDate)} -{" "}
                        {edu.current ? "Present" : formatDate(edu.endDate)}
                      </p>
                    </div>
                    {edu.description && (
                      <p className="mt-1 text-sm">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resumeData.skills.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>
                {resumeData.selectedTemplate === "technical"
                  ? "<Skills />"
                  : resumeData.selectedTemplate === "creative"
                    ? "My Expertise"
                    : resumeData.selectedTemplate === "executive"
                      ? "CORE COMPETENCIES"
                      : "Skills"}
              </h2>
              <div
                className={`flex flex-wrap gap-2 ${resumeData.selectedTemplate === "executive" ? "justify-between" : ""}`}
              >
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`${styles.skillTag} flex items-center justify-center`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {resumeData.achievements.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>
                {resumeData.selectedTemplate === "technical"
                  ? "<Achievements />"
                  : resumeData.selectedTemplate === "creative"
                    ? "Accomplishments"
                    : resumeData.selectedTemplate === "executive"
                      ? "KEY ACHIEVEMENTS"
                      : "Achievements & Certifications"}
              </h2>
              <div
                className={`space-y-3 ${resumeData.selectedTemplate === "creative" ? "pl-4 border-l-2 border-pink-200" : ""}`}
              >
                {resumeData.achievements.map((achievement) => (
                  <div key={achievement.id}>
                    <h3 className="font-semibold">{achievement.title}</h3>
                    <p className="text-sm">{achievement.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">ATS Optimization Tips</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>
            Use standard section headings like "Experience" and "Education"
          </li>
          <li>Include keywords from the job description</li>
          <li>Avoid using tables, headers/footers, or complex formatting</li>
          <li>Use standard fonts like Arial, Calibri, or Times New Roman</li>
          <li>
            Save your resume as a PDF unless the job posting specifies otherwise
          </li>
        </ul>
      </div>
    </div>
  );
}
