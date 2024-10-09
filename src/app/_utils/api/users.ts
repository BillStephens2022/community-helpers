// api/users.ts

export const deleteUserSkill = async (userId: string, skillToDelete: string) => {
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