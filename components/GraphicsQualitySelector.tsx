
import React from 'react';
import { Gauge, Battery, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';
import { Language, GraphicsQuality } from '../types';

interface GraphicsQualitySelectorProps {
  value: GraphicsQuality;
  onChange: (q: GraphicsQuality) => void;
  language: Language;
  isSetupMode?: boolean;
}

const GraphicsQualitySelector: React.FC<GraphicsQualitySelectorProps> = ({ value, onChange, language, isSetupMode = false }) => {
  
  const labels = {
      'zh-CN': { title: '画质性能', low: '低 (流畅)', med: '中 (均衡)', high: '高 (完整)' },
      'zh-TW': { title: '畫質性能', low: '低 (流暢)', med: '中 (均衡)', high: '高 (完整)' },
      'en': { title: 'GRAPHICS QUALITY', low: 'LOW (FAST)', med: 'MED (BALANCED)', high: 'HIGH (FULL)' }
  }[language];

  if (isSetupMode) {
    return (
      <div className="w-full">
        <label className="block text-xs font-bold text-amber-600 mb-2 uppercase flex items-center gap-2">
            <Gauge size={14} /> {labels.title}
        </label>
        <div className="flex gap-2">
            {(['low', 'medium', 'high'] as GraphicsQuality[]).map(q => (
                <button
                    key={q}
                    onClick={() => onChange(q)}
                    className={`flex-1 py-2 px-1 border text-[10px] uppercase transition-all flex flex-col items-center justify-center gap-1 ${
                        value === q
                        ? 'border-amber-500 bg-amber-500/20 text-amber-400 shadow-[0_0_5px_rgba(245,158,11,0.3)]'
                        : 'border-amber-900/50 text-amber-800 hover:border-amber-700 hover:text-amber-600'
                    }`}
                >
                    {q === 'low' ? <BatteryLow size={12} /> : q === 'medium' ? <BatteryMedium size={12} /> : <BatteryFull size={12} />}
                    <span className="font-bold">{q === 'low' ? labels.low : q === 'medium' ? labels.med : labels.high}</span>
                </button>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 border-2 border-ash-gray/30 bg-ash-black/50">
        <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-ash-gray uppercase">
            <Gauge size={12} /> {labels.title}
        </div>
        <div className="flex gap-2">
            {(['low', 'medium', 'high'] as GraphicsQuality[]).map(q => (
                <button
                    key={q}
                    onClick={() => onChange(q)}
                    className={`flex-1 py-2 border transition-all text-[10px] flex flex-col items-center justify-center gap-1 ${
                        value === q
                        ? 'bg-ash-light text-ash-black border-ash-light shadow-hard-sm'
                        : 'bg-ash-black text-ash-gray border-ash-gray/50 hover:text-ash-light hover:border-ash-gray'
                    }`}
                >
                    <span className="font-bold">{q === 'low' ? 'LOW' : q === 'medium' ? 'MED' : 'HIGH'}</span>
                </button>
            ))}
        </div>
    </div>
  );
};

export default GraphicsQualitySelector;
