import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncCourse(courseSlug: string) {
    console.log(`\n🚀 Starting sync for course: ${courseSlug}`);

    const coursePath = path.join(process.cwd(), '..', '.docs', 'courses', `${courseSlug}.json`);
    if (!fs.existsSync(coursePath)) {
        console.error(`Course file not found: ${coursePath}`);
        return;
    }

    const courseData = JSON.parse(fs.readFileSync(coursePath, 'utf8'));
    const { title, description, course_overview, course_outline, difficulty, duration, price, modules } = courseData;

    // 1. Fetch/Update Course and Get Real ID
    console.log(`Matching course by slug: ${courseSlug}...`);
    const { data: course, error: fetchError } = await supabase
        .from('courses')
        .upsert({
            slug: courseSlug,
            title,
            description,
            course_overview,
            course_outline,
            level: difficulty,
            duration,
            price
        }, { onConflict: 'slug' })
        .select()
        .single();

    if (fetchError || !course) {
        console.error('Error fetching/upserting course:', fetchError);
        return;
    }

    const dbCourseId = course.id;
    console.log(`Using database ID: ${dbCourseId} for ${title}`);

    // 2. Identify Old Data
    console.log('Identifying old structural data...');
    const { data: oldPhases } = await supabase
        .from('phases')
        .select('id')
        .eq('course_id', dbCourseId);

    const phaseIds = oldPhases?.map(p => p.id) || [];

    const { data: oldPhaseLessons } = await supabase
        .from('phase_lessons')
        .select('lesson_id')
        .in('phase_id', phaseIds);

    const lessonIds = oldPhaseLessons?.map(l => l.lesson_id) || [];

    // 3. Purge Old Data (Order matters for FK constraints if not cascading)
    console.log(`Purging ${lessonIds.length} lessons and ${phaseIds.length} phases...`);

    if (lessonIds.length > 0) {
        await supabase.from('quiz_submissions').delete().in('lesson_id', lessonIds);
        await supabase.from('questions').delete().in('lesson_id', lessonIds);
        await supabase.from('lesson_progress').delete().in('lesson_id', lessonIds);
        await supabase.from('phase_lessons').delete().in('lesson_id', lessonIds);
        await supabase.from('lessons').delete().in('id', lessonIds);
    }

    if (phaseIds.length > 0) {
        await supabase.from('phases').delete().eq('course_id', dbCourseId);
    }

    // 4. Rebuild Hierarchy
    console.log('Rebuilding curriculum structure...');

    // Group modules by Phase
    const phasesMap = new Map<string, any[]>();
    modules.forEach((mod: any) => {
        if (!phasesMap.has(mod.phase)) {
            phasesMap.set(mod.phase, []);
        }
        phasesMap.get(mod.phase)!.push(mod);
    });

    let phaseOrder = 1;
    for (const [phaseTitle, phaseModules] of phasesMap.entries()) {
        console.log(`  Inserting Phase: ${phaseTitle}`);
        const { data: phase, error: pError } = await supabase
            .from('phases')
            .insert({
                course_id: dbCourseId,
                title: phaseTitle,
                order_index: phaseOrder++
            })
            .select()
            .single();

        if (pError) {
            console.error(`Error inserting phase ${phaseTitle}:`, pError);
            continue;
        }

        let lessonOrder = 1;
        for (const mod of phaseModules) {
            console.log(`    Processing Lesson: ${mod.title}`);
            const lessonFilePath = path.join(process.cwd(), '..', '.docs', 'content', mod.source_file);
            if (!fs.existsSync(lessonFilePath)) {
                console.warn(`      Lesson file missing: ${lessonFilePath}`);
                continue;
            }

            const lessonContent = JSON.parse(fs.readFileSync(lessonFilePath, 'utf8'));

            // Insert Lesson
            const { data: lesson, error: lError } = await supabase
                .from('lessons')
                .insert({
                    title: lessonContent.title,
                    content: lessonContent.content || '',
                    video_url: lessonContent.video_url || '',
                    has_project: lessonContent.has_project || false,
                    duration_minutes: lessonContent.duration_minutes || 30
                })
                .select()
                .single();

            if (lError) {
                console.error(`      Error inserting lesson ${mod.title}:`, lError);
                continue;
            }

            // Link to Phase
            const { error: plError } = await supabase
                .from('phase_lessons')
                .insert({
                    phase_id: phase.id,
                    lesson_id: lesson.id,
                    order_index: lessonOrder++
                });

            if (plError) console.error(`      Error linking lesson to phase:`, plError);

            // Insert Quiz Questions
            if (lessonContent.questions && lessonContent.questions.length > 0) {
                console.log(`      Inserting ${lessonContent.questions.length} quiz questions...`);
                const questionsToInsert = lessonContent.questions.map((q: any) => ({
                    lesson_id: lesson.id,
                    question_text: q.question_text,
                    options: q.options,
                    correct_answer: q.correct_answer,
                    explanation: q.explanation || ''
                }));

                const { error: qError } = await supabase
                    .from('questions')
                    .insert(questionsToInsert);

                if (qError) console.error(`      Error inserting quiz questions:`, qError);
            }
        }
    }

    console.log(`✅ ${courseSlug} sync complete!`);
}

async function runSync() {
    const coursesToSync = ['fullstack', 'web-foundations', 'react-frontend', 'backend-api'];
    for (const slug of coursesToSync) {
        await syncCourse(slug);
    }
}

runSync().catch(err => {
    console.error('Fatal sync error:', err);
    process.exit(1);
});
