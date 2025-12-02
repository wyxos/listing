export { Listing } from './Listing';
export type {
    ActiveFilter,
    HarmonieListingResponse,
    ErrorHandler,
    FilterValue,
    DeleteConfig,
} from './types';

// Export components
export { ListingTable, ActiveFilters } from './components';

// Default export with all exports
import { Listing } from './Listing';
import { ListingTable, ActiveFilters } from './components';
import type {
    ActiveFilter,
    HarmonieListingResponse,
    ErrorHandler,
    FilterValue,
    DeleteConfig,
} from './types';

const VueListing = {
    Listing,
    ListingTable,
    ActiveFilters,
};

export default VueListing;

