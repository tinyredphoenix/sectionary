export type LawType = 'Income Tax' | 'GST';

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  badge?: string; // e.g., "Supreme Court", "Circular No. 123"
}

export interface Section {
  id: string;
  number: string;
  name: string;
  type: LawType;
  family: string;
  synopsis: string;
  benchmarks: string; // Storing as string for now, parsed in UI
  amendments: TimelineEvent[];
  circulars: TimelineEvent[];
  caseLaws: TimelineEvent[];
}

export const mockSections: Section[] = [
  {
    id: '1',
    number: 'Section 10(13A)',
    name: 'House Rent Allowance',
    type: 'Income Tax',
    family: 'Chapter III: Incomes which do not form part of Total Income',
    synopsis: 'Exemption for House Rent Allowance (HRA) received by an employee from their employer is covered under this section. The exemption is limited to the least of the following: Actual HRA received, Rent paid in excess of 10% of salary, or 50%/40% of salary depending on the city.',
    benchmarks: 'Maximum Limit: As per calculation rules. City Type: Metro (50%) vs Non-Metro (40%). Salary Definition: Basic + DA.',
    amendments: [
      {
        id: 'a1',
        date: '2023-04-01',
        title: 'Finance Act 2023',
        description: 'Clarified the definition of "salary" for the purpose of HRA calculation in cases of commission-based remuneration.',
        badge: 'Finance Act'
      },
      {
        id: 'a2',
        date: '2020-04-01',
        title: 'New Tax Regime Introduction',
        description: 'Section 10(13A) exemption made unavailable for taxpayers opting for the New Tax Regime u/s 115BAC.',
        badge: 'Major Amendment'
      }
    ],
    circulars: [
      {
        id: 'c1',
        date: '2023-06-15',
        title: 'Circular No. 5/2023',
        description: 'Clarification regarding the submission of rent receipts for claiming HRA exemption by employees.',
        badge: 'Circular 5/2023'
      },
       {
        id: 'c2',
        date: '2019-02-10',
        title: 'Notification No. 12/2019',
        description: 'Updated guidelines for PAN requirement of landlord where annual rent exceeds Rs. 1,00,000.',
        badge: 'Notification'
      }
    ],
    caseLaws: [
      {
        id: 'cl1',
        date: '2022-11-20',
        title: 'CIT vs. Example Case',
        description: 'Supreme Court ruled that HRA exemption cannot be denied solely on the ground that the landlord is a close relative, provided actual rent is paid.',
        badge: 'Supreme Court'
      },
      {
        id: 'cl2',
        date: '2018-05-12',
        title: 'ITAT Delhi Ruling',
        description: 'Held that sham transactions for HRA claims without genuine residence will be disallowed.',
        badge: 'ITAT Delhi'
      }
    ],
  },
  {
    id: '3',
    number: 'Section 9',
    name: 'Levy and Collection',
    type: 'GST',
    family: 'Chapter III: Levy and Collection of Tax',
    synopsis: 'The charging section for CGST. It empowers the government to levy CGST on all intra-state supplies of goods or services or both, except on the supply of alcoholic liquor for human consumption.',
    benchmarks: 'Max Rate: 20%. RCM Applicability: Yes, u/s 9(3) & 9(4). E-Commerce Operator: Liable u/s 9(5).',
    amendments: [
      {
        id: 'a1',
        date: '2018-02-01',
        title: 'CGST Amendment Act, 2018',
        description: 'Inserted sub-section (4) to restrict RCM to specified class of registered persons receiving supplies from unregistered persons.',
        badge: 'Amendment Act'
      }
    ],
    circulars: [
       {
        id: 'c1',
        date: '2017-07-01',
        title: 'Circular No. 1/1/2017-GST',
        description: 'Clarifications on levy of GST on various services and goods immediately post-implementation.',
        badge: 'Circular 1/2017'
      }
    ],
    caseLaws: [
      {
        id: 'cl1',
        date: '2020-09-15',
        title: 'Mohit Minerals vs Union of India',
        description: 'Challenge regarding the levy of GST on ocean freight under RCM.',
        badge: 'Gujarat High Court'
      }
    ],
  }
];
