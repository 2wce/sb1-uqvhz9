import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Book as EpubBook } from 'epubjs';
import { ArrowLeft, Settings2 } from 'lucide-react';
import { useBookStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';

export function Reader() {
  const navigate = useNavigate();
  const { bookId } = useParams({ from: '/read/$bookId' });
  const { books, updateReadingProgress, updateStreak } = useBookStore();
  const book = books.find((b) => b.id === bookId);
  const [fontSize, setFontSize] = useState(16);
  const viewerRef = useRef<HTMLDivElement>(null);
  const epubRef = useRef<EpubBook | null>(null);

  useEffect(() => {
    if (!book || !viewerRef.current) return;

    const setupReader = async () => {
      const epub = new EpubBook(book.file);
      await epub.ready;

      epub.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
      });

      epubRef.current = epub;

      // Load the last reading position
      if (book.progress > 0) {
        const locations = await epub.locations.generate();
        const location = Math.floor((book.progress / 100) * locations.length);
        epub.display(locations[location]);
      }

      epub.on('relocated', (location) => {
        const progress = Math.floor((location.start.percentage || 0) * 100);
        updateReadingProgress(book.id, progress);
        updateStreak();
      });
    };

    setupReader();

    return () => {
      epubRef.current?.destroy();
    };
  }, [book, updateReadingProgress, updateStreak]);

  useEffect(() => {
    if (!epubRef.current) return;

    epubRef.current.rendition.themes.fontSize(`${fontSize}px`);
  }, [fontSize]);

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/' })}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold">{book.title}</h1>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </div>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings2 className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Reading Settings</SheetTitle>
            </SheetHeader>
            <div className="py-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Font Size</label>
                  <Slider
                    min={12}
                    max={24}
                    step={1}
                    value={[fontSize]}
                    onValueChange={([value]) => setFontSize(value)}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      <main className="flex-1 overflow-hidden">
        <div ref={viewerRef} className="h-full" />
      </main>
    </div>
  );
}