export const mockBookings = [
  {
    id: "ORD-001",
    createdAt: "2025-04-10T08:30:00",
    deletedAt: null,
    customer: {
      name: "Maria Santos",
      contacts: ["09171234567"],
      facebookProfile: "https://facebook.com/maria.santos",
    },
    order: {
      orderType: "delivery",
      address: "123 Mango St., Cebu City",
      zone: "Zone 1",
      deliveryDate: "2025-04-15",
      deliveryTime: "10:00 AM",
    },
    product: {
      productName: "Pasko 1 (18kg - 20kg)",
      amount: 14950,
      NoOfDishes: 3,
      promoAmount: "-1000",
    },
    dishes: {
      required: ["Buttered Chicken", "Porksteak", "Humba"],
      extra: [],
    },
    payment: {
      method: "gcash",
      total: 14450,
    },
  },
  {
    id: "ORD-002",
    createdAt: "2025-04-11T10:15:00",
    deletedAt: null,
    customer: {
      name: "Juan dela Cruz",
      contacts: ["09281234567", "09391234567"],
      facebookProfile: "",
    },
    order: {
      orderType: "delivery",
      address: "456 Colon St., Cebu City",
      zone: "Zone 2",
      deliveryDate: "2025-04-18",
      deliveryTime: "12:00 PM",
    },
    product: {
      productName: "Jumbo Set B (22kg - 25kg)",
      amount: 17600,
      NoOfDishes: 4,
      promoAmount: "-1000",
    },
    dishes: {
      required: ["Buttered Shrimp", "Lumpia", "Menudo", "Chop Suey"],
      extra: ["Calamares"],
    },
    payment: {
      method: "cod",
      total: 17300,
    },
  },
  {
    id: "ORD-003",
    createdAt: "2025-04-12T14:00:00",
    deletedAt: null,
    customer: {
      name: "Ana Reyes",
      contacts: ["09451234567"],
      facebookProfile: "https://facebook.com/ana.reyes",
    },
    order: {
      orderType: "pickup",
      address: "",
      zone: "",
      deliveryDate: "2025-04-20",
      deliveryTime: "9:00 AM",
    },
    product: {
      productName: "Belly - 1 (4kg)",
      amount: 4790,
      NoOfDishes: 3,
      promoAmount: "-500",
    },
    dishes: {
      required: ["Pancit Guisado", "Fish Fillet", "Porkchop"],
      extra: [],
    },
    payment: {
      method: "gcash",
      total: 4290,
    },
  },
  {
    id: "ORD-004",
    createdAt: "2025-04-13T09:45:00",
    deletedAt: null,
    customer: {
      name: "Roberto Lim",
      contacts: ["09561234567"],
      facebookProfile: "",
    },
    order: {
      orderType: "delivery",
      address: "789 Osmena Blvd., Cebu City",
      zone: "Zone 3",
      deliveryDate: "2025-04-22",
      deliveryTime: "11:00 AM",
    },
    product: {
      productName: "Regular 3 (11kg - 13kg)",
      amount: 13900,
      NoOfDishes: 6,
      promoAmount: "-500",
    },
    dishes: {
      required: [
        "Buttered Chicken",
        "Humba",
        "Lumpia",
        "Menudo",
        "Chop Suey",
        "Porksteak",
      ],
      extra: ["Calamares", "Escabeche"],
    },
    payment: {
      method: "gcash",
      total: 14800,
    },
  },
  {
    id: "ORD-005",
    createdAt: "2025-04-14T16:20:00",
    deletedAt: "2025-04-15T08:00:00", // soft deleted
    customer: {
      name: "Carla Mendoza",
      contacts: ["09671234567"],
      facebookProfile: "https://facebook.com/carla.mendoza",
    },
    order: {
      orderType: "pickup",
      address: "",
      zone: "",
      deliveryDate: "2025-04-25",
      deliveryTime: "2:00 PM",
    },
    product: {
      productName: "Small 2 (7kg - 8kg)",
      amount: 10100,
      NoOfDishes: 4,
      promoAmount: "-500",
    },
    dishes: {
      required: [
        "Sweet and Sour Pork",
        "Kinilaw",
        "Buffalo Chicken",
        "Pork Afritada",
      ],
      extra: [],
    },
    payment: {
      method: "cod",
      total: 9600,
    },
  },
];
