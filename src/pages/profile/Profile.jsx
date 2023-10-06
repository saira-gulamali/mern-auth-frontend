import Card from "../../components/card/Card";
// import profileImg from "../../assets/avatarr.png";
import "./Profile.scss";
import { useEffect, useLayoutEffect, useState } from "react";
import PageMenu from "../../components/pageMenu/PageMenu";
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import {
  getUser,
  selectUser,
  updateUser,
} from "../../redux/features/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { toast } from "react-toastify";
import Notification from "../../components/notification/Notification";

const cloud_name = import.meta.env.VITE_CLOUD_NAME;
const upload_preset = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;

const shortenText = (text, n) => {
  if (text.length > n) {
    const shortText = text.substring(0, n).concat("...");
    return shortText;
  }
  return text;
};

const Profile = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const { isLoading, user } = useSelector((state) => state.auth);

  const initialState = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    photo: user?.photo || "",
    role: user?.role || "subscriber",
    isVerified: user?.isVerified || false,
  };
  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // const { name, email, phone, bio, photo, role, isVerified } = profile;

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    let imageURL;
    try {
      if (
        profileImage !== null &&
        (profileImage.type === "image/jpeg" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", cloud_name);
        image.append("upload_preset", upload_preset);

        //save image to cloudinary
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          { method: "post", body: image }
        );

        const imgData = await response.json();
        imageURL = imgData.url.toString();
        console.log(imgData);
        console.log(imageURL);
      }
      //save profile to mongoDB
      const userData = {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        photo: profileImage ? imageURL : profile.photo,
      };

      dispatch(updateUser(userData));
    } catch (error) {
      toast.error(error.message);
    }
  };

  useLayoutEffect(() => {
    if (user) {
      setProfile({
        ...profile,
        name: user.name,
        email: user.email,
        photo: user.photo,
        phone: user.phone,
        bio: user.bio,
        role: user.role,
        isVerified: user.isVerified,
      });
    }
  }, [user]);

  return (
    <>
      <section>
        <div className="container">
          {isLoading && <Loader />}
          {!profile.isVerified && <Notification />}

          <PageMenu />
          <h2>Profile</h2>
          <div className="--flex-start profile">
            <Card cardClass={"card"}>
              {!isLoading && user && (
                <>
                  <div className="profile-photo">
                    <div>
                      <img
                        // src={profile?.photo || profileImg}
                        src={imagePreview === null ? user?.photo : imagePreview}
                        alt="profile image"
                      />
                      <h3>Role: {profile.role}</h3>
                    </div>
                  </div>
                  <form onSubmit={saveProfile}>
                    <p>
                      <label htmlFor="imageFile">Change Photo</label>
                      <input
                        type="file"
                        id="imageFile"
                        accept="image/*"
                        name="image"
                        onChange={handleImageChange}
                      />
                    </p>
                    <p>
                      <label htmlFor="name">Name : </label>
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={profile?.name}
                        onChange={handleInputChange}
                      />
                    </p>
                    <p>
                      <label htmlFor="email">Email : </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={profile?.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </p>
                    <p>
                      <label htmlFor="phone">Phone : </label>
                      <input
                        id="phone"
                        type="text"
                        name="phone"
                        value={profile?.phone}
                        onChange={handleInputChange}
                      />
                    </p>
                    <p>
                      <label htmlFor="bio">Bio : </label>
                      <textarea
                        name="bio"
                        id="bio"
                        cols="30"
                        rows="10"
                        value={profile?.bio}
                        onChange={handleInputChange}
                      ></textarea>
                    </p>
                    <button
                      className="--btn --btn-block --btn-primary"
                      type="submit"
                    >
                      Update Profile
                    </button>
                  </form>
                </>
              )}
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export const UserName = () => {
  const user = useSelector(selectUser);

  let username = user?.name || "...";

  return <p className="--color-white">Hi, {shortenText(username, 22)} | </p>;
};

export default Profile;
