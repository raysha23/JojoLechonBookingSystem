//File Path: JojoLechonBookingSystem/src/data/models.js
export class LechonModel {
  constructor(productName, amount, promoAmount, freebies) {
    this.productName = productName;
    this.amount = amount;
    this.promoAmount = promoAmount;
    this.freebies = freebies;
  }

  getFinalPrice() {
    return this.amount - (this.promoAmount === "-1000" ? 1000 : 500);
  }
}

export class BellyModel {
  constructor(productName, amount, promoAmount, freebies) {
    this.productName = productName;
    this.amount = amount;
    this.promoAmount = promoAmount;
    this.freebies = freebies;
  }
  getFinalPrice() {
    return this.amount - (this.promoAmount === "-1000" ? 1000 : 500);
  }
}

export class BellyPackageModel {
  constructor(productName, amount, promoAmount, NoOfDishes, dishes, freebies) {
    this.productName = productName;
    this.amount = amount;
    this.promoAmount = promoAmount;
    this.NoOfDishes = NoOfDishes;
    this.dishes = dishes;
    this.freebies = freebies;
  }
  getFinalPrice() {
    return this.amount - (this.promoAmount === "-1000" ? 1000 : 500);
  }
}

export class LechonPackageModel {
  constructor(productName, amount, promoAmount, NoOfDishes, dishes, freebies) {
    this.productName = productName;
    this.amount = amount;
    this.promoAmount = promoAmount;
    this.NoOfDishes = NoOfDishes;
    this.dishes = dishes;
    this.freebies = freebies;
  }
  getFinalPrice() {
    return this.amount - (this.promoAmount === "-1000" ? 1000 : 500);
  }
}

export class DishModel {
  constructor(productName, amount) {
    this.productName = productName;
    this.amount = amount;
  }
}

export class DeliveryChargeModel {
  constructor(zones, minAmount, maxAmount = null) {
    this.zones = zones; // array now
    this.minAmount = minAmount;
    this.maxAmount = maxAmount;
  }

  getDisplayPrice() {
    return this.maxAmount
      ? `₱${this.minAmount} - ₱${this.maxAmount}`
      : `₱${this.minAmount}`;
  }
}
