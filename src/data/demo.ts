// src/data/demo.ts

export type Video = { id: string; title: string; url: string };
export type Pdf = { id: string; title: string; url: string };

// 🔹 Question with explanation and image support
export type Question = {
  id: string;
  q: string;
  qImage?: string;           // Optional question image URL (diagrams, figures, graphs)
  options: string[];
  optionImages?: string[];   // Optional image URLs for options (for image-based answers)
  correctIndex: number;
  explanation?: string;
  explanationImage?: string; // Optional explanation diagram
};

export type PYQPdfPaper = {
  id: string;
  subjectId: string;   // 'phy', 'chem', etc.
  year: number;
  exam: string;        // 'NEET'
  title: string;       // e.g. 'NEET 2023 – Physics MCQ Paper (PDF)'
  pdfUrl: string;
};

// Your existing structures
export type Chapter = {
  id: string;
  name: string;
  videos: Video[];
  pdfs: Pdf[];
  questions: Question[];
};
export type Unit = { id: string; name: string; chapters: Chapter[] };
export type Subject = { id: string; name: string; units: Unit[] };

// 🔹 Previous year paper structure
export type PYQPaper = {
  id: string;
  subjectId: string;
  year: number;
  exam: string;       // e.g. 'NEET'
  title: string;      // e.g. 'NEET 2023 – Physics'
  questions: Question[];
};

