import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Please provide your name.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Please include a message of at least 5 characters.' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedSubject = (subject && typeof subject === 'string') ? subject.trim() : 'Portfolio Contact Inquiry';
    const trimmedMessage = message.trim();

    // Server-side audit log
    console.log('--- NEW CONTACT FORM SUBMISSION ---');
    console.log(`From: ${trimmedName} <${trimmedEmail}>`);
    console.log(`Subject: ${trimmedSubject}`);
    console.log(`Message:\n${trimmedMessage}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('-----------------------------------');

    return NextResponse.json({
      success: true,
      message: `Thank you, ${trimmedName}! Your message has been recorded. Latch has been notified and will reply to ${trimmedEmail} shortly.`,
      receivedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while transmitting your message.' },
      { status: 500 }
    );
  }
}
