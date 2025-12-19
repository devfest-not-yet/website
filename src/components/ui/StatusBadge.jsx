import React from 'react';
import PropTypes from 'prop-types';

const StatusBadge = ({ status, label }) => {
    const getStatusStyles = () => {
        const base = "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300";

        switch (status) {
            case 'success':
            case 'completed':
            case 'in-stock':
                return `${base} bg-success/10 text-success border-success/20 shadow-sm shadow-success/5`;
            case 'warning':
            case 'low-stock':
            case 'pending':
                return `${base} bg-warning/10 text-warning border-warning/20 shadow-sm shadow-warning/5`;
            case 'danger':
            case 'out-of-stock':
            case 'failed':
            case 'error':
                return `${base} bg-destructive/10 text-destructive border-destructive/20 shadow-sm shadow-destructive/5`;
            case 'in-progress':
            case 'processing':
                return `${base} bg-primary/10 text-primary border-primary/20 shadow-sm shadow-primary/5 shadow-pulse`;
            default:
                return `${base} bg-muted text-muted-foreground border-border`;
        }
    };

    return (
        <span className={getStatusStyles()}>
            <span className="w-1 h-1 rounded-full bg-current mr-1.5 opacity-60" />
            {label || status.replace('-', ' ')}
        </span>
    );
};

StatusBadge.propTypes = {
    status: PropTypes.string.isRequired,
    label: PropTypes.string,
};

export default StatusBadge;

