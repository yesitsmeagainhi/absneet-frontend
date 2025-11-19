// src/data/demo.ts

export type Video = { id: string; title: string; url: string };
export type Pdf = { id: string; title: string; url: string };
export type Question = { id: string; q: string; options: string[]; correctIndex: number };

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

// 🔹 New: Previous year paper structure
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
            videos: [
              { id: 'v1', title: 'Video 1', url: 'https://example.com/video1.mp4' },
              { id: 'v2', title: 'Video 2', url: 'https://example.com/video2.mp4' },
            ],
            pdfs: [
              { id: 'p1', title: 'Notes 1', url: 'https://example.com/notes1.pdf' },
            ],
            questions: [
              {
                id: 'q1',
                q: 'Speed unit is?',
                options: ['m/s', 'kg', 'N', 'm'],
                correctIndex: 0,
              },
              {
                id: 'q2',
                q: '2 + 2 = ?',
                options: ['3', '4', '5', '6'],
                correctIndex: 1,
              },
            ],
          },
          { id: 'c2', name: 'Chapter 2', videos: [], pdfs: [], questions: [] },
        ],
      },
      {
        id: 'u2',
        name: 'Unit 2',
        chapters: [
          { id: 'c3', name: 'Chapter 3', videos: [], pdfs: [], questions: [] },
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
            videos: [],
            pdfs: [],
            questions: [],
          },
        ],
      },
    ],
  },
];

// 🔹 Demo Previous Year Papers (per subject + year)
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
      },
      {
        id: 'phy-neet23-q2',
        q: 'The SI unit of force is:',
        options: ['kg', 'm/s', 'N', 'J'],
        correctIndex: 2,
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
        options: ['3.6 × 10^6 J', '3.6 × 10^3 J', '36 J', '360 J'],
        correctIndex: 0,
      },
      {
        id: 'phy-neet22-q2',
        q: 'Dimension of momentum is:',
        options: ['MLT⁻¹', 'ML²T⁻²', 'M²LT⁻²', 'MLT⁻²'],
        correctIndex: 0,
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
      },
      {
        id: 'chem-neet23-q2',
        q: 'The SI unit of molarity is:',
        options: ['mol', 'mol/L', 'g/mol', 'kg'],
        correctIndex: 1,
      },
    ],
  },
];
