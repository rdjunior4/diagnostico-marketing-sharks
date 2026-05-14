const BREVO_API_URL = 'https://api.brevo.com/v3';

async function brevoRequest(endpoint: string, method: string, body?: any) {
  const res = await fetch(`${BREVO_API_URL}${endpoint}`, {
    method,
    headers: {
      'api-key': process.env.BREVO_API_KEY || '',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`Brevo API error [${res.status}]:`, err);
    return null;
  }
  return res.status === 204 ? true : res.json();
}

export async function createBrevoAttributes() {
  const attributes = [
    { category: 'normal', name: 'QUIZ_SCORE', type: 'number' },
    { category: 'normal', name: 'MATURITY_LEVEL', type: 'text' },
    { category: 'normal', name: 'MATURITY_SHARK', type: 'text' },
    { category: 'normal', name: 'COMPANY_NAME', type: 'text' },
    { category: 'normal', name: 'CNPJ', type: 'text' },
    { category: 'normal', name: 'SEGMENT', type: 'text' },
    { category: 'normal', name: 'QUIZ_DATE', type: 'date' },
  ];

  for (const attr of attributes) {
    await brevoRequest(
      `/contacts/attributes/${attr.category}/${attr.name}`,
      'POST',
      { type: attr.type }
    );
  }
}

export async function syncLeadToBrevo(lead: {
  email: string;
  companyName: string;
  cnpj: string;
  respondentName: string;
  phone: string;
  segment: string;
  generalScore: number;
  maturityLevel: string;
  maturityShark: string;
}) {
  if (!lead.email) return null;

  const attributes: Record<string, any> = {
    FNAME: lead.respondentName.split(' ')[0],
    LNAME: lead.respondentName.split(' ').slice(1).join(' ') || ' ',
    COMPANY_NAME: lead.companyName,
    CNPJ: lead.cnpj,
    SEGMENT: lead.segment,
    QUIZ_SCORE: lead.generalScore,
    MATURITY_LEVEL: lead.maturityLevel,
    MATURITY_SHARK: lead.maturityShark,
    QUIZ_DATE: new Date().toISOString().split('T')[0],
    SMS: lead.phone ? `+55${lead.phone}` : undefined,
  };

  Object.keys(attributes).forEach(k => {
    if (attributes[k] === undefined || attributes[k] === null || attributes[k] === '') {
      delete attributes[k];
    }
  });

  const result = await brevoRequest('/contacts', 'POST', {
    email: lead.email,
    attributes,
    updateEnabled: true,
  });

  if (result) {
    console.log(`Brevo: lead ${lead.email} synced (ID: ${result.id})`);
  }

  return result;
}

export async function notifyCommercialByEmail(lead: {
  companyName: string;
  respondentName: string;
  email: string;
  phone: string;
  cnpj: string;
  segment: string;
  generalScore: number;
  maturityLevel: string;
  maturityShark: string;
}) {
  const commercialEmail = process.env.COMMERCIAL_EMAIL;
  if (!commercialEmail) return null;

  const scoreColor = lead.generalScore >= 70 ? '#25A7F0' : lead.generalScore >= 50 ? '#eab308' : '#ef4444';
  const today = new Date().toLocaleDateString('pt-BR');

  return brevoRequest('/smtp/email', 'POST', {
    sender: { email: commercialEmail, name: 'Diagnóstico Sharks' },
    to: [{ email: commercialEmail, name: 'Comercial Sharks' }],
    subject: `🦈 Novo diagnóstico: ${lead.companyName} — ${lead.maturityLevel} (${lead.generalScore}%)`,
    htmlContent: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#0A1018;color:#F4F7FB;border-radius:12px">
        <h1 style="color:#25A7F0;text-align:center;margin:0 0 4px">🦈 Diagnóstico Estratégico</h1>
        <p style="text-align:center;color:#BFC4CC/60;font-size:12px;margin:0 0 20px">${today}</p>
        <table style="width:100%;border-collapse:collapse">
          ${[
            ['Empresa', lead.companyName],
            ['CNPJ', lead.cnpj || '—'],
            ['Responsável', lead.respondentName],
            ['E-mail', lead.email || '—'],
            ...(lead.phone ? [['Telefone', lead.phone]] : []),
            ['Segmento', lead.segment || '—'],
            ['Score', `<span style="color:${scoreColor};font-size:20px;font-weight:bold">${lead.generalScore}%</span>`],
            ['Nível', `${lead.maturityLevel} (${lead.maturityShark})`],
          ].map(([label, value]) => `
            <tr>
              <td style="padding:6px 8px;color:#BFC4CC;font-size:13px;border-bottom:1px solid rgba(23,59,116,0.2)">${label}</td>
              <td style="padding:6px 8px;font-weight:bold;font-size:13px;border-bottom:1px solid rgba(23,59,116,0.2)">${value}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    `,
  });
}
