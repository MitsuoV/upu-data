export interface ApplicantDetail {
  id: string;
  isAccepted: boolean;
  // Raw column data B-M
  colB: string;
  colC: string;
  colD: string; // Koko
  colE: string; // SPM A+
  colF: string; // SPM A
  colG: string; // MUET
  colH: string;
  colI: string;
  colJ: string;
  colK: string;
  colL: string;
  colM: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  institution: string;
  faculty: string;
  quota: number;
  totalApplicants: number;
  totalAccepted: number;
  totalRejected: number;
  acceptanceRate: number;
  applicantsList: ApplicantDetail[];
}

export interface ApplicantStats {
  courseId: string;
  avg_spm_A_plus: number;
  avg_spm_A: number;
  muet_band_3_0: number;
  muet_band_3_5: number;
  muet_band_4_0: number;
  muet_band_4_5: number;
  muet_band_5_0: number;
  muet_band_5_plus: number;
}

export interface FilterState {
  searchQuery: string;
  institutions: string[];
}

export type SortField = 'name' | 'applicants' | 'rate' | 'quota';
export type SortOrder = 'asc' | 'desc';

export interface DashboardStats {
  totalCourses: number;
  totalApplicants: number;
  totalAccepted: number;
  avgAcceptanceRate: number;
}