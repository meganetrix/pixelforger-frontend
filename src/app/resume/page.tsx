'use client';
export const dynamic = 'force-dynamic';


import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResumeBuilder() {
  const [isPaid, setIsPaid] = useState(false);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bullets, setBullets] = useState('');
  const [industry, setIndustry] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1) Check for a Stripe session ID on load
  const params = useSearchParams();
  useEffect(() => {
    const sessionId = params.get('session_id');
    if (sessionId) {
      // In a real app, verify with your /api/verify-session route
      setIsPaid(true);
    }
  }, [params]);

  // 2) Kick off Stripe Checkout
  async function handlePurchase(tier: 'basic' | 'professional' | 'executive') {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ tier }),
    });
    const { url } = await res.json();
    window.location.href = url;
  }

  // 3) Once paid, render the résumé-builder form
  if (!isPaid) {
    return (
      <main className="max-w-lg mx-auto p-8 space-y-6">
        <h1 className="text-3xl font-bold">Choose Your Plan</h1>
        <button
          onClick={() => handlePurchase('basic')}
          className="w-full p-4 bg-gray-100 rounded"
        >
          Basic Résumé — $29
        </button>
        <button
          onClick={() => handlePurchase('professional')}
          className="w-full p-4 bg-gray-100 rounded"
        >
          Professional Résumé — $49
        </button>
        <button
          onClick={() => handlePurchase('executive')}
          className="w-full p-4 bg-gray-100 rounded"
        >
          Executive Résumé — $79
        </button>
      </main>
    );
  }

  // 4) Paid users see the form and PDF download
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const prompt = `
You are an expert résumé writer.
Name: ${name}
Current Title: ${title}
Industry: ${industry}
Bullets:
${bullets}

Rewrite these bullets into an executive‐level, achievement‐focused résumé section for ${name} (${title}) targeting ${industry}.
`;
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, model: 'gpt-4o-mini' }),
    });
    const data = await res.json();
    setResult(data.text);
    setLoading(false);
  }

  return (
    <main className="max-w-2xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">AI Résumé Builder</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          required
          placeholder="Current Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          required
          placeholder="Target Industry"
          value={industry}
          onChange={e => setIndustry(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          required
          placeholder="Enter bullet points, one per line"
          value={bullets}
          onChange={e => setBullets(e.target.value)}
          className="w-full p-2 border rounded h-32"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Building…' : 'Generate Résumé'}
        </button>
      </form>

      {result && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Your AI‐Generated Résumé</h2>
          <div
            id="resume-output"
            className="whitespace-pre-wrap bg-gray-100 p-4 rounded mt-2"
          >
            {result}
          </div>
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            onClick={() => {
              import('html2pdf.js').then(html2pdf => {
                html2pdf()
                  .from(document.getElementById('resume-output')!)
                  .save(`${name}-resume.pdf`);
              });
            }}
          >
            Download PDF
          </button>
        </section>
      )}
    </main>
  );
}
