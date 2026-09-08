import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Server, 
  FileJson, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Terminal, 
  Copy, 
  Check,
  ShieldCheck,
  HardDrive,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { DatabaseStats } from '../../types';
import { 
  getDatabaseStats, 
  exportFullDatabaseJSON, 
  importFullDatabaseJSON, 
  resetFullDatabase 
} from '../../data/adminStore';

interface DatabaseTabProps {
  onRefresh: () => void;
}

export const DatabaseTab: React.FC<DatabaseTabProps> = ({ onRefresh }) => {
  const [stats, setStats] = useState<DatabaseStats>(getDatabaseStats());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [jsonViewerOpen, setJsonViewerOpen] = useState(false);
  const [rawJsonData, setRawJsonData] = useState('');

  useEffect(() => {
    setStats(getDatabaseStats());
  }, []);

  const handleExport = () => {
    try {
      const jsonString = exportFullDatabaseJSON();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `royal-concepts-db-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setStatusMsg({ text: 'Database snapshot exported & downloaded successfully!' });
      setTimeout(() => setStatusMsg(null), 4000);
    } catch (err: any) {
      setStatusMsg({ text: `Export failed: ${err.message}`, isError: true });
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (!content) return;

      const result = importFullDatabaseJSON(content);
      if (result.success) {
        setStats(getDatabaseStats());
        onRefresh();
        setStatusMsg({ 
          text: `Database restored successfully! (${Object.entries(result.recordCounts || {})
            .map(([k, v]) => `${v} ${k}`)
            .join(', ')})` 
        });
      } else {
        setStatusMsg({ text: result.message, isError: true });
      }
      setTimeout(() => setStatusMsg(null), 5000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('CRITICAL: Reset all database collections (inquiries, equipment, projects, services, pictures, settings) to factory defaults?')) {
      resetFullDatabase();
      setStats(getDatabaseStats());
      onRefresh();
      setStatusMsg({ text: 'Full database has been reset to factory seed state.' });
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenJsonViewer = () => {
    setRawJsonData(exportFullDatabaseJSON());
    setJsonViewerOpen(true);
  };

  const kbSize = (stats.storageSizeBytes / 1024).toFixed(2);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Database className="w-6 h-6 text-[#2563EB]" />
            <span>RoyalDB Engine & Vercel Deployment</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time client-side database management, full JSON backup/restore engine, and zero-config Vercel push instructions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenJsonViewer}
            className="px-3.5 py-2 rounded-xl bg-[#1A1C20] hover:bg-[#252830] text-neutral-300 hover:text-white border border-[#2E323B] text-xs font-bold transition flex items-center gap-1.5"
          >
            <FileJson className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Inspect JSON DB</span>
          </button>

          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-[#2563EB]/25"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export DB (.json)</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMsg && (
        <div className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold animate-fade-in ${
          statusMsg.isError 
            ? 'bg-red-500/20 text-red-400 border-red-500/40' 
            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
        }`}>
          {statusMsg.isError ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* SECTION 1: Vercel Push & Deployment Hub */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F1115] via-[#1A1C20] to-[#121316] border border-[#2E323B] space-y-5 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-[#2E323B] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black border border-white/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 116 100" fill="currentColor">
                <polygon points="58 0 116 100 0 100" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#00F0FF] font-bold">
                PRODUCTION DEPLOYMENT
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                Pushing & Deploying to Vercel
              </h2>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            vercel.json ready in root
          </span>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed">
          Your application includes a pre-configured <code className="text-[#00F0FF] font-mono bg-black/40 px-1 py-0.5 rounded">vercel.json</code> and serverless API endpoints in <code className="text-[#00F0FF] font-mono bg-black/40 px-1 py-0.5 rounded">/api</code>. Follow either of these 2 simple methods to deploy to Vercel in seconds:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Option A: GitHub 1-Click */}
          <div className="p-4 rounded-xl bg-[#121316] border border-[#2E323B] space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-mono text-[10px] font-bold">
                1
              </span>
              <h3 className="font-bold text-white">Method A: Connect via GitHub (Recommended)</h3>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-neutral-300 font-sans leading-relaxed pl-1">
              <li>In AI Studio top-right menu, click <strong>Settings</strong> &gt; <strong>Export to GitHub</strong>.</li>
              <li>Open <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-[#00F0FF] hover:underline">vercel.com/new</a> and select your exported GitHub repository.</li>
              <li>Vercel will auto-detect the <strong>Vite</strong> framework and <code className="font-mono text-[11px]">dist</code> output directory.</li>
              <li>Under <em>Environment Variables</em>, add <code className="font-mono text-[11px] text-[#FFE600]">GEMINI_API_KEY</code> (optional for voice AI).</li>
              <li>Click <strong>Deploy</strong>! Your site is live on a global CDN.</li>
            </ol>
          </div>

          {/* Option B: Vercel CLI */}
          <div className="p-4 rounded-xl bg-[#121316] border border-[#2E323B] space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-700 text-white flex items-center justify-center font-mono text-[10px] font-bold">
                2
              </span>
              <h3 className="font-bold text-white">Method B: Direct Push via Vercel CLI</h3>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              If deploying from your terminal or command prompt:
            </p>
            <div className="p-2.5 rounded-lg bg-black font-mono text-[11px] text-neutral-300 flex items-center justify-between border border-[#2E323B]">
              <code>npx vercel --prod</code>
              <button
                onClick={() => handleCopy('npx vercel --prod', 'cli')}
                className="text-neutral-400 hover:text-white p-1 rounded"
              >
                {copiedCode === 'cli' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              Vercel reads our custom <code className="text-[#00F0FF]">vercel.json</code> rewrites automatically.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Database Telemetry & Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-4 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-1">
          <span className="font-mono text-[10px] uppercase text-neutral-400">Inquiries</span>
          <div className="text-2xl font-black text-white font-mono">{stats.totalInquiries}</div>
          <span className="text-[10px] text-neutral-500">Quotes & Leads</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-1">
          <span className="font-mono text-[10px] uppercase text-neutral-400">Services</span>
          <div className="text-2xl font-black text-[#2563EB] font-mono">{stats.totalServices}</div>
          <span className="text-[10px] text-neutral-500">Pillars Editable</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-1">
          <span className="font-mono text-[10px] uppercase text-neutral-400">Pictures</span>
          <div className="text-2xl font-black text-[#00F0FF] font-mono">{stats.totalPictures}</div>
          <span className="text-[10px] text-neutral-500">Media Library</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-1">
          <span className="font-mono text-[10px] uppercase text-neutral-400">Projects</span>
          <div className="text-2xl font-black text-[#FFE600] font-mono">{stats.totalProjects}</div>
          <span className="text-[10px] text-neutral-500">Portfolio builds</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-1 col-span-2 sm:col-span-1">
          <span className="font-mono text-[10px] uppercase text-neutral-400">Storage Size</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">{kbSize} KB</div>
          <span className="text-[10px] text-neutral-500">Client Key-Value DB</span>
        </div>
      </div>

      {/* SECTION 3: Database Tools (Backup & Restore) */}
      <div className="p-6 rounded-2xl bg-[#1A1C20] border border-[#2E323B] space-y-5 shadow-xl">
        <div className="border-b border-[#2E323B] pb-3">
          <span className="text-[10px] font-mono uppercase text-[#2563EB] font-bold">
            DATA PERSISTENCE & PORTABILITY
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Database Backup, Restore & Reset
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Download your full database to preserve changes across browser sessions, or restore from any previous backup file.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Action 1: Export */}
          <div className="p-4 rounded-xl bg-[#121316] border border-[#2E323B] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                <Download className="w-4 h-4 text-[#2563EB]" />
                <span>Export Snapshot</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Downloads a clean formatted JSON file containing all inquiries, equipment, portfolio, services, and media pictures.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="w-full py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup</span>
            </button>
          </div>

          {/* Action 2: Import / Restore */}
          <div className="p-4 rounded-xl bg-[#121316] border border-[#2E323B] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Restore Database</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Select a previously exported JSON backup file to overwrite and restore all tables instantly.
              </p>
            </div>
            <label className="w-full py-2 bg-[#1A1C20] hover:bg-[#252830] text-neutral-300 hover:text-white border border-[#2E323B] rounded-xl font-bold transition flex items-center justify-center gap-1.5 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Select File to Restore</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>

          {/* Action 3: Factory Reset */}
          <div className="p-4 rounded-xl bg-[#121316] border border-[#2E323B] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center gap-2 text-white font-bold mb-1">
                <RotateCcw className="w-4 h-4 text-red-400" />
                <span>Factory Reset</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Purges custom modifications and re-seeds the 28 default inquiries, 15 equipment items, 5 services, and media photos.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 rounded-xl font-bold transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Database</span>
            </button>
          </div>
        </div>
      </div>

      {/* JSON Viewer Modal */}
      {jsonViewerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[85vh] rounded-2xl bg-[#1A1C20] border border-[#2E323B] p-6 space-y-4 shadow-2xl flex flex-col animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#2E323B] pb-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-5 h-5 text-[#2563EB]" />
                <h2 className="text-base font-bold text-white">
                  Live RoyalDB JSON Payload
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(rawJsonData, 'json-modal')}
                  className="px-3 py-1.5 bg-[#121316] border border-[#2E323B] hover:text-white text-neutral-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5"
                >
                  {copiedCode === 'json-modal' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'json-modal' ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={() => setJsonViewerOpen(false)}
                  className="text-neutral-400 hover:text-white text-lg font-mono font-bold px-2"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto rounded-xl bg-black p-4 border border-[#2E323B] font-mono text-[11px] text-emerald-400 leading-relaxed no-scrollbar">
              <pre>{rawJsonData}</pre>
            </div>

            <div className="flex items-center justify-end">
              <button
                onClick={() => setJsonViewerOpen(false)}
                className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
