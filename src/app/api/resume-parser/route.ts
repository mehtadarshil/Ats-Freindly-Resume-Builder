import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: any) {
            cookieStore.set({ name, value: "", ...options });
          },
        },
      },
    );

    // Get the current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the file from the request
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a PDF or Word document" },
        { status: 400 },
      );
    }

    // Upload file to Supabase Storage
    const fileName = `${userData.user.id}/${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("resume-uploads")
      .upload(fileName, file);

    if (uploadError) {
      return NextResponse.json(
        { error: `Error uploading file: ${uploadError.message}` },
        { status: 500 },
      );
    }

    // Call the resume parser edge function
    const { data: extractedData, error: extractError } =
      await supabase.functions.invoke("resume-parser", {
        body: { filePath: fileName },
      });

    if (extractError) {
      return NextResponse.json(
        { error: `Error parsing resume: ${extractError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: extractedData });
  } catch (error: any) {
    console.error("Error in resume parser API:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
