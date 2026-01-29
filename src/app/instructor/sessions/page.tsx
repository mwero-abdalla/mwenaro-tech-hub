import { getInstructorSessions, getMyCohorts } from '@/lib/sessions'
import { Card } from '@/components/ui/card'
import { CreateSessionForm } from '@/components/create-session-form'

export default async function SessionsPage() {
    const sessions = await getInstructorSessions()
    const cohorts = await getMyCohorts()

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
            <div className="max-w-5xl mx-auto p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">My Sessions</h1>
                        <p className="text-muted-foreground text-lg">Manage live sessions for your cohorts</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Create Session Form */}
                    <div className="lg:col-span-1">
                        <Card className="p-6 sticky top-8">
                            <h2 className="text-xl font-bold mb-4">Schedule Session</h2>
                            <CreateSessionForm cohorts={cohorts} />
                        </Card>
                    </div>

                    {/* Sessions List */}
                    <div className="lg:col-span-2 space-y-4">
                        {sessions.length === 0 ? (
                            <Card className="p-12 text-center text-muted-foreground">
                                No sessions scheduled. Create one to get started!
                            </Card>
                        ) : (
                            sessions.map((session) => (
                                <Card key={session.id} className="p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-full inline-block mb-2">
                                                {session.cohort?.name}
                                            </div>
                                            <h3 className="text-xl font-bold mb-1">{session.title}</h3>
                                            <p className="text-muted-foreground text-sm mb-4">
                                                {session.description || 'No description provided'}
                                            </p>

                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <span>📅</span>
                                                    <span>
                                                        {new Date(session.start_time).toLocaleDateString()} at {new Date(session.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span>⏳</span>
                                                    <span>{session.duration_minutes} mins</span>
                                                </div>
                                            </div>
                                        </div>
                                        {session.meeting_link && (
                                            <a
                                                href={session.meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition"
                                            >
                                                Join
                                            </a>
                                        )}
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
