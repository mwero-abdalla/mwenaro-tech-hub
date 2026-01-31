import { Card } from '@/components/ui/card'
import {
    TrendingUp,
    ArrowUpRight,
    Zap,
    Users,
    ShieldCheck,
    Activity,
    BrainCircuit,
    BarChart3
} from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'

export default function AnalyticsPage() {
    const mockLogs = [
        { id: 1, student: 'michael@mwenaro.com', lesson: 'React Hooks Deep Dive', ai_rating: 88, adjustment: 0, date: 'Mar 28' },
        { id: 2, student: 'sarah.k@tech.com', lesson: 'Advanced Next.js APIs', ai_rating: 94, adjustment: -3, date: 'Mar 27' },
        { id: 3, student: 'john.dev@gmail.com', lesson: 'Supabase Auth Flows', ai_rating: 72, adjustment: +8, date: 'Mar 26' },
        { id: 4, student: 'anna.code@outlook.com', lesson: 'TypeScript Mastery', ai_rating: 91, adjustment: 0, date: 'Mar 25' },
    ]

    const stats = [
        { label: 'Avg AI Rating', value: '84.2%', icon: BrainCircuit, color: 'text-blue-500', trend: '+2.4%' },
        { label: 'Active Learners', value: '1,284', icon: Users, color: 'text-purple-500', trend: '+12%' },
        { label: 'Grading Accuracy', value: '96.8%', icon: ShieldCheck, color: 'text-green-500', trend: '+0.5%' },
        { label: 'Systen Uptime', value: '99.9%', icon: Activity, color: 'text-orange-500', trend: 'Stable' },
    ]

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-zinc-950 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">System Intelligence</h1>
                        <p className="text-zinc-500 font-medium mt-1">Real-time performance monitoring and AI grading audit.</p>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Live Infrastructure Status</span>
                    </div>
                </div>

                {/* Performance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-green-500 flex items-center bg-green-500/10 px-2 py-1 rounded-lg">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black mt-1">{stat.value}</p>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                    {/* Visual Chart Mockup */}
                    <Card className="lg:col-span-2 p-8 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 rounded-3xl">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-primary" />
                                    Enrollment Growth
                                </h2>
                                <p className="text-sm text-zinc-500 font-medium">Monthly trajectory of new platform users</p>
                            </div>
                            <Select defaultValue="month">
                                <SelectTrigger className="w-32 h-10 rounded-xl">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="week">Weekly</SelectItem>
                                    <SelectItem value="month">Monthly</SelectItem>
                                    <SelectItem value="year">Yearly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="h-64 w-full flex items-end gap-3 px-2">
                            {[40, 65, 45, 90, 60, 85, 45, 70, 95, 65, 80, 100].map((height, i) => (
                                <div key={i} className="flex-1 group relative">
                                    <div
                                        className="w-full bg-primary/10 group-hover:bg-primary/30 transition-all rounded-t-lg relative"
                                        style={{ height: `${height}%` }}
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10 whitespace-nowrap">
                                            {height * 10} User
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            <span>Jan</span>
                            <span>Jun</span>
                            <span>Dec</span>
                        </div>
                    </Card>

                    {/* AI Insights */}
                    <Card className="p-8 border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-primary/10 via-transparent to-transparent dark:bg-zinc-900/50 rounded-3xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-xl shadow-primary/20">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-black mb-2 italic">Mwenaro Insight</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed mb-8">
                                AI Grading is performing 4.2x faster than manual review with a 96% instructor approval rate this week.
                            </p>
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-white/50 dark:bg-zinc-800/50 border border-white/20">
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span>RESOURCE EFFICIENCY</span>
                                        <span className="text-primary">+84%</span>
                                    </div>
                                    <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary rounded-full" style={{ width: '84%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    </Card>
                </div>

                {/* Audit Log */}
                <Card className="overflow-hidden border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/50 shadow-xl shadow-zinc-200/50 dark:shadow-none">
                    <div className="p-8 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Grading Audit Loop</h2>
                        <span className="text-xs font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full uppercase tracking-widest">Last 24 Hours</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Student</th>
                                    <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Lesson Context</th>
                                    <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">AI Logic</th>
                                    <th className="text-left p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Adjustment</th>
                                    <th className="text-right p-6 text-xs font-bold uppercase tracking-wider text-zinc-400">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {mockLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                                        <td className="p-6 font-semibold">{log.student}</td>
                                        <td className="p-6 text-sm text-zinc-500 font-medium">{log.lesson}</td>
                                        <td className="p-6">
                                            <span className="font-black text-primary">{log.ai_rating}%</span>
                                        </td>
                                        <td className="p-6">
                                            {log.adjustment === 0 ? (
                                                <span className="text-zinc-400 font-bold text-xs">—</span>
                                            ) : (
                                                <span className={`px-2 py-1 rounded-lg text-xs font-bold ${log.adjustment > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                                    {log.adjustment > 0 ? `+${log.adjustment}` : log.adjustment}%
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-6 text-right text-sm text-zinc-400 font-medium">{log.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    )
}
