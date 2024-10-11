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

export interface Message {
  from: string;
  to: string;
  messageSubject: string;
  messageText: string;
}
