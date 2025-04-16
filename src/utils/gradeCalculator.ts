
export interface Subject {
  id: string;
  name: string;
  fa1: number;
  fa2: number;
  sa: number;
}

export const calculateTotal = (subject: Subject): number => {
  return subject.fa1 + subject.fa2 + subject.sa;
};

export const calculateGradePoint = (totalMarks: number): number => {
  if (totalMarks >= 90) return 10;
  if (totalMarks >= 80) return 9;
  if (totalMarks >= 70) return 8;
  if (totalMarks >= 60) return 7;
  if (totalMarks >= 50) return 6;
  if (totalMarks >= 40) return 5;
  return 0;
};

export const calculateGPA = (subjects: Subject[]): number => {
  if (subjects.length === 0) return 0;
  
  const totalGradePoints = subjects.reduce((sum, subject) => {
    const total = calculateTotal(subject);
    const gradePoint = calculateGradePoint(total);
    return sum + gradePoint;
  }, 0);
  
  return totalGradePoints / subjects.length;
};

export const getLetterGrade = (gradePoint: number): string => {
  if (gradePoint === 10) return 'A+';
  if (gradePoint === 9) return 'A';
  if (gradePoint === 8) return 'B+';
  if (gradePoint === 7) return 'B';
  if (gradePoint === 6) return 'C';
  if (gradePoint === 5) return 'D';
  return 'F';
};

export const generateSubjectId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
