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
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-8 text-center bg-white rounded-[32px] border border-silver-accent shadow-premium my-8">
                    <h2 className="text-2xl font-black text-midnight-blue mb-4">Ups! Algo salió mal.</h2>
                    <p className="text-steel-gray mb-6">Estamos teniendo dificultades para cargar esta sección. Por favor, intenta recargar la página.</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="btn-premium bg-midnight-blue text-white px-6 py-3"
                    >
                        Reintentar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
