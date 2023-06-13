import { Avatar, IconButton } from "@mui/material";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useRef, useState } from "react";
import DefaultUser from "../../../assets/icons/default_user.jpg";
import { auth, db, storage } from "../../../firebase/firebase-config";

const AvatarButton = ({ data, handleChangeImage }) => {
  const inputRef = useRef();
  const [avatar, setAvatar] = useState("");
  useEffect(() => {
    setAvatar(data);
  }, [data]);

  //clean up the input ref
  const cleanUpInput = () => {
    URL.revokeObjectURL(avatar);
    inputRef.current.value = null;
  };

  const handleUploadAvatar = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };
    handleChangeImage(e.target.files[0]);
    reader.readAsDataURL(e.target.files[0]);
  };

  return (
    <div
      style={{
        alignSelf: "center",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        borderRadius: 180,
      }}
    >
      <IconButton aria-label="upload picture" component="label">
        <input
          ref={inputRef}
          onChange={handleUploadAvatar}
          hidden
          accept="image/*"
          type="file"
        />
        <Avatar
          sx={{
            width: "200px",
            height: "200px",
            alignSelf: "center",
          }}
          src={avatar ? avatar : DefaultUser}
        />
      </IconButton>
    </div>
  );
};

export default AvatarButton;
