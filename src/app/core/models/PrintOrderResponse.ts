export interface PrintOrderResponse {
  orderId: number;
  number: number;
  printType: string;
  paperType: string;
  coverType: string;
  fasteningType: string;
  isLaminated: boolean;
  price: number;
  registrationDate?: string; 
  completionDate?: string; 
  customer?: CustomerResponse;
  employee?: EmployeeResponse;
  orderStatus?: OrderStatusResponse;
}

export interface CustomerResponse {
  customerId: number;
  name: string;
}

export interface EmployeeResponse {
  employeeId: number;
  name: string;
}

export interface OrderStatusResponse {
  orderStatusId: number;
  name: string;
}