
import React, { useEffect, useState } from 'react';
import { novelData } from '../data/novelData';
import { sideStoryVolumes } from '../data/sideStories';
import { Language } from '../types';
import { Printer, X, Download, FileText, Lock, ShieldAlert, Key } from 'lucide-react';
import { APP_VERSION } from '../data/version';

interface ScriptExporterProps {
  onClose: () => void;
  language: Language;
}

const AUTH_KEY = "55315171145141919810qwertyui";

const ScriptExporter: React.FC<ScriptExporterProps> = ({ onClose, language }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isError, setIsError] = useState(false);

  // Parsing helper to clean up visual novel tags for static reading
  const parseContent = (text: string) => {
    if (!text) return null;
    
    return text.split('\n').map((line, idx) => {
      let cleanLine = line.trim();
      
      // Skip logic dividers
      if (cleanLine === '[[DIVIDER]]') {
          return <hr key={idx} className="my-6 border-t-2 border-gray-200 dashed break-inside-avoid" />;
      }

      // Handle Images (Convert to visual block)
      if (cleanLine.startsWith('[[IMAGE::')) {
          // Format: [[IMAGE::url::caption]]
          const content = cleanLine.slice(9, -2);
          const parts = content.split('::');
          const src = parts[0];
          const caption = parts.length > 1 ? parts.slice(1).join('::') : 'IMAGE_ASSET';
          return (
              <div key={idx} className="my-6 p-4 border border-gray-300 bg-gray-50 flex flex-col items-center break-inside-avoid">
                  <img src={src} alt={caption} className="max-h-64 object-contain opacity-90 grayscale mb-2 select-none" onContextMenu={(e) => e.preventDefault()} draggable={false} /> 
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">[FIG. {caption}]</span>
              </div>
          );
      }

      // Handle System/Danger Tags -> Convert to Bold Monospace
      if (cleanLine.startsWith('[[DANGER::') || cleanLine.startsWith('[[WARN')) {
          const content = cleanLine.replace(/\[\[.*?::(.*?)\]\]/g, '$1');
          return (
              <div key={idx} className="my-2 font-mono text-sm font-bold text-gray-900 border-l-4 border-black pl-2 uppercase break-inside-avoid">
                  {content}
              </div>
          );
      }

      // Clean Rich Text Tags: [[TYPE::CONTENT]] -> CONTENT
      // We use a regex to replace the wrapper with just the content
      cleanLine = cleanLine.replace(/\[\[(.*?)::(.*?)\]\]/g, '$2');
      
      // Handle simple styling logic that might remain
      // Bold speakers
      const isDialogue = /^(.*?)(:|：)/.test(cleanLine);
      
      if (!cleanLine) return <br key={idx} />;

      return (
        <p key={idx} className={`mb-3 leading-relaxed text-justify ${isDialogue ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
          {cleanLine}
        </p>
      );
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleUnlock = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordInput === AUTH_KEY) {
          setIsAuthenticated(true);
      } else {
          setIsError(true);
          setPasswordInput("");
          setTimeout(() => setIsError(false), 500);
      }
  };

  const t = {
      print: language === 'en' ? 'PRINT / SAVE AS PDF' : '打印 / 另存为 PDF',
      close: language === 'en' ? 'CLOSE' : '关闭',
      preview: language === 'en' ? 'PRINT PREVIEW MODE' : '打印预览模式',
      tip: language === 'en' ? 'Tip: Select "Save as PDF" in the print destination.' : '提示：在打印窗口的目标打印机中选择“另存为 PDF”。'
  };

  const currentVersion = APP_VERSION;

  if (!isAuthenticated) {
      return (
          <div className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center text-ash-light font-mono p-4 animate-fade-in">
              <div 
                className="max-w-md w-full border-4 border-red-900/50 bg-black p-8 shadow-[0_0_50px_rgba(220,38,38,0.3)] relative overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                  {/* Scanline Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.05)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
                  
                  <div className="flex flex-col items-center gap-6 z-10 relative">
                      <div className="w-20 h-20 border-4 border-red-600 rounded-full flex items-center justify-center bg-red-950/20 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                          <Lock size={32} className="text-red-500" />
                      </div>
                      
                      <div className="text-center space-y-2">
                          <h2 className="text-2xl font-black text-red-500 tracking-[0.2em] mb-1 glitch-text-heavy" data-text="LOCKED">ARCHIVE LOCKED</h2>
                          <div className="text-[10px] text-red-400/60 uppercase font-mono border-t border-b border-red-900/50 py-1">
                              Restricted Access Level: 5<br/>
                              Encryption: SHA-256
                          </div>
                      </div>

                      <form onSubmit={handleUnlock} className="w-full flex flex-col gap-4 mt-4">
                          <div className="relative group">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-red-700">
                                  <Key size={14} />
                              </div>
                              <input 
                                  type="password" 
                                  value={passwordInput}
                                  onChange={e => setPasswordInput(e.target.value)}
                                  className={`w-full bg-black border-2 px-10 py-3 text-center text-red-100 font-mono text-sm tracking-widest focus:outline-none focus:border-red-500 transition-all placeholder:text-red-900/50 ${isError ? 'border-red-500 animate-shake-violent text-red-500' : 'border-red-900/50'}`}
                                  placeholder="ENTER_PASSKEY"
                                  autoFocus
                              />
                          </div>
                          
                          {isError && (
                              <div className="text-[10px] text-red-500 text-center font-bold animate-pulse flex items-center justify-center gap-2">
                                  <ShieldAlert size={12} /> INVALID CREDENTIALS
                              </div>
                          )}
                          
                          <div className="flex gap-4 mt-2">
                              <button 
                                  type="button" 
                                  onClick={onClose}
                                  className="flex-1 py-3 border border-red-900/30 text-red-700 hover:bg-red-900/10 transition-colors text-xs font-bold tracking-widest uppercase"
                              >
                                  {language === 'en' ? 'ABORT' : '取消'}
                              </button>
                              <button 
                                  type="submit" 
                                  className="flex-1 py-3 bg-red-600 border border-red-500 text-black hover:bg-red-500 hover:border-white transition-colors text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(220,38,38,0.4)]"
                              >
                                  {language === 'en' ? 'DECRYPT' : '解密'}
                              </button>
                          </div>
                      </form>
                  </div>
                  
                  {/* Decorative Corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-red-600"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-red-600"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600"></div>
              </div>
          </div>
      );
  }

  return (
    <div id="script-exporter-view" className="fixed inset-0 z-[9999] bg-white text-black overflow-y-auto font-serif animate-fade-in">
      {/* No-Print Control Bar */}
      <div className="sticky top-0 left-0 right-0 bg-zinc-900 text-white p-4 flex justify-between items-center print:hidden shadow-lg z-50">
          <div>
              <h2 className="text-lg font-bold flex items-center gap-2"><Printer size={20} /> {t.preview}</h2>
              <p className="text-xs text-gray-400 font-mono">{t.tip}</p>
          </div>
          <div className="flex gap-4">
              <button onClick={handlePrint} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 transition-colors shadow-hard-sm">
                  <Download size={16} /> {t.print}
              </button>
              <button onClick={onClose} className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold text-sm flex items-center gap-2 transition-colors shadow-hard-sm">
                  <X size={16} /> {t.close}
              </button>
          </div>
      </div>

      {/* Printable Content Area */}
      <div className="max-w-[210mm] mx-auto p-12 bg-white print:p-0 print:max-w-none min-h-screen shadow-2xl print:shadow-none">
          
          {/* Cover Page */}
          <div className="min-h-[80vh] flex flex-col justify-center items-center text-center border-b-2 border-black mb-12 break-after-page print:min-h-[90vh]">
              <div className="mb-8">
                  <FileText size={64} className="mx-auto mb-4 text-gray-800" strokeWidth={1} />
                  <div className="text-sm font-mono tracking-[0.5em] text-gray-500 uppercase">Project Nova Labs</div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter leading-none">{novelData.title}</h1>
              <h2 className="text-2xl font-light text-gray-600 mb-12 italic">{novelData.subtitle}</h2>
              
              <div className="text-xs font-mono text-gray-500 border-2 border-black p-4 text-left w-64 mx-auto mt-12">
                  <div>ARCHIVE_VER: {currentVersion}</div>
                  <div>EXPORT_DATE: {new Date().toLocaleDateString()}</div>
                  <div>AUTH: DECRYPTED_USER</div>
                  <div>ENCODING: UTF-8 / STATIC</div>
              </div>
          </div>

          {/* Intro */}
          <div className="mb-16 break-after-page">
              <h3 className="text-2xl font-bold border-b-2 border-black mb-6 pb-2 uppercase tracking-wider">00. Introduction</h3>
              <p className="text-lg leading-loose text-gray-700 font-serif italic pl-4 border-l-4 border-gray-300">{novelData.intro}</p>
          </div>

          {/* Table of Contents (Simple) */}
          <div className="mb-16 break-after-page">
              <h3 className="text-2xl font-bold border-b-2 border-black mb-6 pb-2 uppercase tracking-wider">01. Table of Contents</h3>
              <ul className="space-y-2 font-mono text-sm">
                  <li>&gt; Main Story ({novelData.chapters.length} Files)</li>
                  {sideStoryVolumes.map(vol => (
                      <li key={vol.id} className="pl-4 text-gray-600">- {vol.title} ({vol.chapters.length} Files)</li>
                  ))}
              </ul>
          </div>

          {/* Main Story */}
          <div className="mb-12">
              <div className="text-center mb-16 break-before-page">
                  <h1 className="text-4xl font-black uppercase tracking-widest border-y-4 border-black py-4 inline-block">Main Story Archives</h1>
                  <p className="text-gray-500 font-mono mt-2">PRIORITY: ALPHA</p>
              </div>

              {novelData.chapters.map((chapter, i) => {
                  const data = chapter.translations[language] || chapter.translations['zh-CN'];
                  // Include locked chapters as placeholders
                  const isLocked = chapter.status === 'locked' && data.content.length < 50;

                  return (
                      <div key={chapter.id} className="mb-16 break-inside-avoid">
                          <div className="mb-6 border-l-4 border-black pl-4 flex flex-col gap-1 bg-gray-50 p-4">
                              <span className="text-xs font-mono font-bold text-gray-400">FILE_ID: {chapter.id.toUpperCase()}</span>
                              <h2 className="text-2xl font-bold">{data.title}</h2>
                              <div className="text-sm text-gray-500 font-mono mt-1 flex items-center gap-4">
                                  <span>{chapter.date}</span>
                                  {isLocked && <span className="px-2 bg-black text-white text-xs font-bold">ENCRYPTED</span>}
                              </div>
                          </div>
                          <div className="pl-4 font-serif text-base text-gray-800">
                              {isLocked ? (
                                  <div className="p-8 border-2 border-dashed border-gray-300 text-center font-mono text-gray-400 text-sm">
                                      [DATA_EXPUNGED]
                                      <br/>
                                      ACCESS_DENIED
                                  </div>
                              ) : (
                                  parseContent(data.content)
                              )}
                          </div>
                          <div className="mt-8 text-center text-gray-300 text-xs font-mono">--- END OF RECORD ---</div>
                          <div className="my-8 border-b border-gray-200 print:hidden"></div>
                      </div>
                  );
              })}
          </div>

          {/* Side Stories */}
          <div className="mb-12">
              <div className="text-center mb-16 break-before-page">
                  <h1 className="text-4xl font-black uppercase tracking-widest border-y-4 border-black py-4 inline-block">Side Story Archives</h1>
                  <p className="text-gray-500 font-mono mt-2">PRIORITY: BETA</p>
              </div>

              {sideStoryVolumes.map((volume) => (
                  <div key={volume.id} className="mb-12">
                      <div className="mb-12 break-before-page border-b-2 border-gray-800 pb-2">
                          <span className="text-xs font-mono text-gray-500 block mb-1">VOLUME_ID: {volume.id}</span>
                          <h2 className="text-3xl font-bold text-gray-900">{volume.title}</h2>
                      </div>
                      
                      {volume.chapters.map((chapter) => {
                          const data = chapter.translations[language] || chapter.translations['zh-CN'];
                          const isLocked = chapter.status === 'locked' && data.content.length < 50;
                          
                          // Skip interactive only chapters for PDF clarity
                          if (chapter.id === 'special-terminal-discovery') return null;

                          return (
                              <div key={chapter.id} className="mb-12 ml-0 md:ml-4 break-inside-avoid">
                                  <div className="mb-4 bg-gray-50 p-3 border-l-2 border-gray-400">
                                      <h3 className="text-xl font-bold">{data.title}</h3>
                                      <div className="text-xs text-gray-500 font-mono">{chapter.date} | {chapter.id}</div>
                                  </div>
                                  <div className="pl-2 border-l border-gray-100">
                                      {isLocked ? (
                                          <div className="font-mono text-xs text-gray-400 italic">[Content Encrypted]</div>
                                      ) : (
                                          parseContent(data.content)
                                      )}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              ))}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 font-mono mt-24 pt-8 border-t border-gray-200 break-inside-avoid">
              NOVA LABS ARCHIVE SYSTEM // END OF DOCUMENT
              <br/>
              GENERATED BY STATIC_EXPORT_TOOL
          </div>

      </div>

      <style>{`
        @media print {
          @page { margin: 2cm; size: A4; }
          
          /* 1. Global Reset to allow full height */
          html, body, #root {
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
            position: relative !important;
            display: block !important;
          }

          /* 2. Hide everything else */
          body * {
            visibility: hidden;
          }

          /* 3. Show Exporter and its children */
          #script-exporter-view, #script-exporter-view * {
            visibility: visible;
          }

          /* 4. Position Exporter to top */
          #script-exporter-view {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: white !important;
            z-index: 2147483647 !important;
          }
          
          /* 5. Override specific internal layout constraints */
          #script-exporter-view > div.max-w-\\[210mm\\] {
             max-width: none !important;
             margin: 0 !important;
             padding: 0 !important;
             box-shadow: none !important;
          }

          .break-after-page { page-break-after: always; }
          .break-before-page { page-break-before: always; }
          .break-inside-avoid { page-break-inside: avoid; }
          
          /* Hide scrollbars and no-print elements */
          ::-webkit-scrollbar { display: none; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ScriptExporter;
