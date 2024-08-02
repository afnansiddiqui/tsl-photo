'use client';
import { useEffect, useState } from 'react';

type Comment = {
  id: number;
  content: string;
};

const CommentList = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = async () => {
    try {
      const response = await fetch('/api/comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();

    const intervalId = setInterval(() => {
      fetchComments();
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-2">
          <p>{comment.content}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
