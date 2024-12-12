import {
  filterOrderItemsByStudentId,
  aggregateProductQuantities,
} from "../../src/utils/helpers/functions";
import {
  OrderItem,
  OrderRecord,
  Product,
  ProductPrice,
  Student,
} from "@/lib/interfaces";

// Sample data for product
const cabbageProduct: Product = {
  id: 1,
  description: "Cabbage Green",
  product_prices: [],
  order_items: [],
};

// Sample data for product prices
const productPrice: ProductPrice = {
  product_id: 1,
  cost: 0.99,
  date: new Date("2024-12-09 01:22:22"),
  remarks: "",
  products: cabbageProduct,
};

const orderRecord: OrderRecord = {
  id: 1,
  host_student_id: "A1",
  type: "Group",
  status: "Open",
  expected_order_date: null,
  order_date: null,
  delivery_date: null,
  created_at: new Date("2024-12-09 01:22:22"),
  description: null,
  group_orders: [],
  order_items: [],
  students: null,
};

cabbageProduct.product_prices.push(productPrice);

const studentId1 = "A1";
const studentId2 = "A2";

const student1: Student = {
  id: studentId1,
  name: "Student 1",
  group_orders: [],
  order_items: [],
  order_records: [],
};

const student2: Student = {
  id: studentId2,
  name: "Student 2",
  group_orders: [],
  order_items: [],
  order_records: [],
};

describe("filterOrderItemsByStudentId", () => {
  it("should return correct items based on studentId", () => {
    const orderItems: OrderItem[] = [
      {
        order_id: 1,
        product_id: 1,
        student_id: studentId1,
        quantity: 1,
        products: cabbageProduct,
        students: student1,
        order_records: orderRecord,
      },
      {
        order_id: 1,
        product_id: 1,
        student_id: studentId2,
        quantity: 1,
        products: cabbageProduct,
        students: student2,
        order_records: orderRecord,
      },
    ];

    const result = filterOrderItemsByStudentId(orderItems, studentId1);
    expect(result).toHaveLength(1);
    expect(result[0].student_id).toBe(studentId1);
  });
});

describe("aggregateProductQuantities", () => {
  it("should aggregate product quantities and prices correctly", () => {
    const orderItems: OrderItem[] = [
      {
        order_id: 1,
        product_id: 1,
        student_id: studentId1,
        quantity: 1,
        products: cabbageProduct,
        students: student1,
        order_records: orderRecord,
      },
      {
        order_id: 1,
        product_id: 1,
        student_id: studentId2,
        quantity: 1,
        products: cabbageProduct,
        students: student2,
        order_records: orderRecord,
      },
    ];

    const result = aggregateProductQuantities(orderItems);
    expect(result).toHaveLength(1);
    expect(result[0].contributors).toHaveLength(2);
    expect(result[0].total_quantity).toBe(2); // 2 + 3
    expect(result[0].total_price).toBe(1.98); // 5 * 10
  });
});
