import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: corsHeaders });

const clean = (value: unknown) => String(value ?? "").trim();

function monthStartPakistan() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Karachi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);

  const get = (type: string) => parts.find(p => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-01`;
}

async function classifyQuestion(question: string, apiKey: string) {
  const prompt = `
You are the intent classifier for EduPortal Admin AI.
Return ONLY valid JSON. Do not answer the user's question.

Allowed intents:
- student_search: find student by name or student ID. params: {query}
- student_summary: complete summary for one student. params: {query}
- students_list: list students, optionally filtered by class/section. params: {className?, section?}
- teacher_search: find teacher by name or username. params: {query}
- teachers_list: list teachers.
- attendance_today: today's attendance summary.
- low_attendance: students below a percentage. params: {percentage}
- unpaid_fees: students with unpaid/partial/outstanding fees.
- fee_summary: fee collection summary for the current month.
- dashboard_summary: overall admin summary.
- unknown: cannot safely map.

User question: ${question}

JSON format:
{"intent":"...", "params":{...}}
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("AI returned an empty response.");

  return JSON.parse(text);
}

async function runIntent(supabase: any, intent: string, params: any) {
  const query = clean(params?.query);

  if (intent === "students_list") {
    let q = supabase.from("students")
      .select("student_id,name,student_class,section,status,mobile,email")
      .order("name", { ascending: true })
      .limit(100);

    if (clean(params?.className)) q = q.eq("student_class", clean(params.className));
    if (clean(params?.section)) q = q.eq("section", clean(params.section));

    const { data, error } = await q;
    if (error) throw error;
    return { title: "Students", rows: data ?? [] };
  }

  if (intent === "student_search" || intent === "student_summary") {
    if (!query) return { title: "Student Search", rows: [] };

    const { data, error } = await supabase.from("students")
      .select("id,student_id,name,student_class,section,status,mobile,email,monthly_fee")
      .or(`student_id.ilike.%${query}%,name.ilike.%${query}%,username.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;

    if (intent === "student_summary" && data?.length) {
      const student = data[0];

      const [attendance, fees, results, assignments] = await Promise.all([
        supabase.from("attendance")
          .select("attendance_date,status,check_in_time,check_out_time")
          .eq("student_id", student.id)
          .order("attendance_date", { ascending: false })
          .limit(200),
        supabase.from("fee_records")
          .select("fee_period,month,fee_amount,paid_amount,remaining_amount,due_date,status")
          .eq("student_id", student.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase.from("results")
          .select("*")
          .eq("student_id", student.id)
          .limit(50),
        supabase.from("assignments")
          .select("*")
          .limit(100)
      ]);

      return {
        title: `Student Summary — ${student.name}`,
        student,
        attendance: attendance.data ?? [],
        fees: fees.data ?? [],
        results: results.data ?? [],
        assignments: assignments.data ?? []
      };
    }

    return { title: "Student Search", rows: data ?? [] };
  }

  if (intent === "teachers_list") {
    const { data, error } = await supabase.from("teachers")
      .select("teacher_id,name,username,subject,status,email,mobile")
      .order("name", { ascending: true })
      .limit(100);
    if (error) throw error;
    return { title: "Teachers", rows: data ?? [] };
  }

  if (intent === "teacher_search") {
    if (!query) return { title: "Teacher Search", rows: [] };
    const { data, error } = await supabase.from("teachers")
      .select("teacher_id,name,username,subject,status,email,mobile")
      .or(`name.ilike.%${query}%,username.ilike.%${query}%,teacher_id.ilike.%${query}%`)
      .limit(20);
    if (error) throw error;
    return { title: "Teacher Search", rows: data ?? [] };
  }

  if (intent === "attendance_today") {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Karachi"
    }).format(new Date());

    const { data, error } = await supabase.from("attendance")
      .select("student_id,status,attendance_date,check_in_time,check_out_time")
      .eq("attendance_date", today)
      .limit(5000);

    if (error) throw error;

    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      const key = clean(row.status) || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    }

    return { title: `Attendance — ${today}`, counts, rows: data ?? [] };
  }

  if (intent === "low_attendance") {
    const percentage = Number(params?.percentage ?? 75);
    const { data: students, error: se } = await supabase.from("students")
      .select("id,student_id,name,student_class,section,status")
      .eq("status", "Active")
      .limit(500);
    if (se) throw se;

    const { data: records, error: ae } = await supabase.from("attendance")
      .select("student_id,status")
      .limit(10000);
    if (ae) throw ae;

    const stats = new Map<string, { present: number; total: number }>();
    for (const row of records ?? []) {
      const item = stats.get(row.student_id) ?? { present: 0, total: 0 };
      if (["present", "absent", "late"].includes(clean(row.status).toLowerCase())) {
        item.total++;
        if (clean(row.status).toLowerCase() === "present") item.present++;
      }
      stats.set(row.student_id, item);
    }

    const rows = (students ?? []).map((s: any) => {
      const stat = stats.get(s.id) ?? { present: 0, total: 0 };
      const attendancePercentage = stat.total ? Math.round((stat.present / stat.total) * 100) : 0;
      return { ...s, attendance_percentage: attendancePercentage };
    }).filter((s: any) => s.attendance_percentage < percentage);

    return { title: `Students Below ${percentage}% Attendance`, rows };
  }

  if (intent === "unpaid_fees") {
    const { data, error } = await supabase.from("fee_records")
      .select("student_id,student_name,student_class,section,fee_period,fee_amount,paid_amount,remaining_amount,due_date,status")
      .gt("remaining_amount", 0)
      .order("due_date", { ascending: true })
      .limit(500);
    if (error) throw error;
    return { title: "Outstanding Fees", rows: data ?? [] };
  }

  if (intent === "fee_summary") {
    const period = monthStartPakistan();
    const { data, error } = await supabase.from("fee_records")
      .select("fee_amount,paid_amount,remaining_amount,status")
      .eq("fee_period", period)
      .limit(5000);
    if (error) throw error;

    const rows = data ?? [];
    return {
      title: `Fee Summary — ${period}`,
      summary: {
        records: rows.length,
        total_fee: rows.reduce((n: number, r: any) => n + Number(r.fee_amount || 0), 0),
        total_paid: rows.reduce((n: number, r: any) => n + Number(r.paid_amount || 0), 0),
        total_remaining: rows.reduce((n: number, r: any) => n + Number(r.remaining_amount || 0), 0)
      },
      rows
    };
  }

  if (intent === "dashboard_summary") {
    const [students, teachers, attendance, fees] = await Promise.all([
      supabase.from("students").select("id", { count: "exact", head: true }),
      supabase.from("teachers").select("id", { count: "exact", head: true }),
      supabase.from("attendance").select("status").eq(
        "attendance_date",
        new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Karachi" }).format(new Date())
      ),
      supabase.from("fee_records").select("paid_amount,remaining_amount").limit(5000)
    ]);

    if (students.error) throw students.error;
    if (teachers.error) throw teachers.error;
    if (attendance.error) throw attendance.error;
    if (fees.error) throw fees.error;

    const attendanceCounts: Record<string, number> = {};
    for (const row of attendance.data ?? []) {
      const key = clean(row.status) || "Unknown";
      attendanceCounts[key] = (attendanceCounts[key] || 0) + 1;
    }

    return {
      title: "EduPortal Dashboard Summary",
      summary: {
        total_students: students.count ?? 0,
        total_teachers: teachers.count ?? 0,
        today_attendance: attendanceCounts,
        total_paid: (fees.data ?? []).reduce((n: number, r: any) => n + Number(r.paid_amount || 0), 0),
        total_remaining: (fees.data ?? []).reduce((n: number, r: any) => n + Number(r.remaining_amount || 0), 0)
      }
    };
  }

  return { title: "EduPortal AI", message: "I could not safely map that request to an EduPortal data query." };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const body = await req.json();
    const username = clean(body?.username);
    const password = clean(body?.password);
    const question = clean(body?.question);

    if (!username || !password || !question) {
      return json({ error: "Admin credentials and question are required." }, 400);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const secretKeysRaw = Deno.env.get("SUPABASE_SECRET_KEYS");
    const geminiKey = Deno.env.get("GEMINI_API_KEY");

    if (!supabaseUrl || !secretKeysRaw || !geminiKey) {
      return json({ error: "AI service is not configured yet. Add GEMINI_API_KEY to Supabase Edge Function secrets." }, 503);
    }

    const secretKeys = JSON.parse(secretKeysRaw);
    const secretKey = secretKeys.default;

    const supabase = createClient(supabaseUrl, secretKey);

    const { data: admins, error: adminError } = await supabase.from("admins")
      .select("id,username,password,status")
      .ilike("username", username)
      .limit(1);

    if (adminError) throw adminError;

    const admin = admins?.[0];

    if (!admin || clean(admin.password) !== password ||
        ["inactive", "disabled"].includes(clean(admin.status).toLowerCase())) {
      return json({ error: "Administrator verification failed." }, 401);
    }

    const classified = await classifyQuestion(question, geminiKey);
    const result = await runIntent(supabase, classified.intent, classified.params || {});

    return json({
      success: true,
      intent: classified.intent,
      result
    });
  } catch (error) {
    console.error("ADMIN AI ERROR:", error);
    return json({
      error: error instanceof Error ? error.message : "AI request failed."
    }, 500);
  }
});
