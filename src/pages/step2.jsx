import React, { useState } from "react";

export default function Step2() {
  const [formData, setFormData] = useState({
    customerName: "",
    contacts: [""], // Array to handle multiple inputs
    facebookProfile: "",
  });

  const [errors, setErrors] = useState({
    name: false,
    contact: false,
    fb: false,
  });

  // Handle Name Change with Validation
  const handleNameChange = (e) => {
    const value = e.target.value;
    const isValid = /^[a-zA-Z\s]*$/.test(value);
    setFormData({ ...formData, customerName: value });
    setErrors({ ...errors, name: !isValid });
  };

  // Contact Number Logic
  const handleContactChange = (index, value) => {
    const isValid = /^[0-9]*$/.test(value);
    const newContacts = [...formData.contacts];
    newContacts[index] = value;
    setFormData({ ...formData, contacts: newContacts });
    setErrors({ ...errors, contact: !isValid });
  };

  const addContact = () => {
    setFormData({ ...formData, contacts: [...formData.contacts, ""] });
  };

  const removeContact = (index) => {
    const newContacts = formData.contacts.filter((_, i) => i !== index);
    setFormData({ ...formData, contacts: newContacts });
  };

  // FB Validation
  const handleFbChange = (e) => {
    const value = e.target.value;
    const isValid =
      value === "" ||
      value.includes("facebook.com") ||
      value.includes("fb.com");
    setFormData({ ...formData, facebookProfile: value });
    setErrors({ ...errors, fb: !isValid });
  };

  return (
    <div className="space-y-6">
      {/* Customer Name */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Customer Name
        </label>
        <input
          type="text"
          value={formData.customerName}
          onChange={handleNameChange}
          placeholder="Enter full name"
          className={`w-full p-4 bg-white border rounded-xl outline-none transition-all text-gray-600 italic focus:ring-2 ${
            errors.name
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-200 focus:ring-red-500"
          }`}
        />
        {errors.name && (
          <p className="mt-2 text-xs text-red-500 font-medium">
            ⚠ Name must contain letters only.
          </p>
        )}
      </div>

      {/* Contact Numbers */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Contact Numbers
        </label>

        <div className="space-y-3">
          {formData.contacts.map((contact, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={contact}
                onChange={(e) => handleContactChange(index, e.target.value)}
                placeholder={`Contact number ${index + 1}`}
                maxLength="11"
                className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-gray-600 italic"
              />
              {index > 0 && (
                <button
                  onClick={() => removeContact(index)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {errors.contact && (
          <p className="mt-2 text-xs text-red-500 font-medium">
            ⚠ Contact number must contain numbers only.
          </p>
        )}

        <button
          onClick={addContact}
          className="mt-3 px-4 py-2 border border-red-500 text-red-500 rounded-lg text-sm font-bold flex items-center hover:bg-red-50 transition-colors"
        >
          <span className="mr-2 text-lg">+</span> Add Another Number
        </button>
      </div>

      {/* Facebook */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Facebook Profile (Optional)
        </label>
        <input
          type="text"
          value={formData.facebookProfile}
          onChange={handleFbChange}
          placeholder="https://facebook.com/..."
          className={`w-full p-4 bg-white border rounded-xl outline-none focus:ring-2 focus:ring-red-500 text-gray-600 italic ${
            errors.fb ? "border-red-500" : "border-gray-200"
          }`}
        />
        {errors.fb && (
          <p className="mt-2 text-xs text-red-500 font-medium">
            ⚠ Must be a valid Facebook URL (facebook.com or fb.com).
          </p>
        )}
      </div>
    </div>
  );
}
