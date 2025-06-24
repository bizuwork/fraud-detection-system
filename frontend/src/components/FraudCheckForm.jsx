import { useState } from "react";

export default function FraudCheckForm() {
  const [formData, setFormData] = useState({
    amount: '',
    isNewUser: false,
    location: 'low-risk',
    deviceFingerprint: true,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/fraud-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case "safe":
        return "bg-green-100 text-green-800";
      case "suspicious":
        return "bg-yellow-100 text-yellow-800";
      case "fraud":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-lg mx-auto">
      <h3 className="text-xl font-bold mb-4">Check Transaction for Fraud</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Transaction Amount ($)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isNewUser"
            checked={formData.isNewUser}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Is New User?</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low-risk">Low Risk</option>
            <option value="medium-risk">Medium Risk</option>
            <option value="high-risk">High Risk</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="deviceFingerprint"
            checked={formData.deviceFingerprint}
            onChange={handleChange}
            className="mr-2"
          />
          <label>Device Fingerprint Present?</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
        >
          {loading ? "Checking..." : "Check for Fraud"}
        </button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Result:</h4>
          <div className={`inline-block px-3 py-1 rounded ${getRiskBadgeColor(result.riskLevel)}`}>
            {result.riskLevel.toUpperCase()}
          </div>
          <p className="mt-2">Confidence: {(result.confidence * 100).toFixed(0)}%</p>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Match Details:</strong></p>
            <ul className="list-disc list-inside ml-4 mt-1">
              {result.matchDetails.highAmount && <li>High transaction amount</li>}
              {result.matchDetails.newUserFlagged && <li>New user with large amount</li>}
              {result.matchDetails.locationFlagged && <li>High-risk location</li>}
              {result.matchDetails.missingDeviceFingerprint && <li>Missing device fingerprint</li>}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}