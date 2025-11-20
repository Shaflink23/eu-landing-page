import * as React from "react";
import { PhoneInput } from "@/components/ui/phone-input";

export function PhoneInputExample() {
  const [phoneValue, setPhoneValue] = React.useState("");
  const [errorValue, setErrorValue] = React.useState("");
  const [disabledValue, setDisabledValue] = React.useState("");

  return (
    <div className="p-6 max-w-lg space-y-6">
      <h2 className="text-xl font-semibold mb-4">Phone Input with Country Selector</h2>
      
      {/* Basic Phone Input */}
      <div>
        <h3 className="text-lg font-medium mb-2">Basic Phone Input (Full Width)</h3>
        <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>
          Phone Number <span className="text-red-500">*</span>
        </label>
        <PhoneInput
          value={phoneValue}
          onChange={setPhoneValue}
          placeholder="Enter phone number"
          required
          className="w-full"
        />
        <div className="mt-2 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Current value:</strong> {phoneValue || "No phone number entered"}
          </p>
        </div>
      </div>

      {/* Error State Example */}
      <div>
        <h3 className="text-lg font-medium mb-2">Error State (Full Width)</h3>
        <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>
          Phone Number (Invalid)
        </label>
        <PhoneInput
          value={errorValue}
          onChange={setErrorValue}
          placeholder="Enter phone number"
          error={true}
          className="w-full"
        />
        <div className="mt-2 p-3 bg-red-50 rounded-md">
          <p className="text-sm text-red-600">
            This shows the error styling with full width
          </p>
        </div>
      </div>

      {/* Disabled State Example */}
      <div>
        <h3 className="text-lg font-medium mb-2">Disabled State (Full Width)</h3>
        <label className="block text-gray-700 mb-2" style={{ fontSize: '14px', fontFamily: 'Roboto, sans-serif', fontWeight: 400 }}>
          Phone Number (Disabled)
        </label>
        <PhoneInput
          value={disabledValue}
          onChange={setDisabledValue}
          placeholder="Enter phone number"
          disabled={true}
          className="w-full"
        />
        <div className="mt-2 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            This shows the disabled styling with full width
          </p>
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">✨ Enhanced Features:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>📏 <strong>Full Width Support:</strong> Phone input now takes full available width</li>
          <li>🔍 <strong>Searchable:</strong> Search countries by name, code, or dial code</li>
          <li>🏁 <strong>Smart Search:</strong> "Uganda", "UG", or "+256" all work</li>
          <li>🏳️ <strong>Flag Integration:</strong> Visual flags for easy identification</li>
          <li>🎨 <strong>Form Styling:</strong> Matches your existing form design</li>
          <li>✅ <strong>Error States:</strong> Visual error feedback</li>
          <li>🔒 <strong>Accessibility:</strong> Full keyboard navigation</li>
          <li>📱 <strong>Responsive:</strong> Works on all screen sizes</li>
          <li>🌍 <strong>Comprehensive:</strong> 200+ countries supported</li>
          <li>⚡ <strong>Performance:</strong> Optimized filtering and rendering</li>
          <li>🎯 <strong>User Experience:</strong> Auto-focus search, clear button</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-md font-semibold text-blue-800 mb-2">🎮 Try it out:</h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. ✅ <strong>Full width layout:</strong> Phone input now takes full container width</li>
          <li>2. 🔍 Click the country dropdown to see the search interface</li>
          <li>3. 🏁 Type "Uganda" or "+256" to test the search functionality</li>
          <li>4. 🎯 Try searching by country code like "US" or "UK"</li>
          <li>5. 🌍 Select different countries to see automatic formatting</li>
        </ol>
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="text-md font-semibold text-green-800 mb-2">✅ Recent Fixes:</h4>
        <ul className="text-sm text-green-700 space-y-1">
          <li>• <strong>Label Display:</strong> Phone number label now shows correctly</li>
          <li>• <strong>Full Width:</strong> Phone input takes full width when className="w-full"</li>
          <li>• <strong>Proper Spacing:</strong> Maintains good spacing between elements</li>
          <li>• <strong>Consistent Styling:</strong> Matches your form's existing design patterns</li>
        </ul>
      </div>
    </div>
  );
}