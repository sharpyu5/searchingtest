
export interface Article {
  id: string;
  title: string;
  author: string;
  url: string;
  category: string;
  tags: string[];
  summary: string;
  addedAt: number;
}

// Added ChatMessage interface for the AI Assistant component
export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export const DEFAULT_CATEGORIES = [
  '科技/互联网',
  '金融/商业',
  '医学/健康',
  '法律/合规',
  '学术/研究',
  '教育/成长',
  '人文/生活',
  '其他'
];
