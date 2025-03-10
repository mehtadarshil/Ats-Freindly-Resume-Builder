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
      // Dynamically import html2pdf to avoid SSR issues
      const html2pdf = (await import("html2pdf.js")).default;
      const fileName = `${resumeData.personalInfo.fullName.replace(/\s+/g, "_") || "Resume"}_Resume.pdf`;

      const opt = {
        margin: 10,
        filename: fileName,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(resumeRef.current).save();
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

    // Write the HTML to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>${resumeData.personalInfo.fullName || "Resume"}</title>
          <style>${styles}</style>
        </head>
        <body>
          ${resumeRef.current.outerHTML}
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
          card: "p-8 max-w-4xl mx-auto bg-gradient-to-r from-gray-50 to-white text-black shadow-lg",
          header: "border-l-4 border-blue-500 pl-4 mb-6",
          name: "text-3xl font-bold text-blue-700",
          sectionTitle:
            "text-lg font-bold text-blue-600 border-b border-blue-200 pb-1 mb-3",
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
          card: "p-8 max-w-4xl mx-auto bg-white text-black shadow-lg border-t-8 border-purple-500",
          header: "text-center mb-6",
          name: "text-4xl font-bold text-purple-700",
          sectionTitle:
            "text-lg font-bold text-purple-600 border-b-2 border-purple-200 pb-1 mb-3",
          skillTag: "text-sm bg-purple-50 text-purple-700 px-3 py-1 rounded-lg",
        };
      case "executive":
        return {
          card: "p-8 max-w-4xl mx-auto bg-gray-50 text-black shadow-lg border",
          header: "border-b-2 border-gray-800 pb-4 mb-6",
          name: "text-3xl font-bold text-gray-800",
          sectionTitle:
            "text-lg font-bold text-gray-800 border-b border-gray-300 pb-1 mb-3",
          skillTag: "text-sm bg-gray-200 text-gray-800 px-2 py-1 rounded",
        };
      case "technical":
        return {
          card: "p-8 max-w-4xl mx-auto bg-white text-black shadow-lg border-l-8 border-green-500",
          header: "mb-6",
          name: "text-3xl font-bold text-green-700",
          sectionTitle:
            "text-lg font-bold text-green-700 border-b border-green-200 pb-1 mb-3",
          skillTag: "text-sm bg-green-50 text-green-700 px-2 py-1 rounded-md",
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

      <Card className={styles.card} ref={resumeRef}>
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
              <h2 className={styles.sectionTitle}>Professional Summary</h2>
              <p>{resumeData.personalInfo.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {resumeData.workExperience.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>Work Experience</h2>
              <div className="space-y-4">
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
              <h2 className={styles.sectionTitle}>Education</h2>
              <div className="space-y-4">
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
              <h2 className={styles.sectionTitle}>Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className={styles.skillTag}>
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
                Achievements & Certifications
              </h2>
              <div className="space-y-3">
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
