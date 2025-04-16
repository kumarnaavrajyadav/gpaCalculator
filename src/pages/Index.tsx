import GradeCalculator from "@/components/GradeCalculator";
import AttendanceMonitoring from "@/components/AttendanceMonitoring";

const Index = () => {
  return (
    <div className="min-h-screen bg-neutral-bg py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-purple-secondary">
            Student Grade Report Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter your subject marks and generate a professional grade report
            complete with GPA calculations. Add as many subjects as needed and
            download the report as a PDF.
          </p>
        </header>

        <GradeCalculator />
        <AttendanceMonitoring />

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Defaulter Task</p>
          <p className="mt-1">Student Grade Report Generator</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
