import { FileRoute } from '@tanstack/react-router';
import { Library } from '@/components/library';

export const Route = new FileRoute('/').createRoute({
  component: Library,
});