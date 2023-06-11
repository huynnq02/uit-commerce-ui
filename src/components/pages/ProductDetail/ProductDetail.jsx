/**
 * Detail of Product Page
 * file: ProductDetail.jsx
 */

import { useMediaQuery } from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/firebase-config";
import ProductDetailContent from "../../organisms/ProductDetail/ProductDetailContent";
import ProductDetailJoin from "../../organisms/ProductDetail/ProductDetailJoin";
import ProductDetailList from "../../organisms/ProductDetail/ProductDetailList";
import ProductReview from "../../organisms/ProductDetail/ProductReview";
import { useSelector } from "react-redux";

const ProductDetail = () => {
  console.log("go to product detail");
  const mdMatches = useMediaQuery("(min-width:600px)");
  const lgMatches = useMediaQuery("(min-width:1200px)");
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [productDetail, setProductDetail] = useState([]);

  const { id } = useParams(); // id được khai báo ở trang App.jsx
  //state này để lưu size S,M,L,...
  const [sizePicker, setSizePicker] = useState([]);
  const [colorPicker, setColorPicker] = useState([]);
  const [quant, setQuant] = useState(1);
  const [listImages, setListImages] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const products = useSelector((state) => state.products.products);
  useEffect(() => {
    (async () => {
      if (!id) return;
      else {
        const data = products.find((product) => product.id === id);
        if (data) {
          console.log("data: ", data);
          handleGetListProductWithCategories(data.category);
          setProductDetail(data);
          setSizePicker(data.sizes[0]);
          setListImages([data.image, ...data.detail_image]);
          setColorPicker(data.colors[0]);
        } else {
          console.log("No data");
        }
      }
    })();
  }, [id]);

  const handleGetListProductWithCategories = async (categories) => {
    console.log(categories);
    const docRef = collection(db, "products");
    const que = query(docRef, where("category", "==", categories));
    const snapshots = await getDocs(que);
    const docs = snapshots.docs.map((doc) => {
      const data = doc.data();
      return data;
    });
    setProductCategories(docs);
  };
  return (
    <div style={{ paddingTop: lgMatches ? "130px" : "90px" }}>
      <ProductDetailContent
        setSizePicker={setSizePicker}
        sizePicker={sizePicker}
        data={productDetail}
        setQuant={setQuant}
        quant={quant}
        listImages={listImages}
        setColorPicker={setColorPicker}
        colorPicker={colorPicker}
        productId={id}
      />
      <ProductDetailList productList={productCategories} />
      <ProductReview />
      <ProductDetailJoin />
    </div>
  );
};

export default ProductDetail;
