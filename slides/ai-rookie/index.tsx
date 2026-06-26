import type { DesignSystem, Page, SlideMeta } from '@open-slide/core';
import { useSlidePageNumber } from '@open-slide/core';
import { useEffect, useState } from 'react';
import { CombinatoricsCalculator, WhatYouCanDo } from '../ai-junior-intern-guide/index';
import { SmartStationVol3 } from '../smart-station/index';
import qrWportIg from './assets/qr-wport-ig.png';
import qrWportMe from './assets/qr-wport-me.png';
import qrDiscordSmartstation from './assets/qr-discord-smartstation.png';
import aiCourseModulesMap from './assets/ai-course-modules-map.png';

export const design: DesignSystem = {
  palette: { bg: '#FFFFFF', text: '#5D5D5D', accent: '#56C7BB' },
  fonts: {
    display: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
    body: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif',
  },
  typeScale: { hero: 132, body: 27 },
  radius: 8,
};

const c = {
  primary: '#56C7BB',
  primaryHover: '#4EBCB1',
  primaryLight: '#EAF8F7',
  primaryMuted: '#A8E4DF',
  ink: '#2E2E2E',
  body: '#5D5D5D',
  muted: '#9A9A9A',
  border: '#D7D7D7',
  tint: '#F8F7F7',
  white: '#FFFFFF',
};

const mono = '"JetBrains Mono", "Fira Code", monospace';
const PAD = { top: 104, right: 132, bottom: 96, left: 132 };

// 待補：上課當天提供真實連結。
const COURSE_REPO_URL = 'https://github.com/contactwport/wport-ai-starter-kit';
const COURSE_REPO_LABEL = 'contactwport/wport-ai-starter-kit';
const WPORT_CLI_URL = 'https://www.npmjs.com/package/@wport/cli';
const WPORT_CLI_LABEL = '@wport/cli';
const WPORT_CLI_INSTALL = 'npm install -g @wport/cli';
const CURSOR_DOWNLOAD_URL = 'https://cursor.com/download';
const INSTAGRAM_URL = 'https://www.instagram.com/wport.me/';
const INSTAGRAM_HANDLE = '@wport.me';
const WPORT_URL = 'https://wport.me';
const DISCORD_URL = 'https://discord.gg/7DBZZjtXz';
const DISCORD_LABEL = 'discord.gg/7DBZZjtXz';

const GIT_CLONE = `git clone ${COURSE_REPO_URL}`;
const FORK_CLONE = 'git clone https://github.com/<你的帳號>/wport-ai-starter-kit';
const GIT_COMMIT = 'git commit -m "說明"';
const GIT_PUSH = 'git push';
const VERCEL_DEPLOY = 'vercel deploy';
const WPORT_SEARCH = 'wport search 桃園 PM';
const WPORT_JOBS_URL = 'https://wport.me/jobs?page=1&pageSize=10';
const WPORT_JOBS_LABEL = 'wport.me/jobs';
const WPORT_PROMPT = `我已用 wport CLI 搜好職缺清單（見上方結果）。

請用 gen-resume 讀我的 Obsidian SSOT：\`[vault/resume.md]\`，
從清單挑 3 個最適合的職缺，逐一說明配對理由，
再對這 3 個 enc_id 各跑一次 gen-resume-optimizer，產出客製履歷與客製化報告 HTML。`;
const WORKFLOW_PROMPT = `請根據以下步驟與設定執行工作流，並在括號 \`[ ]\` 處自行填入對應資料：

1. 【資料分析】
   - 使用 \`wport cli\` 讀取「桃園pm」資料。
   - 呼叫 Skill「職涯教練」，讀取位於 \`[填入個人資料路徑]\` 的個人檔案。
   - 透過「職涯教練」Skill 分析上述資料，挑選並輸出 3 個最適合我的工作。

2. 【履歷與部署】
   - 針對這 3 個工作，呼叫 Skill「履歷特化」分別生成 3 份 HTML 履歷。
   - 使用 \`vercel cli\` 將這 3 份 HTML 部署為 3 個獨立網站，並取得各自的 URL。

3. 【建立 hypelink Event】
   - 使用 \`hypelink mcp\` 讀取「關於我」的內容。
   - 在 hypelink 中建立一個 Event，名稱為「今日成果」，內容須包含上述 3 個履歷的 URL。
   - 請確保產出的 Event 符合以下 JSON 結構：
     {
       "name": "今日成果",
       "startAt": "[填入開始時間，格式如 2026-03-15T09:00:00+08:00]",
       "endAt": "[填入結束時間，格式如 2026-03-15T17:00:00+08:00]",
       "status": "draft",
       "description": "[此處放入關於我與 3 個履歷 URL]"
     }

4. 【郵件通知】
   - 根據本次執行結果，生成一個合適的 Email 主題（Title）與今日專案大綱（Summary）。
   - 大綱內須包含步驟 3 產生的 hypelink URL。
   - 使用 \`gcloud cli\` 將此郵件內容寄送至：\`[填入收件人Email]\`。`;
const README_PROMPT = '這個專案在幹嘛？';
const INTERVIEW_PROMPT = `你現在是一位專業的「履歷與個人網站諮詢師」。請根據我接下來提供的資料（可能包含現有履歷、個人網址或其他背景文字），為我量身打造 10 個深入的訪談問題。

【執行步驟與規則】：
1. 先仔細閱讀並分析我貼在下方的所有參考資料。
2. 針對資料中的亮點、模糊處、或適合放在個人網站上的「個人特質/專案細節」，精選出 10 個最能幫我挖掘素材的問題。
3. 問題請分點列出，語氣專業且具引導性。
4. 在我回覆這 10 個問題後，再幫我統整並撰寫出一份適合放進履歷與個人網站的文案。

【我的參考資料如下】：
[請在這裡貼上你的履歷、網址或其他個人資料]`;
const README_PREVIEW = [
  '# wport-ai-starter-kit',
  '開源 AI Skills 工具包。',
  'Fork → 連結 Skills → 跟 AI 說需求。',
];

