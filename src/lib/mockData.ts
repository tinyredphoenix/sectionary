export type LawType = 'Income Tax' | 'GST';

export interface Section {
  id: string;
  number: string;
  name: string;
  type: LawType;
  family: string;
  synopsis: string;
  benchmarks: string;
  amendments: string[];
  circulars: string[];
  caseLaws: string[];
}

export const mockSections: Section[] = [
  {
    id: '1',
    number: 'Section 10(13A)',
    name: 'House Rent Allowance',
    type: 'Income Tax',
    family: 'Chapter III: Incomes which do not form part of Total Income',
    synopsis: 'Exemption for House Rent Allowance (HRA) received by an employee from their employer.',
    benchmarks: 'Least of the following is exempt: 1. Actual HRA received, 2. 50% of salary (metro) or 40% (non-metro), 3. Rent paid minus 10% of salary.',
    amendments: ['Amended by Finance Act 2023 to clarify definitions.'],
    circulars: ['Circular No. 5/2023 - HRA Calculation'],
    caseLaws: ['CIT vs. Example Case (2022)'],
  },
  {
    id: '2',
    number: 'Section 80C',
    name: 'Deduction in respect of life insurance premia, deferred annuity, contributions to provident fund, subscription to certain equity shares or debentures, etc.',
    type: 'Income Tax',
    family: 'Chapter VI-A: Deductions to be made in computing Total Income',
    synopsis: 'Provides a deduction of up to Rs. 1.5 lakh for various investments and expenses.',
    benchmarks: 'Maximum limit: Rs. 1,50,000 per financial year.',
    amendments: [],
    circulars: [],
    caseLaws: [],
  },
  {
    id: '3',
    number: 'Section 9',
    name: 'Levy and Collection',
    type: 'GST',
    family: 'Chapter III: Levy and Collection of Tax',
    synopsis: 'The charging section for CGST. It empowers the government to levy CGST on all intra-state supplies of goods or services or both.',
    benchmarks: 'Rates as notified by the Government on recommendations of the Council, not exceeding 20%.',
    amendments: ['Finance Act 2018 inserted sub-section (4).'],
    circulars: ['Circular No. 1/1/2017-GST'],
    caseLaws: ['Mohit Minerals vs Union of India'],
  }
];
