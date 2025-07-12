
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
  writeBatch,
  getDoc,
  runTransaction,
  increment,
  collectionGroup,
} from 'firebase/firestore';
import type { Snippet, SnippetCategory, UserSubCategory, UserCounts, ChangelogEntry, ChangelogEntryData } from '@/types';
import { db } from './config';
import type { SnippetFormValues } from '@/components/snippets/snippet-form-dialog';
import type { ChangelogFormValues } from '@/components/layout/changelog-form-dialog';


export const MAX_SNIPPETS_PER_USER = 40; // Define the general limit
export const ADMIN_MAX_SNIPPETS = 75; // Define the admin limit

// --- Admin Configuration ---
// Add your Firebase User IDs here to grant admin privileges.
export const ADMIN_USER_IDS = ['vfGb4jXfBsZA79t3QFk2nScFmw92', '1q1p9vFHNmdbQ63xJXf6Glb0z5E3']; 
// -------------------------

// Custom error for snippet limit
export class SnippetLimitError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SnippetLimitError";
  }
}

// Firestore data converter for Snippet
const snippetConverter = {
  toFirestore: (snippetData: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'> & { createdAt?: Timestamp, updatedAt?: Timestamp }) => {
    return {
      ...snippetData,
      subCategoryName: snippetData.subCategoryName || null,
      updatedAt: serverTimestamp(),
      ...(snippetData.createdAt === undefined && { createdAt: serverTimestamp() }),
    };
  },
  fromFirestore: (snapshot: any, options: any): Snippet => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      description: data.description || '',
      code: data.code,
      category: data.category,
      subCategoryName: data.subCategoryName || undefined,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    };
  },
};

// Firestore data converter for UserSubCategory
const userSubCategoryConverter = {
  toFirestore: (subCategoryData: Omit<UserSubCategory, 'id' | 'createdAt'> & { createdAt?: Timestamp }) => {
    return {
      ...subCategoryData,
      createdAt: subCategoryData.createdAt || serverTimestamp(),
    };
  },
  fromFirestore: (snapshot: any, options: any): UserSubCategory => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      parentCategory: data.parentCategory,
      createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
    };
  },
};

// User Counts converter
const userCountsConverter = {
  toFirestore: (counts: Partial<UserCounts>) => {
    return counts;
  },
  fromFirestore: (snapshot: any, options: any): UserCounts => {
    const data = snapshot.data(options);
    return {
      snippetCount: data.snippetCount || 0,
    };
  }
};

// Changelog converter
const changelogConverter = {
  toFirestore: (data: ChangelogEntryData) => {
    return {
      ...data,
      // Convert date string back to Firestore Timestamp for storing
      date: Timestamp.fromDate(new Date(data.date)),
    };
  },
  fromFirestore: (snapshot: any, options: any): ChangelogEntry => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      version: data.version,
      // Convert Firestore Timestamp to a simple date string (e.g., "YYYY-MM-DD")
      date: (data.date as Timestamp).toDate().toISOString().split('T')[0],
      changes: data.changes,
    };
  },
};

const getSnippetsCollection = (userId: string) => {
  return collection(db, 'users', userId, 'snippets').withConverter(snippetConverter);
};

const getDefinedSubCategoriesCollection = (userId: string) => {
  return collection(db, 'users', userId, 'definedSubCategories').withConverter(userSubCategoryConverter);
};

const getUserCountsDocRef = (userId: string) => {
  return doc(db, 'users', userId, 'metadata', 'counts').withConverter(userCountsConverter);
};

const getChangelogsCollection = () => {
  return collection(db, 'changelogs').withConverter(changelogConverter);
};


export async function addSnippetToFirestore(
  userId: string,
  data: SnippetFormValues,
  category: SnippetCategory,
  subCategoryName?: string
): Promise<Snippet> {
  const snippetsCol = getSnippetsCollection(userId);
  const userCountsRef = getUserCountsDocRef(userId);
  const newSnippetRef = doc(snippetsCol); 
  const isAdmin = ADMIN_USER_IDS.includes(userId);

  await runTransaction(db, async (transaction) => {
    // READ operation: Get the current snippet count
    const countsDoc = await transaction.get(userCountsRef);
    const currentSnippetCount = countsDoc.data()?.snippetCount || 0;

    const applicableLimit = isAdmin ? ADMIN_MAX_SNIPPETS : MAX_SNIPPETS_PER_USER;

    if (currentSnippetCount >= applicableLimit) {
      throw new SnippetLimitError(`You have reached the maximum limit of ${applicableLimit} snippets.`);
    }
    
    // WRITE operation: Set the new snippet document
    transaction.set(newSnippetRef, { 
      title: data.title,
      description: data.description || '',
      code: data.code,
      category,
      subCategoryName: subCategoryName, // Converter handles undefined -> null
      // createdAt and updatedAt will be handled by the converter
    });
    
    // WRITE operation: Update or set the snippet count
    if (countsDoc.exists()) {
      transaction.update(userCountsRef, { snippetCount: increment(1) });
    } else {
      transaction.set(userCountsRef, { snippetCount: 1 });
    }
  });

  // For returning the full Snippet object client-side immediately (timestamps are estimates)
  const now = new Date();
  return { 
    id: newSnippetRef.id,
    ...data, // title, description, code from form
    category,
    subCategoryName,
    createdAt: now.toISOString(), 
    updatedAt: now.toISOString(), 
  };
}

