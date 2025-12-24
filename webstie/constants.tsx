
import { Category, Article } from './types';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: '1',
    title: '深入理解大模型架构：从Transformer到MoE',
    author: '架构师之路',
    url: 'https://mp.weixin.qq.com/s/example1',
    category: Category.TECH,
    tags: ['大模型', 'AI', '架构'],
    summary: '本文详细解析了生成式AI的核心架构演进，探讨了混合专家模型（MoE）如何平衡算力与效果。',
    addedAt: Date.now() - 3600000
  },
  {
    id: '2',
    title: '2024全球宏观经济展望：降息周期的挑战',
    author: '金融参考',
    url: 'https://mp.weixin.qq.com/s/example2',
    category: Category.FINANCE,
    tags: ['宏观经济', '投资', '金融'],
    summary: '深度分析美联储政策转向对全球市场的影响，以及新兴市场在降息预期下的表现。',
    addedAt: Date.now() - 7200000
  },
  {
    id: '3',
    title: '新修订公司法核心条款解读',
    author: '法治观察',
    url: 'https://mp.weixin.qq.com/s/example3',
    category: Category.LAW,
    tags: ['公司法', '法律', '合规'],
    summary: '针对最新修法中的出资责任、公司治理结构变化进行的专业法条拆解。',
    addedAt: Date.now() - 10800000
  }
];

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.TECH]: 'bg-blue-100 text-blue-700 border-blue-200',
  [Category.FINANCE]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  [Category.MEDICAL]: 'bg-rose-100 text-rose-700 border-rose-200',
  [Category.LAW]: 'bg-amber-100 text-amber-700 border-amber-200',
  [Category.ACADEMIC]: 'bg-purple-100 text-purple-700 border-purple-200',
  [Category.EDUCATION]: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  [Category.LIFESTYLE]: 'bg-orange-100 text-orange-700 border-orange-200',
  [Category.OTHER]: 'bg-gray-100 text-gray-700 border-gray-200'
};
