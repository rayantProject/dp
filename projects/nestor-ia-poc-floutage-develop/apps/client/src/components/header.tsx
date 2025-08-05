'use client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PanelLeft } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import clsx from 'clsx';
import { useApiUrl } from '@/hooks/use-api-url';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { open, setOpen } = useSidebar();
  const { detectApiUrl, setDetectApiApiUrl, predictApiUrl, setPredictApiUrl } = useApiUrl();

  const pathname = usePathname();

  return (
    <header className="bg-accent p-4 fixed top-0 z-10 w-full">
      <div className="flex items-center justify-between w-full">nestor.ai</div>
      <div className="flex items-center">
        <Button
          variant="outline"
          size={'icon'}
          onClick={() => setOpen(!open)}
          className={clsx(open && 'bg-teal-800 text-white')}
        >
          <PanelLeft />
        </Button>

        <Input
          className="ml-4"
          placeholder="Search"
          type="text"
          onChange={(e) => {
            if (pathname === '/detect') {
              setDetectApiApiUrl(e.currentTarget.value);
            } else {
              setPredictApiUrl(e.currentTarget.value);
            }
          }}
          value={pathname === '/detect' ? detectApiUrl : predictApiUrl}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (pathname === '/detect') {
                setDetectApiApiUrl(e.currentTarget.value);
              } else {
                setPredictApiUrl(e.currentTarget.value);
              }
              e.currentTarget.blur();
            }
          }}
        />
      </div>
    </header>
  );
}
