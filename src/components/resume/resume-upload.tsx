"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload } from "lucide-react";

interface ResumeUploadProps {
  onExtractedData: (data: any) => void;
}

export function ResumeUpload({ onExtractedData }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
  };

  const extractResumeData = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document (.pdf, .doc, .docx)");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }

    setIsProcessing(true);
    setProgress(20);
    setError(null);

    try {
      // Read the file as text directly
      const extractedText = await readFileAsText(file);
      setProgress(60);

      // Process the extracted text to identify resume sections
      const extractedData = processResumeText(extractedText);
      setProgress(100);

      // Pass the extracted data to the parent component
      onExtractedData(extractedData);
    } catch (err: any) {
      console.error("Error processing resume:", err);
      setError(err.message || "Failed to process resume");
    } finally {
      setIsProcessing(false);
    }
  };

  // Read file as text
  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(text || "");
      };
      reader.onerror = (e) => reject(new Error("Error reading file"));
      reader.readAsText(file);
    });
  };

  // Process the extracted text to identify resume sections
  const processResumeText = (text: string): any => {
    // Extract personal information
    const personalInfo = extractPersonalInfo(text);

    // Extract work experience
    const workExperience = extractWorkExperience(text);

    // Extract education
    const education = extractEducation(text);

    // Extract skills
    const skills = extractSkills(text);

    // Extract achievements
    const achievements = extractAchievements(text);

    return {
      personalInfo,
      workExperience,
      education,
      skills,
      achievements,
    };
  };

  // Extract personal information from text
  const extractPersonalInfo = (text: string) => {
    // Find the name (usually at the beginning of the resume)
    const nameMatch = text.match(/^\s*([A-Z][A-Za-z\s-]+)\s*$/m);
    const fullName = nameMatch ? nameMatch[1].trim() : "";

    // Find email
    const emailMatch = text.match(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i,
    );
    const email = emailMatch ? emailMatch[1] : "";

    // Find phone number
    const phoneMatch = text.match(
      /\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\+?\d{1,3}[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/i,
    );
    const phone = phoneMatch ? phoneMatch[0] : "";

    // Find location
    const locationMatch = text.match(
      /([A-Za-z\s]+,\s*[A-Z]{2})|([A-Za-z\s]+,\s*[A-Za-z\s]+)/i,
    );
    const location = locationMatch ? locationMatch[0] : "";

    // Find LinkedIn
    const linkedinMatch = text.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
    const linkedin = linkedinMatch ? linkedinMatch[1] : "";

    // Find website (if any)
    const websiteMatch = text.match(
      /(https?:\/\/)?([\w\.-]+\.[a-z]{2,})([\/\w\.-]*)?/i,
    );
    const website =
      websiteMatch && !websiteMatch[0].includes("linkedin")
        ? websiteMatch[0]
        : "";

    // Find summary
    const summaryMatch = text.match(
      /(?:SUMMARY|PROFILE|OBJECTIVE|ABOUT)\s*[:\n]?\s*([\s\S]*?)(?=\n\s*(?:EXPERIENCE|WORK|EMPLOYMENT|EDUCATION|SKILLS|CERTIFICATIONS|$))/i,
    );
    const summary = summaryMatch ? summaryMatch[1].trim() : "";

    return {
      fullName,
      email,
      phone,
      location,
      linkedin,
      website,
      summary,
    };
  };

  // Extract work experience from text
  const extractWorkExperience = (text: string) => {
    const experienceSection = text.match(
      /(?:EXPERIENCE|WORK|EMPLOYMENT)\s*[:\n]?\s*([\s\S]*?)(?=\n\s*(?:EDUCATION|SKILLS|CERTIFICATIONS|PROJECTS|$))/i,
    );
    if (!experienceSection) return [];

    const experienceText = experienceSection[1];

    // Try to identify job entries by looking for dates or company names
    const jobEntries = experienceText.split(
      /\n(?=[A-Z][a-zA-Z\s]+\s*(?:\||,|-)\s*|\d{4}\s*-\s*(?:\d{4}|Present)|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/g,
    );

    return jobEntries
      .map((entry, index) => {
        // Extract job title
        const titleMatch =
          entry.match(/^\s*([A-Z][a-zA-Z\s]+)\s*(?:\||,|-)\s*/m) ||
          entry.match(/^\s*([A-Z][a-zA-Z\s]+)\s*$/m);
        const jobTitle = titleMatch ? titleMatch[1].trim() : "";

        // Extract company
        const companyMatch =
          entry.match(/(?:at|@|for)\s+([A-Za-z0-9\s&.,]+)\s*(?:\||,|-)\s*/i) ||
          entry.match(
            /([A-Za-z0-9\s&.,]+)\s*(?:\||,|-)\s*(?:[A-Za-z\s]+,\s*[A-Z]{2}|[A-Za-z\s]+)/i,
          );
        const company = companyMatch ? companyMatch[1].trim() : "";

        // Extract location
        const locationMatch = entry.match(
          /([A-Za-z\s]+,\s*[A-Z]{2})|([A-Za-z\s]+,\s*[A-Za-z\s]+)(?=\s*\n|\s*\d)/i,
        );
        const location = locationMatch ? locationMatch[0].trim() : "";

        // Extract dates
        const dateMatch =
          entry.match(/(\d{4})\s*-\s*(\d{4}|Present)/i) ||
          entry.match(
            /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\s*-\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4}|Present)/i,
          );

        let startDate = "";
        let endDate = "";
        let current = false;

        if (dateMatch) {
          startDate = dateMatch[1];
          if (dateMatch[2].toLowerCase() === "present") {
            current = true;
          } else {
            endDate = dateMatch[2];
          }
        }

        // Extract description (bullet points or paragraphs)
        const descLines = entry
          .split(/\n/)
          .filter(
            (line) =>
              line.trim().startsWith("•") || line.trim().startsWith("-"),
          );
        const description = descLines.join("\n");

        return {
          id: `job-${index + 1}`,
          jobTitle,
          company,
          location,
          startDate,
          endDate,
          current,
          description,
        };
      })
      .filter((job) => job.jobTitle || job.company); // Keep if at least title or company is found
  };

  // Extract education from text
  const extractEducation = (text: string) => {
    const educationSection = text.match(
      /EDUCATION\s*[:\n]?\s*([\s\S]*?)(?=\n\s*(?:EXPERIENCE|WORK|EMPLOYMENT|SKILLS|CERTIFICATIONS|PROJECTS|$))/i,
    );
    if (!educationSection) return [];

    const educationText = educationSection[1];

    // Split into individual education entries
    const educationEntries = educationText
      .split(/\n(?=[A-Z])/g)
      .filter((entry) => entry.trim().length > 0);

    return educationEntries
      .map((entry, index) => {
        // Extract degree and field of study
        const degreeMatch =
          entry.match(/([A-Za-z]+)\s+(?:of|in)\s+([A-Za-z\s,]+)/i) ||
          entry.match(/([A-Za-z\s,]+)\s+(?:Degree|Diploma|Certificate)/i);

        let degree = "";
        let fieldOfStudy = "";

        if (degreeMatch) {
          if (degreeMatch[2]) {
            degree = degreeMatch[1].trim();
            fieldOfStudy = degreeMatch[2].trim();
          } else {
            // If only one group captured, assume it's the degree
            degree = degreeMatch[1].trim();
          }
        }

        // Extract school
        const schoolMatch =
          entry.match(/^\s*([A-Za-z\s&,]+)\s*$/m) ||
          entry.match(/([A-Za-z\s&,]+)(?=\s*\d{4}|\s*-)/m);
        const school = schoolMatch ? schoolMatch[1].trim() : "";

        // Extract location
        const locationMatch = entry.match(
          /([A-Za-z\s]+,\s*[A-Z]{2})|([A-Za-z\s]+,\s*[A-Za-z\s]+)(?=\s*\n|\s*\d)/i,
        );
        const location = locationMatch ? locationMatch[0].trim() : "";

        // Extract dates
        const dateMatch =
          entry.match(/(\d{4})\s*-\s*(\d{4}|Present)/i) ||
          entry.match(
            /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})\s*-\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4}|Present)/i,
          ) ||
          entry.match(
            /(?:Graduated|Graduation):\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i,
          );

        let startDate = "";
        let endDate = "";
        let current = false;

        if (dateMatch) {
          if (dateMatch[1] && dateMatch[2]) {
            startDate = dateMatch[1];
            if (dateMatch[2].toLowerCase() === "present") {
              current = true;
            } else {
              endDate = dateMatch[2];
            }
          } else if (dateMatch[1]) {
            // Only graduation date found
            endDate = dateMatch[1];
            // Estimate start date (typically 4 years before for Bachelor's)
            const endYear = parseInt(dateMatch[1]);
            startDate = `${endYear - 4}`;
          }
        }

        // Extract description
        const descMatch = entry.match(
          /(?:Coursework|Courses|Activities|Achievements):\s*([\s\S]*?)(?=\n\n|$)/i,
        );
        const description = descMatch ? descMatch[1].trim() : "";

        return {
          id: `edu-${index + 1}`,
          school,
          degree,
          fieldOfStudy,
          location,
          startDate,
          endDate,
          current,
          description,
        };
      })
      .filter((edu) => edu.school || edu.degree); // Keep if at least school or degree is found
  };

  // Extract skills from text
  const extractSkills = (text: string) => {
    const skillsSection = text.match(
      /SKILLS\s*[:\n]?\s*([\s\S]*?)(?=\n\s*(?:EXPERIENCE|WORK|EMPLOYMENT|EDUCATION|CERTIFICATIONS|PROJECTS|$))/i,
    );
    if (!skillsSection) return [];

    const skillsText = skillsSection[1].trim();

    // Try different splitting strategies
    let skills = [];

    // First try: Split by commas
    if (skillsText.includes(",")) {
      skills = skillsText.split(/,\s*/).map((s) => s.trim());
    }
    // Second try: Split by bullets or dashes
    else if (skillsText.includes("•") || skillsText.includes("-")) {
      skills = skillsText.split(/[•\-]\s*/).map((s) => s.trim());
    }
    // Third try: Split by newlines and then by spaces for single-word skills
    else {
      const lines = skillsText
        .split(/\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      skills = lines.flatMap((line) => {
        // If line has multiple words with capital letters, they might be separate skills
        if (
          line.split(/\s+/).filter((word) => /^[A-Z]/.test(word)).length > 1
        ) {
          return line.split(/\s{2,}|\t|\|/).map((s) => s.trim());
        }
        return [line];
      });
    }

    // Filter out empty skills and common non-skill text
    return skills.filter(
      (skill) =>
        skill.length > 0 &&
        ![
          "skills",
          "technical",
          "soft",
          "proficient",
          "familiar",
          "experienced",
        ].includes(skill.toLowerCase()),
    );
  };

  // Extract achievements and certifications from text
  const extractAchievements = (text: string) => {
    const achievementsSection = text.match(
      /(?:CERTIFICATIONS|ACHIEVEMENTS|AWARDS|HONORS)\s*[:\n]?\s*([\s\S]*?)(?=\n\s*(?:EXPERIENCE|WORK|EMPLOYMENT|EDUCATION|SKILLS|PROJECTS|$))/i,
    );
    if (!achievementsSection) return [];

    const achievementsText = achievementsSection[1];

    // Split by bullet points, dashes, or new lines
    const achievementItems = achievementsText
      .split(/(?:\n\s*[•\-]\s*|\n\n|\n(?=[A-Z]))/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return achievementItems
      .map((item, index) => {
        // Try to split into title and description
        const parts = item.split(/\s*[-–:]\s*|\n/);

        const title = parts[0].trim();
        const description =
          parts.length > 1 ? parts.slice(1).join(" ").trim() : "";

        return {
          id: `achievement-${index + 1}`,
          title,
          description,
        };
      })
      .filter((achievement) => achievement.title); // Filter out any empty entries
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Upload Existing Resume</h2>
        <p className="text-muted-foreground mb-6">
          Upload your existing resume to automatically extract information and
          save time.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="resume-upload">Resume File</Label>
          <Input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            disabled={isProcessing}
          />
          <p className="text-xs text-muted-foreground">
            Accepted formats: PDF, DOC, DOCX (Max 5MB)
          </p>
        </div>

        {isProcessing && (
          <div className="w-full bg-secondary rounded-full h-2.5 mb-4">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        <Button
          onClick={extractResumeData}
          disabled={!file || isProcessing}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isProcessing ? "Processing..." : "Extract Resume Data"}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">How It Works</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Upload your existing resume in PDF or Word format</li>
          <li>Our text extraction algorithm will parse your resume content</li>
          <li>
            Pattern recognition identifies your personal information, work
            experience, education, and skills
          </li>
          <li>
            Review and edit the extracted information before finalizing your
            resume
          </li>
          <li>
            Note: Extraction accuracy depends on your resume format - some
            manual editing may be required
          </li>
        </ul>
      </div>
    </div>
  );
}
