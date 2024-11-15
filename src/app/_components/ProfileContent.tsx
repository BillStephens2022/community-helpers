import { useSetRecoilState } from "recoil";
import { useState, ReactNode } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { userState } from "../_atoms/userAtom";
import { User } from "../_lib/types";
import ProfileCard from "./ProfileCard";
import Modal from "../_components/ui/Modal";
import { updateProfileImage } from "../_utils/api/users";
import styles from "./profileContent.module.css";
import Button from "./ui/Button";
import DepositForm from "./forms/DepositForm";

interface ProfileContentProps {
  user: User;
}

const ProfileContent = ({ user }: ProfileContentProps) => {
  const setUser = useSetRecoilState(userState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);

  const { profileImage, walletBalance } = user;

  const openModal = (title: string, content: ReactNode) => {
    setIsModalOpen(true);
    setModalTitle(title);
    setModalContent(content);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalContent(null);
  };

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

  
  return (
    <>
      <div className={styles.wallet_div}>
        <h2 className={styles.wallet_balance}>
          Wallet Balance: $ {walletBalance}
        </h2>
        <Button
          type="button"
          onClick={() =>
            openModal(
              "Deposit Funds",
              <DepositForm closeModal={closeModal} user={user} />
            )
          }
        >
          Deposit
        </Button>
      </div>
      
      <div className={styles.profile_edit_buttons}>
      <Button type="button" onClick={() => setIsEditMode(!isEditMode)}>
          {isEditMode ? "Cancel" : "Edit Profile"}
        </Button>
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
              <Button
              type="button"
                onClick={() => open()}
                
              >
                {profileImage ? "Edit" : "Upload"} Photo
              </Button>
            );
          }}
        </CldUploadWidget>
        
      </div>
      <ProfileCard user={user} isEditMode={isEditMode} />
      {isModalOpen && (
        <Modal onClose={closeModal} title={modalTitle} content={modalContent} />
      )}
    </>
  );
};

export default ProfileContent;
