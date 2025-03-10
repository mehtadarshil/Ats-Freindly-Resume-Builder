"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, ArrowLeft, Download, FileEdit } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumePreview } from "@/components/resume/resume-preview";
import { AuthButton } from "@/components/auth/auth-button";

export default function ResumeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (!data.user) {
        router.push("/login");
        return;
      }

      loadResumeData(data.user.id);
    };

    checkUser();
  }, []);

  const loadResumeData = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Load resume data
      const { data: resumeData, error: resumeError } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", userId)
        .single();

      if (resumeError) throw resumeError;
      setResume(resumeData);
    } catch (error: any) {
      console.error("Error loading resume data:", error);
      setError(error.message || "Failed to load resume data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format resume data for the preview component
  const formatResumeForPreview = () => {
    if (!resume) return null;

    return {
      personalInfo: resume.personal_info,
      workExperience: resume.work_experience,
      education: resume.education,
      skills: resume.skills,
      achievements: resume.achievements,
      selectedTemplate: resume.selected_template,
    };
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
            <ThemeSwitcher />
            <AuthButton user={!!user} />
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Resume Details</h1>
          </div>
          {resume && (
            <Link href={`/builder?id=${resume.id}`}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <FileEdit className="h-4 w-4" />
                Edit Resume
              </Button>
            </Link>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading resume data...</p>
          </div>
        ) : resume ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Title
                    </h3>
                    <p className="text-lg font-semibold">{resume.title}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Template
                    </h3>
                    <p className="capitalize">{resume.selected_template}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      ATS Score
                    </h3>
                    <p className="font-semibold">{resume.ats_score}/100</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Created
                    </h3>
                    <p>{formatDate(resume.created_at)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Last Updated
                    </h3>
                    <p>{formatDate(resume.updated_at)}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="w-full flex items-center gap-2"
                    onClick={() => {
                      // Find the export button in the preview tab and click it
                      const exportButton =
                        document.querySelector("[data-export-pdf]");
                      if (exportButton instanceof HTMLButtonElement) {
                        exportButton.click();
                      }
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                  <Link href={`/builder?id=${resume.id}`} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <FileEdit className="h-4 w-4" />
                      Edit Resume
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const formattedResume = formatResumeForPreview();
                    return formattedResume ? (
                      <ResumePreview resumeData={formattedResume} />
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground">Resume not found</p>
          </div>
        )}
      </main>
    </div>
  );
}
