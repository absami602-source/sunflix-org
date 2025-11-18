import React from 'react';

export default class ErrorBoundary extends React.Component<any, any> {
  // explicitly declare fields so TypeScript recognizes them
  state: { hasError: boolean; error: any };
  props: any;

  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background text-foreground">
          <div className="max-w-3xl w-full bg-red-50 rounded-lg border border-red-200 p-6">
            <h2 className="text-xl font-semibold text-red-700">An error occurred</h2>
            <pre className="whitespace-pre-wrap mt-3 text-sm text-red-800">{String(this.state.error)}</pre>
            <p className="mt-4 text-sm text-red-700">Check the browser console for more details.</p>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}
