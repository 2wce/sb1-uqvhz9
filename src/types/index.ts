export interface Book {
  id: string;
  title: string;
  author: string;
  cover?: string;
  progress: number;
  lastRead?: string;
  file: File;
}