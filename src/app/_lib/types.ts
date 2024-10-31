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
    _id: string;
    firstName: string;
    lastName: string; 
    profileImage?: string;
  };
  from: {
    _id: string;
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
    _id: string;
    firstName: string;
    lastName: string; 
    profileImage?: string;
  };
  client: {
    _id: string;
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
  rejectionText?: string;
  status: string;
  createdAt: string;
}
