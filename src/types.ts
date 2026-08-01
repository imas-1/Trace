export type MessageSender = 'me' | 'them';

export interface CaseMessage {
  from: MessageSender;
  text: string;
  clue?: boolean;
}

export interface CaseThread {
  id: string;
  name: string;
  initials: string;
  messages: CaseMessage[];
}

export interface GalleryMeta {
  Loc: string;
  Ora: string;
  Metadate: string;
}

export interface GalleryItem {
  id: string;
  img: string;
  label: string;
  note: string;
  meta: GalleryMeta;
}

export interface CaseNote {
  t: string;
  b: string;
}

export interface CaseLocation {
  id: string;
  name: string;
  x: number; // percentage, 0-100
  y: number; // percentage, 0-100
  time: string;
  note: string;
  last: boolean;
}

export type CallDirection = 'primit' | 'efectuat' | 'ratat';

export interface CaseCall {
  name: string;
  dir: CallDirection;
  dur: string;
  time: string;
  missed: boolean;
  clue?: boolean;
}

export type BoardItemType = 'Mesaj' | 'Foto' | 'Notiță' | 'Apel';

export interface BoardItem {
  id: string;
  type: BoardItemType;
  text: string;
  x: number;
  y: number;
}

export interface BoardLink {
  a: string;
  b: string;
}

export interface CaseEnding {
  id: string;
  check: (links: BoardLink[]) => boolean;
  eyebrow: string;
  title: string;
  body: string;
}

export interface CaseData {
  id: string;
  title: string;
  victim: string;
  passcode: string;
  intro: { eyebrow: string; title: string; subtitle: string };
  threads: CaseThread[];
  gallery: GalleryItem[];
  notes: CaseNote[];
  locations: CaseLocation[];
  calls: CaseCall[];
  board: BoardItem[];
  endings: CaseEnding[];
}

export type AppId = 'messages' | 'gallery' | 'notes' | 'board' | 'maps' | 'calls';

export interface BoardPosition {
  x: number;
  y: number;
}

export interface GameSaveState {
  unlocked: boolean;
  links: BoardLink[];
  positions: Record<string, BoardPosition>;
  tutorialSeen: boolean;
  updatedAt: number;
}

export function hasLink(links: BoardLink[], a: string, b: string): boolean {
  return links.some((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a));
}
