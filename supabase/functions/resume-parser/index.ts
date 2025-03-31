// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/deploy_node_server

import { createClient } from "@supabase/supabase-js";
import type { ResumeParserRequest, ExtractedResumeData, ApiError } from "./types";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

export default async function handler(req: any, res: any) {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    res.set(corsHeaders).status(200).end();
    return;
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

    // Create a Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const requestData: ResumeParserRequest = req.body;
    const { filePath } = requestData;

    if (!filePath) {
      throw new Error("File path is required");
    }

    // Get file from storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from("resume-uploads")
      .download(filePath);

    if (fileError) {
      throw new Error(`Error downloading file: ${fileError.message}`);
    }

    // Convert file to base64
    const fileBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(fileBuffer);
    const fileBase64 = btoa(Array.from(uint8Array).map(byte => String.fromCharCode(byte)).join(""));

    // Determine file type from path
    const fileType = filePath.toLowerCase().endsWith(".pdf") ? "pdf" : "docx";

    // Call an external resume parsing API (this is a placeholder - you would use a real service)
    // For this example, we'll simulate parsing with a mock response
    // In a real implementation, you would call a service like Affinda, Sovren, or similar

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock extracted data
    // In a real implementation, you would parse the actual file content
    const extractedData: ExtractedResumeData = mockExtractResumeData(filePath);

    res.set(corsHeaders).status(200).json(extractedData);
  } catch (error) {
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : "An unknown error occurred"
    };
    res.set(corsHeaders).status(400).json(apiError);
  }
}

// Mock function to simulate resume data extraction
// In a real implementation, this would be replaced with actual parsing logic
function mockExtractResumeData(filePath: string): ExtractedResumeData {
  // Generate some realistic mock data
  return {
    personalInfo: {
      fullName: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/alexjohnson",
      website: "alexjohnson.dev",
      summary:
        "Experienced software engineer with 5+ years of experience in full-stack development. Proficient in JavaScript, React, Node.js, and cloud technologies. Passionate about creating scalable and user-friendly applications.",
    },
    workExperience: [
      {
        id: "1",
        jobTitle: "Senior Software Engineer",
        company: "Tech Innovations Inc.",
        location: "San Francisco, CA",
        startDate: "2020-06",
        endDate: "",
        current: true,
        description:
          "- Led development of a customer-facing web application using React and Node.js\n- Improved application performance by 40% through code optimization\n- Mentored junior developers and conducted code reviews\n- Implemented CI/CD pipeline using GitHub Actions",
      },
      {
        id: "2",
        jobTitle: "Software Developer",
        company: "WebSolutions Co.",
        location: "Oakland, CA",
        startDate: "2018-03",
        endDate: "2020-05",
        current: false,
        description:
          "- Developed and maintained multiple client websites using JavaScript and PHP\n- Collaborated with design team to implement responsive UI components\n- Optimized database queries resulting in 30% faster page load times\n- Participated in agile development process with bi-weekly sprints",
      },
    ],
    education: [
      {
        id: "1",
        school: "University of California, Berkeley",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science",
        location: "Berkeley, CA",
        startDate: "2014-09",
        endDate: "2018-05",
        current: false,
        description:
          "Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems",
      },
    ],
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "HTML/CSS",
      "SQL",
      "AWS",
      "Git",
      "Docker",
      "RESTful APIs",
    ],
    achievements: [
      {
        id: "1",
        title: "AWS Certified Solutions Architect",
        description:
          "Earned AWS certification demonstrating expertise in designing distributed systems on AWS.",
      },
      {
        id: "2",
        title: "Open Source Contributor",
        description:
          "Active contributor to several open-source projects including a popular React component library.",
      },
    ],
  };
}
