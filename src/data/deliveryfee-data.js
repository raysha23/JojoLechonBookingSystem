import { DeliveryChargeModel } from "./models.js";

const deliveryChargeData = [
  {
    zones: ["Inayawan"],
    minAmount: 90,
  },

  {
    zones: ["Near Talisay"],
    minAmount: 100,
    maxAmount: 150,
  },

  {
    zones: ["Minglanilla", "Naga Proper"],
    minAmount: 250,
    maxAmount: 400,
  },

  {
    zones: ["Carcar", "San Fernando", "Naga Mountains"],
    minAmount: 450,
    maxAmount: 500,
  },

  {
    zones: ["Pardo", "Basak", "Quiot", "Mambaling"],
    minAmount: 200,
  },

  {
    zones: ["Pasil", "Tisa", "Banawa", "Sambag", "V. Rama", "Fuente"],
    minAmount: 250,
  },

  {
    zones: ["Lahug", "Mabolo", "Talamban", "Pit-os", "Ayala"],
    minAmount: 300,
  },

  {
    zones: ["Temple of Leah", "Busay"],
    minAmount: 400,
    maxAmount: 500,
  },

  {
    zones: ["Mandaue", "Consolacion"],
    minAmount: 350,
    maxAmount: 400,
  },

  {
    zones: ["Lapu-Lapu", "Cordova"],
    minAmount: 400,
    maxAmount: 450,
  },

  {
    zones: ["Liloan", "Compostela"],
    minAmount: 500,
  },

  {
    zones: ["Danao"],
    minAmount: 600,
    maxAmount: 700,
  },
];

export const deliveryCharges = deliveryChargeData;