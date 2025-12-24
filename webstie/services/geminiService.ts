
import { GoogleGenAI, Type } from "@google/genai";
import { Category } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function classifyArticle(title: string, snippet: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `请对以下微信公众号文章进行专业分类和摘要：
    标题：${title}
    摘要/片段：${snippet}
    
    返回JSON格式。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            description: "分类名，必须是以下之一: " + Object.values(Category).join(", ")
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "文章的3-5个核心关键词"
          },
          summary: {
            type: Type.STRING,
            description: "不超过100字的精简专业概括"
          }
        },
        required: ["category", "tags", "summary"]
      }
    }
  });

  return JSON.parse(response.text);
}

export function createArticleChat(context: string) {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `你是一个专业的内容分析助手。你将根据用户提供的微信公众号文章库内容进行解答。
      当前内容库上下文如下：
      ${context}
      
      请用专业、客观、简洁的语气回答用户的问题。如果问题不在内容库范围内，请告知用户并尝试基于通用专业知识回答。`,
    }
  });
}
