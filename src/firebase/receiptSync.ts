import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  getDocs,
} from 'firebase/firestore';
import { db } from './config';
import { handleFirestoreError, OperationType } from './errorHandler';
import { ReceiptRecord } from '../types/ledger';

/**
 * Save or update a single receipt in Firestore
 */
export async function saveReceiptToFirestore(userId: string, receipt: ReceiptRecord): Promise<void> {
  const path = `users/${userId}/receipts`;
  try {
    const docRef = doc(db, path, receipt.id);
    await setDoc(docRef, {
      ...receipt,
      userId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${path}/${receipt.id}`);
  }
}

/**
 * Delete a receipt from Firestore
 */
export async function deleteReceiptFromFirestore(userId: string, receiptId: string): Promise<void> {
  const path = `users/${userId}/receipts/${receiptId}`;
  try {
    const docRef = doc(db, `users/${userId}/receipts`, receiptId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Sync entire local ledger array to Firestore
 */
export async function syncAllReceiptsToFirestore(userId: string, receipts: ReceiptRecord[]): Promise<void> {
  for (const receipt of receipts) {
    await saveReceiptToFirestore(userId, receipt);
  }
}

/**
 * Subscribe to real-time updates of the user's receipts
 */
export function subscribeToUserReceipts(
  userId: string,
  onUpdate: (receipts: ReceiptRecord[]) => void
): () => void {
  const path = `users/${userId}/receipts`;
  const q = query(collection(db, path));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const records: ReceiptRecord[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as ReceiptRecord;
        records.push({
          ...data,
          id: d.id,
        });
      });
      if (records.length > 0) {
        onUpdate(records);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );

  return unsubscribe;
}
