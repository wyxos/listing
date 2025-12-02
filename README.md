# @wyxos/listing

A Vue 3 composable for managing paginated, filterable data listings with URL synchronization.

## Features

- 🔄 **Automatic URL synchronization** - Filters and pagination sync with URL query parameters
- 🎯 **Type-safe** - Full TypeScript support with generics
- 🔌 **Flexible axios integration** - Use global `window.axios` or pass your own instance
- 🎨 **Vue 3 reactive** - Built with Vue 3's reactivity system
- 🔍 **Advanced filtering** - Support for multiple filter types with visibility control
- 📄 **Pagination** - Built-in pagination with backend support
- 🗑️ **Item deletion** - Easy item deletion with callbacks
- ✅ **Well tested** - Comprehensive test coverage

## Installation

```bash
npm install @wyxos/listing
```

### Peer Dependencies

This package requires:
- `vue` ^3.5.0
- `axios` ^1.11.0
- `lucide-vue-next` ^0.554.0 (for ActiveFilters component icons)

Optional dependencies:
- `@oruga-ui/oruga-next` (only needed for ListingTable component)

Make sure these are installed in your project:

```bash
npm install vue axios lucide-vue-next

# Optional: For ListingTable component
npm install @oruga-ui/oruga-next
```

## Quick Start

```typescript
import { Listing, ListingTable, ActiveFilters } from '@wyxos/listing';
import { useRouter } from 'vue-router';
import axios from 'axios';
import '@wyxos/listing/src/styles/variables.css';

const router = useRouter();

// Create a listing instance
const listing = Listing.create<YourItemType>({
    filters: {
        search: '',
        status: 'all',
    },
    axios: axios, // Optional: pass axios instance, or use window.axios
});

// Configure the listing
listing
    .path('/api/items')
    .router(router);

// Load data
await listing.get();
```

### Using Default Export

```typescript
import VueListing from '@wyxos/listing';

const listing = VueListing.Listing.create<YourItemType>({
    filters: { search: '' },
});
```

## Basic Usage

### Creating a Listing

```typescript
import { Listing } from '@wyxos/listing';

interface User {
    id: number;
    name: string;
    email: string;
}

// Option 1: Using the factory method (recommended)
const listing = Listing.create<User>({
    filters: {
        search: '',
        status: 'all',
    },
});

// Option 2: Using the constructor
const listing = new Listing<User>();
listing.parameters({
    search: '',
    status: 'all',
});
```

### Configuring Axios

The package supports multiple ways to provide an axios instance:

```typescript
// Option 1: Pass via factory method
const listing = Listing.create({
    axios: axiosInstance,
});

// Option 2: Use the axios() method
listing.axios(axiosInstance);

// Option 3: Use global window.axios (default fallback)
// Just make sure window.axios is set globally in your app
```

### Setting Up Filters

```typescript
// Using the new parameters() API (recommended)
const listing = Listing.create<User>({
    filters: {
        search: '',
        date_from: '',
        date_to: '',
        status: 'all',
    },
});

// Set default values
listing.defaults({
    search: '',
    status: 'all',
});

// Access filters reactively
listing.filters.search = 'John';
listing.filters.status = 'active';
```

### Loading Data

```typescript
// Basic usage
await listing.get();

// With path override
await listing.get('/api/users');

// With additional parameters
await listing.get('/api/users', {
    params: { custom: 'value' },
});

// With query sync
await listing.get('/api/users', {
    query: route.query, // Sync from Vue Router
});
```

### URL Synchronization

```typescript
import { useRouter } from 'vue-router';

const router = useRouter();

listing
    .path('/api/users')
    .router(router);

// Filters and pagination automatically sync with URL
// ?search=john&status=active&page=2
```

### Pagination

```typescript
// Navigate to a specific page
await listing.goToPage(2);

// Change items per page
await listing.goToPage(1, 25);

// Access pagination data
console.log(listing.currentPage); // 1
console.log(listing.perPage); // 15
console.log(listing.total); // 100
```

### Filtering

```typescript
// Reset all filters
await listing.resetFilters();

// Remove a specific filter
await listing.removeFilter('search');

// Apply filters (goes to page 1)
await listing.applyFilters();

// Check if filters are active
if (listing.hasActiveFilters) {
    console.log('Filters are active');
}

// Access active filters
listing.activeFilters.forEach(filter => {
    console.log(`${filter.label}: ${filter.value}`);
});
```

### Deleting Items

```typescript
// Delete with path and ID
await listing.delete('/api/users/1', 1);

// Delete with config object
await listing.delete({
    id: 1,
    key: 'id', // optional, defaults to 'id'
    refresh: true, // optional, defaults to true
    onSuccess: (id, listing) => {
        console.log('Deleted:', id);
    },
    onError: (error, statusCode, listing) => {
        console.error('Delete failed:', error);
    },
});

// Delete using configured path
listing.path('/api/users');
await listing.delete({ id: 1 });
```

### Error Handling

