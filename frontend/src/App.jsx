import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen.js';

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultErrorComponent: ({ error }) => (
    <div className="glass p-12 text-center">
      <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-destructive)' }}>Something went wrong</h2>
      <p style={{ color: 'var(--color-muted)' }}>{error.message}</p>
    </div>
  ),
});
