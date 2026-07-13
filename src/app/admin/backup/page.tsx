'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { backupAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function BackupPage() {
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await backupAPI.export();
      setMessage({ type: 'success', text: 'نسخه پشتیبان با موفقیت دانلود شد' });
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'خطا در تهیه نسخه پشتیبان' });
    } finally { setLoading(false); }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setMessage(null);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.data) throw new Error('فرمت فایل پشتیبان نامعتبر است');
      const result = await backupAPI.import(data.data);
      setMessage({ type: 'success', text: result.message || 'داده‌ها با موفقیت بازیابی شدند' });
    } catch (err: unknown) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'خطا در بازیابی داده‌ها' });
    } finally { setImporting(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  return (<div className="space-y-4 sm:space-y-6">
    <div><h1 className="text-xl sm:text-2xl font-bold text-navy mb-2 dark:text-cream flex items-center gap-2"><Shield className="w-5 h-5 sm:w-6 sm:h-6 text-beige" />پشتیبان‌گیری و بازیابی</h1><p className="text-sm text-navy/50 dark:text-beige-light">دانلود و آپلود نسخه پشتیبان کامل داده‌ها</p></div>

    {message && (
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
        {message.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
        {message.text}
      </motion.div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
      {/* Export */}
      <Card className="p-6">
        <div className="text-center">
          <Download className="w-12 h-12 text-sky mx-auto mb-4" />
          <h2 className="text-lg font-bold text-navy mb-2 dark:text-cream">دانلود نسخه پشتیبان</h2>
          <p className="text-sm text-navy/50 dark:text-beige-light mb-6">تمام اطلاعات پروژه‌ها، یاقوت‌ها، وسایل کارگاه و قرض‌ها در یک فایل JSON</p>
          <Button onClick={handleExport} loading={loading} className="w-full"><Download className="w-4 h-4" />دانلود فایل پشتیبان</Button>
        </div>
      </Card>

      {/* Import */}
      <Card className="p-6">
        <div className="text-center">
          <Upload className="w-12 h-12 text-beige mx-auto mb-4" />
          <h2 className="text-lg font-bold text-navy mb-2 dark:text-cream">بازیابی از فایل پشتیبان</h2>
          <p className="text-sm text-navy/50 dark:text-beige-light mb-6">آپلود فایل JSON قبلی برای بازیابی تمام داده‌ها</p>
          <input type="file" ref={fileInputRef} accept=".json" onChange={handleImport} className="hidden" />
          <div className="p-4 rounded-xl bg-ruby/5 border border-ruby/20 mb-4">
            <p className="text-xs text-ruby dark:text-ruby-glow flex items-center gap-1 justify-center"><AlertTriangle className="w-3 h-3" />هشدار: این عملیات تمام داده‌های فعلی را حذف و با داده‌های فایل جایگزین می‌کند</p>
          </div>
          <Button onClick={() => fileInputRef.current?.click()} loading={importing} variant="danger" className="w-full"><Upload className="w-4 h-4" />آپلود و بازیابی</Button>
        </div>
      </Card>
    </div>
  </div>);
}
