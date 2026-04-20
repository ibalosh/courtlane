import { isRouteErrorResponse } from 'react-router-dom';

type RouteErrorDetailsOptions = {
  fallbackDescription: string;
  unexpectedDescription: string;
  unexpectedTitle: string;
};

export function getRouteErrorDetails(error: unknown, options: RouteErrorDetailsOptions) {
  // Route responses come from React Router for loader/action/render failures with HTTP-like metadata.
  if (isRouteErrorResponse(error)) {
    return {
      description:
        typeof error.data === 'string' && error.data.trim().length > 0 ? error.data : options.fallbackDescription,
      status: error.status,
      title: error.statusText || 'Something went wrong',
    };
  }

  // Everything else is treated as a generic application error and normalized to a 500 response shape.
  return {
    description: error instanceof Error && error.message ? error.message : options.unexpectedDescription,
    status: 500,
    title: options.unexpectedTitle,
  };
}
