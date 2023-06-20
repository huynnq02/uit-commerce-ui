import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { nanoid } from "@reduxjs/toolkit";
import { addBasket } from "../../../store/reducers/basketSlice";
import Grid from "@mui/material/Grid";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";
import React from "react";
import "../../../scss/ProductDetail/ProductDetailContent.scss";
import Button from "../../atoms/Button/Button";
import Quantity from "../../molecules/Quantity/Quantity";
import Size from "../../atoms/Size/Size";
import SubImage from "../../atoms/SubImage/SubImage";
import SliderSlick from "../../molecules/SliderSlick/SliderSlick";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

import {
  getAPIActionJSON,
  getAPIActionJSONNoMulti,
} from "../../../../api/ApiActions";
const ProductDetailContent = ({
  data,
  sizePicker,
  setSizePicker,
  setQuant,
  quant,
  listImages,
  setColorPicker,
  colorPicker,
  productId,
}) => {
  const isLoggedIn = useSelector((state) => state.users.isLoggedIn);
  const userId = useSelector((state) => state.users.id);
  const [isBought, setIsBought] = useState(false);
  const dispatch = useDispatch();
  const [reviewList, setReviewList] = useState([]);

  console.log("is logged in: ", isLoggedIn);
  console.log("user id: ", userId);
  console.log("product id: ", productId);

  const handleResponse = (response) => {
    console.log(response);
    if (!response.success) {
      console.log("nooooooooooooo", response);
      return;
    }
    console.log("response: ", response.data);
    setIsBought(response.data);
  };
  const checkItemBought = () => {
    dispatch(
      getAPIActionJSON(
        "check_item_bought",
        null,
        null,
        `/${userId}/${productId}`,
        (e) => handleResponse(e)
      )
    );
  };
  const handleResponseGetReviews = (response) => {
    console.log(response);
    if (!response.success) {
      console.log("nooooooooooooo", response);
      return;
    }
    console.log("responsee review: ", response.data);
    setReviewList(response.data);
  };
  const getReviews = () => {
    dispatch(
      getAPIActionJSON(
        "get_review_of_an_item",
        null,
        null,
        `/${productId}`,
        (e) => handleResponseGetReviews(e)
      )
    );
  };
  const handleResponseCreateReview = (response) => {
    console.log(response);
    if (!response.success) {
      console.log("nooooooooooooo", response);
      return;
    }
    console.log("response: ", response.data);

    // Add the new review to the list
    const newReview = {
      id: response.id,
      content: response.content,
      rating: response.star,
    };
    setReviewList((prevList) => [...prevList, newReview]);

    // Clear the review text and rating inputs
    setReviewText("");
    setRating(0);
  };
  function calculateAverageRating(reviewList) {
    const totalRating = reviewList.reduce(
      (sum, review) => sum + parseInt(review.star),
      0
    );
    const averageRating = totalRating / reviewList.length;
    return averageRating.toFixed(1); // Round to one decimal place
  }
  useEffect(() => {
    getReviews();
    if (isLoggedIn) {
      checkItemBought();
    }
  }, [isBought, isLoggedIn]);
  //state này để lưu size S,M,L,...
  //ban đầu ấn add to basket sẽ lưu vô local
  // const [sizePicker, setSizePicker] = useState(data.sizes[0]);
  // const [quant, setQuant] = useState(1);
  //Lấy ra ở đây để dùng trong các trường hợp query 1 sản phẩm theo id
  const [defaultImage, setDefaultImage] = useState(data.image);
  const navigate = useNavigate();
  const [reviewText, setReviewText] = useState(""); // State for the review text
  const [rating, setRating] = useState(0); // State for the star rating
  const mdMatches = useMediaQuery("(min-width:600px)");
  const lgMatches = useMediaQuery("(min-width:1200px)");
  console.log("product detail: ", data);

  const handleReviewTextChange = (event) => {
    setReviewText(event.target.value);
  };

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleAddReview = () => {
    // Add logic to submit the review and rating
    console.log("Review Text:", reviewText);
    console.log("Rating:", rating);
    console.log("Product ID:", productId);
    dispatch(
      getAPIActionJSONNoMulti(
        "create_review",
        {
          content: reviewText,
          star: rating,
          item: productId,
        },
        null,
        "",
        (e) => handleResponseCreateReview(e)
      )
    );
  };

  const handleAddtoCart = () => {
    if (quant < 1) {
      toast.error("Please choose quantity");
    } else {
      const productStringify = {
        id: nanoid(),
        category: data.category,
        price: data.price,
        description: data.description,
        quantity: quant,
        sizes: sizePicker,
        stock: data.quantities,
        color: colorPicker,
        image: data.image,
        totalPrice: data.price * quant,
        productId: productId,
        shop: data.shop,
      };
      console.log("productStringify", productStringify);
      dispatch(addBasket(productStringify));
    }
  };

  const handleChangeDefaultImage = (src) => {
    setDefaultImage(src);
  };
  const handleSetColor = (color) => {
    console.log(color);
    setColorPicker(color);
  };
  return (
    <div className="container">
      <Container style={{ padding: 0 }}>
        <Grid className="grid" container>
          <Grid item xs={12} lg={6}>
            <Grid>
              <img
                src={defaultImage ? defaultImage : data.image}
                className="productDetail-img"
                alt={defaultImage ? defaultImage : data.image}
              />
            </Grid>
            <Grid item>
              <SliderSlick
                showItem={listImages?.length < 3 ? listImages?.length : 3}
              >
                {listImages?.map((item, idx) => (
                  <SubImage
                    key={idx}
                    data={item}
                    onClick={() => {
                      handleChangeDefaultImage(item);
                    }}
                  />
                ))}
              </SliderSlick>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Container maxWidth="sm" style={{ padding: "28px" }}>
              <h3
                className="productDetail__topContent-name"
                style={{ color: "black" }}
              >
                {data.shop?.name}
              </h3>

              <div className="productDetail__topContent">
                <h3 className="productDetail__topContent-name">{data.name}</h3>
                <p className="productDetail__topContent-price">
                  {data?.price?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
              <div className="productDetail__description">
                <h5 className="productDetail__description-title">
                  Product description
                </h5>
                <p className="productDetail__description-content">
                  {parse(data.description || "")}
                </p>
              </div>
              <div className="productDetail__dimension">
                <h5 className="productDetail__dimension-title">Dimensions</h5>
                <Grid
                  container
                  spacing={1}
                  sx={{ justifyContent: "space-between" }}
                >
                  {data?.sizes?.map((item, idx) => (
                    <Grid item key={idx}>
                      <Size
                        picked={sizePicker === item}
                        onClick={() => setSizePicker(item)}
                        size={item}
                      />
                    </Grid>
                  ))}
                </Grid>
                <div className="productDetail__dimension-colors"></div>
              </div>
              <ul className="productDetail__description-colors">
                {data.colors?.map((item, idx) => (
                  <li
                    className="productDetail__description-color"
                    style={{
                      backgroundColor: item,
                      border:
                        colorPicker === item
                          ? `3px solid ${item}`
                          : ` 3px #fff solid`,
                    }}
                    onClick={handleSetColor.bind(this, item)}
                  ></li>
                ))}
              </ul>
              <div className="productDetail__quantity">
                <h5 className="productDetail__quantity-title">Quantity</h5>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Quantity
                      setQuant={setQuant}
                      quant={quant}
                      limit={data.quantity}
                    />
                  </Grid>
                  <div className="productDetail__dimension-colors"></div>
                </Grid>
              </div>

              <div className="productDetail__action">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Button
                      backgroundColor="#2A254B"
                      color="#fff"
                      content="Add to cart"
                      handleClick={handleAddtoCart}
                    ></Button>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Button
                      color="#000"
                      bgColor="#fff"
                      content="Buy now"
                      handleClick={() => navigate("/checkout")}
                    ></Button>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </Grid>
        </Grid>
        <div>
          <div className="productDetail__rating">
            <h5 className="productDetail__rating-title">
              Average Rating: {calculateAverageRating(reviewList)}
            </h5>
            {/* <div className="productDetail__rating-stars">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  className={`productDetail__rating-button ${
                    value <= rating ? "active" : ""
                  }`}
                  onClick={() => handleRatingChange(value)}
                >
                  {value}
                </button>
              ))}
            </div> */}
            {/* <p className="productDetail__rating-count">
              ({reviews?.length} {reviews?.length === 1 ? "review" : "reviews"})
            </p> */}
          </div>
          <div className="productDetail__review-list">
            <h5 className="productDetail__review-list-title">Reviews</h5>
            {reviewList.length === 0 ? (
              <p className="productDetail__no-reviews">No reviews yet.</p>
            ) : (
              reviewList.map((review) => (
                <div key={review.id} className="productDetail__review-item">
                  <div className="productDetail__review-item-author">
                    <img
                      src={review.author.profile_picture}
                      alt={review.author.name}
                      className="productDetail__review-item-author-avatar"
                    />
                    <span className="productDetail__review-item-author-name">
                      {review.author.name}
                    </span>
                  </div>
                  <div className="productDetail__review-item-content">
                    <p>{review.content}</p>
                    <div className="productDetail__review-item-rating">
                      <div className="productDetail__review-item-rating">
                        Rating: {review.star}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="productDetail__review">
            {isLoggedIn ? (
              isBought ? (
                <>
                  <h5 className="productDetail__review-title">
                    Write a Review
                  </h5>
                  <textarea
                    className="productDetail__review-input"
                    placeholder="Enter your review..."
                    value={reviewText}
                    onChange={handleReviewTextChange}
                  />
                  <button
                    className="productDetail__review-submit"
                    onClick={handleAddReview}
                  >
                    Submit Review
                  </button>
                </>
              ) : null
            ) : (
              <p className="productDetail__review-login">
                Login to submit a review.
              </p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetailContent;
