import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import "./CheckoutWithStripe.scss";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log(email);

  useEffect(() => {
    console.log(message);
  }, [message]);

  const handleSuccess = () => {
    toast.success("Payment successful!");
    navigate("/", { replace: true }); // Add { replace: true } to replace the current history entry
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://127.0.0.1:5173/success",
        receipt_email: email,
      },
      // Uncomment below if you only want redirect for redirect-based payments
      // redirect: '/success',
    });

    if (error) {
      console.log("Error: ", error.message);
      setMessage(error.message);
    } else {
      console.log("Payment succeeded");
      handleSuccess();
    }
    setIsLoading(false);
  };

  return (
    <div>
      <form id="payment-form" onSubmit={handleSubmit}>
        <input
          id="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address"
        />
        <PaymentElement id="payment-element" />
        <button disabled={isLoading || !stripe || !elements} id="submit">
          <span id="button-text">
            {isLoading ? <div className="spinner" id="spinner" /> : "Pay now"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </div>
  );
};

export default PaymentForm;
