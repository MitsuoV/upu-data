import { Course, ApplicantStats, ApplicantDetail } from '../types';

const INSTITUTIONS = [
  "Universiti Malaya (UM)",
  "Universiti Sains Malaysia (USM)",
  "Universiti Kebangsaan Malaysia (UKM)",
  "Universiti Putra Malaysia (UPM)",
  "Universiti Teknologi Malaysia (UTM)"
];

const COURSE_NAMES = [
  "Bachelor of Computer Science (AI)",
  "Bachelor of Software Engineering",
  "Bachelor of Medicine",
  "Bachelor of Accounting",
  "Bachelor of Engineering"
];

const MUET_SCORES = ["3.0", "3.5", "4.0", "4.5", "5.0", "5.5"];

export const generateMockData = (count: number = 20): { courses: Course[], stats: Record<string, ApplicantStats> } => {
  const courses: Course[] = [];
  const stats: Record<string, ApplicantStats> = {};

  for (let i = 0; i < count; i++) {
    const id = `crs_${i + 1}`;
    const institution = INSTITUTIONS[Math.floor(Math.random() * INSTITUTIONS.length)];
    const baseName = COURSE_NAMES[Math.floor(Math.random() * COURSE_NAMES.length)];
    const code = `${institution.substring(0, 2).toUpperCase()}${1000 + i}`;
    
    const quota = 50;
    const totalApplicants = 100;
    const totalAccepted = 40;
    const totalRejected = 60;
    const acceptanceRate = 40;

    const applicantsList: ApplicantDetail[] = [];
    let totalAPlus = 0;
    let totalA = 0;

    for (let j = 0; j < 30; j++) {
      const isAcc = j < 12;
      // Mock Data Generation
      const aPlusCount = Math.floor(Math.random() * 6); // 0-5 A+
      const aCount = Math.floor(Math.random() * 6); // 0-5 A
      totalAPlus += aPlusCount;
      totalA += aCount;

      const randomMuet = MUET_SCORES[Math.floor(Math.random() * MUET_SCORES.length)];

      applicantsList.push({
        id: `app_${id}_${j}`,
        isAccepted: isAcc,
        colB: `STPM-${1000+j}`, // Mock ID
        colC: "Warganegara",
        colD: `${Math.floor(Math.random() * 40) + 60}`, // Koko Score (60-100)
        colE: aPlusCount.toString(), // SPM A+ Count
        colF: aCount.toString(), // SPM A Count
        colG: `Band ${randomMuet}`, // Mock MUET (3.0 - 5.5)
        colH: isAcc ? `${code} ${baseName}` : "OTHER COURSE",
        colI: "CHOICE 2",
        colJ: "CHOICE 3",
        colK: "N/A",
        colL: isAcc ? code : "GAGAL",
        colM: isAcc ? baseName : "TIADA TAWARAN"
      });
    }

    courses.push({
      id,
      code,
      name: baseName,
      institution,
      faculty: 'Mock Faculty',
      quota,
      totalApplicants,
      totalAccepted,
      totalRejected,
      acceptanceRate,
      applicantsList
    });

    stats[id] = {
      courseId: id,
      avg_spm_A_plus: parseFloat((totalAPlus / 30).toFixed(2)),
      avg_spm_A: parseFloat((totalA / 30).toFixed(2)),
      muet_band_3_0: 5,
      muet_band_3_5: 5,
      muet_band_4_0: 5,
      muet_band_4_5: 5,
      muet_band_5_0: 5,
      muet_band_5_plus: 5,
    };
  }

  return { courses, stats };
};