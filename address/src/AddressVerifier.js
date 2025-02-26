// import { useState } from "react";

// async function giveCoordinates(location) {
//   try {
//     const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
//       location
//     )}&format=json&limit=1`;

//     const response = await fetch(geocodingUrl);
//     const data = await response.json();

//     if (data && data.length > 0) {
//       const latitude = parseFloat(data[0].lat);
//       const longitude = parseFloat(data[0].lon);

//       if (
//         !isNaN(latitude) &&
//         !isNaN(longitude) &&
//         latitude >= -90 &&
//         latitude <= 90 &&
//         longitude >= -180 &&
//         longitude <= 180
//       ) {
//         return { latitude, longitude, valid: true };
//       }
//     }

//     return { valid: false };
//   } catch (error) {
//     console.error(`Error finding coordinates for ${location}:`, error);
//     return { valid: false };
//   }
// }

// export default function AddressVerifier() {
//   const [address, setAddress] = useState("");
//   const [verificationResult, setVerificationResult] = useState(null);

//   const handleVerify = async () => {
//     const result = await giveCoordinates(address);
//     setVerificationResult(result.valid ? "Address is correct" : "Address is incorrect");
//   };

//   return (
//     <div style={{ textAlign: "center", marginTop: "20px" }}>
//       <h2>Address Verification</h2>
//       <input
//         type="text"
//         value={address}
//         onChange={(e) => setAddress(e.target.value)}
//         placeholder="Enter address"
//         style={{ padding: "10px", width: "300px", marginRight: "10px" }}
//       />
//       <button onClick={handleVerify} style={{ padding: "10px 20px" }}>Verify</button>
//       {verificationResult && <p style={{ marginTop: "10px" }}>{verificationResult}</p>}
//     </div>
//   );
// }





import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AddressVerifier = () => {
  const [address, setAddress] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [resMessage, setResMessage] = useState("");
  const [isVendor, setIsVendor] = useState(false);
  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    if (lat !== null && long !== null) {
      console.log("Coordinates updated:", lat, long);
    }
  }, [lat, long]);

  async function giveCoordinates(location) {
    try {
      // Try OpenStreetMap Geocoding API
      const geocodingUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        location
      )}&format=json&limit=1`;

      const response = await fetch(geocodingUrl);
      const data = await response.json();

      if (data && data.length > 0) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);

        if (!isNaN(latitude) && !isNaN(longitude)) {
          setLat(latitude);
          setLong(longitude);
          return [latitude, longitude];
        }
      }

      // If OpenStreetMap fails, try Google Geocoding API
      const geminiApiKey = "AIzaSyCN2jeGenN-9ZkYvI2ZpxO80l1GWDrSdns";
      const genAI = new GoogleGenerativeAI(geminiApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Give me ONLY the exact latitude and longitude coordinates for ${location} in decimal degrees format (e.g., 12.9716° N, 77.5946° E).`;

      const result = await model.generateContent(prompt);
      const response2 = await result.response;
      const text = await response2.text();

      // Extract coordinates from the response
      const regex = /([-+]?\d+\.\d+)\D*([-+]?\d+\.\d+)/;
      const match = text.match(regex);

      if (match) {
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[2]);

        if (!isNaN(latitude) && !isNaN(longitude)) {
          setLat(latitude);
          setLong(longitude);
          return [latitude, longitude];
        }
      }

      throw new Error("Could not find valid coordinates for the location");
    } catch (error) {
      console.error(`Error finding coordinates for ${location}:`, error);
      return null;
    }
  }

  const handleVerify = async () => {
    setSpinner(true);
    const coordinates = await giveCoordinates(address);
    if (coordinates) {
      setVerificationResult("Address is correct");
    } else {
      setVerificationResult("Address is incorrect");
    }
    setSpinner(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h2>Address Verification</h2>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter address"
        style={{ padding: "10px", width: "300px", marginRight: "10px" }}
      />
      <button onClick={handleVerify} style={{ padding: "10px 20px" }}>
        {spinner ? "Verifying..." : "Verify"}
      </button>
      {verificationResult && <p style={{ marginTop: "10px" }}>{verificationResult}</p>}
    </div>
  );
};

export default AddressVerifier;
