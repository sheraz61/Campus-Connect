
import React, { useState } from 'react';
import { Calculator, Plus, RotateCcw, Trash2 } from 'lucide-react';

const GPA = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, marks: '', creditHours: '2' }
  ]);
  const [totalCreditHours, setTotalCreditHours] = useState('');
  const [result, setResult] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);

  const calGPA = (marks) => {
    const numMarks = parseInt(marks);
    if (numMarks >= 80 && numMarks <= 100) return 4.00;
    if (numMarks >= 65 && numMarks <= 79) return 3.00 + (numMarks - 65) * 0.067;
    if (numMarks >= 50 && numMarks <= 64) return 2.00 + (numMarks - 50) * 0.067;
    if (numMarks >= 40 && numMarks <= 49) return 1.00 + (numMarks - 40) * 0.10;
    return 0;
  };

  const addSubject = () => {
    setSubjects([
      ...subjects,
      { id: subjects.length + 1, marks: '', creditHours: '2' }
    ]);
  };

  const removeLastSubject = () => {
    if (subjects.length > 1) {
      setSubjects(subjects.slice(0, -1));
    }
  };

  const handleInputChange = (id, field, value) => {
    setSubjects(subjects.map(subject =>
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  const calculateGPA = () => {
    const isValid = subjects.every(subject => 
      subject.marks !== '' && 
      !isNaN(subject.marks) && 
      parseInt(subject.marks) >= 0 && 
      parseInt(subject.marks) <= 100
    ) && totalCreditHours !== '' && !isNaN(totalCreditHours) && parseFloat(totalCreditHours) > 0;

    if (!isValid) {
      setResult('Please enter valid inputs for all fields');
    setIsCalculated(true);
      return;
    }

    let totalQualityPoints = 0;
    subjects.forEach(subject => {
      const gpa = calGPA(subject.marks);
      totalQualityPoints += gpa * parseFloat(subject.creditHours);
    });

    const finalGPA = (totalQualityPoints / parseFloat(totalCreditHours)).toFixed(2);
    setResult(`Your Semester GPA is: ${finalGPA}`);
    setIsCalculated(true);
  };

  const resetCalculator = () => {
    setSubjects([{ id: 1, marks: '', creditHours: '2' }]);
    setTotalCreditHours('');
    setResult('');
    setIsCalculated(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
     

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="border border-gray-300 max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-center font-bold text-3xl bg-gray-700  m-auto rounded-md p-3 text-white hover:cursor-pointer mt-[30px]">GPA Calculator UOS</h2>
            <p className="text-center text-gray-600 mb-6 mt-[10px] max-w-[600px] m-auto">
              Please enter the obtained marks and choose the credit hours for each subject to calculate
              the GPA accurately.
            </p>

            <div className="space-y-4 border border-gray-300 p-6 rounded-md">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Total Credit Hours:
                </label>
                <input
                  type="number"
                  min="1"
                  max="18"
                  value={totalCreditHours}
                  onChange={(e) => setTotalCreditHours(e.target.value)}
                  placeholder="Enter total credit hours"
                  disabled={isCalculated}
                  className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {subjects.map((subject, index) => (
                <div key={subject.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">
                      Subject {index + 1}:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={subject.marks}
                        onChange={(e) => handleInputChange(subject.id, 'marks', e.target.value)}
                        placeholder="Enter marks"
                        className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isCalculated}
                      />
                      <select
                        value={subject.creditHours}
                        onChange={(e) => handleInputChange(subject.id, 'creditHours', e.target.value)}
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isCalculated}
                      >
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 justify-center mt-6">
                <button
                  onClick={resetCalculator}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
                <button
                  onClick={addSubject}
                  disabled={isCalculated}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" /> Add Subject
                </button>
                <button
                  onClick={removeLastSubject}
                  disabled={isCalculated || subjects.length === 1}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Delete Subject
                </button>
                <button
                  onClick={calculateGPA}
                  disabled={isCalculated}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Calculator className="h-4 w-4" /> Calculate GPA
                </button>
              </div>

              {result && (
                <div className={`text-center text-lg font-semibold p-4 rounded ${
                  result.includes('Please') ? 'text-red-500' : 'text-green-600'
                }`}>
                  {result}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    
    </div>
  );
};

export default GPA;