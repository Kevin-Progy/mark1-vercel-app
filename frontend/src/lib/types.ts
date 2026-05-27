export type User = {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  profileCompleted: boolean;
};

export type Profile = {
  _id: string;
  userId: User;
  name: string;
  age?: number;
  dateOfBirth?: string;
  height?: string;
  gender?: string;
  maritalStatus?: string;
  qualification?: string;
  profession?: string;
  income?: string;
  community?: string;
  languages: string[];
  fatherName?: string;
  motherName?: string;
  parentsContactNumber?: string;
  parentsAlternateContactNumber?: string;
  telegramNumber?: string;
  familyStatus?: string;
  parents?: string;
  phone?: string;
  email?: string;
  homeTown?: string;
  currentResidence?: string;
  siblings?: string;
  localFaithHome?: string;
  centerFaithHome?: string;
  expectations?: string;
  photo?: string;
  canViewDetails?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type InterestStatus = "pending" | "approved" | "rejected";

export type Interest = {
  _id: string;
  fromUserId: User;
  toUserId: User;
  status: InterestStatus;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};
