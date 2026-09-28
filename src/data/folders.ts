import { DocumentCategory, FolderNode } from '../types';

export const PERSONAL_FOLDERS: FolderNode[] = [
  {
    id: 'personal',
    name: 'Personal',
    path: 'Personal',
    category: 'Personal',
    subfolders: [
      { id: 'pers-identity', name: 'Identity', path: 'Personal/Identity', category: 'Personal' },
      { id: 'pers-gov', name: 'Government Documents', path: 'Personal/Government Documents', category: 'Personal' },
      { id: 'pers-travel', name: 'Travel', path: 'Personal/Travel', category: 'Personal' },
      { id: 'pers-other', name: 'Other', path: 'Personal/Other', category: 'Personal' },
    ],
  },
  {
    id: 'education',
    name: 'Education',
    path: 'Education',
    category: 'Education',
    subfolders: [
      { id: 'edu-certs', name: 'Certificates', path: 'Education/Certificates', category: 'Education' },
      { id: 'edu-degrees', name: 'Degrees', path: 'Education/Degrees', category: 'Education' },
      { id: 'edu-transcripts', name: 'Transcripts', path: 'Education/Transcripts', category: 'Education' },
      { id: 'edu-admission', name: 'Admission', path: 'Education/Admission', category: 'Education' },
      { id: 'edu-academic', name: 'Academic Records', path: 'Education/Academic Records', category: 'Education' },
    ],
  },
  {
    id: 'career',
    name: 'Career',
    path: 'Career',
    category: 'Career',
    subfolders: [
      { id: 'car-emp', name: 'Employment', path: 'Career/Employment', category: 'Career' },
      { id: 'car-certs', name: 'Certifications', path: 'Career/Certifications', category: 'Career' },
      { id: 'car-training', name: 'Training', path: 'Career/Training', category: 'Career' },
      { id: 'car-resume', name: 'CV & Resume', path: 'Career/CV & Resume', category: 'Career' },
      { id: 'car-prof-records', name: 'Professional Records', path: 'Career/Professional Records', category: 'Career' },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    path: 'Finance',
    category: 'Finance',
    subfolders: [
      { id: 'fin-bank', name: 'Bank', path: 'Finance/Bank', category: 'Finance' },
      { id: 'fin-tax', name: 'Tax', path: 'Finance/Tax', category: 'Finance' },
      { id: 'fin-receipts', name: 'Receipts', path: 'Finance/Receipts', category: 'Finance' },
      { id: 'fin-invest', name: 'Investments', path: 'Finance/Investments', category: 'Finance' },
      { id: 'fin-statements', name: 'Statements', path: 'Finance/Statements', category: 'Finance' },
    ],
  },
  {
    id: 'insurance',
    name: 'Insurance',
    path: 'Insurance',
    category: 'Insurance',
    subfolders: [
      { id: 'ins-health', name: 'Health', path: 'Insurance/Health', category: 'Insurance' },
      { id: 'ins-vehicle', name: 'Vehicle', path: 'Insurance/Vehicle', category: 'Insurance' },
      { id: 'ins-property', name: 'Property', path: 'Insurance/Property', category: 'Insurance' },
      { id: 'ins-other', name: 'Other', path: 'Insurance/Other', category: 'Insurance' },
    ],
  },
  {
    id: 'property',
    name: 'Property',
    path: 'Property',
    category: 'Property',
    subfolders: [
      { id: 'prop-land', name: 'Land', path: 'Property/Land', category: 'Property' },
      { id: 'prop-house', name: 'House', path: 'Property/House', category: 'Property' },
      { id: 'prop-rental', name: 'Rental', path: 'Property/Rental', category: 'Property' },
      { id: 'prop-docs', name: 'Documents', path: 'Property/Documents', category: 'Property' },
    ],
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    path: 'Vehicles',
    category: 'Vehicles',
    subfolders: [
      { id: 'veh-registration', name: 'Registration', path: 'Vehicles/Registration', category: 'Vehicles' },
      { id: 'veh-insurance', name: 'Insurance', path: 'Vehicles/Insurance', category: 'Vehicles' },
      { id: 'veh-inspection', name: 'Inspection', path: 'Vehicles/Inspection', category: 'Vehicles' },
      { id: 'veh-maintenance', name: 'Maintenance', path: 'Vehicles/Maintenance', category: 'Vehicles' },
    ],
  },
  {
    id: 'family',
    name: 'Family',
    path: 'Family',
    category: 'Family',
    subfolders: [
      { id: 'fam-marriage', name: 'Marriage', path: 'Family/Marriage', category: 'Family' },
      { id: 'fam-birth', name: 'Birth', path: 'Family/Birth', category: 'Family' },
      { id: 'fam-other', name: 'Other', path: 'Family/Other', category: 'Family' },
    ],
  },
  {
    id: 'legal',
    name: 'Legal',
    path: 'Legal',
    category: 'Legal',
    subfolders: [
      { id: 'leg-contracts', name: 'Contracts', path: 'Legal/Contracts', category: 'Legal' },
      { id: 'leg-agreements', name: 'Agreements', path: 'Legal/Agreements', category: 'Legal' },
      { id: 'leg-other', name: 'Other', path: 'Legal/Other', category: 'Legal' },
    ],
  },
];
