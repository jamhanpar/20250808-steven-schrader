"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                Oops!
              </h1>
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">
                Something went wrong
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                We&apos;re sorry, but something unexpected happened. Our team
                has been notified and is working on it.
              </p>
            </div>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg text-left">
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-red-800 dark:text-red-400 mb-2">
                    Error Details (Development Only)
                  </summary>
                  <pre className="text-red-700 dark:text-red-300 whitespace-pre-wrap break-words text-xs">
                    {error.message}
                    {error.digest && `\nDigest: ${error.digest}`}
                  </pre>
                </details>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button
                onClick={() => reset()}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-lg text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors duration-200 shadow-md hover:shadow-lg"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go Home
              </button>
            </div>

            {/* Footer */}
            <div className="mt-12 text-sm text-slate-500 dark:text-slate-400">
              If this problem persists, please contact support.
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
