// @ts-nocheck
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { transferStudent, fetchTransferHistory } from '../services/transferService';

export const useTransferStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => transferStudent(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', payload.studentId] });
    },
  });
};

export const useTransferHistory = (studentId) => useQuery({
  queryKey: ['transferHistory', studentId],
  queryFn: () => fetchTransferHistory(studentId),
  enabled: !!studentId,
});
