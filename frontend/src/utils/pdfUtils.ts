/**
 * extractTextFromFile
 *
 * Strategy A — TXT:
 *   Read directly on device via expo-file-system/legacy (no upload needed).
 *
 * Strategy B — PDF:
 *   Copy to app cache via expo-file-system/legacy so the URI is always
 *   a stable file:// path, then upload to POST /aichecker/extract.
 *
 * Uses expo-file-system/legacy (not the deprecated default export)
 * to stay compatible with Expo SDK 54.
 */
import * as FileSystem from 'expo-file-system/legacy';
import api from '../services/api';

export interface PickedFile {
  uri: string;
  name: string;
  mimeType?: string;
  size?: number;
}

export async function extractTextFromFile(file: PickedFile): Promise<string> {
  if (!file?.uri) throw new Error('No file provided.');

  const isPDF =
    file.name.toLowerCase().endsWith('.pdf') ||
    file.mimeType === 'application/pdf';

  // ── Strategy A: TXT — read directly on device ────────────────────
  if (!isPDF) {
    try {
      const content = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      if (!content?.trim()) throw new Error('File is empty.');
      return content;
    } catch (err: any) {
      throw new Error(`Could not read text file: ${err.message}`);
    }
  }

  // ── Strategy B: PDF — copy to cache then upload ───────────────────
  let uploadUri = file.uri;

  try {
    const dest = (FileSystem.cacheDirectory ?? '') + encodeURIComponent(file.name);
    await FileSystem.copyAsync({ from: file.uri, to: dest });
    uploadUri = dest;
  } catch {
    // Copy failed — try uploading the original URI anyway
    uploadUri = file.uri;
  }

  const formData = new FormData();
  formData.append('file', {
    uri:  uploadUri,
    name: file.name,
    type: 'application/pdf',
  } as any);

  try {
    // Do NOT set Content-Type manually — axios sets it with the boundary
    const response = await api.post<{ text: string }>(
      '/aichecker/extract',
      formData,
      { timeout: 30000 }
    );
    const text = response.data?.text ?? '';
    if (!text.trim()) throw new Error('PDF appears to be empty or image-only (scanned PDFs are not supported).');
    return text;
  } catch (err: any) {
    const serverMsg: string | undefined =
      err.response?.data?.message ?? err.response?.data?.error;
    const networkMsg = err.code === 'ECONNABORTED'
      ? 'Request timed out. Make sure the backend is running.'
      : err.message;
    throw new Error(serverMsg ?? networkMsg);
  }
}
