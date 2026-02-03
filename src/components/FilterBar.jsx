import React from 'react';
import { Search, Filter, Calendar, X } from 'lucide-react';

const FilterBar = ({ onSearch, onCategoryChange, onDateRangeChange, categories = [] }) => {
    return (
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

            {/* Search Input */}
            <div className="relative w-full md:w-auto md:flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Buscar por nombre, monto..."
                    onChange={(e) => onSearch(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                />
            </div>

            <div className="flex w-full md:w-auto gap-3 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                {/* Category Dropdown */}
                <div className="relative min-w-[140px]">
                    <select
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="w-full appearance-none bg-slate-900/50 border border-slate-700 text-slate-300 pl-4 pr-10 py-2 rounded-xl focus:outline-none focus:border-blue-500 text-sm cursor-pointer hover:bg-slate-800/50 transition-colors"
                    >
                        <option value="">Todas las Categorías</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <Filter className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                </div>

                {/* Date Filter (Simplified for now as Month/Year selector or generic date picker could be complex to style perfectly without a library, using native date input) */}
                <div className="relative flex items-center gap-2 bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2">
                    <Calendar className="text-slate-500 w-4 h-4" />
                    <input
                        type="date"
                        className="bg-transparent text-slate-300 text-sm focus:outline-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                        onChange={(e) => onDateRangeChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
