"use client";
import { useGlobalContext } from "@/context/globalContext";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { MapPin, Globe, Building2 } from "lucide-react";

function JobLocation() {
  const { setLocation, location } = useGlobalContext();
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocation((prev: {}) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <MapPin size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Job Location</h3>
          <p className="text-sm text-gray-600">Specify where this job is located</p>
        </div>
      </div>

      {/* Location Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country */}
        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Globe size={16} className="text-green-600" />
            Country
          </Label>
          <Input
            type="text"
            id="country"
            name="country"
            value={location.country}
            onChange={handleLocationChange}
            className="h-12 px-4 border-2 border-gray-200 focus:border-green-500 rounded-xl"
            placeholder="e.g., United States"
          />
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Building2 size={16} className="text-green-600" />
            City
          </Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={location.city}
            onChange={handleLocationChange}
            className="h-12 px-4 border-2 border-gray-200 focus:border-green-500 rounded-xl"
            placeholder="e.g., San Francisco"
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <MapPin size={16} className="text-green-600" />
          Address (Optional)
        </Label>
        <Input
          type="text"
          id="address"
          name="address"
          value={location.address}
          onChange={handleLocationChange}
          className="h-12 px-4 border-2 border-gray-200 focus:border-green-500 rounded-xl"
          placeholder="e.g., 123 Main Street, Suite 100"
        />
      </div>

      {/* Preview */}
      {(location.country || location.city || location.address) && (
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Location Preview</p>
          <p className="text-sm font-medium text-gray-900">
            {[location.address, location.city, location.country].filter(Boolean).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

export default JobLocation;