import { ImageOff } from 'lucide-react';
import clsx from 'clsx';

import HomeImageDialog from './imageDialog';

export type HomeImageRenderProps = {
  src: string | null;
};

export default function HomeImageRender({ src }: HomeImageRenderProps) {
  return (
    <div className={clsx(' flex items-center justify-center p-4 gap-4')}>
      {src ? <HomeImageDialog src={src} /> : <ImageOff size={300} />}
    </div>
  );
}
