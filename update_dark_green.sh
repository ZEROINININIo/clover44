#!/bin/bash

# Update CollabStarReader.tsx
sed -i 's/if (part.startsWith('\''\[\[BLUE::'\'')) {/if (part.startsWith('\''\[\[DARK_GREEN::'\'')) {\n                return <span key={index} className="text-emerald-700 font-bold">{part.slice(14, -2)}<\/span>;\n            }\n            if (part.startsWith('\''\[\[BLUE::'\'')) {/g' components/sidestory/readers/CollabStarReader.tsx

# Update SideStoryReader.tsx
sed -i 's/} else if (part.startsWith('\''\[\[BLUE::'\'') && part.endsWith('\''\]\]'\'')) {/} else if (part.startsWith('\''\[\[DARK_GREEN::'\'') \&\& part.endsWith('\''\]\]'\'')) {\n      const content = part.slice(14, -2);\n      return <span key={index} className="text-emerald-700 font-bold">{content}<\/span>;\n    } else if (part.startsWith('\''\[\[BLUE::'\'') \&\& part.endsWith('\''\]\]'\'')) {/g' components/sidestory/SideStoryReader.tsx

# Update PureReaderContent.tsx
sed -i 's/} else if (part.startsWith('\''\[\[BLUE::'\'') && part.endsWith('\''\]\]'\'')) {/} else if (part.startsWith('\''\[\[DARK_GREEN::'\'') \&\& part.endsWith('\''\]\]'\'')) {\n      const content = part.slice(14, -2);\n      return <span key={index} className="text-emerald-700 font-bold">{content}<\/span>;\n    } else if (part.startsWith('\''\[\[BLUE::'\'') \&\& part.endsWith('\''\]\]'\'')) {/g' components/PureReaderContent.tsx

# Update pages/VisualNovelPage.tsx (has two places!)
sed -i 's/|| part.startsWith('\''\[\[GREEN::'\'') || part.startsWith('\''\[\[VOID::'\'')) {/|| part.startsWith('\''\[\[GREEN::'\'') || part.startsWith('\''\[\[DARK_GREEN::'\'') || part.startsWith('\''\[\[VOID::'\'')) {/g' pages/VisualNovelPage.tsx

sed -i 's/if (part.startsWith('\''\[\[BLUE::'\'') && part.endsWith('\''\]\]'\'')) {/if (part.startsWith('\''\[\[DARK_GREEN::'\'') \&\& part.endsWith('\''\]\]'\'')) {\n            const content = part.slice(14, -2);\n            return <span key={index} className="text-emerald-700 font-bold">{content}<\/span>;\n        }\n        if (part.startsWith('\''\[\[BLUE::'\'') \&\& part.endsWith('\''\]\]'\'')) {/g' pages/VisualNovelPage.tsx

# Update pages/ReaderPage.tsx
sed -i 's/} else if (part.startsWith('\''\[\[BLUE::'\'') && part.endsWith('\''\]\]'\'')) {/} else if (part.startsWith('\''\[\[DARK_GREEN::'\'') \&\& part.endsWith('\''\]\]'\'')) {\n      const content = part.slice(14, -2);\n      return <span key={index} className="text-emerald-700 font-bold">{content}<\/span>;\n    } else if (part.startsWith('\''\[\[BLUE::'\'') \&\& part.endsWith('\''\]\]'\'')) {/g' pages/ReaderPage.tsx

# Update utils/vnParser.ts
sed -i 's/|| trimmed.startsWith('\''\[\[GREEN::'\'')/|| trimmed.startsWith('\''\[\[GREEN::'\'') || trimmed.startsWith('\''\[\[DARK_GREEN::'\'')/g' utils/vnParser.ts

