import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  AlignmentType,
  PageOrientation,
  VerticalAlign,
  PageBreak,
} from "docx";
import { saveAs } from "file-saver";

// ── CONSTANTS ─────────────────────────────────────────────────────
// A4 Landscape: page width = 15840 DXA
// Margins: left 720 + right 720 = 1440
// Content width = 15840 - 1440 = 14400 DXA
const TABLE_WIDTH = 14400;

const COL_WIDTHS = [
  800, // Delivery Time
  800, // Customer
  800, // Order Type
  7600, // Order Details 👈 increased
  1000, // Total Amount
  900, // Process Time
  900, // Location
  900, // Contact
  400, // Payment
  300, // Rider
];

const HEADERS = [
  "Delivery Time",
  "Customer",
  "Order Type",
  "Order Details",
  "Total Amount",
  "Process Time",
  "Location",
  "Contact",
  "Payment",
  "Rider",
];

// ── FONT SIZES (half-points: 24 = 12pt) ──────────────────────────
const SZ = {
  label: 18, // was 22 → smaller text in details
  body: 20, // was 26 → main text smaller
  bold: 22, // was 28
  time: 24, // was 32
  header: 20, // was 24
  title: 34, // was 40
};

// ── BORDER HELPERS ────────────────────────────────────────────────
const border = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

// ── CELL FACTORY ──────────────────────────────────────────────────
function makeCell(children, colIndex, options = {}) {
  return new TableCell({
    borders,
    width: { size: COL_WIDTHS[colIndex], type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    verticalAlign: VerticalAlign.CENTER,
    shading: options.shading || undefined,
    children,
  });
}

// ── TEXT RUN FACTORY ──────────────────────────────────────────────
function run(text, opts = {}) {
  return new TextRun({
    text: text || "—",
    font: "Arial",
    size: opts.size ?? SZ.body,
    bold: opts.bold ?? false,
    color: opts.color ?? "000000",
  });
}

// ── PROCESS TIME HELPER ───────────────────────────────────────────
function getProcessTime(deliveryTime) {
  if (!deliveryTime) return "—";
  try {
    const [time, meridiem] = deliveryTime.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    hours -= 5;
    if (hours < 0) hours += 24;
    const period = hours >= 12 ? "PM" : "AM";
    const display = hours % 12 === 0 ? 12 : hours % 12;
    return `${display}:${String(minutes).padStart(2, "0")} ${period}`;
  } catch {
    return "—";
  }
}

// ── FORMAT CURRENCY ───────────────────────────────────────────────
function fmt(n) {
  return "₱" + Number(n).toLocaleString("en-PH", { minimumFractionDigits: 2 });
}

// ── HEADER ROW ────────────────────────────────────────────────────
function buildHeaderRow() {
  return new TableRow({
    tableHeader: true,
    children: HEADERS.map(
      (label, i) =>
        new TableCell({
          borders,
          width: { size: COL_WIDTHS[i], type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          shading: { fill: "DC2626", type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: label,
                  bold: true,
                  color: "FFFFFF",
                  size: SZ.header,
                  font: "Arial",
                }),
              ],
            }),
          ],
        }),
    ),
  });
}

// ── ORDER DETAILS CELL ────────────────────────────────────────────
// All info on as few lines as possible to keep rows compact
function buildOrderDetailsCell(booking) {
  const paragraphs = [];

  // Product name — bold, slightly larger
  paragraphs.push(
    new Paragraph({
      children: [
        run(booking.productName || "—", { bold: true, size: SZ.bold }),
      ],
      spacing: { after: 30 },
    }),
  );

  // Included dishes — label + all dishes on ONE line
  const required = booking.dishes?.required?.filter(Boolean) || [];
  if (required.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          run(`DISHES (${required.length}): `, {
            size: SZ.label,
            color: "888888",
            bold: true,
          }),
          run(required.join(" · "), { size: SZ.label, color: "333333" }),
        ],
        spacing: { after: 20 },
      }),
    );
  }

  // Extra dishes — label + all on ONE line
  const extra = booking.dishes?.extra?.filter(Boolean) || [];
  if (extra.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          run(`EXTRA (${extra.length}×₱700): `, {
            size: SZ.label,
            color: "DC2626",
            bold: true,
          }),
          run(extra.join(" · "), { size: SZ.label, color: "333333" }),
        ],
        spacing: { after: 20 },
      }),
    );
  }

  // Freebies — label + all on ONE line
  const freebies = booking.freebies?.freebies?.filter(Boolean) || [];
  if (freebies.length > 0) {
    paragraphs.push(
      new Paragraph({
        children: [
          run("FREEBIES: ", { size: SZ.label, color: "16A34A", bold: true }),
          run(freebies.join(" · "), { size: SZ.label, color: "333333" }),
        ],
        spacing: { after: 0 },
      }),
    );
  }

  return makeCell(paragraphs, 3);
}

