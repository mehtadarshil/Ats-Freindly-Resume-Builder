"use client";

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
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Resume Preview</h2>
        <p className="text-muted-foreground mb-6">
          Review your resume and make any final adjustments before exporting.
        </p>
      </div>

      <div className="flex justify-end gap-4 mb-4">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Export as DOCX
        </Button>
        <Button size="sm" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Card className="p-8 max-w-4xl mx-auto bg-white text-black shadow-lg">
        <div className="space-y-6">
          {/* Header / Personal Info */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">
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
              <h2 className="text-lg font-bold border-b pb-1 mb-2">
                Professional Summary
              </h2>
              <p>{resumeData.personalInfo.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {resumeData.workExperience.length > 0 && (
            <div>
              <h2 className="text-lg font-bold border-b pb-1 mb-3">
                Work Experience
              </h2>
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
              <h2 className="text-lg font-bold border-b pb-1 mb-3">
                Education
              </h2>
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
              <h2 className="text-lg font-bold border-b pb-1 mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-sm bg-gray-100 px-2 py-1 rounded"
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
              <h2 className="text-lg font-bold border-b pb-1 mb-3">
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
