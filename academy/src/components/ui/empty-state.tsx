import React from 'react'
import { Card } from '@/components/ui/card'
import { FileQuestion } from 'lucide-react'

interface EmptyStateProps {
    title?: string;
    description: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
}

export function EmptyState({
    title = "Nothing to see here",
    description,
    icon = <FileQuestion className="w-12 h-12 text-zinc-300 dark:text-zinc-700" />,
    action
}: EmptyStateProps) {
    return (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100 mb-2">
                {title}
            </h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-sm mx-auto mb-6 leading-relaxed">
                {description}
            </p>
            {action && (
                <div>
                    {action}
                </div>
            )}
        </Card>
    )
}
