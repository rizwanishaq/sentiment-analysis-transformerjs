'use client';
import { useState, useEffect} from 'react';
import { classify } from './actions/classify';
import ClassificationResults from '@/components/ClassificationResults';



// Main component with a refreshed and attractive layout
export default function Home() {
  const [inputText, setInputText] = useState('');  // Store the input text
  const [result, setResult] = useState(null);  // Store classification result
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState(null);  // Error state

  const handleClassify = async (text) => {
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
  }

  // Trigger classification when inputText changes
  useEffect(() => {
    handleClassify(inputText);
  }, [inputText]);

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
            onInput={(e) => setInputText(e.target.value)}  // Trigger the parent function when the input changes
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
            <ClassificationResults result={result} />  // Display classification results
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
