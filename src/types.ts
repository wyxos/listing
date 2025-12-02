export interface ActiveFilter {
    key: string;
    label: string;
    rawValue: string;
    value: string;
}

export interface HarmonieListingResponse<T> {
    listing: {
        items: T[];
        current_page?: number;
        total?: number;
        perPage?: number;
    };
    filters?: ActiveFilter[];
}

export type ErrorHandler = (error: string | null, statusCode?: number) => string | null;
export type FilterValue = string | number | { value: string | number | null | undefined } | null | undefined;

export type DeleteConfig<TItem extends Record<string, unknown>> = {
    key?: string;
    refresh?: boolean;
    onSuccess?: (id: string | number, listing: unknown) => void;
    onError?: (error: unknown, statusCode?: number, listing?: unknown) => void;
};

