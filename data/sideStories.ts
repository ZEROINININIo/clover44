
import { SideStoryVolume, Chapter } from '../types';
import { chapterC44_01 } from './side_story_files/C44_01';
import { chapterC44_02 } from './side_story_files/C44_02';
import { chapterC44_03 } from './side_story_files/C44_03';

const createCloverChapter = (idx: number, status: 'published' | 'locked' = 'locked'): Chapter => ({
    id: `story-collab-44-${idx}`,
    status,
    date: 'UNKNOWN',
    translations: {
        'zh-CN': {
            title: `四十四又二分之一 - 碎片 ${idx}`,
            summary: `四十四的一半！ (${idx})`,
            content: `【记录片段 ${idx}】\n\n四叶草的第 ${idx} 处脉络。\n`
        },
        'zh-TW': {
            title: `四十四又二分之一 - 碎片 ${idx}`,
            summary: `四十四的一半！ (${idx})`,
            content: `【記錄片段 ${idx}】\n\n四葉草的第 ${idx} 處脈絡。\n`
        }
    }
});

export const sideStoryVolumes: SideStoryVolume[] = [
  {
    id: "VOL_COLLAB_HALF_44",
    title: "四十四的一半！",
    titleEn: "Half of 44!",
    status: 'unlocked',
    chapters: [
      chapterC44_01,
      chapterC44_02,
      chapterC44_03,
      createCloverChapter(4),
      createCloverChapter(5),
      createCloverChapter(6),
      createCloverChapter(7),
      createCloverChapter(8),
    ]
  }
];

export const prequelVolumes: SideStoryVolume[] = [];
