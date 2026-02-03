import { useState, useEffect, useMemo } from 'react'
import { supabase } from './supabaseClient'
import Dashboard from './components/Dashboard'
import BillControl from './components/BillControl'
import TransactionHistory from './components/TransactionHistory'
import AddTransactionModal from './components/AddTransactionModal'
import Sidebar from './components/Sidebar'
import FilterBar from './components/FilterBar'
import Landing from './components/Landing'
import { Menu, Plus, X, Loader2 } from 'lucide-react'

function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard') // dashboard, bills, history
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Filtering state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  // Check for active session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch transactions when session changes
  useEffect(() => {
    if (session) {
      fetchTransactions()
    } else {
      setTransactions([])
    }
  }, [session])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('finanzas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTransactions(data)
    } catch (err) {
      console.error('Error fetching transactions:', err)
      setError('Error al cargar datos. Revisa la conexión con la base de datos.')
    } finally {
      setLoading(false)
    }
  }

  const handleTransactionAdded = (newTransaction) => {
    setTransactions(prev => [newTransaction, ...prev])
  }

  const togglePaymentStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const { error } = await supabase
        .from('finanzas')
        .update({ pagado: newStatus })
        .eq('id', id)

      if (error) throw error

      setTransactions(prev => prev.map(t =>
        t.id === id ? { ...t, pagado: newStatus } : t
      ))
    } catch (err) {
      console.error('Error updating transaction:', err)
      alert('Error al actualizar el estado de pago.')
    }
  }

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm('¿Estás seguro de querer eliminar este movimiento?')) return

    try {
      const { error } = await supabase
        .from('finanzas')
        .delete()
        .eq('id', id)

      if (error) throw error

      setTransactions(prev => prev.filter(t => t.id !== id))
    } catch (err) {
      console.error('Error deleting transaction:', err)
      alert('Error al eliminar el movimiento.')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setActiveTab('dashboard');
  };

  // Derive categories for filter
  const categories = useMemo(() => {
    return [...new Set(transactions.map(t => t.categoria))].filter(Boolean);
  }, [transactions]);

  // Filtered transactions logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = t.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.monto.toString().includes(searchQuery);
      const matchesCategory = selectedCategory ? t.categoria === selectedCategory : true;
      const matchesDate = selectedDate ? t.created_at.startsWith(selectedDate) : true;

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [transactions, searchQuery, selectedCategory, selectedDate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Landing onLoginSuccess={(user) => setSession({ user })} />;
  }

  const renderContent = () => {
    if (loading && transactions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-400 animate-pulse font-medium">Cargando tus finanzas...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-8 rounded-2xl text-center max-w-lg mx-auto backdrop-blur-sm">
          <X className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Ups, algo salió mal</h3>
          <p className="opacity-80 mb-6">{error}</p>
          <button onClick={fetchTransactions} className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-400 transition-colors">
            Reintentar
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Dashboard transactions={transactions} user={session.user} />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <BillControl transactions={transactions} onUpdate={fetchTransactions} user={session.user} />
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-white mb-4">Últimos Movimientos</h2>
                <TransactionHistory
                  transactions={transactions.slice(0, 5)}
                  onTogglePaid={togglePaymentStatus}
                  onDelete={handleDeleteTransaction}
                  compact={true}
                />
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <FilterBar
              onSearch={setSearchQuery}
              onCategoryChange={setSelectedCategory}
              onDateRangeChange={setSelectedDate}
              categories={categories}
            />
            <TransactionHistory
              transactions={filteredTransactions}
              onTogglePaid={togglePaymentStatus}
              onDelete={handleDeleteTransaction}
            />
          </div>
        );
      case 'bills':
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto">
            <BillControl transactions={transactions} onUpdate={fetchTransactions} user={session.user} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex overflow-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
          user={session.user}
        />
      </div>

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar for Mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-[100] w-[280px] transform transition-transform duration-300 ease-in-out md:hidden bg-slate-900 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobile={true}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
          user={session.user}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Navbar for Mobile/Header */}
        <header className="h-16 md:h-20 border-b border-white/5 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2.5 bg-slate-800/80 hover:bg-slate-700 rounded-xl text-slate-200 border border-white/5 active:scale-90 transition-all"
              aria-label="Abrir menú"
            >
              <Menu size={22} />
            </button>
            <h2 className="text-sm md:text-lg font-bold text-white capitalize truncate max-w-[150px] sm:max-w-none">
              {activeTab === 'dashboard' ? 'Panel General' : activeTab === 'history' ? 'Historial de Movimientos' : 'Cuentas y Pagos'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nuevo Registro</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative">
          <div className="max-w-7xl mx-auto pb-20">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        user={session.user}
        onClose={() => setIsModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </div>
  )
}

export default App
