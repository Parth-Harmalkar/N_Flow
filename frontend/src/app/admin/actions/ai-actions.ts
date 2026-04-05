'use server'

import { createClient } from '@/utils/supabase/server'
import { getEmployeeDetailMetrics } from '@/lib/analytics'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generatePerformanceSummary(userId: string) {
  const supabase = await createClient()

  // 1. Verify Admin status
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  // 2. Fetch User Data
  const { logs, tasks } = await getEmployeeDetailMetrics(userId)
  
  // 3. Format Data for Prompt
  const context = {
    logs: logs.slice(0, 10).map(l => ({
      desc: l.description,
      duration: (new Date(l.end_time).getTime() - new Date(l.start_time).getTime()) / (1000 * 60 * 60),
      is_duplicate: l.is_duplicate
    })),
    tasks: tasks.map(t => ({
      title: t.title,
      status: t.status,
      priority: t.priority
    }))
  }

  // 4. Generate Summary with OpenAI
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI Performance Auditor for N-Flow, a high-productivity firm. Your tone is professional, analytical, and objective. Provide a performance summary based on factual logs."
        },
        {
          role: "user",
          content: `Analyze the following activity logs and assigned tasks for this employee. Generate a structured performance summary in Markdown format.

Context Data:
${JSON.stringify(context, null, 2)}

Requirements:
1. Provide an 'Efficiency Score' (0-100).
2. Highlight 'Key Achievements' based on completed tasks.
3. Identify 'Risk Factors' (e.g., duplicate proof, low hours, pending urgent tasks).
4. Suggest 'Actionable Recommendations'.
5. Use clean Markdown headers and bullet points.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    return { 
      summary: response.choices[0].message.content,
      tokensUsed: response.usage?.total_tokens 
    }
  } catch (error: any) {
    console.error('OpenAI Error:', error)
    return { error: 'Failed to generate AI summary. Ensure OpenAI API key is configured correctly.' }
  }
}
