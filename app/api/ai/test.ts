// app/api/ai/test.ts
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const checks = {
    openaiKeyExists: !!process.env.OPENAI_API_KEY,
    openaiKeyValid: process.env.OPENAI_API_KEY?.startsWith('sk-proj-') || false,
    openaiKeyLength: process.env.OPENAI_API_KEY?.length || 0,
  };

  // Test appel à OpenAI
  let openaiTest = { success: false, error: 'Non testé' };

  if (checks.openaiKeyExists && checks.openaiKeyValid) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      });

      if (response.ok) {
        openaiTest = { success: true, message: 'Connexion OpenAI OK ✅' };
      } else {
        const error = await response.json();
        openaiTest = {
          success: false,
          error: `OpenAI API Error: ${response.status} - ${error.error?.message}`,
        };
      }
    } catch (error) {
      openaiTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  } else {
    openaiTest = {
      success: false,
      error: 'OPENAI_API_KEY non configuré ou invalide',
    };
  }

  return NextResponse.json({
    diagnostics: {
      ...checks,
      openaiTest,
      timestamp: new Date().toISOString(),
    },
  });
}
