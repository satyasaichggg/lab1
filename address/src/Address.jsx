import React, { useState } from "react";

const Address = () => {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    setAddress(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (address.trim() === "") {
      setMessage("Address cannot be empty.");
    } else {
      setMessage("Address verified successfully!");
    }
  };

  return (
    <div>
      <h1>Address Verifier</h1>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={handleChange}
        />
        <button type="submit">Verify</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Address;
