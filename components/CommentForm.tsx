'use client';
import { useState } from 'react';

export default function CommentForm() {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="w-full border p-2"
        placeholder="Write a comment..."
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}
