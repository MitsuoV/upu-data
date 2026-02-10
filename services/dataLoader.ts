import * as XLSX from 'xlsx';
import { Course, ApplicantStats, ApplicantDetail } from '../types';

const DATA_URL = "https://raw.githubusercontent.com/MitsuoV/game-assets/main/2025%20National%20Matriculation%20UPU%20Application%20Statistics%20Report.xlsx";

export const parseExcel = (data: ArrayBuffer | string): { courses: Course[], stats: Record<string, ApplicantStats> } => {
  const workbook = XLSX.read(data, { type: typeof data === 'string' ? 'binary' : 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  
  // Use header:1 to get an array of arrays.
  const rawRows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const courseMap: Record<string, {
    name: string;
    institution: string;
    code: string;
    applicants: ApplicantDetail[];
  }> = {};

  // Helper to normalize strings
  const cleanStr = (val: any) => String(val || '').trim().replace(/\s+/g, ' ');
  
  // Helper to normalize course names (Bacelor -> Sarjana Muda)
  const normalizeCourseName = (str: string) => {
    return str.toUpperCase()
      .replace(/\bBACELOR\b/g, 'SARJANA MUDA')
      .replace(/\bBACHELOR\b/g, 'SARJANA MUDA');
  };

  // Start iteration. Assume data starts at row 1 (index 1).
  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (!row || row.length < 5) continue; // Skip empty rows

    // --- 1. Extract Raw Columns B-M (Indices 1-12) ---
    const colB = cleanStr(row[1]);
    const colC = cleanStr(row[2]);
    const colD = cleanStr(row[3]); // KOKO
    const colE = cleanStr(row[4]); // SPM A+
    const colF = cleanStr(row[5]); // SPM A
    const colG = cleanStr(row[6]); // MUET
    const colH = cleanStr(row[7]); // Choice 1
    const colI = cleanStr(row[8]); // Choice 2
    const colJ = cleanStr(row[9]); // Choice 3
    const colK = cleanStr(row[10]);
    const colL = cleanStr(row[11]); // Result Code/Part 1
    const colM = cleanStr(row[12]); // Result Name/Part 2

    // --- 2. Determine Result Logic ---
    let acceptedCourseFull = `${colL} ${colM}`.trim();
    
    // Check for failure status
    const failureKeywords = ['GAGAL', 'TIADA', 'REJECTED', 'TIDAK BERJAYA', 'NULL'];
    let isSuccessful = true;
    if (!acceptedCourseFull || failureKeywords.some(k => acceptedCourseFull.toUpperCase().includes(k))) {
       isSuccessful = false;
       acceptedCourseFull = '';
    }

    // --- 3. Extract Choices ---
    const choices = [colH, colI, colJ].filter(c => c && c !== '-' && c !== '0');

    // --- 4. Process Courses ---
    const uniqueCourses = new Set<string>();
    choices.forEach(c => uniqueCourses.add(normalizeCourseName(c)));
    
    if (isSuccessful && acceptedCourseFull) {
      uniqueCourses.add(normalizeCourseName(acceptedCourseFull));
    }

    uniqueCourses.forEach(normalizedCourseKey => {
      let institution = "Unknown Institution";
      let courseName = normalizedCourseKey;
      
      const parts = normalizedCourseKey.split(' ');
      if (parts.length > 1 && /^[A-Z]{2,4}$/.test(parts[0])) {
         institution = parts[0];
         courseName = parts.slice(1).join(' ');
      }

      if (!courseMap[normalizedCourseKey]) {
        courseMap[normalizedCourseKey] = {
          name: courseName,
          institution: institution,
          code: `P-${Object.keys(courseMap).length + 100}`,
          applicants: []
        };
      }

      const normalizedAccepted = isSuccessful ? normalizeCourseName(acceptedCourseFull) : '';
      const isAcceptedForThisCourse = isSuccessful && (normalizedCourseKey === normalizedAccepted);

      courseMap[normalizedCourseKey].applicants.push({
        id: `app-${i}-${normalizedCourseKey.substring(0,8)}`,
        isAccepted: isAcceptedForThisCourse,
        colB, colC, colD, colE, colF, colG, colH, colI, colJ, colK, colL, colM
      });
    });
  }

  // --- 5. Convert Map to Array & Calculate Stats ---
  const courses: Course[] = [];
  const stats: Record<string, ApplicantStats> = {};

  Object.entries(courseMap).forEach(([key, data], index) => {
    const id = `crs_${index}`;
    const totalAccepted = data.applicants.filter(a => a.isAccepted).length;
    const totalApplicants = data.applicants.length;
    const totalRejected = totalApplicants - totalAccepted;
    const acceptanceRate = totalApplicants > 0 ? (totalAccepted / totalApplicants) * 100 : 0;

    courses.push({
      id,
      code: data.code,
      name: data.name,
      institution: data.institution,
      faculty: 'Standard Stream',
      quota: Math.max(totalAccepted, 10),
      totalApplicants,
      totalAccepted,
      totalRejected,
      acceptanceRate,
      applicantsList: data.applicants
    });

    // Calculate Stats from Columns E (A+), F (A), G (MUET)
    let totalAPlus = 0;
    let totalA = 0;
    
    // Initialize buckets
    const muetCounts = { 
      '3.0': 0, 
      '3.5': 0, 
      '4.0': 0, 
      '4.5': 0, 
      '5.0': 0, 
      '5+': 0 
    };

    data.applicants.forEach(app => {
      // Parse SPM A+ (Col E)
      const aPlusVal = parseInt(app.colE);
      if (!isNaN(aPlusVal)) totalAPlus += aPlusVal;

      // Parse SPM A (Col F)
      const aVal = parseInt(app.colF);
      if (!isNaN(aVal)) totalA += aVal;

      // Parse MUET (Col G)
      // Extract numeric part (e.g. "Band 4.0" -> 4.0, "3.5" -> 3.5)
      const muetString = app.colG.replace(/band/i, '').trim();
      const muetVal = parseFloat(muetString);

      if (!isNaN(muetVal)) {
        if (muetVal >= 5.5) muetCounts['5+']++;
        else if (muetVal >= 5.0) muetCounts['5.0']++; // Covers 5.0 to < 5.5
        else if (muetVal >= 4.5) muetCounts['4.5']++;
        else if (muetVal >= 4.0) muetCounts['4.0']++;
        else if (muetVal >= 3.5) muetCounts['3.5']++;
        else if (muetVal >= 3.0) muetCounts['3.0']++;
        // Ignoring < 3.0 based on spec "only band 3.0..."
      }
    });

    stats[id] = {
      courseId: id,
      avg_spm_A_plus: totalApplicants > 0 ? parseFloat((totalAPlus / totalApplicants).toFixed(2)) : 0,
      avg_spm_A: totalApplicants > 0 ? parseFloat((totalA / totalApplicants).toFixed(2)) : 0,
      muet_band_3_0: muetCounts['3.0'],
      muet_band_3_5: muetCounts['3.5'],
      muet_band_4_0: muetCounts['4.0'],
      muet_band_4_5: muetCounts['4.5'],
      muet_band_5_0: muetCounts['5.0'],
      muet_band_5_plus: muetCounts['5+'],
    };
  });

  return { courses, stats };
};

export const loadData = async (): Promise<{ courses: Course[], stats: Record<string, ApplicantStats> }> => {
  try {
    const response = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!response.ok) throw new Error("Fetch failed");
    const arrayBuffer = await response.arrayBuffer();
    return parseExcel(arrayBuffer);
  } catch (error) {
    console.error("Error loading data:", error);
    return { courses: [], stats: {} };
  }
};