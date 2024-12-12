export interface Student {
  id: string;
  name: string;
  group_orders: GroupOrder[];
  order_items: OrderItem[];
  order_records: OrderRecord[];
}

export interface Product {
  id: number;
  description: string;
  order_items: OrderItem[];
  product_prices: ProductPrice[];
}

export interface ProductPrice {
  product_id: number;
  cost: number;
  date: Date;
  remarks: string;
  products: Product;
}

export interface OrderRecord {
  id: number;
  host_student_id: string | null; // Adjusted to allow null
  type: string;
  status: string;
  expected_order_date: Date | null;
  order_date: Date | null;
  delivery_date: Date | null;
  created_at: Date;
  description: string | null;
  group_orders: GroupOrder[];
  order_items: OrderItem[];
  students: Student | null; // Adjusted to allow null
}

export interface GroupOrder {
  order_id: number;
  student_id: string;
  role: string;
  order_records: OrderRecord;
  students: Student;
}

export interface OrderItem {
  order_id: number;
  product_id: number;
  student_id: string;
  quantity: number;
  order_records: OrderRecord;
  products: Product;
  students: Student;
}

export interface AggregatedProduct {
  product_id: number;
  description: string;
  total_quantity: number;
  total_price: number;
  contributors: string[]; // List of student names or IDs
}

export interface ParticipantStats {
  student_id: string;
  name: string;
  total_expenditure: number;
}
