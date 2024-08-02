'use client';
import { useState } from 'react';

export default function PhotoUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const result = await response.json();
        console.log('Photo uploaded successfully:', result);
      } else {
        console.error('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="file"
          accept=".png,.jpeg,.jpg"
          onChange={handleFileChange}
          className="mb-4 border border-gray-600 p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-zinc-900 text-white p-2 rounded w-full hover:bg-zinc-700 transition"
        >
          Upload Photo
        </button>
      </form>
    </div>
  );
}
