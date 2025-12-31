// App.js
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import HomePage from './pages/Home';
import RootLayout from './pages/Root';

// Lazy load pages
const BlogPage = lazy(() => import('./pages/Blog'));
const PostPage = lazy(() => import('./pages/Post'));

// Error fallback component
const ErrorFallback = () => <p>Something went wrong while loading this page.</p>;

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'posts',
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<p>Loading posts...</p>}>
                <BlogPage />
              </Suspense>
            ),
            loader: () =>
              import('./pages/Blog').then((module) => module.loader()),
            errorElement: <ErrorFallback />,
          },
          {
            path: ':id',
            element: (
              <Suspense fallback={<p>Loading post...</p>}>
                <PostPage />
              </Suspense>
            ),
            loader: (args) =>
              import('./pages/Post').then((module) => module.loader(args)),
            errorElement: <ErrorFallback />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
