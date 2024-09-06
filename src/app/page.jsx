'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { classify } from './actions/classify';
import debounce from 'lodash.debounce'; // Add lodash.debounce for debouncing

// Component for displaying the classification result with styling and emojis
const ClassificationResult = ({ result }) => {
  const getEmoji = useCallback((label) => {
    switch (label?.toUpperCase()) {
      case 'POSITIVE':
        return '😊';
      case 'NEGATIVE':
        return '😢';
      case 'NEUTRAL':
        return '😐';
      default:
        return '🤔';
    }
  }, []);

  const renderedResult = useMemo(() => {
    if (!result) return null;
    return (
      <div className="text-center p-6 bg-white shadow-xl rounded-lg border-t-4 border-indigo-500">
        <p className="text-xl font-bold text-gray-700">Classification Result:</p>
        <p className="text-6xl mt-3">{getEmoji(result.label)}</p>
        <p className="text-lg font-semibold mt-2">
          {result.label} ({(result.score * 100).toFixed(2)}%)
        </p>
      </div>
    );
  }, [result, getEmoji]);

  return renderedResult;
};

// Main component with a refreshed and attractive layout
export default function Home() {
  const [inputText, setInputText] = useState('');  // Store the input text
  const [result, setResult] = useState(null);  // Store classification result
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state

  // Debounce the classification function to avoid frequent API calls
  const handleClassify = useCallback(debounce(async (text) => {
    if (!text) {
      setResult(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await classify(`${encodeURIComponent(text)}`);
      
      if (response.error) {
        setError(response.error);
      } else {
        setResult(response.result[0]);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, 500), []); // Adjust debounce delay as needed

  // Trigger classification when inputText changes
  useEffect(() => {
    handleClassify(inputText);
  }, [inputText, handleClassify]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-r from-indigo-300 to-purple-400 p-12">
      <h2 className="text-2xl text-white mb-8 text-center font-semibold drop-shadow-lg">
        Sentiment Classification
      </h2>

      <form className="w-full max-w-xs space-y-6">
        {/* Text input */}
        <div className="w-full max-w-xs mb-6">
          <input
            type="text"
            className="w-full p-4 border-2 border-indigo-400 rounded-lg shadow-lg focus:outline-none focus:border-indigo-600 transition duration-300"
            placeholder="Enter text here to analyze sentiment"
            onChange={(e) => setInputText(e.target.value)}  // Trigger the parent function when the input changes
            value={inputText}
          />
        </div>

        {/* Smooth transitions for loading and result display */}
        <div className="transition-opacity duration-300 ease-in-out">
          {loading ? (
            <div className="text-center">
              <p className="text-indigo-600 text-3xl font-bold">🔄 Analyzing...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600 text-xl font-bold">{error}</p>
            </div>
          ) : result ? (
            <ClassificationResult result={result} />
          ) : (
            <div className="text-center">
              <p className="text-white text-lg font-light">Start typing to classify text.</p>
            </div>
          )}
        </div>
      </form>
    </main>
  );
}
