'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Plus, Edit, Trash2, Package, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { workshopAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import { toPersianNumber, toJalaliDate } from '@/lib/helpers';
import type { WorkshopItem, WorkshopLoan } from '@/lib/types';

type Tab = 'items' | 'loans';

export default function WorkshopPage() {
  const [tab, setTab] = useState<Tab>('items');
  const [items, setItems] = useState<WorkshopItem[]>([]);
  const [loans, setLoans] = useState<WorkshopLoan[]>([]);
  const [loading, setLoading] = useState(true);

  // Items state
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkshopItem | null>(null);
  const [iName, setIName] = useState(''); const [iLoc, setILoc] = useState(''); const [iQty, setIQty] = useState('1'); const [iDesc, setIDesc] = useState('');
  const [iErr, setIErr] = useState(''); const [iLoad, setILoad] = useState(false);

  // Loans state
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [lItemId, setLItemId] = useState(''); const [lItemName, setLItemName] = useState('');
  const [lQty, setLQty] = useState('1'); const [lGroup, setLGroup] = useState('');
  const [lBorrower, setLBorrower] = useState(''); const [lBorrowDate, setLBorrowDate] = useState('');
  const [lReturnDate, setLReturnDate] = useState('');
  const [lErr, setLErr] = useState(''); const [lLoad, setLLoad] = useState(false);

  const fetchData = async () => {
    try { const [itemsRes, loansRes] = await Promise.all([workshopAPI.getItems(), workshopAPI.getLoans()]); setItems(itemsRes.items); setLoans(loansRes.loans); } catch { /* */ } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(); }, []);

  const resetItem = () => { setIName(''); setILoc(''); setIQty('1'); setIDesc(''); setIErr(''); };
  const openCreateItem = () => { resetItem(); setEditingItem(null); setShowItemModal(true); };
  const openEditItem = (item: WorkshopItem) => { setEditingItem(item); setIName(item.name); setILoc(item.location); setIQty(String(item.quantity)); setIDesc(item.description); setShowItemModal(true); };
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIErr(''); setILoad(true);
    try { if (editingItem) { await workshopAPI.updateItem(editingItem.id, { name: iName, location: iLoc, quantity: parseInt(iQty) || 1, description: iDesc }); } else { await workshopAPI.createItem({ name: iName, location: iLoc, quantity: parseInt(iQty) || 1, description: iDesc }); } setShowItemModal(false); fetchData();
    } catch (err: unknown) { setIErr(err instanceof Error ? err.message : 'خطا'); } finally { setILoad(false); }
  };
  const handleDeleteItem = async (id: string) => { if (!confirm('آیا از حذف این وسیله مطمئن هستید؟')) return; try { await workshopAPI.deleteItem(id); fetchData(); } catch { /* */ } };

  const openCreateLoan = () => { setLItemId(''); setLItemName(''); setLQty('1'); setLGroup(''); setLBorrower(''); setLBorrowDate(''); setLReturnDate(''); setLErr(''); setShowLoanModal(true); };
  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLErr(''); setLLoad(true);
    try { await workshopAPI.createLoan({ item_id: lItemId, item_name: lItemName, quantity: parseInt(lQty) || 1, group_number: lGroup, borrower_name: lBorrower, borrow_date: lBorrowDate, return_date: lReturnDate }); setShowLoanModal(false); fetchData();
    } catch (err: unknown) { setLErr(err instanceof Error ? err.message : 'خطا'); } finally { setLLoad(false); }
  };
  const handleReturnLoan = async (id: string) => { try { await workshopAPI.updateLoan(id, { status: 'returned' }); fetchData(); } catch { /* */ } };
  const handleDeleteLoan = async (id: string) => { if (!confirm('آیا از حذف این قرض مطمئن هستید؟')) return; try { await workshopAPI.deleteLoan(id); fetchData(); } catch { /* */ } };

  const sortedLoans = [...loans].sort((a, b) => {
    if (a.status === 'returned' && b.status !== 'returned') return 1;
    if (a.status !== 'returned' && b.status === 'returned') return -1;
    return new Date(a.return_date).getTime() - new Date(b.return_date).getTime();
  });

  const today = new Date().toISOString().split('T')[0];
  const getLoanStatus = (loan: WorkshopLoan) => { if (loan.status === 'returned') return 'returned'; if (loan.return_date < today) return 'overdue'; return 'active'; };

  const selectedItem = items.find((i) => i.id === lItemId);
  const maxQty = selectedItem ? selectedItem.quantity - (loans.filter((l) => l.item_id === lItemId && l.status !== 'returned').reduce((s, l) => s + l.quantity, 0)) : 0;

  return (<div className="space-y-4 sm:space-y-6">
    <div><h1 className="text-xl sm:text-2xl font-bold text-navy mb-2 dark:text-cream flex items-center gap-2"><Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-beige" />کارگاه</h1><p className="text-sm text-navy/50 dark:text-beige-light">مدیریت وسایل و قرض‌های کارگاه</p></div>

    <div className="flex gap-2 p-1 bg-navy/5 rounded-xl dark:bg-navy-light/20">
      <button onClick={() => setTab('items')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'items' ? 'bg-white text-navy shadow-sm dark:bg-navy/60 dark:text-cream' : 'text-navy/50 hover:text-navy dark:text-beige-light/60 dark:hover:text-beige-light'}`}><Package className="w-4 h-4" />وسایل کارگاه</button>
      <button onClick={() => setTab('loans')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'loans' ? 'bg-white text-navy shadow-sm dark:bg-navy/60 dark:text-cream' : 'text-navy/50 hover:text-navy dark:text-beige-light/60 dark:hover:text-beige-light'}`}><Clock className="w-4 h-4" />لیست قرض‌ها</button>
    </div>

    {tab === 'items' && (<div className="space-y-4">
      <div className="flex justify-end"><Button onClick={openCreateItem} size="sm"><Plus className="w-4 h-4" />وسیله جدید</Button></div>
      {loading ? <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-navy/5 animate-pulse dark:bg-navy-light/20" />)}</div> :
      items.length === 0 ? <Card className="p-8 text-center"><Package className="w-12 h-12 text-navy/15 mx-auto mb-3 dark:text-sky/30" /><p className="text-navy/40 dark:text-sky">هنوز وسیله‌ای اضافه نشده</p></Card> :
      <div className="space-y-3">{items.map((item) => {
        const loaned = loans.filter((l) => l.item_id === item.id && l.status !== 'returned').reduce((s, l) => s + l.quantity, 0);
        const available = item.quantity - loaned;
        return (<Card key={item.id} className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-navy text-sm dark:text-cream">{item.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky/10 text-sky dark:bg-sky/20">{toPersianNumber(item.quantity)} عدد</span>
                {loaned > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-beige/10 text-beige dark:bg-beige/20">{toPersianNumber(loaned)} قرض داده شده</span>}
                <span className={`text-xs px-2 py-0.5 rounded-full ${available > 0 ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-500/10 text-red-500 dark:bg-red-500/20'}`}>{toPersianNumber(available)} موجود</span>
              </div>
              {item.location && <p className="text-xs text-navy/50 dark:text-beige-light">مکان: {item.location}</p>}
              {item.description && <p className="text-xs text-navy/40 dark:text-beige-light/60 mt-1">{item.description}</p>}
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openEditItem(item)} className="p-2 rounded-lg hover:bg-navy/10 text-sky hover:text-navy transition-all dark:text-sky dark:hover:bg-navy-light/30 dark:hover:text-cream"><Edit className="w-4 h-4" /></button>
              <button onClick={() => handleDeleteItem(item.id)} className="p-2 rounded-lg hover:bg-ruby/10 text-ruby-glow hover:text-ruby transition-all dark:text-ruby-glow dark:hover:bg-ruby/10"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        </Card>);
      })}</div>}
    </div>)}

    {tab === 'loans' && (<div className="space-y-4">
      <div className="flex justify-end"><Button onClick={openCreateLoan} size="sm"><Plus className="w-4 h-4" />قرض جدید</Button></div>
      {loading ? <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 rounded-2xl bg-navy/5 animate-pulse dark:bg-navy-light/20" />)}</div> :
      sortedLoans.length === 0 ? <Card className="p-8 text-center"><Clock className="w-12 h-12 text-navy/15 mx-auto mb-3 dark:text-sky/30" /><p className="text-navy/40 dark:text-sky">هنوز قرضی ثبت نشده</p></Card> :
      <div className="space-y-3">{sortedLoans.map((loan) => {
        const status = getLoanStatus(loan);
        return (<Card key={loan.id} className={`p-4 ${status === 'overdue' ? 'ring-2 ring-red-400/50 dark:ring-red-500/50' : ''}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-bold text-navy text-sm dark:text-cream">{loan.item_name}</h3>
                {status === 'overdue' && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400"><AlertTriangle className="w-3 h-3" />سررسید گذشته</span>}
                {status === 'active' && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"><Clock className="w-3 h-3" />در حال قرض</span>}
                {status === 'returned' && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-sky/10 text-sky dark:bg-sky/20"><CheckCircle className="w-3 h-3" />برگردانده شده</span>}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-navy/50 dark:text-beige-light">
                <span>تعداد: {toPersianNumber(loan.quantity)}</span>
                {loan.group_number && <span>شماره گروه: {loan.group_number}</span>}
                {loan.borrower_name && <span>قرض‌گیرنده: {loan.borrower_name}</span>}
                <span>تاریخ قرض: {toJalaliDate(loan.borrow_date)}</span>
                <span>مهلت بازگشت: {toJalaliDate(loan.return_date)}</span>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              {status !== 'returned' && <button onClick={() => handleReturnLoan(loan.id)} className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:hover:bg-emerald-500/20 transition-all" title="بازگشت"><CheckCircle className="w-4 h-4" /></button>}
              <button onClick={() => handleDeleteLoan(loan.id)} className="p-2 rounded-lg hover:bg-ruby/10 text-ruby-glow dark:hover:bg-ruby/10 transition-all"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        </Card>);
      })}</div>}
    </div>)}

    {/* Item Modal */}
    <Modal isOpen={showItemModal} onClose={() => setShowItemModal(false)} title={editingItem ? 'ویرایش وسیله' : 'وسیله جدید'}>
      <form onSubmit={handleItemSubmit} className="space-y-4">
        <Input label="نام وسیله" value={iName} onChange={(e) => setIName(e.target.value)} required />
        <Input label="مکان" value={iLoc} onChange={(e) => setILoc(e.target.value)} placeholder="مثال: اتاق کارگاه" />
        <Input label="تعداد" type="number" min="1" value={iQty} onChange={(e) => setIQty(e.target.value)} />
        <div className="space-y-1.5"><label className="block text-sm font-medium text-navy dark:text-beige-light">توضیحات</label><textarea value={iDesc} onChange={(e) => setIDesc(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy placeholder-navy/30 focus:outline-none focus:ring-2 focus:ring-ruby/50 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream dark:placeholder-sky/40 resize-none" dir="auto" /></div>
        {iErr && <div className="p-3 rounded-xl bg-ruby/10 border border-ruby/20 text-ruby-glow text-sm text-center">{iErr}</div>}
        <div className="flex gap-3"><Button type="submit" loading={iLoad} className="flex-1">{editingItem ? 'ذخیره' : 'ایجاد'}</Button><Button type="button" variant="ghost" onClick={() => setShowItemModal(false)}>انصراف</Button></div>
      </form>
    </Modal>

    {/* Loan Modal */}
    <Modal isOpen={showLoanModal} onClose={() => setShowLoanModal(false)} title="قرض جدید">
      <form onSubmit={handleLoanSubmit} className="space-y-4">
        <div className="space-y-1.5"><label className="block text-sm font-medium text-navy dark:text-beige-light">انتخاب وسیله</label>
          <select value={lItemId} onChange={(e) => { const item = items.find((i) => i.id === e.target.value); setLItemId(e.target.value); setLItemName(item?.name || ''); setLQty('1'); }} className="w-full px-4 py-3 rounded-xl bg-white/80 border border-navy/15 text-navy focus:outline-none focus:ring-2 focus:ring-ruby/50 dark:bg-navy-light/40 dark:border-beige/15 dark:text-cream" dir="auto">
            <option value="">انتخاب کنید...</option>
            {items.map((item) => { const available = item.quantity - loans.filter((l) => l.item_id === item.id && l.status !== 'returned').reduce((s, l) => s + l.quantity, 0); return <option key={item.id} value={item.id}>{item.name} ({toPersianNumber(available)} موجود)</option>; })}
          </select>
        </div>
        <Input label={`تعداد قرض (حداکثر: ${toPersianNumber(maxQty)})`} type="number" min="1" max={maxQty} value={lQty} onChange={(e) => setLQty(e.target.value)} />
        <Input label="نام قرض‌گیرنده" value={lBorrower} onChange={(e) => setLBorrower(e.target.value)} />
        <Input label="شماره گروه" value={lGroup} onChange={(e) => setLGroup(e.target.value)} placeholder="مثال: ۱" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="تاریخ قرض" type="date" value={lBorrowDate} onChange={(e) => setLBorrowDate(e.target.value)} />
          <Input label="مهلت بازگشت" type="date" value={lReturnDate} onChange={(e) => setLReturnDate(e.target.value)} />
        </div>
        {lErr && <div className="p-3 rounded-xl bg-ruby/10 border border-ruby/20 text-ruby-glow text-sm text-center">{lErr}</div>}
        <div className="flex gap-3"><Button type="submit" loading={lLoad} className="flex-1">ثبت قرض</Button><Button type="button" variant="ghost" onClick={() => setShowLoanModal(false)}>انصراف</Button></div>
      </form>
    </Modal>
  </div>);
}
