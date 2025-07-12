
// This file is no longer used for displaying changelogs as they are now fetched from Firestore.
// It is kept to avoid breaking any imports, but its content can be considered deprecated.
// All changelog management is now handled dynamically in `src/components/layout/changelog-dialog.tsx`.

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const changelogs: ChangelogEntry[] = [];