```typescript
listing.onLoadError((error, statusCode) => {
    if (statusCode === 403) {
        return 'You do not have permission to access this resource.';
    }
    return error || 'An error occurred';
});

// Access error state
if (listing.error) {
    console.error(listing.error);
}
```

### Filter Visibility

```typescript
// Hide a filter
listing.hideFilter('search');

// Show a filter
listing.showFilter('search');

// Toggle filter visibility
listing.toggleFilter('search');

// Check if filter is visible
if (listing.isFilterVisible('search')) {
    // ...
}

// Get visible filters
const visible = listing.visibleFilters; // ['status', 'date_from']
```

## Advanced Usage

### Custom Query Parameters Builder

```typescript
listing.queryParameters(() => {
    return {
        page: String(listing.currentPage),
        // Custom logic here
    };
});
```

### Using with Vue Router

```typescript
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Watch for route changes
watch(() => route.query, async (newQuery) => {
    await listing.get({ query: newQuery });
}, { deep: true });
```

### Legacy Filter Refs API

For compatibility with existing code, you can use the legacy `filterRefs()` API:

```typescript
const searchRef = ref('');
const statusRef = ref('all');

listing.filterRefs({
    search: searchRef,
    status: statusRef,
}).defaults({
    search: '',
    status: 'all',
});
```

### Table Configuration

Get configuration for table components (e.g., Oruga):

```typescript
const tableConfig = listing.config();
// Returns: { data, loading, paginated, perPage, currentPage, total, ... }

// Use with v-bind
<o-table v-bind="listing.config()" />
```

## API Reference

### Listing Class

#### Static Methods

##### `Listing.create<T>(options?)`

Factory method to create a reactive Listing instance.

**Parameters:**
- `options.filters?` - Initial filter values
- `options.axios?` - Axios instance to use

**Returns:** Reactive Listing instance with Proxy support for filter access

#### Instance Methods

##### `path(path: string): this`

Set the API endpoint path.

##### `router(router: RouterInstance): this`

Set the Vue Router instance for URL synchronization.

##### `axios(axios: AxiosInstance): this`

Set the axios instance to use for HTTP requests.

##### `parameters(filters: Record<string, string | number | null>): this`

Initialize filter state (new API, recommended).

##### `filterRefs(filters: Record<string, FilterValue>): this`

Define filters using external refs (legacy API).

##### `defaults(defaults: Record<string, string | number | null>): this`

Set default values for filters.

##### `get(pathOrConfig?, config?): Promise<void>`

Load data from the API. Supports multiple signatures:
- `get()` - Uses configured path
- `get(path)` - Uses provided path
- `get(path, config)` - Uses provided path with config
- `get(config)` - Uses configured path with config

##### `delete(pathOrConfig, idOrConfig?, config?): Promise<void>`

Delete an item. Supports multiple signatures:
- `delete(path, id)`
- `delete(path, config)`
- `delete(config)`

##### `goToPage(page: number, perPage?: number, autoLoad?: boolean): Promise<void>`

Navigate to a specific page.

##### `resetFilters(): Promise<void>`

Reset all filters to their default values.

##### `removeFilter(filterKey: string): Promise<void>`

Remove/reset a specific filter.

##### `applyFilters(): Promise<void>`

Apply current filters (goes to page 1).

##### `onLoadError(handler: ErrorHandler): this`

Set custom error handler.

##### `config(): TableConfig`

Get table configuration object.

#### Instance Properties

- `data: T[]` - Array of items
- `isLoading: boolean` - Initial loading state
- `isUpdating: boolean` - Update loading state
- `isFiltering: boolean` - Filter application state
- `isResetting: boolean` - Filter reset state
- `removingFilterKey: string | null` - Currently removing filter key
- `error: string | null` - Error message
- `currentPage: number` - Current page number
- `perPage: number` - Items per page
- `total: number` - Total number of items
- `activeFilters: ActiveFilter[]` - Array of active filters
- `filters: Record<string, string | number | null>` - Filter values
- `hasActiveFilters: boolean` - Whether any filters are active
- `visibleFilters: string[]` - Array of visible filter keys

## Type Definitions

```typescript
interface ActiveFilter {
    key: string;
    label: string;
    rawValue: string;
    value: string;
}

interface HarmonieListingResponse<T> {
    listing: {
        items: T[];
        current_page?: number;
        total?: number;
        perPage?: number;
    };
    filters?: ActiveFilter[];
}
```

## Components

The package includes two Vue components to help you build listing UIs quickly.

### ActiveFilters Component

Displays active filters with the ability to remove individual filters or clear all.

```vue
<script setup lang="ts">
import { Listing, ActiveFilters } from '@wyxos/listing';

const listing = Listing.create<User>({
    filters: { search: '', status: 'all' },
});
</script>

<template>
    <ActiveFilters :listing="listing" />
</template>
```

**Props:**
- `listing: Listing<T>` - The listing instance

**Features:**
- Shows all active filters as removable tags
- Individual filter removal
- Clear all filters button
- Loading states during filter removal
- Customizable via CSS variables

