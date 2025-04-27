// lib/types.ts

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email?: string;
  address: string;
  medical_history?: string;
  created_at: string;
  updated_at: string;
}

export interface Program {
  id: string;
  name: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
  enrollment_count?: number;
  // For enrolled programs
  enrollment_date?: string;
  enrollment_status?: string;
  notes?: string;
}

export interface ClientWithPrograms extends Client {
  programs?: Program[];
}

export interface Enrollment {
  id: string;
  client_id: string;
  program_id: string;
  enrollment_date: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Stats {
  clientCount: number;
  programCount: number;
  enrollmentCount: number;
}
