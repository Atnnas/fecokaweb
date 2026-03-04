'use client';

import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
        // Persist error for the render method to avoid generic [object Event]
        (this.state as any).errorDetails = error.message || String(error);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-8 text-center bg-white rounded-[32px] border border-red-200 shadow-premium my-8">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    </div>
                    <h2 className="text-2xl font-black text-midnight-blue mb-4">Ups! Algo salió mal.</h2>
                    <p className="text-steel-gray mb-2">Estamos teniendo dificultades para cargar esta sección.</p>
                    {(this.state as any).errorDetails && (
                        <p className="text-[10px] font-mono text-red-400 mb-6 bg-red-50 p-2 rounded overflow-hidden text-ellipsis">
                            Detalles: {(this.state as any).errorDetails}
                        </p>
                    )}
                    <button
                        onClick={() => {
                            this.setState({ hasError: false });
                            window.location.reload();
                        }}
                        className="bg-midnight-blue text-white px-8 py-3 font-bold hover:bg-crimson-red transition-colors shadow-lg"
                    >
                        Recargar Sitio
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
