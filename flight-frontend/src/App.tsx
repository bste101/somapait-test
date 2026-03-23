import { useState } from 'react';
import InitialPage from './components/initial/InitialPage';
import ResultPage from './components/result/ResultPage';
import type { UploadResponse } from './model/passenger';

export default function App() {
  const [result, setResult] = useState<UploadResponse | null>(null);

  return (
    <div style={{ padding: 24 }}>
      {result === null ? (
        <InitialPage onSuccess={setResult} />
      ) : (
          <ResultPage result={result} onCancel={() => setResult(null)} />
      )}
    </div>
  );
}