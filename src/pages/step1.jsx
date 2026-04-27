// File Path: JojoLechonBookingSystem/src/pages/Step1.jsx
import { useEffect, useState } from "react";
import DatePicker from "../components/datetimepicker/DatePicker";
import { getProductsByType } from "../api/productApi";

// ── ZONE KEYWORDS MAPPING ────────────────────────────────────────
const zoneKeywords = [
  // TALISAY CITY
  {
    zoneName: "Talisay-Proper",
    keywords: [
      "talisay",
      "biasong",
      "bulacao",
      "cadulawan",
      "cansojong",
      "dumlog",
      "jaclupan",
      "lagtang",
      "lawaan 1",
      "lawaan 2",
      "lawaan 3",
      "linao",
      "maghaway",
      "mohon",
      "poblacion",
      "pooc",
      "san isidro",
      "san roque",
      "tabunok",
      "tangke",
    ],
  },
  {
    zoneName: "Talisay-Mountain",
    keywords: [
      "camp 4",
      "camp iv",
      "manipis",
      "tapul",
      "talisay mountain",
      "upland",
      "highland",
      "bukid",
    ],
  },
  // MINGLANILLA
  {
    zoneName: "Minglanilla-Proper",
    keywords: [
      "minglanilla",
      "tampo",
      "poblacion",
      "tulay",
      "pakigne",
      "calajoan",
      "cadulawan",
      "linao",
      "tubod",
      "ward",
      "tungkop",
      "tunghaan",
      "camp 8",
      "camp viii",
    ],
  },
  {
    zoneName: "Minglanilla-Mountain",
    keywords: [
      "guindaruhan",
      "manduang",
      "cuanos",
      "camp 7",
      "camp vii",
      "buot-taop",
      "danlog",
      "tubod mountain",
      "minglanilla mountain",
      "upland",
      "bukid",
      "highland",
    ],
  },
  // NAGA CITY
  {
    zoneName: "Naga-Proper",
    keywords: [
      "naga",
      "naga city",
      "poblacion",
      "east poblacion",
      "west poblacion",
      "north poblacion",
      "south poblacion",
      "inala",
      "colon",
      "lutac",
      "mainit",
      "mayana",
      "langtad",
      "tuyan",
      "balirong",
      "cantao-an",
      "tinaan",
      "naalad",
      "tagjaguimit",
      "patag",
    ],
  },
  {
    zoneName: "Naga-Mountain",
    keywords: [
      "alpaco",
      "bairan",
      "bunga",
      "cabayongan",
      "cogon",
      "jaguimit",
      "lamesa",
      "pulangbato",
      "sagasa",
      "tabunan",
      "tuyan mountain",
      "naga mountain",
      "upland",
      "bukid",
      "highland",
    ],
  },
  // CEBU CITY
  {
    zoneName: "Cebu-Proper",
    keywords: [
      "cebu city",
      "cebu",
      "pardo",
      "basak pardo",
      "mambaling",
      "pasil",
      "inayawan",
      "tisa",
      "labangon",
      "punta princesa",
      "guadalupe",
      "sambag",
      "sambag 1",
      "sambag 2",
      "v rama",
      "capitol",
      "fuente",
      "cogon",
      "carbon",
      "colon",
      "sto nino",
      "kalubihan",
      "lahug",
      "mabolo",
      "kasambagan",
      "hipodromo",
      "camputhaw",
      "apang",
      "it park",
      "cebu it park",
      "banilad",
      "talamban",
      "pit-os",
      "banilad road",
      "as fortuna",
      "suba",
      "ermita",
      "tejero",
      "parian",
      "zapatera",
      "tinago",
      "san nicolas",
    ],
  },
  {
    zoneName: "Cebu-Mountain",
    keywords: [
      "busay",
      "sirao",
      "bonbon",
      "sudlon 1",
      "sudlon 2",
      "sudlon i",
      "sudlon ii",
      "pamutan",
      "toong",
      "adlaon",
      "tabunan",
      "babag",
      "malubog",
      "transcentral",
      "mountain view",
      "tops",
      "bukid",
      "upland",
      "highland",
    ],
  },
  // MANDAUE CITY
  {
    zoneName: "Mandaue-Proper",
    keywords: [
      "mandaue",
      "mandaue city",
      "bakilid",
      "banilad",
      "basak",
      "cabancalan",
      "canduman",
      "casili",
      "casuntingan",
      "centro",
      "cubacub",
      "guizo",
      "ibabao",
      "jagobiao",
      "labogon",
      "looc",
      "maguikay",
      "mantuyong",
      "opao",
      "paknaan",
      "pagsabungan",
      "subangdaku",
      "tabok",
      "tawason",
      "tipolo",
      "umapad",
      "parkmall",
      "sm mandaue",
      "jcentre",
      "as fortuna",
      "plaridel",
      "hernan cortes",
    ],
  },
  {
    zoneName: "Mandaue-Mountain",
    keywords: ["mandaue mountain", "upland", "bukid", "highland"],
  },
  // LILOAN
  {
    zoneName: "Liloan-Proper",
    keywords: [
      "liloan",
      "poblacion",
      "cotcot",
      "jublag",
      "san vicente",
      "tayud",
      "yati",
      "looc",
      "catarman",
      "gaisano liloan",
      "liloan port",
      "parola",
      "bagacay point",
      "calero",
    ],
  },
  {
    zoneName: "Liloan-Mountain",
    keywords: [
      "cansaga",
      "pitogo",
      "san roque",
      "purok",
      "liloan mountain",
      "upland",
      "bukid",
      "highland",
    ],
  },
  // DANAO CITY
  {
    zoneName: "Danao-Proper",
    keywords: [
      "danao",
      "danao city",
      "poblacion",
      "looc",
      "guinsay",
      "cogon",
      "suba",
      "sabang",
      "manlayag",
      "dunggoan",
      "binaliw",
      "taytay",
      "camboang",
      "masaba",
      "san vicente",
      "san fernando",
      "danao port",
      "robinsons danao",
      "sm city danao",
      "danao pier",
    ],
  },
  {
    zoneName: "Danao-Mountain",
    keywords: [
      "lamac",
      "magtagobtob",
      "panalipan",
      "sacsac",
      "cabungahan",
      "danao mountain",
      "bukid",
      "upland",
      "highland",
    ],
  },
  // COMPOSTELA
  {
    zoneName: "Compostela-Proper",
    keywords: [
      "compostela",
      "poblacion",
      "bagalnga",
      "nangka",
      "panoypoy",
      "tugbongan",
      "tubigan",
      "dapitan",
      "malogo",
      "manlayag",
      "lupa",
      "compostela cebu",
      "compostela town",
      "gaisano compostela",
      "compostela market",
    ],
  },
  {
    zoneName: "Compostela-Mountain",
    keywords: [
      "canduman upland",
      "mountain compostela",
      "bukid",
      "upland",
      "highland",
      "cansaga upland",
      "cagay",
      "panangatan",
    ],
  },
  // MOALBOAL
  {
    zoneName: "Moalboal-Proper",
    keywords: [
      "moalboal",
      "moalboal cebu",
      "poblacion east",
      "poblacion west",
      "basdiot",
      "basdaku",
      "saavedra",
      "tuble",
      "tomonoy",
      "bugho",
      "balabagon",
      "balingasag",
      "bato",
      "buguil",
      "busay",
      "lanao",
      "panagsama",
      "white beach",
    ],
  },
  {
    zoneName: "Moalboal-Mountain",
    keywords: [
      "upland moalboal",
      "moalboal mountain",
      "bukid",
      "highland",
      "hill area",
    ],
  },
  // SIBONGA
  {
    zoneName: "Sibonga-Proper",
    keywords: [
      "sibonga",
      "sibonga cebu",
      "poblacion",
      "sabong",
      "candaguit",
      "lamacan",
      "abugon",
      "banlot",
      "bato",
      "cagay",
      "cansabusab",
      "garing",
      "gilutongan",
      "jolomaynon",
      "manatad",
      "nangka",
      "simala",
      "tubod",
      "tuble",
    ],
  },
  {
    zoneName: "Sibonga-Mountain",
    keywords: [
      "simala upland",
      "sibonga mountain",
      "bukid",
      "upland",
      "highland",
      "hill area",
    ],
  },
  // SAN FERNANDO
  {
    zoneName: "SanFernando-Proper",
    keywords: [
      "san fernando",
      "san fernando cebu",
      "poblacion",
      "balud",
      "bugho",
      "cabatbatan",
      "camboang",
      "ilaya",
      "kabalaasnan",
      "lantawan",
      "libo",
      "magsico",
      "malbago",
      "panadtaran",
      "pitalo",
      "san isidro",
      "san roque",
      "sangat",
      "tabionan",
      "tinubdan",
      "tubod",
    ],
  },
  {
    zoneName: "SanFernando-Mountain",
    keywords: [
      "san fernando mountain",
      "bukid",
      "upland",
      "highland",
      "hill area",
    ],
  },
  // ARGAO
  {
    zoneName: "Argao-Proper",
    keywords: [
      "argao",
      "argao cebu",
      "poblacion",
      "bogo",
      "colawin",
      "giloctog",
      "guiwanon",
      "jampang",
      "langtad",
      "lantoy",
      "linut-od",
      "mabasa",
      "mandilikit",
      "nabunturan",
      "ocaña",
      "sibago",
      "sumag",
      "talo-ot",
      "tiguib",
      "tubod",
      "usmad",
      "canbanua",
      "balisong",
    ],
  },
  {
    zoneName: "Argao-Mountain",
    keywords: [
      "argao mountain",
      "bukid",
      "upland",
      "highland",
      "hill area",
      "candabong upland",
    ],
  },
];

