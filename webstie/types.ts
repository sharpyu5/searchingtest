
export enum Category {
  TECH = '科技/互联网',
  FINANCE = '金融/商业',
  MEDICAL = '医学/健康',
  LAW = '法律/合规',
  ACADEMIC = '学术/研究',
  EDUCATION = '教育/成长',
  LIFESTYLE = '人文/生活',
  OTHER = '其他'
}

export interface Article {
  id: string;
  title: string;
  author: string;
  url: string;
  category: Category;
  tags: string[];
  summary: string;
  addedAt: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}
