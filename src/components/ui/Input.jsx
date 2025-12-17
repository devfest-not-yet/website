import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/utilities/cn";

const Input = React.forwardRef(
    ({ className, type, label, error, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-foreground mb-2"
                    >
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    ref={ref}
                    id={inputId}
                    aria-invalid={error ? "true" : "false"}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="mt-1 text-sm text-destructive"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

Input.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    label: PropTypes.string,
    error: PropTypes.string,
    id: PropTypes.string,
};

Input.defaultProps = {
    type: "text",
};

export { Input };