export async function getSnippetsFromFirestore(userId: string): Promise<Snippet[]> {
  if (!userId) return [];
  const snippetsCol = getSnippetsCollection(userId);
  const q = query(snippetsCol, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

export async function updateSnippetInFirestore(
  userId: string,
  snippetId: string,
  data: SnippetFormValues,
  category: SnippetCategory,
  subCategoryName?: string // This can be undefined
): Promise<void> {
  const snippetDoc = doc(db, 'users', userId, 'snippets', snippetId); // Don't use .withConverter here if not using its toFirestore for updates
  await updateDoc(snippetDoc, {
    title: data.title,
    description: data.description || '',
    code: data.code,
    category,
    subCategoryName: subCategoryName === undefined ? null : subCategoryName, // Ensure undefined becomes null
    updatedAt: serverTimestamp(), // Explicitly set updatedAt
  });
}

export async function deleteSnippetFromFirestore(userId: string, snippetId: string): Promise<void> {
  const snippetDocRef = doc(db, 'users', userId, 'snippets', snippetId);
  const userCountsRef = getUserCountsDocRef(userId);

  await runTransaction(db, async (transaction) => {
    const countsDoc = await transaction.get(userCountsRef);

    transaction.delete(snippetDocRef);
    
    if (countsDoc.exists() && (countsDoc.data()?.snippetCount || 0) > 0) {
      transaction.update(userCountsRef, { snippetCount: increment(-1) });
    } else if (countsDoc.exists()) {
      // If count is 0 or less, ensure it doesn't go negative; set to 0.
      transaction.update(userCountsRef, { snippetCount: 0 });
    }
    // If countsDoc doesn't exist, count is effectively 0, so no decrement needed.
  });
}


export async function addUserSubCategory(
  userId: string,
  name: string,
  parentCategory: SnippetCategory
): Promise<UserSubCategory> {
  const subCategoriesCol = getDefinedSubCategoriesCollection(userId);
  
  const q = query(subCategoriesCol, where("name", "==", name), where("parentCategory", "==", parentCategory));
  const existingDocs = await getDocs(q);
  if (!existingDocs.empty) {
     const existingDoc = existingDocs.docs[0];
     const existingData = existingDoc.data();
     return { 
       id: existingDoc.id, 
       name: existingData.name,
       parentCategory: existingData.parentCategory,
       createdAt: existingData.createdAt || new Date().toISOString() 
     };
  }

  const docRef = await addDoc(subCategoriesCol, {
    name,
    parentCategory,
    // createdAt will be set by the converter's serverTimestamp
  });

  return {
    id: docRef.id,
    name,
    parentCategory,
    createdAt: new Date().toISOString(), // Approximate, actual is serverTimestamp
  };
}


export async function getUserSubCategories(
  userId: string,
  parentCategory?: SnippetCategory
): Promise<UserSubCategory[]> {
  if (!userId) return [];
  const subCategoriesCol = getDefinedSubCategoriesCollection(userId);
  let q;
  if (parentCategory) {
    q = query(subCategoriesCol, where('parentCategory', '==', parentCategory), orderBy('name', 'asc'));
  } else {
    q = query(subCategoriesCol, orderBy('parentCategory', 'asc'), orderBy('name', 'asc'));
  }
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}

export async function deleteUserSubCategory(
  userId: string,
  subCategoryIdToDelete: string,
  parentCategory: SnippetCategory,
  subCategoryNameToClear: string
): Promise<void> {
  const subCategoryDocRef = doc(db, 'users', userId, 'definedSubCategories', subCategoryIdToDelete);
  const snippetsColRef = getSnippetsCollection(userId); // Use the raw collection ref for querying

  const batch = writeBatch(db);
  batch.delete(subCategoryDocRef);

  const snippetsToUpdateQuery = query(
    collection(db, 'users', userId, 'snippets'), // Query the raw collection for updates
    where('category', '==', parentCategory),
    where('subCategoryName', '==', subCategoryNameToClear)
  );

  const snippetsSnapshot = await getDocs(snippetsToUpdateQuery);
  snippetsSnapshot.forEach(snippetDocSnapshot => {
    const snippetRef = doc(db, 'users', userId, 'snippets', snippetDocSnapshot.id);
    batch.update(snippetRef, { subCategoryName: null, updatedAt: serverTimestamp() });
  });

  await batch.commit();
}


export async function getCurrentSnippetCount(userId: string): Promise<number> {
  if (!userId) return 0;
  const userCountsRef = getUserCountsDocRef(userId);
  try {
    const countsDoc = await getDoc(userCountsRef);
    return countsDoc.data()?.snippetCount || 0;
  } catch (error) {
    console.error("Error fetching snippet count:", error);
    return 0; // Return 0 or handle error as appropriate
  }
}

// --- Changelog Functions ---

export async function getChangelogs(): Promise<ChangelogEntry[]> {
  const changelogsCol = getChangelogsCollection();
  // Order by version string in descending order. Firestore handles semantic version strings well.
  const q = query(changelogsCol, orderBy('version', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data());
}

export async function addChangelog(data: ChangelogFormValues): Promise<void> {
  const changelogsCol = getChangelogsCollection();
  await addDoc(changelogsCol, {
    version: data.version,
    date: data.date.toISOString().split('T')[0], // Store as YYYY-MM-DD
    changes: data.changes.map(c => c.value),
  });
}

export async function updateChangelog(id: string, data: ChangelogFormValues): Promise<void> {
  const changelogDoc = doc(db, 'changelogs', id).withConverter(changelogConverter);
  await updateDoc(changelogDoc, {
    version: data.version,
    date: data.date.toISOString().split('T')[0], // Store as YYYY-MM-DD
    changes: data.changes.map(c => c.value),
  });
}

export async function deleteChangelog(id: string): Promise<void> {
  const changelogDoc = doc(db, 'changelogs', id);
  await deleteDoc(changelogDoc);
}
