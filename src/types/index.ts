
export type SnippetCategory = 'HTML' | 'CSS' | 'JavaScript' | 'Python' | 'SQL' | 'React' | 'TypeScript' | 'C#' | 'Java' | 'Go' | 'PHP' | 'C++' | 'Kotlin' | 'Rust' | 'Swift' | 'Angular' | 'Vue' | 'Other';

export interface Snippet {
  id: string;
  title: string;
  description?: string;
  code: string;
  category: SnippetCategory;
  subCategoryName?: string;
  createdAt: string; 
  updatedAt: string; 
}

export interface UserSubCategory {
  id: string;
  name: string;
  parentCategory: SnippetCategory;
  createdAt: string;
}

// For storing various user-specific counts
export interface UserCounts {
  snippetCount: number;
  // We can add more counts here later, e.g.,
  // subCategory_HTML_Count?: number;
  // subCategory_CSS_Count?: number;
}

// --- Changelog Types ---

// The data structure for a changelog entry fetched from Firestore
export interface ChangelogEntry {
  id: string;
  version: string;
  date: string; // Stored as YYYY-MM-DD string
  changes: string[];
}

// The data structure used when writing to Firestore (before conversion)
export interface ChangelogEntryData {
  version: string;
  date: string; // YYYY-MM-DD string
  changes: string[];
}
