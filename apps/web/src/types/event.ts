export interface Ticket {
  id: string;
  name: string;
  price: number;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: Category;
  price: number;
  date: string;
  location: string;
  image: string;
  created_at: string;
  tickets: Ticket[];
}

export type Category = 'Todos' | 'Tecnologia' | 'Música' | 'Workshop' | 'Esportes';

export const CATEGORIES: Category[] = ['Todos', 'Tecnologia', 'Música', 'Workshop', 'Esportes'];
