// api/users.ts
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

  return res.json(); // Or handle response as needed
};
