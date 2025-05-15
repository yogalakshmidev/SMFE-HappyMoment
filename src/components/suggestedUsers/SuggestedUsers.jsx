import React from "react";
import man from "../../assets/man.jpg";
import { capitalizeFirstLetter } from "../../util/capitalizeFirstLetter";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { handleFollow } from "../../redux/authSlice";

const SuggestedUsers = () => {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      
      try {
        
        const res = await fetch(
          `http://localhost:5000/user/find/suggestedUsers`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        console.log("Suggested user data is",data)
        setSuggestedUsers(data);
        // console.log("SuggestedUsers length is", suggestedUsers?.length);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSuggestedUsers();
  }, []);

  const toggleFollow = async (id) => {
    try {
      await fetch(`http://localhost:5000/user/toggleFollow/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "PUT",
      });
      setSuggestedUsers((prev) => {
        return [...prev].filter((user) => user._id !== id);
      });
      dispatch(handleFollow(id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-8">
      <div className="w-full min-h-fit">
        <div className="flex items-center justify-center gap-2">
          <img
            src={man}
            className="w-12 h-12 rounded-2xl object-cover"
            alt=""
          />
          <div className="flex flex-col gap-1  border-solid border-l-pink-500 pl-2">
            <span className="text-xl font-medium">
              {capitalizeFirstLetter(user.username)}
            </span>
            <span className="text-sm text-cyan-600">
              {user?.bio ? user.bio : "Life is full of adventures"}
            </span>
          </div>
        </div>
        {suggestedUsers?.length > 0 ? (
          <div className="flex flex-col mt-4 gap-6">
            <h3 className="mt-6 whitespace-nowrap text-2xl">
              Recommended users to follow
            </h3>
            {suggestedUsers?.map((suggestedUser) => (
              <div className="flex items-center gap-2" key={suggestedUser._id}>
                <Link to={`/profileDetail/${suggestedUser._id}`}>
                  <img
                    alt="suggested Users"
                    src={suggestedUser?.photo ? suggestedUser.photo : man}
                    className="h-12 w-12 object-cover rounded-2xl"
                  />
                </Link>
                <div className="flex flex-col">
                  <span className="text-xl font-bold">
                    {capitalizeFirstLetter(suggestedUser.username)}
                  </span>
                  <span className="text-sm text-cyan-600">
                    Suggested to you
                  </span>
                </div>
                <button
                  onClick={() => toggleFollow(suggestedUser._id)}
                  className="outline-none cursor-pointer rounded-3xl text-xl font-medium text-white bg-teal-600 px-4 py-2 ring-3 hover:border-teal-600 border-2 hover:bg-white hover:text-teal-400"
                >
                  Follow
                </button>
              </div>
            ))}
          </div>
        ) : (
          <h3 className="flex">You have no suggested users</h3>
        )}
      </div>
    </div>
  );
};

export default SuggestedUsers;
