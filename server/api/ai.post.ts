import OpenAI from "openai"

export default defineEventHandler(async (event) => {

  const body = await readBody(event);
  
  const {OPENAI_API_KEY} = useRuntimeConfig();

  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      messages: body.messages || [],
      temperature: body.temperature || 1,
      model: "gpt-4o",
    });

    return completion;
})
