'use client';
import Image from 'next/image';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';

type Comment = {
  id: number;
  content: string;
};

type Photo = {
  id: number;
  url: string;
  comments: Comment[];
};

const PhotoList = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newComments, setNewComments] = useState<Record<number, string>>({});

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/photos');
      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const intervalId = setInterval(fetchPhotos, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const handleCommentChange = (photoId: number, event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewComments({
      ...newComments,
      [photoId]: event.target.value,
    });
  };

  const handleCommentSubmit = async (event: FormEvent, photoId: number) => {
    event.preventDefault();
    const content = newComments[photoId];
    try {
      await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, photoId }),
      });
      setNewComments({
        ...newComments,
        [photoId]: '',
      });
      fetchPhotos();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl w-full">
        {photos.map((photo) => (
          <div key={photo.id} className="relative rounded-lg overflow-hidden  shadow-lg">
            <Image
              src={photo.url}
              alt="Photo"
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              {photo.comments.map((comment) => (
                <div key={comment.id} className="mb-2 p-2 bg-gray-700 rounded text-white">
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => handleCommentSubmit(e, photo.id)}
              className="p-4 "
            >
              <textarea
                value={newComments[photo.id] || ''}
                onChange={(e) => handleCommentChange(photo.id, e)}
                rows={2}
                className="w-full border border-gray-600 p-2 rounded bg-gray-900 text-white"
                placeholder="Write a comment..."
              />
              <button
                type="submit"
                className="mt-2 bg-zinc-900 text-white p-2 rounded hover:bg-zinc-700 transition"
              >
                Post Comment
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoList;
