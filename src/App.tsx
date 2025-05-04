import React, { useEffect, useState } from 'react';
import { Code2, Github, Mail, Terminal, Zap, Binary, Cpu } from 'lucide-react';

function App() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showBinaryBackground, setShowBinaryBackground] = useState(true);
  const [effect, setEffect] = useState<'matrix' | 'ascii' | 'stars'>('matrix');
  const [showCrawl, setShowCrawl] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [inputActive, setInputActive] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isDOS, setIsDOS] = useState(false);
  const [dosSection, setDosSection] = useState<'main' | 'skills' | 'contacts' | 'exit'>('main');
  const [dosInput, setDosInput] = useState('');
  const [dosHistory, setDosHistory] = useState<string[]>([]);
  const [showStars, setShowStars] = useState(false);
  const [showSelfDestruct, setShowSelfDestruct] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    let seq: ('matrix' | 'stars' | 'ascii')[] = ['matrix', 'stars', 'ascii'];
    let idx = 0;
    setEffect(seq[idx]);
    setShowStars(seq[idx] === 'stars');
    const interval = setInterval(() => {
      idx = (idx + 1) % seq.length;
      setEffect(seq[idx]);
      setShowStars(seq[idx] === 'stars');
    }, 8000); // 8 секунд на каждый эффект

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  // Konami code state
  useEffect(() => {
    const konami = [38,38,40,40,37,39];
    let pos = 0;
    const onKeyDown = (e: KeyboardEvent) => {
      if (isDOS) return;
      if (e.keyCode === konami[pos]) {
        pos++;
        if (pos === konami.length) {
          setIsDOS(true);
          setDosSection('main');
          setDosInput('');
          setDosHistory([]);
          pos = 0;
        }
      } else {
        pos = 0;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDOS]);

  // DOS input handler
  useEffect(() => {
    if (!isDOS) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDOS(false);
        setDosSection('main');
        setDosInput('');
        setDosHistory([]);
        return;
      }
      if (e.key === 'Backspace') {
        setDosInput(dosInput => dosInput.slice(0, -1));
        return;
      }
      if (e.key === 'Enter') {
        handleDosCommand(dosInput.trim().toLowerCase());
        setDosInput('');
        return;
      }
      if (e.key.length === 1 && e.key.match(/^[a-z0-9 ]$/i)) {
        setDosInput(dosInput => dosInput + e.key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isDOS, dosInput]);

  function handleDosCommand(cmd: string) {
    let newHistory = [...dosHistory, `C:\\> ${cmd}`];
    if (cmd === 'skills') {
      setDosSection('skills');
      newHistory.push('Opening SKILLS section...');
    } else if (cmd === 'contacts' || cmd === 'contact') {
      setDosSection('contacts');
      newHistory.push('Opening CONTACTS section...');
    } else if (cmd === 'main' || cmd === 'home') {
      setDosSection('main');
      newHistory.push('Opening MAIN section...');
    } else if (cmd === 'exit') {
      setIsDOS(false);
      setDosSection('main');
      setDosInput('');
      setDosHistory([]);
      return;
    } else if (cmd === 'help') {
      newHistory.push('Available commands: main, skills, contacts, exit');
    } else if (cmd === '') {
      // do nothing
    } else {
      newHistory.push('Unknown command. Type "help" for available commands.');
    }
    setDosHistory(newHistory);
  }

  const skills = {
    javascript: 90,
    typescript: 85,
    react: 88,
    angular: 75,
    nextjs: 80,
    vue: 70, 
  };
  const skillDetails: Record<string, { label: string; desc: string; iconUrl: string }> = {
    javascript: {
      label: 'JavaScript',
      desc: 'ES6+, async/await, DOM, OOP, FP, Event Loop',
      iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/javascript.svg',
    },
    typescript: {
      label: 'TypeScript',
      desc: 'Типизация, generics, utility types, tsconfig',
      iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/typescript.svg',
    },
    react: {
      label: 'React',
      desc: 'Hooks, Context, Suspense, SSR, оптимизация',
      iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/react.svg',
    },
    angular: {
      label: 'Angular',
      desc: 'RxJS, DI, CLI, модули, компоненты',
      iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/angular.svg',
    },
    nextjs: {
      label: 'Next.js',
      desc: 'SSR, SSG, API routes, ISR, оптимизация',
      iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nextdotjs.svg',
    },
    vue: {
      label: 'Vue.js',
      desc: 'Composition API, Vuex, Router, Single File Components',
      iconUrl: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vuedotjs.svg',
    },
  };

  // Для анимации прогресс-баров
  const [animatedProgress, setAnimatedProgress] = useState<{[key: string]: number}>({});
  useEffect(() => {
    // Запускаем анимацию по очереди
    let timeouts: number[] = [];
    Object.entries(skills).forEach(([skill, value], idx) => {
      timeouts.push(setTimeout(() => {
        setAnimatedProgress(prev => ({ ...prev, [skill]: value }));
      }, idx * 400 + 400));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [isVisible]);

  const handleSecretClick = () => {
    if (inputActive || showCrawl) return;
    setClicks(c => {
      if (c + 1 >= 5) {
        setInputActive(true);
        return 0;
      }
      return c + 1;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const val = inputValue.trim().toLowerCase();
      if (val === 'кибераста') {
        setInputActive(false);
        setInputValue('');
        setShowCrawl(true);
        setTimeout(() => setShowCrawl(false), 10000);
      } else if (val === 'пиздец') {
        setInputActive(false);
        setInputValue('');
        setShowSelfDestruct(true);
        setTimeout(() => setShowSelfDestruct(false), 4000);
      } else {
        setInputActive(false);
        setInputValue('');
        setShowBSOD(true);
        setTimeout(() => setShowBSOD(false), 4000);
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDOS ? 'bg-[#222]' : 'bg-black'} text-white font-pixel`}>
      {/* DOS Overlay */}
      {isDOS ? (
        <DOSMenu
          section={dosSection}
          input={dosInput}
          history={dosHistory}
        />
      ) : (
        <>
          {/* Hero Section */}
          <div className="relative min-h-screen max-h-screen sm:h-screen flex flex-col items-center justify-center overflow-y-auto px-2 sm:px-0 w-full max-w-full"
            style={{ touchAction: 'pan-y' }}
          >
            {/* Dynamic Background: Matrix Rain, Pixel Stars, Ascii Rain */}
            {effect === 'matrix' && <MatrixRain show />}
            {effect === 'ascii' && <AsciiRain show />}
            {effect === 'stars' && showStars && <PixelStars />}
            {/* Star Wars Crawl Easter Egg */}
            {showCrawl && <StarWarsCrawl />}
            {/* BSOD Easter Egg */}
            {showBSOD && <BSOD />}
            {/* Self-Destruct Easter Egg */}
            {showSelfDestruct && <SelfDestruct />}
            {/* Main Content */}
            <div className={`relative z-10 text-center transform transition-all duration-1000 w-full max-w-2xl mx-auto ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-7xl font-bold mb-4 sm:mb-10 glitch-text tracking-wider break-words max-w-full">
                cvzpolq
              </h1>
              <div className="text-base xs:text-lg sm:text-3xl mb-2 sm:mb-4 typing-text px-1 xs:px-2 sm:px-4 mt-2 sm:mt-4 break-words max-w-full">Abdusalamov Magomed</div>
              <div className="inline-block relative group mb-6 sm:mb-12 w-full max-w-xs sm:max-w-none">
                <div className="absolute -inset-1 bg-white opacity-20 blur group-hover:opacity-30 transition-opacity duration-500 rounded-lg"></div>
                <div
                  className="relative bg-black px-3 sm:px-6 py-2 sm:py-3 rounded-lg border border-white/20 flex items-center space-x-2 sm:space-x-3 cursor-pointer w-full justify-center"
                  onClick={handleSecretClick}
                  tabIndex={0}
                  style={{ minHeight: 44 }}
                >
                  <Terminal className="w-5 h-5" />
                  <span className="text-sm sm:text-xl tracking-wide">
                    {inputActive ? (
                      <input
                        autoFocus
                        className="bg-transparent border-b border-white outline-none text-white font-pixel px-2 w-20 sm:w-32"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        placeholder="секрет..."
                        style={{ fontSize: '1em', letterSpacing: '0.05em' }}
                      />
                    ) : (
                      'think-asta team member'
                    )}
                  </span>
                  <Zap className="w-5 h-5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <section className="py-6 sm:py-20 px-1 sm:px-4">
            <div className="max-w-full sm:max-w-4xl mx-auto">
              <h2 className="text-lg sm:text-3xl font-bold mb-4 sm:mb-12 border-b border-white pb-2 sm:pb-4 glitch-text">
                Frontend Developer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-12">
                <div className="space-y-3 sm:space-y-6">
                  {/* Core Technologies */}
                  <div className="relative group pixel-gradient-bg pixel-border py-3 sm:py-8 px-1 sm:px-4 mb-3 sm:mb-8 pixel-section-animate">
                    <div className="absolute inset-0 pointer-events-none z-0">
                      <CodeRainBg />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xs sm:text-xl font-bold mb-2 sm:mb-6 flex items-center glitch-text pixel-title-glow">
                        <Code2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Core Technologies
                      </h3>
                      {/* Мини-карточки скиллов */}
                      <div
                        className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-8 justify-items-center items-start mt-2"
                      >
                        {Object.entries(skills).map(([skill], idx) => {
                          const { label, desc, iconUrl } = skillDetails[skill];
                          return (
                            <div
                              key={skill}
                              className={`
                                group/card relative flex flex-col items-center justify-center
                                bg-[#181818] pixel-border pixel-shadow
                                w-20 sm:w-28 min-h-[70px] sm:min-h-[110px] h-20 sm:h-28
                                transition-all duration-300
                                hover:z-10
                                hover:scale-110 hover:shadow-2xl hover:border-white/30
                                cursor-pointer
                                overflow-visible
                                animate-fadein
                              `}
                              style={{
                                animationDelay: `${idx * 120 + 100}ms`,
                                animationDuration: '600ms',
                                animationFillMode: 'backwards',
                              }}
                            >
                              <div className="pixel-card-gradient" />
                              {/* SVG-иконка */}
                              <img
                                src={iconUrl}
                                alt={label}
                                className="w-6 h-6 sm:w-9 sm:h-9 mb-1 transition-all duration-300 group-hover/card:w-8 group-hover/card:h-8 sm:group-hover/card:w-12 sm:group-hover/card:h-12"
                                style={{
                                  filter: 'drop-shadow(0 0 2px #fff)',
                                  zIndex: 1,
                                }}
                              />
                              <span
                                className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-white text-center px-1"
                                style={{
                                  maxWidth: '70px',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  wordBreak: 'break-word',
                                  lineHeight: 1.1,
                                  zIndex: 1,
                                }}
                                title={label}
                              >
                                {label}
                              </span>
                              <span className="text-[9px] sm:text-xs text-white/70" style={{ zIndex: 1 }}>{animatedProgress[skill] ?? 0}%</span>
                              {/* Описание появляется при наведении */}
                              <div
                                className={`
                                  absolute left-1/2 top-full mt-2 -translate-x-1/2
                                  w-32 sm:w-48 p-2 sm:p-3 rounded bg-black/90 border border-white/20 text-[9px] sm:text-xs text-white/80
                                  opacity-0 pointer-events-none
                                  group-hover/card:opacity-100 group-hover/card:pointer-events-auto
                                  transition-all duration-300
                                  shadow-xl
                                  z-20
                                `}
                                style={{
                                  wordBreak: 'break-word',
                                  whiteSpace: 'normal',
                                }}
                              >
                                {desc}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {/* Build & Infrastructure */}
                  <div className="relative group pixel-gradient-bg pixel-border py-3 sm:py-8 px-1 sm:px-4 mb-3 sm:mb-8 pixel-section-animate">
                    <div className="absolute inset-0 pointer-events-none z-0">
                      <CodeRainBg />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xs sm:text-xl font-bold mb-2 sm:mb-4 glitch-text pixel-title-glow">Build & Infrastructure</h3>
                      <ul className="space-y-1 sm:space-y-2">
                        <li className="pixel-border bg-[#181818] px-2 sm:px-4 py-1 sm:py-2 pixel-list-animate text-xs sm:text-base">Vite / Webpack</li>
                        <li className="pixel-border bg-[#181818] px-2 sm:px-4 py-1 sm:py-2 pixel-list-animate text-xs sm:text-base">ESLint / Prettier</li>
                        <li className="pixel-border bg-[#181818] px-2 sm:px-4 py-1 sm:py-2 pixel-list-animate text-xs sm:text-base">Babel / PostCSS</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-6">
                  {/* Testing & Security */}
                  <div className="relative group pixel-gradient-bg pixel-border py-3 sm:py-8 px-1 sm:px-4 mb-3 sm:mb-8 pixel-section-animate">
                    <div className="absolute inset-0 pointer-events-none z-0">
                      <CodeRainBg />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xs sm:text-xl font-bold mb-2 sm:mb-4 glitch-text pixel-title-glow">Testing & Security</h3>
                      <ul className="space-y-1 sm:space-y-2">
                        <li className="pixel-border bg-[#181818] px-2 sm:px-4 py-1 sm:py-2 pixel-list-animate text-xs sm:text-base">Jest / Vitest</li>
                        <li className="pixel-border bg-[#181818] px-2 sm:px-4 py-1 sm:py-2 pixel-list-animate text-xs sm:text-base">Playwright / Cypress</li>
                        <li className="pixel-border bg-[#181818] px-2 sm:px-4 py-1 sm:py-2 pixel-list-animate text-xs sm:text-base">Frontend Security</li>
                      </ul>
                    </div>
                  </div>
                  {/* DevOps & Deployment */}
                  <div className="relative group pixel-gradient-bg pixel-border py-3 sm:py-8 px-1 sm:px-4 mb-3 sm:mb-8 pixel-section-animate">
                    <div className="absolute inset-0 pointer-events-none z-0">
                      <CodeRainBg />
                    </div>
                    <div className="relative z-10">
                      <h3 className="text-xs sm:text-xl font-bold mb-2 sm:mb-4 glitch-text pixel-title-glow">DevOps & Deployment</h3>
                      <ul className="space-y-1 sm:space-y-2">
                        <li className="pixel-border bg-[#181818] px-2 sm:px-4 py-1 sm:py-2 pixel-list-animate text-xs sm:text-base">GitHub Actions</li>
                        <li className="pixel-border bg-[#181818] px-2 sm:px-4 py-1 sm:py-2 pixel-list-animate text-xs sm:text-base">Docker</li>
                        <li className="pixel-border bg-[#181818] px-2 sm:px-4 py-1 sm:py-2 pixel-list-animate text-xs sm:text-base">Firebase / Vercel / Netlify</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="py-4 sm:py-8 px-2 sm:px-4 border-t border-white/20">
            <div className="max-w-full sm:max-w-4xl mx-auto flex flex-col sm:flex-row justify-center items-center sm:space-x-6 space-y-3 sm:space-y-0">
              <a href="https://github.com/coneldiablo" className="hover:text-gray-400 transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="mailto:abdusalamovm@thinkasta.com" className="hover:text-gray-400 transition-colors">
                <Mail className="w-6 h-6" />
              </a>
              <a href="https://t.me/tindinec" className="hover:text-gray-400 transition-colors" target="_blank" rel="noopener noreferrer" title="Telegram">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.944 4.708a1.5 1.5 0 0 0-1.64-1.18c-2.13.32-13.44 4.04-17.6 5.44a1.5 1.5 0 0 0-.1 2.84l4.1 1.44 2.02 6.18a1.5 1.5 0 0 0 2.36.74l3.1-2.54 3.86 2.84a1.5 1.5 0 0 0 2.36-.86l2.7-12.7a1.5 1.5 0 0 0-.8-1.2ZM9.7 14.7l-1.3-4.02 7.7-4.8-6.4 8.82Zm2.1 2.1-1.1-3.36 2.2 1.62-1.1 1.74Zm7.1 1.1-3.1-2.28a1.5 1.5 0 0 0-1.8-.04l-1.1.9-1.7-5.18 8.7-2.7-2.98 9.3Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

// DOSMenu component
function DOSMenu({
  section,
  input,
  history,
}: {
  section: 'main' | 'skills' | 'contacts' | 'exit';
  input: string;
  history: string[];
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: '#222',
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: '1.1rem',
        letterSpacing: '0.04em',
        lineHeight: 1.7,
        userSelect: 'none',
        cursor: 'default',
      }}
    >
      <div
        style={{
          border: '3px solid #0f0',
          background: '#111',
          padding: '2.5rem 2.5rem 2rem 2.5rem',
          boxShadow: '0 0 32px #0f0, 0 0 0 8px #222',
          maxWidth: 700,
          width: '90vw',
          minHeight: 320,
          textAlign: 'left',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '1.3em', marginBottom: '1.5em' }}>
          Microsoft(R) MS-DOS(R) Version 6.22<br />
          (C)Copyright Microsoft Corp 1981-1994.
        </div>
        <div style={{ marginBottom: '1.5em', color: '#0ff' }}>
          Type <b>skills</b>, <b>contacts</b>, <b>main</b>, <b>exit</b> or <b>help</b> and press Enter.
        </div>
        <div style={{
          background: '#181818',
          padding: '1em',
          minHeight: 120,
          marginBottom: '1em',
          borderRadius: 6,
          color: '#0f0',
          fontSize: '1em',
          maxHeight: 180,
          overflowY: 'auto',
        }}>
          {history.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        <div style={{ color: '#0f0', fontSize: '1.1em', marginBottom: '1em' }}>
          <span style={{ color: '#0ff' }}>C:\&gt;</span> {input}
          <span className="animate-pulse" style={{ color: '#0ff' }}>_</span>
        </div>
        <div style={{ marginTop: '2em', color: '#0ff', fontSize: '0.9em', opacity: 0.7 }}>
          {section === 'main' && (
            <div>
              <b>MAIN:</b> Welcome to the DOS mode!<br />
              Type <b>skills</b> or <b>contacts</b> to navigate.<br />
            </div>
          )}
          {section === 'skills' && (
            <div>
              <b>SKILLS:</b><br />
              javascript: 90<br />
              typescript: 85<br />
              react: 88<br />
              angular: 75<br />
              nextjs: 80<br />
              <br />
              Type <b>main</b> to return.
            </div>
          )}
          {section === 'contacts' && (
            <div>
              <b>CONTACTS:</b><br />
              GitHub: github.com/cvzpolq<br />
              Email: contact@example.com<br />
              <br />
              Type <b>main</b> to return.
            </div>
          )}
        </div>
        <div style={{ color: '#0ff', fontSize: '0.8em', marginTop: '1.5em', opacity: 0.5 }}>
          Press ESC to exit DOS mode
        </div>
      </div>
    </div>
  );
}

function MatrixRain({ show }: { show: boolean }) {
  const columns = 32;
  const rows = 24;
  const [matrix, setMatrix] = useState<number[]>(() =>
    Array.from({ length: columns }, () => Math.floor(Math.random() * rows))
  );

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setMatrix(prev =>
        prev.map(pos =>
          Math.random() > 0.975
            ? Math.floor(Math.random() * rows)
            : (pos + 1) % rows
        )
      );
    }, 75);
    return () => clearInterval(interval);
  }, [show]);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1px',
        opacity: 0.13,
        fontFamily: 'monospace',
        fontSize: '1rem',
        height: '100%',
      }}
    >
      {Array.from({ length: columns * rows }).map((_, idx) => {
        const col = idx % columns;
        const row = Math.floor(idx / columns);
        const isActive = matrix[col] === row;
        return (
          <span
            key={idx}
            style={{
              color: isActive ? '#fff' : '#fff2',
              transition: 'color 0.2s',
              textShadow: isActive ? '0 0 8px #0ff' : 'none',
              display: 'block',
              height: '1.2em',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </span>
        );
      })}
    </div>
  );
}

function AsciiRain({ show }: { show: boolean }) {
  const columns = 32;
  const rows = 24;
  const asciiChars = '@#$%&*'.split('');
  const [matrix, setMatrix] = useState<number[]>(() =>
    Array.from({ length: columns }, () => Math.floor(Math.random() * rows))
  );

  useEffect(() => {
    if (!show) return;
    const interval = setInterval(() => {
      setMatrix(prev =>
        prev.map(pos =>
          Math.random() > 0.975
            ? Math.floor(Math.random() * rows)
            : (pos + 1) % rows
        )
      );
    }, 75);
    return () => clearInterval(interval);
  }, [show]);

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '1px',
        opacity: 0.13,
        fontFamily: 'monospace',
        fontSize: '1rem',
        height: '100%',
      }}
    >
      {Array.from({ length: columns * rows }).map((_, idx) => {
        const col = idx % columns;
        const row = Math.floor(idx / columns);
        const isActive = matrix[col] === row;
        return (
          <span
            key={idx}
            style={{
              color: isActive ? '#fff' : '#fff2',
              transition: 'color 0.2s',
              textShadow: isActive ? '0 0 8px #0ff' : 'none',
              display: 'block',
              height: '1.2em',
              textAlign: 'center',
              userSelect: 'none',
            }}
          >
            {asciiChars[Math.floor(Math.random() * asciiChars.length)]}
          </span>
        );
      })}
    </div>
  );
}

function PixelStars() {
  const [stars, setStars] = useState<{
    left: number;
    top: number;
    size: number;
    opacity: number;
    dx: number;
    dy: number;
  }[]>([]);

  useEffect(() => {
    // Генерируем звезды с рандомной скоростью
    const generateStars = () =>
      Array.from({ length: 120 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 1.2 + 0.6,
        opacity: Math.random() * 0.25 + 0.15,
        dx: (Math.random() - 0.5) * 0.25, // скорость по X
        dy: (Math.random() - 0.5) * 0.25, // скорость по Y
      }));
    setStars(generateStars());

    let raf: number;
    const animate = () => {
      setStars(prev =>
        prev.map(star => {
          let { left, top, dx, dy } = star;
          left += dx;
          top += dy;
          // отражение от границ
          if (left < 0 || left > 100) dx = -dx;
          if (top < 0 || top > 100) dy = -dy;
          left = Math.max(0, Math.min(100, left));
          top = Math.max(0, Math.min(100, top));
          // иногда меняем направление для хаотичности
          if (Math.random() < 0.01) dx = (Math.random() - 0.5) * 0.25;
          if (Math.random() < 0.01) dy = (Math.random() - 0.5) * 0.25;
          return { ...star, left, top, dx, dy };
        })
      );
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {stars.map((star, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            left: `${star.left}%`,
            top: `${star.top}%`,
            fontSize: `${star.size + 8}px`,
            color: 'white',
            opacity: star.opacity,
            fontFamily: 'inherit',
            pointerEvents: 'none',
            userSelect: 'none',
            lineHeight: 1,
            filter: 'none',
            transition: 'none', // убираем transition для плавности через RAF
          }}
        >
          *
        </span>
      ))}
    </div>
  );
}

function StarWarsCrawl() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
      style={{
        background: 'rgba(0,0,0,0.96)',
        perspective: '600px',
      }}
    >
      <div
        style={{
          width: '80vw',
          maxWidth: 600,
          height: '60vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            color: '#ffe81f',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '1.1rem',
            textAlign: 'center',
            letterSpacing: '0.04em',
            lineHeight: 2,
            textShadow: '0 0 8px #ffe81f, 0 0 2px #000',
            animation: 'starwars-crawl 11s linear forwards',
            transformOrigin: '50% 100%',
          }}
        >
          <div style={{ marginBottom: 40, fontWeight: 'bold', fontSize: '1.3em' }}>
            НИ СЛОВА О КИБЕРАСТЕ!
          </div>
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontSize: '0.9em' }}>
              Forget about cyberasta,<br />
              it no longer exists.
            </span>
          </div>
          <div style={{ fontSize: '0.8em', opacity: 0.7 }}>
            забудьте про cyberasta ее больше нет
          </div>
        </div>
      </div>
      <style>
        {`
        @keyframes starwars-crawl {
          0% {
            transform: rotateX(20deg) translateY(60vh) scale(1.2);
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: rotateX(25deg) translateY(-100vh) scale(0.7);
            opacity: 0;
          }
        }
        `}
      </style>
    </div>
  );
}

