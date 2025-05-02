import React, { useState } from 'react';
import { Calculator, Plus, RotateCcw, Trash2, Info } from 'lucide-react';

const GPA = () => {
  const [subjects, setSubjects] = useState([
    { id: 1, marks: '', creditHours: '2' }
  ]);
  const [totalCreditHours, setTotalCreditHours] = useState('');
  const [result, setResult] = useState('');
  const [isCalculated, setIsCalculated] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                GPA Calculator UOS
              </h2>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="flex items-center gap-2 text-[#C84C32] hover:text-[#B33D25] transition-colors"
              >
                <Info className="w-5 h-5" />
                <span className="text-sm font-medium">Grading System</span>
              </button>
            </div>

            {showInfo && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold mb-2">Grading System:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>80-100: 4.00 GPA</li>
                  <li>65-79: 3.00-3.99 GPA</li>
                  <li>50-64: 2.00-2.99 GPA</li>
                  <li>40-49: 1.00-1.99 GPA</li>
                  <li>Below 40: 0.00 GPA</li>
                </ul>
              </div>
            )}

            <p className="text-gray-600 mb-6 text-center sm:text-left">
              Enter your marks and credit hours for each subject to calculate your semester GPA.
            </p>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Credit Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={totalCreditHours}
                    onChange={(e) => setTotalCreditHours(e.target.value)}
                    placeholder="Enter total credit hours"
                    disabled={isCalculated}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Subject {index + 1} Marks
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={subject.marks}
                          onChange={(e) => handleInputChange(subject.id, 'marks', e.target.value)}
                          placeholder="Enter marks (0-100)"
                          disabled={isCalculated}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors"
                        />
                      </div>
                      <div className="w-full sm:w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Credit Hours
                        </label>
                        <select
                          value={subject.creditHours}
                          onChange={(e) => handleInputChange(subject.id, 'creditHours', e.target.value)}
                          disabled={isCalculated}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#C84C32] focus:border-transparent transition-colors"
                        >
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                <button
                  onClick={resetCalculator}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
                <button
                  onClick={addSubject}
                  disabled={isCalculated}
                  className="flex items-center gap-2 px-4 py-2 bg-[#C84C32] text-white rounded-md hover:bg-[#B33D25] transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Add Subject
                </button>
                <button
                  onClick={removeLastSubject}
                  disabled={isCalculated || subjects.length === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Subject
                </button>
                <button
                  onClick={calculateGPA}
                  disabled={isCalculated}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Calculator className="w-4 h-4" />
                  Calculate GPA
                </button>
              </div>

              {result && (
                <div className={`mt-6 p-4 rounded-lg text-center ${
                  result.includes('Please') 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-green-50 text-green-600'
                }`}>
                  <p className="text-lg font-semibold">{result}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPA;