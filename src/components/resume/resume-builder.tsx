"use client";

import { useState, useEffect } from "react";
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
import { saveResume, updateResume, getResumeById, ResumeData } from "@/lib/resume";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { AuthButton } from "@/components/auth/auth-button";
import { AlertCircle, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";

export function ResumeBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");
  const templateParam = searchParams.get("template");

  const [activeTab, setActiveTab] = useState("personal-info");
  const [autoSaved, setAutoSaved] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      summary: "",
    },
    workExperience: [] as Array<{
      id: string;
      jobTitle: string;
      company: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    }>,
    education: [] as Array<{
      id: string;
      school: string;
      degree: string;
      fieldOfStudy: string;
      location: string;
      startDate: string;
      endDate: string;
      current: boolean;
      description: string;
    }>,
    skills: [] as string[],
    achievements: [] as Array<{
      id: string;
      title: string;
      description: string;
    }>,
    selectedTemplate: templateParam || "professional",
  });
  const [atsScore, setAtsScore] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Check authentication status
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    checkUser();
  }, []);

  // Load resume data if editing an existing resume
  useEffect(() => {
    if (resumeId) {
      const loadResume = async () => {
        try {
          const resumeData = await getResumeById(resumeId);
          setResumeData(resumeData);
          setResumeTitle(resumeData.title || "");
          if (resumeData.atsScore) {
            setAtsScore(resumeData.atsScore);
          }
        } catch (error) {
          console.error("Error loading resume:", error);
          setError("Could not load the resume. Please try again.");
        }
      };

      loadResume();
    }
  }, [resumeId]);

  const updateResumeData = (section: string, data: any) => {
    setResumeData((prev: ResumeData) => ({
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

  const handleSaveResume = async () => {
    setSaving(true);
    setError(null);

    try {
      const dataToSave = {
        ...resumeData,
        title: resumeTitle || `${resumeData.personalInfo.fullName}'s Resume`,
        atsScore,
      };

      if (resumeId) {
        await updateResume(resumeId, dataToSave);
        toast({
          title: "Resume updated",
          description: "Your resume has been successfully updated.",
        });
      } else {
        const newResume = await saveResume(dataToSave);
        router.push(`/builder?id=${newResume.id}`);
        toast({
          title: "Resume saved",
          description: "Your resume has been successfully saved.",
        });
      }
    } catch (error: any) {
      console.error("Error saving resume:", error);
      setError(error.message || "An error occurred while saving your resume.");
    } finally {
      setSaving(false);
    }
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
      const nextTab = tabs[currentIndex + 1];
      setActiveTab(nextTab);

      // Auto-save when moving to preview tab for the first time
      if (nextTab === "preview" && !resumeId && !autoSaved) {
        handleSaveResume();
        setAutoSaved(true);
      }
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
            <Link href="/dashboard">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                Dashboard
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleSaveResume}
              disabled={saving}
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Resume"}
            </Button>
            <ThemeSwitcher />
            <AuthButton user={!!user} />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Create Your Resume</h1>
          <div className="w-1/3">
            <Label htmlFor="resumeTitle" className="mb-2 block">
              Resume Title
            </Label>
            <Input
              id="resumeTitle"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              placeholder="My Professional Resume"
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
            <Button
              onClick={() => {
                // Find the export button in the preview tab and click it
                const exportButton =
                  document.querySelector("[data-export-pdf]");
                if (exportButton instanceof HTMLButtonElement) {
                  exportButton.click();
                }
              }}
            >
              Export Resume
            </Button>
          ) : (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>
      </main>
    </div>
  );
}