function BSOD() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: '#001b5c',
        color: '#fff',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '1.1rem',
        textAlign: 'left',
        letterSpacing: '0.02em',
        lineHeight: 1.7,
        padding: 0,
        margin: 0,
        userSelect: 'none',
      }}
    >
      <div style={{
        background: 'rgba(0,0,0,0.12)',
        border: '2px solid #fff',
        borderRadius: 8,
        padding: '2.5rem 2.5rem 2rem 2.5rem',
        boxShadow: '0 0 32px #001b5c, 0 0 0 8px #003399',
        maxWidth: 540,
        width: '90vw',
      }}>
        <div style={{ fontSize: '2.2em', marginBottom: '1.2em', color: '#fff', textShadow: '0 0 8px #003399' }}>
          :(
        </div>
        <div style={{ marginBottom: '1.2em', color: '#fff' }}>
        Ваша компьютер столкунлся с проблемой не пытайтесь ВЗЛОМАТЬ НАС!.<br />
          <span style={{ color: '#00eaff' }}>We&apos;re просто собираем немного error info, и потом we&apos;ll перазгрузите вашу жизнь.</span>
        </div>
        <div style={{ fontSize: '0.9em', color: '#fff' }}>
          <span style={{ color: '#00eaff' }}>ПЕРЕСТАНЬТЕ КОДИТЬ!:</span> SECRET_NOT_FOUND
        </div>
        <div style={{ marginTop: '2em', fontSize: '0.8em', color: '#fff', opacity: 0.7 }}>
          Если вы звоните в поддержку, дайте им немногo информации:<br />
          <span style={{ color: '#00eaff' }}>CYBERASTA_FAULT_IN_NONPAGED_AREA. thinkasta.t.me</span>
        </div>
      </div>
    </div>
  );
}

