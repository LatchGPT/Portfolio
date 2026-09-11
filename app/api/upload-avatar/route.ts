import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Save as both profile.png and Image.png for compatibility
    const profilePath = path.join(publicDir, 'profile.png');
    const imagePath = path.join(publicDir, 'Image.png');

    fs.writeFileSync(profilePath, buffer);
    fs.writeFileSync(imagePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/profile.png?v=${Date.now()}`
    });
  } catch (error) {
    console.error('Failed to upload avatar:', error);
    return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 });
  }
}
