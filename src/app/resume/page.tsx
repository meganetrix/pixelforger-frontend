'use client';

import { useState } from 'react';

export default function ResumeBuilder() {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [bullets, setBullets] = useState('');
  const [industry, setIndustry] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

Rewrite these bullets into an executive-level, achievement-focused résumé section for ${name} (${title}) targeting ${industry}.
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
          <h2 className="text-2xl font-semibold">Your AI-Generated Résumé</h2>
          <div className="whitespace-pre-wrap bg-gray-100 p-4 rounded mt-2">
            {result}
          </div>
          {import html2pdf from 'html2pdf.js';
// ...
<button
  className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
  onClick={() => {
    const element = document.getElementById('resume-output');
    if (element) {
      html2pdf().from(element).save(`${name}-resume.pdf`);
    }
  }}
>
  Download PDF
</button>

// Wrap your result in:
<div id="resume-output" className="whitespace-pre-wrap bg-gray-100 p-4 rounded mt-2">
  {result}
</div>
}
        </section>
      )}
    </main>
  );
}