if (typeof document !== 'undefined') {
  const fontId = 'ai-rookie-fonts';
  if (!document.getElementById(fontId)) {
    const link = document.createElement('link');
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700;900&display=swap';
    document.head.appendChild(link);
  }
  const styleId = 'ai-rookie-deck-styles';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes aicCursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      @keyframes aicMsgIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .aic-cursor { animation: aicCursorBlink 0.75s step-end infinite; }
      .aic-msg { animation: aicMsgIn 0.26s ease-out both; }
      .ar-link { color: ${c.primaryHover}; text-decoration: none; border-bottom: 2px solid ${c.primaryMuted}; }
      .ar-link:hover { color: ${c.primary}; border-bottom-color: ${c.primary}; }
    `;
    document.head.appendChild(style);
  }
}

type ShellVariant = 'default' | 'tint' | 'dark';

const shellBg = (variant: ShellVariant) => {
  if (variant === 'dark') return c.ink;
  if (variant === 'tint') return c.tint;
  return c.white;
};

const SlideShell = ({
  variant = 'default',
  children,
}: {
  variant?: ShellVariant;
  children: React.ReactNode;
}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      padding: `${PAD.top}px ${PAD.right}px ${PAD.bottom}px ${PAD.left}px`,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      background: shellBg(variant),
      color: variant === 'dark' ? '#C9C9C9' : c.body,
      fontFamily: 'var(--osd-font-body)',
    }}
  >
    {children}
  </div>
);

const LinkMotionScope = ({ children }: { children: React.ReactNode }) => (
  <div
    className="aj-link-motion-scope"
    style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}
  >
    {children}
  </div>
);

const TopBar = ({ eyebrow, dark = false }: { eyebrow: string; dark?: boolean }) => {
  const { current } = useSlidePageNumber();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        marginBottom: 52,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: mono,
          fontSize: 24,
          fontWeight: 700,
          color: dark ? c.primaryMuted : c.primary,
          letterSpacing: '0.04em',
        }}
      >
        {String(current).padStart(2, '0')}
      </span>
      <span
        style={{
          fontFamily: mono,
          fontSize: 19,
          fontWeight: 500,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: dark ? '#8a8a8a' : c.muted,
          whiteSpace: 'nowrap',
        }}
      >
        {eyebrow}
      </span>
      <span style={{ flex: 1, height: 1, background: dark ? '#4a4a4a' : c.border }} />
      <span
        style={{
          fontFamily: mono,
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: dark ? '#8a8a8a' : c.muted,
        }}
      >
        <b style={{ color: dark ? c.primaryMuted : c.primary, fontWeight: 700 }}>w</b>port
      </span>
    </div>
  );
};

const Title = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
  <h1
    style={{
      fontSize: 64,
      fontWeight: 700,
      lineHeight: 1.18,
      color: dark ? '#fff' : c.ink,
      letterSpacing: '-0.01em',
      margin: 0,
      flexShrink: 0,
    }}
  >
    {children}
  </h1>
);

const Accent = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: c.primary }}>{children}</span>
);

const Subhead = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontSize: 22,
      fontFamily: mono,
      fontWeight: 700,
      letterSpacing: '0.06em',
      color: c.primary,
      marginBottom: 26,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
    }}
  >
    <span style={{ width: 26, height: 3, background: c.primary, display: 'inline-block' }} />
    {children}
  </div>
);

const Body = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <p style={{ fontSize: 28, lineHeight: 1.7, color: c.body, margin: 0, ...style }}>{children}</p>
);

const Ink = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: c.ink, fontWeight: 700 }}>{children}</span>
);

const ExternalLink = ({
  href,
  children,
  style,
  mono: useMono = false,
}: {
  href: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  mono?: boolean;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="ar-link"
    style={{
      ...(useMono ? { fontFamily: mono } : {}),
      ...style,
    }}
  >
    {children}
  </a>
);

const ToolCol = ({
  label,
  name,
  href,
  sections,
}: {
  label?: string;
  name: string;
  href?: string;
  sections: { heading: string; body: string }[];
}) => (
  <div
    style={{
      border: `1px solid ${c.border}`,
      borderTop: `4px solid ${c.primary}`,
      borderRadius: 8,
      padding: '32px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      background: c.white,
      minHeight: 0,
    }}
  >
    {label ? (
      <div
        style={{
          fontFamily: mono,
          fontSize: 16,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: c.muted,
        }}
      >
        {label}
      </div>
    ) : null}
    {href ? (
      <ExternalLink
        href={href}
        mono
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: c.ink,
        }}
      >
        {name}
      </ExternalLink>
    ) : (
      <div style={{ fontSize: 28, fontWeight: 700, color: c.ink, fontFamily: mono }}>{name}</div>
    )}
    {sections.map((s) => (
      <div key={s.heading} style={{ fontSize: 20, lineHeight: 1.5, color: c.body }}>
        <b
          style={{
            color: c.primaryHover,
            display: 'block',
            marginBottom: 4,
            fontSize: 16,
            fontFamily: mono,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {s.heading}
        </b>
        {s.body}
      </div>
    ))}
  </div>
);

const BulletList = ({ items }: { items: React.ReactNode[] }) => (
  <ul
    style={{
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 22,
    }}
  >
    {items.map((item, i) => (
      <li
        key={String(i)}
        style={{
          position: 'relative',
          paddingLeft: 40,
          fontSize: 27,
          lineHeight: 1.6,
          color: c.body,
        }}
      >
        <span
          style={{
            position: 'absolute',
            left: 0,
            top: 18,
            width: 18,
            height: 3,
            background: c.primary,
          }}
        />
        {item}
      </li>
    ))}
  </ul>
);

const Def = ({ term, desc }: { term: React.ReactNode; desc: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ fontSize: 30, fontWeight: 700, color: c.ink }}>{term}</div>
    <div style={{ fontSize: 25, lineHeight: 1.62, color: c.body }}>{desc}</div>
  </div>
);

const StepItem = ({ n, title, desc }: { n: number; title: string; desc: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
    <div
      style={{
        flexShrink: 0,
        fontFamily: mono,
        fontSize: 26,
        fontWeight: 700,
        color: c.primary,
        width: 80,
        height: 80,
        border: `2px solid ${c.primary}`,
        borderRadius: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </div>
    <div style={{ paddingTop: 4 }}>
      <div style={{ fontSize: 30, fontWeight: 700, color: c.ink, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 24, lineHeight: 1.6, color: c.body }}>{desc}</div>
    </div>
  </div>
);

const CopyIcon = () => (
  <svg aria-hidden width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="7" y="7" width="12" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? '已複製' : '複製指令'}
      style={{
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: mono,
        fontSize: 17,
        fontWeight: 600,
        letterSpacing: '0.04em',
        color: copied ? c.primaryHover : c.muted,
        background: copied ? c.white : 'transparent',
        border: `1px solid ${copied ? c.primaryMuted : c.border}`,
        borderRadius: 6,
        padding: '8px 14px',
        cursor: 'pointer',
        transition: 'color 0.15s, border-color 0.15s, background 0.15s',
      }}
    >
      {copied ? (
        <>
          <span style={{ color: c.primary, fontSize: 15 }}>✓</span>
          已複製
        </>
      ) : (
        <>
          <CopyIcon />
          複製
        </>
      )}
    </button>
  );
};

const CommandRow = ({ command, children }: { command: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
    <span>{children}</span>
    <CopyButton text={command} />
  </div>
);

const CodeBlock = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      fontFamily: mono,
      background: c.tint,
      border: `1px solid ${c.border}`,
      borderLeft: `4px solid ${c.primary}`,
      borderRadius: 6,
      padding: '28px 36px',
      fontSize: 26,
      lineHeight: 1.7,
      color: c.ink,
    }}
  >
    {children}
  </div>
);

const Quote = ({ children, small }: { children: React.ReactNode; small?: string }) => (
  <div
    style={{
      borderLeft: `5px solid ${c.primary}`,
      paddingLeft: 44,
      fontSize: 42,
      lineHeight: 1.5,
      fontWeight: 700,
      color: c.ink,
    }}
  >
    {children}
    {small ? (
      <span
        style={{
          display: 'block',
          fontSize: 24,
          fontWeight: 500,
          color: c.muted,
          marginTop: 28,
          fontFamily: mono,
          letterSpacing: '0.04em',
        }}
      >
        {small}
      </span>
    ) : null}
  </div>
);

const CompareCard = ({
  label,
  title,
  sub,
  points,
  highlight = false,
}: {
  label: string;
  title: React.ReactNode;
  sub: string;
  points: React.ReactNode[];
  highlight?: boolean;
}) => (
  <div
    style={{
      border: `1px solid ${highlight ? c.primaryMuted : c.border}`,
      borderTop: `5px solid ${highlight ? c.primary : c.muted}`,
      borderRadius: 10,
      padding: '40px 40px 44px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      background: highlight ? c.primaryLight : c.white,
    }}
  >
    <div
      style={{
        fontFamily: mono,
        fontSize: 18,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: highlight ? c.primaryHover : c.muted,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 40, fontWeight: 700, color: c.ink, lineHeight: 1.2 }}>{title}</div>
    <div style={{ fontSize: 23, color: highlight ? c.primaryHover : c.muted, fontWeight: 500 }}>
      {sub}
    </div>
    <ul
      style={{
        listStyle: 'none',
        margin: '8px 0 0',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {points.map((p, i) => (
        <li
          key={String(i)}
          style={{
            position: 'relative',
            paddingLeft: 34,
            fontSize: 25,
            lineHeight: 1.5,
            color: c.body,
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: 14,
              width: 16,
              height: 3,
              background: highlight ? c.primary : c.muted,
            }}
          />
          {p}
        </li>
      ))}
    </ul>
  </div>
);

const BigStatement = ({ children, size = 84 }: { children: React.ReactNode; size?: number }) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div
      style={{
        fontSize: size,
        fontWeight: 900,
        lineHeight: 1.22,
        color: c.ink,
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </div>
  </div>
);

const Arrow = ({ dir = 'right', dark = false }: { dir?: 'right' | 'down'; dark?: boolean }) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: 40,
      fontWeight: 700,
      color: dark ? c.primaryMuted : c.primary,
      flexShrink: 0,
      lineHeight: 1,
      alignSelf: 'center',
    }}
  >
    {dir === 'right' ? '→' : '↓'}
  </span>
);

const OutChip = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      fontFamily: mono,
      fontSize: 20,
      fontWeight: 700,
      color: c.primaryHover,
      background: c.primaryLight,
      border: `1px solid ${c.primaryMuted}`,
      borderRadius: 999,
      padding: '10px 22px',
    }}
  >
    {children}
  </span>
);

const Terminal = ({
  title,
  lines,
}: {
  title: string;
  lines: { text: string; kind?: 'prompt' | 'out' | 'ok' | 'muted' }[];
}) => (
  <div
    style={{
      borderRadius: 14,
      border: `1px solid ${c.border}`,
      background: c.white,
      boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '16px 22px',
        background: c.tint,
        borderBottom: `1px solid ${c.border}`,
      }}
    >
      <div style={{ display: 'flex', gap: 8 }}>
        {['#ff5f57', '#febc2e', '#28c840'].map((dot) => (
          <span key={dot} style={{ width: 12, height: 12, borderRadius: 999, background: dot }} />
        ))}
      </div>
      <span
        style={{
          fontFamily: mono,
          fontSize: 17,
          fontWeight: 600,
          color: c.muted,
          letterSpacing: '0.04em',
          marginLeft: 8,
        }}
      >
        {title}
      </span>
    </div>
    <div
      style={{
        padding: '28px 30px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: mono,
        fontSize: 23,
        lineHeight: 1.5,
      }}
    >
      {lines.map((l, i) => {
        if (l.kind === 'prompt') {
          return (
            <div key={String(i)} style={{ color: c.ink }}>
              <span style={{ color: c.primary, fontWeight: 700 }}>$ </span>
              {l.text}
            </div>
          );
        }
        if (l.kind === 'ok') {
          return (
            <div key={String(i)} style={{ color: c.ink }}>
              <span style={{ color: c.primary, fontWeight: 700 }}>✓ </span>
              {l.text}
            </div>
          );
        }
        return (
          <div key={String(i)} style={{ color: l.kind === 'muted' ? c.muted : c.body }}>
            {l.kind === 'out' ? <span style={{ color: c.primaryHover }}>→ </span> : null}
            {l.text}
          </div>
        );
      })}
    </div>
  </div>
);

const ChatBubble = ({ from, children }: { from: 'user' | 'bot'; children: React.ReactNode }) => (
  <div
    style={{
      alignSelf: from === 'user' ? 'flex-end' : 'flex-start',
      maxWidth: '88%',
      fontSize: 26,
      lineHeight: 1.55,
      padding: '20px 26px',
      borderRadius: from === 'user' ? '18px 18px 6px 18px' : '18px 18px 18px 6px',
      background: from === 'user' ? c.primaryLight : c.tint,
      color: from === 'user' ? c.primaryHover : c.ink,
      border: from === 'bot' ? `1px solid ${c.border}` : `1px solid ${c.primaryMuted}`,
    }}
  >
    {children}
  </div>
);

// ─── Interactive IDE-agent demo (chat vs IDE) ────────────────────────────────

type LogMsg = { role: 'user' | 'sys'; text: string };

const IdeWorkspaceDemo = () => {
  const [messages, setMessages] = useState<LogMsg[]>([]);
  const [draft, setDraft] = useState('');
  const [stepIdx, setStepIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'run' | 'pause'>('typing');
  const [codeLines, setCodeLines] = useState<string[]>([]);

  const ideSteps = [
    {
      cmd: '幫我把首頁標題改成我的名字',
      reply: '→ 已修改 index.html',
      code: ['<h1>王小明</h1>', '<p>產品新手 · 桃園</p>'],
    },
    {
      cmd: '存檔並 commit',
      reply: '→ git commit -m "更新標題" ✓',
      code: ['git add index.html', 'git commit -m "更新標題"'],
    },
    {
      cmd: '部署上線',
      reply: '→ vercel deploy · 網址已產生 ✓',
      code: ['vercel deploy', '✓ https://you.vercel.app'],
    },
  ] as const;

  useEffect(() => {
    const step = ideSteps[stepIdx];
    if (phase === 'typing') {
      if (draft.length < step.cmd.length) {
        const t = setTimeout(() => setDraft(step.cmd.slice(0, draft.length + 1)), 42);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => {
        setMessages((m) => [...m, { role: 'user', text: step.cmd }]);
        setDraft('');
        setPhase('run');
      }, 360);
      return () => clearTimeout(t);
    }
    if (phase === 'run') {
      const t = setTimeout(() => {
        setMessages((m) => [...m, { role: 'sys', text: step.reply }]);
        setCodeLines([...step.code]);
        setPhase('pause');
      }, 620);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      const next = (stepIdx + 1) % ideSteps.length;
      if (next === 0) {
        setMessages([]);
        setCodeLines([]);
      }
      setStepIdx(next);
      setPhase('typing');
    }, 1300);
    return () => clearTimeout(t);
  }, [phase, draft, stepIdx]);

  const folderItems = ['vault/', '  resume.md', '  about-me.md', 'site/', '  index.html', '  style.css'];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '150px 1fr 220px',
        height: '100%',
        minHeight: 0,
        borderRadius: 14,
        border: `1px solid ${c.primaryMuted}`,
        background: c.white,
        boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          borderRight: `1px solid ${c.border}`,
          background: c.tint,
          padding: '16px 12px',
          fontFamily: mono,
          fontSize: 14,
          lineHeight: 1.6,
          color: c.body,
        }}
      >
        <div style={{ fontSize: 12, color: c.muted, marginBottom: 10 }}>EXPLORER</div>
        {folderItems.map((item) => (
          <div
            key={item}
            style={{
              color: item.includes('index') ? c.primaryHover : c.body,
              fontWeight: item.includes('index') ? 700 : 400,
              whiteSpace: 'pre',
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, borderRight: `1px solid ${c.border}` }}>
        <div
          style={{
            padding: '10px 16px',
            borderBottom: `1px solid ${c.border}`,
            fontFamily: mono,
            fontSize: 13,
            color: c.muted,
            background: c.tint,
          }}
        >
          index.html
        </div>
        <div
          style={{
            flex: 1,
            padding: '18px 20px',
            fontFamily: mono,
            fontSize: 16,
            lineHeight: 1.6,
            color: c.ink,
          }}
        >
          {codeLines.length === 0 ? (
            <span style={{ color: c.muted }}>{'// 等待 AI 寫入…'}</span>
          ) : (
            codeLines.map((line) => (
              <div key={line} className="aic-msg">
                {line}
              </div>
            ))
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div
          style={{
            padding: '10px 14px',
            borderBottom: `1px solid ${c.border}`,
            fontFamily: mono,
            fontSize: 13,
            fontWeight: 700,
            color: c.primaryHover,
            background: c.primaryLight,
          }}
        >
          Agent
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            justifyContent: 'flex-end',
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={`${msg.role}-${i}`}
              className="aic-msg"
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '96%',
                fontFamily: mono,
                fontSize: 13,
                lineHeight: 1.45,
                padding: '8px 10px',
                borderRadius: msg.role === 'user' ? '10px 10px 4px 10px' : '10px 10px 10px 4px',
                background: msg.role === 'user' ? c.primaryLight : c.tint,
                color: msg.role === 'user' ? c.primaryHover : c.ink,
                border: msg.role === 'sys' ? `1px solid ${c.border}` : 'none',
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <div
          style={{
            borderTop: `1px solid ${c.border}`,
            padding: '10px',
            background: c.tint,
            fontFamily: mono,
            fontSize: 13,
            color: c.ink,
          }}
        >
          <span style={{ color: c.primary, fontWeight: 700 }}>› </span>
          {draft}
          {phase === 'typing' ? <span className="aic-cursor">▌</span> : null}
        </div>
      </div>
    </div>
  );
};

const ChatCompareDemo = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);

  const onSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [
      ...m,
      { role: 'user', text },
      { role: 'bot', text: '我可以給建議，但看不到你的檔案，也沒辦法幫你改碼或部署。' },
    ]);
    setInput('');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        borderRadius: 14,
        border: `1px solid ${c.border}`,
        background: c.white,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 20px',
          borderBottom: `1px solid ${c.border}`,
          fontFamily: mono,
          fontSize: 16,
          fontWeight: 700,
          color: c.muted,
          background: c.tint,
        }}
      >
        聊天框 · 你問它答
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          justifyContent: 'flex-end',
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}`}
            className="aic-msg"
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '92%',
              fontSize: 18,
              lineHeight: 1.55,
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: msg.role === 'user' ? c.primaryLight : c.tint,
              color: msg.role === 'user' ? c.primaryHover : c.ink,
              border: `1px solid ${c.border}`,
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: `1px solid ${c.border}`,
          padding: '14px 16px',
          display: 'flex',
          gap: 10,
          background: c.tint,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSend();
          }}
          placeholder="試著問：幫我改履歷標題"
          style={{
            flex: 1,
            fontSize: 17,
            padding: '12px 14px',
            border: `1px solid ${c.border}`,
            borderRadius: 8,
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={onSend}
          style={{
            fontFamily: mono,
            fontSize: 16,
            fontWeight: 700,
            color: c.white,
            background: c.primary,
            border: 'none',
            borderRadius: 8,
            padding: '0 20px',
            cursor: 'pointer',
          }}
        >
          送出
        </button>
      </div>
    </div>
  );
};

