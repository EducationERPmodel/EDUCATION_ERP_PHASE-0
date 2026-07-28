/**
 * React Native replacement for the web pdfjs-dist utility.
 *
 * SDK 54 note: expo-file-system v19 moved the legacy API to expo-file-system/legacy.
 * The new default export is an object-oriented API. We use the legacy API here
 * because readAsStringAsync is the simplest cross-platform text reader.
 *
 * File object shape from expo-document-picker v14:
 *   { uri, name, mimeType, size, lastModified }
 */
import * as FileSystem from 'expo-file-system/legacy';

export async function extractTextFromFile(file) {
  if (!file) return '';

  const isPdf =
    file.mimeType === 'application/pdf' ||
    (file.name && file.name.toLowerCase().endsWith('.pdf'));

  if (isPdf) {
    // PDF binary parsing requires a native module not available in Expo Go.
    return '__PDF_UNSUPPORTED__';
  }

  try {
    const content = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    return content;
  } catch (err) {
    console.error('Error reading text file:', err);
    return '';
  }
}
