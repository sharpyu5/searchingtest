
import { Article, DEFAULT_CATEGORIES } from './types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: '深入理解大模型架构：从Transformer到MoE',
    author: '架构师之路',
    url: 'https://mp.weixin.qq.com/s/example1',
    category: '科技/互联网',
    tags: ['大模型', 'AI', '架构'],
    summary: '本文详细解析了生成式AI的核心架构演进，探讨了混合专家模型（MoE）如何平衡算力与效果。',
    addedAt: Date.now() - 3600000
  },
  {
    id: '2',
    title: '2024全球宏观经济展望：降息周期的挑战',
    author: '金融参考',
    url: 'https://mp.weixin.qq.com/s/example2',
    category: '金融/商业',
    tags: ['宏观经济', '投资', '金融'],
    summary: '深度分析美联储政策转向对全球市场的影响，以及新兴市场在降息预期下的表现。',
    addedAt: Date.now() - 7200000
  }
];

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    '科技/互联网': 'bg-blue-100 text-blue-700 border-blue-200',
    '金融/商业': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    '医学/健康': 'bg-rose-100 text-rose-700 border-rose-200',
    '法律/合规': 'bg-amber-100 text-amber-700 border-amber-200',
    '学术/研究': 'bg-purple-100 text-purple-700 border-purple-200',
    '教育/成长': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    '人文/生活': 'bg-orange-100 text-orange-700 border-orange-200',
    '其他': 'bg-gray-100 text-gray-700 border-gray-200'
  };
  return colors[category] || colors['其他'];
};
