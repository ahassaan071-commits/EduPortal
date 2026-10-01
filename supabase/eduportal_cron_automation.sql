-- EduPortal: Database-side automation
-- Run this file once in Supabase SQL Editor.
-- pg_cron uses UTC; the functions themselves use Asia/Karachi for date logic.

create extension if not exists pg_cron;

-- =========================================================
-- 1) AUTO-ABSENT
-- Runs after 12:00 PM Pakistan time on working days.
-- Weekends and active holidays are skipped.
-- Existing attendance is never overwritten.
-- =========================================================

create or replace function public.eduportal_auto_mark_absent()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
    v_today date;
    v_inserted integer := 0;
begin
    v_today := timezone('Asia/Karachi', now())::date;

    -- Monday-Friday only.
    if extract(isodow from v_today) not between 1 and 5 then
        return 0;
    end if;

    -- Skip active holidays.
    if exists (
        select 1
        from public.holidays h
        where h.holiday_date = v_today
          and h.is_active = true
    ) then
        return 0;
    end if;

    insert into public.attendance (
        student_id,
        attendance_date,
        status,
        check_in_time,
        check_out_time
    )
    select
        s.id,
        v_today,
        'Absent',
        null,
        null
    from public.students s
    where not exists (
        select 1
        from public.attendance a
        where a.student_id = s.id
          and a.attendance_date = v_today
    )
    on conflict (student_id, attendance_date) do nothing;

    get diagnostics v_inserted = row_count;
    return v_inserted;
end;
$$;

revoke all on function public.eduportal_auto_mark_absent() from public;
revoke all on function public.eduportal_auto_mark_absent() from anon;
revoke all on function public.eduportal_auto_mark_absent() from authenticated;

-- =========================================================
-- 2) MONTHLY FEE GENERATION
-- Runs at 12:05 AM Pakistan time every day.
-- The function itself only acts when Pakistan date = 1st.
-- Active students with monthly_fee > 0 get one record.
-- Previous outstanding balance rolls into the new fee.
-- =========================================================

create or replace function public.eduportal_generate_monthly_fees()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
    v_today date;
    v_fee_period date;
    v_due_date date;
    v_month text;
    v_inserted integer := 0;
begin
    v_today := timezone('Asia/Karachi', now())::date;

    -- Safety guard: monthly fees are generated only on the 1st.
    if extract(day from v_today) <> 1 then
        return 0;
    end if;

    v_fee_period := date_trunc('month', v_today)::date;
    v_due_date := v_fee_period + 9;
    v_month := to_char(v_fee_period, 'FMMonth');

    with active_students as (
        select
            s.id,
            s.student_id,
            s.name,
            s.student_class,
            s.section,
            coalesce(s.monthly_fee, 0)::numeric as monthly_fee
        from public.students s
        where s.status = 'Active'
          and coalesce(s.monthly_fee, 0) > 0
    ),
    previous_balances as (
        select distinct on (fr.student_id)
            fr.student_id,
            coalesce(fr.remaining_amount, 0)::numeric as previous_balance
        from public.fee_records fr
        join active_students s
          on s.id = fr.student_id
        order by fr.student_id, fr.created_at desc nulls last
    )
    insert into public.fee_records (
        id,
        student_id,
        student_name,
        student_class,
        section,
        month,
        fee_period,
        fee_generated_date,
        fee_amount,
        paid_amount,
        remaining_amount,
        due_date,
        payment_method,
        payment_date,
        status,
        fee_source,
        created_at
    )
    select
        'AUTO-' || s.student_id || '-' || to_char(v_fee_period, 'YYYY-MM-DD'),
        s.id,
        s.name,
        s.student_class,
        s.section,
        v_month,
        v_fee_period,
        v_today,
        s.monthly_fee + coalesce(p.previous_balance, 0),
        0,
        s.monthly_fee + coalesce(p.previous_balance, 0),
        v_due_date,
        null,
        null,
        'Unpaid',
        'Auto - Monthly',
        now()
    from active_students s
    left join previous_balances p
      on p.student_id = s.id
    on conflict (id) do nothing;

    get diagnostics v_inserted = row_count;
    return v_inserted;
end;
$$;

revoke all on function public.eduportal_generate_monthly_fees() from public;
revoke all on function public.eduportal_generate_monthly_fees() from anon;
revoke all on function public.eduportal_generate_monthly_fees() from authenticated;

-- =========================================================
-- 3) CRON JOBS
-- Supabase databases use UTC by default.
--
-- Auto absent:
-- 07:00-18:45 UTC = 12:00-23:45 Pakistan time
-- every 15 minutes, Monday-Friday.
--
-- Monthly fee:
-- 19:05 UTC = 00:05 Pakistan time on the next local day.
-- The function checks that Pakistan local date is the 1st.
-- =========================================================

select cron.unschedule('eduportal-auto-absent')
where exists (
    select 1 from cron.job where jobname = 'eduportal-auto-absent'
);

select cron.unschedule('eduportal-monthly-fee')
where exists (
    select 1 from cron.job where jobname = 'eduportal-monthly-fee'
);

select cron.schedule(
    'eduportal-auto-absent',
    '*/15 7-18 * * 1-5',
    $$select public.eduportal_auto_mark_absent();$$
);

select cron.schedule(
    'eduportal-monthly-fee',
    '5 19 * * *',
    $$select public.eduportal_generate_monthly_fees();$$
);

-- =========================================================
-- 4) VERIFICATION
-- =========================================================

select
    jobid,
    jobname,
    schedule,
    active,
    command
from cron.job
where jobname in (
    'eduportal-auto-absent',
    'eduportal-monthly-fee'
)
order by jobname;
