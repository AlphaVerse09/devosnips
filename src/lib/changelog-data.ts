
export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const changelogs: ChangelogEntry[] = [
  {
    version: "1.2.0",
    date: "July 26, 2024",
    changes: [
        "Added a changelog dialog to keep you updated with the latest features.",
        "Refined UI elements for a cleaner, more consistent look and feel.",
        "Improved the 'Show More' / 'Show Less' button in the categories list.",
    ],
  },
  {
    version: "1.1.0",
    date: "July 25, 2024",
    changes: [
      "Added official Devicon icons for all programming languages for better recognition.",
      "Implemented a collapsible sidebar to maximize your code viewing area.",
      "Fixed an issue where the main page would crash due to a missing component import.",
    ],
  },
  {
    version: "1.0.0",
    date: "July 24, 2024",
    changes: [
      "Initial release of DevoSnips!",
      "Added core features: Add, Edit, and Delete snippets.",
      "Implemented AI-powered code classification.",
      "Introduced sub-category management for better organization.",
      "Enabled Light and Dark mode themes.",
    ],
  },
];