export const SUBJECTS: Subject[] = [
  {
    id: 'phy',
    name: 'Physics',
    units: [
      {
        id: 'u1',
        name: 'Unit 1',
        chapters: [
          {
            id: 'c1',
            name: 'Chapter 1',
            // 🔹 Sample videos: YouTube + Drive
            videos: [
              {
                id: 'phy-c1-yt1',
                title: 'Motion in a Straight Line – Concept Explain (YouTube)',
                url: 'https://www.youtube.com/watch?v=QJUxSm_t42o',
              },
              {
                id: 'phy-c1-drive1',
                title: 'Distance & Displacement – Full Lecture (Drive)',
                url: 'https://drive.google.com/file/d/1BF1TcatYpfPioTsM56-39HiTsFmVcOU7/view?usp=sharing',
              },
            ],
            // 🔹 Sample PDFs: Drive + normal PDF link
            pdfs: [
              {
                id: 'phy-c1-pdf1',
                title: 'Chapter 1 Handwritten Notes (Drive)',
                url: 'https://drive.google.com/file/d/1PHY_C1_NOTES/view?usp=sharing',
              },
              {
                id: 'phy-c1-pdf2',
                title: 'Formula Sheet – Motion in a Straight Line',
                url: 'https://example.com/physics/ch1-motion-formula-sheet.pdf',
              },
            ],
            questions: [
              {
                id: 'q1',
                q: 'Speed unit is?',
                options: ['m/s', 'kg', 'N', 'm'],
                correctIndex: 0,
                explanation:
                  'Speed is distance travelled per unit time, so the SI unit is metre per second (m/s).',
              },
              {
                id: 'q2',
                q: '2 + 2 = ?',
                options: ['3', '4', '5', '6'],
                correctIndex: 1,
                explanation: '2 added to 2 gives 4. This is a simple arithmetic fact.',
              },
              {
                id: 'q3',
                q: 'Which physical quantity is given by the slope of a distance–time graph?',
                options: ['Acceleration', 'Velocity', 'Force', 'Momentum'],
                correctIndex: 1,
                explanation:
                  'Slope of a distance–time graph = change in distance / change in time = velocity.',
              },
              {
                id: 'q4',
                q: 'A body covers equal distances in equal intervals of time. Its motion is:',
                options: ['Uniform', 'Non-uniform', 'Accelerated', 'Oscillatory'],
                correctIndex: 0,
                explanation:
                  'Equal distances in equal intervals of time means uniform speed → uniform motion.',
              },
              {
                id: 'q5',
                q: 'If velocity is constant, which of the following must be zero?',
                options: ['Displacement', 'Distance', 'Acceleration', 'Speed'],
                correctIndex: 2,
                explanation:
                  'Constant velocity means no change in velocity with time, so acceleration is zero.',
              },
            ],
          },
          {
            id: 'c2',
            name: 'Chapter 2',
            // 🔹 Give this chapter its own videos + PDFs too
            videos: [
              {
                id: 'phy-c2-yt1',
                title: 'Newton’s Laws of Motion – Part 1 (YouTube)',
                url: 'https://www.youtube.com/watch?v=KSTKheVpEq4',
              },
              {
                id: 'phy-c2-drive1',
                title: 'Laws of Motion – Problem Solving Session (Drive)',
                url: 'https://drive.google.com/file/d/1PHY_C2_LECTURE/view?usp=sharing',
              },
            ],
            pdfs: [
              {
                id: 'phy-c2-pdf1',
                title: 'Laws of Motion Summary Notes (Drive)',
                url: 'https://drive.google.com/file/d/1PHY_C2_NOTES/view?usp=sharing',
              },
            ],
            questions: [
              {
                id: 'phy-lom-q1',
                q: 'Newton’s first law is also known as:',
                options: [
                  'Law of inertia',
                  'Law of momentum',
                  'Law of gravitation',
                  'Law of energy conservation',
                ],
                correctIndex: 0,
                explanation:
                  'Newton’s first law describes inertia, so it is also called the law of inertia.',
              },
              {
                id: 'phy-lom-q2',
                q: 'Which of the following is NOT a contact force?',
                options: ['Friction', 'Tension', 'Gravitational force', 'Normal reaction'],
                correctIndex: 2,
                explanation:
                  'Gravitational force acts at a distance, without physical contact, so it is a non-contact force.',
              },
              {
                id: 'phy-lom-q3',
                q: 'Resultant of two equal and opposite forces acting at the same line of action is:',
                options: ['Twice any one force', 'Zero', 'Half any one force', 'Infinity'],
                correctIndex: 1,
                explanation:
                  'Equal and opposite forces along the same line cancel each other, so resultant is zero.',
              },
              {
                id: 'phy-lom-q4',
                q: 'Impulse is equal to:',
                options: [
                  'Change in kinetic energy',
                  'Change in momentum',
                  'Force × distance',
                  'Power × time',
                ],
                correctIndex: 1,
                explanation: 'Impulse = Force × time = change in momentum of the body.',
              },
            ],
          },
        ],
      },
      {
        id: 'u2',
        name: 'Unit 2',
        chapters: [
          {
            id: 'c3',
            name: 'Chapter 3',
            videos: [
              {
                id: 'phy-c3-yt1',
                title: 'Electric Charge & Field – Basics (YouTube)',
                url: 'https://www.youtube.com/watch?v=1T3gM6dG2Jw',
              },
              {
                id: 'phy-c3-drive1',
                title: 'Coulomb’s Law – Derivations (Drive)',
                url: 'https://drive.google.com/file/d/1PHY_C3_LECTURE/view?usp=sharing',
              },
            ],
            pdfs: [
              {
                id: 'phy-c3-pdf1',
                title: 'Electric Charges and Fields – NCERT Summary (Drive)',
                url: 'https://drive.google.com/file/d/1PHY_C3_NOTES/view?usp=sharing',
              },
            ],
            questions: [
              {
                id: 'phy-elec-q1',
                q: 'The SI unit of electric charge is:',
                options: ['Volt', 'Coulomb', 'Ohm', 'Ampere'],
                correctIndex: 1,
                explanation: 'Electric charge is measured in coulombs (C) in the SI system.',
              },
              {
                id: 'phy-elec-q2',
                q: 'Electric field lines never:',
                options: [
                  'Start from positive charge',
                  'End on negative charge',
                  'Intersect each other',
                  'Exist in vacuum',
                ],
                correctIndex: 2,
                explanation:
                  'If field lines intersected, the electric field would have two directions at one point, which is impossible.',
              },
              {
                id: 'phy-elec-q3',
                q: 'An electric dipole placed in a uniform electric field experiences:',
                options: [
                  'Only a force',
                  'Only a torque',
                  'Both force and torque',
                  'Neither force nor torque',
                ],
                correctIndex: 1,
                explanation:
                  'Net force is zero in a uniform field, but the dipole experiences a torque tending to align it with the field.',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'chem',
    name: 'Chemistry',
    units: [
      {
        id: 'u1',
        name: 'Unit 1',
        chapters: [
          {
            id: 'c1',
            name: 'Basic Chemistry',
            videos: [
              {
                id: 'chem-c1-yt1',
                title: 'Some Basic Concepts of Chemistry – Introduction (YouTube)',
                url: 'https://www.youtube.com/watch?v=RZ6NQdeKx6w',
              },
              {
                id: 'chem-c1-drive1',
                title: 'Mole Concept – Numericals Session (Drive)',
                url: 'https://drive.google.com/file/d/1CHEM_C1_LECTURE/view?usp=sharing',
              },
            ],
            pdfs: [
              {
                id: 'chem-c1-pdf1',
                title: 'Basic Concepts of Chemistry – Handwritten Notes (Drive)',
                url: 'https://drive.google.com/file/d/1CHEM_C1_NOTES/view?usp=sharing',
              },
              {
                id: 'chem-c1-pdf2',
                title: 'Mole Concept Practice Sheet',
                url: 'https://example.com/chemistry/ch1-mole-concept-practice.pdf',
              },
            ],
            questions: [
              {
                id: 'chem-basic-q1',
                q: 'Avogadro number represents:',
                options: [
                  'Number of atoms in 1 g of an element',
                  'Number of molecules in 1 mole of a substance',
                  'Number of ions in 1 mL of solution',
                  'Number of electrons in 1 atom',
                ],
                correctIndex: 1,
                explanation:
                  '1 mole of any substance contains 6.022 × 10²³ particles (molecules, atoms, ions, etc.).',
              },
              {
                id: 'chem-basic-q2',
                q: 'The SI unit of molarity is:',
                options: ['mol', 'mol/L', 'g/mol', 'kg'],
                correctIndex: 1,
                explanation:
                  'Molarity is defined as moles of solute per litre of solution → mol/L.',
              },
              {
                id: 'chem-basic-q3',
                q: 'Which of the following is an intensive property?',
                options: ['Volume', 'Mass', 'Density', 'Heat content'],
                correctIndex: 2,
                explanation:
                  'Density does not depend on the amount of substance, so it is an intensive property.',
              },
              {
                id: 'chem-basic-q4',
                q: '1 mole of an ideal gas at STP occupies:',
                options: ['22.4 L', '1 L', '2.24 L', '0.224 L'],
                correctIndex: 0,
                explanation:
                  'At STP, molar volume of an ideal gas is taken as 22.4 L.',
              },
            ],
          },
        ],
      },
    ],
  },
];

export type MockPdfPaper = {
  id: string;
  subjectId: string;   // 'phy', 'chem', etc.
  year: number;
  exam: string;        // e.g. 'NEET Mock'
  title: string;       // e.g. 'Full Syllabus Physics Mock Test 1'
  pdfUrl: string;
};

// 🔹 Mock Full Exam PDFs (all subjects combined)
export type MockFullExamPdf = {
  id: string;
  year: number;
  exam: string;       // e.g. 'NEET Mock'
  title: string;      // e.g. 'NEET Mock Test 1 – Full Exam'
  pdfUrl: string;
};

// 👉 Demo mock full exam papers (all subjects together)
export const MOCK_FULL_EXAM_PAPERS: MockFullExamPdf[] = [
  {
    id: 'mock-full-2025-1',
    year: 2025,
    exam: 'NEET Mock',
    title: 'NEET Mock Test 1 – Full Exam (All Subjects)',
    pdfUrl: 'https://example.com/mock-2025-test1-full.pdf',
  },
  {
    id: 'mock-full-2025-2',
    year: 2025,
    exam: 'NEET Mock',
    title: 'NEET Mock Test 2 – Full Exam (All Subjects)',
    pdfUrl: 'https://example.com/mock-2025-test2-full.pdf',
  },
];

// 👉 Demo subject-wise mock test papers
export const MOCK_PDF_PAPERS: MockPdfPaper[] = [
  // Physics mocks
  {
    id: 'mock-phy-2025-1',
    subjectId: 'phy',
    year: 2025,
    exam: 'NEET Mock',
    title: 'Full Syllabus Physics Mock Test 1',
    pdfUrl: 'https://example.com/mock-2025-phy-1.pdf',
  },
  {
    id: 'mock-phy-2025-2',
    subjectId: 'phy',
    year: 2025,
    exam: 'NEET Mock',
    title: 'Full Syllabus Physics Mock Test 2',
    pdfUrl: 'https://example.com/mock-2025-phy-2.pdf',
  },

  // Chemistry mocks
  {
    id: 'mock-chem-2025-1',
    subjectId: 'chem',
    year: 2025,
    exam: 'NEET Mock',
    title: 'Full Syllabus Chemistry Mock Test 1',
    pdfUrl: 'https://example.com/mock-2025-chem-1.pdf',
  },
  {
    id: 'mock-chem-2025-2',
    subjectId: 'chem',
    year: 2025,
    exam: 'NEET Mock',
    title: 'Full Syllabus Chemistry Mock Test 2',
    pdfUrl: 'https://example.com/mock-2025-chem-2.pdf',
  },

  // You can later add Bio / Zoology / Botany as per your SUBJECTS
];

export type FullExamPdf = {
  id: string;
  year: number;
  exam: string;   // 'NEET'
  title: string;  // 'NEET 2023 – Full Question Paper (All Subjects)'
  pdfUrl: string;
};

export const PYQ_FULL_EXAM_PAPERS: FullExamPdf[] = [
  {
    id: 'neet-2023-full',
    year: 2023,
    exam: 'NEET',
    title: 'NEET 2023 – Full Question Paper (All Subjects)',
    pdfUrl: 'https://example.com/neet-2023-full-paper.pdf',
  },
  {
    id: 'neet-2022-full',
    year: 2022,
    exam: 'NEET',
    title: 'NEET 2022 – Full Question Paper (All Subjects)',
    pdfUrl: 'https://example.com/neet-2022-full-paper.pdf',
  },
  // add more years as needed
];

export const PYQ_PDF_PAPERS: PYQPdfPaper[] = [
  {
    id: 'phy-2023-pdf',
    subjectId: 'phy',
    year: 2023,
    exam: 'NEET',
    title: 'NEET 2023 – Physics MCQ Paper (PDF)',
    pdfUrl: 'https://example.com/neet-2023-physics-mcq.pdf',
  },
  {
    id: 'phy-2022-pdf',
    subjectId: 'phy',
    year: 2022,
    exam: 'NEET',
    title: 'NEET 2022 – Physics MCQ Paper (PDF)',
    pdfUrl: 'https://example.com/neet-2022-physics-mcq.pdf',
  },
  {
    id: 'chem-2023-pdf',
    subjectId: 'chem',
    year: 2023,
    exam: 'NEET',
    title: 'NEET 2023 – Chemistry MCQ Paper (PDF)',
    pdfUrl: 'https://example.com/neet-2023-chemistry-mcq.pdf',
  },
  {
    id: 'chem-2022-pdf',
    subjectId: 'chem',
    year: 2022,
    exam: 'NEET',
    title: 'NEET 2022 – Chemistry MCQ Paper (PDF)',
    pdfUrl: 'https://example.com/neet-2022-chemistry-mcq.pdf',
  },
];

// 🔹 Demo Previous Year Papers (per subject + year) with explanations
export const PYQ_PAPERS: PYQPaper[] = [
  {
    id: 'phy-neet-2023',
    subjectId: 'phy',
    year: 2023,
    exam: 'NEET',
    title: 'NEET 2023 – Physics',
    questions: [
      {
        id: 'phy-neet23-q1',
        q: 'Which of the following is a scalar quantity?',
        options: ['Velocity', 'Displacement', 'Speed', 'Momentum'],
        correctIndex: 2,
        explanation:
          'Scalar quantities have only magnitude; speed has magnitude but no direction.',
      },
      {
        id: 'phy-neet23-q2',
        q: 'The SI unit of force is:',
        options: ['kg', 'm/s', 'N', 'J'],
        correctIndex: 2,
        explanation:
          'Force in SI is measured in newtons (N), defined as kg·m/s².',
      },
      {
        id: 'phy-neet23-q3',
        q: '1 kWh of electrical energy is equal to:',
        options: [
          '3.6 × 10³ J',
          '3.6 × 10⁶ J',
          '36 × 10⁶ J',
          '3.6 × 10⁵ J',
        ],
        correctIndex: 1,
        explanation: '1 kWh = 1000 W × 3600 s = 3.6 × 10⁶ joules.',
      },
    ],
  },
  {
    id: 'phy-neet-2022',
    subjectId: 'phy',
    year: 2022,
    exam: 'NEET',
    title: 'NEET 2022 – Physics',
    questions: [
      {
        id: 'phy-neet22-q1',
        q: '1 kWh is equal to:',
        options: ['3.6 × 10⁶ J', '3.6 × 10³ J', '36 J', '360 J'],
        correctIndex: 0,
        explanation:
          '1 kWh is the energy consumed by 1 kW appliance in 1 hour = 1000 × 3600 J = 3.6 × 10⁶ J.',
      },
      {
        id: 'phy-neet22-q2',
        q: 'Dimension of momentum is:',
        options: ['MLT⁻¹', 'ML²T⁻²', 'M²LT⁻²', 'MLT⁻²'],
        correctIndex: 0,
        explanation: 'Momentum = mass × velocity. Dimensions: M × LT⁻¹ = MLT⁻¹.',
      },
      {
        id: 'phy-neet22-q3',
        q: 'Work done is zero when:',
        options: [
          'Force and displacement are parallel',
          'Force is zero',
          'Displacement is zero',
          'Both (b) and (c)',
        ],
        correctIndex: 3,
        explanation:
          'Work = F·s·cosθ; if F = 0 or s = 0, work done is zero, so both (b) and (c) are correct.',
      },
    ],
  },
  {
    id: 'chem-neet-2023',
    subjectId: 'chem',
    year: 2023,
    exam: 'NEET',
    title: 'NEET 2023 – Chemistry',
    questions: [
      {
        id: 'chem-neet23-q1',
        q: 'Avogadro number is:',
        options: [
          '6.022 × 10²³ mol⁻¹',
          '3.0 × 10⁸ m/s',
          '1.6 × 10⁻¹⁹ C',
          '9.1 × 10⁻³¹ kg',
        ],
        correctIndex: 0,
        explanation:
          'Avogadro number is the number of particles present in one mole of a substance, equal to 6.022 × 10²³ mol⁻¹.',
      },
      {
        id: 'chem-neet23-q2',
        q: 'The SI unit of molarity is:',
        options: ['mol', 'mol/L', 'g/mol', 'kg'],
        correctIndex: 1,
        explanation:
          'Molarity = moles of solute per litre of solution, hence unit is mol/L.',
      },
      {
        id: 'chem-neet23-q3',
        q: 'Which law explains the relationship between pressure and volume of a gas at constant temperature?',
        options: [
          'Boyle’s law',
          'Charles’ law',
          'Avogadro’s law',
          'Gay-Lussac’s law',
        ],
        correctIndex: 0,
        explanation:
          'Boyle’s law: at constant temperature, pressure is inversely proportional to volume (P ∝ 1/V).',
      },
    ],
  },
  {
    id: 'chem-neet-2022',
    subjectId: 'chem',
    year: 2022,
    exam: 'NEET',
    title: 'NEET 2022 – Chemistry',
    questions: [
      {
        id: 'chem-neet22-q1',
        q: 'Which of the following has maximum number of atoms?',
        options: [
          '1 mol of H₂O',
          '1 mol of CO₂',
          '1 mol of NH₃',
          '1 mol of NaCl',
        ],
        correctIndex: 2,
        explanation:
          'NH₃ has 4 atoms per molecule (1 N + 3 H). For the same 1 mol, more atoms than H₂O (3), CO₂ (3), NaCl (2).',
      },
      {
        id: 'chem-neet22-q2',
        q: 'Which concentration term is temperature independent?',
        options: ['Molarity', 'Molality', 'Normality', 'Formality'],
        correctIndex: 1,
        explanation:
          'Molality depends on mass of solvent, not volume, so it is independent of temperature.',
      },
    ],
  },
];
