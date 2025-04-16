
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { PlusCircle, FileText, Download, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SubjectForm from "@/components/SubjectForm";
import { Subject, calculateGPA, generateSubjectId } from "@/utils/gradeCalculator";
import { generatePDF } from "@/services/api";

const GradeCalculator: React.FC = () => {
  const [studentName, setStudentName] = useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: generateSubjectId(), name: "", fa1: 0, fa2: 0, sa: 0 }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const gpa = calculateGPA(subjects);

  const handleAddSubject = () => {
    setSubjects([...subjects, { 
      id: generateSubjectId(), 
      name: "", 
      fa1: 0, 
      fa2: 0, 
      sa: 0 
    }]);
  };

  const handleUpdateSubject = (
    id: string,
    field: keyof Subject,
    value: string | number
  ) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, [field]: value } : subject
      )
    );
  };

  const handleRemoveSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((subject) => subject.id !== id));
    } else {
      toast({
        title: "Cannot remove subject",
        description: "You must have at least one subject.",
        variant: "destructive",
      });
    }
  };

  const handleGeneratePDF = async () => {
    // Validate student name
    if (!studentName.trim()) {
      toast({
        title: "Student name required",
        description: "Please enter a student name.",
        variant: "destructive",
      });
      return;
    }

    // Validate subjects
    const invalidSubjects = subjects.filter(subject => !subject.name.trim());
    if (invalidSubjects.length > 0) {
      toast({
        title: "Subject name required",
        description: "Please enter a name for all subjects.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      const formattedData = {
        student_name: studentName,
        subjects: subjects.map(subject => ({
          subject_name: subject.name,
          FA1: subject.fa1,
          FA2: subject.fa2,
          SA: subject.sa,
        })),
      };

      const pdfBlob = await generatePDF(formattedData);
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${studentName.replace(/\s+/g, '_')}_grade_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);

      toast({
        title: "PDF Generated Successfully",
        description: "Your grade report has been downloaded.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "PDF Generation Failed",
        description: "Please make sure your Flask API is running on http://localhost:5000",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="bg-white shadow-sm">
        <CardHeader className="bg-gradient-to-r from-purple-primary to-purple-secondary text-white">
          <CardTitle className="text-2xl font-bold">Student Grade Calculator</CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="mb-6">
            <Label htmlFor="student-name" className="text-lg font-medium mb-2 block">
              Student Name
            </Label>
            <Input
              id="student-name"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Enter student name"
              className="w-full max-w-md"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Subjects</h3>
              <Button 
                onClick={handleAddSubject} 
                variant="outline" 
                className="text-purple-secondary border-purple-secondary hover:bg-purple-primary hover:text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </div>

            <div className="space-y-3">
              {subjects.map((subject) => (
                <SubjectForm
                  key={subject.id}
                  subject={subject}
                  onUpdate={handleUpdateSubject}
                  onRemove={handleRemoveSubject}
                />
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-center bg-neutral-bg p-6 border-t">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <h3 className="text-lg font-medium">Overall GPA</h3>
            <p className="text-3xl font-bold text-purple-secondary">
              {gpa.toFixed(2)}
            </p>
          </div>
          
          <Button
            onClick={handleGeneratePDF}
            disabled={isLoading}
            className="bg-purple-primary hover:bg-purple-secondary text-white"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileText className="mr-2 h-4 w-4" />
            )}
            Generate PDF Report
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GradeCalculator;
