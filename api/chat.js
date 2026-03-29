export async function onRequestPost(context) {
  try {
    // 获取前端传过来的数据
    const body = await context.request.json();

    // 获取你在 Cloudflare 后台配置的 API Key
    const apiKey = context.env.DEEPSEEK_API_KEY;

    // 呼叫 DeepSeek 的大脑
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "deepseek-chat", // 或者 deepseek-reasoner
        messages: body.messages,
        max_tokens: body.maxTokens || 600
      })
    });

    const data = await response.json();

    // 把 DeepSeek 的回答传回给你的网页
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}