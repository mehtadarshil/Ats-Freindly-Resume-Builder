"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, ArrowLeft, Download, LogOut, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResumePreview } from "@/components/resume/resume-preview";

export default function AdminResumeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [resume, setResume] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if admin is authenticated
    const isAdmin = localStorage.getItem("adminAuthenticated");
    if (!isAdmin) {
      router.push("/login");
      return;
    }

    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load resume data
      const { data: resumeData, error: resumeError } = await supabase
        .from("resumes")
        .select("*")
        .eq("id", params.id)
        .single();

      if (resumeError) throw resumeError;
      setResume(resumeData);

      // Load user data
      if (resumeData) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", resumeData.user_id)
          .single();

        if (userError) throw userError;
        setUser(userData);
      }
    } catch (error: any) {
      console.error("Error loading resume data:", error);
      setError(error.message || "Failed to load resume data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    router.push("/login");
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

  const exportResumeToJSON = () => {
    if (!resume) return;

    const resumeData = {
      id: resume.id,
      title: resume.title,
      user: user
        ? {
            id: user.id,
            name: user.full_name,
            email: user.email,
          }
        : null,
      personal_info: resume.personal_info,
      work_experience: resume.work_experience,
      education: resume.education,
      skills: resume.skills,
      achievements: resume.achievements,
      selected_template: resume.selected_template,
      ats_score: resume.ats_score,
      created_at: resume.created_at,
      updated_at: resume.updated_at,
    };

    const blob = new Blob([JSON.stringify(resumeData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `resume_${resume.id}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <Link href="/admin/dashboard" className="text-2xl font-bold">
              ResumeAI <span className="text-primary">Admin</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-3xl font-bold">Resume Details</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={exportResumeToJSON}
            disabled={!resume}
          >
            <Download className="h-4 w-4" />
            Export JSON
          </Button>
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

              {user && (
                <Card>
                  <CardHeader>
                    <CardTitle>User Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-10 w-10 text-muted-foreground bg-muted p-2 rounded-full" />
                      <div>
                        <p className="font-semibold">{user.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        User ID
                      </h3>
                      <p className="text-xs font-mono bg-muted p-1 rounded">
                        {user.id}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Joined
                      </h3>
                      <p>{formatDate(user.created_at)}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Resume Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {formatResumeForPreview() && (
                    <ResumePreview resumeData={formatResumeForPreview()} />
                  )}
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
