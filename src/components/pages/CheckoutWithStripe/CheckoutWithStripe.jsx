import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useParams } from "react-router-dom";
import PaymentForm from "./PaymentForm";
import "./CheckoutWithStripe.scss";
const stripePromise = loadStripe(
  "pk_test_51NL6vWB09khdlanwyFt1NxkPhjAeE1viaERLXhqj4x5jU2e8IJ4jAozckJR8zqBYmvL6lF6ofMTNOtw9OJABQmRv00FhdHmmOi"
);

const CheckoutWithStripe = () => {
  const [clientSecret, setClientSecret] = useState("");
  const { prod_id } = useParams();

  useEffect(() => {
    console.log("da zo checkout stripe");

    fetch("http://127.0.0.1:8000/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 100 }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        console.log(data.client_secret);
        setClientSecret(data.client_secret);
      });
    console.log("da zo checkout stripe");
  }, []);

  const options = {
    clientSecret: clientSecret,
  };

  return (
    <div className="container">
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PaymentForm />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutWithStripe;
