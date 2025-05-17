// controllers/paymentController.js
import axios from "axios";

export const initiateKhaltiPayment = async (req, res) => {
  try {
    const payload = req.body;

    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: "Key 176cdc64fb8e4ca4a9c2308955323bd1", // ⬅️ Replace with live key in prod
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Khalti payment error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to initiate Khalti payment." });
  }
};

export const verifyKhaltiPayment = async (req, res) => {
  const { pidx } = req.body;

  try {
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: "Key 176cdc64fb8e4ca4a9c2308955323bd1",
          "Content-Type": "application/json",
        },
      }
    );

    ///add here

    res.status(200).json(response.data);
  } catch (err) {
    console.error("Verification failed:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to verify payment." });
  }
};
