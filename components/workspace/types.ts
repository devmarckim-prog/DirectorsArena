export interface Character {
  id: string;
  name: string;
  gender: string;
  job: string;
  look: string;
  relationship_type: string;
  age?: number;
  secret?: string;
  void?: string;
  desire?: string;
}

export interface Episode {
  id: string;
  episode_number: number;
  title: string;
  summary: string;
  script_content: string | null;
}

export interface Project {
  id: string;
  title?: string;
  subtitle?: string;
  version?: string;
  buildId?: string;
  platform: string;
  genre: string;
  logline: string;
  synopsis: string;
  internal_conflict?: string;
  external_conflict?: string;
  characters: Character[];
  scenes: any[];
  episodes: Episode[];
  world: string;
  duration: number;
  status: string;
  progress: number;
  episode_count?: number;
  metadata?: {
    logline: string;
    synopsis: string;
    narrativeConflicts: { type: string, description: string }[];
  };
}
