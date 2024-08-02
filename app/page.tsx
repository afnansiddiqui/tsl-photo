import PhotoList from '@/components/PhotoList';
import PhotoUpload from '@/components/PhotoUpload';

import { LampDemo } from '@/components/ui/lamp';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <LampDemo className="absolute inset-0 -z-10" />
      <div className="relative z-10 text-white min-h-screen p-6 flex flex-col items-center">
        <div className="max-w-4xl w-full mt-20"> 
          <PhotoUpload />
          <PhotoList />
        </div>
      </div>
    </div>
  );
}
