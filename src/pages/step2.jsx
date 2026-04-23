import React, { useState } from "react";

export default function Step2({ orderState }) {
  const {
    customerName,
    setCustomerName,
    contacts,
    setContacts,
    facebookProfile,
    setFacebookProfile,
  } = orderState;

  const [errors, setErrors] = useState({
    name: false,
    contact: false,
    fb: false,
  });

  const handleNameChange = (e) => {
    const value = e.target.value;
    const isValid = /^[a-zA-Z\s]*$/.test(value);
    setCustomerName(value);
    setErrors({ ...errors, name: !isValid });
  };

  const validatePhone = (value) => /^09\d{0,9}$/.test(value);
  const validatePhoneComplete = (value) => /^09\d{9}$/.test(value);

  const handleContactChange = (index, value) => {
    const numeric = value.replace(/\D/g, "").slice(0, 11);
    const newContacts = [...contacts];
    newContacts[index] = numeric;
    setContacts(newContacts);

    const invalid = newContacts.some(
      (contact) => contact !== "" && !validatePhone(contact),
    );
    setErrors({ ...errors, contact: invalid });
  };

  const addContact = () => setContacts([...contacts, ""]);

  const removeContact = (index) =>
    setContacts(contacts.filter((_, i) => i !== index));

  const normalizeFacebookUrl = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handleFbChange = (e) => {
    const value = e.target.value;
    const isValid =
      value === "" ||
      /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/.+/i.test(value.trim());
    setFacebookProfile(value);
    setErrors({ ...errors, fb: !isValid });
  };

  const handleFbBlur = () => {
    if (!facebookProfile) return;
    if (/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.com)\/.+/i.test(
      facebookProfile.trim(),
    )) {
      setFacebookProfile(normalizeFacebookUrl(facebookProfile));
    }
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
          value={customerName}
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
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="tel"
                value={contact}
                onChange={(e) => handleContactChange(index, e.target.value)}
                placeholder={`09XXXXXXXXX`}
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
            ⚠ Contact numbers must start with 09 and be 11 digits long.
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
          type="url"
          value={facebookProfile}
          onChange={handleFbChange}
          onBlur={handleFbBlur}
          placeholder="https://facebook.com/yourpage"
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
