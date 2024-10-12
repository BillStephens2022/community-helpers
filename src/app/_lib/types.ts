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
  from: string;
  to: string;
  messageSubject: string;
  messageText: string;
}
