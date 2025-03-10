import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { AuthButton } from "@/components/auth/auth-button";

export default async function HomePage() {
  const cookieStore = cookies();
  const supabase = createClient(() => cookieStore);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;
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
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline">My Resumes</Button>
                </Link>
                <AuthButton user={!!user} />
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main>
        <section className="py-20">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              AI-Powered ATS-Friendly Resume Generator
            </h1>
            <p className="text-xl text-muted-foreground max-w-[800px] mb-8">
              Create professional resumes optimized for Applicant Tracking
              Systems to help you land your dream job.
            </p>
            <div className="flex gap-4">
              <Link href="/builder">
                <Button size="lg">Create Your Resume</Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg">
                  View Templates
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Enter Your Details
                </h3>
                <p className="text-muted-foreground">
                  Fill in your personal information, work experience, education,
                  and skills.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Optimize for ATS</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your resume against job descriptions to
                  improve your ATS score.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Export & Apply</h3>
                <p className="text-muted-foreground">
                  Download your professionally formatted resume in multiple
                  formats and start applying.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-semibold tracking-tight text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4 p-6 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    ATS Score Calculation
                  </h3>
                  <p className="text-muted-foreground">
                    Real-time feedback on how well your resume will perform with
                    ATS systems.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Keyword Optimization
                  </h3>
                  <p className="text-muted-foreground">
                    Suggestions to include relevant keywords based on job
                    descriptions.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Professional Templates
                  </h3>
                  <p className="text-muted-foreground">
                    Multiple professionally designed templates to choose from.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-6 bg-muted/30 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Multiple Export Formats
                  </h3>
                  <p className="text-muted-foreground">
                    Download your resume as PDF, DOCX, or plain text for ATS
                    systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-8">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2023 ResumeAI. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact Us
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
