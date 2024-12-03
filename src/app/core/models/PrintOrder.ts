export interface PrintOrder {
  orderId: number;
  number: number;
  printType: string;
  paperType: string;
  coverType: string;
  fasteningType: string;
  isLaminated: boolean;
  price: number;
  orderStatusId: number;
  registrationDate: string | null;
  completionDate: string | null;
  customerId: number;
  employeeId: number;
  createDateTime: string | null;
  updateDateTime: string | null;
  customerName?: string;
  employeeName?: string;
}
