import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, trend, bgColor = 'bg-card' }) => {
    return (
        <motion.div
            whileHover={{ y: -4, shadow: "var(--shadow-premium)" }}
            className={`glass-card p-6 flex flex-col justify-between relative overflow-hidden group`}
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700" />

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Icon size={24} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${trend.isPositive ? 'bg-success/10 text-success border border-success/20' : 'bg-destructive/10 text-destructive border border-destructive/20'}`}>
                        {trend.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {trend.value}
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            </div>
        </motion.div>
    );
};

MetricCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.elementType.isRequired,
    trend: PropTypes.shape({
        value: PropTypes.string,
        isPositive: PropTypes.bool,
    }),
    bgColor: PropTypes.string,
};

export default MetricCard;

