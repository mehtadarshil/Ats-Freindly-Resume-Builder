"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface SkillsFormProps {
  data: string[];
  updateData: (data: string[]) => void;
}

export function SkillsForm({ data, updateData }: SkillsFormProps) {
  const [skills, setSkills] = useState<string[]>(data.length > 0 ? data : []);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() === "") return;

    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    updateData(updatedSkills);
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    updateData(updatedSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <p className="text-muted-foreground mb-6">
          Add relevant skills that showcase your expertise. Include technical
          skills, soft skills, and tools you're proficient with.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="newSkill" className="sr-only">
              Add Skill
            </Label>
            <Input
              id="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a skill (e.g., JavaScript, Project Management, Adobe Photoshop)"
            />
          </div>
          <Button onClick={addSkill} type="button">
            Add
          </Button>
        </div>

        <div className="mt-4">
          {skills.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No skills added yet. Add skills that are relevant to the job
              you're applying for.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-full"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-secondary-foreground/70 hover:text-secondary-foreground"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Skill Suggestions</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Click on any of these common skills to add them to your resume.
          </p>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Technical Skills</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "JavaScript",
                  "Python",
                  "React",
                  "Node.js",
                  "SQL",
                  "AWS",
                  "Docker",
                  "Git",
                  "HTML/CSS",
                  "TypeScript",
                ].map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!skills.includes(skill)) {
                        const updatedSkills = [...skills, skill];
                        setSkills(updatedSkills);
                        updateData(updatedSkills);
                      }
                    }}
                    className="rounded-full"
                    disabled={skills.includes(skill)}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Soft Skills</h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Communication",
                  "Leadership",
                  "Problem Solving",
                  "Teamwork",
                  "Time Management",
                  "Adaptability",
                  "Critical Thinking",
                ].map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (!skills.includes(skill)) {
                        const updatedSkills = [...skills, skill];
                        setSkills(updatedSkills);
                        updateData(updatedSkills);
                      }
                    }}
                    className="rounded-full"
                    disabled={skills.includes(skill)}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
