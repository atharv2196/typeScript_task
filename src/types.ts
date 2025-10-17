// src/types.ts

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}

// Interface for the data needed in the Add/Edit form
export type UserFormValues = Omit<User, 'id'>;