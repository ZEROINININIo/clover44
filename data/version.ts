
import { Language, TranslationRecord } from '../types';

export let APP_VERSION = "TL.2.0.10-J";
export const setAppVersion = (v: string) => APP_VERSION = v;

export let LATEST_UPDATE_DATE = "2026-05-17";
export const setLatestUpdateDate = (d: string) => LATEST_UPDATE_DATE = d;

export const LATEST_CHAPTER_TITLE: TranslationRecord<string> = {
    'zh-CN': '四十四又二分之一',
    'zh-TW': '四十四又二分之一',
    'en': 'Forty-Four and a Half'
};

export const LATEST_UPDATE_PART: TranslationRecord<string> = {
    'zh-CN': '四十四的一半！',
    'zh-TW': '四十四的一半！',
    'en': 'Half of 44!'
};

export const LATEST_UPDATE_CODE = "C44-01";

export const LATEST_CHAPTER_ID = "story-collab-44-1";
