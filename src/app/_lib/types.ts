export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  skillset?: string;
  skills?: string[];
  aboutText?: string;
  isWorker?: boolean;
  profileImage?: string;
  receivedMessages: any[],
  sentMessages: any[]
}

export interface MessageBody {
  _id: string;
  createdAt: string;
  to: {
    firstName: string;
    lastName: string; 
    profileImage?: string;
  };
  from: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  }
  messageSubject: string;
  messageText: string;
}
