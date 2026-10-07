import { supabase } from '@/lib/supabase';

export type NewStudyRoom = {
  name: string;
  location: string;
  description: string;
  condition: string;
  availableFrom: string | null;
  availableUntil: string | null;
};

export type NewSeat = {
  name: string;
  condition: string;
  description: string;
};

export async function addStudyRoom(room: NewStudyRoom): Promise<void> {
  const { error } = await supabase.from('studyrooms').insert({
    name: room.name,
    location: room.location,
    description: room.description,
    condition: room.condition || null,
    available_from: room.availableFrom,
    available_until: room.availableUntil,
  });

  if (error) {
    throw new Error(`Could not add study room: ${error.message}`);
  }
}

export async function addSeat(seat: NewSeat): Promise<void> {
  const { error } = await supabase.from('seats').insert({
    name: seat.name,
    condition: seat.condition || null,
    description: seat.description || null,
  });

  if (error) {
    throw new Error(`Could not add seat: ${error.message}`);
  }
}
