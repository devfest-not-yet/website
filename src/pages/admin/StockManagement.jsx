import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { useStock, useUpdateStock } from '@/hooks/useAdmin';
import {
    Loader2,
    Package,
    AlertTriangle,
    Filter,
    PackagePlus,
    Save,
    TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '@/components/ui/StatusBadge';
import DataTable from '@/components/ui/DataTable';

const StockManagement = () => {
    const [inventory, setInventory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const updateStockMutation = useUpdateStock();
    const [activeTab, setActiveTab] = useState('inventory');

    React.useEffect(() => {
        const fetchStock = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                const BASE_URL = import.meta.env.VITE_BASE_URL || 'https://backend-t08o.onrender.com/api';
                const response = await fetch(`${BASE_URL}/admin/stock/list`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setInventory(data.data || []);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching stock:', error);
                setIsLoading(false);
            }
        };

        fetchStock();
    }, []);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        quantity: '',
        unit: 'kg',
        ingredient_id: ''
    });

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading real-time inventory...</p>
            </div>
        );
    }

    // Chart data derived from current inventory state
    const stockData = inventory.map(item => ({
        name: item.ingredient?.name || 'Unknown',
        quantity: item.available_quantity,
        threshold: 50
    }));

    const columns = [
        {
            key: 'ingredient',
            label: 'Item Name',
            sortable: true,
            render: (_value, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Package size={14} className="text-muted-foreground" />
                    </div>
                    <span className="font-bold">{row.item || row.name}</span>
                </div>
            )
        },
        {
            key: 'available_quantity',
            label: 'Quantity',
            sortable: true,
            render: (value, row) => (
                <div className="flex flex-col">
                    <span className={`font-bold ${value <= 50 ? 'text-destructive' : ''}`}>
                        {value} {row.unit || 'kg'}
                    </span>
                    <div className="w-20 h-1 bg-muted rounded-full mt-1 overflow-hidden">
                        <div
                            className={`h-full ${value <= 20 ? 'bg-destructive' : value <= 50 ? 'bg-warning' : 'bg-success'}`}
                            style={{ width: `${Math.min((value / 200) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (_value, row) => {
                const status = row.available_quantity <= 20 ? 'low-stock' : row.available_quantity <= 50 ? 'medium-stock' : 'in-stock';
                return <StatusBadge status={status} />;
            },
        },
    ];

    const lowStockItems = inventory.filter(item => item.available_quantity <= 50);

    return (
        <div className="space-y-6 pb-6">
            {/* Header section with Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <p className="text-muted-foreground font-medium">Track and manage your kitchen inventory in real-time.</p>
                </div>
                <div className="flex p-1 bg-muted/50 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Inventory List
                    </button>
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Stock Analytics
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {activeTab === 'inventory' ? (
                    <motion.div
                        key="inventory"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        {/* Summary & Form Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                            {/* Low Stock Alerts Hub */}
                            <div className="lg:col-span-8">
                                <AnimatePresence>
                                    {lowStockItems.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="glass-card border-destructive/20 bg-destructive/5 p-6 mb-6 relative overflow-hidden"
                                        >
                                            <div className="relative z-10 flex items-start gap-4">
                                                <div className="p-3 rounded-2xl bg-destructive/10 text-destructive">
                                                    <AlertTriangle size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-destructive">Critical Stock Alert</h3>
                                                    <p className="text-sm font-medium text-destructive/80 mt-1">
                                                        {lowStockItems.length} items are below critical thresholds. Immediate reorder recommended.
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {lowStockItems.map(item => (
                                                            <span key={item.inventory_id || item.id} className="px-2 py-1 rounded-lg bg-destructive/10 text-[10px] font-bold uppercase tracking-wider border border-destructive/20">
                                                                {item.item || item.name}: {item.available_quantity || item.currentStock}{item.unit}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute top-0 right-0 opacity-5 -mr-12 -mt-12 scale-150 rotate-12">
                                                <AlertTriangle size={180} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Main Table */}
                                <div className="glass-card p-6">
                                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <Filter size={18} className="text-muted-foreground" />
                                        Inventory Overview
                                    </h3>
                                    <DataTable columns={columns} data={inventory} />
                                </div>
                            </div>

                            {/* Quick Update Form */}
                            <div className="lg:col-span-4 space-y-4">
                                <div className="glass-card p-8 bg-indigo-600 border-none text-white shadow-premium sticky top-24">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="p-3 rounded-2xl bg-white/10">
                                            <PackagePlus size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">Quick Update</h3>
                                            <p className="text-xs text-white/70 font-medium">Add or adjust stock levels</p>
                                        </div>
                                    </div>

                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            if (!formData.name || !formData.quantity) return;

                                            // Find ingredient ID from inventory if it exists, or use a heuristic
                                            const item = inventory.find(i => i.ingredient?.name.toLowerCase() === formData.name.toLowerCase());
                                            if (item) {
                                                try {
                                                    await updateStockMutation.mutateAsync({
                                                        ingredient_id: item.ingredient_id,
                                                        quantity: parseFloat(formData.quantity)
                                                    });
                                                    setFormData({ name: '', quantity: '', unit: 'kg', ingredient_id: '' });
                                                } catch (err) {
                                                    console.error('Update failed:', err);
                                                }
                                            }
                                        }}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Item Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="e.g. Basmati Rice"
                                                value={formData.name}
                                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                required
                                                className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all font-medium"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Quantity</label>
                                                <input
                                                    type="number"
                                                    name="quantity"
                                                    placeholder="0"
                                                    value={formData.quantity}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                                                    required
                                                    min="0"
                                                    className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/60 ml-1">Unit</label>
                                                <select
                                                    name="unit"
                                                    value={formData.unit}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                                                    className="w-full h-12 px-4 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:bg-white/20 transition-all font-bold"
                                                >
                                                    <option value="kg" className="text-foreground">KG</option>
                                                    <option value="liters" className="text-foreground">LTR</option>
                                                    <option value="pieces" className="text-foreground">PCS</option>
                                                    <option value="boxes" className="text-foreground">BOX</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="pt-4 flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={updateStockMutation.isPending}
                                                className="flex-1 h-14 rounded-2xl bg-white text-indigo-600 font-bold hover:bg-white/90 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {updateStockMutation.isPending ? 'Saving...' : 'Save Change'}
                                                <Save size={18} />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="analytics"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                        <TrendingUp size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold">Stock Threshold Analysis</h3>
                                </div>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stockData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" opacity={0.5} />
                                            <XAxis type="number" hide />
                                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} width={120} />
                                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                                            <Bar dataKey="quantity" radius={[0, 4, 4, 0]} barSize={20}>
                                                {stockData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.quantity <= entry.threshold ? '#ef4444' : '#6366f1'} />
                                                ))}
                                            </Bar>
                                            <Bar dataKey="threshold" fill="#E2E8F0" radius={[0, 4, 4, 0]} barSize={20} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="glass-card p-6 bg-primary text-white border-none relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-10 relative z-10">
                                        <div>
                                            <h4 className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Total Assets Value</h4>
                                            <h3 className="text-3xl font-bold">$12,450.00</h3>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-white/20">
                                            <Package size={24} />
                                        </div>
                                    </div>
                                    <div className="h-20 w-full relative z-10">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={[
                                                { v: 400 }, { v: 700 }, { v: 500 }, { v: 900 }, { v: 1100 }
                                            ]}>
                                                <Area type="monotone" dataKey="v" stroke="#fff" strokeWidth={2} fill="transparent" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                                </div>

                                <div className="glass-card p-6">
                                    <h4 className="font-bold mb-4">Storage Capacity</h4>
                                    <div className="space-y-4">
                                        {[
                                            { label: 'Dry Storage', val: 78, color: 'bg-indigo-500' },
                                            { label: 'Cold Storage', val: 92, color: 'bg-sky-500' },
                                            { label: 'Frozen Section', val: 45, color: 'bg-emerald-500' },
                                        ].map((item, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                                    <span className="text-muted-foreground">{item.label}</span>
                                                    <span>{item.val}%</span>
                                                </div>
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${item.val}%` }} className={`h-full ${item.color}`} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StockManagement;

