import React from 'react';


export const BrandLogo = ({ className = "" }: { className?: string }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
                    <path d="M4 19V5L12 13L20 5V19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="1.5" fill="currentColor" />
                    <circle cx="4" cy="5" r="1.5" fill="currentColor" />
                    <circle cx="20" cy="5" r="1.5" fill="currentColor" />
                </svg>
            </div>
            <div className="flex flex-col -gap-1">
                <span className="text-xl font-black tracking-tight text-foreground leading-none">
                    Mwenaro<span className="text-primary">.Tech</span>
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Innovation Hub
                </span>
            </div>
        </div>
    );
};
