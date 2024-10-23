import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Book } from '@/types';

const dummyBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    progress: 45,
    lastRead: new Date().toISOString(),
    file: new File([], 'dummy.epub'),
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80',
    progress: 78,
    lastRead: new Date().toISOString(),
    file: new File([], 'dummy.epub'),
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    cover: 'https://images.unsplash.com/photo-1543166356-6a2bc9c6d53a?w=800&q=80',
    progress: 23,
    lastRead: new Date().toISOString(),
    file: new File([], 'dummy.epub'),
  },
  {
    id: '4',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    progress: 0,
    file: new File([], 'dummy.epub'),
  },
  {
    id: '5',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&q=80',
    progress: 92,
    lastRead: new Date().toISOString(),
    file: new File([], 'dummy.epub'),
  },
];

interface BookState {
  books: Book[];
  currentBook: Book | null;
  readingStreak: number;
  lastReadDate: string | null;
  addBook: (book: Book) => void;
  setCurrentBook: (book: Book) => void;
  updateReadingProgress: (bookId: string, progress: number) => void;
  updateStreak: () => void;
}

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      books: dummyBooks,
      currentBook: null,
      readingStreak: 7,
      lastReadDate: new Date().toISOString(),

      addBook: (book) =>
        set((state) => ({
          books: [...state.books, book],
        })),

      setCurrentBook: (book) =>
        set({
          currentBook: book,
        }),

      updateReadingProgress: (bookId, progress) =>
        set((state) => ({
          books: state.books.map((book) =>
            book.id === bookId ? { ...book, progress } : book
          ),
        })),

      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastReadDate, readingStreak } = get();

        if (!lastReadDate) {
          set({ readingStreak: 1, lastReadDate: today });
          return;
        }

        const lastRead = new Date(lastReadDate);
        const currentDate = new Date(today);
        const diffDays = Math.floor(
          (currentDate.getTime() - lastRead.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
          set({
            readingStreak: readingStreak + 1,
            lastReadDate: today,
          });
        } else if (diffDays > 1) {
          set({
            readingStreak: 1,
            lastReadDate: today,
          });
        }
      },
    }),
    {
      name: 'book-storage',
    }
  )
);