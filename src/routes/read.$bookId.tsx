import { FileRoute } from '@tanstack/react-router';
import { Reader } from '@/components/reader';

export const Route = new FileRoute('/read/$bookId').createRoute({
  component: Reader,
});