import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import clsx from 'clsx';

export type HomeImageRenderProps = {
  src: string | null;
};

export default function DetectImageRender({ src }: HomeImageRenderProps) {
  return (
    <div className={clsx(' flex justify-center p-4  w-full')}>
      {src ? (
        <Image src={src} alt="Uploaded Image" className="rounded-lg object-cover" width={900} height={900} />
      ) : (
        <ImageOff size={300} />
      )}
    </div>
  );
}
