
import { Language, TranslationRecord } from '../types';

export interface CreditEntry {
  id: string;
  name: string;
  contribution: TranslationRecord<string>; // e.g., "Sponsored $5"
  tags: string[]; // e.g., ["Original Fan", "Developer"]
  date?: string;
  message?: string; // Optional message from the sponsor
}

export const creditsData: CreditEntry[] = [
  {
    id: "001",
    name: "流忆如梦",
    contribution: {
      'zh-CN': '赞助 40 元',
      'zh-TW': '贊助 40 元',
      'en': 'Sponsored CNY ¥40'
    },
    tags: ["Original Fan", "0"],
    date: "2026",
    message: "原始粉丝 / First Supporter"
  },
  {
    id: "002",
    name: "ccdhtlp",
    contribution: {
      'zh-CN': '赞助 18.43 元',
      'zh-TW': '贊助 18.43 元',
      'en': 'Sponsored CNY ¥18.43'
    },
    tags: [],
    date: "2026"
  },
  {
    id: "003",
    name: "KNBKDsama",
    contribution: {
      'zh-CN': '赞助 11.45 元',
      'zh-TW': '贊助 11.45 元',
      'en': 'Sponsored CNY ¥11.45'
    },
    tags: [],
    date: "2026"
  }  
];
