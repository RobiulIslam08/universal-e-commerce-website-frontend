export interface IUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms?: boolean;
}

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}