// ─── Pages ───────────────────────────────────────────────────────────────────

const CoverBanner: Page = () => (
  <LinkMotionScope>
    <SmartStationVol3 />
  </LinkMotionScope>
);

const ModuleRow = ({
  seg,
  mod,
  note,
  star = false,
}: {
  seg: string;
  mod: string;
  note: React.ReactNode;
  star?: boolean;
}) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: '280px 150px 1fr',
      gap: 48,
      alignItems: 'center',
      padding: '13px 24px',
      borderRadius: 8,
      background: star ? c.primaryLight : 'transparent',
      border: `1px solid ${star ? c.primaryMuted : 'transparent'}`,
    }}
  >
    <div
      style={{
        fontSize: 24,
        fontWeight: 700,
        color: c.ink,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        whiteSpace: 'nowrap',
      }}
    >
      {star ? <span style={{ color: c.primary, fontFamily: mono }}>*</span> : null}
      {seg}
    </div>
    <div
      style={{
        fontFamily: mono,
        fontSize: 18,
        fontWeight: 700,
        color: c.primaryHover,
        letterSpacing: '0.02em',
      }}
    >
      {mod}
    </div>
    <div style={{ fontSize: 22, lineHeight: 1.4, color: c.body }}>{note}</div>
  </div>
);

const Roadmap: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="今日課程 · Roadmap" />
    <Title>
      今天的課程，<Accent>三個動手實作課</Accent>
    </Title>
    <div style={{ marginTop: 40, flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 150px 1fr',
          gap: 48,
          padding: '0 24px 14px',
          fontFamily: mono,
          fontSize: 16,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: c.muted,
          borderBottom: `1px solid ${c.border}`,
        }}
      >
        <span style={{ whiteSpace: 'nowrap' }}>章節</span>
        <span>模組</span>
        <span>簡單來說</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 28 }}>
        <ModuleRow seg="聊天框 vs IDE" mod="M01" note="為什麼今天用 IDE 做事。" />
        <ModuleRow
          seg="抓專案 + 讀懂"
          mod="M02 · M03"
          note="Fork→clone 抓下來，讓 AI 白話導覽 README。"
        />
        <ModuleRow
          seg="你的大腦"
          mod="M04 · M07"
          note="SSOT × Obsidian，AI 只讀需要的、省 token。"
        />
        <ModuleRow seg="技能固化" mod="M06" note="把一次性 Prompt 變成可重用的 .md Skill。" />
        <ModuleRow
          seg="動手① Skill 寫自己"
          mod="M08"
          note="自動寫出你的第一份結構化個人資料。"
          star
        />
        <ModuleRow
          seg="動手② 履歷配對"
          mod="T03 · D01"
          note="wport 抓職缺、配對、產出求職報告書。"
          star
        />
        <ModuleRow seg="存檔 + push" mod="M2B" note="commit 當後悔藥，push 上雲端備份。" />
        <ModuleRow
          seg="動手③ 一鍵上線"
          mod="T05 · D03"
          note="Vercel 部署，拿到你的公開網址。"
          star
        />
      </div>
    </div>
  </SlideShell>
);

const IdeVsChatA: Page = () => (
  <SlideShell>
    <TopBar eyebrow="#1 IDE vs 聊天框" />
    <Title>
      你習慣的是聊天框，<Accent>主角其實是 IDE</Accent>
    </Title>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        gap: 48,
        marginTop: 36,
        flex: 1,
        minHeight: 0,
      }}
    >
      <ChatCompareDemo />
      <IdeWorkspaceDemo />
    </div>
  </SlideShell>
);

