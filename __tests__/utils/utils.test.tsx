import {
  filterOrderItemsByStudentId,
  aggregateProductQuantities,
  aggregateParticipantStats,
} from "../../src/utils/helpers/functions";
import {
  OrderItem,
  OrderRecord,
  Product,
  ProductPrice,
  Student,
  GroupOrder,
  ParticipantStats,
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

// Group order mock data
const groupOrders: GroupOrder[] = [
  {
    order_id: 1,
    student_id: "A1",
    role: "Host",
    order_records: orderRecord,
    students: student1,
  },
  {
    order_id: 1,
    student_id: "A2",
    role: "Participant",
    order_records: orderRecord,
    students: student2,
  },
];

// Order items mock data
const orderItems: OrderItem[] = [
  {
    order_id: 1,
    product_id: 1,
    student_id: "A1",
    quantity: 2,
    products: cabbageProduct,
    students: student1,
    order_records: orderRecord,
  },
  {
    order_id: 1,
    product_id: 1,
    student_id: "A2",
    quantity: 5,
    products: cabbageProduct,
    students: student2,
    order_records: orderRecord,
  },
];

describe("filterOrderItemsByStudentId", () => {
  it("should return correct items based on studentId", () => {
    const result = filterOrderItemsByStudentId(orderItems, studentId1);
    expect(result).toHaveLength(1);
    expect(result[0].student_id).toBe(studentId1);
  });
});

describe("aggregateProductQuantities", () => {
  it("should aggregate product quantities and prices correctly", () => {
    const result = aggregateProductQuantities(orderItems);
    expect(result).toHaveLength(1);
    expect(result[0].contributors).toHaveLength(2);
    expect(result[0].total_quantity).toBe(7); // 2 + 3
    expect(result[0].total_price).toBe(6.93); // 5 * 10
  });
});

describe("aggregateParticipantStats", () => {
  it("should aggregate total expenditure for each participant", () => {
    // Call the aggregateParticipantStats function
    const result: ParticipantStats[] = aggregateParticipantStats(
      groupOrders,
      orderItems
    );

    // Assertions
    expect(result).toHaveLength(2);

    // Student A1's total expenditure (2 * 0.99)
    const studentA1Stats = result.find((stats) => stats.student_id === "A1");
    expect(studentA1Stats).toBeDefined();
    expect(studentA1Stats?.total_expenditure).toBeCloseTo(2 * 0.99, 2);

    // Student A2's total expenditure (5 * 0.99)
    const studentA2Stats = result.find((stats) => stats.student_id === "A2");
    expect(studentA2Stats).toBeDefined();
    expect(studentA2Stats?.total_expenditure).toBeCloseTo(5 * 0.99, 2);
  });
});
