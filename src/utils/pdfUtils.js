/**
 * extractTextFromFile
 *
 * Strategy:
 *  - Upload the file to the backend POST /aichecker/extract
 *  - Backend uses pdf-parse (for PDFs) or buffer.toString (for TXT)
 *  - Returns extracted plain text
 *
 * This approach works for BOTH .txt and .pdf on Android/iOS in Expo Go
 * without any native PDF module.
 *
 * File object shape from expo-document-picker v14:
 *   { uri, name, mimeType, size }
 */
import api from '../services/api';

export async function extractTextFromFile(file) {
  if (!file) return '';

  try {
    // Build multipart/form-data payload
    const formData = new FormData();
    formData.append('file', {
      uri:  file.uri,
      name: file.name,
      type: file.mimeType || (file.name.endsWith('.pdf') ? 'application/pdf' : 'text/plain'),
    });

    const response = await api.post('/aichecker/extract', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    });

    return response.data.text || '';
  } catch (err) {
    console.error('extractTextFromFile error:', err.response?.data || err.message);
    const msg = err.response?.data?.message || err.message;
    throw new Error(msg);
  }
}
