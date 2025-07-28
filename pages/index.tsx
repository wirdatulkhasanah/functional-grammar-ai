import { useState } from "react";

type AnalysisResult = {
  actor?: string;
  process?: string;
  goal?: string;
  [key: string]: unknown;
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data: AnalysisResult = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error analyzing text:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Functional Grammar Analyzer</h1>

      <textarea
        className="w-full h-28 border p-2 mb-4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a sentence..."
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={loading || !text}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
