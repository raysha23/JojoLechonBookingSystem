// File Path: JojoLechonBookingSystem/src/pages/step1.jsx
import { useEffect, useState } from "react";

// ── ZONE KEYWORDS MAPPING ────────────────────────
const zoneKeywords = [
  // =========================
  // TALISAY CITY
  // =========================
  {
    zoneName: "Talisay-Proper",
    city: "Talisay City",
    areaType: "proper",
    keywords: [
      "talisay",
      "liburon",
      "laya",
      "batasan",
      "tangke",
      "tayud",
      "poblacion",
    ],
  },
  {
    zoneName: "Talisay-Mountain",
    city: "Talisay City",
    areaType: "mountain",
    keywords: ["talisay mountain", "upland", "hill", "highland"],
  },

  // =========================
  // MINGLANILLA
  // =========================
  {
    zoneName: "Minglanilla-Proper",
    city: "Minglanilla",
    areaType: "proper",
    keywords: ["minglanilla", "tampo"],
  },
  {
    zoneName: "Minglanilla-Mountain",
    city: "Minglanilla",
    areaType: "mountain",
    keywords: ["minglanilla mountain"],
  },

  // =========================
  // NAGA CITY
  // =========================
  {
    zoneName: "Naga-Proper",
    city: "Naga City",
    areaType: "proper",
    keywords: ["naga proper", "naga city", "babag", "buhisan", "tigbao"],
  },
  {
    zoneName: "Naga-Mountain",
    city: "Naga City",
    areaType: "mountain",
    keywords: ["naga mountain", "sungod", "bugnay"],
  },

  // =========================
  // CARCAR CITY
  // =========================
  {
    zoneName: "Carcar-Proper",
    city: "Carcar City",
    areaType: "proper",
    keywords: ["carcar", "binaliw", "canlumot"],
  },
  {
    zoneName: "Carcar-Mountain",
    city: "Carcar City",
    areaType: "mountain",
    keywords: ["carcar mountain"],
  },

  // =========================
  // CEBU CITY (GROUPED BARANGAYS)
  // =========================
  {
    zoneName: "Cebu-Proper",
    city: "Cebu City",
    areaType: "proper",
    keywords: [
      "pardo",
      "basak",
      "quiot",
      "mambaling",
      "pasil",
      "tisa",
      "banawa",
      "sambag",
      "v rama",
      "fuente",
      "lahug",
      "mabolo",
      "talamban",
      "pit-os",
    ],
  },
  {
    zoneName: "Cebu-Mountain",
    city: "Cebu City",
    areaType: "mountain",
    keywords: ["busay", "sirao", "transcentral", "mountain view"],
  },

  // =========================
  // NEARBY CITIES
  // =========================
  {
    zoneName: "Mandaue-Proper",
    city: "Mandaue City",
    areaType: "proper",
    keywords: ["mandaue", "bakilid", "tipolo"],
  },
  {
    zoneName: "LapuLapu-Proper",
    city: "Lapu-Lapu City",
    areaType: "proper",
    keywords: ["lapu-lapu", "cordova", "mactan"],
  },
  {
    zoneName: "Consolacion-Proper",
    city: "Consolacion",
    areaType: "proper",
    keywords: ["consolacion"],
  },

  // =========================
  // FAR AREAS
  // =========================
  {
    zoneName: "Liloan-Proper",
    city: "Liloan",
    areaType: "proper",
    keywords: ["liloan"],
  },
  {
    zoneName: "Compostela-Proper",
    city: "Compostela",
    areaType: "proper",
    keywords: ["compostela"],
  },
  {
    zoneName: "Danao-Proper",
    city: "Danao City",
    areaType: "proper",
    keywords: ["danao"],
  },
];

