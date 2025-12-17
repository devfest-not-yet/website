import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/utilities/cn";

const Checkbox = React.forwardRef(
    ({ className, label, id, ...props }, ref) => {
        const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    className={cn(
                        "h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
                        className
                    )}
                    ref={ref}
                    id={checkboxId}
                    {...props}
                />
                {label && (
                    <label
                        htmlFor={checkboxId}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
                    >
                        {label}
                    </label>
                )}
            </div>
        );
    }
);

Checkbox.displayName = "Checkbox";

Checkbox.propTypes = {
    className: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    id: PropTypes.string,
};

export { Checkbox };
