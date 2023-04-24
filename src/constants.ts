import type { InitalSelectionOption, ModeOption } from './types';

export const initialSelectionDefault: InitalSelectionOption = 'Nothing';
export const defaultMaxDepth = 3;
export const modeDefault: ModeOption = 'Headings-only';

export const headingRegex = /^#{1,6} (.*)/gi;
