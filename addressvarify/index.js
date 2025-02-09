// // Make sure you have the Google Cloud SDK installed and configured.
// // You'll need to create a Google Cloud project and enable the Gemini API.
// // Replace 'YOUR_GEMINI_API_KEY' with your actual Gemini API key.

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// async function validateAddress(address) {
//   const genAI = new GoogleGenerativeAI('AIzaSyCN2jeGenN-9ZkYvI2ZpxO80l1GWDrSdns'); // Replace with your API key
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Or gemini-pro if 1.5 isn't available

//   const prompt = `Is the following address a valid and real address? Please answer only with "valid" or "invalid".  Address: ${address}`;


//   try {
//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();

//     // Clean up the response (remove extra whitespace and convert to lowercase)
//     const cleanedResponse = responseText.trim().toLowerCase();

//     if (cleanedResponse.includes("valid")) {
//       return true;
//     } else if (cleanedResponse.includes("invalid")) {
//       return false;
//     } else {
//       console.warn("Unexpected response from Gemini API:", responseText);
//       return null; // Indicate an ambiguous or error response
//     }

//   } catch (error) {
//     console.error("Error validating address:", error);
//     return null; // Indicate an error occurred.
//   }
// }


// // Example usage:
// async function main() {
//   const addressToCheck = "ysuuf"; // Example valid address
//   //const addressToCheck = "jklsdfj;lksdfj"; //Example Invalid Address.

//   const isValid = await validateAddress(addressToCheck);

//   if (isValid === true) {
//     console.log(`${addressToCheck} is a valid address.`);
//   } else if (isValid === false) {
//     console.log(`${addressToCheck} is an invalid address.`);
//   } else {
//     console.log(`Could not determine the validity of ${addressToCheck}. Please check the API Key and internet connectivity.`);
//   }
// }

// main();








async function verifyAddress(address, apiKey) {
    /**
     * Verifies an address using the Google Maps Geocoding API.
     * Requires an API key with Geocoding API enabled.
     *
     * @param {string} address The address to verify.
     * @param {string} apiKey Your Google Maps API key.
     * @returns {Promise<object>} A promise that resolves to an object containing:
     *   - valid: {boolean} True if the address is valid, false otherwise.
     *   - formattedAddress: {string | null} The fully formatted address if valid, null otherwise.
     *   - errorMessage: {string | null}  An error message if there was an issue, null otherwise.
     */
  
    const geocodingApiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
  
    try {
      const response = await fetch(`${geocodingApiUrl}?address=${encodeURIComponent(address)}&key=${apiKey}`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (data.status === 'OK') {
        const formattedAddress = data.results[0].formatted_address;
        return { valid: true, formattedAddress: formattedAddress, errorMessage: null };
      } else if (data.status === 'ZERO_RESULTS') {
        return { valid: false, formattedAddress: null, errorMessage: 'Address not found.' };
      } else {
        return { valid: false, formattedAddress: null, errorMessage: `Geocoding API error: ${data.status}` };
      }
    } catch (error) {
      console.error("Error verifying address:", error);
      return { valid: false, formattedAddress: null, errorMessage: `An error occurred: ${error.message}` };
    }
  }
  
  
  
  // Example usage (replace with your API key and address):
  const apiKey = "AIzaSyCN2jeGenN-9ZkYvI2ZpxO80l1GWDrSdns"; // Replace with your actual API Key. DO NOT HARDCODE YOUR API KEY IN PRODUCTION CODE
  const addressToVerify = "cvr college"; //Replace with address
  
  verifyAddress(addressToVerify, apiKey)
    .then(result => {
      if (result.valid) {
        console.log("Address is valid.");
        console.log("Formatted Address:", result.formattedAddress);
      } else {
        console.log("Address is invalid.");
        console.log("Error:", result.errorMessage);
      }
    })
    .catch(error => {
      console.error("An error occurred:", error);
    });
  
  // Example usage with an invalid address:
  const invalidAddress = "this is not a real address";
  
  verifyAddress(invalidAddress, apiKey)
    .then(result => {
      if (result.valid) {
        console.log("Address is valid.");
        console.log("Formatted Address:", result.formattedAddress);
      } else {
        console.log("Address is invalid.");
        console.log("Error:", result.errorMessage);
      }
    })
    .catch(error => {
      console.error("An error occurred:", error);
    });