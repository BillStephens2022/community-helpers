export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    skillset?: string;
    skills?: string[];
    aboutText?: string;
    isWorker?: boolean;
    profileImage?: string;
  }
  