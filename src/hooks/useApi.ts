import { useState, useCallback, useEffect } from 'react';

interface UseApiOptions<T> {
    initialData?: T;
    immediate?: boolean;
}

export function useApi<T>(
    url: string,
    options: UseApiOptions<T> = { immediate: true }
) {
    const [data, setData] = useState<T | undefined>(options.initialData);
    const [loading, setLoading] = useState<boolean>(!!options.immediate);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (body?: any, customUrl?: string) => {
        setLoading(true);
        setError(null);
        try {
            const fetchUrl = customUrl || url;
            const fetchOptions: RequestInit = body ? {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            } : { method: 'GET' };

            const response = await fetch(fetchUrl, fetchOptions);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Error: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            setData(result);
            return { data: result, error: null };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error desconocido';
            setError(message);
            return { data: null, error: message };
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        if (options.immediate) {
            execute();
        }
    }, [execute, options.immediate]);

    return { data, loading, error, execute, setData };
}
