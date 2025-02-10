"use client";

import { useState, FormEvent } from "react";
import { useSetRecoilState } from "recoil";
import { User } from "../../_lib/types";
import { userState } from "../../_atoms/userAtom";
import { addUserService } from "../../_utils/api/users";
import Button from "../ui/Button";
import styles from "./oneFieldForm.module.css";

interface AddServiceFormProps {
  closeModal: () => void;
  user: User;
}

const AddServiceForm = ({ closeModal, user }: AddServiceFormProps) => {
  const [newService, setNewService] = useState({
    service: "",
    price: "",
    rateType: "",
  });
  const [error, setError] = useState("");
  const setUser = useSetRecoilState(userState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setNewService((prevService) => ({
      ...prevService,
      [name]: value, // Update the corresponding field dynamically
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Validate input fields
    if (!newService.service || !newService.price || !newService.rateType) {
      setError("All fields are required.");
      return;
    }

    // Convert price to number (if it's not already)
    const price = parseFloat(newService.price);
    if (isNaN(price)) {
      setError("Price must be a valid number.");
      return;
    }

    try {
      // Services is an array in the User model; initialize if it's undefined (will be undefined when user first signs up)
      const existingServices = user.services || [];
      // Create the updated service object with the properly formatted price
      const updatedService = {
        service: newService.service,
        price,
        rateType: newService.rateType,
      };
      console.log("Updated service being sent to api:", updatedService);
      // Send the updated services array to the server to update the user in database
      await addUserService(user._id, updatedService);
      setError(""); // Clear any error messages
      // Update Recoil state directly with new service to reflect changes immediately on screen
      // Update Recoil state
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          services: [...existingServices, updatedService],
        };
      });
      closeModal();
    } catch (error) {
      console.error("Error updating user:", error);
      setError("An error occurred while updating the user.");
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label htmlFor="service" className={styles.label}>
            Service Name
          </label>
          <input
            type="text"
            name="service"
            placeholder="Service Name"
            className={styles.input}
            id="service"
            onChange={handleChange}
            value={newService.service} // Bind input value to newService state
          />
        </div>
        <div>
          <label htmlFor="price" className={styles.label}>
            Price
          </label>
          <input
            type="text"
            name="price"
            placeholder="Price"
            className={styles.input}
            id="price"
            onChange={handleChange}
            value={newService.price} // Bind input value to newService state
          />
        </div>
        <div>
          <label htmlFor="rateType" className={styles.label}>
            Rate Type
          </label>
          <select
            name="rateType"
            className={styles.input}
            id="rateType"
            onChange={handleChange}
            value={newService.rateType}
          >
            <option value="">Select Rate Type</option>
            <option value="hourly">Hourly</option>
            <option value="flat">Flat Fee</option>
          </select>
        </div>
        {/* If error, display the error message */}
        {error && <p className={styles.error}>{error}</p>}{" "}
        <div className={styles.button_div}>
          <Button type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddServiceForm;
