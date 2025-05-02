import React, { useState } from 'react';
import { Check, X, Eye, AlertTriangle, FileSpreadsheet } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const dummyStats = {
    monthlyStats: {
      totalPosts: 45,
      approvedPosts: 32,
      rejectedPosts: 13,
      totalResources: 28,
      approvedResources: 20,
      rejectedResources: 8
    }
  };

  const dummyData = {
    pending: [
      {
        _id: '1',
        title: 'Data Structures Notes',
        type: 'post',
        author: 'John Doe',
        description: 'Complete notes for DS course',
        date: '2024-03-15'
      },
      {
        _id: '2',
        title: 'Database Past Paper 2023',
        type: 'resource',
        author: 'Sarah Smith',
        description: 'Final exam paper',
        date: '2024-03-16'
      }
    ],
    rejected: [
      {
        _id: '3',
        title: 'Physics Study Material',
        type: 'post',
        author: 'Mike Brown',
        description: 'Rejected due to incomplete content',
        date: '2024-03-10',
        rejectionReason: 'Incomplete content'
      }
    ],
    approved: [
      {
        _id: '4',
        title: 'Programming Fundamentals Paper',
        type: 'resource',
        author: 'Emma Wilson',
        description: 'Spring 2023 paper',
        date: '2024-03-05'
      }
    ]
  };

  const MonthlyReport = () => (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Monthly Report (March 2024)</h2>
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded">
          <FileSpreadsheet size={16} />
          Export Report
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Posts</h3>
          <div className="space-y-2">
            <p>Total: {dummyStats.monthlyStats.totalPosts}</p>
            <p className="text-green-600">Approved: {dummyStats.monthlyStats.approvedPosts}</p>
            <p className="text-red-600">Rejected: {dummyStats.monthlyStats.rejectedPosts}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="font-semibold mb-2">Resources</h3>
          <div className="space-y-2">
            <p>Total: {dummyStats.monthlyStats.totalResources}</p>
            <p className="text-green-600">Approved: {dummyStats.monthlyStats.approvedResources}</p>
            <p className="text-red-600">Rejected: {dummyStats.monthlyStats.rejectedResources}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ContentCard = ({ item }) => (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <span className={`px-2 py-1 rounded text-xs ${
              item.type === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
            }`}>
              {item.type}
            </span>
          </div>
          <p className="text-gray-600 text-sm">by {item.author} • {item.date}</p>
          <p className="mt-2">{item.description}</p>
          {item.rejectionReason && (
            <p className="mt-2 text-red-600 text-sm">Rejection reason: {item.rejectionReason}</p>
          )}
        </div>
        {activeTab === 'pending' && (
          <div className="flex gap-2">
            <button className="p-2 bg-green-500 text-white rounded hover:bg-green-600">
              <Check size={16} />
            </button>
            <button className="p-2 bg-red-500 text-white rounded hover:bg-red-600">
              <X size={16} />
            </button>
            <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <Eye size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <MonthlyReport />

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Pending ({dummyData.pending.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded ${activeTab === 'rejected' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Rejected ({dummyData.rejected.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded ${activeTab === 'approved' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Approved ({dummyData.approved.length})
        </button>
      </div>

      <div className="space-y-4">
        {dummyData[activeTab].map(item => (
          <ContentCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;