// api/users.ts

// Fetch all users
export const fetchUsers = async () => {
  const res = await fetch("/api/users");
  if (!res.ok) {
    throw new Error("Failed to fetch users.");
  }
  const data = await res.json();
  return data.users;
};

// Fetch user data by user ID
export const fetchUserData = async (userId: string) => {
  const res = await fetch(`/api/users/${userId}`);
  if (!res.ok) {
    throw new Error("Failed to fetch user data.");
  }
  return await res.json();
};

// Fetch user data by user ID
export const fetchUserContracts = async (userId: string) => {
  const res = await fetch(`/api/users/${userId}/contracts`);
  if (!res.ok) {
    throw new Error("Failed to fetch user data.");
  }
  return await res.json();
};

// Update profile image by user ID
export const updateProfileImage = async (userId: string, imageUrl: string) => {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ profileImage: imageUrl }),
  });

  if (!res.ok) {
    throw new Error("Failed to update profile image.");
  }
};

// Update isWorker status by user ID
export const updateIsWorkerStatus = async (
  userId: string,
  isWorker: boolean
) => {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isWorker }),
  });

  if (!res.ok) {
    throw new Error("Failed to update isWorker status.");
  }
};

// src/_utils/api/users.ts

// Function to update user skillset
export const updateUserSkillset = async (
  userId: string,
  skillset: string
): Promise<void> => {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skillset }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user skillset.");
  }
};

// Function to update user skills
export const updateUserSkills = async (
  userId: string,
  updatedSkills: string[]
): Promise<void> => {
  const response = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skills: updatedSkills }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to update user skills.");
  }
};

// Function to delete a user skill
export const deleteUserSkill = async (
  userId: string,
  skillToDelete: string
) => {
  const res = await fetch(`/api/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ skill: skillToDelete }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete skill.");
  }

  return res.json();
};

// _lib/api/userApi.js

export const updateAboutText = async (userId: string, aboutText: string) => {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ aboutText }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Update wallet balance by user ID
export const updateWalletBalance = async (
  userId: string,
  amount: number,
  operation: "add" | "subtract"
) => {
  try {
    // Step 1: Fetch the current user data to get the wallet balance
    const userResponse = await fetch(`/api/users/${userId}`);
    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await userResponse.json();

    const currentBalance = userData.walletBalance;

    const newBalance = operation === "add" ? currentBalance+amount : currentBalance-amount;
    const res = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletBalance: newBalance }),
    });

    if (!res.ok) {
      throw new Error("Failed to update wallet balance.");
    }
    return await res.json();
  } catch (error) {
    console.error("Error updating wallet balance:", error);
    return {
      success: false,
      message: "Error updating wallet balance",
    };
  }
};

// Add a new service for a user
export const addUserService = async (userId: string, serviceData: { service: string; price: number; rateType: string }) => {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ addService: serviceData }),  // Sending a single service object
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to add service.");
  }

  return await res.json(); // Returns updated user data
};

// Delete a service from a user
export const deleteUserService = async (userId: string, service: string) => {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PATCH",  // Use PATCH instead of DELETE to be consistent with adding services
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ removeService: service }),  // Sending a single service name as string
  });

  if (!res.ok) {
    throw new Error("Failed to delete service.");
  }

  return await res.json();
};
