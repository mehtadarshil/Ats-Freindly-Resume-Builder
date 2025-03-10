"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface TemplateSelectionProps {
  selectedTemplate: string;
  updateTemplate: (template: string) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

const templates: Template[] = [
  {
    id: "professional",
    name: "Professional",
    description:
      "A clean, traditional layout perfect for corporate environments.",
    imageUrl:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "A streamlined, no-frills layout that focuses on content.",
    imageUrl:
      "https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=400&q=80",
  },
  {
    id: "modern",
    name: "Modern",
    description:
      "A blue-themed contemporary design with a professional accent.",
    imageUrl:
      "https://images.unsplash.com/photo-1512295767273-ac109ac3acfa?w=400&q=80",
  },
  {
    id: "creative",
    name: "Creative",
    description: "A vibrant purple and pink design for creative industries.",
    imageUrl:
      "https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=400&q=80",
  },
  {
    id: "executive",
    name: "Executive",
    description:
      "A sophisticated slate-themed layout for senior positions with uppercase headings.",
    imageUrl:
      "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?w=400&q=80",
  },
  {
    id: "technical",
    name: "Technical",
    description:
      "A code-inspired monospace font design with green accents for tech roles.",
    imageUrl:
      "https://images.unsplash.com/photo-1523726491678-bf852e717f6a?w=400&q=80",
  },
];

export function TemplateSelection({
  selectedTemplate,
  updateTemplate,
}: TemplateSelectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Choose a Template</h2>
        <p className="text-muted-foreground mb-6">
          Select a template that best represents your professional style and
          industry standards.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`overflow-hidden cursor-pointer transition-all ${selectedTemplate === template.id ? "ring-2 ring-primary" : "hover:shadow-md"}`}
            onClick={() => updateTemplate(template.id)}
          >
            <div className="relative h-48 w-full">
              <Image
                src={template.imageUrl}
                alt={template.name}
                fill
                className="object-cover"
              />
              {selectedTemplate === template.id && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-6 w-6" />
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-lg">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Template Customization</h3>
        <p className="text-sm text-muted-foreground mb-4">
          After selecting a template, you can customize colors, fonts, and
          spacing in the preview step.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" size="sm" disabled>
            Color Scheme
          </Button>
          <Button variant="outline" size="sm" disabled>
            Font Style
          </Button>
          <Button variant="outline" size="sm" disabled>
            Spacing
          </Button>
          <Button variant="outline" size="sm" disabled>
            Section Order
          </Button>
        </div>
      </div>
    </div>
  );
}
