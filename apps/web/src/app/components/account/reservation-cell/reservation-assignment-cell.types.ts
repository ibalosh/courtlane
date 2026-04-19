export type CustomerSearchResult = {
  email: string | null;
  id: number;
  name: string;
};

export type ReservationStatus = 'free' | 'reserved';

export type ReservationAssignmentCellProps = {
  customerEmail: string | null;
  customerName: string | null;
  dayLabel: string;
  isSaving?: boolean;
  onSubmit: (
    customer: CustomerSearchResult | null,
    customerName: string | null,
  ) => Promise<void> | void;
  status: ReservationStatus;
};
