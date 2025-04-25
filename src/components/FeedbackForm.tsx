import React, { useState } from 'react';
import { getDatabase, ref, push } from 'firebase/database';
import { db } from '../firebase';
  
const FeedbackForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const db = getDatabase();
      const feedbackRef = ref(db, 'feedback');
      await push(feedbackRef, {
        name,
        email,
        message,
        timestamp: new Date().toISOString(), // Store as ISO string
      });

      setName('');
      setEmail('');
      setMessage('');
      setSubmissionResult('Feedback submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      setSubmissionResult(`Error: ${error.message || 'Failed to submit feedback.'}`);
    } finally {
      setIsSubmitting(false);
    }
  }; 

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-200">Feedback</h2>
      {submissionResult && (
        <p className={`mb-4 ${submissionResult.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
          {submissionResult}
        </p>
      )}
       <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
             className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline h-32"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={isSubmitting} 
          className="bg-blue-700 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;