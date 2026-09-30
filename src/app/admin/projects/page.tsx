'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Plus,
  Search,
  FolderPlus,
  Upload,
  X,
  ArrowLeft,
  Image as ImageIcon,
} from 'lucide-react';

import { projectsAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ProjectCard from '@/components/ProjectCard';
import { toPersianNumber } from '@/lib/helpers';
import type { Project } from '@/lib/types';
import Link from 'next/link';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [fN, setFN] = useState('');
  const [fU, setFU] = useState('');
  const [fP, setFP] = useState('');
  const [fD, setFD] = useState('');

  // لوگو
  const [fL, setFL] = useState('');
  const [logoFile, setLogoFile] =
    useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  const [fM, setFM] = useState<
    { name: string; period: string }[]
  >([]);

  const [fErr, setFErr] = useState('');
  const [fLoad, setFLoad] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const fetchP = async () => {
    try {
      const d = await projectsAPI.list();
      setProjects(d.projects);
    } catch {
      // intentionally ignored
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchP();
  }, []);

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setFL('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const reset = () => {
    setFN('');
    setFU('');
    setFP('');
    setFD('');
    setFL('');
    setLogoFile(null);
    setLogoPreview('');
    setFM([]);
    setFErr('');
    setDragActive(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openC = () => {
    reset();
    setEditingProject(null);
    setShowCreate(true);
  };

  const openE = (p: Project) => {
    setEditingProject(p);

    setFN(p.name);
    setFU(p.username);
    setFP('');
    setFD(p.description || '');

    setFL(p.logo || '');
    setLogoFile(null);
    setLogoPreview(p.logo || '');

    setFM(
      p.members?.map((m) => ({
        name: m.name,
        period: m.period || '',
      })) || []
    );

    setFErr('');
    setShowCreate(true);
  };

  const processLogoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFErr('لطفاً فقط فایل تصویری انتخاب کنید');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setFErr(
        'حجم تصویر باید کمتر از ۲ مگابایت باشد'
      );
      return;
    }

    setFErr('');
    setLogoFile(file);

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setFL('');
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    processLogoFile(file);
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    processLogoFile(file);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!dragActive) {
      setDragActive(true);
    }
  };

  const handleDragLeave = (
    e: React.DragEvent<HTMLDivElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setFErr('');
    setFLoad(true);

    try {
      let projectId = editingProject?.id;

      /*
       * ابتدا خود پروژه را ایجاد/ویرایش می‌کنیم.
       */
      if (editingProject) {
        const ud: Record<string, unknown> = {
          name: fN,
          description: fD,
          members: fM.filter(
            (m) => m.name.trim()
          ),
        };

        if (fU) {
          ud.username = fU;
        }

        if (fP) {
          ud.password = fP;
        }

        await projectsAPI.update(
          editingProject.id,
          ud
        );
      } else {
        const created =
          await projectsAPI.create({
            name: fN,
            username: fU,
            password: fP || undefined,
            description: fD,
            members: fM.filter(
              (m) => m.name.trim()
            ),
          });

        projectId = created.project?.id;
      }

      /*
       * اگر لوگوی جدید انتخاب شده، بعد از ایجاد پروژه
       * آن را به صورت فایل واقعی آپلود می‌کنیم.
       */
      if (logoFile && projectId) {
        const formData = new FormData();

        formData.append('logo', logoFile);

        const token =
          localStorage.getItem('yaghout_token');

        const res = await fetch(
          `/api/projects/${projectId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!res.ok) {
          throw new Error(
            'پروژه ذخیره شد اما آپلود لوگو انجام نشد'
          );
        }
      }

      setShowCreate(false);
      reset();
      fetchP();
    } catch (err: unknown) {
      setFErr(
        err instanceof Error
          ? err.message
          : 'خطا در ذخیره پروژه'
      );
    } finally {
      setFLoad(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'آیا از حذف این پروژه مطمئن هستید؟'
      )
    ) {
      return;
    }

    try {
      await projectsAPI.delete(id);
      fetchP();
    } catch {
      // intentionally ignored
    }
  };

  const addM = () =>
    setFM([
      ...fM,
      {
        name: '',
        period: '',
      },
    ]);

  const updM = (
    i: number,
    f: string,
    v: string
  ) => {
    const u = [...fM];
    const m = {
      ...u[i],
    };

    if (f === 'name') {
      m.name = v;
    } else {
      m.period = v;
    }

    u[i] = m;
    setFM(u);
  };

  const rmM = (i: number) =>
    setFM(
      fM.filter(
        (_, idx) => idx !== i
      )
    );

  const filtered = projects.filter(
    (p) =>
      p.name.includes(search) ||
      p.username.includes(search)
  );

  const inp =
    'flex-1 px-3 py-2 rounded-lg bg-white/60 border border-navy/10 text-navy text-sm focus:outline-none focus:ring-1 focus:ring-pearl/50 dark:bg-navy-light/30 dark:border-beige/15 dark:text-cream';

  return (
    <div className="space-y-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sky hover:text-ruby transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        بازگشت به داشبورد
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy mb-2 dark:text-cream">
            مدیریت پروژه‌ها
          </h1>

          <p className="text-navy/50 dark:text-beige-light">
            {toPersianNumber(projects.length)} پروژه ثبت شده
          </p>
        </div>

        <Button onClick={openC}>
          <Plus className="w-4 h-4" />
          پروژه جدید
        </Button>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="جستجو..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          icon={
            <Search className="w-4 h-4" />
          }
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-navy/5 animate-pulse dark:bg-navy-light/20"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <FolderPlus className="w-12 h-12 text-navy/15 mx-auto mb-4 dark:text-sky/30" />

          <p className="text-navy/40 dark:text-sky">
            پروژه‌ای یافت نشد
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onEdit={openE}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title={
          editingProject
            ? 'ویرایش پروژه'
            : 'پروژه جدید'
        }
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            label="نام پروژه"
            value={fN}
            onChange={(e) =>
              setFN(e.target.value)
            }
            required
          />

          {!editingProject && (
            <Input
              label="نام کاربری"
              value={fU}
              onChange={(e) =>
                setFU(e.target.value)
              }
              dir="ltr"
              required
            />
          )}

          <Input
            label={
              editingProject
                ? 'رمز جدید (خالی = بدون تغییر)'
                : 'رمز عبور'
            }
            type="password"
            value={fP}
            onChange={(e) =>
              setFP(e.target.value)
            }
            dir="ltr"
            required={!editingProject}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-navy dark:text-beige-light">
              توضیحات پروژه
            </label>

            <textarea
              value={fD}
              onChange={(e) =>
                setFD(e.target.value)
              }
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-pearl/50 focus:border-pearl/50 transition-all duration-200 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream dark:placeholder-sky/40 resize-none"
              dir="auto"
              placeholder="توضیحات پروژه..."
            />
          </div>

          {/* Logo Upload */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-navy dark:text-beige-light">
              لوگوی پروژه
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div
              onDragEnter={handleDragOver}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() =>
                fileInputRef.current?.click()
              }
              className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all ${
                dragActive
                  ? 'border-pearl bg-pearl/10 scale-[1.01]'
                  : 'border-navy/15 bg-white/40 hover:border-sky/50 hover:bg-sky/5 dark:border-beige/15 dark:bg-navy-light/20 dark:hover:border-pearl/40'
              }`}
            >
              {logoPreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={logoPreview}
                    alt="پیش‌نمایش لوگو"
                    className="w-24 h-24 rounded-2xl object-cover border border-navy/10 dark:border-beige/20 shadow-sm"
                  />

                  <p className="mt-3 text-sm text-navy/60 dark:text-beige-light">
                    برای تغییر لوگو، فایل جدید را بکشید و اینجا رها کنید
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-sky/10 flex items-center justify-center">
                    {dragActive ? (
                      <Upload className="w-7 h-7 text-pearl" />
                    ) : (
                      <ImageIcon className="w-7 h-7 text-sky" />
                    )}
                  </div>

                  <p className="font-medium text-navy dark:text-cream">
                    {dragActive
                      ? 'فایل را اینجا رها کنید'
                      : 'لوگو را بکشید و اینجا رها کنید'}
                  </p>

                  <p className="text-xs text-navy/40 dark:text-beige-light mt-1">
                    یا برای انتخاب فایل کلیک کنید
                  </p>

                  <p className="text-[11px] text-navy/30 dark:text-beige-light/60 mt-2">
                    PNG، JPG، WEBP یا GIF — حداکثر ۲ مگابایت
                  </p>
                </>
              )}
            </div>

            {logoPreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearLogo();
                }}
                className="flex items-center gap-1 mx-auto mt-2 px-3 py-1.5 rounded-lg text-pearl hover:text-pearl-glow text-sm transition-colors"
              >
                <X className="w-3 h-3" />
                حذف لوگو
              </button>
            )}
          </div>

          {/* Members */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-navy/60 dark:text-beige-light">
                اعضا
              </label>

              <button
                type="button"
                onClick={addM}
                className="text-xs text-pearl hover:text-pearl-glow transition-colors"
              >
                + افزودن عضو
              </button>
            </div>

            <div className="space-y-2">
              {fM.map((m, i) => (
                <div
                  key={i}
                  className="flex gap-2 items-center"
                >
                  <span className="text-xs font-bold text-navy/40 dark:text-sky w-6 text-center">
                    {toPersianNumber(i + 1)}
                  </span>

                  <input
                    placeholder="نام"
                    value={m.name}
                    onChange={(e) =>
                      updM(
                        i,
                        'name',
                        e.target.value
                      )
                    }
                    className={inp}
                  />

                  <input
                    placeholder="دوره"
                    value={m.period}
                    onChange={(e) =>
                      updM(
                        i,
                        'period',
                        e.target.value
                      )
                    }
                    className="w-24 sm:w-28 px-3 py-2 rounded-lg bg-white/60 border border-navy/10 text-navy text-sm dark:bg-navy-light/30 dark:border-beige/15 dark:text-cream"
                  />

                  <button
                    type="button"
                    onClick={() => rmM(i)}
                    className="px-2 text-ruby-glow hover:text-ruby"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {fErr && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {fErr}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              loading={fLoad}
              className="flex-1"
            >
              {editingProject
                ? 'ذخیره'
                : 'ایجاد'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                setShowCreate(false)
              }
            >
              انصراف
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
