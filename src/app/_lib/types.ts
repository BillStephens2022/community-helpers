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
  sentMessages: any[],
  contracts: any[]
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

export interface ContractBody {
  _id: string;
  worker: {
    firstName: string;
    lastName: string; 
    profileImage?: string;
  };
  client: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  }
  jobCategory: string;
  jobDescription: string;
  feeType: string;
  hourlyRate?: number;
  hours?: number;
  fixedRate?: number;
  amountDue: number;
  additionalNotes?: string;
  status: string;
  createdAt: string;
}
