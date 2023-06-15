/**
 * User Info tab for User Profile
 * file: UserInfo.jsx
 */

import { Stack, Typography, useMediaQuery } from "@mui/material";
import { Formik, Form, Field } from "formik";
import React, { useEffect, useRef, useState } from "react";
import OutlinedInput from "../../molecules/TextField/OutlinedInput";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/firebase-config";
import AvatarButton from "../AvatarButton/AvatarButton";
import MuiCustomButton from "../../atoms/Button/MuiCustomButton";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getAPIActionJSON } from "../../../../api/ApiActions";
const errorStyle = {
  marginTop: "5px",
  marginLeft: "15px",
  color: "red",
};

const UserInfo = () => {
  const tabletMatches = useMediaQuery("(min-width: 768px)");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
  const userInfo = useSelector((state) => state.users);
  console.log(userInfo);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [accountInfo, setAccountInfo] = useState({
    id: "",
    name: "",
    email: "",
    phone_number: "",
    profile_picture: "",
    address: "",
    items: [],
    orders: [],
  });

  const handleChangeImage = (image) => {
    setSelectedImage(image);
  };

  const formRef = useRef();
  const userId = useSelector((state) => state.users.id);
  console.log("user id: " + userId);
  const handleResponse = (response) => {
    if (!response.success) {
      toast.error(response.message);
      console.log(response.message);
      return;
    }
    toast.success("Cập nhật thông tin thành công!");
  };
  const handleSubmit = async () => {
    const { profile_picture, ...data } = { ...formRef.current?.values };
    data.picture = selectedImage;
    console.log(data.picture);
    dispatch(
      getAPIActionJSON("update_user", data, null, `/${userId}`, (e) =>
        handleResponse(e)
      )
    );
  };
  const orders = useSelector((state) => state.users.orders);

  const handleResponseGetOrders = (response) => {
    console.log(response);
    if (!response.success) {
      console.log("nooooooooooooo", response);
      return;
    }
    console.log("order: ", orders);
  };
  const getOrders = () => {
    dispatch(
      getAPIActionJSON("get_user_orders", null, null, `/${userId}`, (e) =>
        handleResponseGetOrders(e)
      )
    );
  };
  useEffect(() => {
    if (!isLoggedIn) navigate("/");
    else {
      setAccountInfo(userInfo);
    }
    getOrders();
  }, [isLoggedIn, navigate, userInfo]);

  return (
    <div className="user-tab">
      <Typography variant="h3">My Account</Typography>
      <Formik
        innerRef={formRef}
        enableReinitialize
        initialValues={accountInfo}
        validate={(values) => {
          const errors = {};

          //regex for fullname
          if (
            values.name &&
            !/^[a-zA-Z0-9ỳọáầảấờễàạằệếýộậốũứĩõúữịỗìềểẩớặòùồợãụủíỹắẫựỉỏừỷởóéửỵẳẹèẽổẵẻỡơôưăêâđ' ]+$/.test(
              values.name
            )
          ) {
            errors.name = "Invalid name";
          }

          if (values.age && !/^\d+$/.test(values.age)) {
            errors.age = "Age can only contain numbers";
          }

          //regex for email
          if (!values.email) {
            errors.email = "Required";
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = "Invalid email address";
          }

          //regex for phonenumber
          if (values.phone_number && !/^\d+$/.test(values.phone_number)) {
            errors.phone_number = "Phone number can only contain numbers";
          }

          return errors;
        }}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Form
            style={{
              width: "100%",
              marginTop: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",
              }}
            >
              <AvatarButton
                data={props.values.profile_picture}
                handleChangeImage={handleChangeImage}
              >
                <label htmlFor="profile-picture-input">
                  <img
                    src={props.data}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                    alt=""
                  />
                  <input
                    id="profile-picture-input"
                    type="file"
                    accept="image/*"
                    onChange={props.onFileSelect}
                    style={{ display: "none" }}
                  />
                </label>
              </AvatarButton>
              <Stack sx={{ width: "100%" }} spacing={3}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: tabletMatches ? "row" : "column",
                    gap: tabletMatches ? "10px" : "25px",
                  }}
                >
                  <Field name="name">
                    {({ field, meta }) => (
                      <div style={{ width: "100%" }}>
                        <OutlinedInput
                          label="Full name"
                          type="text"
                          style={{ width: "100%" }}
                          {...field}
                        />
                        {meta.touched && meta.error && (
                          <div style={errorStyle}>{meta.error}</div>
                        )}
                      </div>
                    )}
                  </Field>
                </div>
                <Field name="email">
                  {({ field, meta }) => (
                    <>
                      <OutlinedInput
                        label="Email"
                        type="email"
                        disabled={true}
                        {...field}
                      />
                      {meta.touched && meta.error && (
                        <div style={errorStyle}>{meta.error}</div>
                      )}
                    </>
                  )}
                </Field>
                <Field name="address">
                  {({ field, meta }) => (
                    <>
                      <OutlinedInput label="Address" type="text" {...field} />
                      {meta.touched && meta.error && (
                        <div style={errorStyle}>{meta.error}</div>
                      )}
                    </>
                  )}
                </Field>
                <Field name="phone_number">
                  {({ field, meta }) => (
                    <>
                      <OutlinedInput
                        label="Phone Number"
                        type="text"
                        {...field}
                      />
                      {meta.touched && meta.error && (
                        <div style={errorStyle}>{meta.error}</div>
                      )}
                    </>
                  )}
                </Field>
              </Stack>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <MuiCustomButton type="submit">Save</MuiCustomButton>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserInfo;
