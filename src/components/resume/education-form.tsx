"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface EducationFormProps {
  data: Education[];
  updateData: (data: Education[]) => void;
}

export function EducationForm({ data, updateData }: EducationFormProps) {
  const [educations, setEducations] = useState<Education[]>(
    data.length > 0 ? data : [],
  );

  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };

    const updatedEducations = [...educations, newEducation];
    setEducations(updatedEducations);
    updateData(updatedEducations);
  };

  const removeEducation = (id: string) => {
    const updatedEducations = educations.filter((edu) => edu.id !== id);
    setEducations(updatedEducations);
    updateData(updatedEducations);
  };

  const handleEducationChange = (
    id: string,
    field: keyof Education,
    value: string | boolean,
  ) => {
    const updatedEducations = educations.map((edu) => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });

    setEducations(updatedEducations);
    updateData(updatedEducations);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        <p className="text-muted-foreground mb-6">
          Add your educational background, starting with the most recent.
        </p>
      </div>

      {educations.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No education added yet.</p>
          <Button onClick={addEducation}>Add Education</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {educations.map((education, index) => (
            <div key={education.id} className="p-6 border rounded-lg space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Education {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEducation(education.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`school-${education.id}`}>
                    School/University *
                  </Label>
                  <Input
                    id={`school-${education.id}`}
                    value={education.school}
                    onChange={(e) =>
                      handleEducationChange(
                        education.id,
                        "school",
                        e.target.value,
                      )
                    }
                    placeholder="University of California"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`degree-${education.id}`}>Degree *</Label>
                  <Input
                    id={`degree-${education.id}`}
                    value={education.degree}
                    onChange={(e) =>
                      handleEducationChange(
                        education.id,
                        "degree",
                        e.target.value,
                      )
                    }
                    placeholder="Bachelor of Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`fieldOfStudy-${education.id}`}>
                    Field of Study *
                  </Label>
                  <Input
                    id={`fieldOfStudy-${education.id}`}
                    value={education.fieldOfStudy}
                    onChange={(e) =>
                      handleEducationChange(
                        education.id,
                        "fieldOfStudy",
                        e.target.value,
                      )
                    }
                    placeholder="Computer Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`location-${education.id}`}>Location</Label>
                  <Input
                    id={`location-${education.id}`}
                    value={education.location}
                    onChange={(e) =>
                      handleEducationChange(
                        education.id,
                        "location",
                        e.target.value,
                      )
                    }
                    placeholder="City, State"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${education.id}`}>
                      Start Date *
                    </Label>
                    <Input
                      id={`startDate-${education.id}`}
                      type="month"
                      value={education.startDate}
                      onChange={(e) =>
                        handleEducationChange(
                          education.id,
                          "startDate",
                          e.target.value,
                        )
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${education.id}`}>End Date</Label>
                    <Input
                      id={`endDate-${education.id}`}
                      type="month"
                      value={education.endDate}
                      onChange={(e) =>
                        handleEducationChange(
                          education.id,
                          "endDate",
                          e.target.value,
                        )
                      }
                      disabled={education.current}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`current-${education.id}`}
                    checked={education.current}
                    onChange={(e) =>
                      handleEducationChange(
                        education.id,
                        "current",
                        e.target.checked,
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor={`current-${education.id}`}>
                    I am currently studying here
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${education.id}`}>
                  Additional Information
                </Label>
                <Textarea
                  id={`description-${education.id}`}
                  value={education.description}
                  onChange={(e) =>
                    handleEducationChange(
                      education.id,
                      "description",
                      e.target.value,
                    )
                  }
                  placeholder="Relevant coursework, honors, activities, or achievements..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))}

          <Button onClick={addEducation} variant="outline" className="w-full">
            Add Another Education
          </Button>
        </div>
      )}
    </div>
  );
}