const ForkReadmeIdeDemo = () => {
  const [attached, setAttached] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [picked, setPicked] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string; attach?: string }[]>(
    [],
  );

  const folderItems = ['kit/', '  skills/', '  doc/', '  README.md'];

  const attachReadme = () => setAttached(true);

  const onSend = () => {
    if (!attached) return;
    const text = input.trim() || README_PROMPT;
    setMessages([
      { role: 'user', text, attach: 'README.md' },
      {
        role: 'bot',
        text: 'README 說這是 wport 的開源 AI Skills 工具包。Fork 後連結 Skills 到 Cursor，就能用自然語言做履歷、簡報與求職相關操作。',
      },
    ]);
    setInput('');
    setAttached(false);
    setPicked(false);
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '150px 1fr 148px',
        maxHeight: 300,
        height: '100%',
        minHeight: 0,
        borderRadius: 14,
        border: `1px solid ${c.primaryMuted}`,
        background: c.white,
        boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          borderRight: `1px solid ${c.border}`,
          background: c.tint,
          padding: '16px 12px',
          fontFamily: mono,
          fontSize: 14,
          lineHeight: 1.6,
          color: c.body,
        }}
      >
        <div style={{ fontSize: 12, color: c.muted, marginBottom: 10 }}>EXPLORER</div>
        {folderItems.map((item) => {
          const isReadme = item.includes('README');
          return (
            <div
              key={item}
              draggable={isReadme}
              onDragStart={(e) => {
                if (!isReadme) return;
                e.dataTransfer.setData('text/plain', 'README.md');
                setPicked(true);
              }}
              onDragEnd={() => setPicked(false)}
              onClick={() => {
                if (!isReadme) return;
                setPicked((p) => !p);
              }}
              style={{
                whiteSpace: 'pre',
                cursor: isReadme ? 'grab' : 'default',
                color: isReadme ? c.primaryHover : c.body,
                fontWeight: isReadme ? 700 : 400,
                background: isReadme && picked ? c.primaryLight : 'transparent',
                borderRadius: 4,
                padding: isReadme ? '2px 4px' : 0,
                margin: isReadme ? '0 -4px' : 0,
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, borderRight: `1px solid ${c.border}` }}>
        <div
          style={{
            padding: '10px 16px',
            borderBottom: `1px solid ${c.border}`,
            fontFamily: mono,
            fontSize: 13,
            color: c.muted,
            background: c.tint,
          }}
        >
          README.md
        </div>
        <div
          style={{
            flex: 1,
            padding: '18px 20px',
            fontFamily: mono,
            fontSize: 15,
            lineHeight: 1.65,
            color: c.ink,
            overflow: 'hidden',
          }}
        >
          {README_PREVIEW.map((line, i) => (
            <div
              key={`readme-line-${i}`}
              style={{
                color: line.startsWith('#') ? c.primaryHover : line.startsWith('-') ? c.body : c.ink,
                fontWeight: line.startsWith('#') ? 700 : 400,
                minHeight: line ? undefined : 12,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div
          style={{
            padding: '10px 14px',
            borderBottom: `1px solid ${c.border}`,
            fontFamily: mono,
            fontSize: 13,
            fontWeight: 700,
            color: c.primaryHover,
            background: c.primaryLight,
          }}
        >
          Agent
        </div>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            padding: '12px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            justifyContent: messages.length ? 'flex-end' : 'center',
          }}
        >
          {messages.length === 0 ? (
            <p style={{ fontSize: 13, lineHeight: 1.5, color: c.muted, textAlign: 'center', margin: 0 }}>
              把 README.md
              <br />
              拖進下方對話框
            </p>
          ) : (
            messages.map((msg, i) => (
              <div
                key={`${msg.role}-${i}`}
                className="aic-msg"
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '96%',
                  fontFamily: mono,
                  fontSize: 12,
                  lineHeight: 1.45,
                  padding: '8px 10px',
                  borderRadius: msg.role === 'user' ? '10px 10px 4px 10px' : '10px 10px 10px 4px',
                  background: msg.role === 'user' ? c.primaryLight : c.tint,
                  color: msg.role === 'user' ? c.primaryHover : c.ink,
                  border: `1px solid ${c.border}`,
                }}
              >
                {msg.attach ? (
                  <span
                    style={{
                      display: 'block',
                      fontSize: 11,
                      background: c.white,
                      border: `1px solid ${c.primaryMuted}`,
                      borderRadius: 6,
                      padding: '2px 6px',
                      marginBottom: 6,
                    }}
                  >
                    @ {msg.attach}
                  </span>
                ) : null}
                {msg.text}
              </div>
            ))
          )}
        </div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.getData('text/plain') === 'README.md') attachReadme();
          }}
          onClick={() => {
            if (picked) attachReadme();
          }}
          style={{
            borderTop: `1px solid ${dragOver || attached ? c.primary : c.border}`,
            padding: '10px',
            background: dragOver ? c.primaryLight : c.tint,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          {attached ? (
            <span
              style={{
                alignSelf: 'flex-start',
                fontFamily: mono,
                fontSize: 11,
                color: c.primaryHover,
                background: c.white,
                border: `1px solid ${c.primaryMuted}`,
                borderRadius: 6,
                padding: '3px 8px',
              }}
            >
              @ README.md
            </span>
          ) : null}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSend();
              }}
              placeholder={attached ? README_PROMPT : '拖入 README.md'}
              disabled={!attached}
              style={{
                flex: 1,
                minWidth: 0,
                fontFamily: mono,
                fontSize: 12,
                padding: '8px 10px',
                border: `1px solid ${c.border}`,
                borderRadius: 6,
                outline: 'none',
                background: attached ? c.white : c.tint,
                color: attached ? c.ink : c.muted,
              }}
            />
            <button
              type="button"
              onClick={onSend}
              disabled={!attached}
              style={{
                flexShrink: 0,
                fontSize: 12,
                fontWeight: 700,
                padding: '8px 10px',
                border: 'none',
                borderRadius: 6,
                background: attached ? c.primary : c.border,
                color: attached ? c.white : c.muted,
                cursor: attached ? 'pointer' : 'default',
              }}
            >
              送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ForkIcon = ({ size = 18 }: { size?: number }) => (
  <svg aria-hidden width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0-1.5 0v.878A2.25 2.25 0 0 0 5.75 8.5h1.5v2.128a2.251 2.251 0 1 0 1.5 0V8.5h1.5a2.25 2.25 0 0 0 2.25-2.25v-.878a2.25 2.25 0 1 0-1.5 0v.878a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 5 6.25v-.878Zm3.75 7.378a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM11.75 4.625a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
  </svg>
);

const StepHead = ({ n, label }: { n: number; label: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
    <span
      style={{
        flexShrink: 0,
        width: 46,
        height: 46,
        borderRadius: 999,
        border: `2px solid ${c.primary}`,
        color: c.primary,
        fontFamily: mono,
        fontSize: 22,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {n}
    </span>
    <span
      style={{
        fontFamily: mono,
        fontSize: 21,
        fontWeight: 700,
        letterSpacing: '0.04em',
        color: c.primaryHover,
      }}
    >
      {label}
    </span>
  </div>
);

const RepoForkCard = () => (
  <a
    href={COURSE_REPO_URL}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      textDecoration: 'none',
      borderRadius: 14,
      border: `1px solid ${c.primaryMuted}`,
      background: c.white,
      boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 20px',
        background: c.tint,
        borderBottom: `1px solid ${c.border}`,
        fontFamily: mono,
        fontSize: 15,
        color: c.muted,
      }}
    >
      <span style={{ width: 9, height: 9, borderRadius: 999, background: c.primary }} />
      github.com/{COURSE_REPO_LABEL}
    </div>
    <div
      style={{
        flex: 1,
        padding: '32px 30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 26,
      }}
    >
      <div>
        <div style={{ fontSize: 28, fontWeight: 700, color: c.ink, lineHeight: 1.25 }}>
          <span style={{ color: c.muted, fontWeight: 500 }}>contactwport / </span>
          <Accent>wport-ai-starter-kit</Accent>
        </div>
        <div style={{ marginTop: 12, fontSize: 19, color: c.body, lineHeight: 1.5 }}>
          開源 AI Skills 工具包 · 履歷、簡報、求職一條龍。
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: c.primary,
            color: c.white,
            fontSize: 20,
            fontWeight: 700,
            borderRadius: 8,
            padding: '12px 24px',
          }}
        >
          <ForkIcon size={20} />
          Fork
        </span>
        <span style={{ fontFamily: mono, fontSize: 15, color: c.muted }}>→ 複製到你的帳號</span>
      </div>
    </div>
  </a>
);

const RepoFork: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="#1 動手 · Fork 課程 Repo" />
    <Title>
      Fork 課程 Repo，<Accent>認識你的專案</Accent>
    </Title>
    <div
      style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 56,
        marginTop: 24,
        minHeight: 0,
        alignItems: 'stretch',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
        <StepHead n={1} label="第一步 · Fork" />
        <Body style={{ fontSize: 21, lineHeight: 1.55 }}>
          到 GitHub 點 <Ink>Fork</Ink>，把課程 repo 複製到自己的帳號——之後就是你的專案。
        </Body>
        <RepoForkCard />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
        <StepHead n={2} label="第二步 · Clone 到本機" />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: c.white,
            border: `1px solid ${c.border}`,
            borderLeft: `4px solid ${c.primary}`,
            borderRadius: 6,
          }}
        >
          <span
            style={{
              fontFamily: mono,
              fontSize: 16,
              color: c.ink,
              flex: 1,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <span style={{ color: c.primary, fontWeight: 700 }}>$ </span>
            git clone https://github.com/<span style={{ color: c.primaryHover }}>&lt;你的帳號&gt;</span>/wport-ai-starter-kit
          </span>
          <CopyButton text={FORK_CLONE} />
        </div>
        <Body style={{ fontSize: 19, lineHeight: 1.5 }}>
          Clone 的是<Ink>你 fork 後</Ink>的 repo，在 IDE 打開後拖 <Ink>README.md</Ink> 問 AI：
        </Body>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ForkReadmeIdeDemo />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            background: c.white,
            border: `1px solid ${c.border}`,
            borderLeft: `4px solid ${c.primary}`,
            borderRadius: 6,
          }}
        >
          <span style={{ fontFamily: mono, fontSize: 18, color: c.ink, flex: 1 }}>{README_PROMPT}</span>
          <CopyButton text={README_PROMPT} />
        </div>
      </div>
    </div>
  </SlideShell>
);

const SsotA: Page = () => (
  <SlideShell>
    <TopBar eyebrow="#2 Obsidian SSOT" />
    <Title>
      資料散落四處，<Accent>改一次累死</Accent>
    </Title>
    <div
      style={{
        marginTop: 56,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 48,
      }}
    >
      <div style={{ display: 'flex', gap: 20 }}>
        {['Line 對話', '桌面資料夾', 'Google Doc', '便利貼'].map((label) => (
          <div
            key={label}
            style={{
              flex: 1,
              border: `1px solid ${c.border}`,
              borderRadius: 12,
              padding: '26px 16px',
              background: c.white,
              textAlign: 'center',
              fontSize: 23,
              fontWeight: 700,
              color: c.ink,
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: c.ink,
            background: c.tint,
            border: `1px solid ${c.border}`,
            borderRadius: 10,
            padding: '24px 32px',
          }}
        >
          更新一個地方
        </div>
        <Arrow />
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: c.primaryHover,
            background: c.primaryLight,
            border: `1px solid ${c.primaryMuted}`,
            borderRadius: 10,
            padding: '24px 32px',
          }}
        >
          要改 10 個地方
        </div>
      </div>
      <Body style={{ fontSize: 28, textAlign: 'center' }}>
        今天第一個練習是，製作關於我——但我的<Ink>資料從哪來？</Ink>
      </Body>
    </div>
  </SlideShell>
);

const SsotB: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="#2 Obsidian SSOT" />
    <Title>
      一個<Accent>唯一事實來源</Accent>，輸出到所有地方
    </Title>
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, marginTop: 56, flex: 1 }}
    >
      <div>
        <Subhead>觀念</Subhead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Def term="SSOT" desc="Single Source of Truth，唯一事實來源——資料只維護一份。" />
          <Def term="Obsidian" desc="最好的容器：純文字 Markdown、跨裝置、永遠是你的。" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 26 }}>
        <div
          style={{
            alignSelf: 'flex-start',
            fontSize: 32,
            fontWeight: 700,
            color: c.primaryHover,
            background: c.primaryLight,
            border: `1px solid ${c.primaryMuted}`,
            borderRadius: 12,
            padding: '24px 40px',
          }}
        >
          一個 Obsidian vault
        </div>
        <Arrow dir="down" />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 520 }}>
          <OutChip>履歷</OutChip>
          <OutChip>個人網站</OutChip>
          <OutChip>求職報告書</OutChip>
          <OutChip>公司 Pitch Deck</OutChip>
          <OutChip>公司網站</OutChip>
          <OutChip>SBIR</OutChip>
          <OutChip>補助款</OutChip>
          <OutChip>計畫書</OutChip>
        </div>
      </div>
    </div>
  </SlideShell>
);

