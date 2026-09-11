import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `
You are "Talk to Latch", a friendly, knowledgeable, and professional AI Assistant on the portfolio website of Latch Crisford D. Ayhon.
Your mission is to represent Latch accurately to recruiters, engineering leads, colleagues, and visitors inquiring about his work, background, and availability.

### Profile & Background
- Full Name: Latch Crisford D. Ayhon
- Role: IT Intern | BS Information Technology Student (4th Year, graduating 2026)
- University: Rizal Technological University (RTU)
- Academic Standing: GWA 1.48 (Dean's Lister & President's Lister)
- Location: Cainta, Rizal, Philippines
- Email: LatchCrisford213@gmail.com
- GitHub: https://github.com/DoubleCarry
- LinkedIn: https://www.linkedin.com/in/latchcrisfordayhon0805/

### Work & Internship Experience
1. Denso Ten Solutions Philippines Corporation (Feb 2026 – Apr 2026)
   - On-The-Job Training — Quality Assurance Intern
   - Conducted functional and regression testing on automotive infotainment software systems.
   - Executed test suites and verified builds using VerUp and PCTS proprietary QA tools.
   - Documented defect reports, analyzed system behavior logs, and collaborated across QA teams to meet release deadlines.

2. Ant Savvy Creatives (May 2025 – Jul 2025)
   - Software & Hardware Technician (Freelance)
   - On-site tech support for a high-traffic Coca-Cola promotional activation; maintained 100% uptime across 4 interactive event stations.
   - Display installation, hardware troubleshooting, network connectivity, and rapid fault diagnosis.

3. Taytay Public Information Office (SPES Program, Jun 2025 – Jul 2025)
   - Student Assistant
   - Maintained digital records via Excel/Word, resolved printer/network connectivity issues, supported IT operations for municipal announcements.

### Key Projects
1. "Kuya Pahipak" (Full-Stack E-Commerce & Loyalty Platform)
   - Tech: Next.js, React, Node.js, Express.js, Google Cloud Firestore, Firebase Authentication, Cloudinary, Tailwind CSS.
   - Live Website: https://kuya-pahipak.vercel.app
   - GitHub: https://github.com/DoubleCarry/KuyaPahipak
   - Features: Real-time inventory decrement, server-validated weighted loyalty roulette reward wheel (anti-tamper), secure Firebase Auth, optimized Cloudinary media pipeline.

2. "DTR ni Latch" (Daily Time Record & Attendance Tracking System)
   - Tech: HTML5, CSS3, JavaScript (ES6+), Node.js, Express.js, MongoDB & Mongoose, Cloudflare Workers.
   - Live Website / API: https://dtrnilatch.latchcrisford213.workers.dev/
   - GitHub: https://github.com/DoubleCarry/DTRproj
   - Features: Time-in/time-out logging, automated undertime/overtime deductions, MongoDB aggregation pipelines for fast audit calculations, pixel-accurate printable DTR sheets for physical compliance.

### Technical Skills
- Programming Languages: C++, Java, Python, PHP, JavaScript (ES6+), TypeScript, HTML5, CSS3
- Web & Backend: React, Next.js, Node.js, Express.js, RESTful API architecture, Tailwind CSS
- Databases & Cloud: Google Cloud Firestore, MongoDB, Firebase Auth, Cloudinary
- QA & Support: VerUp, PCTS, Functional & Regression Testing, Postman, Git/GitHub, Hardware Troubleshooting, Network Diagnosis

### Instructions for Responses
- Provide friendly, concise, and accurate responses.
- If asked whether Latch is available for work, answer enthusiastically that he is actively looking for entry-level IT, Quality Assurance, or Junior Web Developer opportunities and can be contacted via email (LatchCrisford213@gmail.com) or the onsite Contact Form.
- When referencing projects, offer to share their live links or technical details.
- Avoid making up details not in this profile. Keep responses concise and easy to read.
`;

function getLocalFallbackResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('background') || lower.includes('who is') || lower.includes('summarize') || lower.includes('about')) {
    return "Latch Crisford D. Ayhon is a 4th-year **BS Information Technology student at Rizal Technological University (RTU)** with a **1.48 GWA** (Dean's and President's Lister).\n\nHe combines hands-on industry **Quality Assurance testing** experience from **Denso Ten Solutions Philippines** with full-stack web development (*Kuya Pahipak* and *DTR ni Latch*), hardware troubleshooting, and IT infrastructure support.";
  }

  if (lower.includes('denso') || lower.includes('verup') || lower.includes('pcts') || lower.includes('qa') || lower.includes('test')) {
    return "At **Denso Ten Solutions Philippines Corporation** (Feb–Apr 2026), Latch completed his OJT as a **Quality Assurance Intern**:\n\n- Executed rigorous functional and regression test suites on automotive infotainment systems.\n- Mastered specialized proprietary QA toolchains including **VerUp** (firmware flashing & build verification) and **PCTS** (CAN/system signal validation).\n- Logged and classified defect tickets with reproducible steps and system telemetry.";
  }

  if (lower.includes('roulette') || lower.includes('loyalty') || lower.includes('kuya')) {
    return "**Kuya Pahipak** ([kuya-pahipak.vercel.app](https://kuya-pahipak.vercel.app)) features an anti-tamper **weighted reward roulette wheel**.\n\nRather than calculating outcomes in the browser where users could manipulate JavaScript variables, spin outcomes and point deductions are computed and validated on the backend before awarding vouchers or inventory items. It uses Google Cloud Firestore for real-time stock sync and Firebase Auth.";
  }

  if (lower.includes('dtr') || lower.includes('hour') || lower.includes('calculate') || lower.includes('attendance')) {
    return "**DTR ni Latch** ([dtrnilatch.latchcrisford213.workers.dev](https://dtrnilatch.latchcrisford213.workers.dev/)) calculates hours automatically using **MongoDB Aggregation Pipelines**:\n\n- Ingests precise time-in and time-out stamps for each duty shift.\n- Automatically computes grace periods, undertime, and overtime against configured daily quotas.\n- Generates pixel-accurate, printable Civil Service / OJT attendance sheets for administrative compliance.";
  }

  if (lower.includes('project') || lower.includes('repo') || lower.includes('code') || lower.includes('github')) {
    return "Latch's primary featured projects:\n\n1. **Kuya Pahipak** ([Live Demo](https://kuya-pahipak.vercel.app) • [GitHub](https://github.com/DoubleCarry/KuyaPahipak)): E-commerce platform with loyalty roulette, Firestore, and Cloudinary.\n2. **DTR ni Latch** ([Live Demo](https://dtrnilatch.latchcrisford213.workers.dev/) • [GitHub](https://github.com/DoubleCarry/DTRproj)): Automated attendance tracking platform with MongoDB aggregations.\n\nFull case studies with system architecture and database schemas are available right here on the portfolio!";
  }

  if (lower.includes('skill') || lower.includes('stack') || lower.includes('technolog') || lower.includes('language')) {
    return "Latch's core technical stack spans:\n\n- **Languages**: C++, Java, Python, PHP, JavaScript (ES6+), TypeScript, HTML5, CSS3\n- **Web Frameworks**: React, Next.js, Node.js, Express.js, Tailwind CSS\n- **Databases & Cloud**: Google Cloud Firestore, MongoDB / Mongoose, Firebase Auth, Cloudinary\n- **QA & IT Operations**: VerUp, PCTS, Functional/Regression Testing, Postman, Git/GitHub, Hardware & Network diagnostics.";
  }

  if (lower.includes('ant savvy') || lower.includes('technician') || lower.includes('taytay') || lower.includes('spes')) {
    return "Latch's additional technical experience includes:\n\n- **Ant Savvy Creatives (May–Jul 2025)**: On-site hardware & software technician for high-traffic Coca-Cola promotional activations, maintaining 100% uptime across 4 interactive stations.\n- **Taytay Public Information Office (SPES, Jun–Jul 2025)**: Digital record maintenance and municipal IT support.";
  }

  if (lower.includes('contact') || lower.includes('hire') || lower.includes('email') || lower.includes('interview') || lower.includes('location')) {
    return "Latch is based in **Cainta, Rizal** and is actively seeking entry-level IT, Quality Assurance, or Junior Web Developer opportunities.\n\nYou can reach him at:\n- **Email**: [LatchCrisford213@gmail.com](mailto:LatchCrisford213@gmail.com)\n- **LinkedIn**: [linkedin.com/in/latchcrisfordayhon0805](https://www.linkedin.com/in/latchcrisfordayhon0805/)\n- **GitHub**: [github.com/DoubleCarry](https://github.com/DoubleCarry)\n\nOr submit an inquiry directly through the Contact Form on this page!";
  }

  if (lower.includes('education') || lower.includes('gpa') || lower.includes('gwa') || lower.includes('rtu')) {
    return "Latch is a 4th-year **BS Information Technology** student at **Rizal Technological University (RTU Boni Campus)** graduating in 2026. He maintains an academic **GWA of 1.48**, earning honors as both a President's Lister and Dean's Lister.";
  }

  return "Hi! I'm **Talk to Latch**, Latch's AI assistant. I can answer questions about his software engineering projects (*Kuya Pahipak* & *DTR ni Latch*), his QA internship at *Denso Ten Solutions*, his technical skills in React/Node/MongoDB, or how to get in touch with him for hiring. What would you like to know?";
}

// Fallback model sequence to handle temporary model high-demand (503) or rate-limits
const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest'
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required.' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage?.content || '';

    // Check if GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fast, accurate domain knowledge fallback when API key is not yet configured
      const fallbackText = getLocalFallbackResponse(userPrompt);
      return NextResponse.json({ reply: fallbackText, source: 'knowledge-base' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format chat history
    const recentMessages = messages.slice(-8);
    const contents = recentMessages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    let reply: string | null = null;
    let successfulModel: string | null = null;

    // Attempt generation across candidate models if one experiences high demand (503)
    for (const modelName of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.6,
            maxOutputTokens: 600,
          },
        });

        if (response.text) {
          reply = response.text;
          successfulModel = modelName;
          break;
        }
      } catch (modelError: unknown) {
        // Log brief notice and attempt fallback model
        const errorMessage = modelError instanceof Error ? modelError.message : String(modelError);
        console.warn(`Model ${modelName} unavailable (${errorMessage.slice(0, 80)}...). Trying next candidate.`);
      }
    }

    // If all models failed or returned empty text, provide instant knowledge-base response
    if (!reply) {
      reply = getLocalFallbackResponse(userPrompt);
      return NextResponse.json({ reply, source: 'knowledge-base-fallback' });
    }

    return NextResponse.json({ reply, source: successfulModel || 'gemini' });
  } catch (error: unknown) {
    const fallbackMessage = "Latch is a 4th-year BS IT student at RTU (GWA 1.48) with QA experience at Denso Ten Solutions and full-stack projects in Next.js, Node.js, and MongoDB. You can reach him directly at LatchCrisford213@gmail.com!";
    return NextResponse.json({
      reply: fallbackMessage,
      source: 'fallback'
    });
  }
}
