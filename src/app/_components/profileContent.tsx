import { useSetRecoilState, useRecoilValue } from "recoil";
import { CldUploadWidget } from "next-cloudinary";
import { userState } from "../_atoms/userAtom";
import { Switch } from "@mantine/core";
import ProfileCard from "../_components/ProfileCard";
import { updateProfileImage, updateIsWorkerStatus } from "../_utils/api/users";
import styles from "../profile/profile.module.css";
import { User } from "../_lib/types";

interface ProfileContentProps {
  user: User;
}

const ProfileContent = ({ user }: ProfileContentProps) => {
  const setUser = useSetRecoilState(userState);

  const { isWorker, profileImage } = user;

  const handleImageUpload = async (imageUrl: string) => {
    const userId = user?._id; // Get the user's ID from the Recoil state
    if (userId) {
      try {
        // API call to update the user profile image
        await updateProfileImage(userId, imageUrl);
        // Update the Recoil state with the new profile image
        setUser((prevUser) => {
          if (!prevUser) return prevUser; // In case prevUser is null, do nothing
          return {
            ...prevUser, // Spread all existing properties
            profileImage: imageUrl, // Update the profileImage field
          };
        });
      } catch (error) {
        console.error("Error updating profile image:", error);
      }
    }
  };

  const toggleIsWorker = async () => {
    const userId = user?._id; // Get the user's ID from the Recoil state
    if (userId) {
      try {
        const updatedIsWorker = !user?.isWorker;
        // API call to update the user profile
        await updateIsWorkerStatus(userId, updatedIsWorker);
        // Update Recoil state with the new value
        setUser((prevUser) => {
          if (!prevUser) return prevUser; // In case prevUser is null, do nothing
          return {
            ...prevUser, // Spread all existing properties
            isWorker: updatedIsWorker, // Update only the isWorker field
          };
        });
      } catch (error) {
        console.error("Error updating isWorker:", error);
      }
    }
  };

  return (
    <>
      <Switch
        size="xl"
        checked={isWorker}
        onChange={toggleIsWorker}
        label="Available for Work?"
        color="#333"
        onLabel="Yes"
        offLabel="No"
        labelPosition="left"
        className={styles.profile_switch}
      />
      <div className={styles.profile_upload_div}>
        <CldUploadWidget
          uploadPreset="community_helpers"
          onSuccess={(result) => {
            const imageInfo = result.info;
            if (imageInfo && typeof imageInfo !== "string") {
              // Ensure imageInfo is not a string or undefined
              handleImageUpload(imageInfo.secure_url); // Access secure_url safely
            }
          }}
          onQueuesEnd={(result, { widget }) => {
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <button
                onClick={() => open()}
                className={styles.upload_widget_button}
              >
                {profileImage ? "Edit" : "Upload a"} Profile Photo
              </button>
            );
          }}
        </CldUploadWidget>
      </div>
      <ProfileCard user={user} size="large" isProfilePage={true} />
    </>
  );
};

export default ProfileContent;
