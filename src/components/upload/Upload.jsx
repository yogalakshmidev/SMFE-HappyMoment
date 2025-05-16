import React from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineFileImage } from "react-icons/ai";
import { useState } from "react";
// import {BACKEND_URL} from 'dotenv'
// require('dotenv').config()

const Upload = () => {
  const [state, setState] = useState({});
  const [photo, setPhoto] = useState("");
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  

  const handleState = (e) => {
    setState((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    try {
      let filename = null;

      if (photo) {
        const formData = new FormData();
        filename = crypto.randomUUID() + photo.name;
        console.log("filename is", filename);
        formData.append("filename", filename);
        formData.append("image", photo);
        console.log("form data is ",formData);
        
        // api call
        await fetch(`https://smbe-happymoment.onrender.com/upload/image`,{

        // await fetch(`http://localhost:5000/upload/image`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "POST",
          body: formData,
        });
        
      }
      // api call
      const res = await fetch(`https://smbe-happymoment.onrender.com/post/createPost`,{
      // const res = await fetch(`http://localhost:5000/post/createPost`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ ...state, photo: filename }),
      });
      const data = await res.json();
      console.log("data after post upload is",data);
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center m-10  w-full ">
      <div className="flex flex-col h-4/6 w-1/3 m-10 p-10 border-2 divide-solid border-cyan-400 rounded-3xl">
        <h2 className="text-center text-3xl my-10 text-teal-800">
          Upload Post
        </h2>
        <form
          className="flex flex-col items-center gap-11"
          onSubmit={handleCreatePost}
        >
          <input
            className="w-1/2 outline-none rounded-none border-b-2 divide-solid border-cyan-400"
            type="text"
            name="title"
            placeholder="Title..."
            onChange={handleState}
          />
          <input
            className="w-1/2 outline-none rounded-none border-b-2 divide-solid border-cyan-400"
            type="text"
            name="desc"
            placeholder="Description..."
            onChange={handleState}
          />
          <label
            className="self-center w-1/2 cursor-pointer transition-all flex items-center gap-3 hover:text-cyan-400"
            htmlFor="photo"
          >
            Upload photo
            <AiOutlineFileImage />
          </label>
          <input
            type="file"
            id="photo"
            // style={{ display: "none" }}
            onChange={(e) => setPhoto(e.target.files[0])}
          />
          <input
            className="w-1/2 outline-none rounded-none border-b-2 divide-solid border-cyan-400"
            type="text"
            name="location"
            placeholder="Location..."
            onChange={handleState}
          />
          <button  className="outline-none cursor-pointer rounded-3xl text-xl font-medium text-white bg-teal-600 px-4 py-2 ring-3 hover:border-teal-600 border-2 hover:bg-white hover:text-teal-400">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
