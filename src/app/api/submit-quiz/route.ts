import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { syncLeadToBrevo, notifyCommercialByEmail } from '@/lib/brevo';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      companyName, cnpj, respondentName, email, phone, segment,
      generalScore, maturityLevel, blockScores, swot, recommendations, rawAnswers,
    } = body;

    if (!companyName || !respondentName) {
      return NextResponse.json({ error: 'Nome da empresa e respondente são obrigatórios' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // --- 1. DETECÇÃO DE CNPJ DUPLICADO ---
    let leadId: number | null = null;
    let isDuplicate = false;

    if (cnpj) {
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id, lead_score, lead_status')
        .eq('cnpj', cnpj)
        .maybeSingle();

      if (existingLead) {
        leadId = existingLead.id;
        isDuplicate = true;
        await supabase
          .from('leads')
          .update({ last_contact_at: new Date().toISOString(), lead_score: Math.round(generalScore) })
          .eq('id', leadId);
      }
    }

    // --- 2. CRIAR NOVO LEAD ---
    if (!leadId) {
      const { data: newLead, error: leadError } = await supabase
        .from('leads')
        .insert({
          company_name: companyName,
          cnpj: cnpj || null,
          respondent_name: respondentName,
          email: email || null,
          phone: phone || null,
          segment: segment || null,
          lead_score: Math.round(generalScore),
          lead_status: 'new',
          source: 'quiz',
          first_contact_at: new Date().toISOString(),
          last_contact_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (leadError) {
        console.error('Lead insert error:', leadError);
        return NextResponse.json({ error: 'Erro ao criar lead' }, { status: 500 });
      }
      leadId = newLead.id;
    }

    // --- 3. SALVAR SUBMISSÃO ---
    const { data: submission, error: subError } = await supabase
      .from('quiz_submissions')
      .insert({
        lead_id: leadId,
        company_name: companyName,
        respondent_name: respondentName,
        email: email || null,
        segment: segment || null,
        general_score: Math.round(generalScore),
        maturity_level: maturityLevel?.name || null,
        maturity_shark: maturityLevel?.sharkName || null,
        block_scores: blockScores || [],
        swot: swot || [],
        recommendations: recommendations || [],
        raw_answers: rawAnswers || {},
        submitted_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (subError) {
      console.error('Submission error:', subError);
      return NextResponse.json({ error: 'Erro ao salvar resultado' }, { status: 500 });
    }

    // --- 4. SINCERONIZAR COM BREVO ---
    const leadData = {
      email: email || '',
      companyName,
      cnpj: cnpj || '',
      respondentName,
      phone: phone || '',
      segment: segment || '',
      generalScore: Math.round(generalScore),
      maturityLevel: maturityLevel?.name || '',
      maturityShark: maturityLevel?.sharkName || '',
    };

    // Tenta sincronizar com Brevo (não bloqueia se falhar)
    Promise.all([
      syncLeadToBrevo(leadData).catch(e => console.error('Brevo sync error:', e)),
      notifyCommercialByEmail(leadData).catch(e => console.error('Brevo email error:', e)),
    ]);

    // --- 5. AGENDAR NOTIFICAÇÃO (futuro) ---
    await supabase.from('email_queue').insert({
      lead_id: leadId,
      email_type: 'commercial_notification',
      recipient_email: process.env.COMMERCIAL_EMAIL || '',
      subject: `Novo diagnóstico: ${companyName}`,
      status: 'pending',
      metadata: {
        lead_id: leadId,
        submission_id: submission?.id,
        company_name: companyName,
        general_score: Math.round(generalScore),
        maturity: maturityLevel?.name,
      },
    }).maybeSingle();

    return NextResponse.json({
      success: true,
      lead_id: leadId,
      submission_id: submission?.id,
      is_duplicate: isDuplicate,
    });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
