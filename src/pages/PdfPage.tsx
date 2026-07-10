import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

export function PdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const { user } = useAuthStore();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setExtracted(false);
    }
  };

  const processFile = () => {
    if (!file || !user) return;
    setUploading(true);
    
    // Simulate upload and extraction
    setTimeout(() => {
      setUploading(false);
      setExtracted(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">PDF AI</h1>
        <p className="text-[var(--color-text-body)]">Upload documents to generate summaries, notes, and study guides.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 flex flex-col items-center justify-center text-center min-h-[400px] border-dashed border-2 border-[var(--color-border-subtle)] bg-[rgba(255,255,255,0.01)]">
          {!file ? (
            <>
              <div className="w-16 h-16 rounded-full bg-[rgba(139,92,246,0.1)] flex items-center justify-center mb-6">
                <UploadCloud className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Upload a PDF</h3>
              <p className="text-[var(--color-text-meta)] mb-8 max-w-xs">Drag and drop your document here, or click to browse files.</p>
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                id="pdf-upload" 
                onChange={handleUpload}
              />
              <label htmlFor="pdf-upload">
                <span className="inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 h-10 px-4 py-2 text-[15px] bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dark)] text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_24px_rgba(139,92,246,0.5)] cursor-pointer">
                  Select File
                </span>
              </label>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-6">
                <FileText className="w-8 h-8 text-[var(--color-accent)]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{file.name}</h3>
              <p className="text-[var(--color-text-meta)] mb-8">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              
              {!extracted ? (
                <div className="flex gap-4">
                  <Button variant="secondary" onClick={() => setFile(null)} disabled={uploading}>Cancel</Button>
                  <Button onClick={processFile} disabled={uploading}>
                    {uploading ? 'Processing...' : 'Process Document'}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-[var(--color-success)]">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Extraction Complete</span>
                  </div>
                  <Button onClick={() => window.location.href = '/app/assistant'} className="mt-4">
                    Open in Assistant
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Recent Documents</h3>
          <div className="space-y-3">
            {[
              { name: 'Introduction to Physics.pdf', date: '2 days ago', size: '2.4 MB' },
              { name: 'Syllabus Fall 2024.pdf', date: 'Last week', size: '0.8 MB' }
            ].map((doc, i) => (
              <Card key={i} className="p-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.05)] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded bg-[rgba(255,255,255,0.05)] text-[var(--color-text-meta)] group-hover:text-[var(--color-accent)] transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-[var(--color-text-page-title)]">{doc.name}</h4>
                    <p className="text-[12px] text-[var(--color-text-meta)]">{doc.size} • {doc.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">View</Button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
