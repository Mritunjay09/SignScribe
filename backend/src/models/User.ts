export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  bio?: string;
  profile_picture?: string;
  google_id?: string;
  facebook_id?: string;
  role: string;
  refresh_token?: string;
  password_reset_token?: string;
  password_reset_expires?: Date;
  is_email_verified: boolean;
  failed_login_attempts: number;
  lock_until?: Date;
  last_login?: Date;
  last_password_change?: Date;
  created_at: Date;
  updated_at: Date;
}