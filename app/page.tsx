import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">AI Resume Generator</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/generator">
              <Button variant="ghost">Get Started</Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline">Sign In</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="secondary">
          Powered by AI
        </Badge>
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Create Professional Resumes &amp; Cover Letters in Minutes
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Leverage the power of AI to generate tailored resumes and cover letters designed specifically for developers. 
          Stand out in your job search with professionally crafted documents.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/generator">
            <Button size="lg" className="text-lg px-8">
              Start Creating Free
            </Button>
          </Link>
          <Link href="#pricing">
            <Button size="lg" variant="outline" className="text-lg px-8">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our advanced AI analyzes your experience and generates compelling content 
                tailored to specific developer roles like Frontend, Backend, Full Stack, and more.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job-Specific Tailoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Customize your resume and cover letter for different positions. 
                Highlight the most relevant skills and experiences for each application.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional PDF Export</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Download your documents as beautifully formatted PDFs ready to send to employers. 
                No additional software needed.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Free Plan</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ 3 resume generations per month</li>
                <li>✓ 3 cover letter generations per month</li>
                <li>✓ PDF export</li>
                <li>✓ Basic templates</li>
                <li>✗ Priority support</li>
                <li>✗ Advanced customization</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/generator" className="w-full">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="border-primary">
            <CardHeader>
              <Badge className="w-fit mb-2">Most Popular</Badge>
              <CardTitle>Premium Plan</CardTitle>
              <CardDescription>For serious job seekers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <span className="text-4xl font-bold">$9.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>✓ Unlimited resume generations</li>
                <li>✓ Unlimited cover letter generations</li>
                <li>✓ PDF export</li>
                <li>✓ Premium templates</li>
                <li>✓ Priority support</li>
                <li>✓ Advanced AI customization</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/profile" className="w-full">
                <Button className="w-full">
                  Upgrade to Premium
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h3 className="text-3xl font-bold mb-6">Ready to Land Your Dream Job?</h3>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of developers who have successfully landed interviews using our AI-powered resume generator.
        </p>
        <Link href="/generator">
          <Button size="lg" className="text-lg px-8">
            Create Your Resume Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 AI Resume Generator. Built for developers, by developers.</p>
        </div>
      </footer>
    </div>
  );
}
