<script setup lang="ts">
import { X, Loader2 } from 'lucide-vue-next';
import type { Listing } from '../Listing';
import { computed } from 'vue';
import '../styles/variables.css';

interface Props {
    listing: Listing<Record<string, unknown>>;
}

const props = defineProps<Props>();

const isRemovingFilter = computed(() => (key: string) => props.listing.removingFilterKey === key);
const isAnyFilterRemoving = computed(() => props.listing.removingFilterKey !== null);
</script>

<template>
    <div v-if="listing.activeFilters.length > 0" class="vue-listing-active-filters">
        <span class="vue-listing-active-filters-label">Active filters:</span>

        <!-- Custom slot for filter pills -->
        <slot name="filter" v-for="filter in listing.activeFilters" :key="filter.key" :filter="filter"
            :is-removing="isRemovingFilter(filter.key)" :is-any-removing="isAnyFilterRemoving"
            :remove="() => listing.removeFilter(filter.key)" />

        <!-- Custom slot for clear button -->
        <slot name="clear" :is-any-removing="isAnyFilterRemoving" :is-resetting="listing.isResetting"
            :clear="() => listing.resetFilters()" />

        <!-- Default rendering (when no custom slots provided) -->
        <template v-if="!$slots.filter && !$slots.clear">
            <span v-for="filter in listing.activeFilters" :key="filter.key" class="vue-listing-filter-tag">
                <span class="vue-listing-filter-tag-label">{{ filter.label }}</span>
                <span class="vue-listing-filter-tag-value">{{ filter.value }}</span>
                <button type="button" @click="() => listing.removeFilter(filter.key)"
                    :disabled="isRemovingFilter(filter.key) || isAnyFilterRemoving"
                    :aria-label="`Remove ${filter.label} filter`" class="vue-listing-filter-remove">
                    <Loader2 v-if="isRemovingFilter(filter.key)" :size="12" class="vue-listing-spinner" />
                    <X v-else :size="12" />
                </button>
            </span>
            <button type="button" @click="() => listing.resetFilters()"
                :disabled="isAnyFilterRemoving || listing.isResetting" class="vue-listing-filter-clear">
                Clear
            </button>
        </template>
    </div>
</template>

<style scoped>
.vue-listing-active-filters {
    margin-bottom: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
}

.vue-listing-active-filters-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--vue-listing-filter-label-text);
}

.vue-listing-filter-tag {
    display: inline-flex;
    align-items: stretch;
    border-radius: 0.25rem;
    overflow: hidden;
    border: 1px solid var(--vue-listing-filter-border);
}

.vue-listing-filter-tag-label {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    background-color: var(--vue-listing-filter-label-bg);
    color: var(--vue-listing-filter-clear-text);
    transition: background-color 0.2s;
}

.vue-listing-filter-tag-label:hover {
    background-color: var(--vue-listing-filter-label-bg-hover);
}

.vue-listing-filter-tag-value {
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    background-color: var(--vue-listing-filter-value-bg);
    color: var(--vue-listing-filter-value-text);
    border-left: 1px solid var(--vue-listing-filter-border);
    transition: background-color 0.2s;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 16rem;
}

.vue-listing-filter-tag-value:hover {
    background-color: var(--vue-listing-filter-value-bg-hover);
}

.vue-listing-filter-remove {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 700;
    border-left: 1px solid var(--vue-listing-filter-border);
    background-color: transparent;
    color: var(--vue-listing-filter-remove-text);
    border: none;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
}

.vue-listing-filter-remove:hover:not(:disabled) {
    background-color: var(--vue-listing-filter-remove-bg-hover);
    color: var(--vue-listing-filter-remove-text-hover);
}

.vue-listing-filter-remove:disabled {
    opacity: var(--vue-listing-filter-disabled-opacity);
    cursor: not-allowed;
}

.vue-listing-spinner {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.vue-listing-filter-clear {
    display: inline-flex;
    align-items: center;
    border-radius: 0.25rem;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
    font-weight: 500;
    background-color: var(--vue-listing-filter-clear-bg);
    color: var(--vue-listing-filter-clear-text);
    border: 1px solid var(--vue-listing-filter-clear-border);
    cursor: pointer;
    transition: background-color 0.2s;
}

.vue-listing-filter-clear:hover:not(:disabled) {
    background-color: var(--vue-listing-filter-clear-bg-hover);
}

.vue-listing-filter-clear:disabled {
    opacity: var(--vue-listing-filter-disabled-opacity);
    cursor: not-allowed;
}
</style>























