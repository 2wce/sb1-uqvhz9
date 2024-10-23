import { Route as rootRoute } from './routes/__root';
import { Route as IndexRoute } from './routes/index';
import { Route as ReadRoute } from './routes/read.$bookId';

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      parentRoute: typeof rootRoute;
    };
    '/read/$bookId': {
      parentRoute: typeof rootRoute;
    };
  }
}

Object.assign(IndexRoute.options, {
  path: '/',
  getParentRoute: () => rootRoute,
});

Object.assign(ReadRoute.options, {
  path: '/read/$bookId',
  getParentRoute: () => rootRoute,
});

export const routeTree = rootRoute.addChildren([IndexRoute, ReadRoute]);