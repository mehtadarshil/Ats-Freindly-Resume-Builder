"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  AlertCircle,
  Download,
  FileText,
  LogOut,
  User,
  Users,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<any[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if admin is authenticated
    const isAdmin = localStorage.getItem("adminAuthenticated");
    if (!isAdmin) {
      router.push("/admin/login");
      return;
    }

    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;
      setUsers(usersData || []);

      // Load resumes
      const { data: resumesData, error: resumesError } = await supabase
        .from("resumes")
        .select("*, users(full_name, email)")
        .order("updated_at", { ascending: false });

      if (resumesError) throw resumesError;
      setResumes(resumesData || []);
    } catch (error: any) {
      console.error("Error loading data:", error);
      setError(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated");
    router.push("/admin/login");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const exportUsersToCSV = () => {
    if (users.length === 0) return;

    const headers = ["ID", "Full Name", "Email", "Created At"];
    const csvData = users.map((user) => [
      user.id,
      user.full_name,
      user.email,
      new Date(user.created_at).toISOString(),
    ]);

    downloadCSV(headers, csvData, "users");
  };

  const exportResumesToCSV = () => {
    if (resumes.length === 0) return;

    const headers = [
      "ID",
      "Title",
      "User Name",
      "User Email",
      "Template",
      "ATS Score",
      "Created At",
      "Updated At",
    ];
    const csvData = resumes.map((resume) => [
      resume.id,
      resume.title,
      resume.users?.full_name || "",
      resume.users?.email || "",
      resume.selected_template,
      resume.ats_score,
      new Date(resume.created_at).toISOString(),
      new Date(resume.updated_at).toISOString(),
    ]);

    downloadCSV(headers, csvData, "resumes");
  };

  const downloadCSV = (headers: string[], data: any[], filename: string) => {
    const csvRows = [];
    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = row.map((value: any) => {
        const stringValue = String(value);
        // Escape quotes and wrap in quotes if contains comma
        return stringValue.includes(",")
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${filename}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => loadData()}
            >
              Refresh Data
            </Button>
            <Link href="/">
              <Button variant="ghost" size="sm">
                View Site
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Resumes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{resumes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Average ATS Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {resumes.length > 0
                  ? Math.round(
                      resumes.reduce(
                        (sum, resume) => sum + (resume.ats_score || 0),
                        0,
                      ) / resumes.length,
                    )
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="resumes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Resumes
            </TabsTrigger>
          </TabsList>

          <div className="border rounded-lg p-6 mb-6">
            <TabsContent value="users" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">User Management</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={exportUsersToCSV}
                  disabled={users.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Export Users
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No users found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Resumes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              {user.full_name || "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell>
                            {
                              resumes.filter((r) => r.user_id === user.id)
                                .length
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="resumes" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Resume Management</h2>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={exportResumesToCSV}
                  disabled={resumes.length === 0}
                >
                  <Download className="h-4 w-4" />
                  Export Resumes
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading resumes...</p>
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No resumes found</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Template</TableHead>
                        <TableHead>ATS Score</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resumes.map((resume) => (
                        <TableRow
                          key={resume.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() =>
                            router.push(`/admin/resumes/${resume.id}`)
                          }
                        >
                          <TableCell className="font-medium">
                            {resume.title}
                          </TableCell>
                          <TableCell>
                            {resume.users?.full_name || "N/A"}
                            <div className="text-xs text-muted-foreground">
                              {resume.users?.email}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">
                            {resume.selected_template}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(resume.ats_score)}`}
                            >
                              {resume.ats_score}/100
                            </span>
                          </TableCell>
                          <TableCell>{formatDate(resume.updated_at)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}

function getScoreColor(score: number) {
  if (score >= 80)
    return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
  if (score >= 60)
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
  return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
}
