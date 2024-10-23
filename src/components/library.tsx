import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useDropzone } from 'react-dropzone';
import { Book, BookOpen, Flame } from 'lucide-react';
import { useBookStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function Library() {
  const navigate = useNavigate();
  const { books, readingStreak, addBook } = useBookStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        if (file.type !== 'application/epub+zip') {
          toast.error('Only EPUB files are supported');
          return;
        }

        const book = {
          id: crypto.randomUUID(),
          title: file.name.replace('.epub', ''),
          author: 'Unknown',
          progress: 0,
          file,
        };

        addBook(book);
        toast.success('Book added successfully');
      });
    },
    [addBook]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/epub+zip': ['.epub'],
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Library</h1>
        <div className="flex items-center gap-2 bg-orange-500/10 text-orange-500 px-4 py-2 rounded-full">
          <Flame className="h-5 w-5" />
          <span className="font-semibold">{readingStreak} day streak</span>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 mb-12 text-center ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-border'
        }`}
      >
        <input {...getInputProps()} />
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          {isDragActive
            ? 'Drop the EPUB file here...'
            : 'Drag and drop an EPUB file here, or click to select one'}
        </p>
      </div>

      {books.length === 0 ? (
        <div className="text-center text-muted-foreground">
          <Book className="h-12 w-12 mx-auto mb-4" />
          <p>No books in your library yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
          {books.map((book) => (
            <div
              key={book.id}
              className="group cursor-pointer"
              onClick={() => navigate({ to: '/read/$bookId', params: { bookId: book.id } })}
            >
              <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden shadow-lg transition-transform duration-200 group-hover:scale-105 group-hover:shadow-xl">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Book className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {book.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-medium leading-tight">{book.title}</h3>
                <p className="text-sm text-muted-foreground">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}