function DOSOverlay({ onExit }: { onExit: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onExit]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: '#222',
        color: '#0f0',
        fontFamily: 'monospace',
        fontSize: '1.1rem',
        letterSpacing: '0.04em',
        lineHeight: 1.7,
        userSelect: 'none',
        cursor: 'none',
      }}
    >
      <div
        style={{
          border: '3px solid #0f0',
          background: '#111',
          padding: '2.5rem 2.5rem 2rem 2.5rem',
          boxShadow: '0 0 32px #0f0, 0 0 0 8px #222',
          maxWidth: 600,
          width: '90vw',
          minHeight: 320,
          textAlign: 'left',
        }}
      >
        <div style={{ fontWeight: 'bold', fontSize: '1.3em', marginBottom: '1.5em' }}>
          Microsoft(R) MS-DOS(R) Version 6.22<br />
          (C)Copyright Microsoft Corp 1981-1994.
        </div>
        <div style={{ fontSize: '1.1em', marginBottom: '1em' }}>
          <span style={{ color: '#0ff' }}>C:\&gt;</span> dir<br />
          <span style={{ color: '#0ff' }}> Volume in drive C is CYBERASTA</span><br />
          <span style={{ color: '#0ff' }}> Directory of C:\</span><br />
          <br />
          <span style={{ color: '#0ff' }}>CVZPOLQ   EXE      1337  07-07-2024</span><br />
          <span style={{ color: '#0ff' }}>MAGOMED   SYS      1986  07-07-2024</span><br />
          <span style={{ color: '#0ff' }}>README    TXT      2048  07-07-2024</span><br />
          <br />
          <span style={{ color: '#0ff' }}>C:\&gt;</span> <span style={{ color: '#fff' }}>REM Press ESC to exit DOS mode</span>
        </div>
        <div style={{ color: '#0f0', fontSize: '0.9em', marginTop: '2em', opacity: 0.7 }}>
          <span style={{ color: '#0ff' }}>A:\&gt;_</span>
        </div>
      </div>
    </div>
  );
}

