
import { GitCommit, GitPullRequest, Database } from 'lucide-react';

export const TIMELINE_GROUPS = [
    {
        id: 'phase-0',
        label: { 'zh-CN': 'P-00: 析界余痕', 'zh-TW': 'P-00: 析界餘痕', 'en': 'P-00: ANALYSIS VESTIGES' },
        subLabel: { 'zh-CN': '来自析界节区的残留', 'zh-TW': '來自析界節區的殘留', 'en': 'Remnants from the Analysis Sector' },
        chapterIds: [
            'story-analysis-first-encounter', 
            'story-analysis-debt', 
            'story-analysis-terminal',
            'story-analysis-reunion',
            'story-analysis-unreachable',
            'story-analysis-dangerous-resolve',
            'story-analysis-ghost-encounter',
            'story-analysis-curiosity-entity',
            'story-analysis-future-reflection'
        ], 
        color: 'text-slate-400',
        borderColor: 'border-slate-500/50',
        bgGradient: 'from-slate-500/20',
        icon: Database
    },
    {
        id: 'phase-1',
        label: { 'zh-CN': 'P-01: 并行日常', 'zh-TW': 'P-01: 並行日常', 'en': 'P-01: PARALLEL DAILY' },
        subLabel: { 'zh-CN': 'Void 还在注视着', 'zh-TW': 'Void 還在注視著', 'en': 'Void is watching' },
        chapterIds: [
            'story-coffee-crisis', 
            'story-quantum-delivery', 
            'story-hotpot-protocol', 
            'story-cleanup-crisis', 
            'story-boundary-lighthouse', 
            'story-daily-ac-war', 
            'story-daily-jar',
            'story-daily-plant',
            'story-daily-coffee-ai',
            'story-daily-cleaner'
        ], 
        color: 'text-fuchsia-400',
        borderColor: 'border-fuchsia-500/50',
        bgGradient: 'from-fuchsia-500/20',
        icon: GitCommit
    },
    {
        id: 'phase-2',
        label: { 'zh-CN': 'P-02: 归来之后', 'zh-TW': 'P-02: 歸來之後', 'en': 'P-02: POST-RETURN' },
        subLabel: { 'zh-CN': '重新适应世界的重量', 'zh-TW': '重新適應世界的重量', 'en': 'Re-adapting to reality' },
        chapterIds: [
            'story-daily-readaptation', 
            'story-daily-gaming',
            'story-daily-shopping',
            'story-daily-recharge',
            'story-daily-noodles',
            'story-daily-cooking-byaki'
        ], 
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/50',
        bgGradient: 'from-emerald-500/20',
        icon: GitPullRequest
    }
];
