import {
  OrderItem,
  AggregatedProduct,
  GroupOrder,
  ParticipantStats,
} from "@/lib/interfaces";

export function filterOrderItemsByStudentId(
  orderItems: OrderItem[],
  studentId: string
): OrderItem[] {
  return orderItems.filter((item) => item.student_id === studentId);
}

export function aggregateProductQuantities(
  orderItems: OrderItem[]
): AggregatedProduct[] {
  const productMap: Map<
    number,
    {
      description: string;
      total_quantity: number;
      total_price: number;
      contributors: Set<string>; // A Set to avoid duplicate contributors
    }
  > = new Map();

  orderItems.forEach((item) => {
    const { product_id, products, quantity, students } = item;
    const { description } = products;
    const cost = products.product_prices[0]?.cost || 0;

    // If product already exists in the map, accumulate values
    if (productMap.has(product_id)) {
      const product = productMap.get(product_id)!;
      product.total_quantity += quantity;
      product.total_price += cost * quantity;
      product.contributors.add(students.name); // Add contributor (student name) to the set
    } else {
      // If product doesn't exist, create a new entry
      productMap.set(product_id, {
        description,
        total_quantity: quantity,
        total_price: cost * quantity,
        contributors: new Set([students.name]), // Add first contributor
      });
    }
  });

  // Convert map to an array of AggregatedProduct objects
  const result: AggregatedProduct[] = [];
  productMap.forEach((value, key) => {
    result.push({
      product_id: key,
      description: value.description,
      total_quantity: value.total_quantity,
      total_price: value.total_price,
      contributors: Array.from(value.contributors), // Convert Set to Array
    });
  });

  return result;
}

export function formatDate(date: string | Date | undefined): string {
  if (!date) return ""; // Handle if the date is undefined or null
  const parsedDate = new Date(date);
  return parsedDate.toLocaleDateString("en-GB"); // 'en-GB' formats date as DD/MM/YYYY
}

export function aggregateParticipantStats(
  groupOrders: GroupOrder[],
  orderItems: OrderItem[]
): ParticipantStats[] {
  const statsMap: Map<string, ParticipantStats> = new Map();

  groupOrders.forEach((record) => {
    const studentId = record.student_id;
    statsMap.set(studentId, {
      student_id: studentId,
      name: record.students.name,
      total_expenditure: 0,
    });
  });

  orderItems.forEach((item) => {
    const { student_id, quantity } = item;
    const productPrice = item.products.product_prices[0]; // Assuming the latest price is the first entry

    if (productPrice) {
      const price = productPrice.cost;
      const expenditure = price * quantity;

      // If the student already exists in the map, update their stats
      if (statsMap.has(student_id)) {
        const existingStats = statsMap.get(student_id)!;
        existingStats.total_expenditure += expenditure;
      } else {
        // If the student is not yet in the map, create a new entry
        const studentName = item.students.name;
        statsMap.set(student_id, {
          student_id,
          name: studentName,
          total_expenditure: expenditure,
        });
      }
    }
  });

  const result: ParticipantStats[] = [];
  statsMap.forEach((value, key) => {
    result.push({
      student_id: key,
      name: value.name,
      total_expenditure: value.total_expenditure,
    });
  });

  // Convert the map to an array and return it
  return result;
}
