import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const { error } = await supabase
      .from('waitlist')
      .upsert({ email, created_at: new Date().toISOString() }, { onConflict: 'email' })

    if (error) throw error

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'GetFlatbed <deals@getflatbed.com>',
        to: [email],
        subject: 'Ya estás en la lista — GetFlatbed',
        html: '<div style="background:#0a0a0f;color:white;padding:48px 32px;font-family:Inter,sans-serif;max-width:600px;margin:0 auto"><h1 style="color:#F5C842;font-size:28px;margin-bottom:8px">Ya estás dentro!</h1><p style="color:#9CA3AF;font-size:16px;line-height:1.6">Bienvenido/a a GetFlatbed. Recibirás alertas cuando aparezcan ofertas de business class que valen la pena.</p><p style="color:#9CA3AF;font-size:16px;line-height:1.6">Los miembros <strong style="color:white">Explorer</strong> reciben las mejores ofertas con 48h de ventana. Con <strong style="color:#F5C842">Premium</strong> las recibirías en tiempo real.</p><div style="margin:32px 0"><a href="https://getflatbed.com/pricing" style="background:#F5C842;color:#000;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px">Ver planes</a></div><p style="color:#4B5563;font-size:13px">Sin spam, nunca. Cancela cuando quieras.</p></div>'
      })
    })

    return NextResponse.json({ ok: true })
  } catch (_err: unknown) {
    console.error("Waitlist error:", _err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
