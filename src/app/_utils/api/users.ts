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
