<script setup lang="ts">
import type { Listing } from '../Listing';

interface Props {
    listing: Listing<Record<string, unknown>>;
    class?: string;
}

const props = withDefaults(defineProps<Props>(), {
    class: '',
});

function handlePageChange(page: number): void {
    props.listing.goToPage(page);
}
</script>

<template>
    <!-- 
        Note: This component requires @oruga-ui/oruga-next to be installed
        and registered with your Vue app. If Oruga is not available, 
        use listing.config() to get table configuration for your own table component.
    -->
    <o-table
        v-bind="listing.config()"
        @page-change="handlePageChange"
        :class="['rounded-lg', props.class]"
    >
        <slot />
        <template #empty>
            <slot name="empty" />
        </template>
    </o-table>
</template>