export default function Step1({ orderState }) {
  const {
    orderType,
    setOrderType,
    zone,
    setZone,
    address,
    setAddress,
    deliveryDate,
    setDeliveryDate,
    deliveryTime,
    setDeliveryTime,
    productType,
    setProductType,
    selectedProductIndex,
    setSelectedProductIndex,
    setSelectedProduct,
    requiredDishes,
    setRequiredDishes,
    extraDishes,
    setExtraDishes,
    upgradeAmount,
    setUpgradeAmount,
    productTypes,
    products,
    dishes,
    deliveryCharges,
    isLoading,
  } = orderState;

  // Modal is UI-only, stays local
  const [showModal, setShowModal] = useState(false);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  // ── Keep productType name in sync ────────────
  useEffect(() => {
    if (!productType) {
      setSelectedProductTypeId("");
      return;
    }
    const selectedType = productTypes.find((t) => t.typeName === productType);
    setSelectedProductTypeId(selectedType ? String(selectedType.id) : "");
  }, [productType, productTypes]);

  useEffect(() => {
    if (!address || orderType !== "delivery") return;
    const lowerAddress = address.toLowerCase();
    for (const zone of zoneKeywords) {
      if (zone.keywords.some((keyword) => lowerAddress.includes(keyword))) {
        setZone(zone.zoneName);
        return;
      }
    }
  }, [address, orderType]);

  // ── Sync selectedProduct to parent state ─────
  const selectedProduct =
    selectedProductIndex !== ""
      ? (products.find((p) => String(p.id) === String(selectedProductIndex)) ??
        null)
      : null;

  useEffect(() => {
    setSelectedProduct(selectedProduct);
  }, [selectedProduct, setSelectedProduct]);

  // ── GET AVAILABLE TIMES (with 5-hour processing buffer) ──
  const getAvailableTimes = () => {
    const allTimes = [
      "12:00 AM",
      "1:00 AM",
      "2:00 AM",
      "3:00 AM",
      "4:00 AM",
      "5:00 AM",
      "6:00 AM",
      "7:00 AM",
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
      "10:00 PM",
      "11:00 PM",
    ];

    if (!deliveryDate) return allTimes;

    const today = new Date().toISOString().split("T")[0];
    const isToday = deliveryDate === today;
    if (!isToday) return allTimes;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const cutoffHour = currentHour + 5;

    return allTimes.filter((timeStr) => {
      const [time, period] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      if (hours > cutoffHour) return true;
      if (hours === cutoffHour && minutes >= currentMinutes) return true;
      return false;
    });
  };

  const availableTimes = getAvailableTimes();

  // ── Logic Flags ──────────────────────────────
  const showProductDropdown = productType !== "" && productType !== "dish_only";
  const showDishes =
    productType === "lechon_package" ||
    productType === "belly_package" ||
    (productType === "dish_only" &&
      (selectedProductIndex !== "" || productType === "dish_only"));

  const showFreebies =
    productType === "lechon_package" ||
    productType === "belly_package" ||
    productType === "lechon_only" ||
    (productType === "belly_only" && selectedProductIndex !== "");

  return (
    <div className="grid gap-6">
      {/* ORDER CONFIG */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* HEADER */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Order Configuration
          </h2>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-gray-400">
            <svg
              className="animate-spin w-6 h-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-sm font-medium">Loading...</span>
          </div>
        ) : (
          <div className="flex flex-col space-y-5">
            {/* ORDER TYPE */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Order Type
              </label>
              <select
                className="w-full p-3 border rounded-xl"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            {/* DELIVERY FIELDS */}
            {orderType === "delivery" && (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  Delivery Details
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Enter address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="md:col-span-2 w-full p-3 border rounded-xl"
                  />
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full p-3 border rounded-xl"
                  >
                    <option value="">Select Zone</option>
                    {deliveryCharges.map((charge) => (
                      <option key={charge.id} value={charge.zoneName}>
                        {charge.zoneName} — ₱{charge.baseFee}
                        {charge.surcharge ? ` + ₱${charge.surcharge} surcharge` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* DATE */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Delivery Date
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
              {deliveryDate === new Date().toISOString().split("T")[0] && (
                <p className="text-xs text-amber-600 mt-1">
                  ⏱️ Processing time: 5 hours. Available times shown below.
                </p>
              )}
            </div>

            {/* TIME — shown only after date is selected */}
            {deliveryDate && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Delivery Time
                </label>
                {availableTimes.length === 0 ? (
                  <div className="w-full p-3 border border-red-200 bg-red-50 rounded-xl text-sm text-red-600 font-medium">
                    ❌ No available times for today. Please select a future
                    date.
                  </div>
                ) : (
                  <select
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                  >
                    <option value="">Select time</option>
                    {availableTimes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* PRODUCT TYPE */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Type
              </label>
              <select
                className="w-full p-3 border rounded-xl"
                value={selectedProductTypeId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedProductTypeId(selectedId);
                  const selectedType = productTypes.find(
                    (type) => String(type.id) === String(selectedId),
                  );
                  setProductType(selectedType?.typeName ?? "");
                  setSelectedProductIndex("");
                  setSelectedProduct(null);
                  setRequiredDishes([]);
                  setExtraDishes([]);
                  setUpgradeAmount(0); // reset upgrade when changing type
                  setShowUpgrade(false);
                }}
              >
                <option value="">— Select a product type —</option>
                {productTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.typeName
                      .split("_")
                      .map(
                        (part) => part.charAt(0).toUpperCase() + part.slice(1),
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
            </div>

            {/* PRODUCT SELECT */}
            {showProductDropdown && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Select Product
                  </label>
                  {selectedProductIndex !== "" && (
                    <button
                      onClick={() => setShowUpgrade(!showUpgrade)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 underline"
                    >
                      Upgrade
                    </button>
                  )}
                </div>
                <select
                  className="w-full p-3 border border-red-500 rounded-xl"
                  value={selectedProductIndex}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedProductIndex(selectedId);

                    if (selectedId !== "") {
                      const product = products.find(
                        (p) => String(p.id) === String(selectedId),
                      );
                      setSelectedProduct(product);

                      const defaultDishIds = (product?.defaultDishes ?? []).map(
                        (d) => d.dishId,
                      );
                      const filledRequired = Array.from(
                        { length: product?.NoOfDishes || 0 },
                        (_, index) => defaultDishIds[index] ?? "",
                      );
                      setRequiredDishes(filledRequired);
                    } else {
                      setSelectedProduct(null);
                      setRequiredDishes([]);
                    }
                    setUpgradeAmount(0); // reset upgrade when changing product
                    setShowUpgrade(false);
                  }}
                >
                  <option value="">— Select a product —</option>
                  {products
                    .filter(
                      (p) =>
                        String(p.productTypeId) ===
                        String(selectedProductTypeId),
                    )
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.productName} — ₱{item.amount}
                      </option>
                    ))}
                </select>
                {showUpgrade && (
                  <div className="mt-2">
                    <label className="block text-xs font-bold text-gray-600 mb-1">
                      Upgrade Weight (₱)
                    </label>
                    <select
                      className="w-full p-2 border rounded-lg text-sm"
                      value={upgradeAmount}
                      onChange={(e) => setUpgradeAmount(Number(e.target.value))}
                    >
                      <option value={0}>No Upgrade</option>
                      <option value={500}>500 (1kg)</option>
                      <option value={1000}>1000 (2-3kg)</option>
                      <option value={2000}>2000 (5-6kg)</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DISH SECTION */}
      {showDishes && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-[250px]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 118 0m-4 8v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm5 7a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Dishes</h2>
                <p className="text-sm text-gray-500">
                  Note: Each extra dish costs{" "}
                  <span className="font-semibold text-red-600">₱700</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (
                  productType !== "dish_only" &&
                  selectedProductIndex === ""
                ) {
                  setShowModal(true);
                  return;
                }
                setExtraDishes([...extraDishes, ""]);
              }}
              className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center justify-center hover:bg-red-700 transition-colors md:w-64"
            >
              {productType === "dish_only" ? "+ Add Dish" : "+ Add Extra Dish"}
            </button>
          </div>

          {productType !== "dish_only" && selectedProductIndex === "" ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2 opacity-50 flex-1">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="text-sm font-semibold text-gray-500">
                No product selected
              </p>
              <p className="text-xs text-gray-400">
                Please select a product to manage its dishes.
              </p>
            </div>
          ) : requiredDishes.length === 0 && extraDishes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2 opacity-50 flex-1">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <p className="text-sm font-semibold text-gray-500">
                No dishes added yet
              </p>
              <p className="text-xs text-gray-400">
                Click "+ Add Dish" to include additional dishes.
              </p>
            </div>
          ) : (
            <>
              {requiredDishes.length > 0 && (
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-bold text-gray-700">
                    Required Dishes (Included in Package)
                  </p>
                  {requiredDishes.map((val, index) => (
                    <select
                      key={`required-${index}`}
                      className="w-full p-3 border rounded-xl bg-gray-100"
                      value={val}
                      onChange={(e) => {
                        const updated = [...requiredDishes];
                        updated[index] = e.target.value;
                        setRequiredDishes(updated);
                      }}
                    >
                      <option value="">— Select Dish —</option>
                      {dishes.map((dish) => (
                        <option key={dish.id} value={dish.id}>
                          {dish.dishName}
                        </option>
                      ))}
                    </select>
                  ))}
                </div>
              )}

              {extraDishes.length > 0 && (
                <div className="space-y-3 mb-6">
                  {productType !== "dish_only" && (
                    <p className="text-sm font-bold text-gray-700">
                      Extra Dishes
                    </p>
                  )}
                  {extraDishes.map((dish, index) => (
                    <div key={index} className="flex gap-2">
                      <select
                        className="flex-1 p-3 border rounded-xl"
                        value={dish}
                        onChange={(e) => {
                          const updated = [...extraDishes];
                          updated[index] = e.target.value;
                          setExtraDishes(updated);
                        }}
                      >
                        <option value="">— Select Dish —</option>
                        {dishes.map((dishItem) => (
                          <option key={dishItem.id} value={dishItem.id}>
                            {dishItem.dishName} — ₱{dishItem.amount}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          setExtraDishes(
                            extraDishes.filter((_, i) => i !== index),
                          )
                        }
                        className="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* FREEBIES SECTION */}
      {showFreebies && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800">
                Included Freebies
              </h2>
            </div>
            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              Auto-Generated
            </span>
          </div>

          {!selectedProduct ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2 opacity-50">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <p className="text-sm font-semibold text-gray-500">
                No product selected
              </p>
              <p className="text-xs text-gray-400">
                Please select a product to view its included freebies.
              </p>
            </div>
          ) : !selectedProduct.freebies ||
            selectedProduct.freebies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-2 opacity-50">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
              <p className="text-sm font-semibold text-gray-500">
                No freebies available
              </p>
              <p className="text-xs text-gray-400">
                This product does not include any freebies.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedProduct.freebies.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-3 bg-emerald-50 rounded-lg"
                >
                  <svg
                    className="w-4 h-4 text-emerald-500 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium text-emerald-800">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              No Product Selected
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Please select a product first before adding dishes.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-red-700 transition-colors w-full"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
