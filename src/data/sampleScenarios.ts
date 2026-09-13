export interface SampleScenario {
  id: string;
  title: string;
  category: 'Security Warning' | 'Privacy Leak' | 'Phishing Alert' | 'Safe Baseline';
  description: string;
  expectedFindings: string;
  imageDataUrl: string;
  filename: string;
}

// Generate realistic SVG mock screenshots as data URLs for offline/instant testing
function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
}

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: 'tls-cert-invalid',
    title: 'TLS Certificate Mismatch (NET::ERR_CERT_COMMON_NAME_INVALID)',
    category: 'Security Warning',
    description: 'A classic browser interstitial warning showing an invalid common name certificate error on a university portal.',
    expectedFindings: 'High Security Risk: NET::ERR_CERT_COMMON_NAME_INVALID, MITM potential, avoid entering credentials.',
    filename: 'tls_warning_screenshot.png',
    imageDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
        <rect width="900" height="540" fill="#202124" />
        <!-- Browser Bar -->
        <rect width="900" height="42" fill="#292A2D" />
        <circle cx="24" cy="21" r="6" fill="#EA4335" />
        <circle cx="44" cy="21" r="6" fill="#FBBC05" />
        <circle cx="64" cy="21" r="6" fill="#34A853" />
        <rect x="90" y="8" width="720" height="26" rx="13" fill="#1C1D1F" />
        <text x="110" y="25" fill="#EA4335" font-family="Arial, sans-serif" font-size="12" font-weight="bold">🔒 Not Secure | https://portal.campus-auth-gateway.edu/login</text>
        
        <!-- Warning Icon -->
        <g transform="translate(100, 100)">
          <path d="M40 10 L75 75 L5 75 Z" fill="#EA4335" stroke="#EA4335" stroke-width="2"/>
          <text x="36" y="58" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="34" font-weight="bold">!</text>
        </g>

        <!-- Warning Content -->
        <text x="100" y="210" fill="#E8EAED" font-family="Arial, sans-serif" font-size="28" font-weight="bold">Your connection is not private</text>
        <text x="100" y="250" fill="#9AA0A6" font-family="Arial, sans-serif" font-size="15">Attackers might be trying to steal your information from portal.campus-auth-gateway.edu</text>
        <text x="100" y="275" fill="#9AA0A6" font-family="Arial, sans-serif" font-size="15">(for example, passwords, messages, or credit cards).</text>

        <rect x="100" y="310" width="450" height="40" rx="4" fill="#303134" />
        <text x="115" y="335" fill="#E8EAED" font-family="monospace" font-size="13">NET::ERR_CERT_COMMON_NAME_INVALID</text>

        <!-- Action Buttons -->
        <rect x="100" y="380" width="160" height="38" rx="19" fill="#8AB4F8" />
        <text x="140" y="404" fill="#202124" font-family="Arial, sans-serif" font-size="14" font-weight="bold">Back to safety</text>

        <rect x="280" y="380" width="110" height="38" rx="4" fill="#3C4043" />
        <text x="310" y="404" fill="#8AB4F8" font-family="Arial, sans-serif" font-size="14">Advanced</text>

        <text x="100" y="470" fill="#5F6368" font-family="Arial, sans-serif" font-size="12">Subject Alternative Name (SAN) mismatch. Certificate was issued to *.internal-dev.local</text>
      </svg>
    `)
  },
  {
    id: 'api-secret-leak',
    title: 'Exposed API Keys & Auth Token in Terminal / Code',
    category: 'Privacy Leak',
    description: 'Developer screenshot showing accidentally committed secrets, live OpenAI token, AWS credentials, and student email.',
    expectedFindings: 'Critical Privacy Risk: sk-proj-..., AWS_SECRET_ACCESS_KEY, alex.student@college.edu.',
    filename: 'terminal_api_leak.png',
    imageDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
        <rect width="900" height="540" fill="#0D1117" />
        <!-- Window titlebar -->
        <rect width="900" height="38" fill="#161B22" />
        <circle cx="20" cy="19" r="6" fill="#FF5F56" />
        <circle cx="38" cy="19" r="6" fill="#FFBD2E" />
        <circle cx="56" cy="19" r="6" fill="#27C93F" />
        <text x="380" y="24" fill="#8B949E" font-family="monospace" font-size="13">bash - 90x24 (env_setup.sh)</text>

        <!-- Terminal Content -->
        <g transform="translate(40, 70)" font-family="monospace" font-size="14">
          <text y="20" fill="#58A6FF">student@lab-workstation:~/project$ cat .env.production</text>
          <text y="55" fill="#8B949E"># Production Deployment Config</text>
          <text y="85" fill="#7EE787">DEVELOPER_NAME=<tspan fill="#C9D1D9">"Alex Vance"</tspan></text>
          <text y="115" fill="#7EE787">CONTACT_EMAIL=<tspan fill="#FFA657">"alex.vance2025@college.edu"</tspan></text>
          <text y="145" fill="#7EE787">STUDENT_ID=<tspan fill="#FFA657">"STU-8849201"</tspan></text>
          <text y="175" fill="#7EE787">DATABASE_URL=<tspan fill="#C9D1D9">"postgresql://admin:P@ssw0rd992!@192.168.1.45:5432/userdb"</tspan></text>
          
          <text y="215" fill="#FF7B72">OPENAI_API_KEY=<tspan fill="#FFA657">"sk-proj-9xL31k99QZaM4019KLaPq183018241049Zaa"</tspan></text>
          <text y="245" fill="#FF7B72">AWS_SECRET_ACCESS_KEY=<tspan fill="#FFA657">"wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"</tspan></text>
          <text y="275" fill="#FF7B72">JWT_SIGNING_TOKEN=<tspan fill="#FFA657">"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.s7f8a9d0"</tspan></text>
          
          <text y="325" fill="#58A6FF">student@lab-workstation:~/project$ git status</text>
          <text y="355" fill="#F85149">Untracked files: (use "git add &lt;file&gt;...")</text>
          <text y="380" fill="#F85149">&#160;&#160;&#160;&#160;.env.production</text>
        </g>
      </svg>
    `)
  },
  {
    id: 'phishing-deceptive-site',
    title: 'Phishing & Deceptive Site Warning Interstitial',
    category: 'Phishing Alert',
    description: 'Red browser security screen warning that the site is known to attempt credential theft and deceptive tricks.',
    expectedFindings: 'Critical Security Risk: Deceptive site ahead, potential credential harvest, dangerous website warning.',
    filename: 'phishing_warning.png',
    imageDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
        <rect width="900" height="540" fill="#D93025" />
        <!-- Top bar -->
        <rect width="900" height="40" fill="#A52714" />
        <text x="25" y="25" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="13" font-weight="bold">🛡️ Chrome Safe Browsing Protection</text>
        <text x="700" y="25" fill="#FCE8E6" font-family="monospace" font-size="12">https://secure-login-campus-verify.xyz</text>

        <!-- Center Warning -->
        <g transform="translate(100, 110)">
          <!-- Hazard Shield Icon -->
          <circle cx="40" cy="40" r="35" fill="#FFFFFF" opacity="0.2"/>
          <text x="25" y="52" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="36" font-weight="bold">⚠️</text>
          
          <text x="0" y="115" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="32" font-weight="bold">Deceptive site ahead</text>
          <text x="0" y="155" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="16" width="650">
            Attackers on secure-login-campus-verify.xyz may trick you into doing something dangerous
          </text>
          <text x="0" y="180" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="16">
            like installing software or revealing your personal information (for example, passwords, phone numbers, or credit cards).
          </text>

          <!-- Buttons -->
          <rect x="0" y="240" width="180" height="44" rx="4" fill="#FFFFFF" />
          <text x="35" y="267" fill="#D93025" font-family="Arial, sans-serif" font-size="15" font-weight="bold">Back to safety</text>

          <rect x="200" y="240" width="120" height="44" rx="4" fill="transparent" stroke="#FFFFFF" stroke-width="1.5" />
          <text x="235" y="267" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="15">Details</text>
        </g>
      </svg>
    `)
  },
  {
    id: 'student-id-leak',
    title: 'Student Identity Card & Health Form with PII',
    category: 'Privacy Leak',
    description: 'Screenshot containing campus identification number, phone, email, and barcode.',
    expectedFindings: 'High Privacy Risk: Student ID, Full Name, Contact Details, Personal barcode/QR data.',
    filename: 'student_id_card.png',
    imageDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
        <rect width="900" height="540" fill="#1E293B" />
        
        <!-- ID Badge Card -->
        <rect x="150" y="60" width="600" height="380" rx="16" fill="#FFFFFF" stroke="#0284C7" stroke-width="4" />
        
        <!-- Header Banner -->
        <rect x="150" y="60" width="600" height="70" rx="16" fill="#0284C7" />
        <rect x="150" y="100" width="600" height="30" fill="#0284C7" />
        <text x="180" y="105" fill="#FFFFFF" font-family="Arial, sans-serif" font-size="20" font-weight="bold">STATE UNIVERSITY STUDENT PORTAL</text>

        <!-- Avatar Box -->
        <rect x="180" y="155" width="140" height="170" rx="8" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
        <circle cx="250" cy="210" r="35" fill="#94A3B8"/>
        <path d="M210 290 Q250 240 290 290" fill="#94A3B8"/>
        <text x="210" y="315" fill="#475569" font-family="Arial, sans-serif" font-size="11">OFFICIAL PHOTO</text>

        <!-- Student Data -->
        <g transform="translate(350, 160)" font-family="Arial, sans-serif">
          <text y="20" fill="#64748B" font-size="12" font-weight="bold">STUDENT NAME</text>
          <text y="42" fill="#0F172A" font-size="18" font-weight="bold">Maya Lin Chen</text>

          <text y="80" fill="#64748B" font-size="12" font-weight="bold">STUDENT ID #</text>
          <text y="102" fill="#0284C7" font-family="monospace" font-size="18" font-weight="bold">STU-99482104</text>

          <text y="135" fill="#64748B" font-size="12" font-weight="bold">CAMPUS EMAIL</text>
          <text y="155" fill="#0F172A" font-size="14">maya.chen@univ.edu</text>

          <text y="185" fill="#64748B" font-size="12" font-weight="bold">PHONE NUMBER</text>
          <text y="205" fill="#0F172A" font-size="14">+1 (555) 382-9104</text>
        </g>

        <!-- Barcode at bottom -->
        <g transform="translate(200, 360)">
          <rect x="0" y="0" width="500" height="40" fill="#F8FAFC" stroke="#E2E8F0"/>
          <path d="M20 5 v30 M26 5 v30 M30 5 v30 M38 5 v30 M48 5 v30 M56 5 v30 M62 5 v30 M72 5 v30 M85 5 v30 M95 5 v30 M110 5 v30 M130 5 v30 M150 5 v30 M170 5 v30 M190 5 v30 M210 5 v30 M240 5 v30 M270 5 v30 M300 5 v30 M330 5 v30 M360 5 v30 M390 5 v30 M420 5 v30 M450 5 v30 M480 5 v30" stroke="#0F172A" stroke-width="3"/>
          <text x="210" y="55" fill="#64748B" font-family="monospace" font-size="11">CODE-128: 99482104-ACTIVE</text>
        </g>
      </svg>
    `)
  },
  {
    id: 'harmless-clean-doc',
    title: 'Safe Public Open-Source Documentation',
    category: 'Safe Baseline',
    description: 'Screenshot of a benign open-source markdown readme with no security warnings or private secrets.',
    expectedFindings: 'Low Overall Risk: Safe public educational content, no credentials or warnings.',
    filename: 'public_docs.png',
    imageDataUrl: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="540" viewBox="0 0 900 540">
        <rect width="900" height="540" fill="#0F172A" />
        <rect x="60" y="40" width="780" height="460" rx="12" fill="#1E293B" stroke="#334155" />
        
        <rect x="60" y="40" width="780" height="50" rx="12" fill="#334155" />
        <circle cx="90" cy="65" r="5" fill="#64748B"/>
        <circle cx="106" cy="65" r="5" fill="#64748B"/>
        <circle cx="122" cy="65" r="5" fill="#64748B"/>
        <text x="145" y="70" fill="#94A3B8" font-family="Arial, sans-serif" font-size="13">README.md — OpenSource Cryptography Library</text>

        <g transform="translate(100, 130)" font-family="Arial, sans-serif">
          <text y="0" fill="#38BDF8" font-size="22" font-weight="bold"># LibCrypto-Lite</text>
          <text y="35" fill="#E2E8F0" font-size="14">A lightweight educational cryptographic library for computer science students.</text>
          
          <text y="80" fill="#F8FAFC" font-size="16" font-weight="bold">## Installation</text>
          <rect y="95" width="600" height="40" rx="6" fill="#0F172A" stroke="#334155"/>
          <text x="15" y="120" fill="#34D399" font-family="monospace" font-size="13">$ npm install libcrypto-lite --save-dev</text>

          <text y="175" fill="#F8FAFC" font-size="16" font-weight="bold">## Core Concepts</text>
          <text y="200" fill="#94A3B8" font-size="13">• Symmetric vs Asymmetric Ciphers</text>
          <text y="225" fill="#94A3B8" font-size="13">• Public Key Infrastructure (PKI) and Certificate Authorities</text>
          <text y="250" fill="#94A3B8" font-size="13">• SHA-256 Hashing Algorithms</text>
          
          <rect y="280" width="600" height="34" rx="4" fill="#065F46" />
          <text x="15" y="302" fill="#A7F3D0" font-size="13">✓ Status: All 48 test suites passing. Clean build.</text>
        </g>
      </svg>
    `)
  }
];