const IdeToolbox: Page = () => (
  <SlideShell>
    <TopBar eyebrow="工具對比" />
    <Title>
      2026 新世代 <Accent>AI 優先</Accent> 的 IDE 工具箱
    </Title>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 28,
        marginTop: 48,
        flex: 1,
        minHeight: 0,
      }}
    >
      <ToolCol
        name="Antigravity 2.0"
        href="https://antigravity.google/product/antigravity-2"
        sections={[
          { heading: '核心特色', body: 'Google 推出的 AI 優先 Desktop 開發環境。' },
          { heading: '新手優勢', body: '整合 Gemini 高算力，適合快速構建 UI 與專案邏輯分析。' },
        ]}
      />
      <ToolCol
        name="Kiro IDE"
        href="https://kiro.dev/downloads/"
        sections={[
          { heading: '核心特色', body: 'AWS 支援、Spec-First（規格書驅動）環境。' },
          { heading: '新手優勢', body: '內建 MCP 支援與自動化 commit 訊息生成。' },
        ]}
      />
      <ToolCol
        name="Codex IDE"
        href="https://chatgpt.com/zh-Hant/download/"
        sections={[
          { heading: '核心特色', body: 'OpenAI 推出的 AI 優先 IDE，深度整合 Codex 程式助理。' },
          { heading: '新手優勢', body: '在編輯器內直接對話、改碼與除錯，降低從想法到實作的切換成本。' },
        ]}
      />
      <ToolCol
        name="Cursor"
        href={CURSOR_DOWNLOAD_URL}
        sections={[
          { heading: '核心特色', body: '今天課程主力 IDE——左邊檔案樹、中間寫 code、右邊跟 Agent 對話。' },
          { heading: '新手優勢', body: '安裝後直接開啟專案資料夾，最適合從零開始跟 AI 協作。' },
        ]}
      />
    </div>
  </SlideShell>
);

const CloneA: Page = () => (
  <SlideShell>
    <TopBar eyebrow="#3 Clone repo" />
    <Title>
      GitHub ＝ <Accent>程式界的 Google Drive</Accent>
    </Title>
    <div
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, marginTop: 56, flex: 1 }}
    >
      <div>
        <Subhead>兩個名詞</Subhead>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Def term="GitHub" desc="程式界的雲端硬碟——大家把專案放在這裡保存與分享。" />
          <Def term="repo" desc="repository，一個專案資料夾，裝著這個專案的所有檔案。" />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700, color: c.ink, fontFamily: mono }}>雲端 repo</div>
        <Arrow dir="down" />
        <div style={{ fontSize: 22, color: c.muted, fontFamily: mono }}>git clone</div>
        <Arrow dir="down" />
        <div style={{ fontSize: 24, fontWeight: 700, color: c.ink, fontFamily: mono }}>你的電腦</div>
      </div>
    </div>
  </SlideShell>
);

const CloneB: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="#3 Clone repo" />
    <Title>
      一行指令，<Accent>把整個專案抓下來</Accent>
    </Title>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 44,
      }}
    >
      <CodeBlock>
        <CommandRow command={GIT_CLONE}>
          <span>
            <span style={{ color: c.primary, fontWeight: 700 }}>$</span> git clone{' '}
            <span style={{ color: c.primaryHover }}>[網址]</span>
          </span>
        </CommandRow>
      </CodeBlock>
      <Body style={{ fontSize: 32 }}>
        一行指令，把整個專案<Ink>抓到你電腦</Ink>——之後就能用 IDE 打開它。
      </Body>
    </div>
  </SlideShell>
);

const IdeRegion = ({
  tag,
  title,
  desc,
  grow,
}: {
  tag: string;
  title: string;
  desc: string;
  grow?: boolean;
}) => (
  <div
    style={{
      flex: grow ? 1.6 : 1,
      border: `1px solid ${c.border}`,
      borderTop: `4px solid ${c.primary}`,
      borderRadius: 8,
      background: c.white,
      padding: '22px 26px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}
  >
    <span
      style={{
        fontFamily: mono,
        fontSize: 17,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: c.muted,
      }}
    >
      {tag}
    </span>
    <span style={{ fontSize: 27, fontWeight: 700, color: c.ink }}>{title}</span>
    <span style={{ fontSize: 21, lineHeight: 1.45, color: c.body }}>{desc}</span>
  </div>
);

const ReadmeA: Page = () => (
  <SlideShell>
    <TopBar eyebrow="#4 IDE 讀 README" />
    <Title>
      IDE 長這樣：<Accent>四個區塊</Accent>
    </Title>
    <div style={{ marginTop: 56, flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', gap: 24, flex: 1 }}>
        <IdeRegion tag="左" title="檔案樹" desc="專案所有檔案的清單，點一下就打開。" />
        <IdeRegion tag="中" title="編輯區" desc="實際看程式碼與文字的地方。" grow />
        <IdeRegion tag="右" title="AI 對話框" desc="跟 AI 講話、請它幫你做事。" />
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <IdeRegion tag="下" title="終端機" desc="打指令的地方——git clone、跑工具都在這裡。" grow />
      </div>
    </div>
  </SlideShell>
);

const ReadmeB: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="#4 IDE 讀 README" />
    <Title>
      讓 AI 用<Accent>白話</Accent>幫你讀 README
    </Title>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 24,
        maxWidth: 1280,
      }}
    >
      <ChatBubble from="user">請幫我看 README，用白話說這是什麼專案。</ChatBubble>
      <ChatBubble from="bot">
        這是一個<Ink>個人履歷網站</Ink>，用 HTML
        製作。你只要改幾個檔案，就能把它變成自己的版本，再上線。
      </ChatBubble>
    </div>
  </SlideShell>
);

const PromptSkillA: Page = () => (
  <SlideShell>
    <TopBar eyebrow="#5 Prompt → Skill" />
    <Title>
      講完就消失，還是<Accent>固化下來</Accent>？
    </Title>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: 56,
        marginTop: 28,
        flex: 1,
        minHeight: 0,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        <Subhead>範例 · 一段 Prompt</Subhead>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            background: c.white,
            border: `1px solid ${c.border}`,
            borderLeft: `4px solid ${c.primary}`,
            borderRadius: 8,
            padding: '18px 24px',
            fontFamily: mono,
            fontSize: 14,
            lineHeight: 1.5,
            color: c.ink,
            whiteSpace: 'pre-wrap',
          }}
        >
          {INTERVIEW_PROMPT}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CopyButton text={INTERVIEW_PROMPT} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 18,
          minHeight: 0,
        }}
      >
        <CompareCard
          label="一次性"
          title="Prompt"
          sub="一段對話"
          points={['講完就消失', '下次要重打一遍', '別人拿不到']}
        />
        <Arrow dir="down" />
        <CompareCard
          label="可重用"
          title="Skill"
          sub="存成一個 .md 檔"
          highlight
          points={['固化成檔案存起來', '隨時可叫用', '可以分享給別人']}
        />
      </div>
    </div>
  </SlideShell>
);

const PromptSkillB: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="#5 Prompt → Skill" />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        flex: 1,
        alignItems: 'center',
      }}
    >
      <Terminal
        title="gen-resume / SKILL.md"
        lines={[
          { text: '# 產生履歷', kind: 'muted' },
          { text: '你是一位資深履歷顧問。', kind: 'out' },
          { text: '讀取 obsidian/about-me.md，', kind: 'out' },
          { text: '輸出一頁式 HTML 履歷。', kind: 'out' },
          { text: '就是普通的 Markdown 文字', kind: 'muted' },
        ]}
      />
      <BigStatement size={68}>
        Skill 的本質，
        <br />
        就是一個 <Accent>.md 檔案</Accent>。
      </BigStatement>
    </div>
  </SlideShell>
);

const HandsOnSkillA: Page = () => (
  <SlideShell>
    <TopBar eyebrow="★ 動手實作課 ① · Skill 寫關於自己" />
    <Title>
      動手：讓 Skill <Accent>採訪你</Accent>
    </Title>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 30,
      }}
    >
      <StepItem n={1} title="載入 Skill" desc="在 IDE 載入「寫關於自己」的 Skill。" />
      <StepItem n={2} title="AI 問問題" desc="AI 一題一題問你的經歷、專長、想找的方向。" />
      <StepItem n={3} title="你回答" desc="用講話的方式回答，不必自己排版。" />
      <StepItem
        n={4}
        title="自動寫入"
        desc={
          <>
            內容自動整理、寫進你的 <Ink>Obsidian vault</Ink>。
          </>
        }
      />
    </div>
  </SlideShell>
);

const BeforeAfterCard = ({
  label,
  title,
  lines,
  highlight = false,
}: {
  label: string;
  title: string;
  lines: string[];
  highlight?: boolean;
}) => (
  <div
    style={{
      flex: 1,
      border: `1px solid ${highlight ? c.primaryMuted : c.border}`,
      borderRadius: 12,
      background: highlight ? c.primaryLight : c.tint,
      padding: '32px 34px',
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
    }}
  >
    <span
      style={{
        fontFamily: mono,
        fontSize: 18,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: highlight ? c.primaryHover : c.muted,
      }}
    >
      {label}
    </span>
    <span style={{ fontSize: 30, fontWeight: 700, color: c.ink }}>{title}</span>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: mono,
        fontSize: 22,
        color: highlight ? c.primaryHover : c.muted,
      }}
    >
      {lines.map((l) => (
        <span key={l}>{l}</span>
      ))}
    </div>
  </div>
);

