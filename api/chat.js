export default async function handler(req, res) {
  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许 POST 请求' });
  }

  // 从 Vercel 的环境变量中读取你的 API Key
  const ZHIPU_KEY = process.env.ZHIPU_API_KEY;
  
  // 接收前端网页传过来的对话内容
  const { messages, maxTokens } = req.body;

  try {
    // 由服务器向智谱发起请求
    const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ZHIPU_KEY}`
      },
      body: JSON.stringify({
        model: "glm-4-flash", // 使用智谱的免费模型
        messages: messages,
        max_tokens: maxTokens || 800
      })
    });

    const data = await response.json();
    
    // 把智谱的返回结果原封不动地发回给前端
    res.status(200).json(data);
  } catch (error) {
    console.error("API 调用失败:", error);
    res.status(500).json({ error: '服务器内部错误' });
  }
}