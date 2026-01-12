import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { getLanguageModel } from "@/lib/ai/providers";

// Interface for request body
interface GenerateRequest {
  name: string;
  email: string;
  phone: string;
  jobTitle: string;
  targetRole: string;
  workExperience: string;
  skills: string;
  education: string;
  documentType: "resume" | "cover-letter" | "both";
}

// Role descriptions for better AI prompting
const roleDescriptions: Record<string, string> = {
  frontend: "Frontend Developer specializing in user interfaces and web applications",
  backend: "Backend Developer focusing on server-side logic and APIs",
  fullstack: "Full Stack Developer with expertise in both frontend and backend",
  mobile: "Mobile Developer creating iOS and Android applications",
  devops: "DevOps Engineer managing infrastructure and deployment pipelines",
  data: "Data Engineer building data pipelines and analytics systems",
  ml: "Machine Learning Engineer developing AI and ML solutions",
};

/**
 * Generate resume content using AI
 */
async function generateResume(data: GenerateRequest): Promise<string> {
  const roleDesc = roleDescriptions[data.targetRole] || data.targetRole;

  const prompt = `You are an expert resume writer specializing in tech industry resumes. Create a professional, ATS-friendly resume for the following candidate:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Current/Recent Role: ${data.jobTitle}
Target Position: ${roleDesc}

Work Experience:
${data.workExperience}

Technical Skills:
${data.skills}

Education:
${data.education}

Please generate a well-structured resume with the following sections:
1. Professional Summary (2-3 sentences highlighting key strengths)
2. Technical Skills (organized by category)
3. Professional Experience (with bullet points emphasizing achievements and impact)
4. Education

Format the resume professionally with clear section headers and bullet points. Focus on quantifiable achievements and relevant technologies for a ${roleDesc} position.`;

  try {
    const { text } = await generateText({
      model: getLanguageModel("openai/gpt-4.1-mini"),
      prompt,
      temperature: 0.7,
    });

    return text;
  } catch (error) {
    console.error("Error generating resume:", error);
    throw new Error("Failed to generate resume");
  }
}

/**
 * Generate cover letter content using AI
 */
async function generateCoverLetter(data: GenerateRequest): Promise<string> {
  const roleDesc = roleDescriptions[data.targetRole] || data.targetRole;

  const prompt = `You are an expert cover letter writer specializing in tech industry applications. Create a compelling, professional cover letter for the following candidate:

Name: ${data.name}
Target Position: ${roleDesc}
Current/Recent Role: ${data.jobTitle}

Work Experience:
${data.workExperience}

Technical Skills:
${data.skills}

Education:
${data.education}

Please write a professional cover letter that:
1. Opens with a strong introduction expressing interest in ${roleDesc} positions
2. Highlights 2-3 key achievements from their work experience
3. Demonstrates how their skills align with the target role
4. Shows enthusiasm for the position
5. Closes with a call to action

Keep it concise (3-4 paragraphs), professional, and tailored to a ${roleDesc} position. Avoid being overly generic.`;

  try {
    const { text } = await generateText({
      model: getLanguageModel("openai/gpt-4.1-mini"),
      prompt,
      temperature: 0.7,
    });

    return text;
  } catch (error) {
    console.error("Error generating cover letter:", error);
    throw new Error("Failed to generate cover letter");
  }
}

/**
 * POST /api/generate
 * Generate resume and/or cover letter based on user input
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: GenerateRequest = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.targetRole || !body.workExperience || !body.skills) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Check user subscription tier and rate limits
    // For now, we'll allow generation without auth for MVP
    // In production, you would:
    // 1. Get the user session
    // 2. Check their subscription tier (free vs premium)
    // 3. Enforce rate limits based on tier
    // 4. Track usage in database

    const result: {
      resume?: string;
      coverLetter?: string;
    } = {};

    // Generate requested documents
    if (body.documentType === "resume" || body.documentType === "both") {
      result.resume = await generateResume(body);
    }

    if (body.documentType === "cover-letter" || body.documentType === "both") {
      result.coverLetter = await generateCoverLetter(body);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in generate API:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
