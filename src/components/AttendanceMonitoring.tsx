import React, { useState } from "react";
import axios from "axios";

type Student = {
  name: string;
  prn: string;
  division: string;
  status: string; // "P" for Present, "A" for Absent
};

const AttendanceMonitoring: React.FC = () => {
  const [className, setClassName] = useState<string>("");
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().substring(0, 16)
  );
  const [students, setStudents] = useState<Student[]>([]);

  const addStudent = () => {
    setStudents([...students, { name: "", prn: "", division: "", status: "P" }]);
  };

  const handleStudentChange = (
    index: number,
    field: keyof Student,
    value: string
  ) => {
    const updated = [...students];
    updated[index] = { ...updated[index], [field]: value };
    setStudents(updated);
  };

  const generateReport = async (format: "pdf" | "excel") => {
    const payload = {
      className,
      attendanceDate,
      students,
    };

    try {
        const backendUrl = "http://127.0.0.1:5000"; // Or whatever your Flask URL is

        const endpoint =
          format === "pdf"
            ? `${backendUrl}/generate_attendance_pdf`
            : `${backendUrl}/generate_attendance_excel`;
        

      const response = await axios.post(endpoint, payload, {
        responseType: "blob",
      });

      // Use the response data directly with type assertion
      const blobData = response.data as Blob;
      const url = window.URL.createObjectURL(blobData);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        format === "pdf" ? "attendance_report.pdf" : "attendance_report.xlsx"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Clean up the URL object after download
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <div className="bg-white shadow p-6 rounded-lg my-8">
      <h2 className="text-2xl font-bold mb-4">Attendance Monitoring</h2>

      <div className="mb-4">
        <label className="block font-medium">Class Name</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="e.g. Math 101"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Date & Time</label>
        <input
          type="datetime-local"
          className="w-full border rounded p-2"
          value={attendanceDate}
          onChange={(e) => setAttendanceDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Students</h3>
        {students.map((student, index) => (
          <div
            key={index}
            className="flex flex-wrap gap-2 mb-2 border p-2 rounded"
          >
            <input
              type="text"
              placeholder="Name"
              className="border rounded p-2 flex-1"
              value={student.name}
              onChange={(e) => handleStudentChange(index, "name", e.target.value)}
            />
            <input
              type="text"
              placeholder="PRN"
              className="border rounded p-2 w-40"
              value={student.prn}
              onChange={(e) => handleStudentChange(index, "prn", e.target.value)}
            />
            <input
              type="text"
              placeholder="Division"
              className="border rounded p-2 w-24"
              value={student.division}
              onChange={(e) => handleStudentChange(index, "division", e.target.value)}
            />
            <select
              className="border rounded p-2 w-32"
              value={student.status}
              onChange={(e) => handleStudentChange(index, "status", e.target.value)}
            >
              <option value="P">Present (P)</option>
              <option value="A">Absent (A)</option>
            </select>
          </div>
        ))}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={addStudent}
        >
          Add Student
        </button>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => generateReport("pdf")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Download PDF
        </button>
        <button
          onClick={() => generateReport("excel")}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Download Excel
        </button>
      </div>
    </div>
  );
};

export default AttendanceMonitoring;