// Pasar a true para impactar en base de datos
const USE_API = false;
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
export type MediaType = 'image' | 'video' | 'other';

export interface Post {
  id: string;
  authorUsername: string;
  authorAvatar: string;
  title: string;
  body: string;           // HTML rico generado por el editor
  mediaUrl?: string;      // base64 data-url (local) o URL pública (API)
  mediaType?: MediaType;
  createdAt: string;      // ISO string
  upvotes: number;
  commentCount: number;
}

export interface CreatePostInput {
  title: string;
  body: string;
  authorUsername: string;
  authorAvatar: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}

interface IPostRepository {
  getPosts(): Promise<Post[]>;
  createPost(input: CreatePostInput): Promise<Post>;
}

// ══════════════════════════════════════════════════════════════════════════════
// IMPLEMENTACIÓN 1: localStorage (sin backend)
// ══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'redditclon_posts';

// posteos hardoceados
const SEED_POSTS: Post[] = [
  {
    id: 'seed-1',
    authorUsername: 'astro_enthusiast',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=astro_enthusiast',
    title: '🚀 La NASA acaba de confirmar agua líquida bajo la superficie de Europa',
    body: 'El nuevo telescopio espacial James Webb detectó señales inequívocas de presencia de agua líquida bajo el hielo de Europa, la luna de Júpiter. Esto aumenta enormemente las probabilidades de encontrar vida extraterrestre dentro de nuestro propio sistema solar. ¿Qué piensan? ¿Será este el descubrimiento del siglo?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    upvotes: 4821,
    commentCount: 312,
  },
  {
    id: 'seed-2',
    authorUsername: 'techgeek_dev',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=techgeek_dev',
    title: 'Después de 6 meses usando Vim, volví a VS Code y no me arrepiento',
    body: 'Sí, lo sé. Hereje. Pasé medio año aprendiendo Vim, los plugins, el modo normal, el visual... y al final me di cuenta que VS Code con Vim keybindings me da el 95% de la experience con el 5% del dolor. La productividad real mejora cuando usás la herramienta que te hace más eficiente, no la que suena más cool en Twitter. Debate abajo 👇',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    upvotes: 2103,
    commentCount: 487,
  },
  {
    id: 'seed-3',
    authorUsername: 'gamer_classico',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=gamer_classico',
    title: "Terminé el Baldur's Gate 3 con 200 horas y acá está mi review honesta",
    body: 'Jugué cada rincón, cada sidequest, cada decisión moral imposible. Mi conclusión: es uno de los mejores RPGs que se hicieron en la historia. Larian no solo revivió el RPG por turnos — lo reinventó.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    upvotes: 9342,
    commentCount: 1024,
  },
];

const localRepository: IPostRepository = {
  async getPosts(): Promise<Post[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Post[];
    } catch { /* ignore */ }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_POSTS));
    return SEED_POSTS;
  },

  async createPost(input: CreatePostInput): Promise<Post> {
    const post: Post = {
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      authorUsername: input.authorUsername,
      authorAvatar: input.authorAvatar,
      title: input.title,
      body: input.body,
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
      createdAt: new Date().toISOString(),
      upvotes: 1,
      commentCount: 0,
    };
    const current = await localRepository.getPosts();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([post, ...current]));
    return post;
  },
};


// IMPLEMENTACIÓN 2: API REST (backend real)
// PARA ACTIVAR: cambiá USE_API = true arriba.
const apiRepository: IPostRepository = {
  async getPosts(): Promise<Post[]> {
    const res = await fetch(`${API_BASE_URL}/api/posts`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`Error al obtener posts: ${res.status}`);
    return res.json();
  },

  async createPost(input: CreatePostInput): Promise<Post> {
    const res = await fetch(`${API_BASE_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`Error al crear post: ${res.status}`);
    return res.json();
  },
};
const repository: IPostRepository = USE_API ? apiRepository : localRepository;

export const getPosts = () => repository.getPosts();
export const createPost = (input: CreatePostInput) => repository.createPost(input);

/** Convierte un File a base64 data-url (usado solo en modo localStorage) */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Detecta el tipo de media a partir del MIME del archivo */
export function detectMediaType(file: File): MediaType {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return 'other';
}

/** Formatea tiempo relativo en español (ej: "hace 3 h") */
export function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'ahora mismo';
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return new Date(isoString).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
}
