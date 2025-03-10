"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface WorkExperienceFormProps {
  data: WorkExperience[];
  updateData: (data: WorkExperience[]) => void;
}

export function WorkExperienceForm({
  data,
  updateData,
}: WorkExperienceFormProps) {
  const [experiences, setExperiences] = useState<WorkExperience[]>(
    data.length > 0 ? data : [],
  );

  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };

    const updatedExperiences = [...experiences, newExperience];
    setExperiences(updatedExperiences);
    updateData(updatedExperiences);
  };

  const removeExperience = (id: string) => {
    const updatedExperiences = experiences.filter((exp) => exp.id !== id);
    setExperiences(updatedExperiences);
    updateData(updatedExperiences);
  };

  const handleExperienceChange = (
    id: string,
    field: keyof WorkExperience,
    value: string | boolean,
  ) => {
    const updatedExperiences = experiences.map((exp) => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });

    setExperiences(updatedExperiences);
    updateData(updatedExperiences);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Work Experience</h2>
        <p className="text-muted-foreground mb-6">
          Add your relevant work experience, starting with the most recent
          position.
        </p>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            No work experience added yet.
          </p>
          <Button onClick={addExperience}>Add Work Experience</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {experiences.map((experience, index) => (
            <div
              key={experience.id}
              className="p-6 border rounded-lg space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Experience {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperience(experience.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`jobTitle-${experience.id}`}>
                    Job Title *
                  </Label>
                  <Input
                    id={`jobTitle-${experience.id}`}
                    value={experience.jobTitle}
                    onChange={(e) =>
                      handleExperienceChange(
                        experience.id,
                        "jobTitle",
                        e.target.value,
                      )
                    }
                    placeholder="Software Engineer"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`company-${experience.id}`}>Company *</Label>
                  <Input
                    id={`company-${experience.id}`}
                    value={experience.company}
                    onChange={(e) =>
                      handleExperienceChange(
                        experience.id,
                        "company",
                        e.target.value,
                      )
                    }
                    placeholder="Acme Inc."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`location-${experience.id}`}>Location</Label>
                  <Input
                    id={`location-${experience.id}`}
                    value={experience.location}
                    onChange={(e) =>
                      handleExperienceChange(
                        experience.id,
                        "location",
                        e.target.value,
                      )
                    }
                    placeholder="City, State or Remote"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${experience.id}`}>
                      Start Date *
                    </Label>
                    <Input
                      id={`startDate-${experience.id}`}
                      type="month"
                      value={experience.startDate}
                      onChange={(e) =>
                        handleExperienceChange(
                          experience.id,
                          "startDate",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${experience.id}`}>End Date</Label>
                    <Input
                      id={`endDate-${experience.id}`}
                      type="month"
                      value={experience.endDate}
                      onChange={(e) =>
                        handleExperienceChange(
                          experience.id,
                          "endDate",
                          e.target.value,
                        )
                      }
                      disabled={experience.current}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`current-${experience.id}`}
                    checked={experience.current}
                    onChange={(e) =>
                      handleExperienceChange(
                        experience.id,
                        "current",
                        e.target.checked,
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`current-${experience.id}`}>
                    I currently work here
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${experience.id}`}>
                  Description *
                </Label>
                <Textarea
                  id={`description-${experience.id}`}
                  value={experience.description}
                  onChange={(e) =>
                    handleExperienceChange(
                      experience.id,
                      "description",
                      e.target.value,
                    )
                  }
                  placeholder="Describe your responsibilities, achievements, and the technologies you worked with..."
                  className="min-h-[150px]"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Use bullet points starting with action verbs. Include metrics
                  and achievements when possible.
                </p>
              </div>
            </div>
          ))}

          <Button onClick={addExperience} variant="outline" className="w-full">
            Add Another Experience
          </Button>
        </div>
      )}
    </div>
  );
}
