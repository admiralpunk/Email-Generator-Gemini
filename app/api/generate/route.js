import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req) {
  try {
    const { recipientName, emailPurpose, keyPoints } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Write a professional email with the following details:
      - Recipient: ${recipientName}
      - Purpose: ${emailPurpose}
      - Key Points to Include: ${keyPoints}
      
      The email should be formal, concise, and well-structured. Include a proper greeting, body, and closing.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return Response.json({ email: text });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}