function CodeRainBg() {
  const width = 32; // столбцов
  const height = 16; // строк
  const chars = '<>{}[]()/\\'.split('');
  const [matrix, setMatrix] = React.useState<number[]>(() =>
    Array.from({ length: width }, () => Math.floor(Math.random() * height))
  );

  React.useEffect(() => {
    let raf: number;
    const animate = () => {
      setMatrix(prev =>
        prev.map(pos =>
          Math.random() > 0.93
            ? Math.floor(Math.random() * height)
            : (pos + 1) % height
        )
      );
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        opacity: 0.13,
        fontFamily: 'monospace',
        fontSize: '1.2rem',
        height: '100%',
        width: '100%',
      }}
    >
      {Array.from({ length: width * height }).map((_, idx) => {
        const col = idx % width;
        const row = Math.floor(idx / width);
        const isActive = matrix[col] === row;
        return (
          <span
            key={idx}
            style={{
              color: isActive ? '#fff' : '#0ff2',
              textShadow: isActive ? '0 0 8px #0ff, 0 0 2px #fff' : 'none',
              display: 'block',
              height: '1.2em',
              textAlign: 'center',
              userSelect: 'none',
              fontWeight: isActive ? 700 : 400,
            }}
          >
            {chars[Math.floor(Math.random() * chars.length)]}
          </span>
        );
      })}
    </div>
  );
}

