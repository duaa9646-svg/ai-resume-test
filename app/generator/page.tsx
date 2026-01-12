"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

// Types for form data
interface FormData {
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

export default function GeneratorPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    targetRole: "frontend",
    workExperience: "",
    skills: "",
    education: "",
    documentType: "resume",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    resume?: string;
    coverLetter?: string;
  }>({});

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // Call the API to generate content
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      setGeneratedContent(data);
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle PDF download
  const handleDownloadPDF = async (type: "resume" | "cover-letter") => {
    try {
      const content = type === "resume" ? generatedContent.resume : generatedContent.coverLetter;
      
      if (!content) {
        alert("No content to download");
        return;
      }

      // Dynamic import to avoid SSR issues
      const jsPDF = (await import("jspdf")).default;
      const html2canvas = (await import("html2canvas")).default;

      // Create a temporary div with the content
      const tempDiv = document.createElement("div");
      tempDiv.style.padding = "40px";
      tempDiv.style.maxWidth = "800px";
      tempDiv.style.fontFamily = "Arial, sans-serif";
      tempDiv.innerHTML = content.replace(/\n/g, "<br>");
      document.body.appendChild(tempDiv);

      // Convert to canvas
      const canvas = await html2canvas(tempDiv);
      const imgData = canvas.toDataURL("image/png");

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Download PDF
      pdf.save(`${type}-${formData.name.replace(/\s+/g, "-")}.pdf`);

      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">AI Resume Generator</h1>
          </Link>
          <Link href="/profile">
            <Button variant="outline">My Profile</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Create Your Resume &amp; Cover Letter</h2>
          <p className="text-muted-foreground mb-8">
            Fill in your details below and let our AI generate professional documents tailored to your target role.
          </p>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>Provide your details to generate personalized content</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Personal Information */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Current/Recent Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                      placeholder="Software Developer"
                    />
                  </div>

                  {/* Target Role */}
                  <div className="space-y-2">
                    <Label htmlFor="targetRole">Target Role *</Label>
                    <Select
                      value={formData.targetRole}
                      onValueChange={(value) => handleInputChange("targetRole", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend Developer</SelectItem>
                        <SelectItem value="backend">Backend Developer</SelectItem>
                        <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                        <SelectItem value="mobile">Mobile Developer</SelectItem>
                        <SelectItem value="devops">DevOps Engineer</SelectItem>
                        <SelectItem value="data">Data Engineer</SelectItem>
                        <SelectItem value="ml">Machine Learning Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Work Experience */}
                  <div className="space-y-2">
                    <Label htmlFor="workExperience">Work Experience *</Label>
                    <Textarea
                      id="workExperience"
                      value={formData.workExperience}
                      onChange={(e) => handleInputChange("workExperience", e.target.value)}
                      required
                      placeholder="List your relevant work experience, including company names, roles, and key achievements..."
                      rows={4}
                    />
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <Label htmlFor="skills">Technical Skills *</Label>
                    <Textarea
                      id="skills"
                      value={formData.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                      required
                      placeholder="JavaScript, React, Node.js, Python, AWS, Docker, etc."
                      rows={3}
                    />
                  </div>

                  {/* Education */}
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={formData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      placeholder="Your educational background, degrees, certifications..."
                      rows={3}
                    />
                  </div>

                  {/* Document Type */}
                  <div className="space-y-2">
                    <Label htmlFor="documentType">What would you like to generate? *</Label>
                    <Select
                      value={formData.documentType}
                      onValueChange={(value) => handleInputChange("documentType", value as FormData["documentType"])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resume">Resume Only</SelectItem>
                        <SelectItem value="cover-letter">Cover Letter Only</SelectItem>
                        <SelectItem value="both">Both Resume &amp; Cover Letter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={isGenerating}>
                    {isGenerating ? "Generating..." : "Generate with AI"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Results Section */}
            <div className="space-y-4">
              {generatedContent.resume && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Resume</CardTitle>
                    <CardDescription>Your AI-generated professional resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none mb-4 p-4 bg-muted rounded-md max-h-96 overflow-y-auto whitespace-pre-wrap">
                      {generatedContent.resume}
                    </div>
                    <Button onClick={() => handleDownloadPDF("resume")} className="w-full">
                      Download Resume PDF
                    </Button>
                  </CardContent>
                </Card>
              )}

              {generatedContent.coverLetter && (
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Cover Letter</CardTitle>
                    <CardDescription>Your AI-generated professional cover letter</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none mb-4 p-4 bg-muted rounded-md max-h-96 overflow-y-auto whitespace-pre-wrap">
                      {generatedContent.coverLetter}
                    </div>
                    <Button onClick={() => handleDownloadPDF("cover-letter")} className="w-full">
                      Download Cover Letter PDF
                    </Button>
                  </CardContent>
                </Card>
              )}

              {!generatedContent.resume && !generatedContent.coverLetter && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Your generated content will appear here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <p>Fill out the form and click "Generate with AI" to see your resume and cover letter.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
