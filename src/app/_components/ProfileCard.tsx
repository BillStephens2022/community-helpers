import { ReactNode, useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useSession } from "next-auth/react";
import { CldImage } from "next-cloudinary";
import { MdOutlineEdit } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRegTrashCan } from "react-icons/fa6";
import { Switch } from "@mantine/core";
import { User } from "../_lib/types";
import { userState } from "../_atoms/userAtom";
import Modal from "../_components/ui/Modal";
import EditSkillsetForm from "./forms/EditSkillsetForm";
import EditAboutTextForm from "./forms/EditAboutTextForm";
import AddSkillForm from "./forms/AddSkillForm";
import AddServiceForm from "./forms/AddServiceForm";
import { deleteUserSkill, updateIsWorkerStatus, deleteUserService } from "../_utils/api/users";
import styles from "./profileCard.module.css";

interface ProfileCardProps {
  user: User;
  isEditMode?: boolean;
  isProfilePage?: boolean;
}

const ProfileCard = ({ user, isEditMode = false, isProfilePage = false }: ProfileCardProps) => {
  const { data: session } = useSession();
  const setUser = useSetRecoilState(userState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");

  useEffect(() => {
    if (session) {
      console.log("Session:", session);
    }
  }, [session]);

  const openModal = (title: string, content: ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalTitle("");
    setModalContent(null);
  };

  const {
    firstName,
    lastName,
    skillset,
    skills,
    services,
    aboutText,
    profileImage,
    isWorker,
  } = user;

  const handleDeleteSkill = async (skillToDelete: string) => {
    try {
      const userId = user?._id;

      // api call to delete the skill
      await deleteUserSkill(userId, skillToDelete);

      // Update Recoil state to remove the deleted skill
      setUser((prevUser) => {
        if (!prevUser || !prevUser.skills) return prevUser; // Guard clause
        return {
          ...prevUser,
          skills: prevUser.skills.filter((skill) => skill !== skillToDelete), // Filter out the deleted skill
        };
      });
    } catch (error) {
      console.error("Error deleting skill:", error);
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

  const handleDeleteService = async (serviceToDelete: { service: string }) => {
    try {
      const userId = user?._id;  // Get user ID from the user object
      if (!userId) {
        console.error("User ID is not available.");
        return;
      }
  
      // Call the API to delete the service
      await deleteUserService(userId, serviceToDelete.service);
  
      // Update Recoil state to remove the deleted service
      setUser((prevUser) => {
        if (!prevUser || !prevUser.services) return prevUser;  // Guard clause
        return {
          ...prevUser,
          services: prevUser.services.filter((service) => service.service !== serviceToDelete.service),  // Remove the deleted service
        };
      });
  
      console.log("Service deleted successfully");
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  console.log("User from Profile Card:", user);
  console.log("services", services);



  return (
    <>
      <div className={`${styles.profile_card} ${isEditMode ? styles.no_hover : ""}`}>
        {isProfilePage ? (<Switch
          size="md"
          checked={isWorker}
          onChange={toggleIsWorker}
          label="Available for Work?"
          color="darkslateblue"
          onLabel="Yes"
          offLabel="No"
          labelPosition="left"
          className={styles.profile_switch}
        />) : isWorker ? (<p className={styles.profile_switch}>Available For Work ✅</p>) : (<p className={styles.profile_switch}>Available For Work ❌</p>)}
        <div className={styles.profile_header_div}>
          <div className={styles.profile_image_div}>
            {profileImage && (
              <CldImage
                src={profileImage}
                alt="sample image"
                width={160}
                height={160}
                crop={{
                  type: "auto", // Transform the image: auto-crop to square aspect_ratio
                  source: true,
                }}
                radius={150}
              />
            )}
          </div>
          <div className={styles.profile_name_skillset}>
            <h1 className={styles.profile_h1}>
              {firstName} {lastName}
            </h1>
            <div className={styles.profile_skillset}>
              {isEditMode && (
                <MdOutlineEdit
                  className={styles.profile_editIcon}
                  onClick={() =>
                    openModal(
                      "Edit Skillset",
                      <EditSkillsetForm closeModal={closeModal} user={user} />
                    )
                  }
                />
              )}
              <h2 className={styles.profile_h2}>
                {skillset ? skillset : "Skillset: "}
              </h2>
            </div>
            <div className={styles.profile_aboutText}>
              <p className={styles.profile_p}>
                {aboutText ? aboutText : "About Me: "}
              </p>
              {isEditMode && (
                <MdOutlineEdit
                  className={styles.profile_editIcon}
                  onClick={() =>
                    openModal(
                      "Edit About Me",
                      <EditAboutTextForm closeModal={closeModal} user={user} />
                    )
                  }
                />
              )}
            </div>
          </div>
        </div>
        <div className={`${styles.profile_summary_div}`}></div>
        <div className={styles.profile_skills}>
          <div className={styles.profile_skills_header}>
            <h3 className={styles.profile_h3}>Skills</h3>
          </div>
          <ul className={styles.profile_ul}>
            {skills?.map((skill) => (
              <li key={skill} className={styles.profile_li}>
                <span className={styles.skillset_text}>{skill}{" "}</span>
                {isEditMode && (
                  <FaRegTrashCan
                    color="white"
                    className={styles.profile_trashIcon}
                    onClick={() => handleDeleteSkill(skill)}
                  />
                )}
              </li>
            ))}
          </ul>
          {isEditMode && (
            <div className={styles.profile_add_skill_div}>
              <IoMdAddCircleOutline
                className={styles.profile_addSkillIcon}
                onClick={() =>
                  openModal(
                    "Add Skill",
                    <AddSkillForm closeModal={closeModal} user={user} />
                  )
                }
              />
              <span className={styles.profile_add_skill_span}>Add Skill</span>
            </div>
          )}
        </div>
        <div className={styles.profile_skills}>
          <div className={styles.profile_skills_header}>
            <h3 className={styles.profile_h3}>Services</h3>
          </div>
          <ul className={styles.profile_ul}>
          {services?.map((service) => (
            console.log("services", services),
              <li key={service.service} className={styles.profile_li}>
                <span className={styles.skillset_text}>{service.service}{" "}</span>
                {isEditMode && (
                  <FaRegTrashCan
                    color="white"
                    className={styles.profile_trashIcon}
                    onClick={() => handleDeleteService(service)}
                  />
                )}
              </li>
            ))}
          </ul>
          {isEditMode && (
            <div className={styles.profile_add_skill_div}>
              <IoMdAddCircleOutline
                className={styles.profile_addSkillIcon}
                onClick={() =>
                  openModal(
                    "Add Service",
                    <AddServiceForm closeModal={closeModal} user={user} />
                  )
                }
              />
              <span className={styles.profile_add_skill_span}>Add Service</span>
            </div>
          )}
          </div>
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal} title={modalTitle} content={modalContent} />
      )}
    </>
  );
};

export default ProfileCard;
