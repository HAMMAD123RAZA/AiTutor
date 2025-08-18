'use client'
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label, dataType }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-bold text-gray-800 mb-2">
          {dataType === 'courses' ? 'Course' : 'Call'} Details
        </p>
        {/* Show Firebase Document ID */}
        {item._id && (
          <p className="text-sm text-blue-600 mb-1">
            <span className="font-medium">Doc ID:</span> {item._id}
          </p>
        )}
        {item.createdAt && (
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Date:</span> {new Date(item.createdAt.seconds * 1000).toLocaleString()}
          </p>
        )}
        {item.prompt || 'Agent_Call' && (
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Name:</span> {item.prompt || 'Agent_Call'}
          </p>
        )}
        <p className="text-sm text-green-600">
          <span className="font-medium">Count:</span> {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const UsageChart = ({ data, dataType, title }) => {
  // Transform the data to show individual documents
  const transformData = (rawData) => {
    if (!Array.isArray(rawData)) return [];
    
    return rawData
      .filter(item => item.createdAt)
      .map((item, index) => ({
        ...item,
        date: new Date(item.createdAt.seconds * 1000).toLocaleDateString(),
        timestamp: new Date(item.createdAt.seconds * 1000).getTime(),
        // Create a count value for the bar height (you can adjust this logic)
        count: 1, // Each document represents 1 occurrence
        // If you have a duration field, use it, otherwise default to 1
        value: item.duration || item.count || 1,
        index: index + 1 // Sequential numbering
      }))
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((item, index) => ({
        ...item,
        displayIndex: index + 1 // For X-axis display
      }));
  };

  const chartData = transformData(data);

  return (
    <div className="w-full h-[400px] mb-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="displayIndex" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `#${value}`}
            label={{  position: 'insideBottom', offset: -5 }}
          />
          <YAxis 
            label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            content={<CustomTooltip dataType={dataType} />}
            cursor={{ fill: 'rgba(0,0,0,0.1)' }}
          />
          <Legend />
          <Bar 
            dataKey="value" 
            name={dataType === 'courses' ? 'Course Entries' : 'Call Entries'} 
            fill={dataType === 'courses' ? '#171A1D' : '#585B3F'} // Bright blue for courses, green for calls
            stroke={dataType === 'courses' ? '#1E40AF' : '#047857'} // Darker border
            strokeWidth={1}
            radius={[4, 4, 0, 0]} // Rounded top corners
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;