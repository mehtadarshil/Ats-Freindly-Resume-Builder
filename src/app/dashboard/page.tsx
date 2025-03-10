"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthButton } from "@/components/auth/auth-button";
import { useEffect, useState } from "react";
import { getUserResumes, deleteResume } from "@/lib/resume";
import { AlertCircle, FileEdit, FilePlus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<any[]>([]);
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

      loadResumes();
    };

    checkUser();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getUserResumes();
      setResumes(data);
    } catch (error: any) {
      console.error("Error loading resumes:", error);
      setError(error.message || "Failed to load your resumes");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      await deleteResume(id);
      setResumes(resumes.filter((resume) => resume.id !== id));
    } catch (error: any) {
      console.error("Error deleting resume:", error);
      setError(error.message || "Failed to delete the resume");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

      <main className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <Link href="/builder">
            <Button className="flex items-center gap-2">
              <FilePlus className="h-4 w-4" />
              Create New Resume
            </Button>
          </Link>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No Resumes Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first ATS-optimized resume to get started.
            </p>
            <Link href="/builder">
              <Button>Create Resume</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <Card key={resume.id} className="group relative">
                <Link
                  href={`/resumes/${resume.id}`}
                  className="absolute inset-0 z-10"
                ></Link>
                <CardHeader>
                  <CardTitle>{resume.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Template:
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {resume.selected_template}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        ATS Score:
                      </span>
                      <span className="text-sm font-medium">
                        {resume.ats_score}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last Updated:
                      </span>
                      <span className="text-sm font-medium">
                        {formatDate(resume.updated_at)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between relative z-20">
                  <Link href={`/builder?id=${resume.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <FileEdit className="h-4 w-4" />
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive/90 flex items-center gap-1"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteResume(resume.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
