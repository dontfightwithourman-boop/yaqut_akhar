'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  Pencil,
  Save,
  X,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

import { projectsAPI } from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import YaqutIcon from '@/components/YaqutIcon';
import SparkleEffect from '@/components/SparkleEffect';
import { toPersianNumber, formatDate } from '@/lib/helpers';
import type { Project } from '@/lib/types';

export default function ProjectDashboard() {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    projectsAPI
      .get('self')
      .then((data) => {
        setProject(data.project);

        setEditName(data.project.name || '');
        setEditDescription(data.project.description || '');
        setLogoPreview(data.project.logo || '');
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : 'خطا در دریافت اطلاعات پروژه'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const startEditing = () => {
    if (!project) return;

    setEditName(project.name || '');
    setEditDescription(project.description || '');
    setEditLogoFile(null);
    setLogoPreview(project.logo || '');
    setSaveError('');
    setSaveSuccess('');
    setEditing(true);
  };

  const cancelEditing = () => {
    if (!project) return;

    setEditName(project.name || '');
    setEditDescription(project.description || '');
    setEditLogoFile(null);
    setLogoPreview(project.logo || '');
    setSaveError('');
    setEditing(false);
  };

  const validateLogo = (file: File) => {
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      setSaveError(
        'فرمت لوگو باید PNG، JPG یا WEBP باشد. GIF مجاز نیست.'
      );
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      setSaveError(
        'حجم لوگو باید کمتر از ۲ مگابایت باشد.'
      );
      return false;
    }

    return true;
  };

  const handleLogoFile = (file: File | undefined) => {
    if (!file) return;

    setSaveError('');

    if (!validateLogo(file)) {
      return;
    }

    setEditLogoFile(file);

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  };

  const handleLogoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleLogoFile(e.target.files?.[0]);
  };

  const handleLogoDrop = (
    e: React.DragEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    handleLogoFile(e.dataTransfer.files?.[0]);
  };

  const removeSelectedLogo = () => {
    setEditLogoFile(null);

    if (project?.logo) {
      setLogoPreview(project.logo);
    } else {
      setLogoPreview('');
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!project) return;

    if (!editName.trim()) {
      setSaveError('نام پروژه نمی‌تواند خالی باشد.');
      return;
    }

    setSaving(true);
    setSaveError('');
    setSaveSuccess('');

    try {
      /*
       * اول اطلاعات متنی پروژه ذخیره می‌شوند.
       * لوگو جداگانه و به صورت فایل ارسال می‌شود.
       */
      await projectsAPI.update(project.id, {
        name: editName.trim(),
        description: editDescription.trim(),
      });

      /*
       * اگر فایل لوگوی جدید انتخاب شده باشد،
       * آن را به صورت multipart/form-data آپلود می‌کنیم.
       */
      if (editLogoFile) {
        const formData = new FormData();
        formData.append('logo', editLogoFile);

        const token = localStorage.getItem('yaghout_token');

        const response = await fetch(
          `/api/projects/${project.id}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error || 'خطا در آپلود لوگوی پروژه'
          );
        }
      }

      const refreshed = await projectsAPI.get('self');

      setProject(refreshed.project);
      setEditName(refreshed.project.name || '');
      setEditDescription(
        refreshed.project.description || ''
      );
      setEditLogoFile(null);
      setLogoPreview(refreshed.project.logo || '');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setSaveSuccess(
        'اطلاعات پروژه با موفقیت ذخیره شد.'
      );
      setEditing(false);

      setTimeout(() => {
        setSaveSuccess('');
      }, 3000);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error
          ? err.message
          : 'خطا در ذخیره اطلاعات پروژه'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark">
        <div className="w-8 h-8 border-2 border-ruby border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center px-4 dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark">
        <Card className="p-6 sm:p-8 text-center">
          <p className="text-red-500">
            {error || 'پروژه یافت نشد'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent dark:bg-gradient-to-br dark:from-navy-dark dark:via-navy dark:to-navy-dark">
      <Navbar />

      <main className="relative z-10 max-w-2xl mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 sm:space-y-6"
        >
          {/* اطلاعات پروژه */}
          <div className="relative text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="relative">
                {project.logo ? (
                  <img
                    src={project.logo}
                    alt={project.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-navy/10 dark:border-beige/20"
                  />
                ) : (
                  <>
                    <img
                      src="/l-logo.png"
                      alt="آرم سمینار"
                      className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                    />
                    <SparkleEffect count={8} />
                  </>
                )}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-navy mb-2 dark:text-cream">
              {project.name}
            </h1>

            {project.username && (
              <p className="text-sm text-sky">
                {project.username}
              </p>
            )}

            {project.description && (
              <p className="text-sm sm:text-base text-navy/60 dark:text-beige-light max-w-md mx-auto mt-2">
                {project.description}
              </p>
            )}

            {/* دکمه ویرایش */}
            {!editing && (
              <button
                type="button"
                onClick={startEditing}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky/10 border border-sky/20 text-sky hover:bg-sky/20 transition-colors font-medium"
              >
                <Pencil className="w-4 h-4" />
                ویرایش پروژه
              </button>
            )}
          </div>

          {/* بخش ویرایش پروژه */}
          {editing && (
            <Card className="p-5 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-navy dark:text-cream">
                  ویرایش اطلاعات پروژه
                </h2>

                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="p-2 rounded-lg text-navy/50 hover:text-red-500 hover:bg-red-500/10 transition-colors dark:text-beige-light"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* نام پروژه */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2 dark:text-cream">
                    نام پروژه
                  </label>

                  <input
                    type="text"
                    value={editName}
                    onChange={(e) =>
                      setEditName(e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-xl border border-sky/20 bg-white/60 text-navy outline-none focus:border-sky dark:bg-navy-light/30 dark:text-cream"
                    dir="rtl"
                  />
                </div>

                {/* توضیحات */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2 dark:text-cream">
                    توضیحات پروژه
                  </label>

                  <textarea
                    value={editDescription}
                    onChange={(e) =>
                      setEditDescription(e.target.value)
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-sky/20 bg-white/60 text-navy outline-none focus:border-sky resize-none dark:bg-navy-light/30 dark:text-cream"
                    dir="rtl"
                  />
                </div>

                {/* آپلود لوگو */}
                <div>
                  <label className="block text-sm font-medium text-navy mb-2 dark:text-cream">
                    لوگوی پروژه
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                  />

                  <label
                    htmlFor="project-logo-upload"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={handleLogoDrop}
                    className="relative flex flex-col items-center justify-center w-full min-h-40 px-4 py-6 rounded-2xl border-2 border-dashed border-sky/30 bg-white/40 hover:bg-sky/5 hover:border-sky/50 cursor-pointer transition-all dark:bg-navy-light/20 dark:border-beige/20 dark:hover:bg-navy-light/30"
                  >
                    {logoPreview ? (
                      <>
                        <img
                          src={logoPreview}
                          alt="پیش‌نمایش لوگوی پروژه"
                          className="w-24 h-24 object-contain rounded-xl"
                        />

                        <div className="mt-3 text-sm text-sky">
                          {editLogoFile
                            ? 'لوگوی جدید انتخاب شده'
                            : 'لوگوی فعلی پروژه'}
                        </div>

                        <div className="mt-1 text-xs text-navy/40 dark:text-beige-light/50">
                          برای تغییر، فایل جدید را اینجا بکشید
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-sky mb-3" />

                        <span className="text-sm font-medium text-navy/60 dark:text-beige-light">
                          لوگو را اینجا بکشید و رها کنید
                        </span>

                        <span className="text-xs text-navy/40 dark:text-beige-light/50 mt-2">
                          یا برای انتخاب فایل کلیک کنید
                        </span>

                        <span className="text-xs text-navy/30 dark:text-beige-light/40 mt-2">
                          PNG، JPG یا WEBP — حداکثر ۲ مگابایت
                        </span>
                      </>
                    )}

                    <input
                      id="project-logo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>

                  {editLogoFile && (
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-sky">
                        <ImageIcon className="w-4 h-4" />
                        <span className="truncate max-w-[220px]">
                          {editLogoFile.name}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={removeSelectedLogo}
                        disabled={saving}
                        className="text-xs text-red-500 hover:text-red-600"
                      >
                        حذف انتخاب
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-navy/40 mt-2 dark:text-beige-light">
                    اگر لوگویی انتخاب نشود، لوگوی سمینار نمایش داده می‌شود.
                    GIF مجاز نیست.
                  </p>
                </div>

                {/* خطا */}
                {saveError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                    {saveError}
                  </div>
                )}

                {/* دکمه‌ها */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky text-white hover:bg-sky/90 transition-colors font-bold disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}

                    {saving
                      ? 'در حال ذخیره...'
                      : 'ذخیره تغییرات'}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="px-5 py-3 rounded-xl bg-navy/5 text-navy hover:bg-navy/10 transition-colors dark:bg-white/5 dark:text-cream"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* پیام موفقیت */}
          {saveSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 text-sm text-center"
            >
              {saveSuccess}
            </motion.div>
          )}

          {/* تعداد مروارید */}
          <Card className="p-8 sm:p-10 text-center relative overflow-hidden">
            <SparkleEffect count={12} />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                bounce: 0.4,
              }}
              className="flex justify-center items-center"
            >
              <YaqutIcon size={64} animate />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-5xl sm:text-7xl font-black text-navy mt-4 dark:text-cream">
                {toPersianNumber(project.yaqut_count)}
              </div>

              <div className="text-lg sm:text-xl text-navy/50 mt-2 dark:text-beige-light">
                مروارید
              </div>
            </motion.div>
          </Card>

          {/* اعضای تیم */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-sky" />
              اعضای تیم
            </h2>

            <div className="space-y-2 sm:space-y-3">
              {project.members?.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-ruby to-beige flex items-center justify-center text-cream font-bold text-sm shrink-0">
                    {member.name.charAt(0)}
                  </div>

                  <div>
                    <div className="font-medium text-navy text-sm dark:text-cream">
                      {member.name}
                    </div>

                    {member.period && (
                      <div className="text-xs text-sky">
                        دوره: {member.period}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {(!project.members ||
                project.members.length === 0) && (
                <p className="text-sm text-navy/50 dark:text-beige-light text-center py-4">
                  هنوز عضوی برای این پروژه ثبت نشده است.
                </p>
              )}
            </div>
          </Card>

          {/* تاریخچه مروارید */}
          {project.yaqut_history &&
            project.yaqut_history.length > 0 && (
              <Card className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold text-navy mb-3 sm:mb-4 flex items-center gap-2 dark:text-cream">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-beige" />
                  تاریخچه مروارید
                </h2>

                <div className="space-y-2">
                  {project.yaqut_history.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-2 sm:p-3 rounded-xl bg-navy/3 dark:bg-navy-light/30"
                    >
                      <div className="flex items-center gap-2">
                        <YaqutIcon
                          size={14}
                          animate={false}
                        />

                        <span className="text-navy font-bold text-sm dark:text-cream">
                          +
                          {toPersianNumber(event.amount)}
                        </span>

                        {event.note && (
                          <span className="text-xs text-sky">
                            ({event.note})
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-sky">
                        {formatDate(event.awarded_at)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
