"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Calendar,
  X,
  Sun,
  Moon,
  Zap,
  Star,
  Target,
  Trophy,
  BrainCircuit,
  Settings,
  AlertCircle,
  Lightbulb,
  Rocket
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from 'recharts';


const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const KPICard = ({ title, value, icon: Icon, trend, trendValue, color, isDark }) => (
  <div className={`card hover:shadow-md transition-all duration-300 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
    <div className="flex justify-between items-start">
      <div>
        <p className={`kpi-label ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
        <h3 className={`kpi-value ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-${color.split('-')[1]}-500`}>
        <Icon size={20} />
      </div>
    </div>
    <div className="kpi-trend">
      {trend === 'up' ? (
        <span className="flex items-center text-emerald-500 font-medium">
          <ArrowUpRight size={14} className="mr-0.5" /> {trendValue}%
        </span>
      ) : (
        <span className="flex items-center text-rose-500 font-medium">
          <ArrowDownRight size={14} className="mr-0.5" /> {trendValue}%
        </span>
      )}
      <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>vs last period</span>
    </div>
  </div>
);

const InsightCard = ({ title, value, label, icon: Icon, isDark, colorClass }) => (
  <div className={`px-4 py-3 rounded-xl border flex items-center gap-3 transition-all duration-300 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-100 shadow-sm'}`}>
    <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 ${colorClass.replace('bg-', 'text-')}`}>
      <Icon size={18} />
    </div>
    <div>
      <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{title}</p>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{value}</span>
        <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
      </div>
    </div>
  </div>
);

const AIResultBlock = ({ icon: Icon, title, content, color, isDark }) => (
  <div className={`p-4 rounded-xl border transition-all ${isDark ? 'bg-slate-900/40 border-slate-700/50' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-sm'}`}>
    <div className="flex items-center gap-2 mb-2">
      <div className={`p-1.5 rounded-lg ${color}`}>
        <Icon size={14} className="text-white" />
      </div>
      <h4 className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{title}</h4>
    </div>
    <ul className="space-y-2">
      {content.map((point, i) => (
        <li key={i} className={`text-xs leading-relaxed flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${color.replace('bg-', 'bg-opacity-50 bg-')}`} />
          {point}
        </li>
      ))}
    </ul>
  </div>
);

const CustomTooltip = ({ active, payload, label, format, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white/90 border-slate-200 text-slate-900'} backdrop-blur-md border p-3 rounded-lg shadow-xl outline-none`}>
        <p className={`text-xs font-bold uppercase mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
        <p className="text-sm font-bold">
          {format ? format(payload[0].value) : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const App = () => {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);
  
  const [filters, setFilters] = useState({
    product: 'All Products',
    channel: 'All Channels'
  });

  useEffect(() => {
    fetch('/api/sales')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setRawData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching sales API:', error);
        setLoading(false);
      });
  }, []);

  // Filtered Data
  const filteredData = useMemo(() => {
    return rawData.filter(row => {
      const matchProduct = filters.product === 'All Products' || row.product === filters.product;
      const matchChannel = filters.channel === 'All Channels' || row.channel === filters.channel;
      return matchProduct && matchChannel;
    });
  }, [rawData, filters]);

  // Derived Stats
  const stats = useMemo(() => {
    const revenue = filteredData.reduce((sum, row) => sum + (row.revenue || 0), 0);
    const orders = filteredData.reduce((sum, row) => sum + (row.orders || 0), 0);
    const cost = filteredData.reduce((sum, row) => sum + (row.cost || 0), 0);
    const visitors = filteredData.reduce((sum, row) => sum + (row.visitors || 0), 0);
    
    // Top Insights Calculation
    const productRev = filteredData.reduce((acc, r) => { acc[r.product] = (acc[r.product] || 0) + r.revenue; return acc; }, {});
    const bestProduct = Object.entries(productRev).sort(([,a],[,b]) => b-a)[0];

    const channelRev = filteredData.reduce((acc, r) => { acc[r.channel] = (acc[r.channel] || 0) + r.revenue; return acc; }, {});
    const bestChannel = Object.entries(channelRev).sort(([,a],[,b]) => b-a)[0];

    const dateRev = filteredData.reduce((acc, r) => { acc[r.date] = (acc[r.date] || 0) + r.revenue; return acc; }, {});
    const peakDay = Object.entries(dateRev).sort(([,a],[,b]) => b-a)[0];

    // Conversion rate by channel
    const channelStats = filteredData.reduce((acc, r) => {
      if (!acc[r.channel]) acc[r.channel] = { orders: 0, visitors: 0 };
      acc[r.channel].orders += r.orders;
      acc[r.channel].visitors += r.visitors;
      return acc;
    }, {});
    const topCVRChannel = Object.entries(channelStats)
      .map(([name, s]) => ({ name, cvr: s.visitors > 0 ? (s.orders/s.visitors) : 0 }))
      .sort((a,b) => b.cvr - a.cvr)[0];

    return {
      totalRevenue: revenue,
      totalOrders: orders,
      totalProfit: revenue - cost,
      totalVisitors: visitors,
      aov: orders > 0 ? (revenue / orders) : 0,
      bestProduct: bestProduct ? bestProduct[0] : 'N/A',
      bestChannel: bestChannel ? bestChannel[0] : 'N/A',
      peakDay: peakDay ? peakDay[0] : 'N/A',
      peakDayRevenue: peakDay ? peakDay[1] : 0,
      bestCVRChannel: topCVRChannel ? topCVRChannel.name : 'N/A',
      bestCVR: topCVRChannel ? (topCVRChannel.cvr * 100).toFixed(1) : '0'
    };
  }, [filteredData]);

  const generateAIInsights = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stats, aiModel }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error');
      }

      const insights = await response.json();
      setAiInsights(insights);
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert(`Failed to generate insights: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Chart Data
  const trendData = useMemo(() => {
    const grouped = filteredData.reduce((acc, row) => {
      acc[row.date] = (acc[row.date] || 0) + row.revenue;
      return acc;
    }, {});
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date, revenue }));
  }, [filteredData]);

  const channelData = useMemo(() => {
    const grouped = filteredData.reduce((acc, row) => {
      acc[row.channel] = (acc[row.channel] || 0) + row.revenue;
      return acc;
    }, {});
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const productData = useMemo(() => {
    const grouped = filteredData.reduce((acc, row) => {
      acc[row.product] = (acc[row.product] || 0) + row.revenue;
      return acc;
    }, {});
    return Object.entries(grouped)
      .sort(([, a], [, b]) => b - a)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  const products = ['All Products', ...new Set(rawData.map(r => r.product))];
  const channels = ['All Channels', ...new Set(rawData.map(r => r.channel))];

  const formatCurrency = (val) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const formatNumber = (val) => 
    new Intl.NumberFormat('en-US').format(val);

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`sticky top-0 z-30 border-b transition-colors duration-500 ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 p-1.5 rounded-lg shadow-lg shadow-primary-500/20">
              <BarChart3 className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-black tracking-tight bg-gradient-to-br from-primary-400 to-indigo-500 bg-clip-text text-transparent">
              VC Analytics
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex p-1 rounded-full border transition-all duration-300 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <button onClick={() => setIsDark(false)} className={`p-1.5 rounded-full transition-all duration-300 ${!isDark ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}><Sun size={18} /></button>
              <button onClick={() => setIsDark(true)} className={`p-1.5 rounded-full transition-all duration-300 ${isDark ? 'bg-slate-950 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Moon size={18} /></button>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <select value={filters.product} onChange={(e) => setFilters(f => ({...f, product: e.target.value}))} className={`text-xs font-bold border rounded-lg px-3 py-1.5 outline-none transition-colors ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200'}`}>
                {products.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select value={filters.channel} onChange={(e) => setFilters(f => ({...f, channel: e.target.value}))} className={`text-xs font-bold border rounded-lg px-3 py-1.5 outline-none transition-colors ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200'}`}>
                {channels.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </header>



      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className={`text-5xl font-black tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Impact Center
            </h2>
            <p className={`text-lg transition-colors ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Analysis of <span className="font-bold text-primary-500">{filteredData.length}</span> transactions across your business ecosystem.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={aiModel} 
              onChange={(e) => setAiModel(e.target.value)}
              className={`text-sm font-bold border rounded-2xl px-4 py-3 outline-none transition-all shadow-sm ${isDark ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-300'}`}
            >
              <optgroup label="✨ Gemini 2.5 (Fast & Default)">
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Balanced Core)</option>
                <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite (Speed Focus)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Analytics)</option>
              </optgroup>
              <optgroup label="🚀 Gemini 3 Frontiers">
                <option value="gemini-3-flash-preview">Gemini 3 Flash Preview</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro Preview</option>
                <option value="gemini-3.1-flash-lite-preview">Gemini 3.1 Flash-Lite Preview</option>
              </optgroup>
              <optgroup label="🏛️ Gemini 2.0 (Stable)">
                <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                <option value="gemini-2.0-flash-lite-001">Gemini 2.0 Flash-Lite</option>
              </optgroup>
            </select>
            <button 
              onClick={generateAIInsights}
              disabled={aiLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all transform hover:scale-105 active:scale-95 shadow-xl ${aiLoading ? 'opacity-50 cursor-not-allowed' : ''} ${isDark ? 'bg-gradient-to-r from-indigo-600 to-primary-600 text-white shadow-primary-900/40' : 'bg-slate-900 text-white shadow-slate-200'}`}
            >
              {aiLoading ? <Zap className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
              {aiLoading ? 'Interpreting...' : 'Generate AI Insights'}
            </button>
          </div>
        </div>

        {/* Dynamic Insights Panel */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <InsightCard title="MVP Product" value={stats.bestProduct} label="by Sales" icon={Trophy} isDark={isDark} colorClass="bg-amber-500" />
          <InsightCard title="Power Channel" value={stats.bestChannel} label="by Growth" icon={Target} isDark={isDark} colorClass="bg-primary-500" />
          <InsightCard title="Peak Performance" value={stats.peakDay} label={`$${formatNumber(stats.peakDayRevenue)}`} icon={Zap} isDark={isDark} colorClass="bg-indigo-500" />
          <InsightCard title="Elite Conversion" value={stats.bestCVRChannel} label={`${stats.bestCVR}% CVR`} icon={Star} isDark={isDark} colorClass="bg-emerald-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <KPICard title="Projected Revenue" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} trend="up" trendValue="12" color="bg-sky-500" isDark={isDark} />
          <KPICard title="Global Orders" value={formatNumber(stats.totalOrders)} icon={ShoppingBag} trend="up" trendValue="8.4" color="bg-violet-500" isDark={isDark} />
          <KPICard title="Net Profit" value={formatCurrency(stats.totalProfit)} icon={TrendingUp} trend="up" trendValue="14.2" color="bg-emerald-500" isDark={isDark} />
          <KPICard title="Unit Value (AOV)" value={formatCurrency(stats.aov)} icon={BarChart3} trend="down" trendValue="2.1" color="bg-amber-500" isDark={isDark} />
        </div>

        {/* AI Insights Result Section */}
        {aiInsights && (
          <div className={`mb-10 rounded-3xl p-8 transition-colors border-2 border-dashed ${isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-primary-50/30 border-primary-100'}`}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-primary-900/40 text-primary-400' : 'bg-primary-600 text-white'}`}>
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h3 className={`font-black text-xl tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>AI Intelligence Report</h3>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Powered by {aiModel} • Analysis based on active scope</p>
                </div>
              </div>
              <button onClick={() => setAiInsights(null)} className="p-2 rounded-full hover:bg-slate-200 transition-colors"><X size={20} /></button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AIResultBlock title="Critical Alerts" content={aiInsights.alerts} icon={AlertCircle} color="bg-rose-500" isDark={isDark} />
              <AIResultBlock title="Growth Opportunities" content={aiInsights.opportunities} icon={Rocket} color="bg-indigo-500" isDark={isDark} />
              <AIResultBlock title="Action Suggestions" content={aiInsights.suggestions} icon={Lightbulb} color="bg-amber-500" isDark={isDark} />
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
          <div className={`card lg:col-span-2 flex flex-col min-h-[500px] p-10 ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className={`text-xl font-black mb-10 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
              Strategic Revenue Nexus
            </h3>
            <div className="flex-1 h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={isDark ? 0.4 : 0.15}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#475569' : '#94a3b8', fontSize: 11, fontWeight: 700 }} minTickGap={40} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#475569' : '#94a3b8', fontSize: 11, fontWeight: 700 }} tickFormatter={(val) => `$${val/1000}k`} />
                  <Tooltip content={<CustomTooltip format={formatCurrency} isDark={isDark} />} />
                  <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`card flex flex-col min-h-[500px] p-10 ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className={`text-xl font-black mb-10 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              Capture Index
            </h3>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={channelData} innerRadius={85} outerRadius={115} paddingAngle={10} dataKey="value">
                    {channelData.map((e, i) => <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} cornerRadius={8} />)}
                  </Pie>
                  <Tooltip content={<CustomTooltip format={formatCurrency} isDark={isDark} />} />
                  <Legend verticalAlign="bottom" height={60} iconType="circle" formatter={(v) => <span className={`text-xs font-bold tracking-tight px-2 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className={`card p-10 flex flex-col ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-xl font-black mb-10 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
              Alpha Products
            </h3>
            <div className="flex-1 h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData} layout="vertical" margin={{ left: -20, right: 30 }}>
                  <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#475569' : '#64748b', fontSize: 11, fontWeight: 700 }} width={110} />
                  <Tooltip content={<CustomTooltip format={formatCurrency} isDark={isDark} />} cursor={{fill: isDark ? '#0f172a' : '#f8fafc', opacity: 0.8}} />
                  <Bar dataKey="value" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`card p-0 lg:col-span-2 overflow-hidden flex flex-col ${isDark ? 'bg-slate-900 border-slate-800 shadow-2xl' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className={`px-10 py-8 border-b flex items-center justify-between ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/50'}`}>
              <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Transaction Ledger</h3>
              <div className="flex items-center gap-6">
                {(filters.product !== 'All Products' || filters.channel !== 'All Channels') && (
                  <button onClick={() => setFilters({product: 'All Products', channel: 'All Channels'})} className="text-sm font-black text-primary-500 hover:scale-105 transition-transform flex items-center gap-2">
                    <X size={16} /> RESET SCOPE
                  </button>
                )}
                <div className={`px-4 py-2 rounded-xl border text-xs font-black tracking-widest uppercase ${isDark ? 'bg-slate-950 border-slate-800 text-slate-500' : 'bg-white text-slate-400 shadow-sm'}`}>
                  {filteredData.length} entries
                </div>
              </div>
            </div>
            <div className="overflow-x-auto flex-1 max-h-[450px]">
              <table className="min-w-full">
                <thead className={`sticky top-0 z-10 transition-colors ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
                  <tr>
                    <th className={`px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Timeline</th>
                    <th className={`px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Operational Asset</th>
                    <th className={`px-10 py-5 text-left text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Traffic Source</th>
                    <th className={`px-10 py-5 text-right text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Yield</th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  {filteredData.map((row, idx) => (
                    <tr key={idx} className={`transition-all duration-200 group ${isDark ? 'hover:bg-slate-800/40 text-slate-300' : 'hover:bg-slate-50/50 text-slate-600'}`}>
                      <td className="px-10 py-5 whitespace-nowrap text-sm font-bold tracking-tight">{row.date}</td>
                      <td className="px-10 py-5 whitespace-nowrap">
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all group-hover:px-6 ${isDark ? 'bg-primary-900/30 text-primary-400 border border-primary-500/10' : 'bg-primary-50 text-primary-700 border border-primary-100'}`}>
                          {row.product}
                        </span>
                      </td>
                      <td className="px-10 py-5 whitespace-nowrap text-xs font-bold uppercase tracking-wide opacity-60">{row.channel}</td>
                      <td className={`px-10 py-5 whitespace-nowrap text-right text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatCurrency(row.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className={`mt-20 py-10 border-t ${isDark ? 'bg-slate-950 border-slate-900 text-slate-600' : 'bg-white border-slate-100 text-slate-400'}`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">VC Dashboard v3.0 • Intelligent Ecosystem</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