function SelfDestruct() {
  const [hide, setHide] = useState(false);

  const [explosions, setExplosions] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);
  useEffect(() => {
    // Воспроизвести звук тревоги и взрыва
    const alarm = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfa4b7e.mp3'); // alarm
    const boom = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b7b7c.mp3'); // explosion
    alarm.volume = 0.5;
    boom.volume = 0.7;
    alarm.play();
    setTimeout(() => boom.play(), 1200);

    // Генерировать гифки взрывов
    let exp: any[] = [];
    for (let i = 0; i < 6; i++) {
      exp.push({
        id: i,
        left: Math.random() * 80 + 5 + '%',
        top: Math.random() * 70 + 10 + '%',
        size: Math.random() * 120 + 80,
        delay: Math.random() * 1800,
      });
    }
    setExplosions(exp);

    // Генерировать окна ошибок
    let errs: any[] = [];
    const errTexts = [
      'FATAL ERROR',
      'SYSTEM FAILURE',
      'CRITICAL EXCEPTION',
      'MEMORY LEAK DETECTED',
      'STACK OVERFLOW',
      'KERNEL PANIC',
      'ACCESS VIOLATION',
      'UNRECOVERABLE ERROR',
      '404: SANITY NOT FOUND',
      '!!! ПИЗДЕЦ !!!',
    ];
    for (let i = 0; i < 5; i++) {
      errs.push({
        id: i,
        left: Math.random() * 70 + 10 + '%',
        top: Math.random() * 60 + 10 + '%',
        text: errTexts[Math.floor(Math.random() * errTexts.length)],
        delay: Math.random() * 1200,
      });
    }
    setErrors(errs);

    // Скрыть через 3.5 сек
    const t = setTimeout(() => setHide(true), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-all duration-1000"
      style={{
        opacity: hide ? 0 : 1,
        pointerEvents: 'none',
        transition: 'opacity 1s',
        filter: hide ? 'blur(8px)' : 'none',
      }}
    >
      {/* Мигающий красный оверлей */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(255,0,0,0.18)',
        animation: 'destruct-blink 0.18s steps(1) infinite',
        zIndex: 1,
        pointerEvents: 'none',
      }} />
      {/* Shake + ALERT */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: 0,
        width: '100%',
        textAlign: 'center',
        color: '#fff',
        fontSize: '2.5rem',
        fontWeight: 900,
        textShadow: '0 0 24px #ff2222, 0 0 8px #fff',
        letterSpacing: '0.12em',
        zIndex: 2,
        animation: 'shake 0.18s infinite',
        pointerEvents: 'none',
      }}>!!! SYSTEM SELF-DESTRUCT !!!</div>
      {/* Взрывы */}
      {explosions.map(e => (
        <img
          key={e.id}
          src="https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif"
          alt="explosion"
          style={{
            position: 'absolute',
            left: e.left,
            top: e.top,
            width: e.size + 'px',
            height: e.size + 'px',
            zIndex: 10,
            opacity: 0.92,
            pointerEvents: 'none',
            animation: `popin 0.5s ${e.delay}ms both`,
          }}
        />
      ))}
      {/* Ошибки */}
      {errors.map(e => (
        <div
          key={e.id}
          style={{
            position: 'absolute',
            left: e.left,
            top: e.top,
            minWidth: 180,
            minHeight: 60,
            background: '#fff',
            color: '#b00',
            border: '3px solid #b00',
            borderRadius: 8,
            boxShadow: '0 0 24px #b00',
            fontFamily: 'monospace',
            fontWeight: 700,
            fontSize: '1.1rem',
            padding: '18px 18px 10px 18px',
            zIndex: 20,
            textAlign: 'center',
            pointerEvents: 'none',
            animation: `popin 0.5s ${e.delay}ms both`,
          }}
        >{e.text}</div>
      ))}
      {/* Эффект размытости и исчезновения */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        filter: 'blur(2px)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />
      <style>{`
        @keyframes shake {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-8px, 2px); }
          40% { transform: translate(6px, -4px); }
          60% { transform: translate(-4px, 6px); }
          80% { transform: translate(4px, -2px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes destruct-blink {
          0% { opacity: 0.18; }
          50% { opacity: 0.7; }
          100% { opacity: 0.18; }
        }
        @keyframes popin {
           0% { opacity: 0; transform: scale(0.7) rotate(-10deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

export default App;

<style>
{`
@keyframes fadein {
  from { opacity: 0; transform: translateY(30px) scale(0.97);}
  to { opacity: 1; transform: translateY(0) scale(1);}
}
.animate-fadein {
  animation-name: fadein;
}
`}
</style>