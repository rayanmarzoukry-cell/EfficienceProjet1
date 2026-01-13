// app/api/ai/diagnose.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const key = process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    hasKey: !!key,
    keyLength: key?.length || 0,
    keyStart: key?.substring(0, 20) || 'none',
    keyFormat: {
      startsWithSkProj: key?.startsWith('sk-proj-') || false,
      startsWithSk: key?.startsWith('sk-') || false,
      startsWithSvcacct: key?.startsWith('sk-svcacct-') || false,
    },
    warning: 
      key?.startsWith('sk-svcacct-') 
        ? '⚠️ This looks like a SERVICE ACCOUNT KEY, not an API KEY. Get an API key from https://platform.openai.com/api/keys'
        : key?.startsWith('sk-proj-')
        ? '✅ Key format looks correct'
        : '❌ Key format looks wrong',
  }, { status: 200 });
}
