/** Voluntary giving — amounts are in Naira (NGN). */
export const supportConfig = {
  currency: "NGN" as const,
  currencySymbol: "₦",
  /** TODO(content): suggested amounts once agreed by Adore. Empty = custom amount only. */
  presetAmounts: [] as number[],
  minAmount: 100,
  maxAmount: 10_000_000,
};

/** Bank-transfer details as shown to visitors. Values come from server env — see src/server/giving.ts. */
export interface TransferDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
}
