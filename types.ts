
export type Language = 'zh-CN' | 'zh-TW' | 'en';

export type TranslationRecord<T> = {
  [key in 'zh-CN' | 'zh-TW']: T;
} & {
  en?: T;
};

export type ReadingMode = 'standard' | 'visual_novel';

export type ReaderFont = 'mono' | 'sans' | 'serif' | 'custom-02' | 'pixel';

export type GraphicsQuality = 'high' | 'medium' | 'low';

export interface AppConfig {
  language: Language;
  crtEnabled: boolean;
  setupCompleted: boolean;
  bgmPlaying: boolean;
  bgmVolume: number;
  readerFont: ReaderFont;
  fontSize: number;
  readingMode: ReadingMode;
  pureReadingMode: boolean;
  nickname: string;
  graphicsQuality: GraphicsQuality;
}

export interface ChapterTranslation {
  title: string;
  summary?: string;
  content: string;
}

export interface Chapter {
  id: string;
  date: string;
  status?: 'published' | 'locked' | 'corrupted';
  mode?: ReadingMode;
  volumeId?: string; // Optional property to explicitly specify which volume this chapter belongs to
  isSubChapter?: boolean; // Indicates if this is a parallel/sub-chapter
  translations: TranslationRecord<ChapterTranslation>;
}

export interface SideStoryVolume {
  id: string;
  title: string; 
  titleEn: string;
  status: 'unlocked' | 'locked' | 'corrupted';
  chapters: Chapter[];
  completed?: boolean;
}
