import { useDispatch } from "react-redux";
import { ImageListItemBar, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../atoms/Button";
import { nanoid } from "@reduxjs/toolkit";
import { addBasket } from "../../../store/reducers/basketSlice";

const ProductList = (props) => {
  const { filteredProducts } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const smMatches = useMediaQuery("(min-width:600px)");
  const mdMatches = useMediaQuery("(min-width:900px)");
  const lgMatches = useMediaQuery("(min-width:1200px)");

  let responsiveProductStyle;
  if (!smMatches) {
    responsiveProductStyle = {
      width: "100%",
      height: "256px",
      objectFit: "cover",
    };
  } else if (!mdMatches) {
    responsiveProductStyle = {
      width: "100%",
      height: "561px",
      objectFit: "cover",
    };
  } else if (!lgMatches) {
    responsiveProductStyle = {
      width: "100%",
      height: "282px",
      objectFit: "cover",
    };
  } else {
    responsiveProductStyle = {
      width: "100%",
      height: "282px",
      objectFit: "cover",
    };
  }

  const handleAddToBasket = (data) => {
    const productStringify = {
      id: nanoid(),
      category: data.category,
      price: data.price,
      description: data.description,
      quantity: 1,
      sizes: data.sizes[0],
      stock: data.quantity,
      color: data.colors[0],
      image: data.image,
      totalPrice: data.price * 1,
      productId: data.id,
    };
    dispatch(addBasket(productStringify));
  };

  const handleGoToCheckout = (data) => {
    const productStringify = {
      id: nanoid(),
      category: data.category,
      price: data.price,
      description: data.description,
      quantity: 1,
      sizes: data.sizes[0],
      stock: data.quantity,
      color: data.colors[0],
      image: data.image,
      totalPrice: data.price * 1,
      productId: data.id,
    };
    dispatch(addBasket(productStringify));
    navigate("/checkout");
  };

  return (
    <Grid container spacing={{ lg: 4, xs: 4 }}>
      {filteredProducts.map(
        (item, index) =>
          item.active && (
            <Grid
              item
              xs={6}
              sm={6}
              md={4}
              lg={3}
              sx={{ width: "100%", cursor: "pointer" }}
              key={index}
            >
              <div
                className="product-card-img d-flex justify-content-center"
                data-aos="fade-up"
                data-aos-anchor-placement="bottom-bottom"
              >
                <img
                  style={responsiveProductStyle}
                  src={item.image}
                  alt={item.name}
                  onClick={() => navigate(`/products/${item.id}`)}
                />
                <div className="product-card-img-button">
                  <Button
                    width="100%"
                    padding="16px 0"
                    txtColor="#fff"
                    bgColor="#2a254b"
                    onClick={() => handleAddToBasket(item)}
                  >
                    Add to cart
                  </Button>
                  <Button
                    width="100%"
                    padding="16px 0"
                    txtColor="#2A254B"
                    bgColor="#F9F9F9"
                    margin="10px 0"
                    onClick={() => handleGoToCheckout(item)}
                  >
                    Buy now
                  </Button>
                </div>
              </div>
              <ImageListItemBar
                sx={{
                  marginBottom: "5px",
                  width: "100%",
                  height: "100%",
                }}
                title={
                  <span
                    style={{
                      width: "100%",
                      color: "#2a254b",
                      fontFamily: ["Clash Display", "sans-serif"],
                      display: "block",
                      fontWeight: "500",
                      lineHeight: "140%",
                      fontSize: "20px",
                      marginTop: "5px",
                      marginBottom: "5px",
                      whiteSpace: "initial",
                    }}
                  >
                    {item.name}
                  </span>
                }
                subtitle={
                  <span
                    style={{
                      color: "#2a254b",
                      fontFamily: ["Clash Display", "sans-serif"],
                      fontSize: "18px",
                      fontWeight: "400",
                      lineHeight: "150%",
                    }}
                  >
                    {parseFloat(item.price).toLocaleString("vi-vn", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                }
                position="below"
              />
            </Grid>
          )
      )}
    </Grid>
  );
};

export default ProductList;
