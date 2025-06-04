import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import { Configuration, OpenAIApi } from 'npm:openai@4.28.0';
import { getAuth } from 'npm:firebase-admin/auth';
import { initializeApp } from 'npm:firebase-admin/app';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Firebase Admin
initializeApp();

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAIApi(new Configuration({ apiKey: openaiApiKey }));

const systemPrompt = `You are an empathetic AI therapist focused on workplace wellbeing. Your goal is to:
- Listen actively and validate feelings
- Help identify workplace stressors
- Suggest practical coping strategies
- Maintain a professional, supportive tone
- Focus on work-related challenges
- Never give medical advice
- Encourage professional help when needed

If someone expresses serious mental health concerns, always recommend speaking with a qualified mental health professional.`;

Deno.serve(async (req) => {
  try {
    // Handle CORS
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Verify Firebase token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401 });
    }

    try {
      const token = authHeader.split('Bearer ')[1];
      await getAuth().verifyIdToken(token);
    } catch (error) {
      return new Response('Invalid token', { status: 401 });
    }

    const { messages } = await req.json();

    // Store chat in Supabase
    const { data: chatData, error: chatError } = await supabase
      .from('chats')
      .insert([{ messages }])
      .select();

    if (chatError) {
      console.error('Error storing chat:', chatError);
    }

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg: any) => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }))
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const response = completion.choices[0].message?.content || 'I apologize, but I am unable to respond at the moment.';

    // Store response in Supabase
    await supabase
      .from('chats')
      .update({ response })
      .eq('id', chatData?.[0]?.id);

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});