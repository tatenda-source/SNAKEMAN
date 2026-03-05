"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle2, X, Info } from "lucide-react";
import { identifySnake } from "@/lib/api";
import type { IdentificationResult } from "@/lib/types";
import toast from "react-hot-toast";
import Link from "next/link";

const DANGER_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  CRITICAL: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.4)", text: "#FCA5A5", label: "CRITICAL" },
  HIGH: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.4)", text: "#FCD34D", label: "HIGH DANGER" },
  MEDIUM: { bg: "rgba(167,139,250,0.12)", border: "rgba(167,139,250,0.4)", text: "#C4B5FD", label: "MEDIUM RISK" },
  LOW: { bg: "rgba(220,38,38,0.12)", border: "rgba(220,38,38,0.4)", text: "#F87171", label: "LOW RISK" },
};

export default function IdentifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  });

  const handleIdentify = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const response = await identifySnake(file, context || undefined);
      setResult(response.result);
      if (response.result.danger_level === "CRITICAL") {
        toast.error("CRITICAL species detected. Do not approach!", { duration: 6000 });
      }
    } catch (e) {
      toast.error("Identification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const dc = result?.danger_level ? DANGER_COLORS[result.danger_level] : null;

  return (
    <div className="min-h-screen bg-void pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-green text-venom text-xs font-semibold tracking-widest uppercase mb-6">
            <Camera size={12} />
            AI Snake Identification
          </div>
          <h1 className="font-display text-5xl font-bold text-parchment mb-4">
            Identify Any Snake
          </h1>
          <p className="text-smoke text-lg max-w-lg mx-auto">
            Upload a clear photo. Our AI analyzes key features and identifies the species
            from Zimbabwe's 8 most common snakes in seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload panel */}
          <div className="space-y-4">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`relative rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden ${
                isDragActive
                  ? "border-venom bg-venom/5 dropzone-active"
                  : "border-forest-600 hover:border-venom/50 hover:bg-venom/3"
              }`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-void/80 flex items-center justify-center text-smoke hover:text-danger transition-colors"
                  >
                    <X size={15} />
                  </button>
                  <div className="absolute bottom-3 left-3 text-xs text-parchment/70 font-mono">
                    {file?.name}
                  </div>
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl glass-green flex items-center justify-center">
                    <Upload size={26} className="text-venom" />
                  </div>
                  <div className="text-center">
                    <p className="text-parchment font-medium mb-1">
                      {isDragActive ? "Drop it here" : "Drop a photo or click to upload"}
                    </p>
                    <p className="text-smoke text-sm">JPG, PNG, WEBP — Max 10MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Context input */}
            <div className="glass rounded-2xl p-4">
              <label className="text-xs text-smoke font-semibold tracking-wide uppercase block mb-2">
                Additional Context (optional)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g. 'Found in my garage in Harare, about 1 metre long, was hissing loudly...'"
                className="w-full bg-transparent text-parchment text-sm placeholder:text-smoke/40 resize-none outline-none leading-relaxed"
                rows={3}
              />
            </div>

            {/* CTA */}
            <button
              onClick={handleIdentify}
              disabled={!file || loading}
              className="w-full py-4 rounded-2xl bg-venom text-forest-950 font-bold text-sm tracking-wide flex items-center justify-center gap-3 hover:bg-venom-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed glow-green"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Analyzing...</>
              ) : (
                <><Camera size={18} /> Identify Snake</>
              )}
            </button>

            {/* Tips */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 text-venom text-xs font-semibold mb-3">
                <Info size={13} /> Photo Tips for Best Results
              </div>
              <ul className="space-y-1.5 text-smoke text-xs">
                {[
                  "Ensure the snake is clearly visible and in focus",
                  "Capture the head, body pattern, and full length if possible",
                  "Good lighting — avoid dark or blurry photos",
                  "Multiple angles help (send your clearest shot)",
                  "Keep a safe distance — never approach to photograph",
                ].map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="text-venom/50">→</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Results panel */}
          <div>
            {!result && !loading && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center glass rounded-3xl p-12">
                  <div className="w-20 h-20 rounded-3xl glass-green flex items-center justify-center mx-auto mb-5">
                    <Camera size={32} className="text-venom/50" />
                  </div>
                  <p className="text-smoke text-sm">Upload a photo to see the identification result here.</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center glass rounded-3xl p-12">
                  <Loader2 size={40} className="text-venom animate-spin mx-auto mb-5" />
                  <p className="text-parchment font-medium mb-1">Analyzing image...</p>
                  <p className="text-smoke text-sm">Claude AI is examining key features</p>
                </div>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {/* Main result card */}
                <div
                  className="rounded-3xl p-6 border relative overflow-hidden"
                  style={dc ? { background: dc.bg, borderColor: dc.border } : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
                >
                  {/* Identification status */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      {result.identified ? (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 size={16} style={{ color: dc?.text }} />
                            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: dc?.text }}>
                              {dc?.label} — {result.confidence_label} Confidence
                            </span>
                          </div>
                          <h2 className="font-display text-3xl font-bold text-parchment">
                            {result.common_name}
                          </h2>
                          <p className="text-smoke text-sm italic">{result.scientific_name}</p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle size={16} className="text-warning" />
                            <span className="text-xs font-semibold text-warning tracking-wide uppercase">
                              {result.is_snake ? "Unknown Species" : "No Snake Detected"}
                            </span>
                          </div>
                          <p className="text-parchment font-medium">
                            {result.is_snake
                              ? "Could not match to our 8 Zimbabwe species database."
                              : "No snake detected in this image."}
                          </p>
                        </>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-display font-bold" style={{ color: dc?.text }}>
                        {Math.round(result.confidence * 100)}%
                      </div>
                      <div className="text-smoke text-xs">confidence</div>
                    </div>
                  </div>

                  {/* Immediate action */}
                  <div className="bg-black/20 rounded-2xl p-4 mb-4">
                    <div className="text-xs font-semibold text-smoke uppercase tracking-wide mb-1.5">
                      Immediate Action
                    </div>
                    <p className="text-parchment text-sm leading-relaxed">{result.immediate_action}</p>
                  </div>

                  {/* Visible features */}
                  {result.visible_features?.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-smoke uppercase tracking-wide mb-2">
                        Features Identified
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {result.visible_features.map((f) => (
                          <span
                            key={f}
                            className="text-xs px-2.5 py-1 rounded-full"
                            style={{ background: "rgba(255,255,255,0.06)", color: "#D1FAE5" }}
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Analysis reasoning */}
                <div className="glass rounded-2xl p-5">
                  <div className="text-xs font-semibold text-smoke uppercase tracking-wide mb-2">
                    AI Reasoning
                  </div>
                  <p className="text-parchment/80 text-sm leading-relaxed">{result.reasoning}</p>
                </div>

                {/* Full species data */}
                {result.snake_data && (
                  <>
                    <div className="glass rounded-2xl p-5 space-y-3">
                      <div className="text-xs font-semibold text-smoke uppercase tracking-wide mb-3">
                        First Aid Protocol
                      </div>
                      <p className="text-parchment/80 text-sm leading-relaxed">{result.snake_data.first_aid}</p>
                      {result.snake_data.antivenom_available && (
                        <div className="flex items-center gap-2 text-venom text-xs">
                          <CheckCircle2 size={12} /> Antivenom available at major hospitals
                        </div>
                      )}
                    </div>

                    {result.danger_level === "CRITICAL" && (
                      <Link
                        href="/emergency"
                        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-danger text-white font-bold glow-red animate-glow-red"
                      >
                        <AlertTriangle size={18} />
                        ACTIVATE EMERGENCY
                      </Link>
                    )}
                  </>
                )}

                {/* Alternative matches */}
                {result.alternative_matches?.length > 0 && (
                  <div className="glass rounded-2xl p-5">
                    <div className="text-xs font-semibold text-smoke uppercase tracking-wide mb-3">
                      Other Possible Matches
                    </div>
                    <div className="space-y-2">
                      {result.alternative_matches.slice(0, 2).map((alt) => (
                        <div key={alt.snake_id} className="flex justify-between items-center text-sm">
                          <span className="text-parchment/70">{alt.common_name}</span>
                          <span className="text-smoke text-xs">{Math.round(alt.confidence * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
