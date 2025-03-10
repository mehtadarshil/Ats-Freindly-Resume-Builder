"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { PersonalInfoForm } from "@/components/resume/personal-info-form";
import { WorkExperienceForm } from "@/components/resume/work-experience-form";
import { EducationForm } from "@/components/resume/education-form";
import { SkillsForm } from "@/components/resume/skills-form";
import { AchievementsForm } from "@/components/resume/achievements-form";
import { TemplateSelection } from "@/components/resume/template-selection";
import { ResumePreview } from "@/components/resume/resume-preview";
import { ATSScoreDisplay } from "@/components/resume/ats-score-display";

export function ResumeBuilder() {
  const [activeTab, setActiveTab] = useState("personal-info");
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      summary: "",
    },
    workExperience: [],
    education: [],
    skills: [],
    achievements: [],
    selectedTemplate: "professional",
  });
  const [atsScore, setAtsScore] = useState(0);

  const updateResumeData = (section: string, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }));

    // Calculate ATS score whenever data changes
    calculateATSScore();
  };

  const calculateATSScore = () => {
    // This is a simplified ATS score calculation
    // In a real app, this would be more sophisticated
    let score = 0;

    // Check if essential personal info is filled
    if (resumeData.personalInfo.fullName) score += 10;
    if (resumeData.personalInfo.email) score += 5;
    if (resumeData.personalInfo.phone) score += 5;
    if (resumeData.personalInfo.summary) score += 10;

    // Check work experience
    if (resumeData.workExperience.length > 0) {
      score += Math.min(resumeData.workExperience.length * 10, 30);
    }

    // Check education
    if (resumeData.education.length > 0) {
      score += Math.min(resumeData.education.length * 5, 15);
    }

    // Check skills
    if (resumeData.skills.length > 0) {
      score += Math.min(resumeData.skills.length, 20);
    }

    // Check achievements
    if (resumeData.achievements.length > 0) {
      score += Math.min(resumeData.achievements.length * 2.5, 10);
    }

    setAtsScore(score);
  };

  const handleNext = () => {
    const tabs = [
      "personal-info",
      "work-experience",
      "education",
      "skills",
      "achievements",
      "template",
      "preview",
    ];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const tabs = [
      "personal-info",
      "work-experience",
      "education",
      "skills",
      "achievements",
      "template",
      "preview",
    ];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold">
              ResumeAI
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ATSScoreDisplay score={atsScore} />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Create Your Resume</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 mb-8">
            <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
            <TabsTrigger value="work-experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="border rounded-lg p-6 mb-6">
            <TabsContent value="personal-info">
              <PersonalInfoForm
                data={resumeData.personalInfo}
                updateData={(data) => updateResumeData("personalInfo", data)}
              />
            </TabsContent>

            <TabsContent value="work-experience">
              <WorkExperienceForm
                data={resumeData.workExperience}
                updateData={(data) => updateResumeData("workExperience", data)}
              />
            </TabsContent>

            <TabsContent value="education">
              <EducationForm
                data={resumeData.education}
                updateData={(data) => updateResumeData("education", data)}
              />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsForm
                data={resumeData.skills}
                updateData={(data) => updateResumeData("skills", data)}
              />
            </TabsContent>

            <TabsContent value="achievements">
              <AchievementsForm
                data={resumeData.achievements}
                updateData={(data) => updateResumeData("achievements", data)}
              />
            </TabsContent>

            <TabsContent value="template">
              <TemplateSelection
                selectedTemplate={resumeData.selectedTemplate}
                updateTemplate={(template) =>
                  updateResumeData("selectedTemplate", template)
                }
              />
            </TabsContent>

            <TabsContent value="preview">
              <ResumePreview resumeData={resumeData} />
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={activeTab === "personal-info"}
          >
            Previous
          </Button>

          {activeTab === "preview" ? (
            <Button>Export Resume</Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </main>
    </div>
  );
}