const HandsOnSkillB: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="★ 動手實作課 ① · Skill 寫關於自己" />
    <div style={{ display: 'flex', gap: 28, alignItems: 'stretch', marginBottom: 40 }}>
      <BeforeAfterCard label="之前" title="空白 vault" lines={['(empty)', '0 notes']} />
      <Arrow />
      <BeforeAfterCard
        label="之後"
        title="about-me.md"
        highlight
        lines={['## 經歷', '## 專長', '## 求職方向']}
      />
    </div>
    <BigStatement size={68}>
      你剛才建立了你的<Accent>第一份 SSOT</Accent>。
    </BigStatement>
  </SlideShell>
);

const GraphView = () => {
  const nodes = [
    { x: 250, y: 150, r: 30, main: true },
    { x: 110, y: 70, r: 18 },
    { x: 420, y: 90, r: 20 },
    { x: 400, y: 250, r: 18 },
    { x: 130, y: 250, r: 16 },
    { x: 60, y: 170, r: 14 },
    { x: 320, y: 320, r: 14 },
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [1, 5],
    [3, 6],
    [4, 5],
    [2, 3],
  ];
  return (
    <svg
      viewBox="0 0 480 380"
      style={{ width: '100%', height: '100%' }}
      role="img"
      aria-label="Obsidian graph view"
    >
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke={c.primaryMuted}
          strokeWidth={2}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={String(i)}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill={n.main ? c.primary : c.white}
          stroke={c.primary}
          strokeWidth={n.main ? 0 : 3}
        />
      ))}
    </svg>
  );
};

const NodeToken: Page = () => (
  <SlideShell>
    <TopBar eyebrow="#7 Obsidian node + Token" />
    <Title>
      一次貼一大段？筆記是 <Accent>node</Accent>，只讀需要的省 <Accent>token</Accent>
    </Title>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 56,
        marginTop: 36,
        flex: 1,
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ height: 320 }}>
          <GraphView />
        </div>
        <BulletList
          items={[
            <>
              每個 <Ink>node</Ink>（圓點）就是一張筆記。
            </>,
            <>
              連線 ＝ 知識之間的<Ink>關聯</Ink>。
            </>,
            <>
              AI 只取需要的筆記，<Ink>省 token</Ink>、更精準。
            </>,
          ]}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, justifyContent: 'center' }}>
        <div
          style={{
            background: c.tint,
            border: `1px solid ${c.border}`,
            borderLeft: `4px solid ${c.primary}`,
            borderRadius: 10,
            padding: '24px 30px',
          }}
        >
          <Def term="Token" desc="AI 處理文字的計費單位——讀越多字，越貴、越慢。" />
        </div>
        <div
          style={{
            background: c.tint,
            border: `1px solid ${c.border}`,
            borderLeft: `4px solid ${c.primary}`,
            borderRadius: 10,
            padding: '24px 30px',
          }}
        >
          <Def term="Obsidian node" desc="每張筆記是一個節點，組成你的知識圖譜。" />
        </div>
        <div
          style={{
            background: c.primaryLight,
            border: `1px solid ${c.primaryMuted}`,
            borderRadius: 10,
            padding: '26px 30px',
          }}
        >
          <Quote small="// 比喻">
            大腦只留<Accent>索引</Accent>，用到的時候才調閱。
          </Quote>
        </div>
      </div>
    </div>
  </SlideShell>
);

const Commit: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="#8 commit + push" />
    <Title>
      <Accent>commit</Accent> 是後悔藥，<Accent>push</Accent> 上雲
    </Title>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 40,
      }}
    >
      <div style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
        <ScoreStep score="85" label="做到 85 分 → commit 存檔" tone="ok" />
        <Arrow />
        <ScoreStep score="75" label="衝 90 結果 AI 改壞變 75" tone="bad" />
        <Arrow />
        <ScoreStep score="85" label="rollback 回到 85，鬆口氣 😮‍💨" tone="ok" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, justifyContent: 'center' }}>
          <Def term="commit" desc="本地快照（存檔）——把現在的狀態記下來，隨時能回到這。" />
          <Def term="push" desc="把存檔上傳到 GitHub 雲端，換電腦也拿得到。" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CodeBlock>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <CommandRow command={GIT_COMMIT}>
                <span>
                  <span style={{ color: c.primary, fontWeight: 700 }}>$</span> git commit -m{' '}
                  <span style={{ color: c.primaryHover }}>"說明"</span>
                </span>
              </CommandRow>
              <CommandRow command={GIT_PUSH}>
                <span>
                  <span style={{ color: c.primary, fontWeight: 700 }}>$</span> git push
                </span>
              </CommandRow>
            </div>
          </CodeBlock>
        </div>
      </div>
    </div>
  </SlideShell>
);

const ScoreStep = ({
  score,
  label,
  tone,
}: {
  score: string;
  label: string;
  tone: 'ok' | 'bad' | 'neutral';
}) => {
  const color = tone === 'ok' ? c.primaryHover : tone === 'bad' ? '#E06A5A' : c.ink;
  const bg = tone === 'ok' ? c.primaryLight : tone === 'bad' ? '#FBEDEA' : c.tint;
  const border = tone === 'ok' ? c.primaryMuted : tone === 'bad' ? '#F0C7BF' : c.border;
  return (
    <div
      style={{
        flex: 1,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 12,
        padding: '28px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div style={{ fontFamily: mono, fontSize: 64, fontWeight: 700, color, lineHeight: 1 }}>
        {score}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: c.ink, textAlign: 'center' }}>
        {label}
      </div>
    </div>
  );
};

const WportCliA: Page = () => (
  <SlideShell>
    <TopBar eyebrow="#10 wport CLI" />
    <Title>
      <Accent>wport search</Accent>，職缺直接跑出來
    </Title>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        marginTop: 28,
        flex: 1,
        alignItems: 'center',
      }}
    >
      <Terminal
        title="wport · cli"
        lines={[
          { text: 'wport search 桃園 PM', kind: 'prompt' },
          { text: '搜尋桃園地區職缺…', kind: 'muted' },
          { text: '產品助理 PM · 中壢 · 38–45K', kind: 'out' },
          { text: '行銷企劃 · 桃園 · 35–42K', kind: 'out' },
          { text: '前端工程師 · 龜山 · 50–70K', kind: 'out' },
          { text: '找到 12 筆符合職缺', kind: 'ok' },
        ]}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Body style={{ fontSize: 26 }}>
          抓的是<Ink>公開職缺</Ink>，免登入可直接用。先裝好 CLI：
        </Body>
        <a
          href={WPORT_CLI_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignSelf: 'flex-start',
            alignItems: 'center',
            gap: 14,
            fontFamily: mono,
            fontSize: 24,
            color: c.primaryHover,
            textDecoration: 'none',
            background: c.primaryLight,
            border: `1px solid ${c.primaryMuted}`,
            borderRadius: 8,
            padding: '16px 26px',
          }}
        >
          {WPORT_CLI_LABEL}
          <span style={{ fontSize: 16, color: c.muted }}>npmjs.com ↗</span>
        </a>
        <CodeBlock>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <CommandRow command={WPORT_CLI_INSTALL}>
              <span>
                <span style={{ color: c.primary, fontWeight: 700 }}>$</span> {WPORT_CLI_INSTALL}
              </span>
            </CommandRow>
            <CommandRow command={WPORT_SEARCH}>
              <span>
                <span style={{ color: c.primary, fontWeight: 700 }}>$</span> {WPORT_SEARCH}
              </span>
            </CommandRow>
          </div>
        </CodeBlock>
        <Body style={{ fontSize: 20, lineHeight: 1.5 }}>
          職缺來自公開頁{' '}
          <ExternalLink href={WPORT_JOBS_URL} mono>
            {WPORT_JOBS_LABEL}
          </ExternalLink>
          ——<Ink>關鍵字可以亂改</Ink>，換城市、換職稱都行。
        </Body>
      </div>
    </div>
  </SlideShell>
);

const WportCliB: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="#10 wport CLI · 直接複製貼上" />
    <Title>
      搭配 Skill，貼一段 <Accent>prompt</Accent> 給 AI
    </Title>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 32,
      }}
    >
      <div
        style={{
          background: c.white,
          border: `1px solid ${c.border}`,
          borderLeft: `4px solid ${c.primary}`,
          borderRadius: 10,
          padding: '32px 36px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 28,
        }}
      >
        <p
          style={{
            fontSize: 25,
            lineHeight: 1.7,
            color: c.ink,
            margin: 0,
            fontWeight: 500,
            whiteSpace: 'pre-wrap',
            flex: 1,
          }}
        >
          {WPORT_PROMPT}
        </p>
        <CopyButton text={WPORT_PROMPT} />
      </div>
      <Body style={{ fontSize: 28 }}>
        在你<Ink>大改風格、想法</Ink>之前——<Accent>先存檔。</Accent>
      </Body>
    </div>
  </SlideShell>
);

const WorkflowPrompt: Page = () => (
  <SlideShell>
    <TopBar eyebrow="★ 動手實作課 ② · 組合拳工作流" />
    <Title>
      貼一段 <Accent>prompt</Accent>，串起整條鏈
    </Title>
    <div
      style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 32,
        minHeight: 0,
        marginTop: 4,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            background: c.white,
            border: `1px solid ${c.border}`,
            borderLeft: `4px solid ${c.primary}`,
            borderRadius: 8,
            padding: '18px 24px',
            fontFamily: mono,
            fontSize: 14,
            lineHeight: 1.5,
            color: c.ink,
            whiteSpace: 'pre-wrap',
          }}
        >
          {WORKFLOW_PROMPT}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <CopyButton text={WORKFLOW_PROMPT} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 20,
        }}
      >
        {[
          { label: 'CLI', sub: 'wport · vercel · gcloud', color: c.primaryHover },
          { label: 'MCP', sub: 'hypelink', color: '#6B8CAE' },
          { label: 'Skill', sub: '職涯教練 · 履歷特化', color: '#9A7B4F' },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              border: `1px solid ${c.border}`,
              borderTop: `4px solid ${item.color}`,
              borderRadius: 10,
              padding: '24px 22px',
              background: c.white,
              textAlign: 'center',
            }}
          >
            <div style={{ fontFamily: mono, fontSize: 36, fontWeight: 700, color: item.color }}>
              {item.label}
            </div>
            <div style={{ fontSize: 17, color: c.muted, marginTop: 8, lineHeight: 1.4 }}>{item.sub}</div>
          </div>
        ))}
      </div>
    </div>
  </SlideShell>
);

