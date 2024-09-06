import React from 'react';

// Emoji map for easier future extension or modification
const emojiMap = {
  POSITIVE: '😊',
  NEGATIVE: '😢',
  NEUTRAL: '😐'
};

const ClassificationResults = ({ result }) => {
  // Default emoji if label is not in emojiMap
  const getEmoji = (label) => emojiMap[label?.toUpperCase()] || '🤔';

  const { label, score } = result;

  return (
    <div className="text-center p-6 bg-white shadow-xl rounded-lg border-t-4 border-indigo-500">
      <p className="text-xl font-bold text-gray-700">Classification Result:</p>
      <p className="text-6xl mt-3">{getEmoji(label)}</p>
      <p className="text-lg font-semibold mt-2">
        {label} ({(score * 100).toFixed(2)}%)
      </p>
    </div>
  );
};

export default ClassificationResults;
