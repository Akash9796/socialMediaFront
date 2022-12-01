import { Button, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { createNewPost } from "../../Actions/postAction";
import { loadUser } from "../../Actions/userAction";
import axios from "axios";
import "./NewPost.css";
const NewPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const { loading, error, message } = useSelector((state) => state.like);
  const dispatch = useDispatch();
  const alert = useAlert();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    ///////
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "v9xjubvh");
    await axios
      .post("https://api.cloudinary.com/v1_1/dg6iqaqvm/image/upload", formData)
      .then(
        (response) => {console.log(response.data);
        setImage(response.data)}
      );
    /////

    // const Reader = new FileReader();
    // Reader.readAsDataURL(file);
    // console.log(Reader);
    // Reader.onload = () => {
    //   if (Reader.readyState === 2) {
    //     setImage(Reader.result);
    //   }
    // };
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    dispatch(createNewPost(caption, image));
    dispatch(loadUser());
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message, alert]);

  return (
    <div className="newPost">
      <form className="newPostForm" onSubmit={submitHandler}>
        <Typography variant="h3">New Post</Typography>

        {image && <img src={image.url} alt="post" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default NewPost;
