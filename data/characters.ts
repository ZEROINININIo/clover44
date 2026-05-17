
import { Character } from '../types';

export let characters: Character[] = [
  {
    id: "point",
    alias: "E.Point",
    themeColor: "text-zinc-400",
    avatar: "https://cdn.imgos.cn/vip/2026/04/04/69d126a4b9e70.jpg",
    stats: {
      strength: 7,
      intelligence: 6,
      agility: 8,
      mental: 6,
      resonance: 10
    },
    translations: {
      'zh-CN': {
        name: "零点",
        role: "核心/前线",
        tags: ["主心骨", "独立性", "隐形实力"],
        quote: "只要跑得够快，麻烦就追不上我！……大概？",
        description: [
          "**性格:** 团队的主心骨，性格活泼外向，具有极高的独立性。脑袋里经常装着小坏心思。",
          "**关系:** 和芷漓、泽洛都很亲密，是从小到大一直陪伴着的伙伴。对Void有特殊的依赖（被宠）。",
          "**能力:** 对公行动较保守，但对重要任务有自己的盘算，且拥有三人中最强的隐形实力。",
          "**弱点:** 容易吃苦头，但恢复得也快。"
        ]
      },
      'zh-TW': {
        name: "零點",
        role: "核心/前線",
        tags: ["主心骨", "獨立性", "隱形實力"],
        quote: "只要跑得夠快，麻煩就追不上我！……大概？",
        description: [
          "**性格:** 團隊的主心骨，性格活潑外向，具有極高的獨立性。腦袋裡經常裝著小壞心思。",
          "**關係:** 和芷漓、澤洛都很親密，是從小到大一直陪伴著的夥伴。對Void有特殊的依賴（被寵）。",
          "**能力:** 對公行動較保守，但對重要任務有自己的盤算，且擁有三人中最強的隱形實力。",
          "**弱點:** 容易吃苦頭，但恢復得也快。"
        ]
      },
      'en': {
        name: "Point",
        role: "Core/Frontline",
        tags: ["Backbone", "Independent", "Hidden Strength"],
        quote: "Catch me if you can!",
        description: [
          "**Personality:** The backbone of the team. Lively, outgoing, and highly independent. Often has mischievous ideas.",
          "**Relations:** Childhood friend of Zeri and Zelo. Favored by Void.",
          "**Ability:** Conservative in public but has the strongest hidden strength among the three.",
          "**Weakness:** Prone to trouble but recovers quickly."
        ]
      }
    }
  },
  {
    id: "zeri",
    alias: "S.Zeri / Liz / [[RAINBOW::???]]",
    themeColor: "text-pink-400",
    avatar: "https://cdn.imgos.cn/vip/2026/04/04/69d126a4c116e.jpg",
    stats: {
      strength: 0,
      intelligence: 0,
      agility: 0,
      mental: 0,
      resonance: 0
    },
    translations: {
      'zh-CN': {
        name: "芷漓",
        role: "科研",
        tags: ["洁癖", "理性", "嘴硬心软"],
        quote: "数据不会说谎，但解读数据的人经常犯蠢。",
        description: [
          "**性格:** 安静、沉稳、理性，典型的冷系科研型人格。生活规律，有点小洁癖。",
          "**外貌:** 视力极佳，从不佩戴眼镜。虽然常穿白大褂，但其实很注重仪表整洁。",
          "**工作:** 对工作极度认真，脑子里永远是研究与任务。",
          "**反差:** 表面淡定，实际上偶尔会耍小心机（例如诱骗零点加班）。",
          "**情感:** 嘴硬心软，非常关心队友，尤其是零点。低调害羞，不喜欢别人叫她“小名”，也不喜欢穿可爱的衣服。"
        ]
      },
      'zh-TW': {
        name: "芷漓",
        role: "科研",
        tags: ["潔癖", "理性", "嘴硬心軟"],
        quote: "數據不會說謊，但解讀數據的人經常犯蠢。",
        description: [
          "**性格:** 安靜、沉穩、理性，典型的冷系科研型人格。生活規律，有點小潔癖。",
          "**外貌:** 視力極佳，從不佩戴眼鏡。雖然常穿白大褂，但其實很注重儀表整潔。",
          "**工作:** 對工作極度認真，腦子裡永遠是研究與任務。",
          "**反差:** 表面淡定，實際上偶爾會耍小心機（例如誘騙零點加班）。",
          "**情感:** 嘴硬心軟，非常關心隊友，尤其是零點。低調害羞，不喜歡別人叫她「小名」，也不喜歡穿可愛的衣服。"
        ]
      },
      'en': {
        name: "Zeri",
        role: "Research",
        tags: ["Mysophobia", "Rational", "Tsundere"],
        quote: "Data doesn't lie.",
        description: [
          "**Personality:** Quiet, steady, rational. Has mild mysophobia and a disciplined life.",
          "**Appearance:** Excellent vision, never wears glasses. Keeps a tidy appearance despite the lab coat.",
          "**Work:** Extremely serious, always focused on research.",
          "**Contrast:** Appears calm but plays tricks (like making Point work overtime).",
          "**Emotion:** Sharp-tongued but soft-hearted. Cares deeply for the team, especially Point."
        ]
      }
    }
  },
  {
    id: "zelo",
    alias: "E.Zelo",
    themeColor: "text-blue-400",
    avatar: "https://cdn.imgos.cn/vip/2026/04/04/69d126a484139.jpg",
    stats: {
      strength: 4,
      intelligence: 5,
      agility: 7,
      mental: 10,
      resonance: 5
    },
    translations: {
      'zh-CN': {
        name: "泽洛",
        role: "支援/实验辅助",
        tags: ["元气", "贪玩", "少女感"],
        quote: "不管发生什么，我都会全力支持计划哦~",
        description: [
          "**性格:** 外向活泼，对任何事情都充满希望。可爱系角色，充满少女感。",
          "**工作:** 有时像小孩般贪玩，对工作不太上心，经常充当实验辅助员。",
          "**关系:** 对零点和芷漓都很了解，是亲人般的存在。",
          "**原则:** 有自己的需求时并不强迫他人帮助。"
        ]
      },
      'zh-TW': {
        name: "澤洛",
        role: "支援/實驗輔助",
        tags: ["元氣", "貪玩", "少女感"],
        quote: "不管發生什麼，我都會全力支持計畫哦~",
        description: [
          "**性格:** 外向活潑，對任何事情都充滿希望。可愛系角色，充滿少女感。",
          "**工作:** 有時像小孩般貪玩，對工作不太上心，經常充當實驗輔助員。",
          "**關係:** 對零點和芷漓都很了解，是親人般的存在。",
          "**原則:** 有自己的需求時並不強迫他人幫助。"
        ]
      },
      'en': {
        name: "Zelo",
        role: "Support/Assistant",
        tags: ["Genki", "Playful", "Girlish"],
        quote: "I'll support you!",
        description: [
          "**Personality:** Outgoing, lively, full of hope. Very cute and girlish.",
          "**Work:** Playful like a child, often acts as an experimental assistant.",
          "**Relations:** Understands Point and Zeri well, treated as family.",
          "**Principle:** Doesn't force others to help with her own needs."
        ]
      }
    }
  },
  {
    id: "void",
    alias: "Void [[MASK::Z.Byaki]]",
    themeColor: "text-white",
    stats: {
      strength: 0,
      intelligence: 0,
      agility: 0,
      mental: 0,
      resonance: 0
    },
    translations: {
      'zh-CN': {
        name: "零空",
        role: "神秘顾问/空界",
        tags: ["高维", "无限生命", "？？？"],
        quote: "干涉。",
        description: [
          "**身份:** 来自“空界”的高位存在，和三人关系特殊。",
          "**能力:** 拥有无限的生命和特殊的记忆系统。实力非常强，能轻松完成现实上难以做到的事情。",
          "**性格:** 看似散漫，但在关键节点非常可靠。",
          "**关系:** 对零点比较宠，会帮忙但也警告零点不要经常召唤它（因为会损害零点的身体）。"
        ]
      },
      'zh-TW': {
        name: "零空",
        role: "神秘顧問/空界",
        tags: ["高維", "無限生命", "？？？"],
        quote: "干涉。",
        description: [
          "**身份:** 來自「空界」的高位存在，和三人關係特殊。",
          "**能力:** 擁有無限的生命和特殊的記憶系統。實力非常強，能輕鬆完成現實上難以做到的事情。",
          "**性格:** 看似散漫，但在關鍵節點非常可靠。",
          "**關係:** 對零點比較寵，會幫忙但也警告零點不要經常召喚它（因為會損害零點的身體）。"
        ]
      },
      'en': {
        name: "Void",
        role: "Advisor/Void",
        tags: ["High-Dim", "Infinite", "???"],
        quote: "Interference.",
        description: [
          "**Identity:** A higher-dimensional being from 'The Void'.",
          "**Ability:** Infinite life, special memory system. Extremely powerful.",
          "**Personality:** Laid-back but reliable.",
          "**Relation:** Protective of Point, but warns against frequent summoning."
        ]
      }
    }
  },
  {
    id: "byaki",
    alias: "Z.Byaki（IN xbot）",
    themeColor: "text-emerald-400",
    stats: {
      strength: 0, // Xbot body
      intelligence: 0, // Original Mind
      agility: 0,
      mental: 0, // Unstable
      resonance: 0
    },
    translations: {
      'zh-CN': {
        name: "白栖",
        role: "核心/容器",
        tags: ["泽洛希", "幽灵容器", "变量"],
        quote: "这具身体...有些沉重。",
        description: [
          "**身份:** 前泽洛希家族成员，Void 的前身。目前意识数据被挂载于特制的高级 Xbot 机体中。",
          "**状态:** 虽然拥有了实体，但本质上是在燃烧“过去”的数据来维持“现在”的活动。是一根正在燃烧的蜡烛。",
          "**性格:** 温柔、坚定，带有浓厚的学者气质。对待零点等人如同长辈或老师。虽然现在需要重新适应物理世界（比如拿筷子）。",
          "**能力:** 拥有极高的计算能力和量子适应性，配合 Xbot 的机能，战斗力极强，但受限于能源（数据寿命）。"
        ]
      },
      'zh-TW': {
        name: "白栖",
        role: "核心/容器",
        tags: ["澤洛希", "幽靈容器", "變量"],
        quote: "這具身體...有些沉重。",
        description: [
          "**身分:** 前澤洛希家族成員，Void 的前身。目前意識數據被掛載於特製的高級 Xbot 機體中。",
          "**狀態:** 雖然擁有了實體，但本質上是在燃燒「過去」的數據來維持「現在」的活動。是一根正在燃燒的蠟燭。",
          "**性格:** 溫柔、堅定，帶有濃厚的學者氣質。對待零點等人如同長輩或老師。雖然現在需要重新適應物理世界（比如拿筷子）。",
          "**能力:** 擁有極高的計算能力和量子適應性，配合 Xbot 的機能，戰鬥力極強，但受限於能源（數據壽命）。"
        ]
      },
      'en': {
        name: "Byaki",
        role: "Core/Vessel",
        tags: ["Zeloshi", "Ghost Vessel", "Variable"],
        quote: "This body... is a bit heavy.",
        description: [
          "**Identity:** Former Zeloshi member, precursor to Void. Consciousness currently mounted in a specialized Xbot chassis.",
          "**Status:** Possesses a physical form but burns 'past' data to sustain 'present' activity. A burning candle.",
          "**Personality:** Gentle, firm, scholarly. Acts as a mentor to Point and others. Currently re-adapting to the physical world.",
          "**Ability:** High computational power and quantum adaptability. High combat capability via Xbot, limited by energy (data lifespan)."
        ]
      }
    }
  },
  {
    id: "puyou",
    alias: "PYO",
    themeColor: "text-teal-400",
    avatar: "https://cdn.imgos.cn/vip/2026/04/04/69d12715f3db0.jpg",
    stats: {
      strength: 0,
      intelligence: 0,
      agility: 0,
      mental: 0,
      resonance: 0
    },
    translations: {
      'zh-CN': {
        name: "普忧",
        role: "星图馆馆长",
        tags: ["不可捉摸", "未来干涉", "原型机"],
        quote: "……",
        description: [
          "**身份:** 本为“after”未来时间线的人物，但不知道为何和这个时间线产生了干涉。",
          "**能力:** 未知。",
          "**性格:** 不可捉摸。",
          "**关系:** after零点非常喜欢它，before时间线上芷漓重新激活了普忧原型机“普忧lite”。"
        ]
      },
      'zh-TW': {
        name: "普忧",
        role: "星图馆馆长",
        tags: ["不可捉摸", "未来干涉", "原型机"],
        quote: "……",
        description: [
          "**身份:** 本为“after”未来时间线的人物，但不知道为何和这个时间线产生了干涉。",
          "**能力:** 未知。",
          "**性格:** 不可捉摸。",
          "**关系:** after零点非常喜欢它，before时间线上芷漓重新激活了普忧原型机“普忧lite”。"
        ]
      },
      'en': {
        name: "PYO",
        role: "Astrolabe Library Curator",
        tags: ["Elusive", "Future Interference", "Prototype"],
        quote: "...",
        description: [
          "**Identity:** Originally a character from the 'after' future timeline, but somehow interfered with this timeline.",
          "**Ability:** Unknown.",
          "**Personality:** Elusive and unpredictable.",
          "**Relations:** 'After' Point likes it very much. In the 'before' timeline, Zeri reactivated its prototype 'PYO lite'."
        ]
      }
    }
  }
];
