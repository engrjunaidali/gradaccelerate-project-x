// Shared Types across all modules

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export type ViewType = 'grid' | 'list'
export type SortField = 'created_at' | 'updated_at' | 'title'
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