// ── LOCATION CELL ─────────────────────────────────────────────────
function buildLocationCell(booking) {
  if (booking.orderType !== "delivery") {
    return makeCell(
      [
        new Paragraph({
          children: [
            run("Pickup", { bold: true, color: "D97706", size: SZ.body }),
          ],
        }),
      ],
      6,
    );
  }
  const paragraphs = [
    new Paragraph({
      children: [run(booking.zone || "—", { bold: true, size: SZ.body })],
      spacing: { after: 30 },
    }),
  ];
  if (booking.address) {
    paragraphs.push(
      new Paragraph({ children: [run(booking.address, { size: SZ.label })] }),
    );
  }
  return makeCell(paragraphs, 6);
}

// ── DATA ROW ──────────────────────────────────────────────────────
function buildDataRow(booking) {
  const processTime = getProcessTime(booking.deliveryTime);
  const discount = Math.abs(Number(booking.promoAmount || 0));


  const totalParagraphs = [
    new Paragraph({
      children: [run(fmt(booking.totalAmount), { bold: true, size: SZ.bold })],
    }),
  ];
  if (discount > 0) {
    totalParagraphs.push(
      new Paragraph({
        children: [
          run(`-${fmt(discount)}`, { size: SZ.label, color: "16A34A" }),
        ],
      }),
    );
  }

  return new TableRow({
    children: [
      makeCell(
        [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              run(booking.deliveryTime || "—", {
                bold: true,
                size: SZ.time,
                color: "DC2626",
              }),
            ],
          }),
        ],
        0,
      ),
      makeCell(
        [
          new Paragraph({
            alignment: AlignmentType.CENTER, // 👈 THIS
            children: [
              run(booking.customerName || "—", {
                bold: true,
                size: SZ.bold,
              }),
            ],
          }),
        ],
        1,
      ),
      makeCell(
        [
          new Paragraph({
            children: [
              run(booking.orderType === "delivery" ? "Delivery" : "Pickup", {
                size: SZ.body,
              }),
            ],
          }),
        ],
        2,
      ),
      buildOrderDetailsCell(booking),
      makeCell(totalParagraphs, 4),
      makeCell(
        [
          new Paragraph({
            children: [
              run(processTime, { bold: true, size: SZ.time, color: "DC2626" }),
            ],
          }),
        ],
        5,
      ),
      buildLocationCell(booking),
      makeCell(
        [
          new Paragraph({
            children: [
              run(booking.contacts?.filter(Boolean).join(", ") || "—", {
                size: SZ.body,
              }),
            ],
          }),
        ],
        7,
      ),
      makeCell(
        [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              run(booking.paymentMethod === "gcash" ? "GCash" : "COD", {
                bold: true,
                size: SZ.body,
              }),
            ],
          }),
        ],
        8,
      ),
      makeCell([new Paragraph({ children: [run("", { size: SZ.body })] })], 9),
    ],
  });
}

// ── CHUNK ARRAY ───────────────────────────────────────────────────
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ── TITLE BLOCK ───────────────────────────────────────────────────
function buildTitleParagraphs(date, isContinued) {
  const paragraphs = [];

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "JOJO'S LECHON",
          bold: true,
          size: SZ.title,
          font: "Arial",
          color: "DC2626",
        }),
        ...(isContinued
          ? [
              new TextRun({
                text: "  (continued)",
                size: 22,
                font: "Arial",
                color: "888888",
              }),
            ]
          : []),
      ],
      spacing: { after: 40 },
    }),
  );

  if (!isContinued) {
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Master Order Log",
            size: 22,
            font: "Arial",
            color: "555555",
          }),
        ],
        spacing: { after: 30 },
      }),
    );
  }

  paragraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Delivery Date: ${date}`,
          size: 22,
          bold: true,
          font: "Arial",
        }),
        new TextRun({
          text: `     Generated: ${new Date().toLocaleDateString("en-PH")}`,
          size: 20,
          font: "Arial",
          color: "888888",
        }),
      ],
      spacing: { after: 140 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: "DC2626",
          space: 1,
        },
      },
    }),
  );

  return paragraphs;
}

// ── MAIN EXPORT ───────────────────────────────────────────────────
export async function generateOrderDoc(bookings, date) {
  const grandTotal = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const children = [];

  // ── TITLE (ONLY ONCE) ─────────────────────────────
  buildTitleParagraphs(date, false).forEach((p) => children.push(p));

  // ── TABLE (ALL BOOKINGS) ──────────────────────────
  children.push(
    new Table({
      width: { size: TABLE_WIDTH, type: WidthType.DXA },
      columnWidths: COL_WIDTHS,
      alignment: AlignmentType.CENTER,
      rows: [buildHeaderRow(), ...bookings.map(buildDataRow)],
    }),
  );

  // ── FOOTER TOTAL ──────────────────────────────────
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: `Total Bookings: ${bookings.length}     Grand Total: ${fmt(
            grandTotal,
          )}`,
          bold: true,
          size: 24,
          font: "Arial",
          color: "DC2626",
        }),
      ],
      spacing: { before: 160 },
      alignment: AlignmentType.CENTER,
    }),
  );

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Arial", size: SZ.body } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 12240,
              height: 15840,
              orientation: PageOrientation.LANDSCAPE,
            },
            margin: {
              top: 720,
              bottom: 720,
              left: 720,
              right: 720,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `jojo-orders-${date}.docx`);
}
