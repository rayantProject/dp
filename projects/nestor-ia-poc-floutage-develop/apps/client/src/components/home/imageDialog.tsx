import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export type HomeImageDialogProps = {
  src: string;
};

export default function HomeImageDialog({ src }: HomeImageDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image src={src} alt="Image" className="rounded-lg" width={400} height={400} />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>photo</DialogTitle>
        </DialogHeader>
        <div>
          <Image src={src} alt="Image" width={800} height={800} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
