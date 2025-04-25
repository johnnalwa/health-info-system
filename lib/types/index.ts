// app/lib/types/index.ts

export interface Client {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email?: string;
  address: string;
  medical_history?: string;
}

export interface Program {
  [x: string]: string | number | Date;
  id: string;
  created_at: string;
  name: string;
  description: string;
  status: "active" | "inactive";
}

export interface ClientProgram {
  id: string;
  client_id: string;
  program_id: string;
  enrollment_date: string;
  status: "active" | "completed" | "dropped";
  notes?: string;
}

export interface ClientWithPrograms extends Client {
  programs: Program[];
}
