import { NextResponse } from 'next/server';
import { translate } from 'google-translate-api-x';
import NodeCache from 'node-cache';

// Create a cache with a default TTL of 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

type TranslatableValue = string | TranslatableObject | TranslatableArray;
type TranslatableObject = { [key: string]: TranslatableValue };
type TranslatableArray = TranslatableValue[];

async function translateText(text: string, targetLanguage: string): Promise<string> {
  const cacheKey = `${text}:${targetLanguage}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) {
    return cachedResult as string;
  }
  const result = await translate(text, { to: targetLanguage });
  cache.set(cacheKey, result.text);
  return result.text;
}

async function translateObject(obj: TranslatableValue, targetLanguage: string): Promise<TranslatableValue> {
  if (typeof obj === 'string') {
    return await translateText(obj, targetLanguage);
  } else if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => translateObject(item, targetLanguage)));
  } else if (typeof obj === 'object' && obj !== null) {
    const translatedObj: TranslatableObject = {};
    const entries = Object.entries(obj);
    const translatedEntries = await Promise.all(
      entries.map(async ([key, value]) => [key, await translateObject(value, targetLanguage)])
    );
    translatedEntries.forEach(([key, value]) => {
      translatedObj[key as string] = value;
    });
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
