
interface Subject {
  subject_name: string;
  FA1: number;
  FA2: number;
  SA: number;
}

interface GradeReport {
  student_name: string;
  subjects: Subject[];
}

export const generatePDF = async (data: GradeReport): Promise<Blob> => {
  try {
    const response = await fetch('http://localhost:5000/generate_pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate PDF');
    }

    return await response.blob();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
