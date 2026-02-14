export interface ReceiptItem {
  name: string;
  price: number;
  quantity: number;
  category?: string; // e.g., "dairy", "produce", "meat"
  expiryDays?: number; // estimated days until expiry
}

export interface Receipt {
  id?: string; // Firestore will generate this
  userId: string;
  imageUrl: string; // Firebase Storage URL
  storeName?: string;
  purchaseDate: Date;
  totalAmount: number;
  items: ReceiptItem[];
  currency: string; // e.g., "USD", "MYR"
  createdAt: Date;
  processed: boolean; // Has AI extracted data yet?
}

export interface ReceiptUploadResponse {
  receiptId: string;
  imageUrl: string;
  message: string;
}