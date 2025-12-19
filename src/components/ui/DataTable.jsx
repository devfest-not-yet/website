import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DataTable = ({ columns, data, onRowClick, selectedRowId }) => {
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const filteredData = React.useMemo(() => {
        return data.filter(item =>
            Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm]);

    const sortedData = React.useMemo(() => {
        if (!sortConfig.key) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];

            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search records..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-muted/30 border border-border/50 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all text-sm outline-none"
                    />
                </div>
            </div>

            <div className="glass-card overflow-hidden border-border/40">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/40">
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        className={`px-6 py-4 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest ${column.sortable ? 'cursor-pointer hover:text-primary transition-colors' : ''
                                            }`}
                                        onClick={() => column.sortable && handleSort(column.key)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {column.label}
                                            {column.sortable && sortConfig.key === column.key && (
                                                <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                                                    {sortConfig.direction === 'asc' ? (
                                                        <ChevronUp size={14} className="text-primary" />
                                                    ) : (
                                                        <ChevronDown size={14} className="text-primary" />
                                                    )}
                                                </motion.span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            <AnimatePresence mode="popLayout">
                                {sortedData.map((row, rowIndex) => (
                                    <motion.tr
                                        key={row.id || rowIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => onRowClick && onRowClick(row)}
                                        className={`
                                            transition-colors group
                                            ${onRowClick ? 'cursor-pointer' : ''}
                                            ${selectedRowId === row.id ? 'bg-primary/10' : 'hover:bg-primary/5'}
                                        `}
                                    >
                                        {columns.map((column) => (
                                            <td key={column.key} className="px-6 py-4 text-sm font-medium">
                                                {column.render ? column.render(row[column.key], row) : row[column.key]}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {sortedData.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-muted-foreground font-medium">
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

DataTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            sortable: PropTypes.bool,
            render: PropTypes.func,
        })
    ).isRequired,
    data: PropTypes.array.isRequired,
};

export default DataTable;
