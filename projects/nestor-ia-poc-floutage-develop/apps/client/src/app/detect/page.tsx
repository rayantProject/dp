'use client';
import DetectImageRender from '@/components/detect/imageRender';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useApiUrl } from '@/hooks/use-api-url';

export default function Home() {
  const [src, setSrc] = useState<File | null>(null);
  const { detectApiUrl } = useApiUrl();
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSrc(file);
    }
  };

  const handleUpload = async () => {
    if (!src) return;

    const formData = new FormData();
    formData.append('image', src);

    try {
      const response = await fetch(detectApiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Erreur lors de la requête');

      const blob = await response.blob();
      setSrc(new File([blob], 'result.png', { type: blob.type }));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <main className="w-full h-full pt-23">
      <div className="w-full  p-4">
        <div className="rounded-lg shadow-lg flex items-center justify-between p-4 gap-4">
          <Input type="file" placeholder="Upload Image" accept="image/*" onChange={handleFileChange} />
          <Button className="bg-teal-800 text-white hover:bg-teal-700" onClick={handleUpload}>
            Detect
          </Button>
        </div>
        <DetectImageRender src={src ? URL.createObjectURL(src) : null} />
      </div>
    </main>
  );
}
