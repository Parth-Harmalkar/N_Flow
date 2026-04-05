'use server'

import { createClient } from '@/utils/supabase/server'
import { getEmployeeDetailMetrics } from '@/lib/analytics'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "")

export async function generatePerformanceSummary(userId: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
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

  // 4. Generate Summary with Google Gemini
  try {
    const prompt = `Analyze the following activity logs and assigned tasks for this employee. Generate a structured performance summary in Markdown format.

Context Data:
${JSON.stringify(context, null, 2)}

Requirements:
1. Provide an 'Efficiency Score' (0-100).
2. Highlight 'Key Achievements' based on completed tasks.
3. Identify 'Risk Factors' (e.g., duplicate proof, low hours, pending urgent tasks).
4. Suggest 'Actionable Recommendations'.
5. Use clean Markdown headers and bullet points.
6. Tone: Professional, analytical, objective. You are an AI Performance Auditor for N-Flow.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    if (!text) {
      throw new Error('Gemini returned an empty response.')
    }

    return { 
      summary: text,
      // Gemini doesn't return tokens the same way OpenAI does in this simple call, 
      // but we'll leave the interface consistent if possible or just omit.
      tokensUsed: 0 
    }
  } catch (error: any) {
    console.error('Gemini AI Error:', error)
    return { error: 'Failed to generate AI summary. Ensure GOOGLE_GEMINI_API_KEY is configured correctly and Gemini API is accessible.' }
  }
}
