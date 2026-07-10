import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, ScanLine, Check, Plus, RotateCcw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { Badge } from '../components/ui/Badge';
import { AnimatedCounter } from '../components/ui/AnimatedCounter';

interface ScanResult {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  ingredients: string[];
}

const mockScanResult: ScanResult = {
  name: 'Mediterranean Grain Bowl',
  calories: 520,
  protein: 28,
  carbs: 62,
  fat: 18,
  confidence: 96,
  ingredients: ['Quinoa', 'Chickpeas', 'Cucumber', 'Feta', 'Olive Oil', 'Cherry Tomatoes'],
};

export function FoodScannerPage() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    simulateScan();
  };

  const simulateScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      setScanning(false);
      setResult(mockScanResult);
    }, 2500);
  };

  const handleReset = () => {
    setPreview(null);
    setResult(null);
    setScanning(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        badge="AI Vision"
        title="Food Scanner"
        subtitle="Point your camera at any meal. Our AI identifies ingredients and calculates nutrition instantly."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner area */}
        <Card className="p-0 overflow-hidden min-h-[400px] flex flex-col">
          <div className="relative flex-1 flex items-center justify-center bg-[rgba(0,0,0,0.3)] min-h-[320px]">
            {preview ? (
              <img src={preview} alt="Food preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="text-center space-y-4 p-8">
                <div className="w-20 h-20 rounded-3xl bg-[rgba(46,204,154,0.1)] flex items-center justify-center mx-auto glow-emerald">
                  <ScanLine className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <p className="text-[var(--color-text-body)]">Upload or capture a photo of your meal</p>
              </div>
            )}

            {/* Scan overlay animation */}
            <AnimatePresence>
              {scanning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center"
                >
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 border-2 border-[var(--color-accent)] rounded-2xl" />
                    <motion.div
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                      className="absolute left-0 right-0 h-0.5 bg-[var(--color-accent)] shadow-[0_0_20px_var(--color-accent)]"
                    />
                    <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-sm text-[var(--color-accent)] whitespace-nowrap">
                      Analyzing...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {result && !scanning && (
              <div className="absolute top-4 right-4">
                <Badge variant="success">
                  <Check className="w-3 h-3" />
                  {result.confidence}% match
                </Badge>
              </div>
            )}
          </div>

          <div className="p-6 flex gap-3 border-t border-[var(--color-border-subtle)]">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <Button variant="secondary" className="flex-1" onClick={() => fileRef.current?.click()} disabled={scanning}>
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <Button className="flex-1" onClick={() => fileRef.current?.click()} disabled={scanning}>
              <Camera className="w-4 h-4" />
              Capture
            </Button>
            {(preview || result) && (
              <Button variant="ghost" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card glow className="p-6">
                  <h3 className="text-2xl font-display font-light text-[var(--color-text-page-title)] mb-2">
                    {result.name}
                  </h3>
                  <p className="text-[var(--color-text-meta)] text-sm mb-6">Detected ingredients and estimated nutrition</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Calories', value: result.calories, unit: ' kcal' },
                      { label: 'Protein', value: result.protein, unit: 'g' },
                      { label: 'Carbs', value: result.carbs, unit: 'g' },
                      { label: 'Fat', value: result.fat, unit: 'g' },
                    ].map((m) => (
                      <div key={m.label} className="glass rounded-xl p-4 text-center">
                        <span className="label-caps mb-1 block">{m.label}</span>
                        <div className="text-2xl font-display font-light text-[var(--color-text-page-title)]">
                          <AnimatedCounter value={m.value} suffix={m.unit} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-6">
                    <span className="label-caps mb-3 block">Ingredients</span>
                    <div className="flex flex-wrap gap-2">
                      {result.ingredients.map((ing) => (
                        <Badge key={ing} variant="accent">{ing}</Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full justify-center">
                    <Plus className="w-4 h-4" />
                    Add to meal log
                  </Button>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <Card className="p-8 text-center">
                  <ScanLine className="w-10 h-10 text-[var(--color-text-meta)] mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-display font-light text-[var(--color-text-page-title)] mb-2">
                    Ready to scan
                  </h3>
                  <p className="text-[14px] text-[var(--color-text-body)] leading-relaxed">
                    Upload a photo or use your camera. Our AI will identify the food and calculate macros in seconds.
                  </p>
                </Card>

                <Card className="p-6">
                  <span className="label-caps mb-4 block">Tips for best results</span>
                  <ul className="space-y-3 text-[14px] text-[var(--color-text-body)]">
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-accent)] mt-0.5">•</span>
                      Capture the full plate from above for accurate portion detection
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-accent)] mt-0.5">•</span>
                      Ensure good lighting — natural light works best
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[var(--color-accent)] mt-0.5">•</span>
                      Include all components of mixed dishes in frame
                    </li>
                  </ul>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
