import React from "react";
import { X, ChevronDown, Minus, Check } from "lucide-react";
import { useState } from "react";

export const SearchableDropdown = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  label,
  maxSelectable
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  // Fixed: Remove the condition that filters out selected values
  const filteredOptions = options.filter((option) =>
    option.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    if (
      !selectedValues.includes(option) &&
      (!maxSelectable || selectedValues.length < maxSelectable)
    ) {
      onSelectionChange([...selectedValues, option]);
      setSearchTerm(""); // Clear search input
      setIsOpen(true); // Keep dropdown open
    }
  };

  const handleRemove = (option) => {
    onSelectionChange(selectedValues.filter((item) => item !== option));
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay closing to allow for option selection
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  return (
    <div className="relative bottom-0" style={{ width: "100%" }}>
      <label className="block text-sm font-medium mb-2 text-red-700">
        {label} *
      </label>

      {/* Selected Values Display */}
      {selectedValues.length > 0 && (
        <div className="mb-2 p-2 border rounded-md bg-gray-50 max-h-32 overflow-y-auto">
          <div className="flex flex-wrap gap-1">
            {selectedValues.map((value, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs text-white"
                style={{ backgroundColor: "#7d0a0a" }}
              >
                {value}
                <button
                  onClick={() => handleRemove(value)}
                  className="ml-1 hover:bg-red-800 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Dropdown Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full border rounded-md p-2 pr-8 text-sm focus:outline-none"
          style={{ borderColor: "#7d0a0a" }}
          placeholder={placeholder}
        />
        <ChevronDown
          size={16}
          className={`absolute right-2 top-3 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: "#7d0a0a" }}
        />
      </div>

      {/*Dropdown input*/}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-64 overflow-y-auto">
          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <div
                key={index}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent input blur
                  handleSelect(option.country);
                }}
                className={`p-2 text-sm cursor-pointer border-b last:border-b-0 ${
                  selectedValues.includes(option.country)
                    ? "bg-red-50 text-red-700 hover:bg-red-100"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.country}</span>
                  {selectedValues.includes(option.country) && (
                    <span className="text-xs text-red-600 font-medium">
                      <Check className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
