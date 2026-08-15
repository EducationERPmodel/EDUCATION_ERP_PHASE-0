// @ts-nocheck
import { Platform } from 'react-native';
import axiosInstance from '../api/axiosInstance';

export const transferStudent = async ({
  studentId, newProgramId, newDepartmentId, newSemester, newSectionId, remarks, document,
}) => {
  const formData = new FormData();
  formData.append('studentId', studentId);
  formData.append('newProgramId', newProgramId);
  formData.append('newDepartmentId', newDepartmentId);
  formData.append('newSemester', newSemester);
  formData.append('newSectionId', newSectionId);
  if (remarks) formData.append('remarks', remarks);

  if (document) {
    if (Platform.OS === 'web') {
      // expo-document-picker gives a blob: URL on web, not a real file path.
      // A plain {uri, name, type} object is NOT a valid FormData file value
      // in a browser - it silently gets stringified instead of uploaded.
      // It also provides the actual browser File object via `.file` - use that.
      formData.append('supportingDocument', document.file, document.name);
    } else {
      formData.append('supportingDocument', {
        uri: document.uri,
        name: document.name,
        type: document.mimeType || 'application/octet-stream',
      });
    }
  }

  const response = await axiosInstance.post('/students/transfer', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const fetchTransferHistory = async (studentId) => {
  const response = await axiosInstance.get(`/students/transfer/${studentId}/history`);
  return response.data;
};
