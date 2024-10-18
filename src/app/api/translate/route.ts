import { NextResponse } from 'next/server';
import { translate } from 'google-translate-api-x';

type TranslatableValue = string | TranslatableObject | TranslatableArray;
type TranslatableObject = { [key: string]: TranslatableValue };
type TranslatableArray = TranslatableValue[];

async function translateObject(obj: TranslatableValue, targetLanguage: string): Promise<TranslatableValue> {
  if (typeof obj === 'string') {
    const result = await translate(obj, { to: targetLanguage });
    return result.text;
  } else if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => translateObject(item, targetLanguage)));
  } else if (typeof obj === 'object' && obj !== null) {
    const translatedObj: TranslatableObject = {};
    for (const [key, value] of Object.entries(obj)) {
      translatedObj[key] = await translateObject(value, targetLanguage);
    }
    return translatedObj;
  }
  return obj;
}

export async function POST(request: Request) {
  const { texts, targetLanguage } = await request.json();

  if (!texts || !targetLanguage) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const translatedObject = await translateObject(texts, targetLanguage);
    return NextResponse.json(translatedObject);
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Error translating text' }, { status: 500 });
  }
}
