import React, { useState } from 'react';
import Button from './Button';

const Feedback: React.FC = () => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  if (isSubmitted) {
    return <p className="text-green-500">Thank you for your feedback!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">How would you rate your experience?</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`w-10 h-10 rounded-full ${
                rating >= value ? 'bg-yellow-400' : 'bg-gray-200'
              } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="comment" className="block mb-2">Additional comments (optional):</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-luna-500"
          rows={4}
        ></textarea>
      </div>
      <Button type="submit">Submit Feedback</Button>
    </form>
  );
};

export default Feedback;