const FlowBox = ({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) => (
  <div
    style={{
      background: accent ? c.primaryLight : c.white,
      border: `1px solid ${accent ? c.primaryMuted : c.border}`,
      borderLeft: `4px solid ${c.primary}`,
      borderRadius: 10,
      padding: '22px 30px',
      fontSize: 27,
      fontWeight: 500,
      color: c.ink,
      lineHeight: 1.45,
    }}
  >
    {children}
  </div>
);

const ReportA: Page = () => (
  <SlideShell>
    <TopBar eyebrow="★ 動手實作課 ② · wport 履歷 + 報告書" />
    <Title>
      你的資料 ＋ 職缺，<Accent>一秒成書</Accent>
    </Title>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 22,
        maxWidth: 1180,
      }}
    >
      <FlowBox>你的 SSOT（Obsidian 個人資料）</FlowBox>
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: c.primary,
          fontFamily: mono,
          paddingLeft: 8,
        }}
      >
        ＋
      </div>
      <FlowBox>wport 職缺清單</FlowBox>
      <Arrow dir="down" />
      <FlowBox accent>Skill（一秒）</FlowBox>
      <Arrow dir="down" />
      <FlowBox accent>
        針對職缺的<Ink>求職報告書</Ink>
      </FlowBox>
    </div>
  </SlideShell>
);

const ReportB: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="★ 動手實作課 ② · wport 履歷 + 報告書" />
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        flex: 1,
        alignItems: 'center',
      }}
    >
      <Terminal
        title="report.md"
        lines={[
          { text: '# 求職報告書', kind: 'muted' },
          { text: '推薦職缺 1 · 產品助理 PM', kind: 'out' },
          { text: '配對理由：你的專案經驗對應 PM', kind: 'muted' },
          { text: '推薦職缺 2 · 行銷企劃', kind: 'out' },
          { text: '配對理由：你的內容力剛好吃香', kind: 'muted' },
          { text: '推薦職缺 3 · 營運專員', kind: 'out' },
        ]}
      />
      <BigStatement size={56}>
        這份報告書，
        <br />
        是根據你的 <Accent>SSOT</Accent>
        <br />
        量身產生的。
      </BigStatement>
    </div>
  </SlideShell>
);

const SiteA: Page = () => (
  <SlideShell>
    <TopBar eyebrow="#12 Obsidian → open-slide → 網站" />
    <Title>
      從<Accent>資料</Accent>到<Accent>網站</Accent>，一條龍
    </Title>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 18,
        maxWidth: 1180,
      }}
    >
      <FlowBox>Obsidian SSOT（你的資料）</FlowBox>
      <div style={{ paddingLeft: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Arrow dir="down" />
        <span style={{ fontFamily: mono, fontSize: 22, color: c.muted }}>Skill（1 秒）</span>
      </div>
      <FlowBox accent>open-slide HTML 個人簡報</FlowBox>
      <div style={{ paddingLeft: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
        <Arrow dir="down" />
        <span style={{ fontFamily: mono, fontSize: 22, color: c.muted }}>
          vercel deploy（1 行）
        </span>
      </div>
      <FlowBox accent>
        <span style={{ fontFamily: mono, color: c.primaryHover }}>https://yourname.vercel.app</span>
      </FlowBox>
    </div>
  </SlideShell>
);

const SiteB: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="#12 Obsidian → open-slide → 網站" />
    <div style={{ display: 'flex', gap: 28, alignItems: 'stretch', marginBottom: 40 }}>
      <CompareCard
        label="以前的做法"
        title="一週起跳"
        sub="找人、排期、等交付"
        points={['設計師', '工程師', '一週時間']}
      />
      <CompareCard
        label="現在"
        title="幾秒鐘"
        sub="自己就能跑完"
        highlight
        points={['Skill 一秒', 'Vercel 一行', '馬上上線']}
      />
    </div>
    <BigStatement size={64}>
      使用 Skill，都是<Accent>一秒的事</Accent>。
    </BigStatement>
  </SlideShell>
);

const VercelA: Page = () => (
  <SlideShell>
    <TopBar eyebrow="★ 動手實作課 ③ · Vercel 上架" />
    <Title>
      一行 <Accent>vercel deploy</Accent>，網址出現
    </Title>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 40,
      }}
    >
      <CodeBlock>
        <CommandRow command={VERCEL_DEPLOY}>
          <span>
            <span style={{ color: c.primary, fontWeight: 700 }}>$</span> vercel deploy
          </span>
        </CommandRow>
      </CodeBlock>
      <Arrow dir="down" />
      <div
        style={{
          alignSelf: 'flex-start',
          fontFamily: mono,
          fontSize: 36,
          fontWeight: 700,
          color: c.primaryHover,
          background: c.primaryLight,
          border: `1px solid ${c.primaryMuted}`,
          borderRadius: 10,
          padding: '24px 40px',
        }}
      >
        https://yourname.vercel.app
      </div>
    </div>
  </SlideShell>
);

const VercelB: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="★ 動手實作課 ③ · Vercel 上架" />
    <BigStatement size={66}>
      你剛才有 <Accent>GitHub</Accent>、有 <Accent>Obsidian</Accent>、
      <br />有 <Accent>Skill</Accent>、有 <Accent>網站</Accent>——
      <br />
      這就是 AI 實習生的<Accent>標配</Accent>。
    </BigStatement>
  </SlideShell>
);

const WhatYouCanDoPage: Page = () => (
  <LinkMotionScope>
    <WhatYouCanDo />
  </LinkMotionScope>
);

const CombinatoricsCalculatorPage: Page = () => (
  <LinkMotionScope>
    <CombinatoricsCalculator secondAxis={{ label: 'MCP', sub: 'mcp', noun: 'MCP' }} />
  </LinkMotionScope>
);

type ModuleKind = 'M' | 'T' | 'D';

type CourseModule = {
  id: string;
  kind: ModuleKind;
  title: string;
  duration: string;
  level: '初階' | '進階';
  summary: string;
  today?: boolean;
};

const COURSE_MODULES: CourseModule[] = [
  { id: 'M01', kind: 'M', title: '聊天框 vs IDE', duration: '15分', level: '初階', summary: '分清聊天框與 IDE——AI 有沒有「手」的分水嶺。', today: true },
  { id: 'M02', kind: 'M', title: 'GitHub 與 Repo', duration: '25分', level: '初階', summary: '把專案抓下來，認識程式界的雲端硬碟。', today: true },
  { id: 'M2B', kind: 'M', title: 'Git commit 與 rollback', duration: '15分', level: '初階', summary: 'commit 當後悔藥，改壞了能回頭。', today: true },
  { id: 'M03', kind: 'M', title: 'IDE 介面 + 讀 README', duration: '25分', level: '初階', summary: '四個區塊認識 IDE，請 AI 白話導覽專案。', today: true },
  { id: 'M04', kind: 'M', title: 'SSOT 與 Obsidian', duration: '25分', level: '初階', summary: '唯一事實來源，一份資料輸出到所有地方。', today: true },
  { id: 'M5B', kind: 'M', title: 'push / branch / PR', duration: '25分', level: '進階', summary: '團隊協作流：分支、合併、解衝突。' },
  { id: 'M05', kind: 'M', title: '團隊 SSOT', duration: '20分', level: '進階', summary: 'Obsidian + GitHub 讓團隊共用同一份知識庫。' },
  { id: 'M06', kind: 'M', title: 'Prompt → Skill', duration: '15分', level: '初階', summary: '把一次性對話固化成可重用的 .md Skill。', today: true },
  { id: 'M07', kind: 'M', title: 'Token 與 Obsidian 神經元', duration: '20分', level: '初階', summary: '為什麼純文字筆記跟 AI 特別合？', today: true },
  { id: 'M08', kind: 'M', title: '動手：用 Skill 建立 SSOT', duration: '25分', level: '初階', summary: 'AI 採訪你，自動寫回 Obsidian。', today: true },
  { id: 'M09', kind: 'M', title: 'API / MCP / CLI 三種橋樑', duration: '15分', level: '進階', summary: '讓 AI 連上外部世界的三條路。' },
  { id: 'M10', kind: 'M', title: '身份驗證與資安', duration: '25分', level: '進階', summary: 'OAuth vs Key，什麼時候要登入。' },
  { id: 'M12', kind: 'M', title: 'Local vs 部署', duration: '15分', level: '進階', summary: '本機開發與上線部署的差別。' },
  { id: 'C00', kind: 'M', title: 'Capstone 排列組合', duration: '15分', level: '進階', summary: '積木攤開，看能組出多少種工作流。' },
  { id: 'T01', kind: 'T', title: 'hypelink MCP', duration: '20分', level: '進階', summary: '個人頁／活動頁，MCP 需登入。' },
  { id: 'T02', kind: 'T', title: 'GA4 MCP', duration: '20分', level: '進階', summary: '用自然語言問網站業績數據。' },
  { id: 'T03', kind: 'T', title: 'wport CLI', duration: '20分', level: '進階', summary: '一行指令抓真實職缺，免登入。', today: true },
  { id: 'T04', kind: 'T', title: 'gcloud CLI', duration: '20分', level: '進階', summary: '寄信、寄報告，串起整合寄送。' },
  { id: 'T05', kind: 'T', title: 'Vercel CLI', duration: '20分', level: '進階', summary: '一鍵部署，拿到公開網址。', today: true },
  { id: 'T06', kind: 'T', title: 'Cloudflare', duration: '20分', level: '進階', summary: '邊緣運算、網域、CDN 配菜。' },
  { id: 'T07', kind: 'T', title: 'Supabase', duration: '20分', level: '進階', summary: '後端資料庫配菜卡。' },
  { id: 'T08', kind: 'T', title: 'Firebase', duration: '20分', level: '進階', summary: 'Google 後端配菜卡。' },
  { id: 'T09', kind: 'T', title: 'Cloudinary', duration: '20分', level: '進階', summary: '圖床與圖像處理配菜。' },
  { id: 'D01', kind: 'D', title: '履歷職缺配對', duration: '30分', level: '進階', summary: 'wport + Skill + SSOT → 推薦 3 職缺 + 客製履歷。', today: true },
  { id: 'D02', kind: 'D', title: '整合寄送', duration: '30分', level: '進階', summary: 'gcloud 寄履歷 + hypelink 活動頁 + wport 結果。' },
  { id: 'D03', kind: 'D', title: '一鍵履歷上線', duration: '30分', level: '進階', summary: 'Vercel 部署 + GitHub 推送，拿到你的網址。', today: true },
];

