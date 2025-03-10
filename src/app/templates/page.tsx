import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeSwitcher } from "@/components/theme-switcher";

const templates = [
  {
    id: "professional",
    name: "Professional",
    description:
      "A clean, traditional layout perfect for corporate environments.",
    imageUrl:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80",
    popular: true,
  },
  {
    id: "modern",
    name: "Modern",
    description:
      "A contemporary design with a creative touch for forward-thinking companies.",
    imageUrl:
      "https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?w=400&q=80",
    popular: false,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "A streamlined, no-frills layout that focuses on content.",
    imageUrl:
      "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=400&q=80",
    popular: true,
  },
  {
    id: "creative",
    name: "Creative",
    description: "A bold design for creative industries and design roles.",
    imageUrl:
      "https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=400&q=80",
    popular: false,
  },
  {
    id: "executive",
    name: "Executive",
    description:
      "An elegant layout designed for senior positions and leadership roles.",
    imageUrl:
      "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=400&q=80",
    popular: true,
  },
  {
    id: "technical",
    name: "Technical",
    description:
      "Optimized for technical roles with sections for skills and projects.",
    imageUrl:
      "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=400&q=80",
    popular: false,
  },
];

export default function TemplatesPage() {
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
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            Resume Templates
          </h1>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            Choose from our collection of professionally designed, ATS-optimized
            resume templates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src={template.imageUrl}
                  alt={template.name}
                  fill
                  className="object-cover"
                />
                {template.popular && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                    Popular
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
                <p className="text-muted-foreground mb-4">
                  {template.description}
                </p>
                <div className="flex gap-3">
                  <Link
                    href={`/builder?template=${template.id}`}
                    className="flex-1"
                  >
                    <Button className="w-full">Use Template</Button>
                  </Link>
                  <Link href={`/templates/${template.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      Preview
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start with a blank template and customize it to your needs.
          </p>
          <Link href="/builder">
            <Button size="lg">Create Custom Resume</Button>
          </Link>
        </div>
      </main>

      <footer className="border-t py-8 mt-12">
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
          </div>
        </div>
      </footer>
    </div>
  );
}
