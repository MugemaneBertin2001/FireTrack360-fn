export interface User {
    id: string;
    email: string;
    phone?: string;
    name?: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface RegisterInput {
    email: string;
    password: string;
    phone: string;
    confirmPassword: string;
  }


  export interface NewPasswordInput {
    newPassword: string;
    confirmPassword: string;
    email: string;
    verificationToken: string;
  }

  export interface VerificationInput {
    email: string;
    otp: string;
  }
