import { createClient } from "@/lib/supabase/client";

export interface ResumeData {
  id?: string;
  title?: string;
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
  atsScore?: number;
}

export async function saveResume(resumeData: ResumeData) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const title =
    resumeData.title || `${resumeData.personalInfo.fullName}'s Resume`;

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: userData.user.id,
      title,
      personal_info: resumeData.personalInfo,
      work_experience: resumeData.workExperience,
      education: resumeData.education,
      skills: resumeData.skills,
      achievements: resumeData.achievements,
      selected_template: resumeData.selectedTemplate,
      ats_score: resumeData.atsScore || 0,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateResume(id: string, resumeData: ResumeData) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const title =
    resumeData.title || `${resumeData.personalInfo.fullName}'s Resume`;

  const { data, error } = await supabase
    .from("resumes")
    .update({
      title,
      personal_info: resumeData.personalInfo,
      work_experience: resumeData.workExperience,
      education: resumeData.education,
      skills: resumeData.skills,
      achievements: resumeData.achievements,
      selected_template: resumeData.selectedTemplate,
      ats_score: resumeData.atsScore || 0,
      updated_at: new Date(),
    })
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserResumes() {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

export async function getResumeById(id: string) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .single();

  if (error) {
    throw error;
  }

  return {
    id: data.id,
    title: data.title,
    personalInfo: data.personal_info,
    workExperience: data.work_experience,
    education: data.education,
    skills: data.skills,
    achievements: data.achievements,
    selectedTemplate: data.selected_template,
    atsScore: data.ats_score,
  } as ResumeData;
}

export async function deleteResume(id: string) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id);

  if (error) {
    throw error;
  }

  return true;
}
