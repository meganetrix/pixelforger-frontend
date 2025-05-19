'use client';

import { useState } from 'react';

export default function ResumePage() {
  // We don’t actually use result yet, so disable the ESLint rule:
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [result, setResult] = useState<string | null>(null);

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold">AI Résumé Builder</h1>
      <p className="mt-4">
        If you see this, the JSX is compiling fine.
      </p>
    </main>
  );
}
