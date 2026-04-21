import * as XLSX from "xlsx";

export function exportBookingsToExcel(bookings) {
  const data = bookings.map((b) => ({
    "Delivery Time": b.order.deliveryTime,
    Customer: b.customer.name,
    "Order Type": b.order.orderType,
    Product: b.product?.productName || "—",
    "Total Amount": b.payment.total,
    Payment: b.payment.method,
    "Delivery Date": b.order.deliveryDate,
    Location: b.order.address || "—",
    Contact: b.customer.contacts?.join(", ") || "—",
    Facebook: b.customer.facebookProfile || "—",
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

  XLSX.writeFile(workbook, "bookings-report.xlsx");
}
