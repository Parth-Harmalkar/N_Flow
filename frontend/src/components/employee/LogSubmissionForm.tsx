'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle2, Loader2, Clock, FileText, Camera } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { submitWorkLog, getAssignedTasks } from '@/app/employee/actions/logs';

interface LogSubmissionFormProps {
  onSuccess?: () => void;
}

export default function LogSubmissionForm({ onSuccess }: LogSubmissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    task_id: '',
    start_time: '',
    end_time: '',
    description: ''
  });

  useEffect(() => {
    getAssignedTasks().then(setTasks).catch(console.error);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const generateHash = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Please upload proof of work');

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // 1. Generate Hash
      const hash = await generateHash(file);

      // 2. Upload to Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('logs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // 3. Submit Record
      await submitWorkLog({
        ...formData,
        proof_url: uploadData.path,
        file_hash: hash
      });

      alert('Work log submitted successfully!');
      setFile(null);
      setFormData({
        task_id: '',
        start_time: '',
        end_time: '',
        description: ''
      });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Failed to submit log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center justify-center gap-3">
          <Camera className="w-8 h-8 text-brand-pink" />
          Log Productivity
        </h2>
        <p className="text-slate-500 font-medium">Record your progress and upload evidence for review.</p>
      </header>

      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Mission Objective
            </label>
            <select
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all appearance-none font-bold"
              value={formData.task_id}
              onChange={(e) => setFormData({ ...formData, task_id: e.target.value })}
            >
              <option value="" className="text-slate-400">Select an active assignment</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Commencement
              </label>
              <input
                required
                type="datetime-local"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all font-bold"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                Completion
              </label>
              <input
                required
                type="datetime-local"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all font-bold"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Work Narrative
            </label>
            <textarea
              required
              placeholder="Detail your accomplishments during this window..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-purple/5 focus:border-brand-purple/30 transition-all min-h-[140px] resize-none placeholder:text-slate-300 font-medium"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              Evidence of Impact (Image/PDF)
            </label>
            <div 
              className={`relative border-2 border-dashed rounded-[2rem] p-10 flex flex-col items-center justify-center transition-all ${
                file ? 'border-brand-pink/50 bg-brand-pink/5' : 'border-slate-100 hover:border-brand-purple/30 bg-slate-50/50'
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-brand-pink/10 rounded-2xl">
                    <CheckCircle2 className="w-10 h-10 text-brand-pink" />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 font-black tracking-tight">{file.name}</p>
                    <button 
                      onClick={() => setFile(null)}
                      className="text-slate-400 hover:text-red-500 text-[10px] uppercase font-black tracking-widest mt-2 flex items-center gap-1 transition-colors mx-auto"
                    >
                      <X className="w-3 h-3" /> Discard File
                    </button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-4 group/file">
                  <div className="w-20 h-20 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover/file:scale-110 group-hover/file:border-brand-purple/30 transition-all">
                    <Upload className="w-8 h-8 text-brand-purple" />
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 font-bold">Select Documentation</p>
                    <p className="text-slate-400 text-xs mt-1">Maximum upload size: 10MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-brand-purple text-white font-black uppercase tracking-[0.2em] py-6 rounded-2xl shadow-xl shadow-brand-purple/20 hover:bg-brand-accent hover:shadow-brand-purple/30 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Commit Record
              </>
            )}
          </button>
        </form>

        {/* Professional Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/5 blur-3xl rounded-full" />
      </div>
    </div>
  );
}
