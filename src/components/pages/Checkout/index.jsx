/**
 * Check out page
 * file: (Checkout/) index.jsx
 */
import {
  Button,
  Dialog,
  FormHelperText,
  Grid,
  OutlinedInput,
} from "@mui/material";
import { FormControlLabel, Checkbox } from "@mui/material";

import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-mui";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../contexts/auth-context";
import { auth, db } from "../../../firebase/firebase-config";
import ProductItem from "../../molecules/ProductItem/ProductItem";
import "./checkout.scss";
import {
  getAPIActionJSON,
  getAPIActionJSONNoMulti,
} from "../../../../api/ApiActions";
import { removeItem } from "../../../store/reducers/basketSlice";
moment().format();

const Checkout = () => {
  const dataBasket = useSelector((state) => state.basket);
  const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
  const userInfo = useSelector((state) => state.users);
  console.log("data ne", userInfo);
  const location = useLocation();
  const [paymentWhenReceive, setPaymentWhenReceive] = useState(false);
  const handleChangeCheckBox = (value) => {
    console.log("value", value);
    setPaymentWhenReceive(!value);
  };
  // const formikRef = useRef();
  const { cartItem, totalAmount, totalQuantity } = dataBasket;
  const [value, setValue] = useState(moment()); //state này lưu giá trị field ngày tháng
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleDateChange = (newValue) => {
    setValue(newValue);
  };

  console.log("cart item ", cartItem);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
  }, [isLoggedIn, navigate]);
  const handleResponse = (response) => {
    if (!response.success) {
      toast.error(response.message);
      console.log(response.message);
      return;
    }
    cartItem.forEach((item) => {
      dispatch(removeItem(item.id)); // Pass the ID of the item to be removed
    });
    toast.success("Your order has been confirm!!");
    navigate("/products");
  };
  const handlePaymentWithReceive = (values) => {
    console.log("go to payment when receive");
    const data = {
      total: totalAmount,
      address: values.billing,
      status: "Pending",
      items: cartItem.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
        shop_id: item.shop.id,
      })),
      user_id: userInfo.id,
    };
    console.log("data", data);
    dispatch(
      getAPIActionJSONNoMulti(
        "create_order",
        {
          total: totalAmount,
          address: values.billing,
          status: "Pending",
          items: cartItem.map((item) => ({
            id: item.productId,
            quantity: item.quantity,
            shop_id: item.shop.id,
          })),
          user_id: userInfo.id,
          is_paid: false,
        },
        null,
        "",
        (e) => handleResponse(e)
      )
    );
  };
  const handlePaymentWithCard = () => {
    navigate("/checkout-with-stripe");
  };
  const handleCreateOrder = async (values) => {
    console.log("go to checkout");
    navigate("/checkout-with-stripe");
    // const data = {
    //   total: totalAmount,
    //   address: values.billing,
    //   status: "Pending",
    //   items: cartItem.map((item) => ({
    //     id: item.productId,
    //     quantity: item.quantity,
    //     shop_id: item.shop.id,
    //   })),
    //   user_id: userInfo.id,
    // };
    // console.log("data", data);
    // dispatch(
    //   getAPIActionJSONNoMulti(
    //     "create_order",
    //     {
    //       total: totalAmount,
    //       address: values.billing,
    //       status: "Pending",
    //       items: cartItem.map((item) => ({
    //         id: item.productId,
    //         quantity: item.quantity,
    //         shop_id: item.shop.id,
    //       })),
    //       user_id: userInfo.id,
    //     },
    //     null,
    //     "",
    //     (e) => handleResponse(e)
    //   )
    // );
  };
  return (
    <section className="checkout">
      {/* <Header /> */}
      <main className="body">
        <div className="body__product">
          <div>Quantities: {totalQuantity}</div>
          {cartItem.map((item) => (
            <ProductItem
              key={item.id}
              id={item.id}
              image={item.image}
              category={item.category}
              desc={item.description}
              sizes={item.sizes}
              color={item.color}
              quantity={item.quantity}
              stock={item.stock}
              price={item.price}
              totalPrice={item.totalPrice}
              productId={item.productId}
              fromBasket={false}
            />
          ))}

          <div style={{ alignSelf: "flex-end" }}>
            Subtotal:{" "}
            {totalAmount.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </div>
        </div>

        {/* Formik dành cho MUI  */}
        <Formik
          // ref={(ref) => (formikRef.current = ref)}
          initialValues={{
            firstname:
              userInfo.name.split(" ").length > 1
                ? userInfo?.name.split(" ")[0]
                : userInfo?.name,
            lastname:
              userInfo?.name.split(" ").length > 1
                ? userInfo.name.split(" ").slice(1).join(" ")
                : "",
            email: userInfo?.email,
            phone: userInfo?.phone_number,
            billing: userInfo?.address,
            cardnumber: "",
            cvc: "",
            expirydate: "",
            zip: "",
          }}
          validate={(values) => {
            const errors = {};
            if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            if (values.cvc.length > 3) {
              errors.cvc = "Invalid CVC";
            }
            if (values.phone.length !== 10) {
              errors.phone = "Invalid phone number";
            }
            return errors;
          }}
          enableReinitialize={true}
          onSubmit={async (values, actions) => {
            // handleCreateOrder(values);

            // Use the flag variable to perform the appropriate action
            if (!paymentWhenReceive) {
              handlePaymentWithCard(values);
            } else {
              handlePaymentWithReceive(values);
            }
          }}
        >
          {({ submitForm, handleChange, values }) => (
            <Form style={{ width: "100%" }}>
              <Grid spacing={2} container>
                <Grid item xs={6}>
                  <Field
                    value={values.firstname}
                    // label="First name"
                    onChange={handleChange}
                    component={TextField}
                    name="firstname"
                    type="text"
                  />
                  <Field component={FormHelperText}>First name</Field>
                </Grid>
                <Grid item xs={6}>
                  <Field
                    value={values.lastname}
                    // label="Last name"
                    onChange={handleChange}
                    component={TextField}
                    name="lastname"
                    type="text"
                  />
                  <Field component={FormHelperText}>Last name</Field>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    value={values.email}
                    onChange={handleChange}
                    component={TextField}
                    name="email"
                    type="email"
                  />
                  <Field component={FormHelperText}>Email</Field>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    value={values.phone}
                    onChange={handleChange}
                    component={TextField}
                    name="phone"
                    type="text"
                  />
                  <Field component={FormHelperText}>Phone number</Field>
                </Grid>
                <Grid item xs={12}>
                  <Field
                    value={values.billing}
                    onChange={handleChange}
                    component={TextField}
                    name="billing"
                    type="text"
                  />
                  <Field component={FormHelperText}>Billing address</Field>
                </Grid>
                <Grid item xs={8}>
                  <Field component={TextField} name="cardnumber" type="text" />
                  <Field component={FormHelperText}>
                    Card number (If empty is payment when receive)
                  </Field>
                </Grid>
                <Grid item xs={4}>
                  <Field component={TextField} name="cvc" type="text" />
                  <Field component={FormHelperText}>CVC (3 digit)</Field>
                </Grid>
                <Grid item xs={3}>
                  <MobileDatePicker
                    inputFormat="MM/DD/YYYY"
                    value={value}
                    onChange={handleDateChange}
                    renderInput={(params) => <OutlinedInput {...params} />}
                  />
                  <Field component={FormHelperText}>Expiry date</Field>
                </Grid>
                <Grid item xs={9}>
                  <Field component={TextField} name="zip" type="text" />
                  <Field component={FormHelperText}>ZIP code</Field>
                </Grid>
                <Grid item xs={9}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.paymentWhenReceive}
                        onChange={() =>
                          handleChangeCheckBox(event.target.checked)
                        }
                        name="paymentWhenReceive"
                        color="primary"
                        labelPlacement="end"
                      />
                    }
                    label="Payment when receive"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    onClick={submitForm}
                    variant="contained"
                    color="primary"
                  >
                    Order
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </main>
    </section>
  );
};

export default Checkout;