### ListingTable Component

A table component that integrates with Oruga UI. **Requires `@oruga-ui/oruga-next` to be installed and registered with your Vue app.**

```vue
<script setup lang="ts">
import { Listing, ListingTable } from '@wyxos/listing';
import Oruga from '@oruga-ui/oruga-next';

// Register Oruga with your app
app.use(Oruga);

const listing = Listing.create<User>({
    filters: { search: '' },
});
listing.path('/api/users');
</script>

<template>
    <ListingTable :listing="listing">
        <o-table-column field="id" label="ID" />
        <o-table-column field="name" label="Name" />
        <o-table-column field="email" label="Email" />
    </ListingTable>
</template>
```

**Props:**
- `listing: Listing<T>` - The listing instance
- `class?: string` - Additional CSS classes

**Slots:**
- Default slot - Table columns (o-table-column components)
- `empty` - Content to show when no data is available

**Note:** If Oruga UI is not installed or registered, the component will display a helpful error message. You can also use `listing.config()` to get table configuration for your own table component.

### Using Components Together

```vue
<script setup lang="ts">
import { Listing, ListingTable, ActiveFilters } from '@wyxos/listing';
import { useRouter } from 'vue-router';

const router = useRouter();
const listing = Listing.create<File>({
    filters: {
        search: '',
        date_from: '',
        date_to: '',
    },
});

listing
    .path('/api/files')
    .router(router);

onMounted(() => {
    listing.get();
});
</script>

<template>
    <div>
        <ActiveFilters :listing="listing" />
        
        <ListingTable :listing="listing">
            <o-table-column field="id" label="ID" />
            <o-table-column field="filename" label="Filename" />
            <o-table-column field="size" label="Size" />
        </ListingTable>
    </div>
</template>
```

## Styling

### CSS Variables

The `ActiveFilters` component uses CSS variables for easy customization. Import the variables file in your application:

```css
@import '@wyxos/listing/src/styles/variables.css';
```

Or if using a bundler that supports CSS imports:

```typescript
import '@wyxos/listing/src/styles/variables.css';
```

### Customizing Colors

Override CSS variables in your application's stylesheet:

```css
:root {
    /* Filter tag label colors */
    --vue-listing-filter-label-text: #ffffff;
    --vue-listing-filter-label-bg: #3b82f6;
    --vue-listing-filter-label-bg-hover: #2563eb;
    
    /* Filter tag value colors */
    --vue-listing-filter-value-text: #f3f4f6;
    --vue-listing-filter-value-bg: #1f2937;
    --vue-listing-filter-value-bg-hover: #374151;
    
    /* Border colors */
    --vue-listing-filter-border: #3b82f6;
    
    /* Remove button colors */
    --vue-listing-filter-remove-text: #9ca3af;
    --vue-listing-filter-remove-text-hover: #f3f4f6;
    --vue-listing-filter-remove-bg-hover: rgba(59, 130, 246, 0.4);
    
    /* Clear button colors */
    --vue-listing-filter-clear-bg: #dc2626;
    --vue-listing-filter-clear-bg-hover: #b91c1c;
    --vue-listing-filter-clear-border: #ef4444;
    --vue-listing-filter-clear-text: #ffffff;
    
    /* Disabled state */
    --vue-listing-filter-disabled-opacity: 0.5;
}
```

### Available CSS Variables

All CSS variables are prefixed with `--vue-listing-`:

- `--vue-listing-filter-label-text` - Filter label text color
- `--vue-listing-filter-label-bg` - Filter label background
- `--vue-listing-filter-label-bg-hover` - Filter label hover background
- `--vue-listing-filter-value-text` - Filter value text color
- `--vue-listing-filter-value-bg` - Filter value background
- `--vue-listing-filter-value-bg-hover` - Filter value hover background
- `--vue-listing-filter-border` - Filter tag border color
- `--vue-listing-filter-remove-text` - Remove button text color
- `--vue-listing-filter-remove-text-hover` - Remove button hover text color
- `--vue-listing-filter-remove-bg-hover` - Remove button hover background
- `--vue-listing-filter-clear-bg` - Clear button background
- `--vue-listing-filter-clear-bg-hover` - Clear button hover background
- `--vue-listing-filter-clear-border` - Clear button border color
- `--vue-listing-filter-clear-text` - Clear button text color
- `--vue-listing-filter-disabled-opacity` - Disabled state opacity

## Migration Guide

### From Local Implementation

If you're migrating from a local `Listing.ts` file:

1. Install the package:
   ```bash
   npm install @wyxos/listing
   ```

2. Update imports:
   ```typescript
   // Before
   import { Listing } from '../lib/Listing';
   
   // After
   import { Listing } from '@wyxos/listing';
   ```

3. Configure axios (if needed):
   ```typescript
   // If you were using window.axios, it still works
   // Or explicitly configure:
   listing.axios(axiosInstance);
   ```

4. Everything else should work the same!

## License

MIT

