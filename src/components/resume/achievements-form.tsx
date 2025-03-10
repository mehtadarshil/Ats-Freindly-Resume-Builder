"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
}

interface AchievementsFormProps {
  data: Achievement[];
  updateData: (data: Achievement[]) => void;
}

export function AchievementsForm({ data, updateData }: AchievementsFormProps) {
  const [achievements, setAchievements] = useState<Achievement[]>(
    data.length > 0 ? data : [],
  );

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: "",
      description: "",
    };

    const updatedAchievements = [...achievements, newAchievement];
    setAchievements(updatedAchievements);
    updateData(updatedAchievements);
  };

  const removeAchievement = (id: string) => {
    const updatedAchievements = achievements.filter(
      (achievement) => achievement.id !== id,
    );
    setAchievements(updatedAchievements);
    updateData(updatedAchievements);
  };

  const handleAchievementChange = (
    id: string,
    field: keyof Achievement,
    value: string,
  ) => {
    const updatedAchievements = achievements.map((achievement) => {
      if (achievement.id === id) {
        return { ...achievement, [field]: value };
      }
      return achievement;
    });

    setAchievements(updatedAchievements);
    updateData(updatedAchievements);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          Achievements & Certifications
        </h2>
        <p className="text-muted-foreground mb-6">
          Add notable achievements, certifications, awards, or projects that
          demonstrate your expertise and accomplishments.
        </p>
      </div>

      {achievements.length === 0 ? (
        <div className="text-center py-8 border border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            No achievements added yet.
          </p>
          <Button onClick={addAchievement}>Add Achievement</Button>
        </div>
      ) : (
        <div className="space-y-8">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="p-6 border rounded-lg space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Achievement {index + 1}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeAchievement(achievement.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`title-${achievement.id}`}>Title *</Label>
                  <Input
                    id={`title-${achievement.id}`}
                    value={achievement.title}
                    onChange={(e) =>
                      handleAchievementChange(
                        achievement.id,
                        "title",
                        e.target.value,
                      )
                    }
                    placeholder="AWS Certified Solutions Architect or Project Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${achievement.id}`}>
                    Description *
                  </Label>
                  <Textarea
                    id={`description-${achievement.id}`}
                    value={achievement.description}
                    onChange={(e) =>
                      handleAchievementChange(
                        achievement.id,
                        "description",
                        e.target.value,
                      )
                    }
                    placeholder="Describe the achievement, certification, or project and its impact..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <Button onClick={addAchievement} variant="outline" className="w-full">
            Add Another Achievement
          </Button>
        </div>
      )}

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Tips for Achievements</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Include certifications relevant to your field</li>
          <li>Highlight projects that demonstrate your skills</li>
          <li>Mention awards or recognition you've received</li>
          <li>
            Quantify achievements with numbers when possible (e.g., "Increased
            sales by 20%")
          </li>
          <li>Include publications, presentations, or speaking engagements</li>
        </ul>
      </div>
    </div>
  );
}
