import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' })
  }

  const body = req.body
  if (!body.page_url) {
    return res.status(400).json({ error: 'Missing page_url' })
  }

  const visit = {
    page_url: body.page_url,
    referrer: body.referrer || null,
    user_agent: body.user_agent || null,
    language: body.language || null,
    screen_width: body.screen_width || null,
    screen_height: body.screen_height || null,
    session_id: body.visitor_id || null,
    event_type: body.event_type || 'pageview',
    consent: !!body.consent
  }

  const { error } = await supabase.from('visits').insert([visit])

  if (error) {
    console.error(error)
    return res.status(500).json({ error: 'Database error' })
  }

  return res.status(201).json({ success: true })
}
