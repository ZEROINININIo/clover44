#!/bin/bash
find components/ pages/ -type f -name "*.tsx" | xargs sed -i 's/text-emerald-700 font-bold/text-emerald-800 font-black drop-shadow-[0_0_8px_rgba(4,120,87,0.5)] tracking-wide/g'
