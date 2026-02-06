export type Role = 'ADMIN' | 'MANAGER' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: Role;
}

export type Category = 'YOGA' | 'TAICHI' | 'DANCE' | 'OTHER';
export type ClassStatus = 'NORMAL' | 'CANCELLED' | 'SUBSTITUTE';

export interface ClassSession {
  id: string;
  dayIndex: number;
  time: string;
  className: string;
  instructor: string;
  category: Category;
  status: ClassStatus;
}

export interface Rating {
  id: string;
  userEmail: string;
  userName: string;
  instructor: string;
  rating: number; 
  comment: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'INFO' | 'ALERT';
  createdAt: string;
}

export interface HeaderConfig {
  logo: string;
  address: string;
  scheduleTitle: string;
  hotline: string;
  website: string;
}

export const DAYS_OF_WEEK = [
  { vn: 'Thứ 2', eng: 'Monday' },
  { vn: 'Thứ 3', eng: 'Tuesday' },
  { vn: 'Thứ 4', eng: 'Wednesday' },
  { vn: 'Thứ 5', eng: 'Thursday' },
  { vn: 'Thứ 6', eng: 'Friday' },
  { vn: 'Thứ 7', eng: 'Saturday' },
  { vn: 'Chủ Nhật', eng: 'Sunday' }
];

export const CATEGORY_COLORS: Record<Category, string> = {
  YOGA: 'bg-blue-600',
  TAICHI: 'bg-emerald-600',
  DANCE: 'bg-orange-600',
  OTHER: 'bg-purple-600'
};

export const SUPER_ADMIN_EMAIL = 'thutrang180688@gmail.com';