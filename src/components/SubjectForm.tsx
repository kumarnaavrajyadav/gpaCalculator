
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Subject, calculateTotal, calculateGradePoint, getLetterGrade } from "@/utils/gradeCalculator";
import { Card } from "@/components/ui/card";

interface SubjectFormProps {
  subject: Subject;
  onUpdate: (id: string, field: keyof Subject, value: string | number) => void;
  onRemove: (id: string) => void;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ subject, onUpdate, onRemove }) => {
  const total = calculateTotal(subject);
  const gradePoint = calculateGradePoint(total);
  const letterGrade = getLetterGrade(gradePoint);

  const handleInputChange = (field: keyof Subject, value: string) => {
    let parsedValue: string | number = value;
    
    // Convert to number for marks fields
    if (field === "fa1" || field === "fa2" || field === "sa") {
      const numValue = parseFloat(value) || 0;
      
      // Apply limits based on the field
      if (field === "fa1" || field === "fa2") {
        parsedValue = Math.min(Math.max(numValue, 0), 20); // Limit between 0-20
      } else if (field === "sa") {
        parsedValue = Math.min(Math.max(numValue, 0), 60); // Limit between 0-60
      }
    }
    
    onUpdate(subject.id, field, parsedValue);
  };

  return (
    <Card className="p-4 mb-4 border border-border bg-white">
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4">
        <div className="flex-1 mb-3 md:mb-0">
          <Label htmlFor={`subject-${subject.id}`} className="mb-1 block text-sm">
            Subject Name
          </Label>
          <Input
            id={`subject-${subject.id}`}
            value={subject.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter subject name"
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 flex-1">
          <div>
            <Label htmlFor={`fa1-${subject.id}`} className="mb-1 block text-sm">
              FA1 (max 20)
            </Label>
            <Input
              id={`fa1-${subject.id}`}
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={subject.fa1}
              onChange={(e) => handleInputChange("fa1", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor={`fa2-${subject.id}`} className="mb-1 block text-sm">
              FA2 (max 20)
            </Label>
            <Input
              id={`fa2-${subject.id}`}
              type="number"
              min="0"
              max="20"
              step="0.5"
              value={subject.fa2}
              onChange={(e) => handleInputChange("fa2", e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor={`sa-${subject.id}`} className="mb-1 block text-sm">
              SA (max 60)
            </Label>
            <Input
              id={`sa-${subject.id}`}
              type="number"
              min="0"
              max="60"
              step="0.5"
              value={subject.sa}
              onChange={(e) => handleInputChange("sa", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 mt-3 md:mt-0">
          <div className="text-center">
            <Label className="block text-sm">Total</Label>
            <div className="font-semibold">{total}/100</div>
          </div>
          <div className="text-center">
            <Label className="block text-sm">Grade</Label>
            <div className="font-semibold">{letterGrade} ({gradePoint})</div>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={() => onRemove(subject.id)}
            className="hover:bg-destructive hover:text-white transition-colors"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SubjectForm;
