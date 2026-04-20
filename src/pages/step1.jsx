export default function Step1() {
  return (
    <div className="grid  gap-6">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">
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

          {/* FORM */}
          <div className="flex flex-col space-y-5">
            {/* ORDER TYPE */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Order Type
              </label>

              <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none">
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            {/* DELIVERY FIELDS */}
            <div className="w-full">
              {/* LABEL */}
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Delivery Details
              </label>

              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* LOCATION (2/3 width) */}
                <input
                  type="text"
                  id="deliveryLocation"
                  placeholder="Enter complete address"
                  className="md:col-span-2 w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                />

                {/* ZONE (1/3 width) */}
                <select
                  id="zoneSelect"
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="">Select Zone</option>
                </select>
              </div>
            </div>

            {/* TIME */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Time
              </label>

              <select className="w-full p-3 border border-gray-200 rounded-xl">
                <option>Select time</option>
                <option>12:00 AM</option>
                <option>1:00 AM</option>
                <option>2:00 AM</option>
                <option>3:00 AM</option>
                <option>4:00 AM</option>
                <option>5:00 AM</option>

                <option>6:00 AM</option>
                <option>7:00 AM</option>
                <option>8:00 AM</option>
                <option>9:00 AM</option>
                <option>10:00 AM</option>
                <option>11:00 AM</option>

                <option>12:00 PM</option>

                <option>1:00 PM</option>
                <option>2:00 PM</option>
                <option>3:00 PM</option>
                <option>4:00 PM</option>
                <option>5:00 PM</option>

                <option>6:00 PM</option>
                <option>7:00 PM</option>
                <option>8:00 PM</option>
                <option>9:00 PM</option>

                <option>10:00 PM</option>
                <option>11:00 PM</option>
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Delivery Date
              </label>

              <input
                type="date"
                placeholder="MM/DD/YYYY"
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            {/* PRODUCT TYPE */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Product Type
              </label>

              <select className="w-full p-3 border border-gray-200 rounded-xl">
                <option>— Select a product type —</option>
                <option>Lechon Package</option>
                <option>Belly Package</option>
                <option>Lechon Only</option>
                <option>Belly Only</option>
                <option>Dishes Only</option>
              </select>
            </div>

            {/* PRODUCT SELECT */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select Product
              </label>

              <select className="w-full p-3 border border-red-500 rounded-xl">
                <option>— Select a product —</option>
              </select>
            </div>
          </div>
        </div>

        {/* DISH SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col min-h-[250px]">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            {/* LEFT INFO */}
            <div className="flex items-center space-x-3">
              {/* ICON */}
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

              {/* TEXT */}
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Additional Dishes
                </h2>

                <p className="text-sm text-gray-500">
                  Note: Each additional dish costs{" "}
                  <span className="font-semibold text-red-600">₱700</span>
                </p>
              </div>
            </div>

            {/* BUTTON */}
            <button className="bg-red-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center justify-center hover:bg-red-700 transition-colors md:w-64">
              <span>+ Add Dish</span>
            </button>
          </div>

          {/* EMPTY STATE */}
          <div className="flex flex-col items-center justify-center text-center py-8 opacity-40 flex-1">
            <p className="text-gray-500 font-medium">
              No additional dishes added yet
            </p>
          </div>
        </div>

        {/* FREEBIES */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-6">
            {/* LEFT SIDE */}
            <div className="flex items-center space-x-3">
              {/* ICON */}
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

              {/* TITLE */}
              <h2 className="text-xl font-bold text-gray-800">
                Included Freebies
              </h2>
            </div>

            {/* BADGE */}
            <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              Auto-Generated
            </span>
          </div>

          {/* LIST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* later: map freebies here */}
          </div>
        </div>
      </div>
    </div>
  );
}
