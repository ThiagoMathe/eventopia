import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const response = await api.get('/events');
      return response.data;
    },
  });
}