// ── HELPERS ──────────────────────────────────────────────────────
const err = (invalid) =>
  invalid ? "border-red-500 ring-1 ring-red-400" : "border-gray-200";

const getAvailableTimes = (deliveryDate) => {
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
  if (deliveryDate !== today) return allTimes;
  const now = new Date();
  const cutoffHour = now.getHours() + 5;
  const currentMinutes = now.getMinutes();
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

const detectZone = (address) => {
  if (!address) return "";
  const lower = address.toLowerCase().replace(/\s+/g, "");
  for (const z of zoneKeywords) {
    if (z.keywords.some((k) => lower.includes(k.replace(/\s+/g, "")))) {
      return z.zoneName;
    }
  }
  return "";
};

// ── MAIN COMPONENT ────────────────────────────────────────────────
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
    items,
    setItems,
    makeEmptyItem,
    productTypes,
    products,
    dishes,
    isLoading,
    attempted,
  } = orderState;

  const availableTimes = getAvailableTimes(deliveryDate);

  // Auto-detect zone from address
  useEffect(() => {
    if (!address || orderType !== "delivery") return;
    setZone(detectZone(address));
  }, [address, orderType]);

  const updateItem = (id, patch) =>
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  return (
    <div className="grid gap-6">
      {/* ── ORDER CONFIG CARD ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
                className="w-full p-3 border border-gray-200 rounded-xl"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            {/* DELIVERY FIELDS */}
            {orderType === "delivery" && (
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700">
                  Delivery Details
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1fr_180px] gap-3">
                  {/* ADDRESS */}
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="Enter address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full p-3 border rounded-xl ${attempted && address.trim() === "" ? "border-red-500" : "border-gray-300"}`}
                    />
                    {attempted && address.trim() === "" && (
                      <p className="text-xs text-red-500 font-medium mt-1">
                        ⚠ Address is required.
                      </p>
                    )}
                  </div>
                  {/* ZONE */}
                  <div className="flex flex-col">
                    <div
                      className={`w-full p-3 border rounded-xl bg-gray-100 ${attempted && zone.trim() === "" ? "border-red-500" : "border-gray-300"}`}
                    >
                      {zone || (
                        <span className="text-gray-400">Zone not detected</span>
                      )}
                    </div>
                    {attempted &&
                      zone.trim() === "" &&
                      address.trim() !== "" && (
                        <p className="text-xs text-red-500 font-medium mt-1">
                          ⚠ Zone not detected. Try a more specific address.
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* DATE */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Delivery Date
              </label>
              <DatePicker
                value={deliveryDate}
                onChange={setDeliveryDate}
                attempted={attempted}
              />
            </div>

            {/* TIME */}
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
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none ${err(attempted && !deliveryTime)}`}
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
                {attempted && !deliveryTime && (
                  <p className="text-xs text-red-500 font-medium mt-1">
                    ⚠ Please select a delivery time.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── ITEMS ── */}
      {!isLoading &&
        items.map((item, index) => (
          <ItemBlock
            key={item.id}
            item={item}
            index={index}
            canRemove={items.length > 1}
            onUpdate={(patch) => updateItem(item.id, patch)}
            onRemove={() => removeItem(item.id)}
            productTypes={productTypes}
            products={products}
            dishes={dishes}
            attempted={attempted}
          />
        ))}

      {/* ── ADD ITEM BUTTON ── */}
      {!isLoading && (
        <button
          onClick={() => setItems((prev) => [...prev, makeEmptyItem()])}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-red-200 text-red-500 font-black text-sm hover:border-red-400 hover:bg-red-50 transition-all flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Another Lechon / Belly
        </button>
      )}
    </div>
  );
}

// ── ITEM BLOCK ────────────────────────────────────────────────────
function ItemBlock({
  item,
  index,
  canRemove,
  onUpdate,
  onRemove,
  productTypes,
  products,
  dishes,
  attempted,
}) {
  const [selectedProductTypeId, setSelectedProductTypeId] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Sync selectedProductTypeId when item.productType changes
  // 1. Existing (keep this)
  useEffect(() => {
    if (!item.productType) {
      setSelectedProductTypeId("");
      setFilteredProducts([]);
      return;
    }
    const found = productTypes.find((t) => t.typeName === item.productType);
    setSelectedProductTypeId(found ? String(found.id) : "");
  }, [item.productType, productTypes]);

  // 2. ✅ NEW FIX - Repopulate when returning from Step2
  // ✅ FIXED - Proper dependencies
  useEffect(() => {
    // Only restore if we have product but empty filteredProducts
    if (item.selectedProduct && filteredProducts.length === 0) {
      setFilteredProducts([item.selectedProduct]);
    }
  }, [item.selectedProduct]); // Only depend on item.selectedProduct

  
  const handleProductTypeChange = async (typeId) => {
    setSelectedProductTypeId(typeId);
    setLoadingProducts(true);

    const selectedType = productTypes.find(
      (t) => String(t.id) === String(typeId),
    );

    // Reset item state
    onUpdate({
      productType: selectedType?.typeName ?? "",
      selectedProductIndex: "",
      selectedProduct: null,
      requiredDishes: [],
      extraDishes: [],
      upgradeAmount: 0,
    });

    setShowUpgrade(false);

    if (!typeId) {
      setFilteredProducts([]);
      setLoadingProducts(false);
      return;
    }

    try {
      // ✅ YOUR API ENDPOINT: /api/products?productTypeId=X
      const response = await getProductsByType(typeId);
      console.log("API Response:", response); // Debug

      // Map API response to match your expected shape
      // In handleProductTypeChange - update mapping:
      const mappedProducts = (response || []).map((p) => ({
        id: p.id,
        productName: p.productName,
        amount: p.amount,
        promoAmount: p.promoAmount || 0,
        productTypeId: p.productTypeId,
        NoOfDishes: p.noOfIncludedDishes ?? p.NoOfDishes ?? 0,
        // ✅ FIXED DEFAULT DISHES:
        defaultDishes:
          p.defaultDishes?.map((pd) => ({
            dishId: pd.dishId || pd.Dish?.id || pd.dish?.id,
          })) || [],
        // ✅ FIXED FREEBIES:
        freebies: p.freebies?.map((f) => f.freebieName || f.name) || [],
      }));

      setFilteredProducts(mappedProducts);
      setFilteredProducts(mappedProducts);
      console.log("Mapped products:", mappedProducts); // Debug
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setFilteredProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  // ✅ FIXED: Use filteredProducts state (from API)
  const handleProductChange = (productId) => {
    if (!productId) {
      onUpdate({
        selectedProductIndex: "",
        selectedProduct: null,
        requiredDishes: [],
        upgradeAmount: 0,
      });
      setShowUpgrade(false);
      return;
    }

    const product = filteredProducts.find(
      (p) => String(p.id) === String(productId),
    );

    if (!product) return;

    // ✅ FIXED: Handle various API shapes
    let defaultDishIds = [];
    if (product.defaultDishes && Array.isArray(product.defaultDishes)) {
      defaultDishIds = product.defaultDishes.map((d) =>
        String(d.dishId || d.Dish?.id || d.id),
      );
    }

    const slots = product.NoOfDishes || product.noOfIncludedDishes || 0;
    const padded = [...defaultDishIds];
    while (padded.length < slots) padded.push("");

    console.log("Default dishes:", defaultDishIds, "Slots:", slots); // DEBUG

    onUpdate({
      selectedProductIndex: productId,
      selectedProduct: product,
      requiredDishes: padded, // ✅ This populates dishes dropdowns
      extraDishes: [],
      upgradeAmount: 0,
    });
    setShowUpgrade(false);
  };
  const isDishOnly = item.productType === "dish_only";
  const hasPackage =
    item.productType === "lechon_package" ||
    item.productType === "belly_package";
  const showDishes =
    isDishOnly || (hasPackage && item.selectedProductIndex !== "");
  const showFreebies =
    (item.productType === "lechon_package" ||
      item.productType === "belly_package" ||
      item.productType === "lechon_only" ||
      item.productType === "belly_only") &&
    item.selectedProductIndex !== "";
  const showProductDropdown = item.productType !== "" && !isDishOnly;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Item Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0">
            {index + 1}
          </div>
          <div>
            <p className="font-black text-gray-800 text-sm leading-none">
              {item.selectedProduct?.productName || `Item ${index + 1}`}
            </p>
            {item.selectedProduct && (
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                ₱{Number(item.selectedProduct.amount).toLocaleString()}
                {item.upgradeAmount > 0 && ` + ₱${item.upgradeAmount} upgrade`}
              </p>
            )}
          </div>
        </div>
        {canRemove && (
          <button
            onClick={onRemove}
            className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Remove
          </button>
        )}
      </div>

      <div className="p-6 space-y-5">
        {/* PRODUCT TYPE */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Product Type
          </label>
          <select
            className={`w-full p-3 border rounded-xl ${err(attempted && !item.productType)}`}
            value={selectedProductTypeId}
            onChange={(e) => handleProductTypeChange(e.target.value)}
          >
            <option value="">— Select a product type —</option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.typeName
                  .split("_")
                  .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
          {attempted && !item.productType && (
            <p className="text-xs text-red-500 font-medium mt-1">
              ⚠ Please select a product type.
            </p>
          )}
        </div>

        {/* PRODUCT SELECT */}
        {showProductDropdown && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700">
                Select Product
              </label>
              {item.selectedProductIndex !== "" && (
                <button
                  onClick={() => setShowUpgrade(!showUpgrade)}
                  className="text-xs font-bold text-red-600 hover:text-red-700 underline"
                >
                  {showUpgrade ? "Hide Upgrade" : "Upgrade"}
                </button>
              )}
            </div>

            {/* ✅ LOADING STATE */}
            {loadingProducts ? (
              <div className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center py-8">
                <svg
                  className="animate-spin w-6 h-6 text-gray-400 mr-3"
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
                <span className="text-sm font-medium text-gray-600">
                  Loading products...
                </span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="w-full p-3 border border-yellow-200 bg-yellow-50 rounded-xl text-sm text-yellow-700 font-medium py-4">
                No products available for this type
              </div>
            ) : (
              <select
                className={`w-full p-3 border rounded-xl ${err(attempted && item.selectedProductIndex === "")}`}
                value={item.selectedProductIndex}
                onChange={(e) => handleProductChange(e.target.value)}
              >
                <option value="">
                  — Select a product ({filteredProducts.length} available) —
                </option>
                {filteredProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.productName} — ₱{Number(p.amount).toLocaleString()}
                  </option>
                ))}
              </select>
            )}

            {attempted &&
              item.selectedProductIndex === "" &&
              !loadingProducts && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  ⚠ Please select a product.
                </p>
              )}

            {/* UPGRADE */}
            {showUpgrade && item.selectedProduct && (
              <div className="mt-2 pt-3 border-t border-gray-100">
                <label className="block text-xs font-bold text-gray-600 mb-1">
                  Upgrade Weight (₱)
                </label>
                <select
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                  value={item.upgradeAmount}
                  onChange={(e) =>
                    onUpdate({ upgradeAmount: Number(e.target.value) })
                  }
                >
                  <option value={0}>No Upgrade</option>
                  <option value={500}>₱500 (+1kg)</option>
                  <option value={1000}>₱1,000 (+2-3kg)</option>
                  <option value={2000}>₱2,000 (+5-6kg)</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* DISHES */}
        {showDishes && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
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
                  <p className="text-sm font-bold text-gray-800">Dishes</p>
                  <p className="text-xs text-gray-400">
                    Extra dishes cost{" "}
                    <span className="font-bold text-red-600">₱700</span> each
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (!isDishOnly && item.selectedProductIndex === "") {
                    setShowModal(true);
                    return;
                  }
                  onUpdate({ extraDishes: [...item.extraDishes, ""] });
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 hover:bg-red-700 transition-colors shrink-0"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {isDishOnly ? "Add Dish" : "Add Extra"}
              </button>
            </div>

            {/* EMPTY STATE */}
            {!isDishOnly && item.selectedProductIndex === "" ? (
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
                <p className="text-sm font-semibold text-gray-500 text-center">
                  Select a product first
                </p>
              </div>
            ) : item.requiredDishes.length === 0 &&
              item.extraDishes.length === 0 ? (
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="text-sm font-semibold text-gray-500 text-center">
                  No dishes added yet
                </p>
              </div>
            ) : (
              <>
                {/* REQUIRED DISHES */}
                {item.requiredDishes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                      Required Dishes — Included
                    </p>
                    {item.requiredDishes.map((val, i) => (
                      <select
                        key={`req-${i}`}
                        className={`w-full p-3 border rounded-xl bg-gray-50 ${err(attempted && val === "")}`}
                        value={val}
                        onChange={(e) => {
                          const updated = [...item.requiredDishes];
                          updated[i] = e.target.value;
                          onUpdate({ requiredDishes: updated });
                        }}
                      >
                        <option value="">— Select Dish —</option>
                        {dishes.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.dishName}
                          </option>
                        ))}
                      </select>
                    ))}
                  </div>
                )}

                {/* EXTRA DISHES */}
                {item.extraDishes.length > 0 && (
                  <div className="space-y-2">
                    {!isDishOnly && (
                      <p className="text-xs font-black text-gray-500 uppercase tracking-widest px-1">
                        Extra Dishes ({item.extraDishes.length} × ₱700)
                      </p>
                    )}
                    {item.extraDishes.map((dish, i) => (
                      <div key={i} className="flex gap-2">
                        <select
                          className={`flex-1 min-w-0 p-3 border rounded-xl ${err(attempted && dish === "")}`}
                          value={dish}
                          onChange={(e) => {
                            const updated = [...item.extraDishes];
                            updated[i] = e.target.value;
                            onUpdate({ extraDishes: updated });
                          }}
                        >
                          <option value="">— Select Dish —</option>
                          {dishes.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.dishName} — ₱{d.amount}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            onUpdate({
                              extraDishes: item.extraDishes.filter(
                                (_, idx) => idx !== i,
                              ),
                            })
                          }
                          className="bg-red-500 text-white px-3 py-3 rounded-lg hover:bg-red-600 transition-colors shrink-0 flex items-center justify-center"
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

        {/* FREEBIES */}
        {showFreebies && item.selectedProduct && (
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-600 rounded-md flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-white"
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
                <p className="text-sm font-bold text-emerald-800">
                  Included Freebies
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                FREE
              </span>
            </div>
            {!item.selectedProduct.freebies ||
            item.selectedProduct.freebies.length === 0 ? (
              <p className="text-xs text-emerald-600 font-medium opacity-60">
                No freebies for this product.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {item.selectedProduct.freebies.map((freebie, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-emerald-100"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-emerald-500 shrink-0"
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
                    <span className="text-xs font-medium text-emerald-800">
                      {freebie}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* NO PRODUCT SELECTED MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
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
              Select Product First
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Please choose a product before adding dishes.
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
