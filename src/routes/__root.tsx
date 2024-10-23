import { FileRoute, Outlet } from '@tanstack/react-router';

export const Route = new FileRoute('/__root').createRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Outlet />
    </div>
  );
}