/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // ── 색상 시스템 ──────────────────────────────────────
      colors: {
        // Primary: Petal (체리블라썸 핑크)
        petal: {
          50:  '#FFF5F7',
          100: '#FFE8ED',
          200: '#FFD1DC',   // 연한 배경
          300: '#FFB7C5',   // ★ 메인 (팔레트 원색)
          400: '#FF96AB',
          500: '#F07090',   // 버튼 hover
          600: '#D4718A',   // 버튼 active / 진한 텍스트
        },
        // Secondary: Mint (연민트 그린)
        mint: {
          50:  '#F4FBF5',
          100: '#E6F7E8',
          200: '#D5F3D8',   // ★ 메인 (팔레트 원색)
          300: '#B2E6B8',
          400: '#8FD498',
          500: '#68B872',   // 진한 민트
        },
        // Neutral: Blossom (로즈 베이지)
        blossom: {
          50:  '#FDF8F8',
          100: '#FAF0F0',
          200: '#F2C7C7',   // ★ 메인 (팔레트 원색)
          300: '#E8A8A8',
          400: '#D48888',
          500: '#B86868',
        },
        // Base
        snow:   '#FFFFFF',
        cream:  '#FFF8F9',  // 앱 배경
        // Text (핑크 언더톤 브라운)
        ink: {
          DEFAULT: '#3D2A30',  // 본문
          md:      '#7A5560',  // 보조
          lt:      '#B8909A',  // 약한
          hint:    '#D4B0B8',  // 힌트/placeholder
        },
        // Semantic
        success: '#68B872',
        warning: '#F0A882',
        error:   '#D4718A',
      },

      // ── 폰트 ─────────────────────────────────────────────
      fontFamily: {
        sans: ["'Noto Sans KR'", 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // label, caption, body, subhead, title, display
        'xs2':  ['10px', { lineHeight: '14px', fontWeight: '500' }],
        'xs':   ['11px', { lineHeight: '16px', fontWeight: '500' }],
        'sm':   ['13px', { lineHeight: '20px' }],
        'base': ['14px', { lineHeight: '22px' }],
        'md':   ['15px', { lineHeight: '24px' }],
        'lg':   ['17px', { lineHeight: '26px' }],
        'xl':   ['20px', { lineHeight: '28px' }],
        '2xl':  ['24px', { lineHeight: '32px' }],
        '3xl':  ['30px', { lineHeight: '38px' }],
      },

      // ── 간격 ─────────────────────────────────────────────
      spacing: {
        4.5:  '18px',
        13:   '52px',
        18:   '72px',
      },

      // ── 모서리 ────────────────────────────────────────────
      borderRadius: {
        'sm':  '8px',
        'md':  '12px',
        'lg':  '16px',
        'xl':  '20px',
        '2xl': '24px',
        '3xl': '30px',
        'pill': '9999px',
      },

      // ── 그림자 ────────────────────────────────────────────
      boxShadow: {
        'sm':    '0 1px 4px rgba(61,42,48,.06)',
        'md':    '0 2px 12px rgba(61,42,48,.08)',
        'lg':    '0 6px 24px rgba(61,42,48,.12)',
        'xl':    '0 12px 40px rgba(61,42,48,.16)',
        'petal': '0 4px 16px rgba(255,183,197,.45)',
        'mint':  '0 4px 16px rgba(213,243,216,.6)',
        'inner-soft': 'inset 0 2px 8px rgba(61,42,48,.06)',
      },
    },
  },
  plugins: [],
}