const TODAY_MODULE_COUNT = COURSE_MODULES.filter((m) => m.today).length;
const TOTAL_MODULE_COUNT = COURSE_MODULES.length;

const CourseModuleTable = () => (
  <div
    style={{
      flex: 1,
      minHeight: 0,
      display: 'flex',
      flexDirection: 'column',
      border: `1px solid ${c.border}`,
      borderRadius: 10,
      background: c.white,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '88px 72px 1fr 72px 56px',
        gap: 12,
        padding: '12px 20px',
        background: c.tint,
        borderBottom: `1px solid ${c.border}`,
        fontFamily: mono,
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: c.muted,
      }}
    >
      <span>模組</span>
      <span>類型</span>
      <span>課程名稱</span>
      <span>時間</span>
      <span style={{ textAlign: 'center' }}>今日</span>
    </div>
    <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {COURSE_MODULES.map((mod, i) => (
        <div
          key={mod.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '88px 72px 1fr 72px 56px',
            gap: 12,
            alignItems: 'center',
            padding: '7px 20px',
            fontSize: 17,
            lineHeight: 1.35,
            color: c.body,
            background: mod.today ? c.primaryLight : i % 2 === 0 ? c.white : c.tint,
            borderBottom: `1px solid ${c.border}`,
          }}
        >
          <span style={{ fontFamily: mono, fontWeight: 700, color: mod.today ? c.primaryHover : c.ink }}>
            {mod.id}
          </span>
          <span
            style={{
              fontFamily: mono,
              fontSize: 13,
              fontWeight: 700,
              color: mod.kind === 'M' ? c.primaryHover : mod.kind === 'T' ? '#6B8CAE' : '#9A7B4F',
            }}
          >
            {mod.kind}
          </span>
          <span style={{ color: c.ink, fontWeight: mod.today ? 700 : 500 }}>{mod.title}</span>
          <span style={{ fontFamily: mono, fontSize: 14, color: c.muted }}>{mod.duration}</span>
          <span style={{ textAlign: 'center', fontSize: 18, color: mod.today ? c.primary : c.border }}>
            {mod.today ? '●' : '○'}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const CourseMoreIntro: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="還有更多 · AI 課程模組" />
    <Title>
      今天的課程，<Accent>只是剛開始</Accent>
    </Title>
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 48,
        textAlign: 'center',
      }}
    >
      <Body style={{ fontSize: 28, maxWidth: 960, lineHeight: 1.65 }}>
        今天走的是<Ink>純小白入門路線</Ink>。完整 WPORT AI 課程是一套可重組的積木——
        下一頁有<Accent>全部模組清單</Accent>。
      </Body>
      <div style={{ display: 'flex', gap: 32, alignItems: 'stretch' }}>
        <div
          style={{
            border: `1px solid ${c.primaryMuted}`,
            borderRadius: 14,
            padding: '36px 48px',
            background: c.white,
            minWidth: 260,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 72, fontWeight: 700, color: c.primary, lineHeight: 1 }}>
            {TODAY_MODULE_COUNT}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: c.ink, marginTop: 12 }}>今天已學</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontFamily: mono, fontSize: 40, color: c.muted }}>
          /
        </div>
        <div
          style={{
            border: `2px solid ${c.primary}`,
            borderRadius: 14,
            padding: '36px 48px',
            background: c.primaryLight,
            minWidth: 260,
          }}
        >
          <div style={{ fontFamily: mono, fontSize: 72, fontWeight: 700, color: c.primaryHover, lineHeight: 1 }}>
            {TOTAL_MODULE_COUNT}
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: c.ink, marginTop: 12 }}>完整課程模組</div>
        </div>
      </div>
      <Body style={{ fontSize: 22, color: c.muted }}>
        還有 <Ink>{TOTAL_MODULE_COUNT - TODAY_MODULE_COUNT} 個模組</Ink> 等你繼續探索 →
      </Body>
    </div>
  </SlideShell>
);

const CourseModuleBoard: Page = () => (
  <SlideShell>
    <TopBar eyebrow="還有更多 · 完整課程清單" />
    <Title>
      共 <Accent>{TOTAL_MODULE_COUNT}</Accent> 堂模組，自由組合
    </Title>
    <div
      style={{
        display: 'flex',
        gap: 20,
        fontFamily: mono,
        fontSize: 15,
        color: c.muted,
        marginBottom: 16,
      }}
    >
      <span>
        <span style={{ color: c.primary, fontWeight: 700 }}>●</span> 今日已學 {TODAY_MODULE_COUNT}
      </span>
      <span>
        <span style={{ color: c.border }}>○</span> 待探索 {TOTAL_MODULE_COUNT - TODAY_MODULE_COUNT}
      </span>
      <span>M {COURSE_MODULES.filter((m) => m.kind === 'M').length}</span>
      <span>T {COURSE_MODULES.filter((m) => m.kind === 'T').length}</span>
      <span>D {COURSE_MODULES.filter((m) => m.kind === 'D').length}</span>
    </div>
    <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <CourseModuleTable />
    </div>
  </SlideShell>
);

const CourseModuleMap: Page = () => (
  <SlideShell variant="tint">
    <TopBar eyebrow="還有更多 · 排列組合" />
    <Title>
      少數積木，<Accent>組出無限工作流</Accent>
    </Title>
    <div
      style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        gap: 40,
        marginTop: 20,
        minHeight: 0,
        alignItems: 'center',
      }}
    >
      <div
        style={{
          borderRadius: 12,
          border: `1px solid ${c.border}`,
          background: c.white,
          padding: 12,
          height: '100%',
          maxHeight: 620,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={aiCourseModulesMap}
          alt="AI 課程積木依賴總圖"
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Body style={{ fontSize: 26 }}>
          同一批 SSOT + Skill + 工具，換個組合就是<Ink>全新的自動化流程</Ink>。
        </Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            'wport CLI + 履歷 Skill → 職缺配對',
            'gcloud + hypelink → 整合寄送',
            'Vercel + GitHub → 一鍵上線',
          ].map((line) => (
            <div
              key={line}
              style={{
                fontFamily: mono,
                fontSize: 18,
                color: c.primaryHover,
                background: c.primaryLight,
                border: `1px solid ${c.primaryMuted}`,
                borderRadius: 8,
                padding: '14px 18px',
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <Body style={{ fontSize: 22, color: c.muted }}>
          掌握工具的人，將取代只會使用勞力的人。
        </Body>
      </div>
    </div>
  </SlideShell>
);

const CtaColumn = ({
  qrSrc,
  qrAlt,
  label,
  title,
  href,
  linkLabel,
  desc,
}: {
  qrSrc: string;
  qrAlt: string;
  label: string;
  title: React.ReactNode;
  href: string;
  linkLabel: string;
  desc: string;
}) => (
  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ lineHeight: 0 }}>
      <img
        src={qrSrc}
        alt={qrAlt}
        style={{
          width: 240,
          height: 240,
          borderRadius: 16,
          border: `1px solid ${c.border}`,
          background: c.white,
        }}
      />
    </a>
    <span
      style={{
        fontFamily: mono,
        fontSize: 17,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: c.primaryHover,
      }}
    >
      {label}
    </span>
    <div
      style={{
        fontSize: 28,
        fontWeight: 700,
        color: c.ink,
        textAlign: 'center',
        lineHeight: 1.35,
        minHeight: 76,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {title}
    </div>
    <ExternalLink href={href} mono style={{ fontSize: 22, fontWeight: 700 }}>
      {linkLabel}
    </ExternalLink>
    <span style={{ fontSize: 20, lineHeight: 1.5, color: c.body, textAlign: 'center', maxWidth: 320 }}>
      {desc}
    </span>
  </div>
);

const CallToAction: Page = () => (
  <SlideShell>
    <TopBar eyebrow="行動呼籲 · Call to Action" />
    <Title>
      把今天<Accent>帶回家</Accent>，也帶給別人
    </Title>
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 48,
        marginTop: 56,
      }}
    >
      <CtaColumn
        qrSrc={qrWportIg}
        qrAlt={`Instagram QR — ${INSTAGRAM_URL}`}
        label="限動 tag 我們"
        title="分享今天的成果"
        href={INSTAGRAM_URL}
        linkLabel={INSTAGRAM_HANDLE}
        desc="限動 tag 我們，分享你今天做出的成果。"
      />
      <CtaColumn
        qrSrc={qrWportMe}
        qrAlt={`WPORT QR — ${WPORT_URL}`}
        label="幫我宣傳"
        title={
          <>
            地方活動、講座、課程、
            <br />
            大學、顧問案我們都能
          </>
        }
        href={WPORT_URL}
        linkLabel="wport.me"
        desc="想辦活動、開課或合作？掃碼找我們聊聊。"
      />
      <CtaColumn
        qrSrc={qrDiscordSmartstation}
        qrAlt={`Discord QR — ${DISCORD_URL}`}
        label="在地社群"
        title="聰電站"
        href={DISCORD_URL}
        linkLabel={DISCORD_LABEL}
        desc="加入桃園在地社群，一起繼續玩工具。"
      />
    </div>
    <div style={{ fontSize: 24, color: c.muted, textAlign: 'center', marginTop: 8 }}>
      謝謝今天的你，記得把學到的
      <span style={{ color: c.primaryHover, fontWeight: 700 }}>分享出去</span>。
    </div>
  </SlideShell>
);

export const meta: SlideMeta = {
  title: 'AI Rookie · 新手小白也能行',
  createdAt: '2026-06-26T04:24:27.869Z',
};

export default [
  CoverBanner,
  Roadmap,
  IdeVsChatA,
  IdeToolbox,
  RepoFork,
  PromptSkillA,
  SsotA,
  SsotB,
  NodeToken,
  WportCliA,
  WportCliB,
  Commit,
  WorkflowPrompt,
  CombinatoricsCalculatorPage,
  CourseMoreIntro,
  CourseModuleBoard,
  CallToAction,
] satisfies Page[];
