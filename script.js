// =====================================================
// EDUPORTAL - SUPABASE CONNECTION
// =====================================================

const SUPABASE_URL =
    "https://aylpjvqlowuvbmkqxfcx.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_IHWuUtXJ3UlmKtQlSC3XXw_GbxKq-1s";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

console.log("EduPortal Supabase connected ✅");

// =====================================================
// CLASS + SECTION DISPLAY HELPER
// =====================================================

function formatClassSection(className, section) {

    const cls = String(className || "").trim();
    const sec = String(section || "").trim();

    if (!cls) return "—";

    if (!sec) return cls;

    return `${cls} ${sec}`;
}


// Convert: "9th A" → class = "9th", section = "A"
function parseClassSection(value) {

    const text = String(value || "")
        .trim()
        .replace(/\s+/g, " ");

    if (!text) {
        return {
            className: "",
            section: ""
        };
    }

    const match =
        text.match(/^(.+?)\s+([A-Za-z])$/);

    if (match) {

        return {
            className: match[1].trim(),
            section: match[2].trim().toUpperCase()
        };

    }

    return {
        className: text,
        section: ""
    };
}

function eduPortalShowOnly(activeId) {

  

    const allDashboards = ["studentDashboard", "adminDashboard", "teacherDashboard"];
    const loginContainer = document.querySelector(".container");
    if (loginContainer) {
        loginContainer.classList.add("session-hidden");
        loginContainer.style.setProperty("display", "none", "important");
        loginContainer.style.setProperty("visibility", "hidden", "important");
        loginContainer.style.setProperty("opacity", "0", "important");
    }
    allDashboards.forEach(function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        if (id === activeId) {
            el.style.setProperty("display", "block", "important");
            el.style.setProperty("visibility", "visible", "important");
            el.style.setProperty("opacity", "1", "important");
        } else {
            el.style.setProperty("display", "none", "important");
            el.style.setProperty("visibility", "hidden", "important");
            el.style.setProperty("opacity", "0", "important");
        }
    });
}

function eduPortalShowLogin() {

    // Remove refresh/session classes
    document.documentElement.classList.remove(
        "edu-session-restoring"
    );

    document.documentElement.classList.remove(
        "edu-role-administrator"
    );

    document.documentElement.classList.remove(
        "edu-role-teacher"
    );

    document.documentElement.classList.remove(
        "edu-role-student"
    );


    // Hide ALL dashboards
    [
        "studentDashboard",
        "adminDashboard",
        "teacherDashboard"
    ].forEach(function (id) {

        const el =
            document.getElementById(id);

        if (el) {

            el.style.setProperty(
                "display",
                "none",
                "important"
            );

            el.style.setProperty(
                "visibility",
                "hidden",
                "important"
            );

            el.style.setProperty(
                "opacity",
                "0",
                "important"
            );
        }

    });


    // Show LOGIN container
    const loginContainer =
        document.querySelector(".container");

    if (loginContainer) {

        loginContainer.classList.remove(
            "session-hidden"
        );

        loginContainer.style.setProperty(
            "display",
            "flex",
            "important"
        );

        loginContainer.style.setProperty(
            "visibility",
            "visible",
            "important"
        );

        loginContainer.style.setProperty(
            "opacity",
            "1",
            "important"
        );
    }

}
// ===============================
// EduPortal Student Portal
// ===============================

// Buttons
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

// Forms
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Login Message
const message = document.getElementById("message");
const loginBtn = document.getElementById("loginBtn");
const username = document.getElementById("username");
const rememberMe = document.getElementById("rememberMe");
// ===============================
// Login with Enter Key
// ===============================

document.addEventListener("keydown", function (event) {

if (event.key === "Enter" && loginForm.style.display !== "none") {

event.preventDefault();
loginBtn.click();

}

});


// ===============================
// Switch to Login Form
// ===============================

loginTab.addEventListener("click", function () {

loginForm.style.display = "block";
registerForm.style.display = "none";

loginTab.classList.add("active");
registerTab.classList.remove("active");

});
// ==========================================
// EDUPORTAL LOGIN SYSTEM
// ADMIN + TEACHER + STUDENT
// ==========================================

loginBtn.addEventListener("click", async function () {

    const selectedRole =
        document.getElementById("loginRole").value;

    const enteredUsername =
        document.getElementById("username").value.trim();

    const enteredPassword =
        document.getElementById("password").value.trim();

    const messageElement =
        document.getElementById("message");

    if (!enteredUsername || !enteredPassword) {
        messageElement.style.color = "red";
        messageElement.textContent =
            "Please enter username and password.";
        return;
    }

    let account = null;

    // ==========================================
    // ADMINISTRATOR
    // ==========================================
if (selectedRole === "administrator") {

    // Always check Administrator account from Supabase first
    try {

        const usernameToFind =
            String(enteredUsername || "")
                .trim();

        const result =
            await supabaseClient
                .from("admins")
                .select("*")
                .ilike(
                    "username",
                    usernameToFind
                )
                .limit(1);

        if (result.error) {

            console.error(
                "Administrator database error:",
                result.error
            );

            messageElement.style.color = "red";

            messageElement.textContent =
                "Administrator login error: " +
                result.error.message;

            return;
        }

        if (
            result.data &&
            result.data.length > 0
        ) {

            account =
                result.data[0];

        }

    } catch (error) {

        console.error(
            "Administrator database error:",
            error
        );

        messageElement.style.color = "red";

        messageElement.textContent =
            "Unable to connect to Administrator account.";

        return;
    }


    if (!account) {

        messageElement.style.color = "red";

        messageElement.textContent =
            "Administrator account not found.";

        return;
    }

}
// ==========================================
// TEACHER
// ==========================================

else if (selectedRole === "teacher") {

    // ==========================================
    // FIRST: CHECK SUPABASE
    // ==========================================

    try {

        const result =
            await supabaseClient
                .from("teachers")
                .select("*")
                .ilike(
                    "username",
                    enteredUsername
                )
                .limit(1);

        if (
            !result.error &&
            result.data &&
            result.data.length > 0
        ) {

            account =
                result.data[0];

        }

    } catch (error) {

        console.error(
            "Teacher Supabase login error:",
            error
        );

    }


// ==========================================
// TEACHER LOGIN
// SUPABASE ONLY
// ==========================================

// Teacher account must exist in Supabase.
// No LocalStorage fallback is used.
    if (!account) {

        messageElement.style.color =
            "red";

        messageElement.textContent =
            "Teacher account not found.";

        return;
    }
}

    // ==========================================
    // STUDENT
    // ==========================================

    else {

        try {

            const result =
                await supabaseClient
                    .from("students")
                    .select("*")
                    .ilike(
                        "username",
                        enteredUsername
                    )
                    .limit(1);

            if (
                !result.error &&
                result.data &&
                result.data.length > 0
            ) {
                account = result.data[0];
            }

        } catch (error) {

            console.error(
                "Student database error:",
                error
            );
        }
// ==========================================
// STUDENT LOGIN
// SUPABASE ONLY
// ==========================================

// Student account must exist in Supabase.
// No LocalStorage fallback is used.

        if (!account) {

            messageElement.style.color = "red";
            messageElement.textContent =
                "Student account not found.";
            return;
        }
    }

    // ==========================================
    // PASSWORD CHECK
    // ==========================================

    const savedPassword =
        String(account.password || "");

    if (
        enteredPassword !==
        savedPassword
    ) {

        messageElement.style.color = "red";
        messageElement.textContent =
            "Invalid Username or Password ❌";

        return;
    }

    // ==========================================
    // STATUS CHECK
    // ==========================================

    if (
        String(account.status || "Active")
            .trim()
            .toLowerCase() === "inactive"
    ) {

        messageElement.style.color = "red";
        messageElement.textContent =
            "This account is inactive.";

        return;
    }

    // ==========================================
    // LOGIN SUCCESS
    // ==========================================

    messageElement.style.color = "green";
    messageElement.textContent =
        "Login Successful ✅";

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );

    localStorage.setItem(
        "loggedInRole",
        selectedRole
    );

// ==========================================
// 30 MINUTE SESSION START
// ==========================================

localStorage.setItem(
    "lastActivityAt",
    String(Date.now())
);

// ==========================================
// ADMIN SESSION
// ==========================================

if (selectedRole === "administrator") {

    localStorage.setItem(
        "adminAccount",
        JSON.stringify(account)
    );

    eduPortalShowOnly("adminDashboard");

    const adminName =
        document.getElementById("adminName");

    if (adminName) {
        adminName.textContent =
            "Welcome, " +
            (
                account.fullName ||
                account.full_name ||
                account.name ||
                "Administrator"
            ) +
            " 👋";
    }

    if (
        typeof syncFinalAdminDashboard ===
        "function"
    ) {
        syncFinalAdminDashboard();
    }

   

    return;
}
 // ==========================================
// TEACHER SESSION
// ==========================================

if (selectedRole === "teacher") {

    // ------------------------------------------
    // SAVE LOGGED-IN TEACHER
    // ------------------------------------------

    localStorage.setItem(
        "loggedInTeacher",
        JSON.stringify(account)
    );

    localStorage.setItem(
        "loggedInRole",
        "teacher"
    );

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );

    // ------------------------------------------
// SHOW TEACHER DASHBOARD
// ------------------------------------------

eduPortalShowOnly(
    "teacherDashboard"
);

const teacherDashboard =
    document.getElementById(
        "teacherDashboard"
    );

if (teacherDashboard) {

    teacherDashboard.style.setProperty(
        "display",
        "flex",
        "important"
    );

    teacherDashboard.style.setProperty(
        "visibility",
        "visible",
        "important"
    );

    teacherDashboard.style.setProperty(
        "opacity",
        "1",
        "important"
    );

    teacherDashboard.style.setProperty(
        "position",
        "relative",
        "important"
    );

    teacherDashboard.style.setProperty(
        "width",
        "100%",
        "important"
    );

    teacherDashboard.style.setProperty(
        "min-height",
        "100vh",
        "important"
    );
}

   setTimeout(function () {

    if (typeof loadTeacherProfile === "function") {
        loadTeacherProfile();
    }

    if (typeof loadTeacherAssignmentClass === "function") {
        loadTeacherAssignmentClass();
    }

    if (typeof loadTeacherDashboardData === "function") {
        loadTeacherDashboardData();
    }

   

}, 300);

    return;
}

 // ==========================================
// STUDENT SESSION
// NORMALIZE SUPABASE DATA
// ==========================================

if (selectedRole === "student") {

    const studentSession = {

        // DATABASE ID
        id:
            account.id,

        // STUDENT ID
        studentId:
            account.student_id ||
            account.studentId ||
            "",

        // NAME
        fullName:
            account.name ||
            account.fullName ||
            "Student",

        // FATHER NAME
        fatherName:
            account.father_name ||
            account.fatherName ||
            "",

        // CLASS
        studentClass:
            account.student_class ||
            account.studentClass ||
            "",

        // SECTION
        section:
            account.section ||
            "",

        // ROLL NUMBER
        rollNumber:
            account.roll_number ||
            account.rollNumber ||
            "",

        // DOB
        dob:
            account.date_of_birth ||
            account.dob ||
            "",

        // EMAIL
        email:
            account.email ||
            "",

        // MOBILE
        mobile:
            account.mobile ||
            "",

        // USERNAME
        username:
            account.username ||
            "",

        // PASSWORD
        password:
            account.password ||
            "",

        // STATUS
        status:
            account.status ||
            "Active",

        // DATABASE CREATED DATE
        createdAt:
            account.created_at ||
            account.createdAt ||
            ""
    };


    // ==========================================
    // SAVE NORMALIZED STUDENT SESSION
    // ==========================================

    localStorage.setItem(
        "loggedInStudent",
        JSON.stringify(
            studentSession
        )
    );


    // Also keep compatibility with old code
    localStorage.setItem(
        "studentAccount",
        JSON.stringify(
            studentSession
        )
    );


setTimeout(async function () {

    eduPortalShowOnly("studentDashboard");

    if (typeof updateDashboardStats === "function") {
        updateDashboardStats();
    }

    if (
        typeof StudentDashboard !== "undefined" &&
        typeof StudentDashboard.loadDashboard === "function"
    ) {
        await StudentDashboard.loadDashboard(
            studentSession
        );
    }

  

}, 300);

}

});
// ===============================
// Logout
// ===============================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {
localStorage.removeItem("isLoggedIn");
eduPortalShowLogin();

localStorage.removeItem("loggedInRole");
localStorage.removeItem("loggedInStudent");

document.getElementById("studentDashboard").style.setProperty(
    "display",
    "none",
    "important"
);

document.querySelector(".container").style.setProperty(
    "display",
    "flex",
    "important"
);

document.querySelector(".container").style.setProperty(
    "visibility",
    "visible",
    "important"
);

document.querySelector(".container").style.setProperty(
    "opacity",
    "1",
    "important"
);
username.value = "";
password.value = "";
message.textContent = "";

});
// ===============================
// Show / Hide Password
// ===============================

function togglePassword(inputId, iconId) {

const input = document.getElementById(inputId);

const icon = document.getElementById(iconId);

icon.addEventListener("click", function () {

if (input.type === "password") {

input.type = "text";

icon.textContent = "🙈";

} else {

input.type = "password";

icon.textContent = "👁️";

}

});

}

togglePassword("password", "togglePassword");

togglePassword("newPassword", "toggleNewPassword");

togglePassword("confirmPassword", "toggleConfirmPassword");
// ===============================
// User Management Teacher Password
// SUPABASE LIVE DATA
// ===============================

async function toggleTeacherPassword(
    teacherId,
    button
) {

    const passwordElement =
        document.getElementById(
            "teacherPassword-" +
            teacherId
        );


    if (!passwordElement) {
        return;
    }


    // ==========================================
    // IF PASSWORD ALREADY VISIBLE
    // ==========================================

    if (
        passwordElement.textContent.trim() !==
        "••••••••"
    ) {

        passwordElement.textContent =
            "••••••••";

        button.textContent =
            "👁️";

        return;
    }


    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        alert(
            "Supabase connection is missing."
        );

        return;
    }


    // ==========================================
    // LOAD TEACHER
    // ==========================================

    const {
        data: teacher,
        error
    } =
        await supabaseClient
            .from("teachers")
            .select(
                "password"
            )
            .eq(
                "id",
                teacherId
            )
            .maybeSingle();


    if (error) {

        console.error(
            "TEACHER PASSWORD LOAD ERROR:",
            error
        );

        alert(
            "Unable to load teacher password.\n\n" +
            error.message
        );

        return;
    }


    if (!teacher) {

        alert(
            "Teacher record not found."
        );

        return;
    }


    // ==========================================
    // SHOW PASSWORD
    // ==========================================

    passwordElement.textContent =
        teacher.password ||
        "Not Set";

    button.textContent =
        "🙈";

}

// =====================================================
// EDUPORTAL - 10 MINUTE INACTIVITY AUTO LOGOUT
// ADMIN + TEACHER + STUDENT
// =====================================================

(function () {

    const INACTIVITY_LIMIT =
        10 * 60 * 1000;


    // ==========================================
    // LOGOUT
    // ==========================================

    function eduPortalAutoLogout() {

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("loggedInRole");

        localStorage.removeItem("adminAccount");
        localStorage.removeItem("loggedInTeacher");
        localStorage.removeItem("loggedInStudent");
        localStorage.removeItem("studentAccount");

        localStorage.removeItem("lastActivityAt");
        localStorage.removeItem("sessionStartedAt");


        if (
            typeof eduPortalShowLogin ===
            "function"
        ) {
            eduPortalShowLogin();
        }

    }


    // ==========================================
    // CHECK INACTIVITY
    // ==========================================

    function checkInactivity() {

        const isLoggedIn =
            localStorage.getItem(
                "isLoggedIn"
            );

        const lastActivityAt =
            Number(
                localStorage.getItem(
                    "lastActivityAt"
                )
            );


        if (
            isLoggedIn !== "true" ||
            !lastActivityAt
        ) {
            return;
        }


        const inactiveTime =
            Date.now() -
            lastActivityAt;


        if (
            inactiveTime >=
            INACTIVITY_LIMIT
        ) {

            eduPortalAutoLogout();

        }

    }


    // ==========================================
    // UPDATE LAST ACTIVITY
    // ==========================================

    let activityTimer = null;


    function updateActivity() {

        if (
            localStorage.getItem(
                "isLoggedIn"
            ) !== "true"
        ) {
            return;
        }


        if (activityTimer) {
            return;
        }


        activityTimer =
            setTimeout(
                function () {

                    localStorage.setItem(
                        "lastActivityAt",
                        String(
                            Date.now()
                        )
                    );

                    activityTimer = null;

                },
                1000
            );

    }


    // ==========================================
    // USER ACTIVITY EVENTS
    // ==========================================

    [
        "mousemove",
        "mousedown",
        "keydown",
        "scroll",
        "touchstart",
        "click"
    ].forEach(
        function (eventName) {

            document.addEventListener(
                eventName,
                updateActivity,
                {
                    passive: true
                }
            );

        }
    );


    // ==========================================
    // CHECK EVERY 10 SECONDS
    // ==========================================

    setInterval(
        checkInactivity,
        10000
    );


    // ==========================================
    // CHECK WHEN TAB BECOMES ACTIVE
    // ==========================================

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.visibilityState ===
                "visible"
            ) {

                checkInactivity();

            }

        }
    );


    // ==========================================
    // CHECK WHEN WINDOW OPENS / GETS FOCUS
    // ==========================================

    window.addEventListener(
        "focus",
        function () {

            checkInactivity();

        }
    );


    // ==========================================
    // IMPORTANT:
    // CHECK IMMEDIATELY WHEN PORTAL OPENS
    // ==========================================

    checkInactivity();

})();
// =====================================================
// EDUPORTAL - SINGLE SESSION RESTORE CONTROLLER
// =====================================================

document.addEventListener("DOMContentLoaded", async function () {

    const isLoggedIn =
        localStorage.getItem(
            "isLoggedIn"
        );

    const role =
        localStorage.getItem(
            "loggedInRole"
        );

    // =================================================
    // NO ACTIVE LOGIN
    // =================================================

    if (isLoggedIn !== "true" || !role) {

        eduPortalShowLogin();

        return;
    }


    // =================================================
    // ADMINISTRATOR
    // =================================================

    if (role === "administrator") {

        let admin =
            JSON.parse(
                localStorage.getItem("adminAccount")
            ) || null;


        if (!admin || !admin.id) {

            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("loggedInRole");
            localStorage.removeItem("adminAccount");

            eduPortalShowLogin();

            return;
        }


        // ---------------------------------------------
        // Verify Admin from Supabase
        // ---------------------------------------------

        try {

            const {
                data,
                error
            } = await supabaseClient
                .from("admins")
                .select("*")
                .eq("id", admin.id)
                .limit(1);

if (
    error ||
    !data ||
    data.length === 0
) {

    console.warn(
        "Admin Supabase verification failed. Keeping existing login session."
    );

    // Keep existing localStorage session
    // Do NOT logout the administrator
}


            admin = data[0];


            localStorage.setItem(
                "adminAccount",
                JSON.stringify(admin)
            );


            // -----------------------------------------
            // SHOW ADMIN
            // -----------------------------------------

            eduPortalShowOnly(
                "adminDashboard"
            );


            const adminDashboard =
                document.getElementById(
                    "adminDashboard"
                );


            if (adminDashboard) {

                adminDashboard.style.setProperty(
                    "position",
                    "relative",
                    "important"
                );

                adminDashboard.style.setProperty(
                    "width",
                    "100%",
                    "important"
                );

                adminDashboard.style.setProperty(
                    "min-height",
                    "100vh",
                    "important"
                );

                adminDashboard.style.setProperty(
                    "overflow",
                    "auto",
                    "important"
                );
            }


            const adminName =
                document.getElementById(
                    "adminName"
                );


            if (adminName) {

                adminName.textContent =
                    "Welcome, " +
                    (
                        admin.fullName ||
                        admin.full_name ||
                        admin.name ||
                        "Administrator"
                    ) +
                    " 👋";
            }


            if (
                typeof syncFinalAdminDashboard ===
                "function"
            ) {

                syncFinalAdminDashboard();
            }


           


        } catch (error) {

            console.error(
                "ADMIN SESSION RESTORE ERROR:",
                error
            );

            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("loggedInRole");
            localStorage.removeItem("adminAccount");

            eduPortalShowLogin();

        }


        return;
    }


    // =================================================
    // TEACHER
    // =================================================

    if (role === "teacher") {

        const teacher =
            JSON.parse(
                localStorage.getItem(
                    "loggedInTeacher"
                )
            ) || null;


        if (!teacher) {

            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("loggedInRole");
            localStorage.removeItem("loggedInTeacher");

            eduPortalShowLogin();

            return;
        }


        // ---------------------------------------------
        // SHOW TEACHER
        // ---------------------------------------------

        eduPortalShowOnly(
            "teacherDashboard"
        );


        const teacherDashboard =
            document.getElementById(
                "teacherDashboard"
            );


        if (teacherDashboard) {

            teacherDashboard.style.setProperty(
                "display",
                "flex",
                "important"
            );

            teacherDashboard.style.setProperty(
                "visibility",
                "visible",
                "important"
            );

            teacherDashboard.style.setProperty(
                "opacity",
                "1",
                "important"
            );

            teacherDashboard.style.setProperty(
                "position",
                "relative",
                "important"
            );

            teacherDashboard.style.setProperty(
                "width",
                "100%",
                "important"
            );

            teacherDashboard.style.setProperty(
                "min-height",
                "100vh",
                "important"
            );
        }


        // ---------------------------------------------
        // LOAD TEACHER DATA
        // ---------------------------------------------

        if (
            typeof loadTeacherProfile ===
            "function"
        ) {

            loadTeacherProfile();
        }


        if (
            typeof loadTeacherAssignmentClass ===
            "function"
        ) {

            loadTeacherAssignmentClass();
        }


        if (
            typeof loadTeacherDashboardData ===
            "function"
        ) {

            loadTeacherDashboardData();
        }


       

        return;
    }


    // =================================================
    // STUDENT
    // =================================================

    if (role === "student") {

        const student =
            JSON.parse(
                localStorage.getItem(
                    "loggedInStudent"
                )
            ) ||
            JSON.parse(
                localStorage.getItem(
                    "studentAccount"
                )
            ) ||
            null;


        if (!student) {

            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("loggedInRole");
            localStorage.removeItem("loggedInStudent");
            localStorage.removeItem("studentAccount");

            eduPortalShowLogin();

            return;
        }


        // ---------------------------------------------
        // SHOW STUDENT
        // ---------------------------------------------

        eduPortalShowOnly(
            "studentDashboard"
        );


        // ---------------------------------------------
        // UPDATE STUDENT NAME
        // ---------------------------------------------

        const studentName =
            document.getElementById(
                "studentName"
            );


        if (studentName) {

            studentName.textContent =
                "Welcome, " +
                (
                    student.fullName ||
                    student.name ||
                    "Student"
                ) +
                " 👋";
        }


        // ---------------------------------------------
        // UPDATE ID CARD
        // ---------------------------------------------

        const idCardName =
            document.getElementById(
                "idCardName"
            );

        if (idCardName) {

            idCardName.textContent =
                student.fullName ||
                student.name ||
                "Student";
        }


        const idCardClass =
            document.getElementById(
                "idCardClass"
            );

        if (idCardClass) {

            idCardClass.textContent =
                student.studentClass ||
                "Not Assigned";
        }


        const studentIdElement =
            document.getElementById(
                "studentId"
            );

        if (studentIdElement) {

            studentIdElement.textContent =
                student.studentId ||
                "";
        }


        // ---------------------------------------------
        // UPDATE PROFILE
        // ---------------------------------------------

        const profileFullName =
            document.getElementById(
                "profileFullName"
            );

        if (profileFullName) {

            profileFullName.textContent =
                student.fullName ||
                student.name ||
                "Student";
        }


        const profileFatherName =
            document.getElementById(
                "profileFatherName"
            );

        if (profileFatherName) {

            profileFatherName.textContent =
                student.fatherName ||
                "—";
        }


        const profileStudentClass =
            document.getElementById(
                "profileStudentClass"
            );

     if (profileStudentClass) {

    profileStudentClass.textContent =
        formatClassSection(
            student.student_class ||
            student.studentClass,

            student.section
        );
}

        const profileRollNumber =
            document.getElementById(
                "profileRollNumber"
            );

        if (profileRollNumber) {

           profileRollNumber.textContent =
    student.roll_number ||
    student.rollNumber ||
    "—";
        }


        const profileDOB =
            document.getElementById(
                "profileDOB"
            );

        if (profileDOB) {

            profileDOB.textContent =
                student.dob ||
                "—";
        }


        const profileEmail =
            document.getElementById(
                "profileEmail"
            );

        if (profileEmail) {

            profileEmail.textContent =
                student.email ||
                "—";
        }


        const profileMobile =
            document.getElementById(
                "profileMobile"
            );

        if (profileMobile) {

            profileMobile.textContent =
                student.mobile ||
                "—";
        }


        if (
            typeof updateDashboardStats ===
            "function"
        ) {

            updateDashboardStats();
        }


       


        return;
    }


    // =================================================
    // UNKNOWN ROLE
    // =================================================

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInRole");

    eduPortalShowLogin();

});
// ===============================
// Profile Image Upload
// ===============================

const profileImageInput = document.getElementById("profileImageInput");
const profileImage = document.getElementById("profileImage");
const profileIcon = document.getElementById("profileIcon");

const headerProfileImage = document.getElementById("headerProfileImage");
const headerProfileIcon = document.getElementById("headerProfileIcon");
// ===============================
// Student ID Card Elements
// ===============================

const idCardImage = document.getElementById("idCardImage");
const idCardIcon = document.getElementById("idCardIcon");
const idCardName = document.getElementById("idCardName");
const idCardClass = document.getElementById("idCardClass");
const studentId = document.getElementById("studentId");
// Load saved image
const savedImage = localStorage.getItem("profileImage");

if (savedImage) {

profileImage.src = savedImage;
headerProfileImage.src = savedImage;
idCardImage.src = savedImage;

profileImage.style.display = "block";
headerProfileImage.style.display = "block";
idCardImage.style.display = "block";
profileIcon.style.display = "none";
headerProfileIcon.style.display = "none";
idCardIcon.style.display = "none";
}

// Upload new image
profileImageInput.addEventListener("change", function () {

const file = this.files[0];

if (!file) return;

const reader = new FileReader();

reader.onload = function (e) {

const imageData = e.target.result;

localStorage.setItem("profileImage", imageData);

profileImage.src = imageData;
headerProfileImage.src = imageData;
idCardImage.src = imageData;

profileImage.style.display = "block";
headerProfileImage.style.display = "block";
idCardImage.style.display = "block";

profileIcon.style.display = "none";
headerProfileIcon.style.display = "none";
idCardIcon.style.display = "none";
};

reader.readAsDataURL(file);

});
// =====================================================
// STUDENT PROFILE
// SUPABASE LIVE SAVE
// =====================================================

const editProfileBtn =
    document.getElementById(
        "editProfileBtn"
    );

const editProfileForm =
    document.getElementById(
        "editProfileForm"
    );

const saveProfileBtn =
    document.getElementById(
        "saveProfileBtn"
    );

const saveProfileImageBtn =
    document.getElementById(
        "saveProfileImageBtn"
    );


// =====================================================
// EDIT PROFILE
// =====================================================

if (editProfileBtn) {

    editProfileBtn.addEventListener(
        "click",
        function () {

            const savedStudent =
                JSON.parse(
                    localStorage.getItem(
                        "studentAccount"
                    )
                );

            if (!savedStudent) {

                alert(
                    "Student account not found."
                );

                return;
            }

            document.getElementById(
                "editFullName"
            ).value =
                savedStudent.fullName || "";

            document.getElementById(
                "editFatherName"
            ).value =
                savedStudent.fatherName || "";

            document.getElementById(
                "editEmail"
            ).value =
                savedStudent.email || "";

            document.getElementById(
                "editMobile"
            ).value =
                savedStudent.mobile || "";
                const editMobileInput =
    document.getElementById("editMobile");

if (editMobileInput) {

    editMobileInput.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(/\D/g, "")
                    .slice(0, 11);

        }
    );

}

            if (editProfileForm) {

                editProfileForm.style.display =
                    "block";

            }

        }
    );

}


// =====================================================
// SAVE PROFILE TO SUPABASE
// =====================================================

if (saveProfileBtn) {

    saveProfileBtn.addEventListener(
        "click",
        async function () {

            const savedStudent =
                JSON.parse(
                    localStorage.getItem(
                        "studentAccount"
                    )
                );

            if (!savedStudent) {

                alert(
                    "Student account not found."
                );

                return;
            }


            const fullName =
                document.getElementById(
                    "editFullName"
                ).value.trim();

            const fatherName =
                document.getElementById(
                    "editFatherName"
                ).value.trim();

            const email =
                document.getElementById(
                    "editEmail"
                ).value.trim();

            const mobile =
                document.getElementById(
                    "editMobile"
                ).value.trim();


            if (!fullName) {

                alert(
                    "Please enter Full Name."
                );

                return;
            }


            if (
                mobile &&
                !/^\d{11}$/.test(
                    mobile
                )
            ) {

                alert(
                    "Mobile number must contain exactly 11 digits."
                );

                return;
            }


            // ==========================================
            // FIND STUDENT DATABASE ID
            // ==========================================

            let databaseStudent = null;


            if (savedStudent.id) {

                const result =
                    await supabaseClient
                        .from("students")
                        .select("*")
                        .eq(
                            "id",
                            savedStudent.id
                        )
                        .maybeSingle();

                if (
                    !result.error &&
                    result.data
                ) {

                    databaseStudent =
                        result.data;

                }

            }


            if (
                !databaseStudent &&
                savedStudent.studentId
            ) {

                const result =
                    await supabaseClient
                        .from("students")
                        .select("*")
                        .eq(
                            "student_id",
                            savedStudent.studentId
                        )
                        .maybeSingle();

                if (
                    !result.error &&
                    result.data
                ) {

                    databaseStudent =
                        result.data;

                }

            }


            if (!databaseStudent) {

                alert(
                    "Student record could not be found in Supabase."
                );

                return;
            }


            // ==========================================
            // UPDATE SUPABASE
            // ==========================================

            const {
                data: updatedStudent,
                error
            } =
                await supabaseClient
                    .from("students")
                    .update({
                        name:
                            fullName,

                        father_name:
                            fatherName,

                        email:
                            email || null,

                        mobile:
                            mobile || null
                    })
                    .eq(
                        "id",
                        databaseStudent.id
                    )
                    .select()
                    .single();


            if (error) {

                console.error(
                    "STUDENT PROFILE SAVE ERROR:",
                    error
                );

                alert(
                    "Profile could not be saved.\n\n" +
                    error.message
                );

                return;
            }


            // ==========================================
            // UPDATE LOCAL SESSION
            // ==========================================

            savedStudent.fullName =
                fullName;

            savedStudent.fatherName =
                fatherName;

            savedStudent.email =
                email;

            savedStudent.mobile =
                mobile;


            localStorage.setItem(
                "studentAccount",
                JSON.stringify(
                    savedStudent
                )
            );

            localStorage.setItem(
                "loggedInStudent",
                JSON.stringify(
                    savedStudent
                )
            );


            // ==========================================
            // UPDATE PROFILE UI
            // ==========================================

            const profileFullName =
                document.getElementById(
                    "profileFullName"
                );

            if (profileFullName) {

                profileFullName.textContent =
                    fullName;

            }


            const profileFatherName =
                document.getElementById(
                    "profileFatherName"
                );

            if (profileFatherName) {

                profileFatherName.textContent =
                    fatherName;

            }


            const profileEmail =
                document.getElementById(
                    "profileEmail"
                );

            if (profileEmail) {

                profileEmail.textContent =
                    email;

            }


            const profileMobile =
                document.getElementById(
                    "profileMobile"
                );

            if (profileMobile) {

                profileMobile.textContent =
                    mobile;

            }


            const studentName =
                document.getElementById(
                    "studentName"
                );

            if (studentName) {

                studentName.textContent =
                    "Welcome, " +
                    fullName +
                    " 👋";

            }


            const greetingText =
                document.getElementById(
                    "greetingText"
                );

            if (greetingText) {

                greetingText.textContent =
                    "Welcome, " +
                    fullName +
                    " 👋";

            }


            if (
                typeof idCardName !==
                "undefined"
            ) {

                idCardName.textContent =
                    fullName;

            }


            // ==========================================
            // CLOSE EDIT FORM
            // ==========================================

            if (editProfileForm) {

                editProfileForm.style.display =
                    "none";

            }


            alert(
                "Profile Updated Successfully ✅"
            );

        }
    );

}


// =====================================================
// PROFILE IMAGE SELECT
// =====================================================

if (profileImageInput) {

    profileImageInput.addEventListener(
        "change",
        function () {

            const file =
                this.files &&
                this.files[0];

            if (!file) {
                return;
            }


            if (
                !file.type.startsWith(
                    "image/"
                )
            ) {

                alert(
                    "Please select a valid image."
                );

                this.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const imageData =
                        event.target.result;


                    // Preview immediately
                    if (profileImage) {

                        profileImage.src =
                            imageData;

                        profileImage.style.display =
                            "block";

                    }


                    if (profileIcon) {

                        profileIcon.style.display =
                            "none";

                    }


                    if (
                        typeof headerProfileImage !==
                        "undefined" &&
                        headerProfileImage
                    ) {

                        headerProfileImage.src =
                            imageData;

                        headerProfileImage.style.display =
                            "block";

                    }


                    if (
                        typeof headerProfileIcon !==
                        "undefined" &&
                        headerProfileIcon
                    ) {

                        headerProfileIcon.style.display =
                            "none";

                    }


                    if (
                        typeof idCardImage !==
                        "undefined" &&
                        idCardImage
                    ) {

                        idCardImage.src =
                            imageData;

                        idCardImage.style.display =
                            "block";

                    }


                    if (
                        typeof idCardIcon !==
                        "undefined" &&
                        idCardIcon
                    ) {

                        idCardIcon.style.display =
                            "none";

                    }


                    // Show Save Profile button
                    if (
                        saveProfileImageBtn
                    ) {

                        saveProfileImageBtn.style.display =
                            "block";

                    }


                    // Temporary image
                    window.pendingStudentProfileImage =
                        imageData;

                };


            reader.readAsDataURL(file);

        }
    );

}


// =====================================================
// SAVE PROFILE PICTURE TO SUPABASE
// =====================================================

if (saveProfileImageBtn) {

    saveProfileImageBtn.addEventListener(
        "click",
        async function () {

            const imageData =
                window.pendingStudentProfileImage;

            if (!imageData) {

                alert(
                    "Please select a profile picture first."
                );

                return;
            }


            const savedStudent =
                JSON.parse(
                    localStorage.getItem(
                        "studentAccount"
                    )
                );


            if (!savedStudent) {

                alert(
                    "Student account not found."
                );

                return;
            }


            let databaseStudent = null;


            if (savedStudent.id) {

                const result =
                    await supabaseClient
                        .from("students")
                        .select("id")
                        .eq(
                            "id",
                            savedStudent.id
                        )
                        .maybeSingle();

                if (
                    !result.error &&
                    result.data
                ) {

                    databaseStudent =
                        result.data;

                }

            }


            if (
                !databaseStudent &&
                savedStudent.studentId
            ) {

                const result =
                    await supabaseClient
                        .from("students")
                        .select("id")
                        .eq(
                            "student_id",
                            savedStudent.studentId
                        )
                        .maybeSingle();

                if (
                    !result.error &&
                    result.data
                ) {

                    databaseStudent =
                        result.data;

                }

            }


            if (!databaseStudent) {

                alert(
                    "Student record could not be found."
                );

                return;
            }


            const {
                error
            } =
                await supabaseClient
                    .from("students")
                    .update({
                        profile_image:
                            imageData
                    })
                    .eq(
                        "id",
                        databaseStudent.id
                    );


            if (error) {

                console.error(
                    "PROFILE IMAGE SAVE ERROR:",
                    error
                );

                alert(
                    "Profile picture could not be saved.\n\n" +
                    error.message
                );

                return;
            }


            localStorage.setItem(
                "profileImage",
                imageData
            );


            savedStudent.profileImage =
                imageData;


            localStorage.setItem(
                "studentAccount",
                JSON.stringify(
                    savedStudent
                )
            );

            localStorage.setItem(
                "loggedInStudent",
                JSON.stringify(
                    savedStudent
                )
            );


            saveProfileImageBtn.style.display =
                "none";

            window.pendingStudentProfileImage =
                null;


            alert(
                "Profile Picture Saved Successfully ✅"
            );

        }
    );

}
// ===============================
// Sidebar Menu Variables
// ===============================

const dashboardMenu = document.getElementById("dashboardMenu");

const profileMenu = document.getElementById("profileMenu");

const attendanceMenu = document.getElementById("attendanceMenu");

const subjectsMenu = document.getElementById("subjectsMenu");

const resultsMenu = document.getElementById("resultsMenu");
const assignmentsMenu = document.getElementById("assignmentsMenu");

const assignmentsSection = document.getElementById("assignmentsSection");

const feeMenu = document.getElementById("feeMenu");

const settingsMenu = document.getElementById("settingsMenu");
// ===============================
// Dashboard Sections Variables
// ===============================

const dashboardCards = document.querySelector("#studentDashboard .dashboard-cards");

const profileSection = document.getElementById("profileSection");

const attendanceSection = document.getElementById("attendanceSection");

const subjectsSection = document.getElementById("subjectsSection");

const resultsSection = document.getElementById("resultsSection");

function setActive(menu){

const sidebarItems = document.querySelectorAll(".sidebar ul li");

sidebarItems.forEach(function(item){

item.classList.remove("active");

});

menu.classList.add("active");

}
// ===============================
// STUDENT DASHBOARD SECTION CONTROL
// ===============================

const studentSectionIds = [
    "profileSection",
    "attendanceSection",
    "subjectsSection",
    "resultsSection",
    "assignmentsSection",
    "feeSection",
    "settingsSection"
];

const dashboardHomeIds = [
    "studentIdCardSection",
    "welcomeBanner",
    "noticeBoard",
    "analyticsSection",
    "quickSection",
    "notificationPanel"
];

function hideAllSections() {

    // Hide Student Modules
    studentSectionIds.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.classList.add("student-section-hidden");
            element.style.removeProperty("display");
        }

    });

    // Hide Dashboard Home
    dashboardHomeIds.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.style.display = "none";
        }

    });

    // Hide Dashboard Cards
    const dashboardCards =
        document.querySelector(
            "#studentDashboard .dashboard-cards"
        );

    if (dashboardCards) {
        dashboardCards.style.display = "none";
    }

// ==========================================
// HIDE SUBJECT-WISE RESULTS CARD
// ==========================================

const studentResults =
    document.getElementById(
        "studentResults"
    );

if (studentResults) {

    studentResults.style.setProperty(
        "display",
        "none",
        "important"
    );

}

}


// ===============================
// SHOW ONLY ONE STUDENT SECTION
// ===============================

function showSection(section) {

    if (!section) return;

    // First hide everything
    hideAllSections();

    // Show selected section
    section.classList.remove("student-section-hidden");

    // Make sure inline display does not interfere
    section.style.display = "block";

}


window.addEventListener("load", updateDashboardStats);
// ==========================================
// STUDENT DASHBOARD STATISTICS
// SUPABASE CONNECTED
// ==========================================

async function updateDashboardStats() {

    const student =
        JSON.parse(
            localStorage.getItem("currentStudent")
        ) ||
        JSON.parse(
            localStorage.getItem("loggedInStudent")
        ) ||
        null;

    if (!student) {
        return;
    }

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        return;
    }


    // ==========================================
    // FIND STUDENT IN SUPABASE
    // ==========================================

    let dbStudent = null;

    if (student.id) {

        const result =
            await supabaseClient
                .from("students")
                .select("*")
                .eq(
                    "id",
                    student.id
                )
                .maybeSingle();

        if (
            !result.error &&
            result.data
        ) {
            dbStudent =
                result.data;
        }
    }


    if (
        !dbStudent &&
        student.studentId
    ) {

        const result =
            await supabaseClient
                .from("students")
                .select("*")
                .eq(
                    "student_id",
                    student.studentId
                )
                .maybeSingle();

        if (
            !result.error &&
            result.data
        ) {
            dbStudent =
                result.data;
        }
    }


    const data =
        dbStudent ||
        student;


    // ==========================================
    // ATTENDANCE FROM SUPABASE
    // ==========================================

    if (dbStudent) {

        const {
            data: attendanceRecords
        } =
            await supabaseClient
                .from("attendance")
                .select("status")
                .eq(
                    "student_id",
                    dbStudent.id
                );


        let present = 0;
        let absent = 0;
        let late = 0;


        (
            attendanceRecords ||
            []
        ).forEach(
            function(record) {

                const status =
                    String(
                        record.status ||
                        ""
                    ).toLowerCase();


                if (
                    status ===
                    "present"
                ) {
                    present++;
                }

                else if (
                    status ===
                    "absent"
                ) {
                    absent++;
                }

                else if (
                    status ===
                    "late"
                ) {
                    late++;
                }

            }
        );


        const total =
            present +
            absent +
            late;


        const attendancePercentage =
            total > 0
                ? Math.round(
                    (
                        present /
                        total
                    ) * 100
                )
                : 0;


        const attendanceElement =
            document.getElementById(
                "attendancePercent"
            );


        if (attendanceElement) {

            attendanceElement.textContent =
                attendancePercentage +
                "%";

        }

    }


// ==========================================
// SUBJECT COUNT - ASSIGNED SUBJECTS ONLY
// ==========================================

let assignedSubjectIds = [];

if (dbStudent) {

    try {

        assignedSubjectIds =
            Array.isArray(dbStudent.subject_ids)
                ? dbStudent.subject_ids
                : JSON.parse(
                    dbStudent.subject_ids || "[]"
                );

    } catch (error) {

        assignedSubjectIds = [];

    }

}


// ==========================================
// SUBJECT COUNT DISPLAY
// ==========================================

const subjectCountElement =
    document.getElementById(
        "subjectsCount"
    );

if (subjectCountElement) {

    // Jab tak subjects assign nahi hain
    // kuch bhi display nahi hoga

    if (
        !assignedSubjectIds ||
        assignedSubjectIds.length === 0
    ) {

        subjectCountElement.textContent = "";

    }

    else {

        subjectCountElement.textContent =
            assignedSubjectIds.length +
            " Subjects";

    }

}

    // ==========================================
    // OVERALL RESULT
    // ==========================================

    if (dbStudent) {

        const {
            data: results
        } =
            await supabaseClient
                .from("results")
                .select(
                    "marks, total_marks"
                )
                .eq(
                    "student_id",
                    dbStudent.id
                );


        let obtained = 0;
        let totalMarks = 0;


        (
            results ||
            []
        ).forEach(
            function(result) {

                obtained +=
                    Number(
                        result.marks ||
                        0
                    );

                totalMarks +=
                    Number(
                        result.total_marks ||
                        0
                    );

            }
        );


        const overallPercentage =
            totalMarks > 0
                ? Math.round(
                    (
                        obtained /
                        totalMarks
                    ) * 100
                )
                : 0;


        const profileElement =
            document.getElementById(
                "profileCompletion"
            );


        if (profileElement) {

            profileElement.textContent =
                overallPercentage +
                "%";

        }

    }

}

// =========================================================
// STUDENT ANALYTICS - REAL SUPABASE DATA
// =========================================================

async function updateAnalytics() {

    const student =
        StudentDashboard.getStudent();


    if (!student) {
        return;
    }

    // =====================================================
    // GET STUDENT FROM SUPABASE
    // =====================================================

    let dbStudent = null;


    if (student.id) {

        const studentResult =
            await supabaseClient
                .from("students")
                .select("id")
                .eq(
                    "id",
                    student.id
                )
                .maybeSingle();


        if (
            !studentResult.error &&
            studentResult.data
        ) {

            dbStudent =
                studentResult.data;
        }
    }


    // =====================================================
    // FALLBACK USING STUDENT ID
    // =====================================================

    if (
        !dbStudent &&
        student.studentId
    ) {

        const studentResult =
            await supabaseClient
                .from("students")
                .select("id")
                .eq(
                    "student_id",
                    student.studentId
                )
                .maybeSingle();


        if (
            !studentResult.error &&
            studentResult.data
        ) {

            dbStudent =
                studentResult.data;
        }
    }


    if (!dbStudent) {

        console.warn(
            "Student not found for analytics."
        );

        return;
    }


    // =====================================================
    // LOAD RESULTS DIRECTLY
    // =====================================================

    const {
        data: results,
        error: resultsError
    } =
        await supabaseClient
            .from("results")
            .select("*")
            .eq(
                "student_id",
                dbStudent.id
            )
            .order(
                "id",
                {
                    ascending: false
                }
            );


    if (resultsError) {

        console.error(
            "Analytics Results Error:",
            resultsError
        );

        return;
    }


    // =====================================================
    // KEEP LATEST RESULT FOR EACH SUBJECT
    // =====================================================

    const latestResults = [];

    const seenSubjects =
        new Set();


    (results || []).forEach(
        function(result) {

            if (
                result.subject_id === null ||
                result.subject_id === undefined
            ) {

                return;
            }


            const subjectKey =
                String(
                    result.subject_id
                );


            if (
                seenSubjects.has(
                    subjectKey
                )
            ) {

                return;
            }


            seenSubjects.add(
                subjectKey
            );


            latestResults.push(
                result
            );

        }
    );


    // =====================================================
    // LOAD SUBJECT NAMES
    // =====================================================

    const subjectIds =
        latestResults
            .map(
                function(result) {

                    return result.subject_id;

                }
            )
            .filter(
                function(id) {

                    return (
                        id !== null &&
                        id !== undefined
                    );

                }
            );


    let subjects = [];


    if (subjectIds.length > 0) {

        const {
            data,
            error: subjectError
        } =
            await supabaseClient
                .from("subjects")
                .select(
                    "id, name, code"
                )
                .in(
                    "id",
                    subjectIds
                );


        if (subjectError) {

            console.error(
                "Analytics Subject Error:",
                subjectError
            );

        }
        else {

            subjects =
                data || [];
        }
    }


    // =====================================================
    // SUBJECT PERFORMANCE MAP
    // =====================================================

    const performanceMap = {};


    latestResults.forEach(
        function(result) {

            const subjectRow =
                subjects.find(
                    function(subject) {

                        return (
                            String(
                                subject.id
                            ) ===
                            String(
                                result.subject_id
                            )
                        );

                    }
                );


            const subjectName =
                subjectRow?.name ||
                subjectRow?.subject_name ||
                subjectRow?.title ||
                "Subject";


            const obtained =
                Number(
                    result.marks ??
                    result.obtained_marks ??
                    0
                );


            const total =
                Number(
                    result.total_marks ??
                    0
                );


            const percentage =
                total > 0
                    ? Math.round(
                        (
                            obtained /
                            total
                        ) * 100
                    )
                    : 0;


            performanceMap[
                subjectName
            ] = percentage;

        }
    );


    // =====================================================
    // FIND SUBJECTS
    // =====================================================

    const subjectNames =
        Object.keys(
            performanceMap
        );


    // =====================================================
    // ACADEMIC CHART SUBJECT ELEMENTS
    // =====================================================

    // =====================================================
// DYNAMIC ACADEMIC PERFORMANCE SUBJECTS
// =====================================================

const academicSubjectsList =
    document.getElementById(
        "academicSubjectsList"
    );

if (academicSubjectsList) {

    academicSubjectsList.innerHTML = "";

    const dynamicSubjects =
        latestResults.map(
            function(result) {

                const subjectRow =
                    subjects.find(
                        function(subject) {
                            return (
                                String(subject.id) ===
                                String(result.subject_id)
                            );
                        }
                    );

                const subjectName =
                    subjectRow?.name ||
                    subjectRow?.subject_name ||
                    subjectRow?.title ||
                    "Subject";

                const obtained =
                    Number(
                        result.marks ??
                        result.obtained_marks ??
                        0
                    );

                const total =
                    Number(
                        result.total_marks ??
                        0
                    );

                const percentage =
                    total > 0
                        ? Math.round(
                            (
                                obtained /
                                total
                            ) * 100
                        )
                        : 0;

                return {
                    name: subjectName,
                    percentage: percentage
                };
            }
        );

    dynamicSubjects.forEach(
        function(subject) {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "academic-row";

            row.innerHTML = `
                <div class="academic-label">
                    <span>${subject.name}</span>

                    <strong>
                        ${subject.percentage}%
                    </strong>
                </div>

                <div class="academic-bar">
                    <div
                        class="academic-bar-fill"
                        style="width:${subject.percentage}%"
                    ></div>
                </div>
            `;

            academicSubjectsList.appendChild(
                row
            );
        }
    );

    if (
        dynamicSubjects.length === 0
    ) {

        academicSubjectsList.innerHTML = `
            <div class="academic-empty-state">
                No result data available yet.
            </div>
        `;

    }

}
    // =====================================================
    // OVERALL PERFORMANCE
    // =====================================================

    let totalObtained = 0;

    let totalMarks = 0;


    latestResults.forEach(
        function(result) {

            totalObtained +=
                Number(
                    result.marks ??
                    result.obtained_marks ??
                    0
                );


            totalMarks +=
                Number(
                    result.total_marks ??
                    0
                );

        }
    );


    const overallPercentage =
        totalMarks > 0
            ? Math.round(
                (
                    totalObtained /
                    totalMarks
                ) * 100
            )
            : 0;


    const overallElement =
        document.getElementById(
            "overallPerformanceChart"
        );


    if (overallElement) {

        overallElement.textContent =
            overallPercentage + "%";
    }


    // =====================================================
    // UPDATE OLD PERFORMANCE ELEMENT TOO
    // =====================================================

    const oldPercentage =
        document.getElementById(
            "overallPercentage"
        );


    if (oldPercentage) {

        oldPercentage.textContent =
            overallPercentage + "%";
    }


    // =====================================================
    // ACADEMIC STATUS
    // =====================================================

    const academicStatus =
        document.querySelector(
            ".academic-chart-card .student-chart-badge"
        );


    if (academicStatus) {

        if (
            overallPercentage >= 90
        ) {

            academicStatus.textContent =
                "Excellent";

        }
        else if (
            overallPercentage >= 80
        ) {

            academicStatus.textContent =
                "Very Good";

        }
        else if (
            overallPercentage >= 70
        ) {

            academicStatus.textContent =
                "Good";

        }
        else if (
            overallPercentage >= 50
        ) {

            academicStatus.textContent =
                "Average";

        }
        else {

            academicStatus.textContent =
                "Needs Improvement";
        }
    }


    console.log(
        "Student Academic Analytics Loaded:",
        performanceMap,
        "Overall:",
        overallPercentage
    );

}

// ===============================
// ID Card Quick Action
// ===============================

const idCardAction = document.getElementById("idCardAction");

const studentIdCardSection =
document.getElementById("studentIdCardSection");


if(idCardAction){

idCardAction.addEventListener("click", function(){

hideAllSections();

if(studentIdCardSection){

studentIdCardSection.style.display = "block";

studentIdCardSection.scrollIntoView({
behavior: "smooth",
block: "start"
});

}

});

}

// ==========================================
// RESULTS ACTION
// ==========================================

const resultAction =
    document.getElementById("resultAction");

if (resultAction) {

    resultAction.addEventListener(
        "click",
        function () {

            hideAllSections();

            // Show Results section
            if (resultsSection) {
                resultsSection.style.display =
                    "block";
            }

            // Show subject-wise result cards
            const studentResults =
                document.getElementById(
                    "studentResults"
                );

            if (studentResults) {

                studentResults.style.setProperty(
                    "display",
                    "grid",
                    "important"
                );

            }

        }
    );

}

// Attendance Action

const attendanceAction = document.getElementById("attendanceAction");

if(attendanceAction){

attendanceAction.addEventListener("click", function(){

hideAllSections();

attendanceSection.style.display = "block";

});

}



// Teacher Action

// ===============================
// Teacher Contact Modal
// ===============================

const teacherAction = document.getElementById("teacherAction");

const teacherModal = document.getElementById("teacherModal");

const closeTeacherModal =
document.getElementById("closeTeacherModal");

const closeTeacherBtn =
document.getElementById("closeTeacherBtn");

const emailTeacherBtn =
document.getElementById("emailTeacherBtn");


if(teacherAction && teacherModal){

teacherAction.addEventListener("click", function(){

teacherModal.style.display = "flex";

});

}


if(closeTeacherModal){

closeTeacherModal.addEventListener("click", function(){

teacherModal.style.display = "none";

});

}


if(closeTeacherBtn){

closeTeacherBtn.addEventListener("click", function(){

teacherModal.style.display = "none";

});

}


if(emailTeacherBtn){

emailTeacherBtn.addEventListener("click", function(){

window.location.href =
"mailto:sir.ali@eduportal.com";

});

}


if(teacherModal){

teacherModal.addEventListener("click", function(e){

if(e.target === teacherModal){

teacherModal.style.display = "none";

}

});

}
// ===============================
// Dark Mode Toggle
// ===============================

const darkModeBtn = document.getElementById("darkModeBtn");


if(darkModeBtn){

darkModeBtn.addEventListener("click", function(){

document.body.classList.toggle("dark-mode");


if(document.body.classList.contains("dark-mode")){

darkModeBtn.textContent = "☀️ Light Mode";

localStorage.setItem("darkMode","enabled");

}

else{

darkModeBtn.textContent = "🌙 Dark Mode";

localStorage.setItem("darkMode","disabled");

}


});

}


// Load Saved Theme

window.addEventListener("load", function(){

const savedTheme = localStorage.getItem("darkMode");


if(savedTheme === "enabled"){

document.body.classList.add("dark-mode");

if(darkModeBtn){

darkModeBtn.textContent = "☀️ Light Mode";

}

}

});
// ===============================
// Loading Screen
// ===============================

window.addEventListener("load", function(){

const loadingScreen = document.getElementById("loadingScreen");


setTimeout(function(){

if(loadingScreen){

loadingScreen.style.opacity = "0";


setTimeout(function(){

loadingScreen.style.display = "none";
loadingScreen.style.pointerEvents = "none";

},500);

}


},2000);


});
// =========================================================
// STUDENT SIDEBAR NAVIGATION - CLEAN FINAL VERSION
// =========================================================

function openStudentSection(sectionId, menuId) {

    // Hide ALL dashboard and module content
    hideAllSections();

    // Hide dashboard cards
    const cards =
        document.querySelector(
            "#studentDashboard .dashboard-cards"
        );

    if (cards) {
        cards.style.setProperty(
            "display",
            "none",
            "important"
        );
    }

    // Hide dashboard home elements
    const homeIds = [
        "studentIdCardSection",
        "welcomeBanner",
        "noticeBoard",
        "analyticsSection",
        "quickSection",
        "notificationPanel"
    ];

    homeIds.forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {
            element.style.setProperty(
                "display",
                "none",
                "important"
            );
        }

    });


    // Remove active from every sidebar item
    document
        .querySelectorAll(
            "#studentDashboard .sidebar ul li"
        )
        .forEach(function(item) {

            item.classList.remove("active");

        });


    // Activate selected menu
    const menu =
        document.getElementById(menuId);

    if (menu) {
        menu.classList.add("active");
    }


    // Show ONLY selected section
    const section =
        document.getElementById(sectionId);

    if (section) {

        section.style.setProperty(
            "display",
            "block",
            "important"
        );

    }

}


// =========================================================
// DASHBOARD
// =========================================================

dashboardMenu.onclick = function(event) {

    event.preventDefault();

    hideAllSections();


    const homeIds = [
        "studentIdCardSection",
        "welcomeBanner",
        "noticeBoard",
        "analyticsSection",
        "quickSection",
        "notificationPanel"
    ];

    homeIds.forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {

            let displayType = "block";

            if (id === "studentIdCardSection") {
                displayType = "flex";
            }

            if (id === "welcomeBanner") {
                displayType = "flex";
            }

            if (id === "analyticsSection") {
                displayType = "grid";
            }

            element.style.setProperty(
                "display",
                displayType,
                "important"
            );

        }

    });


    const cards =
        document.querySelector(
            "#studentDashboard .dashboard-cards"
        );

    if (cards) {

        cards.style.setProperty(
            "display",
            "grid",
            "important"
        );

    }


    setActive(dashboardMenu);

};


// =========================================================
// PROFILE
// =========================================================

profileMenu.onclick = function(event) {

    event.preventDefault();

    openStudentSection(
        "profileSection",
        "profileMenu"
    );

};


// =========================================================
// ATTENDANCE
// =========================================================

attendanceMenu.onclick = function(event) {

    event.preventDefault();

    openStudentSection(
        "attendanceSection",
        "attendanceMenu"
    );

};


// =========================================================
// SUBJECTS
// =========================================================

subjectsMenu.onclick = function(event) {

    event.preventDefault();

    openStudentSection(
        "subjectsSection",
        "subjectsMenu"
    );

};


// =========================================================
// ASSIGNMENTS
// =========================================================

assignmentsMenu.onclick = function(event) {

    event.preventDefault();

    openStudentSection(
        "assignmentsSection",
        "assignmentsMenu"
    );

};


// =========================================================
// RESULTS
// =========================================================

resultsMenu.onclick = function(event) {

    event.preventDefault();

    openStudentSection(
        "resultsSection",
        "resultsMenu"
    );

};


// =========================================================
// FEE STATUS
// =========================================================

feeMenu.onclick = function(event) {

    event.preventDefault();

    openStudentSection(
        "feeSection",
        "feeMenu"
    );

};


// =========================================================
// NOTICES
// =========================================================

const noticesMenu =
    document.getElementById("noticesMenu");

if (noticesMenu) {

    noticesMenu.onclick = function(event) {

        event.preventDefault();

        openStudentSection(
            "noticeBoard",
            "noticesMenu"
        );

    };

}


// =========================================================
// SETTINGS
// =========================================================

settingsMenu.onclick = function(event) {

    event.preventDefault();

    openStudentSection(
        "settingsSection",
        "settingsMenu"
    );

};
// ==========================================
// STUDENT SETTINGS
// ==========================================

async function loadStudentSettings() {

    let savedStudent = null;

    try {

        savedStudent =
            JSON.parse(
                localStorage.getItem(
                    "loggedInStudent"
                )
            ) ||
            JSON.parse(
                localStorage.getItem(
                    "studentAccount"
                )
            );

    } catch (error) {

        console.error(
            "Student settings error:",
            error
        );

        return;
    }


    if (!savedStudent) {
        return;
    }


    const usernameInput =
        document.getElementById(
            "settingsUsername"
        );

    const currentPasswordInput =
        document.getElementById(
            "settingsCurrentPassword"
        );


    // ==========================================
    // LOAD FROM LOCAL SESSION FIRST
    // ==========================================

    if (usernameInput) {

        usernameInput.value =
            savedStudent.username ||
            "";

        usernameInput.readOnly =
            true;
    }


    if (currentPasswordInput) {

        currentPasswordInput.value =
            savedStudent.password ||
            "";

    }


    // ==========================================
    // LOAD LATEST DATA FROM SUPABASE
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        return;
    }


    try {

        let dbStudent = null;


        // Search by database ID
        if (savedStudent.id) {

            const result =
                await supabaseClient
                    .from("students")
                    .select(
                        "username, password"
                    )
                    .eq(
                        "id",
                        savedStudent.id
                    )
                    .maybeSingle();

            if (!result.error) {

                dbStudent =
                    result.data;

            }

        }


        // Search by Student ID if needed
        if (
            !dbStudent &&
            savedStudent.studentId
        ) {

            const result =
                await supabaseClient
                    .from("students")
                    .select(
                        "username, password"
                    )
                    .eq(
                        "student_id",
                        savedStudent.studentId
                    )
                    .maybeSingle();

            if (!result.error) {

                dbStudent =
                    result.data;

            }

        }


        // ==========================================
        // PUT DATABASE DATA INTO SETTINGS
        // ==========================================

        if (dbStudent) {

            if (usernameInput) {

                usernameInput.value =
                    dbStudent.username ||
                    savedStudent.username ||
                    "";

                usernameInput.readOnly =
                    true;

            }


            if (currentPasswordInput) {

                currentPasswordInput.value =
                    dbStudent.password ||
                    savedStudent.password ||
                    "";

            }

        }

    } catch (error) {

        console.error(
            "Settings Supabase error:",
            error
        );

    }

}

// ==========================================
// LOAD SETTINGS WHEN SETTINGS OPENS
// ==========================================

if (
    typeof settingsMenu !==
    "undefined"
) {

    settingsMenu.addEventListener(
        "click",
        function() {

            setTimeout(
                function() {

                    loadStudentSettings();

                },
                100
            );

        }
    );

}

// ==========================================
// SHOW / HIDE CURRENT PASSWORD
// ==========================================

const toggleCurrentPassword =
    document.getElementById(
        "toggleCurrentPassword"
    );

const currentPasswordField =
    document.getElementById(
        "settingsCurrentPassword"
    );

if (
    toggleCurrentPassword &&
    currentPasswordField
) {

    toggleCurrentPassword.addEventListener(
        "click",
        function() {

            if (
                currentPasswordField.type ===
                "password"
            ) {

                currentPasswordField.type =
                    "text";

                toggleCurrentPassword.textContent =
                    "🙈";

                toggleCurrentPassword.title =
                    "Hide Password";

            } else {

                currentPasswordField.type =
                    "password";

                toggleCurrentPassword.textContent =
                    "👁️";

                toggleCurrentPassword.title =
                    "Show Password";

            }

        }
    );

}
// ==========================================
// SAVE NEW PASSWORD
// ==========================================

const saveSettingsBtn =
    document.getElementById(
        "saveSettingsBtn"
    );


if (saveSettingsBtn) {

    saveSettingsBtn.addEventListener(
        "click",
        function() {

            let savedStudent = null;

            try {

                savedStudent =
                    JSON.parse(
                        localStorage.getItem(
                            "studentAccount"
                        )
                    );

            } catch (error) {

                console.error(
                    "Student account error:",
                    error
                );

            }


            if (!savedStudent) {

                alert(
                    "No student account found."
                );

                return;
            }


            const newPassword =
                document.getElementById(
                    "settingsPassword"
                ).value.trim();


            if (newPassword === "") {

                alert(
                    "Please enter a new password."
                );

                return;
            }


            // Update password

            savedStudent.password =
                newPassword;


            // Save updated account

            localStorage.setItem(
                "studentAccount",
                JSON.stringify(
                    savedStudent
                )
            );


            localStorage.setItem(
                "loggedInStudent",
                JSON.stringify(
                    savedStudent
                )
            );


            // Update current password field

            const currentPasswordInput =
                document.getElementById(
                    "settingsCurrentPassword"
                );

            if (currentPasswordInput) {

                currentPasswordInput.value =
                    newPassword;

            }


            // Clear new password

            document.getElementById(
                "settingsPassword"
            ).value = "";


            alert(
                "Password updated successfully! ✅"
            );

        }
    );

}
// =========================================
// CREATE NEW LOGIN MODAL
// =========================================

const createNewLoginBtn =
document.getElementById("createNewLoginBtn");

const createLoginModal =
document.getElementById("createLoginModal");

const closeCreateLoginModal =
document.getElementById("closeCreateLoginModal");


// Open popup
if (createNewLoginBtn && createLoginModal) {

createNewLoginBtn.addEventListener("click", function () {

createLoginModal.style.display = "flex";

});

}


// Close popup
if (closeCreateLoginModal && createLoginModal) {

closeCreateLoginModal.addEventListener("click", function () {

createLoginModal.style.display = "none";

});

}


// Close when clicking outside popup
if (createLoginModal) {

createLoginModal.addEventListener("click", function (event) {

if (event.target === createLoginModal) {

createLoginModal.style.display = "none";

}

});

}
// =========================================
// CREATE NEW LOGIN - SAVE ACCOUNT
// =========================================

const saveNewLoginBtn =
document.getElementById("saveNewLoginBtn");

if (saveNewLoginBtn) {

saveNewLoginBtn.addEventListener("click", function () {

const role =
document.getElementById("newLoginRole").value;

const fullName =
document.getElementById("newLoginName").value.trim();

const newUsername =
document.getElementById("newLoginUsername").value.trim();

const newPassword =
document.getElementById("newLoginPassword").value.trim();

const confirmPassword =
document.getElementById("newLoginConfirmPassword").value.trim();

const createLoginMessage =
document.getElementById("createLoginMessage");


// ===============================
// Validation
// ===============================

if (
fullName === "" ||
newUsername === "" ||
newPassword === "" ||
confirmPassword === ""
) {

createLoginMessage.style.color = "red";

createLoginMessage.textContent =
"Please fill all fields.";

return;
}


// ===============================
// Password Match
// ===============================

if (newPassword !== confirmPassword) {

createLoginMessage.style.color = "red";

createLoginMessage.textContent =
"Passwords do not match.";

return;
}


// ===============================
// Create Account Object
// ===============================

const newAccount = {

fullName: fullName,

username: newUsername,

password: newPassword,

role: role

};


// ===============================
// Save Student Account
// ===============================

if (role === "student") {

localStorage.setItem(
"studentAccount",
JSON.stringify(newAccount)
);

createLoginMessage.style.color = "green";

createLoginMessage.textContent =
"Student Login Created Successfully ✅";

}


// ===============================
// Save Administrator Account
// ===============================

else if (role === "administrator") {

localStorage.setItem(
"adminAccount",
JSON.stringify(newAccount)
);
localStorage.setItem("adminSessionStart", String(Date.now()));
createLoginMessage.style.color = "green";

createLoginMessage.textContent =
"Administrator Login Created Successfully ✅";

}


// ===============================
// Clear Fields
// ===============================

document.getElementById("newLoginName").value = "";

document.getElementById("newLoginUsername").value = "";

document.getElementById("newLoginPassword").value = "";

document.getElementById("newLoginConfirmPassword").value = "";


// ===============================
// Close Popup
// ===============================

setTimeout(function () {

createLoginModal.style.display = "none";

createLoginMessage.textContent = "";

}, 1000);

});

}


// ==========================================
// ADMIN ADD STUDENT - CLOSE MODAL
// ==========================================

document.addEventListener("click", function (event) {

    // Close X
    if (
        event.target.closest(
            "#closeAdminAddStudentModal"
        )
    ) {

        const modal =
            document.getElementById(
                "adminAddStudentModal"
            );

        if (modal) {
            modal.style.display = "none";
        }

        return;
    }


    // Close Cancel
    if (
        event.target.closest(
            "#cancelAdminAddStudent"
        )
    ) {

        const modal =
            document.getElementById(
                "adminAddStudentModal"
            );

        if (modal) {
            modal.style.display = "none";
        }

        return;
    }

});
// ==========================================
// ADMIN ADD STUDENT
// SUPABASE LIVE ACCOUNT SYSTEM
// ==========================================

document.addEventListener(
    "click",
    async function (event) {

        const saveButton =
            event.target.closest(
                "#saveAdminStudent"
            );

        if (!saveButton) {
            return;
        }


        // ==========================================
        // SUPABASE CHECK
        // ==========================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            alert(
                "Supabase connection is missing."
            );
            return;
        }


        // ==========================================
        // GET FORM VALUES
        // ==========================================

        const name =
            document
                .getElementById(
                    "adminNewStudentName"
                )
                .value
                .trim();

        const fatherName =
            document
                .getElementById(
                    "adminNewStudentFather"
                )
                .value
                .trim();

        const studentId =
            document
                .getElementById(
                    "adminNewStudentId"
                )
                .value
                .trim();

        const studentClass =
            document
                .getElementById(
                    "adminNewStudentClass"
                )
                .value;

        const section =
            document
                .getElementById(
                    "adminNewStudentSection"
                )
                .value;

        const rollNumber =
            document
                .getElementById(
                    "adminNewStudentRoll"
                )
                .value
                .trim();

        const dob =
            document
                .getElementById(
                    "adminNewStudentDOB"
                )
                .value;

        const email =
            document
                .getElementById(
                    "adminNewStudentEmail"
                )
                .value
                .trim();

        const username =
            document
                .getElementById(
                    "adminNewStudentUsername"
                )
                .value
                .trim();

      const password =
    document
        .getElementById(
            "adminNewStudentPassword"
        )
        .value
        .replace(/\s/g, "");

        const mobile =
            document
                .getElementById(
                    "adminNewStudentMobile"
                )
                .value
                .trim();

const monthlyFee =
    Number(
        document
            .getElementById(
                "adminNewStudentMonthlyFee"
            )
            .value
    ) || 0;
        // ==========================================
        // VALIDATION
        // ==========================================

      if (
    !name ||
    !fatherName ||
    !studentId ||
    !studentClass ||
    !section ||
    !rollNumber ||
    !username ||
    !password ||
    monthlyFee <= 0
) {

            alert(
                "Please fill all required fields including Total Monthly Fee. ⚠️"
            );

            return;
        }

// ==========================================
// PASSWORD VALIDATION
// ==========================================

if (
    !/^.{8,12}$/.test(
        password
    )
) {

    alert(
        "Password must contain 8 to 12 characters."
    );

    return;
}
        // ==========================================
        // CHECK DUPLICATE STUDENT ID
        // ==========================================

        const {
            data: existingStudentId,
            error: studentIdError
        } =
            await supabaseClient
                .from("students")
                .select("id")
                .eq(
                    "student_id",
                    studentId
                )
                .maybeSingle();


        if (studentIdError) {

            console.error(
                "STUDENT ID CHECK ERROR:",
                studentIdError
            );

            alert(
                "Unable to verify Student ID.\n\n" +
                studentIdError.message
            );

            return;
        }


        if (existingStudentId) {

            alert(
                "This Student ID already exists. ⚠️"
            );

            return;
        }


        // ==========================================
        // CHECK DUPLICATE USERNAME
        // ==========================================

        const {
            data: existingUsername,
            error: usernameError
        } =
            await supabaseClient
                .from("students")
                .select("id")
                .eq(
                    "username",
                    username
                )
                .maybeSingle();


        if (usernameError) {

            console.error(
                "USERNAME CHECK ERROR:",
                usernameError
            );

            alert(
                "Unable to verify username.\n\n" +
                usernameError.message
            );

            return;
        }


        if (existingUsername) {

            alert(
                "This Username already exists. ⚠️"
            );

            return;
        }


        // ==========================================
        // CREATE DATABASE ID
        // ==========================================

        const databaseId =
            Date.now();


        // ==========================================
        // CREATE STUDENT RECORD
        // ==========================================

        const studentRecord = {

            id:
                databaseId,

            student_id:
                studentId,

            name:
                name,

            father_name:
                fatherName,

            student_class:
                studentClass,

   subject_ids:
    Array.from(
        document.querySelectorAll(
            "#adminStudentSubjects input[type='checkbox']:checked"
        )
    )
    .map(function (checkbox) {

        return Number(
            checkbox.value
        );

    })
    .filter(function (id) {

        return !isNaN(id);

    }),

            section:
                section,

            roll_number:
                rollNumber,

            date_of_birth:
                dob || null,

            email:
                email || null,

            username:
                username,

            password:
                password,

          mobile:
    mobile || null,

monthly_fee:
    monthlyFee,

status:
    "Active"
        };


        // ==========================================
        // SAVE DIRECTLY TO SUPABASE
        // ==========================================

        const {
            data: savedStudent,
            error
        } =
            await supabaseClient
                .from("students")
                .insert([
                    studentRecord
                ])
                .select()
                .single();


        if (error) {

            console.error(
                "ADD STUDENT SUPABASE ERROR:",
                error
            );

            alert(
                "Student could not be saved.\n\n" +
                error.message
            );

            return;
        }


        // ==========================================
        // REFRESH ADMIN STUDENT LIST
        // ==========================================

        if (
            typeof renderAdminStudents ===
            "function"
        ) {

            await renderAdminStudents();
        }


        // ==========================================
        // REFRESH USER MANAGEMENT
        // ==========================================

        if (
            typeof renderUserManagementStudents ===
            "function"
        ) {

            await renderUserManagementStudents();
        }


        // ==========================================
        // REFRESH ADMIN DASHBOARD
        // ==========================================

        if (
            typeof AdminDashboard !==
            "undefined" &&
            typeof AdminDashboard.refresh ===
            "function"
        ) {

            await AdminDashboard.refresh();
        }


        // ==========================================
        // CLEAR FORM
        // ==========================================

        if (
            typeof clearAdminStudentForm ===
            "function"
        ) {

            clearAdminStudentForm();
        }


        // ==========================================
        // CLOSE MODAL
        // ==========================================

        const modal =
            document.getElementById(
                "adminAddStudentModal"
            );

        if (modal) {

            modal.style.display =
                "none";
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        alert(
            "Student account created successfully! ✅"
        );
    }
);

// ==========================================
// DISPLAY ADMIN STUDENTS
// SUPABASE LIVE DATA ONLY
// ==========================================

async function renderAdminStudents() {

    const tableBody =
        document.getElementById(
            "adminStudentsTableBody"
        );

    if (!tableBody) {
        return;
    }


    // ==========================================
    // LOADING
    // ==========================================

    tableBody.innerHTML = `
        <tr>
            <td
                colspan="10"
                style="text-align:center;"
            >
                Loading students...
            </td>
        </tr>
    `;


    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="11"
                    style="text-align:center;"
                >
                    Supabase connection is missing.
                </td>
            </tr>
        `;

        return;
    }


    // ==========================================
    // LOAD STUDENTS FROM SUPABASE
    // ==========================================

    const {
        data: students,
        error
    } =
        await supabaseClient
            .from("students")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        console.error(
            "ADMIN STUDENTS LOAD ERROR:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="11"
                    style="text-align:center;"
                >
                    Unable to load students.
                    <br>
                    ${error.message}
                </td>
            </tr>
        `;

        return;
    }


    // ==========================================
    // NO STUDENTS
    // ==========================================

    if (
        !Array.isArray(students) ||
        students.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="11"
                    style="text-align:center;"
                >
                    No students found.
                </td>
            </tr>
        `;

        const countElement =
            document.getElementById(
                "adminTotalStudents"
            );

        if (countElement) {
            countElement.textContent = "0";
        }

        return;
    }


    // ==========================================
    // DISPLAY STUDENTS
    // ==========================================

    tableBody.innerHTML = "";


    students.forEach(
        function (
            student,
            index
        ) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${student.student_id || ""}
                </td>

                <td>
                    ${student.name || ""}
                </td>

                <td>
                    ${student.father_name || ""}
                </td>
<td>
    ${
        formatClassSection(
            student.student_class,
            student.section
        )
    }
</td>
            

                <td>
                    ${student.roll_number || ""}
                </td>

                <td>
                    ${student.date_of_birth || ""}
                </td>

                <td>
                    ${student.email || ""}
                </td>

                <td>
                    ${student.mobile || ""}
                </td>

            
            `;


            tableBody.appendChild(
                row
            );
        }
    );


    // ==========================================
    // UPDATE TOTAL STUDENTS
    // ==========================================

    const countElement =
        document.getElementById(
            "adminTotalStudents"
        );

    if (countElement) {

        countElement.textContent =
            students.length;
    }
}
// ==========================================
// UPDATE TOTAL STUDENTS
// SUPABASE + LOCAL STORAGE
// ==========================================

async function updateAdminStudentCount() {

    const countElement =
        document.getElementById(
            "adminTotalStudents"
        );

    if (!countElement) {
        return;
    }


    let count = 0;


    // ==========================================
    // TRY SUPABASE
    // ==========================================

    try {

        if (
            typeof supabaseClient !==
            "undefined"
        ) {

            const {
                count: supabaseCount,
                error
            } =
                await supabaseClient
                    .from("students")
                    .select(
                        "id",
                        {
                            count: "exact",
                            head: true
                        }
                    );


            if (
                !error &&
                typeof supabaseCount ===
                "number"
            ) {

                count =
                    supabaseCount;

            }

        }

    } catch (error) {

        console.error(
            "Student Count Error:",
            error
        );

    }


    // ==========================================
    // LOCAL STORAGE FALLBACK
    // ==========================================

    if (count === 0) {

        try {

            const students =
                JSON.parse(
                    localStorage.getItem(
                        "adminStudents"
                    )
                ) || [];


            if (
                Array.isArray(students)
            ) {

                count =
                    students.length;

            }

        } catch (error) {

            console.error(
                "Local Student Count Error:",
                error
            );

        }

    }


    // ==========================================
    // DISPLAY
    // ==========================================

    countElement.textContent =
        count;

}

// ==========================================
// CLEAR ADD STUDENT FORM
// ==========================================

function clearAdminStudentForm() {

const fields = [

"adminNewStudentName",
"adminNewStudentFather",
"adminNewStudentId",
"adminNewStudentRoll",
"adminNewStudentDOB",
"adminNewStudentEmail",
"adminNewStudentMobile",
"adminNewStudentMonthlyFee"

];


fields.forEach(function (id) {

const field =
document.getElementById(id);

if (field) {
field.value = "";
}

});


const classField =
document.getElementById("adminNewStudentClass");

if (classField) {
classField.value = "";
}


const sectionField =
document.getElementById("adminNewStudentSection");

if (sectionField) {
sectionField.value = "";
}


const statusField =
document.getElementById("adminNewStudentStatus");

if (statusField) {
statusField.value = "Active";
}

}
// ==========================================================
// LOAD SUBJECTS IN STUDENT SUBJECT FORM
// ==========================================================

document.addEventListener(
    "change",
    async function (event) {

        if (
            event.target.id !==
            "adminNewStudentClass"
        ) {
            return;
        }


        const subjectsGroup =
            document.getElementById(
                "adminStudentSubjectsGroup"
            );


        const subjectsContainer =
            document.getElementById(
                "adminStudentSubjects"
            );


        if (!subjectsContainer) {
            return;
        }


        // ==========================================
        // LOAD SUBJECTS
        // ==========================================

        subjectsContainer.innerHTML = `
            <div
                style="
                    color:#64748b;
                    padding:8px;
                    text-align:center;
                "
            >
                Loading subjects...
            </div>
        `;


        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            subjectsContainer.innerHTML = `
                <div
                    style="
                        color:#ef4444;
                        padding:8px;
                    "
                >
                    Unable to connect to database.
                </div>
            `;

            return;
        }


        const {
            data: subjects,
            error
        } =
            await supabaseClient
                .from("subjects")
                .select("*")
                .order(
                    "id",
                    {
                        ascending: true
                    }
                );


        // ==========================================
        // ERROR
        // ==========================================

        if (error) {

            console.error(
                "ADMIN SUBJECT LOAD ERROR:",
                error
            );


            subjectsContainer.innerHTML = `
                <div
                    style="
                        color:#ef4444;
                        padding:8px;
                    "
                >
                    Unable to load subjects.
                </div>
            `;

            return;
        }


        // ==========================================
        // CLEAR OLD SUBJECTS
        // ==========================================

        subjectsContainer.innerHTML = "";

        subjectsContainer.style.minHeight =
    "90px";

subjectsContainer.style.maxHeight =
    "160px";

subjectsContainer.style.overflowY =
    "auto";

subjectsContainer.style.boxSizing =
    "border-box";

        // ==========================================
        // NO SUBJECTS
        // ==========================================

        if (
            !subjects ||
            subjects.length === 0
        ) {

            subjectsContainer.innerHTML = `
                <div
                    style="
                        color:#64748b;
                        padding:8px;
                        text-align:center;
                    "
                >
                    No subjects available.
                </div>
            `;

            return;
        }


// ==========================================
// SELECTED SUBJECT COUNT
// ==========================================

const selectedCount =
    document.createElement("div");

selectedCount.id =
    "adminSelectedSubjectsCount";

selectedCount.textContent =
    "Selected: 0";

selectedCount.style.cssText = `
    font-size:13px;
    font-weight:600;
    color:#2563eb;
    margin-bottom:10px;
`;

subjectsContainer.appendChild(
    selectedCount
);

        // ==========================================
        // CREATE CHECKBOXES
        // ==========================================

        subjects.forEach(
            function (subject) {

                const subjectName =
                    subject.name ||
                    subject.subject_name ||
                    subject.title ||
                    "Unnamed Subject";


                const wrapper =
                    document.createElement(
                        "label"
                    );


         wrapper.style.cssText = `
    display:flex !important;
    flex-direction:row !important;
    align-items:center !important;
    justify-content:flex-start !important;
    gap:10px !important;
    width:100%;
    min-height:42px;
    box-sizing:border-box;
    padding:8px 12px !important;
    margin:0 0 6px 0 !important;
    border:1px solid #e2e8f0;
    border-radius:8px;
    background:#ffffff;
    cursor:pointer;
    transition:all 0.2s ease;
`;


                const checkbox =
                    document.createElement(
                        "input"
                    );


                checkbox.type =
                    "checkbox";


                checkbox.value =
                    subject.id;


                checkbox.dataset.subjectId =
                    subject.id;


                checkbox.dataset.subjectName =
                    subjectName;


          checkbox.style.cssText = `
    appearance: auto !important;
    width: 17px !important;
    height: 17px !important;
    min-width: 17px !important;
    min-height: 17px !important;
    max-width: 17px !important;
    max-height: 17px !important;
    margin: 0 !important;
    padding: 0 !important;
    flex: 0 0 17px !important;
    cursor: pointer;
    accent-color: #2563eb;
`;


                const name =
                    document.createElement(
                        "span"
                    );


                name.textContent =
                    subjectName;


                name.style.cssText = `
                    font-size:14px;
                    color:#0f172a;
                    font-weight:500;
                `;


                wrapper.appendChild(
                    checkbox
                );


                wrapper.appendChild(
                    name
                );


                subjectsContainer.appendChild(
                    wrapper
                );

checkbox.addEventListener(
    "change",
    function () {

        const checkedSubjects =
            subjectsContainer.querySelectorAll(
                "input[type='checkbox']:checked"
            );

        selectedCount.textContent =
            "Selected: " +
            checkedSubjects.length;

        if (checkbox.checked) {

            wrapper.style.background =
                "#eff6ff";

            wrapper.style.borderColor =
                "#2563eb";

        } else {

            wrapper.style.background =
                "#ffffff";

            wrapper.style.borderColor =
                "#e2e8f0";

        }

    }
);

            }
        );

    }
);

// ==========================================
// LOAD ADMIN STUDENTS
// ==========================================

window.addEventListener("load", function () {

renderAdminStudents();

updateAdminStudentCount();

});


// ==========================================
// VIEW ADMIN STUDENT
// SUPABASE LIVE DATA
// ==========================================

async function viewAdminStudent(studentId) {

    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        alert(
            "Supabase connection is missing."
        );

        return;
    }


    // ==========================================
    // LOAD STUDENT FROM SUPABASE
    // ==========================================

    const {
        data: student,
        error
    } =
        await supabaseClient
            .from("students")
            .select("*")
            .eq(
                "id",
                studentId
            )
            .maybeSingle();


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        console.error(
            "ADMIN STUDENT VIEW ERROR:",
            error
        );

        alert(
            "Student could not be loaded.\n\n" +
            error.message
        );

        return;
    }


    if (!student) {

        alert(
            "Student record not found."
        );

        return;
    }


    // ==========================================
    // STUDENT DETAILS
    // ==========================================

    alert(

        "Student Details\n\n" +

        "Name: " +
        (
            student.name ||
            student.full_name ||
            "—"
        ) +

        "\nFather Name: " +
        (
            student.father_name ||
            "—"
        ) +

        "\nStudent ID: " +
        (
            student.student_id ||
            student.id ||
            "—"
        ) +

        "\nClass: " +
(
    formatClassSection(
        student.student_class,
        student.section
    )
) +

"\nRoll Number: " +
        (
            student.roll_number ||
            "—"
        ) +

        "\nEmail: " +
        (
            student.email ||
            "—"
        ) +

        "\nMobile: " +
        (
            student.mobile ||
            "—"
        ) +

        "\nStatus: " +
        (
            student.status ||
            "Active"
        )

    );

}
// ==========================================
// ADMIN LOGOUT - FIXED
// ==========================================

document.addEventListener("click", function (event) {

const logoutButton =
event.target.closest("#adminLogoutBtn");

if (!logoutButton) {
return;
}
eduPortalShowLogin();
document.documentElement.classList.remove(
    "edu-session-restoring"
);

document.documentElement.classList.remove(
    "edu-role-administrator"
);

document.documentElement.classList.remove(
    "edu-role-teacher"
);

document.documentElement.classList.remove(
    "edu-role-student"
);

// ==========================================
// CLEAR LOGIN SESSION
// ==========================================

localStorage.removeItem("isLoggedIn");
localStorage.removeItem("loggedInRole");


// ==========================================
// HIDE ADMIN DASHBOARD
// ==========================================

const adminDashboard =
document.getElementById("adminDashboard");

if (adminDashboard) {
adminDashboard.style.display = "none";
}


// ==========================================
// HIDE STUDENT DASHBOARD
// ==========================================

const studentDashboard =
document.getElementById("studentDashboard");

if (studentDashboard) {
studentDashboard.style.display = "none";
}

// ==========================================

// SHOW LOGIN SCREEN

// ==========================================

const loginContainer =

document.querySelector(".container");

if (loginContainer) {

loginContainer.classList.remove(
"session-hidden"
);

loginContainer.style.setProperty(
"display",
"flex",
"important"
);

loginContainer.style.setProperty(
"visibility",
"visible",
"important"
);

loginContainer.style.setProperty(
"opacity",
"1",
"important"
);

}

// ==========================================
// RESET LOGIN FIELDS
// ==========================================

const usernameField =
document.getElementById("username");

const passwordField =
document.getElementById("password");

if (usernameField) {
usernameField.value = "";
}

if (passwordField) {
passwordField.value = "";
}


// ==========================================
// CLEAR LOGIN MESSAGE
// ==========================================

const messageElement =
document.getElementById("message");

if (messageElement) {
messageElement.textContent = "";
}


// ==========================================
// RESET ROLE
// ==========================================

const roleField =
document.getElementById("loginRole");

if (roleField) {
roleField.value = "";
}


// ==========================================
// CLOSE ANY OPEN MODALS
// ==========================================

const modals =
document.querySelectorAll(
".admin-student-modal, .settings-modal"
);

modals.forEach(function (modal) {

modal.style.display = "none";

});


// ==========================================
// SCROLL TO TOP
// ==========================================

window.scrollTo({
top: 0,
behavior: "instant"
});

});
// ==========================================
// ADMIN STUDENT SEARCH & CLASS FILTER
// SUPABASE LIVE DATA
// ==========================================

async function filterAdminStudents() {

    const searchInput =
        document.getElementById(
            "adminStudentSearch"
        );

    const classFilter =
        document.getElementById(
            "adminStudentClassFilter"
        );

    const tableBody =
        document.getElementById(
            "adminStudentsTableBody"
        );

    if (!tableBody) {
        return;
    }

    const searchText =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";

    const selectedClass =
        classFilter
            ? classFilter.value
            : "all";

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection is missing."
        );

        return;
    }

    const {
        data: students,
        error
    } =
        await supabaseClient
            .from("students")
            .select(`
                id,
                student_id,
                name,
                student_class,
                section,
                roll_number,
                status
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "ADMIN STUDENT FILTER ERROR:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    Unable to load student records.
                </td>
            </tr>
        `;

        return;
    }

    const filteredStudents =
        (students || []).filter(
            function (student) {

                const name =
                    String(
                        student.name ||
                        student.full_name ||
                        ""
                    ).toLowerCase();

                const studentId =
                    String(
                        student.student_id ||
                        student.id ||
                        ""
                    ).toLowerCase();

                const studentClass =
                    String(
                        student.student_class ||
                        ""
                    ).toLowerCase();

                const matchesSearch =
                    name.includes(searchText) ||
                    studentId.includes(searchText) ||
                    studentClass.includes(searchText);

                const matchesClass =
                    selectedClass === "all" ||
                    String(
                        student.student_class ||
                        ""
                    ) === String(
                        selectedClass
                    );

                return (
                    matchesSearch &&
                    matchesClass
                );
            }
        );

    tableBody.innerHTML = "";

    if (
        filteredStudents.length ===
        0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    No matching student records found.
                </td>
            </tr>
        `;

        return;
    }

    filteredStudents.forEach(
        function (student, index) {

            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML = `
                <td>${index + 1}</td>

                <td>
                    ${
                        student.student_id ||
                        student.id ||
                        "—"
                    }
                </td>

                <td>
                    ${
                        student.name ||
                        student.full_name ||
                        "—"
                    }
                </td>

               <td>
    ${
        formatClassSection(
            student.student_class,
            student.section
        )
    }
</td>

<td>
    ${
        student.roll_number ||
        "—"
    }
</td>

                <td>
                    ${
                        student.status ||
                        "Active"
                    }
                </td>

           
            `;

            tableBody.appendChild(
                row
            );

        }
    );

}
// ==========================================
// SEARCH EVENT
// ==========================================

const adminStudentSearch =
document.getElementById("adminStudentSearch");


if (adminStudentSearch) {

adminStudentSearch.addEventListener(
"input",
filterAdminStudents
);

}


// ==========================================
// CLASS FILTER EVENT
// ==========================================

const adminStudentClassFilter =
document.getElementById(
"adminStudentClassFilter"
);


if (adminStudentClassFilter) {

adminStudentClassFilter.addEventListener(
"change",
filterAdminStudents
);

}
// ==========================================
// ADMIN VIEW STUDENT MODAL
// SUPABASE LIVE DATA
// ==========================================

async function openAdminViewStudent(studentId) {

    if (typeof supabaseClient === "undefined") {
        alert("Supabase connection is missing.");
        return;
    }

    try {

        const { data: student, error } =
            await supabaseClient
                .from("students")
                .select("*")
                .eq("id", studentId)
                .maybeSingle();

        if (error) {
            console.error(
                "ADMIN VIEW STUDENT ERROR:",
                error
            );

            alert(
                "Unable to load student details.\n\n" +
                error.message
            );

            return;
        }

        if (!student) {
            alert("Student record not found.");
            return;
        }

        // -------------------------------
        // STUDENT BASIC INFORMATION
        // -------------------------------

        const name =
            student.name ||
            student.fullName ||
            student.full_name ||
            "—";

        const status =
            student.status ||
            "Active";

        const studentIdValue =
            student.student_id ||
            student.studentId ||
            student.id ||
            "—";

        const fatherName =
            student.father_name ||
            student.fatherName ||
            "—";

        const studentClass =
            student.student_class ||
            student.studentClass ||
            "—";

        const section =
            student.section ||
            "—";

        const rollNumber =
            student.roll_number ||
            student.rollNumber ||
            "—";

        const dob =
            student.date_of_birth ||
            student.dob ||
            "—";

        const email =
            student.email ||
            "—";

        const mobile =
            student.mobile ||
            student.phone ||
            "—";


        // -------------------------------
        // UPDATE VIEW MODAL
        // -------------------------------

        const viewName =
            document.getElementById(
                "viewStudentName"
            );

        const viewStatus =
            document.getElementById(
                "viewStudentStatus"
            );

        const viewId =
            document.getElementById(
                "viewStudentId"
            );

        const viewFather =
            document.getElementById(
                "viewStudentFather"
            );

        const viewClass =
            document.getElementById(
                "viewStudentClass"
            );

        const viewSection =
            document.getElementById(
                "viewStudentSection"
            );

        const viewRoll =
            document.getElementById(
                "viewStudentRoll"
            );

        const viewDOB =
            document.getElementById(
                "viewStudentDOB"
            );

        const viewEmail =
            document.getElementById(
                "viewStudentEmail"
            );

        const viewMobile =
            document.getElementById(
                "viewStudentMobile"
            );


        if (viewName) {
            viewName.textContent = name;
        }

        if (viewStatus) {
            viewStatus.textContent = status;
        }

        if (viewId) {
            viewId.textContent = studentIdValue;
        }

        if (viewFather) {
            viewFather.textContent = fatherName;
        }

     if (viewClass) {

    viewClass.textContent =
        formatClassSection(
            studentClass,
            section
        );
}

        if (viewRoll) {
            viewRoll.textContent = rollNumber;
        }

        if (viewDOB) {
            viewDOB.textContent = dob;
        }

        if (viewEmail) {
            viewEmail.textContent = email;
        }

        if (viewMobile) {
            viewMobile.textContent = mobile;
        }


        // -------------------------------
        // OPEN MODAL
        // -------------------------------

        const modal =
            document.getElementById(
                "adminViewStudentModal"
            );

        if (!modal) {
            alert(
                "Student view modal not found."
            );
            return;
        }

        modal.style.display = "flex";

    } catch (error) {

        console.error(
            "ADMIN VIEW STUDENT ERROR:",
            error
        );

        alert(
            "Unable to open student details."
        );
    }
}
// ==========================================
// CLOSE VIEW STUDENT MODAL
// ==========================================

document.addEventListener("click", function (event) {

if (
event.target.closest("#closeAdminViewStudentModal") ||
event.target.closest("#closeViewStudentBtn")
) {

const modal =
document.getElementById("adminViewStudentModal");

if (modal) {
modal.style.display = "none";
}

}

});
// ==========================================
// OPEN EDIT STUDENT - SUPABASE
// ==========================================

async function openAdminEditStudent(studentId) {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        alert("Supabase connection is missing.");
        return;
    }

    const {
        data: student,
        error
    } =
        await supabaseClient
            .from("students")
            .select("*")
            .eq("id", studentId)
            .maybeSingle();

    if (error) {

        console.error(
            "Supabase Student Load Error:",
            error
        );

        alert(
            "Unable to load student.\n\n" +
            error.message
        );

        return;
    }

    if (!student) {

        alert(
            "Student record not found."
        );

        return;
    }


    // ==========================================
    // FILL EDIT FORM
    // ==========================================

    document.getElementById(
        "editStudentName"
    ).value =
        student.name || "";

    document.getElementById(
        "editStudentFather"
    ).value =
        student.father_name || "";

    document.getElementById(
        "editStudentId"
    ).value =
        student.student_id || "";

    document.getElementById(
        "editStudentClass"
    ).value =
        student.student_class || "";

    document.getElementById(
        "editStudentSection"
    ).value =
        student.section || "";

    document.getElementById(
        "editStudentRoll"
    ).value =
        student.roll_number || "";

    document.getElementById(
        "editStudentDOB"
    ).value =
        student.date_of_birth || "";

    document.getElementById(
        "editStudentEmail"
    ).value =
        student.email || "";

    document.getElementById(
        "editStudentMobile"
    ).value =
        student.mobile || "";

    document.getElementById(
        "editStudentStatus"
    ).value =
        student.status || "Active";


    // ==========================================
    // STORE DATABASE ID IN MODAL
    // ==========================================

    const modal =
        document.getElementById(
            "adminEditStudentModal"
        );

    if (modal) {

        modal.dataset.studentId =
            student.id;

        modal.style.display =
            "flex";
    }

}
// ==========================================
// SAVE EDITED STUDENT - SUPABASE
// ==========================================

document.addEventListener(
    "click",
    async function (event) {

        const saveButton =
            event.target.closest(
                "#saveEditedStudent"
            );

        if (!saveButton) {
            return;
        }

        const modal =
            document.getElementById(
                "adminEditStudentModal"
            );

        if (!modal) {
            return;
        }

        const studentId =
            modal.dataset.studentId;


        if (!studentId) {

            alert(
                "Student ID is missing."
            );

            return;
        }


        // ==========================================
        // GET FORM VALUES
        // ==========================================

        const fullName =
            document.getElementById(
                "editStudentName"
            ).value.trim();

        const fatherName =
            document.getElementById(
                "editStudentFather"
            ).value.trim();

        const studentIdValue =
            document.getElementById(
                "editStudentId"
            ).value.trim();

        const studentClass =
            document.getElementById(
                "editStudentClass"
            ).value;

        const section =
            document.getElementById(
                "editStudentSection"
            ).value;

        const rollNumber =
            document.getElementById(
                "editStudentRoll"
            ).value.trim();

        const dob =
            document.getElementById(
                "editStudentDOB"
            ).value;

        const email =
            document.getElementById(
                "editStudentEmail"
            ).value.trim();

        const mobile =
            document.getElementById(
                "editStudentMobile"
            ).value.trim();

        const status =
            document.getElementById(
                "editStudentStatus"
            ).value;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!fullName) {
            alert(
                "Please enter student name."
            );
            return;
        }

        if (!fatherName) {
            alert(
                "Please enter father name."
            );
            return;
        }

        if (!studentClass) {
            alert(
                "Please select class."
            );
            return;
        }

        if (!section) {
            alert(
                "Please select section."
            );
            return;
        }

        if (!rollNumber) {
            alert(
                "Please enter roll number."
            );
            return;
        }

        if (
            mobile &&
            !/^\d{11}$/.test(mobile)
        ) {
            alert(
                "Mobile number must contain exactly 11 digits."
            );
            return;
        }


        // ==========================================
        // UPDATE SUPABASE
        // ==========================================

        const {
            error
        } =
            await supabaseClient
                .from("students")
                .update({

                    name:
                        fullName,

                    father_name:
                        fatherName,

                    student_id:
                        studentIdValue,

                    student_class:
                        studentClass,

                    section:
                        section,

                    roll_number:
                        rollNumber,

                    date_of_birth:
                        dob || null,

                    email:
                        email || null,

                    mobile:
                        mobile || null,

                    status:
                        status

                })
                .eq(
                    "id",
                    studentId
                );


        if (error) {

            console.error(
                "Supabase Student Update Error:",
                error
            );

            alert(
                "Student could not be updated.\n\n" +
                error.message
            );

            return;
        }


        // ==========================================
        // CLOSE MODAL
        // ==========================================

        modal.style.display =
            "none";


        // ==========================================
        // REFRESH
        // ==========================================

        if (
            typeof renderAdminStudents ===
            "function"
        ) {
            await renderAdminStudents();
        }

        if (
            typeof updateAdminStudentCount ===
            "function"
        ) {
            await updateAdminStudentCount();
        }

        if (
            typeof renderUserManagementStudents ===
            "function"
        ) {
            await renderUserManagementStudents();
        }


        alert(
            "Student information updated successfully. ✅"
        );

    }
);
// ==========================================
// CLOSE EDIT MODAL
// ==========================================

document.addEventListener("click", function (event) {

if (
event.target.closest("#closeAdminEditStudentModal") ||
event.target.closest("#cancelEditStudent")
) {

const modal =
document.getElementById("adminEditStudentModal");

if (modal) {
modal.style.display = "none";
}

}

});
// ==========================================
// AUTO GENERATE STUDENT ID - SUPABASE
// ==========================================

async function generateAdminStudentId() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.error(
            "Supabase connection missing."
        );

        return "EDU-0001";
    }

    const {
        data,
        error
    } =
        await supabaseClient
            .from("students")
            .select("student_id");

    if (error) {

        console.error(
            "Supabase Student ID Load Error:",
            error
        );

        return "EDU-0001";
    }

    let nextNumber = 1;

    (data || []).forEach(function (student) {

        const studentId =
            String(
                student.student_id || ""
            );

        const match =
            studentId.match(/^EDU-(\d+)$/);

        if (!match) {
            return;
        }

        const number =
            parseInt(
                match[1],
                10
            );

        if (
            number >=
            nextNumber
        ) {
            nextNumber =
                number + 1;
        }

    });

    return (
        "EDU-" +
        String(nextNumber)
            .padStart(4, "0")
    );
}

// ==========================================
// MOBILE NUMBER - 11 DIGIT VALIDATION
// ==========================================

document.addEventListener("input", function (event) {

if (event.target.id === "adminNewStudentMobile") {

// Sirf numbers allow
event.target.value =
event.target.value.replace(/\D/g, "");

// Maximum 11 digits
if (event.target.value.length > 11) {

event.target.value =
event.target.value.slice(0, 11);

}

}

});
// ==========================================
// ADMIN STUDENT TABLE ACTIONS
// ==========================================

document.addEventListener("click", function (event) {

const viewButton =
event.target.closest(".admin-table-view-btn");

if (viewButton) {

const studentId =
Number(viewButton.dataset.studentId);

openAdminViewStudent(studentId);

return;
}


const editButton =
event.target.closest(".admin-table-edit-btn");

if (editButton) {

const studentId =
Number(editButton.dataset.studentId);

openAdminEditStudent(studentId);

return;
}

});



// ==========================================
// ADD RESULT MODAL - OPEN / CLOSE
// ==========================================

const addNewResultBtn =
document.getElementById("addNewResultBtn");

const addResultModal =
document.getElementById("addResultModal");

const closeResultModal =
document.getElementById("closeResultModal");

const cancelResultBtn =
document.getElementById("cancelResultBtn");


// OPEN MODAL
if (addNewResultBtn) {

addNewResultBtn.addEventListener("click", function () {

if (addResultModal) {

addResultModal.style.display = "flex";

}

});

}


// CLOSE MODAL
if (closeResultModal) {

closeResultModal.addEventListener("click", function () {

if (addResultModal) {

addResultModal.style.display = "none";

}

});

}


// CANCEL BUTTON
if (cancelResultBtn) {

cancelResultBtn.addEventListener("click", function () {

if (addResultModal) {

addResultModal.style.display = "none";

}

});

}


// CLOSE WHEN CLICKING OUTSIDE MODAL
if (addResultModal) {

addResultModal.addEventListener("click", function (event) {

if (event.target === addResultModal) {

addResultModal.style.display = "none";

}

});

}
// ==========================================
// RESULTS - AUTO CALCULATION
// ==========================================

const resultTotalMarks =
document.getElementById("resultTotalMarks");

const resultObtainedMarks =
document.getElementById("resultObtainedMarks");

const resultPercentagePreview =
document.getElementById("resultPercentagePreview");

const resultGradePreview =
document.getElementById("resultGradePreview");


function calculateResultGrade() {

const total =
Number(resultTotalMarks.value);

const obtained =
Number(resultObtainedMarks.value);


if (!total || total <= 0 || obtained < 0) {

resultPercentagePreview.textContent = "0%";

resultGradePreview.textContent = "—";

return {
percentage: 0,
grade: "—"
};

}


if (obtained > total) {

resultPercentagePreview.textContent = "Invalid";

resultGradePreview.textContent = "—";

return {
percentage: null,
grade: null
};

}


const percentage =
Number(((obtained / total) * 100).toFixed(2));


let grade = "F";


if (percentage >= 90) {

grade = "A+";

} else if (percentage >= 80) {

grade = "A";

} else if (percentage >= 70) {

grade = "B";

} else if (percentage >= 60) {

grade = "C";

} else if (percentage >= 50) {

grade = "D";

} else {

grade = "F";

}


resultPercentagePreview.textContent =
percentage + "%";

resultGradePreview.textContent =
grade;


return {
percentage,
grade
};

}


if (resultTotalMarks) {

resultTotalMarks.addEventListener(
"input",
calculateResultGrade
);

}


if (resultObtainedMarks) {

resultObtainedMarks.addEventListener(
"input",
calculateResultGrade
);

}


// ==========================================
// RESULTS - SAVE
// SUPABASE LIVE DATA
// ==========================================

const saveResultBtn =
    document.getElementById(
        "saveResultBtn"
    );


if (saveResultBtn) {

    saveResultBtn.addEventListener(
        "click",
        async function () {

            if (
                typeof supabaseClient ===
                "undefined"
            ) {
                alert(
                    "Supabase connection is missing."
                );
                return;
            }


            const studentValue =
                document.getElementById(
                    "resultStudent"
                ).value;


            const exam =
                document.getElementById(
                    "resultExam"
                ).value.trim();


            const subject =
                document.getElementById(
                    "resultSubject"
                ).value.trim();


            const totalMarks =
                Number(
                    document.getElementById(
                        "resultTotalMarks"
                    ).value
                );


            const obtainedMarks =
                Number(
                    document.getElementById(
                        "resultObtainedMarks"
                    ).value
                );


            // ==========================================
            // VALIDATION
            // ==========================================

            if (!studentValue) {

                alert(
                    "Please select a student. ⚠️"
                );

                return;
            }


            if (!exam) {

                alert(
                    "Please select an exam. ⚠️"
                );

                return;
            }


            if (!subject) {

                alert(
                    "Please select a subject. ⚠️"
                );

                return;
            }


            if (
                !totalMarks ||
                totalMarks <= 0
            ) {

                alert(
                    "Please enter valid total marks. ⚠️"
                );

                return;
            }


            if (
                obtainedMarks < 0 ||
                obtainedMarks > totalMarks
            ) {

                alert(
                    "Obtained marks cannot be greater than total marks. ⚠️"
                );

                return;
            }


            // ==========================================
            // FIND STUDENT IN SUPABASE
            // ==========================================

            const {
                data: student,
                error: studentError
            } =
                await supabaseClient
                    .from("students")
                    .select("*")
                    .eq(
                        "student_id",
                        String(
                            studentValue
                        )
                    )
                    .maybeSingle();


            if (studentError) {

                console.error(
                    "RESULT STUDENT ERROR:",
                    studentError
                );

                alert(
                    "Unable to find student.\n\n" +
                    studentError.message
                );

                return;
            }


            if (!student) {

                alert(
                    "Student not found in Supabase."
                );

                return;
            }


            // ==========================================
            // FIND SUBJECT IN SUPABASE
            // ==========================================

            const {
                data: subjectRows,
                error: subjectError
            } =
                await supabaseClient
                    .from("subjects")
                    .select(
                        "id, name"
                    );


            if (subjectError) {

                console.error(
                    "RESULT SUBJECT ERROR:",
                    subjectError
                );

                alert(
                    "Unable to load subjects.\n\n" +
                    subjectError.message
                );

                return;
            }


            const subjectRow =
                (subjectRows || []).find(
                    function (row) {

                        return String(
                            row.name || ""
                        )
                        .trim()
                        .toLowerCase() ===
                        subject
                            .trim()
                            .toLowerCase();
                    }
                );


            if (!subjectRow) {

                alert(
                    "Subject not found in Supabase.\n\n" +
                    "Subject: " +
                    subject
                );

                return;
            }


            // ==========================================
            // CALCULATE RESULT
            // ==========================================

            const percentage =
                Math.round(
                    (
                        obtainedMarks /
                        totalMarks
                    ) * 100
                );


            let grade = "F";


            if (percentage >= 80) {
                grade = "A+";
            }
            else if (percentage >= 70) {
                grade = "A";
            }
            else if (percentage >= 60) {
                grade = "B";
            }
            else if (percentage >= 50) {
                grade = "C";
            }
            else if (percentage >= 40) {
                grade = "D";
            }


         // ==========================================
// SAVE / UPDATE RESULT
// SUPABASE LIVE DATA
// ==========================================

const record = {

    student_id:
        student.id,

    subject_id:
        subjectRow.id,

    total_marks:
        totalMarks,

    marks:
        obtainedMarks,

    obtained_marks:
        obtainedMarks,

    percentage:
        percentage,

    grade:
        grade
};


let saveError = null;


// ==========================================
// EDIT EXISTING RESULT
// ==========================================

if (
    window.adminEditingResultId
) {

    const {
        error
    } =
        await supabaseClient
            .from("results")
            .update(
                record
            )
            .eq(
                "id",
                window.adminEditingResultId
            );

    saveError =
        error;

}


// ==========================================
// ADD NEW RESULT
// ==========================================

else {

    const {
        error
    } =
        await supabaseClient
            .from("results")
            .insert([
                record
            ]);

    saveError =
        error;
}


// ==========================================
// CHECK ERROR
// ==========================================

if (saveError) {

    console.error(
        "RESULT SAVE/UPDATE ERROR:",
        saveError
    );

    alert(
        "Result could not be saved.\n\n" +
        saveError.message
    );

    return;
}


// ==========================================
// CLEAR EDIT MODE
// ==========================================

window.adminEditingResultId =
    null;

            // ==========================================
            // CLOSE MODAL
            // ==========================================

            if (addResultModal) {

                addResultModal.style.display =
                    "none";
            }


            // ==========================================
            // REFRESH RESULTS
            // ==========================================

            if (
                typeof renderResultsTable ===
                "function"
            ) {
                await renderResultsTable();
            }


            if (
                typeof AdminDashboard !==
                "undefined" &&
                typeof AdminDashboard.refresh ===
                "function"
            ) {
                await AdminDashboard.refresh();
            }


            alert(
                "Result saved successfully! ✅"
            );
        }
    );
}
// ==========================================
// RESULTS - LOAD STUDENTS INTO DROPDOWN
// SUPABASE LIVE DATA
// ==========================================

async function loadStudentsIntoResultsDropdown() {

    const studentDropdown =
        document.getElementById(
            "resultStudent"
        );

    if (!studentDropdown) {
        return;
    }


    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.error(
            "Supabase connection is missing."
        );
        return;
    }


    // ==========================================
    // LOAD STUDENTS FROM SUPABASE
    // ==========================================

    const {
        data: students,
        error
    } =
        await supabaseClient
            .from("students")
            .select(
                "id, student_id, name, student_class, section"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "RESULT STUDENTS LOAD ERROR:",
            error
        );

        studentDropdown.innerHTML = `
            <option value="">
                Unable to load students
            </option>
        `;

        return;
    }


    // ==========================================
    // RESET DROPDOWN
    // ==========================================

    studentDropdown.innerHTML = `
        <option value="">
            Select Student
        </option>
    `;


    // ==========================================
    // NO STUDENTS
    // ==========================================

    if (
        !students ||
        students.length === 0
    ) {

        studentDropdown.innerHTML += `
            <option value="" disabled>
                No students available
            </option>
        `;

        return;
    }


    // ==========================================
    // ADD STUDENTS
    // ==========================================

    students.forEach(
        function(student) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                student.student_id ||
                student.id;


            option.textContent =
                (
                    student.name ||
                    student.full_name ||
                    "Unnamed Student"
                ) +
                " — " +
                (
                    student.student_id ||
                    student.id
                );


            studentDropdown.appendChild(
                option
            );
        }
    );
}
// ==========================================
// RESULT STUDENT CHANGE
// AUTO CLASS + SUBJECTS
// ==========================================

const resultStudentField =
    document.getElementById("resultStudent");

if (resultStudentField) {

    resultStudentField.addEventListener(
        "change",
        async function () {

            const selectedStudentId =
                this.value;

            const classField =
                document.getElementById(
                    "resultStudentClass"
                );

            const subjectField =
                document.getElementById(
                    "resultSubject"
                );

            // Reset
            if (classField) {
                classField.value = "";
            }

            if (subjectField) {
                subjectField.innerHTML = `
                    <option value="">
                        Loading subjects...
                    </option>
                `;
            }

            if (!selectedStudentId) {

                if (subjectField) {
                    subjectField.innerHTML = `
                        <option value="">
                            Select Subject
                        </option>
                    `;
                }

                return;
            }

            // ==========================================
            // GET SELECTED STUDENT
            // ==========================================

            const {
                data: student,
                error: studentError
            } = await supabaseClient
                .from("students")
                .select(
                    "id, student_id, name, student_class, section"
                )
             .eq(
    "id",
    String(selectedStudentId)
)
                .maybeSingle();

            if (studentError) {

                console.error(
                    "RESULT STUDENT LOAD ERROR:",
                    studentError
                );

                if (classField) {
                    classField.value =
                        "Unable to load";
                }

                return;
            }

            if (!student) {

                if (classField) {
                    classField.value =
                        "Student not found";
                }

                return;
            }

            // ==========================================
            // AUTO FILL CLASS / SECTION
            // ==========================================

            const studentClass =
                student.student_class || "";

            const studentSection =
                student.section || "";

            if (classField) {

                classField.value =
                    studentClass +
                    (
                        studentSection
                            ? " - " +
                              studentSection
                            : ""
                    );
            }

            // ==========================================
            // LOAD SUBJECTS
            // ==========================================

            const {
                data: subjects,
                error: subjectError
            } = await supabaseClient
                .from("subjects")
                .select("*")
                .order(
                    "id",
                    {
                        ascending: true
                    }
                );

            if (subjectError) {

                console.error(
                    "RESULT SUBJECT LOAD ERROR:",
                    subjectError
                );

                if (subjectField) {
                    subjectField.innerHTML = `
                        <option value="">
                            Unable to load subjects
                        </option>
                    `;
                }

                return;
            }

            // ==========================================
            // FILTER SUBJECTS BY STUDENT CLASS
            // ==========================================

            const matchingSubjects =
                (subjects || []).filter(
                    function(subject) {

                        const subjectClass =
                            subject.student_class ||
                            subject.class_name ||
                            subject.className ||
                            subject.class ||
                            "";

                        return String(
                            subjectClass
                        ).trim().toLowerCase()
                        ===
                        String(
                            studentClass
                        ).trim().toLowerCase();

                    }
                );

            // ==========================================
            // DISPLAY SUBJECTS
            // ==========================================

            if (!subjectField) {
                return;
            }

            subjectField.innerHTML = `
                <option value="">
                    Select Subject
                </option>
            `;

            matchingSubjects.forEach(
                function(subject) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        subject.name ||
                        subject.subject_name ||
                        subject.title ||
                        "";

                    option.textContent =
                        subject.name ||
                        subject.subject_name ||
                        subject.title ||
                        "Subject";

                    option.dataset.subjectId =
                        subject.id;

                    subjectField.appendChild(
                        option
                    );
                }
            );

            if (
                matchingSubjects.length === 0
            ) {

                subjectField.innerHTML = `
                    <option value="">
                        No subjects available
                        for this class
                    </option>
                `;
            }
        }
    );
}
// ==========================================
// LOAD STUDENTS WHEN RESULT MODAL OPENS
// ==========================================

if (addNewResultBtn) {

addNewResultBtn.addEventListener(
"click",
function () {

loadStudentsIntoResultsDropdown();

if (addResultModal) {

addResultModal.style.display =
"flex";

}

}
);

}


// ==========================================
// LOAD STUDENTS ON PAGE LOAD
// ==========================================

document.addEventListener(
"DOMContentLoaded",
function () {

loadStudentsIntoResultsDropdown();

}
);
// ==========================================
// RESULTS - RENDER TABLE
// SUPABASE LIVE DATA
// ==========================================

async function renderResultsTable() {

    const tableBody =
        document.getElementById(
            "resultsTableBody"
        );

    if (!tableBody) {
        return;
    }

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.error(
            "Supabase connection is missing."
        );
        return;
    }


    // ==========================================
    // LOAD RESULTS
    // ==========================================

    const {
        data: resultsData,
        error: resultsError
    } =
        await supabaseClient
            .from("results")
            .select(`
               id,
student_id,
subject_id,
total_marks,
marks
            `)
            .order(
                "id",
                {
                    ascending: false
                }
            );


    if (resultsError) {

        console.error(
            "RESULTS LOAD ERROR:",
            resultsError
        );

        tableBody.innerHTML = `
            <tr class="results-empty-row">
                <td colspan="10">
                    <div class="results-empty-state">
                        <div>⚠️</div>
                        <h3>Unable to Load Results</h3>
                        <p>
                            ${resultsError.message}
                        </p>
                    </div>
                </td>
            </tr>
        `;

        updateResultsStatistics([]);

        return;
    }


    const rawResults =
        resultsData || [];


    if (rawResults.length === 0) {

        tableBody.innerHTML = `
            <tr class="results-empty-row">
                <td colspan="10">

                    <div class="results-empty-state">

                        <div>📊</div>

                        <h3>No Results Found</h3>

                        <p>
                            Add student results to see
                            records here.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        updateResultsStatistics([]);

        return;
    }


    // ==========================================
    // LOAD STUDENTS
    // ==========================================

    const {
        data: students
    } =
        await supabaseClient
            .from("students")
            .select(
                "id, student_id, name, full_name, student_class, section"
            );


    // ==========================================
    // LOAD SUBJECTS
    // ==========================================

    const {
        data: subjects
    } =
        await supabaseClient
            .from("subjects")
            .select(
                "id, name"
            );


    // ==========================================
    // MAP RESULTS FOR UI
    // ==========================================

    const results =
        rawResults.map(
            function(result) {

                const student =
                    (students || []).find(
                        function(item) {

                            return String(
                                item.id
                            ) ===
                            String(
                                result.student_id
                            );
                        }
                    );


                const subject =
                    (subjects || []).find(
                        function(item) {

                            return String(
                                item.id
                            ) ===
                            String(
                                result.subject_id
                            );
                        }
                    );


                return {

                    id:
                        result.id,

                    studentId:
                        student
                            ? (
                                student.student_id ||
                                student.id
                            )
                            : result.student_id,

                    studentName:
                        student
                            ? (
                                student.name ||
                                student.full_name ||
                                "—"
                            )
                            : "—",

                    studentClass:
                        student
                            ? (
                                student.student_class ||
                                ""
                            )
                            : "",

                    section:
                        student
                            ? (
                                student.section ||
                                ""
                            )
                            : "",

                    subject:
                        subject
                            ? (
                                subject.name ||
                                "—"
                            )
                            : "—",

                    totalMarks:
                        result.total_marks ||
                        0,

                    obtainedMarks:
                        result.obtained_marks ??
                        result.marks ??
                        0,

                    percentage:
                        Number(
                            result.percentage
                        ) || 0,

                    grade:
                        result.grade ||
                        "—"
                };
            }
        );


    // ==========================================
    // RENDER TABLE
    // ==========================================

    tableBody.innerHTML = "";


    results.forEach(
        function(result, index) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${result.studentId || "—"}
                </td>

                <td>
                    ${result.studentName || "—"}
                </td>

                <td>
                    ${
                        result.studentClass
                            ? result.studentClass +
                              " - " +
                              (
                                  result.section ||
                                  ""
                              )
                            : "—"
                    }
                </td>

                <td>
                    ${result.subject || "—"}
                </td>

                <td>
                    ${result.totalMarks}
                </td>

                <td>
                    ${result.obtainedMarks}
                </td>

                <td>

                    <span class="result-percentage">
                        ${result.percentage}%
                    </span>

                </td>

                <td>

                    <span class="result-grade">
                        ${result.grade}
                    </span>

                </td>

                <td>

                    <div class="result-actions">

                        <button
                            type="button"
                            class="result-action-btn"
                            title="View all subjects"
                            onclick="viewStudentResults('${result.studentId}')"
                        >
                            👁️
                        </button>


                        <button
                            type="button"
                            class="result-action-btn result-edit-btn"
                            title="Edit result"
                           onclick="openEditResult('${result.id}')"
                        >
                            ✏️
                        </button>


                        <button
                            type="button"
                            class="result-action-btn"
                            title="Delete result"
                            onclick="deleteResult('${result.id}')"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            tableBody.appendChild(
                row
            );
        }
    );


    // ==========================================
    // UPDATE STATISTICS
    // ==========================================

    updateResultsStatistics(
        results
    );
}

// ==========================================
// RESULTS STATISTICS
// SUPABASE LIVE DATA
// ==========================================

async function updateResultsStatistics() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.error(
            "Supabase connection is missing."
        );
        return;
    }

  const {
    data: results,
    error
} =
    await supabaseClient
        .from("results")
        .select(
            "id, student_id, total_marks, marks"
        );

if (error) {

    console.error(
        "RESULT STATISTICS LOAD ERROR:",
        error
    );

    return;
}

const resultRecords =
    results || [];


// ==========================================
// LOAD TOTAL STUDENTS
// ==========================================

const {
    data: students,
    error: studentsError
} =
    await supabaseClient
        .from("students")
        .select("id");

if (studentsError) {

    console.error(
        "TOTAL STUDENTS LOAD ERROR:",
        studentsError
    );

}

const totalStudents =
    (students || []).length;

    const totalResults =
        resultRecords.length;

    const passedResults =
        resultRecords.filter(
            function(result) {

                return String(
                    result.grade ||
                    ""
                ).toUpperCase() !==
                "F";
            }
        );

    const failedResults =
        resultRecords.filter(
            function(result) {

                return String(
                    result.grade ||
                    ""
                ).toUpperCase() ===
                "F";
            }
        );

    const totalPercentage =
        resultRecords.reduce(
            function(total, result) {

                return total +
                    (
                        Number(
                            result.percentage
                        ) || 0
                    );

            },
            0
        );

    const averagePercentage =
        totalResults > 0
            ? Math.round(
                totalPercentage /
                totalResults
            )
            : 0;

    const passedCount =
        passedResults.length;

    const failedCount =
        failedResults.length;

    const passRate =
        totalResults > 0
            ? Math.round(
                (
                    passedCount /
                    totalResults
                ) * 100
            )
            : 0;


    // ==========================================
    // UPDATE EXISTING UI
    // ==========================================

    const totalElement =
        document.getElementById(
            "resultsTotalStudents"
        );

    const averageElement =
        document.getElementById(
            "resultsAveragePercentage"
        );

    const passedElement =
        document.getElementById(
            "resultsPassedStudents"
        );

    const failedElement =
        document.getElementById(
            "resultsFailedStudents"
        );

    const passRateElement =
        document.getElementById(
            "resultsPassRate"
        );


   if (totalElement) {
    totalElement.textContent =
        totalStudents;
}

    if (averageElement) {
        averageElement.textContent =
            averagePercentage +
            "%";
    }

    if (passedElement) {
        passedElement.textContent =
            passedCount;
    }

    if (failedElement) {
        failedElement.textContent =
            failedCount;
    }

    if (passRateElement) {
        passRateElement.textContent =
            passRate +
            "%";
    }
}

// ==========================================
// RESULT EDIT + DELETE
// SUPABASE LIVE DATA
// ==========================================


// ==========================================
// OPEN EDIT RESULT
// ==========================================

async function openEditResult(resultId) {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        alert(
            "Supabase connection is missing."
        );
        return;
    }


    try {

        const {
            data: result,
            error
        } =
            await supabaseClient
                .from("results")
                .select(`
                    id,
                    student_id,
                    subject_id,
                    total_marks,
                    marks,
                    
                    percentage,
                    grade
                `)
                .eq(
                    "id",
                    resultId
                )
                .maybeSingle();


        if (error) {

            console.error(
                "EDIT RESULT LOAD ERROR:",
                error
            );

            alert(
                "Unable to load result.\n\n" +
                error.message
            );

            return;
        }


        if (!result) {

            alert(
                "Result record not found."
            );

            return;
        }


        // ==========================================
        // LOAD STUDENTS
        // ==========================================

        const {
            data: students
        } =
            await supabaseClient
                .from("students")
                .select(
                    "id, student_id, name"
                );


        // ==========================================
        // LOAD SUBJECTS
        // ==========================================

        const {
            data: subjects
        } =
            await supabaseClient
                .from("subjects")
                .select(
                    "id, name"
                );


        const student =
            (students || []).find(
                function(item) {

                    return String(
                        item.id
                    ) ===
                    String(
                        result.student_id
                    );
                }
            );


        const subject =
            (subjects || []).find(
                function(item) {

                    return String(
                        item.id
                    ) ===
                    String(
                        result.subject_id
                    );
                }
            );


        // ==========================================
        // OPEN EXISTING RESULT MODAL
        // ==========================================

        const modal =
            document.getElementById(
                "addResultModal"
            );


        if (!modal) {

            alert(
                "Result modal not found."
            );

            return;
        }


        // ==========================================
        // LOAD STUDENTS INTO DROPDOWN
        // ==========================================

        await loadStudentsIntoResultsDropdown();


        const studentField =
            document.getElementById(
                "resultStudent"
            );


        const subjectField =
            document.getElementById(
                "resultSubject"
            );


        const totalMarksField =
            document.getElementById(
                "resultTotalMarks"
            );


        const obtainedMarksField =
            document.getElementById(
                "resultObtainedMarks"
            );


        if (studentField) {

            studentField.value =
                student
                    ? (
                        student.student_id ||
                        student.id
                    )
                    : "";
        }


        if (subjectField) {

            subjectField.value =
                subject
                    ? (
                        subject.name ||
                        ""
                    )
                    : "";
        }


        if (totalMarksField) {

            totalMarksField.value =
                result.total_marks ||
                0;
        }


        if (obtainedMarksField) {

            obtainedMarksField.value =
                result.obtained_marks ??
                result.marks ??
                0;
        }


        // ==========================================
        // REMEMBER EDITING RESULT
        // ==========================================

        window.adminEditingResultId =
            result.id;


        // ==========================================
        // CHANGE MODAL TITLE
        // ==========================================

        const modalTitle =
            modal.querySelector(
                "h2, h3, .modal-title"
            );


        if (modalTitle) {

            modalTitle.textContent =
                "Edit Result";
        }


        modal.style.display =
            "flex";


        // Recalculate preview

        if (
            typeof calculateResultGrade ===
            "function"
        ) {
            calculateResultGrade();
        }


    } catch (error) {

        console.error(
            "OPEN EDIT RESULT ERROR:",
            error
        );

        alert(
            "Unable to open result for editing."
        );
    }
}



// ==========================================
// DELETE RESULT
// SUPABASE LIVE DATA
// ==========================================

async function deleteResult(resultId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to permanently delete this result?"
        );


    if (!confirmDelete) {
        return;
    }


    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        alert(
            "Supabase connection is missing."
        );
        return;
    }


    try {

        const {
            error
        } =
            await supabaseClient
                .from("results")
                .delete()
                .eq(
                    "id",
                    resultId
                );


        if (error) {

            console.error(
                "RESULT DELETE ERROR:",
                error
            );

            alert(
                "Result could not be deleted.\n\n" +
                error.message
            );

            return;
        }


        if (
            typeof renderResultsTable ===
            "function"
        ) {
            await renderResultsTable();
        }


        if (
            typeof AdminDashboard !==
            "undefined" &&
            typeof AdminDashboard.refresh ===
            "function"
        ) {
            await AdminDashboard.refresh();
        }


        alert(
            "Result deleted successfully. ✅"
        );


    } catch (error) {

        console.error(
            "RESULT DELETE ERROR:",
            error
        );

        alert(
            "Unable to delete result."
        );
    }
}

// ==========================================
// RESULTS INITIAL LOAD + REALTIME
// SUPABASE LIVE SYNC
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // Initial Results Load
        if (
            typeof renderResultsTable ===
            "function"
        ) {
            await renderResultsTable();
        }


        // Supabase Check
        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            console.error(
                "Supabase connection is missing."
            );
            return;
        }


        // ==========================================
        // REALTIME RESULTS LISTENER
        // ==========================================

        supabaseClient
            .channel(
                "admin-results-realtime"
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "results"
                },
                async function () {

                    console.log(
                        "Supabase Results changed — refreshing..."
                    );


                    if (
                        typeof renderResultsTable ===
                        "function"
                    ) {
                        await renderResultsTable();
                    }


                    if (
                        typeof updateResultsStatistics ===
                        "function"
                    ) {
                        await updateResultsStatistics();
                    }


                    if (
                        typeof AdminDashboard !==
                        "undefined" &&
                        typeof AdminDashboard.refresh ===
                        "function"
                    ) {
                        await AdminDashboard.refresh();
                    }

                }
            )
            .subscribe();

    }
);

// ==========================================
// USER MANAGEMENT - STUDENTS + TEACHERS
// ADMIN CENTRAL USER MANAGEMENT
// ==========================================

async function renderUserManagementStudents() {

    const tableBody =
        document.getElementById(
            "adminUsersStudentsTableBody"
        );

    if (!tableBody) {
        return;
    }

    // ==========================================
    // LOAD STUDENTS FROM SUPABASE
    // ==========================================

    let students = [];

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("students")
                .select("*")
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );

        if (error) {
            console.error(
                "USER MANAGEMENT STUDENT ERROR:",
                error
            );
        } else {
            students = data || [];
        }

    } catch (error) {

        console.error(
            "STUDENT LOAD ERROR:",
            error
        );

    }


    // ==========================================
    // LOAD TEACHERS FROM SUPABASE
    // ==========================================

    let teachers = [];

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("teachers")
                .select("*")
                .order(
                    "id",
                    {
                        ascending: false
                    }
                );

        if (error) {
            console.error(
                "USER MANAGEMENT TEACHER ERROR:",
                error
            );
        } else {
            teachers = data || [];
        }

    } catch (error) {

        console.error(
            "TEACHER LOAD ERROR:",
            error
        );

    }


    // ==========================================
    // COMBINE USERS
    // ==========================================

    const users = [];


    // ==========================================
    // STUDENTS
    // ==========================================

    students.forEach(function (student) {

        users.push({

            type: "student",

            role: "Student",

            roleIcon: "🎓",

            recordId:
                student.id,

            id:
                student.student_id ||
                student.studentId ||
                student.id ||
                "—",

            name:
                student.name ||
                student.fullName ||
                student.full_name ||
                "—",

            classSubject:
                student.student_class
                    ? "Class " +
                      student.student_class
                    :
                    (
                        student.studentClass
                            ? "Class " +
                              student.studentClass
                            : "—"
                    ),

            username:
                student.username ||
                "—",

            password:
                student.password ||
                "",

            status:
                student.status ||
                "Active"

        });

    });


    // ==========================================
    // TEACHERS
    // ==========================================

    teachers.forEach(function (teacher) {

        users.push({

            type: "teacher",

            role: "Teacher",

            roleIcon: "👨‍🏫",

            recordId:
                teacher.id,

            id:
                teacher.teacher_id ||
                teacher.teacherId ||
                teacher.id ||
                "—",

            name:
                teacher.name ||
                teacher.fullName ||
                teacher.full_name ||
                "—",

            classSubject:
                teacher.subject ||
                teacher.teacher_class ||
                teacher.teacherClass ||
                "—",

            username:
                teacher.username ||
                "—",

            password:
                teacher.password ||
                "",

            status:
                teacher.status ||
                "Active"

        });

    });


    // ==========================================
    // NO USERS
    // ==========================================

    if (users.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#64748b;
                    "
                >
                    👥 No Student or Teacher
                    accounts found.
                </td>
            </tr>
        `;

        return;
    }


    // ==========================================
    // CLEAR TABLE
    // ==========================================

    tableBody.innerHTML = "";


    // ==========================================
    // RENDER USERS
    // ==========================================

    users.forEach(function (user, index) {

        const row =
            document.createElement("tr");


        const roleClass =
            user.type === "teacher"
                ? "teacher"
                : "student";


        const passwordDisplay =
            user.password
                ? "••••••••"
                : "Not Set";


        row.innerHTML = `

            <!-- NUMBER -->

            <td>
                ${index + 1}
            </td>


            <!-- ROLE -->

            <td>

                <span
                    class="
                        user-role-badge
                        ${roleClass}
                    "
                >

                    ${user.roleIcon}

                    ${user.role}

                </span>

            </td>


            <!-- ID -->

            <td>

                <strong
                    class="student-id-text"
                >

                    ${user.id}

                </strong>

            </td>


            <!-- NAME -->

            <td>

                <strong>

                    ${user.name}

                </strong>

            </td>


            <!-- CLASS / SUBJECT -->

            <td>

                ${user.classSubject}

            </td>


            <!-- USERNAME -->

            <td>

                <strong>

                    ${user.username}

                </strong>

            </td>


            <!-- PASSWORD -->

            <td>

                <div
                    class="student-password-cell"
                >

                    <span
                        id="userPassword-${index}"
                        class="student-password-text"
                    >

                        ${passwordDisplay}

                    </span>


                  ${
    user.password
        ?
        `
            <button
                type="button"
                class="user-password-toggle"
                data-record-id="${user.recordId}"
                data-user-type="${user.type}"
                onclick="toggleUserManagementPassword(${index}, this)"
                title="Show Password"
            >
                👁️
            </button>
        `
        :
        ""
}

                </div>

            </td>


            <!-- STATUS -->

            <td>

                <button
                    type="button"
                    class="
                        user-status-btn
                        ${
                            String(
                                user.status
                            ).toLowerCase() ===
                            "active"
                                ? "active"
                                : "disabled"
                        }
                    "
                    onclick="
                        toggleUserManagementStatus(
                            ${index}
                        )
                    "
                >

                    ${user.status}

                </button>

            </td>


            <!-- ACTIONS -->

            <td>

                <div
                    class="user-management-actions-cell"
                    style="
                        display:flex;
                        gap:8px;
                        align-items:center;
                        justify-content:center;
                    "
                >

         


                    <!-- EDIT -->

                    <button
                        type="button"
                        class="user-edit-btn"
                        data-action="edit"
                        data-user-type="${user.type}"
                        data-user-id="${user.recordId}"
                        data-student-id="${user.recordId}"
                        title="Edit User"
                        style="
                            border:none;
                            background:#2563eb;
                            color:white;
                            width:38px;
                            height:38px;
                            border-radius:10px;
                            cursor:pointer;
                            font-size:17px;
                        "
                    >

                        ✏️

                    </button>


                    <!-- DELETE -->

                    <button
                        type="button"
                        class="user-delete-btn"
                        data-action="delete"
                        data-user-type="${user.type}"
                        data-student-id="${user.recordId}"
                        title="Delete User"
                        style="
                            border:none;
                            background:#fee2e2;
                            color:#dc2626;
                            width:38px;
                            height:38px;
                            border-radius:10px;
                            cursor:pointer;
                            font-size:17px;
                        "
                    >

                        🗑️

                    </button>

                </div>

            </td>

        `;


        tableBody.appendChild(row);

    });

}
// ==========================================
// SHOW / HIDE STUDENT PASSWORD
// SUPABASE LIVE DATA
// ==========================================

async function toggleStudentPassword(
    studentId,
    button
) {

    const passwordElement =
        document.getElementById(
            "studentPassword-" + studentId
        );

    if (!passwordElement) {
        return;
    }

    // Already showing → hide
    if (
        passwordElement.textContent.trim() !==
        "••••••••"
    ) {

        passwordElement.textContent =
            "••••••••";

        button.textContent =
            "👁️";

        button.title =
            "Show Password";

        return;
    }

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        alert(
            "Supabase connection is missing."
        );

        return;
    }

    const {
        data: student,
        error
    } =
        await supabaseClient
            .from("students")
            .select("password")
            .eq("id", studentId)
            .maybeSingle();

    if (error) {

        console.error(
            "STUDENT PASSWORD LOAD ERROR:",
            error
        );

        alert(
            "Unable to load student password.\n\n" +
            error.message
        );

        return;
    }

    if (!student) {

        alert(
            "Student record not found."
        );

        return;
    }

    passwordElement.textContent =
        student.password ||
        "Not Set";

    button.textContent =
        "🙈";

    button.title =
        "Hide Password";
}
// ==========================================
// SHOW / HIDE USER MANAGEMENT PASSWORD
// ==========================================

async function toggleUserManagementPassword(index, button) {

    const passwordElement =
        document.getElementById("userPassword-" + index);

    if (!passwordElement) return;

    if (passwordElement.textContent.trim() !== "••••••••") {
        passwordElement.textContent = "••••••••";
        button.textContent = "👁️";
        button.title = "Show Password";
        return;
    }

    const recordId = button.dataset.recordId;
    const userType = button.dataset.userType;

    if (!recordId || !userType) {
        console.error("Missing record id or user type on password button.");
        return;
    }

    const tableName =
        userType === "teacher" ? "teachers" : "students";

    try {

        const { data, error } =
            await supabaseClient
                .from(tableName)
                .select("password")
                .eq("id", recordId)
                .maybeSingle();

        if (error) {
            console.error("Password Load Error:", error);
            return;
        }

        passwordElement.textContent =
            data?.password || "Not Set";

        button.textContent = "🙈";
        button.title = "Hide Password";

    } catch (error) {
        console.error("Password View Error:", error);
    }
}
// ==========================================
// TOGGLE STUDENT USER STATUS
// SUPABASE LIVE DATA
// ==========================================

async function toggleStudentStatus(studentId) {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        alert(
            "Supabase connection is missing."
        );

        return;
    }

    const {
        data: student,
        error: loadError
    } =
        await supabaseClient
            .from("students")
            .select("id, status")
            .eq("id", studentId)
            .maybeSingle();

    if (loadError) {

        console.error(
            "STUDENT STATUS LOAD ERROR:",
            loadError
        );

        alert(
            "Unable to load student status.\n\n" +
            loadError.message
        );

        return;
    }

    if (!student) {

        alert(
            "Student record not found."
        );

        return;
    }

    const currentStatus =
        student.status ||
        "Active";

    const newStatus =
        currentStatus === "Active"
            ? "Disabled"
            : "Active";

    const {
        error: updateError
    } =
        await supabaseClient
            .from("students")
            .update({
                status: newStatus
            })
            .eq("id", studentId);

    if (updateError) {

        console.error(
            "STUDENT STATUS UPDATE ERROR:",
            updateError
        );

        alert(
            "Student status could not be updated.\n\n" +
            updateError.message
        );

        return;
    }

    if (
        typeof renderUserManagementStudents ===
        "function"
    ) {

        await renderUserManagementStudents();

    }

    if (
        typeof renderAdminStudents ===
        "function"
    ) {

        await renderAdminStudents();

    }

    if (
        typeof AdminDashboard !==
        "undefined" &&
        typeof AdminDashboard.refresh ===
        "function"
    ) {

        await AdminDashboard.refresh();

    }

    alert(
        "Student account is now " +
        newStatus +
        "."
    );
}
// ==========================================
// USER MANAGEMENT INITIAL LOAD + REALTIME
// ==========================================

window.addEventListener(
    "load",
    async function () {

        if (
            typeof renderUserManagementStudents ===
            "function"
        ) {
            await renderUserManagementStudents();
        }

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            return;
        }


        // ==========================================
        // REALTIME - STUDENTS
        // ==========================================

        supabaseClient
            .channel(
                "admin-user-management-students"
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "students"
                },
                async function () {

                    await renderUserManagementStudents();

                    if (
                        typeof renderAdminStudents ===
                        "function"
                    ) {
                        await renderAdminStudents();
                    }

                    if (
                        typeof AdminDashboard !==
                        "undefined" &&
                        typeof AdminDashboard.refresh ===
                        "function"
                    ) {
                        await AdminDashboard.refresh();
                    }
                }
            )
            .subscribe();


        // ==========================================
        // REALTIME - TEACHERS
        // ==========================================

        supabaseClient
            .channel(
                "admin-user-management-teachers"
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "teachers"
                },
                async function () {

                    await renderUserManagementStudents();

                    if (
                        typeof renderAdminTeachers ===
                        "function"
                    ) {
                        await renderAdminTeachers();
                    }

                    if (
                        typeof AdminDashboard !==
                        "undefined" &&
                        typeof AdminDashboard.refresh ===
                        "function"
                    ) {
                        await AdminDashboard.refresh();
                    }
                }
            )
            .subscribe();

    }
);
// ==========================================
// AUTO GENERATE STUDENT USERNAME
// ==========================================

function generateAdminStudentUsername() {

const nameField =
document.getElementById("adminNewStudentName");

const studentIdField =
document.getElementById("adminNewStudentId");

const usernameField =
document.getElementById("adminNewStudentUsername");

if (
!nameField ||
!studentIdField ||
!usernameField
) {
return;
}

const name =
nameField.value.trim().toLowerCase();

const studentId =
studentIdField.value.trim();

if (name === "") {

usernameField.value = "";

return;
}

// Remove spaces and special characters
const cleanName =
name.replace(/[^a-z0-9]/g, "");

// Get numbers from Student ID
const idNumber =
studentId.replace(/\D/g, "");

if (idNumber) {

usernameField.value =
cleanName + idNumber;

} else {

usernameField.value =
cleanName;

}

}


// ==========================================
// UPDATE USERNAME WHEN STUDENT NAME CHANGES
// ==========================================

document.addEventListener("input", function (event) {

    if (
        event.target.id ===
        "adminNewStudentName" ||
        event.target.id ===
        "adminNewStudentId"
    ) {

        generateAdminStudentUsername();

    }

});
// ==========================================
// DATE OF BIRTH - AUTO YYYY-MM-DD FORMAT
// ==========================================

document.addEventListener("input", function (event) {

if (event.target.id !== "adminNewStudentDOB") {
return;
}

let value = event.target.value.replace(/\D/g, "");

// Maximum 8 digits
value = value.slice(0, 8);

// YYYY-MM-DD
if (value.length > 6) {

value =
value.slice(0, 4) +
"-" +
value.slice(4, 6) +
"-" +
value.slice(6);

} else if (value.length > 4) {

value =
value.slice(0, 4) +
"-" +
value.slice(4);

}

event.target.value = value;

});
// ==========================================
// USER ACTION DROPDOWN
// ==========================================

function toggleUserActionMenu(button) {

const dropdown =
button.nextElementSibling;

document
.querySelectorAll(".user-action-dropdown.show")
.forEach(function(menu) {

if (menu !== dropdown) {
menu.classList.remove("show");
}

});

dropdown.classList.toggle("show");
}


// Close dropdown when clicking outside

document.addEventListener("click", function(event) {

if (
!event.target.closest(".user-action-menu")
) {

document
.querySelectorAll(".user-action-dropdown.show")
.forEach(function(menu) {

menu.classList.remove("show");

});

}

});

// ==========================================
// CLOSE ALL ADMIN USER MODALS
// ==========================================

function closeAllAdminUserModals() {

    const modalIds = [
        "adminAddStudentModal",
        "adminTeacherModal",
        "editUserManagementModal",
        "adminEditUserModal"
    ];

    modalIds.forEach(function (id) {

        const modal =
            document.getElementById(id);

        if (modal) {
            modal.style.display = "none";
        }

    });

}
// ==========================================
// USER MANAGEMENT ACTIONS
// SUPABASE - VIEW / EDIT / DELETE
// ==========================================

document.addEventListener(
    "click",
    async function (event) {

        const actionButton =
            event.target.closest(
                ".user-view-btn, .user-edit-btn, .user-delete-btn"
            );

        if (!actionButton) {
            return;
        }


        // ==========================================
        // GET USER INFORMATION
        // ==========================================

        const action =
            actionButton.dataset.action;

        const userType =
            actionButton.dataset.userType;

        const recordId =
            actionButton.dataset.userId ||
            actionButton.dataset.studentId;


        if (!action || !recordId) {
            console.error(
                "User Management action data missing:",
                {
                    action,
                    userType,
                    recordId
                }
            );

            return;
        }


        // ==========================================
        // DETERMINE SUPABASE TABLE
        // ==========================================

        const tableName =
            userType === "teacher"
                ? "teachers"
                : "students";


        // ==========================================
        // VIEW USER
        // ==========================================

        if (action === "view") {

            try {

                const {
                    data,
                    error
                } =
                    await supabaseClient
                        .from(tableName)
                        .select("*")
                        .eq("id", recordId)
                        .maybeSingle();


                if (error) {

                    console.error(
                        "View User Error:",
                        error
                    );

                    alert(
                        "Unable to load user details."
                    );

                    return;
                }


                if (!data) {

                    alert(
                        "User record not found."
                    );

                    return;
                }


                // ==========================================
                // STUDENT VIEW
                // ==========================================

                if (userType === "student") {

                    // Keep existing Student View system
                    if (
                        typeof openAdminViewStudent ===
                        "function"
                    ) {

                        openAdminViewStudent(
                            Number(recordId)
                        );

                    } else {

                        showAdminUserDetails(
                            data,
                            "Student"
                        );

                    }

                    return;
                }


                // ==========================================
                // TEACHER VIEW
                // ==========================================

                if (userType === "teacher") {

                    showAdminUserDetails(
                        data,
                        "Teacher"
                    );

                    return;
                }

            } catch (error) {

                console.error(
                    "VIEW USER ERROR:",
                    error
                );

                alert(
                    "Unable to open user details."
                );

            }

            return;
        }


   // ==========================================
// EDIT USER
// SUPABASE LIVE DATA
// ==========================================

if (action === "edit") {

    try {

        const { data, error } =
            await supabaseClient
                .from(tableName)
                .select("*")
                .eq("id", recordId)
                .maybeSingle();

        if (error) {
            console.error(
                "Edit User Load Error:",
                error
            );

            alert(
                "Unable to load user for editing.\n\n" +
                error.message
            );

            return;
        }

        if (!data) {
            alert("User record not found.");
            return;
        }

        // -------------------------------
        // SAVE EDITING STATE
        // -------------------------------

        editingUserType = userType;
        editingUserId = recordId;

// -------------------------------
// USER TYPE
// -------------------------------

const editUserType =
    document.getElementById(
        "editUserType"
    );

if (editUserType) {

    editUserType.value =
        userType === "student"
            ? "Student"
            : "Teacher";

}
        // -------------------------------
        // NAME
        // -------------------------------

        const editName =
            document.getElementById(
                "editUserName"
            );

        if (editName) {
            editName.value =
                data.name ||
                data.fullName ||
                data.full_name ||
                "";
        }


        // -------------------------------
        // USERNAME
        // -------------------------------

        const editUsername =
            document.getElementById(
                "editUserUsername"
            );

        if (editUsername) {
            editUsername.value =
                data.username ||
                "";
        }


        // -------------------------------
        // PASSWORD
        // -------------------------------

        const editPassword =
            document.getElementById(
                "editUserNewPassword"
            );

        if (editPassword) {
            editPassword.value = "";
        }


        // -------------------------------
        // STATUS
        // -------------------------------

        const editStatus =
            document.getElementById(
                "editUserStatus"
            );

        if (editStatus) {
            editStatus.value =
                data.status ||
                "Active";
        }

// ==========================================
// LOAD STUDENT SUBJECTS FOR EDIT USER
// ==========================================

const subjectsGroup =
    document.getElementById(
        "editUserSubjectsGroup"
    );

const subjectsContainer =
    document.getElementById(
        "editUserSubjects"
    );

if (
    userType === "student" &&
    subjectsGroup &&
    subjectsContainer
) {

    subjectsGroup.style.display = "block";

    subjectsContainer.innerHTML = `
        <div style="
            padding:10px;
            text-align:center;
            color:#64748b;
        ">
            Loading subjects...
        </div>
    `;

    const {
        data: allEditSubjects,
        error: editSubjectsError
    } = await supabaseClient
        .from("subjects")
        .select("*")
        .order("id", {
            ascending: true
        });

    if (editSubjectsError) {

        console.error(
            "EDIT USER SUBJECTS ERROR:",
            editSubjectsError
        );

        subjectsContainer.innerHTML = `
            <div style="
                padding:10px;
                color:#dc2626;
            ">
                Unable to load subjects.
            </div>
        `;

    } else {

        const assignedSubjectIds =
            Array.isArray(data.subject_ids)
                ? data.subject_ids.map(Number)
                : [];

        if (
            !allEditSubjects ||
            allEditSubjects.length === 0
        ) {

            subjectsContainer.innerHTML = `
                <div style="
                    padding:10px;
                    text-align:center;
                    color:#64748b;
                ">
                    No subjects available.
                </div>
            `;

        } else {

            subjectsContainer.innerHTML =
                allEditSubjects
                    .map(function(subject) {

                        const subjectId =
                            Number(subject.id);

                        const subjectName =
                            subject.name ||
                            subject.subject_name ||
                            subject.title ||
                            "Subject";

                        const isChecked =
                            assignedSubjectIds.includes(
                                subjectId
                            );

                        return `
                            <label style="
                                display:flex;
                                align-items:center;
                                gap:10px;
                                padding:10px;
                                margin-bottom:6px;
                                background:#ffffff;
                                border:1px solid #e2e8f0;
                                border-radius:9px;
                                cursor:pointer;
                            ">

                                <input
                                    type="checkbox"
                                    value="${subjectId}"
                                    ${isChecked ? "checked" : ""}
                                    style="
                                        width:17px;
                                        height:17px;
                                        cursor:pointer;
                                    "
                                >

                                <span style="
                                    font-weight:500;
                                    color:#1e293b;
                                ">
                                    ${subjectName}
                                </span>

                            </label>
                        `;

                    })
                    .join("");
        }
    }

} else if (subjectsGroup) {

    subjectsGroup.style.display = "none";

}

        // -------------------------------
// CLOSE OTHER MODALS
// -------------------------------

closeAllAdminUserModals();

        // -------------------------------
        // OPEN EDIT MODAL
        // -------------------------------

      const editModal =
    document.getElementById(
        "editUserManagementModal"
    ) ||
    document.getElementById(
        "adminEditUserModal"
    );

if (!editModal) {

    console.error(
        "Edit User modal not found."
    );

    alert(
        "Edit User modal not found."
    );

    return;
}

// Same fix as Add Teacher
if (editModal.parentElement !== document.body) {
    document.body.appendChild(editModal);
}

        editModal.style.setProperty(
    "display",
    "flex",
    "important"
);

        editModal.style.position = "fixed";
        editModal.style.inset = "0";
        editModal.style.width = "100vw";
        editModal.style.height = "100vh";
        editModal.style.setProperty(
    "z-index",
    "99999999",
    "important"
);
        editModal.style.alignItems = "center";
        editModal.style.justifyContent = "center";


    } catch (error) {

        console.error(
            "EDIT USER ERROR:",
            error
        );

        alert(
            "Unable to edit user."
        );
    }

    return;
}

        // ==========================================
        // DELETE USER
        // SUPABASE ONLY
        // ==========================================

        if (action === "delete") {

            console.log("DELETE BUTTON CLICKED:", {
    action: action,
    userType: userType,
    recordId: recordId
});

            const confirmDelete = confirm(
                "Are you sure you want to permanently delete this " +
                userType +
                " account?"
            );

            if (!confirmDelete) {
                return;
            }

            if (typeof supabaseClient === "undefined") {
                alert("Supabase connection is missing.");
                return;
            }

            try {

          const { data, error } =
    await supabaseClient
        .from(tableName)
        .delete()
        .eq("id", recordId)
        .select();

console.log("DELETE RESULT:", { data, error, recordId, tableName });

if (!error && (!data || data.length === 0)) {
    alert("Delete ran but 0 rows deleted — RLS permission issue likely.");
    return;
}

                if (error) {

                    console.error(
                        "DELETE USER ERROR:",
                        error
                    );

                    alert(
                        "Unable to delete " +
                        userType +
                        ".\n\n" +
                        error.message
                    );

                    return;
                }


                // -------------------------------
                // REFRESH USER MANAGEMENT
                // -------------------------------

                if (
                    typeof renderUserManagementStudents ===
                    "function"
                ) {
                    await renderUserManagementStudents();
                }


                // -------------------------------
                // REFRESH ADMIN DASHBOARD
                // -------------------------------

                if (
                    typeof AdminDashboard !==
                    "undefined" &&
                    typeof AdminDashboard.refresh ===
                    "function"
                ) {
                    await AdminDashboard.refresh();
                }


                alert(
                    userType === "teacher"
                        ? "Teacher deleted successfully. ✅"
                        : "Student deleted successfully. ✅"
                );


            } catch (error) {

                console.error(
                    "DELETE USER ERROR:",
                    error
                );

                alert(
                    "Unable to delete user."
                );
            }

            return;
        }
}

);

// ==========================================
// ADMIN USER DETAILS VIEW
// STUDENT + TEACHER
// ==========================================

function showAdminUserDetails(
    user,
    userType
) {

    const existingModal =
        document.getElementById(
            "adminUniversalUserViewModal"
        );


    if (existingModal) {

        existingModal.remove();

    }


    const name =
        user.name ||
        user.fullName ||
        user.full_name ||
        "—";


    const username =
        user.username ||
        "—";


    const password =
        user.password ||
        "Not Set";


    const id =
        userType === "Teacher"
            ? (
                user.teacher_id ||
                user.teacherId ||
                user.id ||
                "—"
            )
            : (
                user.student_id ||
                user.studentId ||
                user.id ||
                "—"
            );


    const classOrSubject =
        userType === "Teacher"
            ? (
                user.subject ||
                user.subject_name ||
                "—"
            )
            : (
                user.student_class ||
                user.studentClass ||
                "—"
            );


    const status =
        user.status ||
        "Active";


    const modal =
        document.createElement("div");


    modal.id =
        "adminUniversalUserViewModal";


    modal.style.cssText = `
        position:fixed;
        inset:0;
        width:100vw;
        height:100vh;
        background:rgba(15,23,42,0.65);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999999;
        padding:20px;
        box-sizing:border-box;
    `;


    modal.innerHTML = `

        <div
            style="
                width:min(520px, 100%);
                background:white;
                border-radius:20px;
                padding:28px;
                box-shadow:0 25px 70px rgba(0,0,0,.25);
                position:relative;
                max-height:90vh;
                overflow:auto;
            "
        >

            <button
                type="button"
                id="closeAdminUniversalUserView"
                style="
                    position:absolute;
                    right:18px;
                    top:14px;
                    border:none;
                    background:#f1f5f9;
                    width:36px;
                    height:36px;
                    border-radius:50%;
                    cursor:pointer;
                    font-size:18px;
                "
            >
                ✕
            </button>


            <div
                style="
                    font-size:28px;
                    margin-bottom:8px;
                "
            >
                ${
                    userType === "Teacher"
                        ? "👨‍🏫"
                        : "🎓"
                }
            </div>


            <h2
                style="
                    margin:0 0 6px;
                    color:#0f172a;
                "
            >
                ${userType} Details
            </h2>


            <p
                style="
                    margin:0 0 22px;
                    color:#64748b;
                "
            >
                Complete account information
            </p>


            <div
                style="
                    display:grid;
                    gap:12px;
                "
            >

                <div>
                    <strong>
                        ${userType} ID
                    </strong>

                    <div>
                        ${id}
                    </div>
                </div>


                <div>
                    <strong>
                        Full Name
                    </strong>

                    <div>
                        ${name}
                    </div>
                </div>


                <div>
                    <strong>
                        ${
                            userType === "Teacher"
                                ? "Subject"
                                : "Class"
                        }
                    </strong>

                    <div>
                        ${classOrSubject}
                    </div>
                </div>


                <div>
                    <strong>
                        Username
                    </strong>

                    <div>
                        ${username}
                    </div>
                </div>


                <div>
                    <strong>
                        Password
                    </strong>

                    <div>
                        ${password}
                    </div>
                </div>


                <div>
                    <strong>
                        Status
                    </strong>

                    <div>
                        ${status}
                    </div>
                </div>

            </div>


            <button
                type="button"
                id="closeAdminUniversalUserViewBottom"
                style="
                    width:100%;
                    margin-top:24px;
                    border:none;
                    background:#2563eb;
                    color:white;
                    padding:12px;
                    border-radius:10px;
                    cursor:pointer;
                    font-weight:600;
                "
            >
                Close
            </button>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    const closeModal =
        function () {

            modal.remove();

        };


    document
        .getElementById(
            "closeAdminUniversalUserView"
        )
        ?.addEventListener(
            "click",
            closeModal
        );


    document
        .getElementById(
            "closeAdminUniversalUserViewBottom"
        )
        ?.addEventListener(
            "click",
            closeModal
        );


    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeModal();

            }

        }
    );

}
// ==========================================
// ADMIN ASSIGNMENT MODAL - OPEN / CLOSE
// ==========================================

document.addEventListener("click", function (event) {

// OPEN ASSIGNMENT MODAL
if (event.target.closest("#adminAddAssignmentBtn")) {

const modal =
document.getElementById("adminAssignmentModal");

if (!modal) {

alert("Assignment Modal HTML nahi mila.");

return;
}

modal.style.display = "flex";
modal.style.position = "fixed";
modal.style.top = "0";
modal.style.left = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.background = "rgba(0,0,0,0.65)";
modal.style.zIndex = "999999";
modal.style.alignItems = "center";
modal.style.justifyContent = "center";
modal.style.padding = "20px";
modal.style.boxSizing = "border-box";

}


// CLOSE X BUTTON
if (event.target.closest("#closeAdminAssignmentModal")) {

const modal =
document.getElementById("adminAssignmentModal");

if (modal) {
modal.style.display = "none";
}

}


// CANCEL BUTTON
if (event.target.closest("#cancelAdminAssignment")) {

const modal =
document.getElementById("adminAssignmentModal");

if (modal) {
modal.style.display = "none";
}

}

});
// ==========================================
// ADMIN SAVE / UPDATE ASSIGNMENT
// SUPABASE LIVE DATA
// ==========================================

document.addEventListener(
    "submit",
    async function (event) {

        if (
            event.target.id !==
            "adminAssignmentForm"
        ) {
            return;
        }

        event.preventDefault();


        // ==========================================
        // SUPABASE CHECK
        // ==========================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            alert(
                "Supabase connection is missing."
            );
            return;
        }


        // ==========================================
        // GET FORM VALUES
        // ==========================================

        const title =
            document.getElementById(
                "adminAssignmentTitle"
            ).value.trim();

        const subject =
            document.getElementById(
                "adminAssignmentSubject"
            ).value.trim();

        const teacher =
            document.getElementById(
                "adminAssignmentTeacher"
            ).value.trim();

        const assignmentClass =
            document.getElementById(
                "adminAssignmentClass"
            ).value.trim();

        const dueDate =
            document.getElementById(
                "adminAssignmentDueDate"
            ).value;

        const description =
            document.getElementById(
                "adminAssignmentDescription"
            ).value.trim();


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !title ||
            !subject ||
            !teacher ||
            !assignmentClass ||
            !dueDate ||
            !description
        ) {

            alert(
                "Please fill all assignment fields."
            );

            return;
        }


        // ==========================================
        // EDITING ID
        // ==========================================

        const form =
            document.getElementById(
                "adminAssignmentForm"
            );

        const editingId =
            form.dataset.editingId;


        // ==========================================
        // ASSIGNMENT RECORD
        // ==========================================

        const assignmentRecord = {

            title:
                title,

            subject:
                subject,

           teacher_name:
    teacher,

            class_name:
                assignmentClass,

            due_date:
                dueDate,

            description:
                description,

            status:
                "Pending"

        };


        let error = null;


        // ==========================================
        // UPDATE EXISTING ASSIGNMENT
        // ==========================================

        if (editingId) {

            const result =
                await supabaseClient
                    .from("assignments")
                    .update(
                        assignmentRecord
                    )
                    .eq(
                        "id",
                        editingId
                    );

            error =
                result.error;

        }


        // ==========================================
        // ADD NEW ASSIGNMENT
        // ==========================================

        else {

            const result =
                await supabaseClient
                    .from("assignments")
                    .insert([
                        assignmentRecord
                    ]);

            error =
                result.error;

        }


        // ==========================================
        // ERROR
        // ==========================================

        if (error) {

            console.error(
                "SUPABASE ASSIGNMENT SAVE ERROR:",
                error
            );

            alert(
                "Assignment could not be saved.\n\n" +
                error.message
            );

            return;
        }


        // ==========================================
        // CLEAR EDIT MODE
        // ==========================================

        delete form.dataset.editingId;


        // ==========================================
        // REFRESH
        // ==========================================

        if (
            typeof renderAdminAssignments ===
            "function"
        ) {
            await renderAdminAssignments();
        }


        if (
            typeof AdminDashboard !==
            "undefined" &&
            typeof AdminDashboard.refresh ===
            "function"
        ) {
            await AdminDashboard.refresh();
        }


        // ==========================================
        // CLEAR FORM
        // ==========================================

        form.reset();


        // ==========================================
        // CLOSE MODAL
        // ==========================================

        const modal =
            document.getElementById(
                "adminAssignmentModal"
            );

        if (modal) {
            modal.style.display =
                "none";
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        alert(
            editingId
                ? "Assignment updated successfully! ✅"
                : "Assignment saved successfully! ✅"
        );

    }
);
// ==========================================
// RENDER ADMIN ASSIGNMENTS
// SUPABASE LIVE DATA
// ==========================================

async function renderAdminAssignments() {

    const assignmentsList =
        document.getElementById(
            "adminAssignmentsList"
        );

    if (!assignmentsList) {
        return;
    }


    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.error(
            "Supabase connection is missing."
        );

        return;
    }


    // ==========================================
    // LOAD ASSIGNMENTS
    // ==========================================

    const {
        data: assignments,
        error
    } =
        await supabaseClient
            .from("assignments")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        console.error(
            "SUPABASE ASSIGNMENTS LOAD ERROR:",
            error
        );

        assignmentsList.innerHTML = `
            <div class="admin-empty-state">

                <h3>
                    ❌ Unable to Load Assignments
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

        return;
    }


    // ==========================================
    // NO ASSIGNMENTS
    // ==========================================

    if (
        !assignments ||
        assignments.length === 0
    ) {

        assignmentsList.innerHTML = `
            <div class="admin-empty-state">

                <h3>
                    📚 No Assignments Yet
                </h3>

              

            </div>
        `;

        return;
    }


    // ==========================================
    // RENDER ASSIGNMENTS
    // ==========================================

    assignmentsList.innerHTML =
        assignments.map(
            function (assignment) {

                return `
                    <div
                        class="admin-assignment-card"
                    >

                        <div
                            class="
                                admin-assignment-card-header
                            "
                        >

                            <div>

                                <h3>
                                    📚
                                    ${
                                        assignment.title ||
                                        "Untitled Assignment"
                                    }
                                </h3>

                                <p>
                                    <strong>
                                        Subject:
                                    </strong>

                                    ${
                                        assignment.subject ||
                                        "—"
                                    }
                                </p>

                            </div>


                            <span
                                class="
                                    admin-assignment-status
                                "
                            >
                                ${
                                    assignment.status ||
                                    "Pending"
                                }
                            </span>

                        </div>


                        <div
                            class="
                                admin-assignment-details
                            "
                        >

                            <p>
                                <strong>
                                    Teacher:
                                </strong>

                                ${
                                    assignment.teacher ||
                                    "—"
                                }
                            </p>


                            <p>
                                <strong>
                                    Class:
                                </strong>

                                ${
                                    assignment.class_name ||
                                    assignment.className ||
                                    "—"
                                }
                            </p>


                            <p>
                                <strong>
                                    Due Date:
                                </strong>

                                ${
                                    assignment.due_date ||
                                    assignment.dueDate ||
                                    "—"
                                }
                            </p>

                        </div>


                        <div
                            class="
                                admin-assignment-description
                            "
                        >

                            <strong>
                                Description:
                            </strong>

                            <p>
                                ${
                                    assignment.description ||
                                    "No description provided."
                                }
                            </p>

                        </div>

                    </div>
                `;

            }
        ).join("");

}
// ==========================================
// ASSIGNMENTS INITIAL LOAD + REALTIME
// SUPABASE LIVE SYNC
// ==========================================

window.addEventListener(
    "load",
    async function () {

        // ==========================================
        // INITIAL LOAD
        // ==========================================

        if (
            typeof renderAdminAssignments ===
            "function"
        ) {
            await renderAdminAssignments();
        }


        // ==========================================
        // SUPABASE CHECK
        // ==========================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            console.error(
                "Supabase connection is missing."
            );
            return;
        }


        // ==========================================
        // REALTIME LISTENER
        // ==========================================

        supabaseClient
            .channel(
                "admin-assignments-realtime"
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "assignments"
                },
                async function () {

                    console.log(
                        "Supabase Assignments changed — refreshing..."
                    );


                    // Refresh assignment list
                    if (
                        typeof renderAdminAssignments ===
                        "function"
                    ) {
                        await renderAdminAssignments();
                    }


                    // Refresh Admin Dashboard
                    if (
                        typeof AdminDashboard !==
                        "undefined" &&
                        typeof AdminDashboard.refresh ===
                        "function"
                    ) {
                        await AdminDashboard.refresh();
                    }

                }
            )
            .subscribe();

    }
);
// ==========================================
// DELETE ADMIN ASSIGNMENT
// SUPABASE LIVE DATA
// ==========================================

document.addEventListener(
    "click",
    async function (event) {

        const deleteButton =
            event.target.closest(
                ".admin-delete-assignment"
            );

        if (!deleteButton) {
            return;
        }


        // ==========================================
        // SUPABASE CHECK
        // ==========================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            alert(
                "Supabase connection is missing."
            );
            return;
        }


        const assignmentId =
            deleteButton.dataset.id;


        // ==========================================
        // LOAD ASSIGNMENT
        // ==========================================

        const {
            data: assignment,
            error: loadError
        } =
            await supabaseClient
                .from("assignments")
                .select("*")
                .eq(
                    "id",
                    assignmentId
                )
                .maybeSingle();


        if (loadError) {

            console.error(
                "ASSIGNMENT LOAD ERROR:",
                loadError
            );

            alert(
                "Assignment could not be loaded.\n\n" +
                loadError.message
            );

            return;
        }


        if (!assignment) {

            alert(
                "Assignment not found."
            );

            return;
        }


        // ==========================================
        // CONFIRM DELETE
        // ==========================================

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this assignment?\n\n" +
                (
                    assignment.title ||
                    "Assignment"
                )
            );


        if (!confirmDelete) {
            return;
        }


        // ==========================================
        // DELETE FROM SUPABASE
        // ==========================================

        const {
            error
        } =
            await supabaseClient
                .from("assignments")
                .delete()
                .eq(
                    "id",
                    assignmentId
                );


        if (error) {

            console.error(
                "SUPABASE ASSIGNMENT DELETE ERROR:",
                error
            );

            alert(
                "Assignment could not be deleted.\n\n" +
                error.message
            );

            return;
        }


        // ==========================================
        // REFRESH
        // ==========================================

        if (
            typeof renderAdminAssignments ===
            "function"
        ) {
            await renderAdminAssignments();
        }


        if (
            typeof AdminDashboard !==
            "undefined" &&
            typeof AdminDashboard.refresh ===
            "function"
        ) {
            await AdminDashboard.refresh();
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        alert(
            "Assignment deleted successfully! 🗑️"
        );

    }
);
// ==========================================
// EDIT ADMIN ASSIGNMENT
// SUPABASE LIVE DATA
// ==========================================

document.addEventListener(
    "click",
    async function (event) {

        const editButton =
            event.target.closest(
                ".admin-edit-assignment"
            );

        if (!editButton) {
            return;
        }


        // ==========================================
        // SUPABASE CHECK
        // ==========================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            alert(
                "Supabase connection is missing."
            );
            return;
        }


        const assignmentId =
            editButton.dataset.id;


        // ==========================================
        // LOAD ASSIGNMENT FROM SUPABASE
        // ==========================================

        const {
            data: assignment,
            error
        } =
            await supabaseClient
                .from("assignments")
                .select("*")
                .eq(
                    "id",
                    assignmentId
                )
                .maybeSingle();


        if (error) {

            console.error(
                "ASSIGNMENT EDIT LOAD ERROR:",
                error
            );

            alert(
                "Assignment could not be loaded.\n\n" +
                error.message
            );

            return;
        }


        if (!assignment) {

            alert(
                "Assignment not found."
            );

            return;
        }


        // ==========================================
        // FILL EXISTING FORM
        // ==========================================

        document.getElementById(
            "adminAssignmentTitle"
        ).value =
            assignment.title || "";


        document.getElementById(
            "adminAssignmentSubject"
        ).value =
            assignment.subject || "";


        document.getElementById(
            "adminAssignmentTeacher"
        ).value =
            assignment.teacher || "";


        document.getElementById(
            "adminAssignmentClass"
        ).value =
            assignment.class_name ||
            assignment.className ||
            "";


        document.getElementById(
            "adminAssignmentDueDate"
        ).value =
            assignment.due_date ||
            assignment.dueDate ||
            "";


        document.getElementById(
            "adminAssignmentDescription"
        ).value =
            assignment.description || "";


        // ==========================================
        // STORE EDITING ID
        // ==========================================

        document
            .getElementById(
                "adminAssignmentForm"
            )
            .dataset.editingId =
                assignment.id;


        // ==========================================
        // CHANGE HEADING
        // ==========================================

        const heading =
            document.querySelector(
                "#adminAssignmentModal .admin-assignment-modal-header h2"
            );

        if (heading) {

            heading.textContent =
                "✏️ Edit Assignment";

        }


        // ==========================================
        // CHANGE SAVE BUTTON
        // ==========================================

        const saveButton =
            document.getElementById(
                "saveAdminAssignment"
            );

        if (saveButton) {

            saveButton.textContent =
                "💾 Update Assignment";

        }


        // ==========================================
        // OPEN MODAL
        // ==========================================

        const modal =
            document.getElementById(
                "adminAssignmentModal"
            );

        if (modal) {

            modal.style.display =
                "flex";

        }

    }
);
// ==========================================
// ADMIN TEACHERS NAVIGATION
// ==========================================

document.addEventListener("click", function (event) {

const teachersMenu =
event.target.closest("#adminTeachersMenu");

if (!teachersMenu) {
return;
}

// Hide all Admin sections
const adminSections = [
"adminHomeSection",
"adminStudentsSection",
"adminTeachersSection",
"adminAttendanceSection",
"adminResultsSection",
"adminFeesSection",
"adminAssignmentsSection",
"adminNoticesSection",
"adminUsersStudentsSection",
"adminSettingsSection"
];

adminSections.forEach(function (sectionId) {

const section =
document.getElementById(sectionId);

if (section) {
section.style.display = "none";
}

});

// Show Teachers
const teachersSection =
document.getElementById("adminTeachersSection");

if (teachersSection) {
teachersSection.style.display = "block";
}

});

// ==========================================
// ADMIN SAVE TEACHER
// SUPABASE LIVE ACCOUNT SYSTEM
// ==========================================

document.addEventListener(
    "submit",
    async function (event) {

        if (
            event.target.id !==
            "adminTeacherForm"
        ) {
            return;
        }

        event.preventDefault();


        // ==========================================
        // SUPABASE CHECK
        // ==========================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            alert(
                "Supabase connection is missing."
            );
            return;
        }


        // ==========================================
        // GET FORM VALUES
        // ==========================================

        const name =
            document
                .getElementById(
                    "adminTeacherName"
                )
                .value
                .trim();

        const email =
            document
                .getElementById(
                    "adminTeacherEmail"
                )
                .value
                .trim();

        const phone =
            document
                .getElementById(
                    "adminTeacherPhone"
                )
                .value
                .trim();

        const subject =
            document
                .getElementById(
                    "adminTeacherSubject"
                )
                .value
                .trim();

        const teacherClass =
            document
                .getElementById(
                    "adminTeacherClass"
                )
                .value
                .trim();

        const qualification =
            document
                .getElementById(
                    "adminTeacherQualification"
                )
                .value
                .trim();

        const joiningDate =
            document
                .getElementById(
                    "adminTeacherJoiningDate"
                )
                .value;

        const username =
            document
                .getElementById(
                    "adminTeacherUsername"
                )
                .value
                .trim();

        const password =
            document
                .getElementById(
                    "adminTeacherPassword"
                )
                .value
                .trim();


        // ==========================================
        // VALIDATION
        // ==========================================

        if (
            !name ||
            !email ||
            !phone ||
            !subject ||
            !teacherClass ||
            !qualification ||
            !joiningDate ||
            !username ||
            !password
        ) {

            alert(
                "Please fill all teacher fields. ⚠️"
            );

            return;
        }


        // ==========================================
        // PHONE VALIDATION
        // ==========================================

        if (
            typeof isValidPakistaniPhone ===
            "function"
        ) {

            if (
                !isValidPakistaniPhone(
                    phone
                )
            ) {

                alert(
                    "Please enter a valid Pakistani mobile number.\nExample: 03001234567"
                );

                return;
            }
        }


        // ==========================================
        // PASSWORD VALIDATION
        // ==========================================

        if (
            !/^[0-9]{6,8}$/.test(
                password
            )
        ) {

            alert(
                "Password must contain 6 to 8 digits only."
            );

            document
                .getElementById(
                    "adminTeacherPassword"
                )
                .focus();

            return;
        }


        // ==========================================
        // CHECK DUPLICATE USERNAME
        // ==========================================

        const {
            data: existingUsername,
            error: usernameError
        } =
            await supabaseClient
                .from("teachers")
                .select("id")
                .eq(
                    "username",
                    username
                )
                .maybeSingle();


        if (usernameError) {

            console.error(
                "TEACHER USERNAME CHECK ERROR:",
                usernameError
            );

            alert(
                "Unable to verify teacher username.\n\n" +
                usernameError.message
            );

            return;
        }


        if (existingUsername) {

            alert(
                "This Teacher Username already exists. ⚠️"
            );

            return;
        }


        // ==========================================
        // GET TEACHER IDs FROM SUPABASE
        // ==========================================

        const {
            data: teachers,
            error: teachersError
        } =
            await supabaseClient
                .from("teachers")
                .select("teacher_id");


        if (teachersError) {

            console.error(
                "TEACHER ID LOAD ERROR:",
                teachersError
            );

            alert(
                "Unable to generate Teacher ID.\n\n" +
                teachersError.message
            );

            return;
        }


        // ==========================================
        // GENERATE NEXT TEACHER ID
        // ==========================================

        let highestNumber =
            0;

        (
            teachers || []
        ).forEach(
            function (teacher) {

                const currentId =
                    teacher.teacher_id ||
                    "";

                const match =
                    String(
                        currentId
                    ).match(
                        /TCH-(\d+)/
                    );

                if (match) {

                    const number =
                        parseInt(
                            match[1],
                            10
                        );

                    if (
                        number >
                        highestNumber
                    ) {

                        highestNumber =
                            number;
                    }
                }
            }
        );


        const teacherId =
            "TCH-" +
            String(
                highestNumber + 1
            ).padStart(
                4,
                "0"
            );


        // ==========================================
        // CREATE TEACHER RECORD
        // ==========================================

        const teacherRecord = {

            teacher_id:
                teacherId,

            name:
                name,

            email:
                email,

            phone:
                phone,

            subject:
                subject,

            teacher_class:
                teacherClass,

            qualification:
                qualification,

            joining_date:
                joiningDate,

            username:
                username,

            password:
                password,

            status:
                "Active"
        };


        // ==========================================
        // SAVE DIRECTLY TO SUPABASE
        // ==========================================

        const {
            data: savedTeacher,
            error
        } =
            await supabaseClient
                .from("teachers")
                .insert([
                    teacherRecord
                ])
                .select()
                .single();


        if (error) {

            console.error(
                "ADD TEACHER SUPABASE ERROR:",
                error
            );

            alert(
                "Teacher could not be saved.\n\n" +
                error.message
            );

            return;
        }


        // ==========================================
        // REFRESH TEACHER LIST
        // ==========================================

        if (
            typeof renderAdminTeachers ===
            "function"
        ) {

            await renderAdminTeachers();
        }


        // ==========================================
        // REFRESH USER MANAGEMENT
        // ==========================================

        if (
            typeof renderUserManagementStudents ===
            "function"
        ) {

            await renderUserManagementStudents();
        }


        // ==========================================
        // REFRESH ADMIN DASHBOARD
        // ==========================================

        if (
            typeof AdminDashboard !==
            "undefined" &&
            typeof AdminDashboard.refresh ===
            "function"
        ) {

            await AdminDashboard.refresh();
        }


        // ==========================================
        // CLOSE MODAL
        // ==========================================

        const modal =
            document.getElementById(
                "adminTeacherModal"
            );

        if (modal) {

            modal.style.display =
                "none";
        }


        // ==========================================
        // RESET FORM
        // ==========================================

        event.target.reset();


        // ==========================================
        // SUCCESS
        // ==========================================

        alert(
            "Teacher account created successfully! ✅\n\n" +
            "Teacher ID: " +
            (
                savedTeacher.teacher_id ||
                teacherId
            )
        );
    }
);
// ==========================================
// RENDER ADMIN TEACHERS
// SUPABASE LIVE DATA ONLY
// ==========================================

async function renderAdminTeachers() {

    const teachersList =
        document.getElementById(
            "adminTeachersList"
        );

    if (!teachersList) {
        return;
    }

    teachersList.innerHTML = `
        <div class="admin-empty-state">
            <h3>⏳ Loading Teachers...</h3>
        </div>
    `;

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        return;
    }

    const {
        data: teachers,
        error
    } =
        await supabaseClient
            .from("teachers")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "ADMIN TEACHERS LOAD ERROR:",
            error
        );

        teachersList.innerHTML = `
            <div class="admin-empty-state">
                <h3>❌ Unable to Load Teachers</h3>
                <p>${error.message}</p>
            </div>
        `;

        return;
    }

    if (
        !Array.isArray(teachers) ||
        teachers.length === 0
    ) {

        teachersList.innerHTML = `
            <div class="admin-empty-state">
                <h3>👨‍🏫 No Teachers Yet</h3>
                <p>No teacher records found.</p>
            </div>
        `;

        return;
    }

    teachersList.innerHTML = "";

    teachers.forEach(
        function (teacher) {

            const teacherCard =
                document.createElement(
                    "div"
                );

            teacherCard.className =
                "admin-teacher-card";

            teacherCard.innerHTML = `

                <div class="admin-teacher-info">

                    <div class="admin-teacher-avatar">
                        👨‍🏫
                    </div>

                    <div>

                        <h3>
                            ${teacher.name || "—"}
                        </h3>

                        <p>
                            <strong>Teacher ID:</strong>
                            ${teacher.teacher_id || "—"}
                        </p>

                        <p>
                            <strong>Subject:</strong>
                            ${teacher.subject || "—"}
                        </p>

                        <p>
                            <strong>Class:</strong>
                            ${teacher.teacher_class || "—"}
                        </p>

                        <p>
                            <strong>Email:</strong>
                            ${teacher.email || "—"}
                        </p>

                        <p>
                            <strong>Phone:</strong>
                            ${teacher.phone || "—"}
                        </p>

                        <p>
                            <strong>Qualification:</strong>
                            ${teacher.qualification || "—"}
                        </p>

                        <p>
                            <strong>Joining Date:</strong>
                            ${teacher.joining_date || "—"}
                        </p>

                    </div>

                </div>

                <div class="admin-teacher-status">
                    ${teacher.status || "Active"}
                </div>
            `;

            teachersList.appendChild(
                teacherCard
            );

        }
    );
}
// ==========================================
// TEACHERS INITIAL LOAD + REALTIME
// SUPABASE LIVE SYNC
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const teachersMenu =
            event.target.closest(
                "#adminTeachersMenu"
            );


        if (!teachersMenu) {
            return;
        }


        setTimeout(
            async function () {

                if (
                    typeof renderAdminTeachers ===
                    "function"
                ) {

                    await renderAdminTeachers();

                }

            },
            100
        );

    }
);


// ==========================================
// TEACHERS REALTIME LISTENER
// ==========================================

if (
    typeof supabaseClient !==
    "undefined"
) {

    supabaseClient
        .channel(
            "admin-teachers-module-realtime"
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "teachers"
            },
            async function () {

                console.log(
                    "Supabase Teachers changed — refreshing..."
                );


                // Refresh Teacher Module
                if (
                    typeof renderAdminTeachers ===
                    "function"
                ) {

                    await renderAdminTeachers();

                }


                // Refresh User Management
                if (
                    typeof renderUserManagementStudents ===
                    "function"
                ) {

                    await renderUserManagementStudents();

                }


                // Refresh Dashboard
                if (
                    typeof AdminDashboard !==
                    "undefined" &&
                    typeof AdminDashboard.refresh ===
                    "function"
                ) {

                    await AdminDashboard.refresh();

                }

            }
        )
        .subscribe();

}
// ==========================================
// PAKISTANI PHONE NUMBER VALIDATION
// Reusable for all EduPortal phone fields
// ==========================================

function isValidPakistaniPhone(phone) {

const cleanedPhone = phone.replace(/\s+/g, "");

return /^03\d{9}$/.test(cleanedPhone);
}
// ==========================================
// TEACHER PHONE VALIDATION
// ==========================================

const teacherPhoneInput =
document.getElementById("adminTeacherPhone");

if (teacherPhoneInput) {

teacherPhoneInput.addEventListener("input", function () {

// Numbers only
this.value = this.value.replace(/\D/g, "");

// Maximum 11 digits
if (this.value.length > 11) {
this.value = this.value.substring(0, 11);
}

// Reset classes
this.classList.remove(
"phone-valid",
"phone-invalid"
);

// Check after 11 digits
if (this.value.length === 11) {

if (isValidPakistaniPhone(this.value)) {

this.classList.add("phone-valid");

} else {

this.classList.add("phone-invalid");

}

}

});

}
// ==========================================
// TEACHER JOINING DATE
// Easy Calendar Behavior
// ==========================================

const teacherJoiningDate =
document.getElementById("adminTeacherJoiningDate");

if (teacherJoiningDate) {

// Prevent future joining dates
teacherJoiningDate.max =
new Date().toISOString().split("T")[0];


// Open calendar when clicking anywhere on the field
teacherJoiningDate.addEventListener("click", function () {

if (typeof this.showPicker === "function") {
this.showPicker();
}

});

}
// ==========================================
// TEACHER FORM - PROFESSIONAL VALIDATION
// ==========================================

const teacherForm =
document.getElementById("adminTeacherForm");

if (teacherForm) {

const teacherName =
document.getElementById("adminTeacherName");

const teacherEmail =
document.getElementById("adminTeacherEmail");

const teacherPhone =
document.getElementById("adminTeacherPhone");

const teacherSubject =
document.getElementById("adminTeacherSubject");

const teacherClass =
document.getElementById("adminTeacherClass");

const teacherQualification =
document.getElementById("adminTeacherQualification");

const teacherJoiningDate =
document.getElementById("adminTeacherJoiningDate");


// ------------------------------------------
// NAME - Letters and spaces only
// ------------------------------------------

if (teacherName) {

teacherName.addEventListener("input", function () {

this.value = this.value.replace(
/[^a-zA-Z\s.'-]/g,
""
);

});

}


// ------------------------------------------
// SUBJECT
// ------------------------------------------

if (teacherSubject) {

teacherSubject.addEventListener("input", function () {

this.value = this.value.replace(
/[^a-zA-Z0-9\s&.'-]/g,
""
);

});

}


// ------------------------------------------
// QUALIFICATION
// ------------------------------------------

if (teacherQualification) {

teacherQualification.addEventListener("input", function () {

this.value = this.value.replace(
/[^a-zA-Z0-9\s.&+'-]/g,
""
);

});

}


// ------------------------------------------
// CLASS
// ------------------------------------------

if (teacherClass) {

teacherClass.addEventListener("input", function () {

this.value = this.value.replace(
/[^a-zA-Z0-9\s-]/g,
""
);

});

}


// ------------------------------------------
// SUBMIT VALIDATION
// ------------------------------------------

teacherForm.addEventListener("submit", function (event) {

const name =
teacherName.value.trim();

const email =
teacherEmail.value.trim();

const phone =
teacherPhone.value.trim();

const subject =
teacherSubject.value.trim();

const teacherClassValue =
teacherClass.value.trim();

const qualification =
teacherQualification.value.trim();

const joiningDate =
teacherJoiningDate.value;


// Name
if (name.length < 3) {

event.preventDefault();

alert(
"Please enter a valid teacher name. ⚠️"
);

teacherName.focus();

return;
}


// Email
if (!teacherEmail.checkValidity()) {

event.preventDefault();

alert(
"Please enter a valid email address. ⚠️"
);

teacherEmail.focus();

return;
}


// Phone
if (!isValidPakistaniPhone(phone)) {

event.preventDefault();

alert(
"Please enter a valid 11-digit Pakistani mobile number. ⚠️"
);

teacherPhone.focus();

return;
}


// Subject
if (subject.length < 2) {

event.preventDefault();

alert(
"Please enter the teacher's subject. ⚠️"
);

teacherSubject.focus();

return;
}


// Class
if (teacherClassValue.length < 1) {

event.preventDefault();

alert(
"Please enter the class. ⚠️"
);

teacherClass.focus();

return;
}


// Qualification
if (qualification.length < 2) {

event.preventDefault();

alert(
"Please enter the teacher's qualification. ⚠️"
);

teacherQualification.focus();

return;
}


// Joining Date
if (!joiningDate) {

event.preventDefault();

alert(
"Please select the joining date. ⚠️"
);

teacherJoiningDate.focus();

return;
}


// Future date protection
const selectedDate =
new Date(joiningDate + "T00:00:00");

const today =
new Date();

today.setHours(0, 0, 0, 0);


if (selectedDate > today) {

event.preventDefault();

alert(
"Joining date cannot be in the future. ⚠️"
);

teacherJoiningDate.focus();

return;
}

});

}
// ==========================================
// EDU PORTAL - ATTENDANCE DATA ENGINE
// ==========================================

function getTodayDate() {

const today = new Date();

const year = today.getFullYear();

const month =
String(today.getMonth() + 1).padStart(2, "0");

const day =
String(today.getDate()).padStart(2, "0");

return `${year}-${month}-${day}`;

}

// ==========================================
// ATTENDANCE AUTO DAY CHANGE
// ==========================================

let eduPortalAttendanceLastAutoDate = null;

function syncAttendanceDateWithToday() {

    const dateFilter =
        document.getElementById(
            "attendanceDateFilter"
        );

    if (!dateFilter) {
        return false;
    }

    const today =
        getTodayDate();

    const currentDate =
        dateFilter.value;

    // First time
    if (!eduPortalAttendanceLastAutoDate) {

        eduPortalAttendanceLastAutoDate =
            currentDate || today;

        return false;
    }

    // New day detected
    if (
        today !==
        eduPortalAttendanceLastAutoDate
    ) {

        // Only change automatically if
        // user was viewing the previous
        // automatic/current date.
        if (
            currentDate ===
            eduPortalAttendanceLastAutoDate
        ) {

            dateFilter.value =
                today;

            eduPortalAttendanceLastAutoDate =
                today;

            return true;
        }

        return false;
    }

    return false;
}

// ==========================================
// MARK ATTENDANCE BUTTON
// ==========================================

const adminMarkAttendanceBtn =
document.getElementById(
"adminMarkAttendanceBtn"
);


if (adminMarkAttendanceBtn) {

adminMarkAttendanceBtn.addEventListener(
"click",
function () {

const students =
getAdminStudentsForAttendance();


if (!students.length) {

alert(
"No students found. Please add students first."
);

return;

}


openAttendanceMarkingModal(students);

}
);

}


// ==========================================
// OPEN ATTENDANCE MODAL
// ==========================================

function openAttendanceMarkingModal(students) {

const existingModal =
document.getElementById(
"attendanceMarkingModal"
);


if (existingModal) {

existingModal.remove();

}


const today =
getTodayDate();


const modal =
document.createElement("div");

modal.id =
"attendanceMarkingModal";


modal.className =
"attendance-marking-overlay";


modal.innerHTML = `

<div class="attendance-marking-modal">

<div class="attendance-marking-header">

<div>

<h2>
📅 Mark Attendance
</h2>

<p>
Select Present or Absent for each student.
</p>

</div>

<button
type="button"
class="attendance-modal-close"
id="closeAttendanceModal">

×

</button>

</div>


<div class="attendance-marking-toolbar">

<div>

<label>
Attendance Date
</label>

<input
type="date"
id="attendanceMarkDate"
value="${today}">

</div>


<div class="attendance-bulk-actions">

<button
type="button"
id="markAllPresent">

✓ Present All

</button>

<button
type="button"
id="markAllAbsent">

× Absent All

</button>

</div>

</div>


<div
class="attendance-marking-list"
id="attendanceMarkingList">

${students.map(function(student, index) {

const studentId =
student.id ?? index + 1;

const studentName =
student.name ||
student.studentName ||
"Unnamed Student";

return `

<div
class="attendance-student-row"
data-student-id="${studentId}">

<div class="attendance-student-info">

    <div class="attendance-student-avatar">

        ${studentName
            .charAt(0)
            .toUpperCase()}

    </div>

    <div>

        <strong>
            ${studentName}
        </strong>

        <small>
            ID: ${studentId}
        </small>

    </div>

</div>


<div class="attendance-status-buttons">

    <button
        type="button"
        class="attendance-status-btn present"
        data-status="Present">

        ✓ Present

    </button>

    <button
        type="button"
        class="attendance-status-btn absent"
        data-status="Absent">

        × Absent

    </button>

</div>

</div>

`;

}).join("")}

</div>


<div class="attendance-marking-footer">

<button
type="button"
id="cancelAttendanceModal"
class="attendance-cancel-btn">

Cancel

</button>


<button
type="button"
id="saveMarkedAttendance"
class="attendance-save-btn">

💾 Save Attendance

</button>

</div>

</div>

`;


document.body.appendChild(modal);


setupAttendanceModal(modal);

}


// ==========================================
// ATTENDANCE MODAL EVENTS
// ==========================================

function setupAttendanceModal(modal) {

const closeBtn =
modal.querySelector(
"#closeAttendanceModal"
);


const cancelBtn =
modal.querySelector(
"#cancelAttendanceModal"
);


const saveBtn =
modal.querySelector(
"#saveMarkedAttendance"
);


const presentAllBtn =
modal.querySelector(
"#markAllPresent"
);


const absentAllBtn =
modal.querySelector(
"#markAllAbsent"
);


const statusButtons =
modal.querySelectorAll(
".attendance-status-btn"
);


function closeModal() {

modal.remove();

}


closeBtn.addEventListener(
"click",
closeModal
);


cancelBtn.addEventListener(
"click",
closeModal
);


// ------------------------------------------
// Individual status
// ------------------------------------------

statusButtons.forEach(function(button) {

button.addEventListener(
"click",
function() {

const row =
this.closest(
".attendance-student-row"
);


row
.querySelectorAll(
".attendance-status-btn"
)
.forEach(function(btn) {

btn.classList.remove(
"selected"
);

});


this.classList.add(
"selected"
);

}
);

});


// ------------------------------------------
// Present All
// ------------------------------------------

presentAllBtn.addEventListener(
"click",
function() {

modal
.querySelectorAll(
".attendance-student-row"
)
.forEach(function(row) {

row
.querySelector(
'[data-status="Present"]'
)
.classList.add(
"selected"
);


row
.querySelector(
'[data-status="Absent"]'
)
.classList.remove(
"selected"
);

});

}
);


// ------------------------------------------
// Absent All
// ------------------------------------------

absentAllBtn.addEventListener(
"click",
function() {

modal
.querySelectorAll(
".attendance-student-row"
)
.forEach(function(row) {

row
.querySelector(
'[data-status="Absent"]'
)
.classList.add(
"selected"
);


row
.querySelector(
'[data-status="Present"]'
)
.classList.remove(
"selected"
);

});

}
);


// ==========================================
// SAVE ATTENDANCE
// SUPABASE LIVE DATA
// ==========================================

saveBtn.addEventListener(
    "click",
    async function() {

        const date =
            modal.querySelector(
                "#attendanceMarkDate"
            ).value;


        // ==========================================
        // DATE VALIDATION
        // ==========================================

        if (!date) {

            alert(
                "Please select an attendance date."
            );

            return;
        }


        // ==========================================
        // SUPABASE CHECK
        // ==========================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            alert(
                "Supabase connection is missing."
            );

            return;
        }


        const rows =
            modal.querySelectorAll(
                ".attendance-student-row"
            );


        if (!rows.length) {

            alert(
                "No students found."
            );

            return;
        }


        // ==========================================
        // PREPARE RECORDS
        // ==========================================

        const attendanceRecords = [];


        rows.forEach(
            function(row) {

                const selected =
                    row.querySelector(
                        ".attendance-status-btn.selected"
                    );


                if (!selected) {
                    return;
                }


                const studentId =
                    row.dataset.studentId;


                const status =
                    selected.dataset.status;


                if (!studentId) {
                    return;
                }


                const record = {

                    student_id:
                        Number(studentId),

                    attendance_date:
                        date,

                    status:
                        status,

                    check_in_time:
                        status === "Present"
                            ? new Date().toISOString()
                            : null,

                    check_out_time:
                        null
                };


                attendanceRecords.push(
                    record
                );
            }
        );


        // ==========================================
        // NOTHING SELECTED
        // ==========================================

        if (
            attendanceRecords.length ===
            0
        ) {

            alert(
                "Please mark attendance for at least one student."
            );

            return;
        }


        // ==========================================
        // SAVE / UPDATE SUPABASE
        // ==========================================

        const {
            data,
            error
        } =
            await supabaseClient
                .from("attendance")
                .upsert(
                    attendanceRecords,
                    {
                        onConflict:
                            "student_id,attendance_date"
                    }
                )
                .select();


        // ==========================================
        // DATABASE ERROR
        // ==========================================

        if (error) {

            console.error(
                "ADMIN ATTENDANCE SAVE ERROR:",
                error
            );

            alert(
                "Attendance could not be saved.\n\n" +
                error.message
            );

            return;
        }


        // ==========================================
        // CLOSE MODAL
        // ==========================================

        closeModal();


        // ==========================================
        // REFRESH ATTENDANCE TABLE
        // ==========================================

        if (
            typeof renderAttendanceTable ===
            "function"
        ) {

            await renderAttendanceTable();
        }


        // ==========================================
        // REFRESH ATTENDANCE STATISTICS
        // ==========================================

        if (
            typeof updateAttendanceStatistics ===
            "function"
        ) {

            await updateAttendanceStatistics();
        }


        // ==========================================
        // REFRESH ADMIN DASHBOARD
        // ==========================================

        if (
            typeof AdminDashboard !==
            "undefined" &&
            typeof AdminDashboard.refresh ===
            "function"
        ) {

            await AdminDashboard.refresh();
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        alert(
            "Attendance saved successfully! ✅"
        );
    }
);

}
// ==========================================
// INITIAL ATTENDANCE LOAD
// ==========================================

function initializeAttendanceModule() {

const dateFilter =
document.getElementById("attendanceDateFilter");

const classFilter =
document.getElementById("attendanceClassFilter");

const sectionFilter =
document.getElementById("attendanceSectionFilter");

const applyButton =
document.getElementById("applyAttendanceFilters");

// ==========================================
// LIVE ATTENDANCE SEARCH
// ==========================================

const attendanceSearch =
document.getElementById(
"adminAttendanceSearch"
);

if (attendanceSearch) {

attendanceSearch.addEventListener(
"input",
function () {

renderAttendanceTable();

}
);

}


// ==========================================
// DEFAULT DATE = TODAY
// ==========================================

if (dateFilter) {

    dateFilter.value =
        getTodayDate();

    eduPortalAttendanceLastAutoDate =
        getTodayDate();
}


// ==========================================
// APPLY FILTERS BUTTON
// ==========================================

if (applyButton) {

applyButton.onclick = function () {

renderAttendanceTable();

updateAttendanceStatistics();

};

}
// ==========================================
// INITIAL TABLE LOAD
// ==========================================

renderAttendanceTable();

updateAttendanceStatistics();


// ==========================================
// AUTOMATIC NEW DAY CHECK
// ==========================================

setInterval(
    function () {

        if (
            document.visibilityState !==
            "visible"
        ) {
            return;
        }

        const dateChanged =
            syncAttendanceDateWithToday();

        if (dateChanged) {

            renderAttendanceTable();

            updateAttendanceStatistics();

        }

    },
    30000
);


// ==========================================
// CHECK WHEN USER RETURNS TO TAB
// ==========================================

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState !==
            "visible"
        ) {
            return;
        }

        const dateChanged =
            syncAttendanceDateWithToday();

        if (dateChanged) {

            renderAttendanceTable();

            updateAttendanceStatistics();

        }

    }
);

}

// =========================================================
// ADMIN ATTENDANCE REALTIME
// AUTOMATIC ABSENT + LIVE ATTENDANCE SYNC
// =========================================================

let adminAttendanceRealtimeChannel = null;

function initializeAdminAttendanceRealtime() {

    if (
        typeof supabaseClient === "undefined" ||
        adminAttendanceRealtimeChannel
    ) {
        return;
    }

    adminAttendanceRealtimeChannel =
        supabaseClient
            .channel(
                "admin-attendance-realtime"
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "attendance"
                },
                async function(payload) {

                    console.log(
                        "ADMIN ATTENDANCE REALTIME UPDATE:",
                        payload
                    );

                    // Refresh Attendance Table
                    if (
                        typeof renderAttendanceTable ===
                        "function"
                    ) {
                        await renderAttendanceTable();
                    }

                    // Refresh Attendance Statistics
                    if (
                        typeof updateAttendanceStatistics ===
                        "function"
                    ) {
                        await updateAttendanceStatistics();
                    }

                    // Refresh Admin Dashboard
                    if (
                        typeof AdminDashboard !==
                        "undefined" &&
                        typeof AdminDashboard.loadData ===
                        "function"
                    ) {
                        await AdminDashboard.loadData();
                    }

                }
            )
            .subscribe(
                function(status) {

                    console.log(
                        "ADMIN ATTENDANCE REALTIME:",
                        status
                    );

                }
            );

}


// =========================================================
// START ADMIN ATTENDANCE REALTIME
// =========================================================

initializeAdminAttendanceRealtime();

// =========================================================
// AUTO ABSENT AFTER 12:00 PM
// =========================================================

async function autoMarkAbsentAfterNoon() {

    try {

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            return;
        }

        // -----------------------------------------
        // CURRENT PAKISTAN TIME
        // -----------------------------------------

        const pakistanTime =
            new Date().toLocaleString(
                "en-US",
                {
                    timeZone: "Asia/Karachi"
                }
            );

        const now =
            new Date(pakistanTime);

        const currentHour =
            now.getHours();

        const currentMinute =
            now.getMinutes();

        // -----------------------------------------
        // BEFORE 12:00 PM
        // -----------------------------------------

        if (
            currentHour < 12
        ) {
            return;
        }

        // -----------------------------------------
        // TODAY DATE
        // -----------------------------------------

        const today =
            getStudentAttendanceDate();

        // -----------------------------------------
        // GET ALL REGISTERED STUDENTS
        // -----------------------------------------

        const {
            data: students,
            error: studentsError
        } =
            await supabaseClient
                .from("students")
                .select("id");

        if (studentsError) {

            console.error(
                "AUTO ABSENT - STUDENTS ERROR:",
                studentsError
            );

            return;
        }

        if (
            !students ||
            students.length === 0
        ) {
            return;
        }

        // -----------------------------------------
        // GET TODAY'S ATTENDANCE
        // -----------------------------------------

        const {
            data: todayAttendance,
            error: attendanceError
        } =
            await supabaseClient
                .from("attendance")
                .select(
                    "student_id, status"
                )
                .eq(
                    "attendance_date",
                    today
                );

        if (attendanceError) {

            console.error(
                "AUTO ABSENT - ATTENDANCE ERROR:",
                attendanceError
            );

            return;
        }

        // -----------------------------------------
        // FIND STUDENTS WITHOUT ATTENDANCE
        // -----------------------------------------

        const markedStudentIds =
            new Set(
                (todayAttendance || [])
                    .map(
                        record =>
                            String(
                                record.student_id
                            )
                    )
            );

        const absentRecords =
            students
                .filter(
                    student =>
                        !markedStudentIds.has(
                            String(student.id)
                        )
                )
                .map(
                    student => ({

                        student_id:
                            student.id,

                        attendance_date:
                            today,

                        status:
                            "Absent",

                        check_in_time:
                            null,

                        check_out_time:
                            null

                    })
                );

        // -----------------------------------------
        // SAVE ABSENT RECORDS
        // -----------------------------------------

        if (
            absentRecords.length > 0
        ) {

            const {
                error: insertError
            } =
                await supabaseClient
                    .from("attendance")
                    .upsert(
                        absentRecords,
                        {
                            onConflict:
                                "student_id,attendance_date",
                            ignoreDuplicates:
                                true
                        }
                    );

            if (insertError) {

                console.error(
                    "AUTO ABSENT INSERT ERROR:",
                    insertError
                );

                return;
            }

            console.log(
                "Auto Absent completed:",
                absentRecords.length,
                "students"
            );
        }

    } catch (error) {

        console.error(
            "AUTO ABSENT ERROR:",
            error
        );

    }
}
// ==========================================
// ATTENDANCE TABLE RENDER
// SUPABASE STUDENTS - FINAL SYNC
// ==========================================

async function renderAttendanceTable() {

    // Make sure attendance uses
    // the correct current date.
    syncAttendanceDateWithToday();

    const tableBody =
        document.getElementById(
            "attendanceTableBody"
        );

    await autoMarkAbsentAfterNoon();

    if (!tableBody) {
        return;
    }

    // ==========================================
    // LOADING
    // ==========================================

    tableBody.innerHTML = `
        <tr>
            <td colspan="7"
                style="text-align:center;padding:35px;">
                Loading attendance...
            </td>
        </tr>
    `;


    // ==========================================
    // GET STUDENTS FROM SUPABASE
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection missing."
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;padding:35px;">
                    Supabase connection missing.
                </td>
            </tr>
        `;

        return;
    }


    const {
        data: studentsData,
        error: studentsError
    } =
        await supabaseClient
            .from("students")
            .select("*")
            .order("created_at", {
                ascending: false
            });


    // ==========================================
    // SUPABASE ERROR
    // ==========================================

    if (studentsError) {

        console.error(
            "ATTENDANCE STUDENTS LOAD ERROR:",
            studentsError
        );

        tableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;padding:35px;">
                    Unable to load students.
                </td>
            </tr>
        `;

        return;
    }


    // ==========================================
    // CONVERT SUPABASE DATA
    // TO EXISTING ATTENDANCE FORMAT
    // ==========================================

    const students =
        (studentsData || []).map(
            function(student) {

                return {

                    id:
                        student.id,

                    studentId:
                        student.student_id,

                    fullName:
                        student.name,

                    name:
                        student.name,

                    fatherName:
                        student.father_name,

                    studentClass:
                        student.student_class,

                    section:
                        student.section,

                    rollNumber:
                        student.roll_number,

                    dob:
                        student.date_of_birth || "",

                    username:
                        student.username,

                    password:
                        student.password,

                    mobile:
                        student.mobile || "",

                    status:
                        student.status || "Active",

                    createdAt:
                        student.created_at

                };

            }
        );

// ==========================================
// GET CURRENT SELECTED ATTENDANCE DATE
// BEFORE SUPABASE QUERY
// ==========================================

const attendanceDateFilter =
    document.getElementById(
        "attendanceDateFilter"
    );

const selectedDate =
    attendanceDateFilter &&
    attendanceDateFilter.value
        ? attendanceDateFilter.value
        : getTodayDate();
   // ==========================================
// GET ATTENDANCE FROM SUPABASE
// ==========================================

const {
    data: attendanceData,
    error: attendanceError
} =
    await supabaseClient
        .from("attendance")
        .select(
            `
            id,
            student_id,
            attendance_date,
            status,
            check_in_time,
            check_out_time
            `
        )
        .eq(
            "attendance_date",
            selectedDate
        );

if (attendanceError) {

    console.error(
        "ATTENDANCE LOAD ERROR:",
        attendanceError
    );

    tableBody.innerHTML = `
        <tr>
            <td
                colspan="8"
                style="text-align:center;padding:35px;"
            >
                Unable to load attendance.
                <br>
                ${attendanceError.message}
            </td>
        </tr>
    `;

    return;
}


// ==========================================
// CONVERT SUPABASE ATTENDANCE
// TO EXISTING TABLE FORMAT
// ==========================================

const records =
    (attendanceData || []).map(
        function(record) {

            return {

                id:
                    record.id,

                studentId:
                    record.student_id,

                date:
                    record.attendance_date,

                status:
                    record.status,

                checkIn:
                    record.check_in_time
                        ? new Date(
                            record.check_in_time
                        ).toLocaleTimeString(
                            [],
                            {
                                hour:
                                    "2-digit",
                                minute:
                                    "2-digit"
                            }
                        )
                        : "",

                checkOut:
                    record.check_out_time
                        ? new Date(
                            record.check_out_time
                        ).toLocaleTimeString(
                            [],
                            {
                                hour:
                                    "2-digit",
                                minute:
                                    "2-digit"
                            }
                        )
                        : ""
            };
        }
    );

    // ==========================================
    // GET FILTERS
    // ==========================================

    const classFilter =
        document.getElementById(
            "attendanceClassFilter"
        );

    const sectionFilter =
        document.getElementById(
            "attendanceSectionFilter"
        );

    const dateFilter =
        document.getElementById(
            "attendanceDateFilter"
        );


    const selectedClass =
        classFilter &&
        classFilter.value
            ? classFilter.value
            : "all";


    const selectedSection =
        sectionFilter &&
        sectionFilter.value
            ? sectionFilter.value
            : "all";


   

    // ==========================================
    // FILTER STUDENTS
    // ==========================================

    const filteredStudents =
        students.filter(
            function(student) {

                const studentClass =
                    String(
                        student.studentClass || ""
                    ).trim();


                const studentSection =
                    String(
                        student.section || ""
                    ).trim();


                const classMatch =
                    selectedClass === "all" ||
                    studentClass ===
                        String(selectedClass);


                const sectionMatch =
                    selectedSection === "all" ||
                    studentSection ===
                        String(selectedSection);


                const searchInput =
                    document.getElementById(
                        "adminAttendanceSearch"
                    );


                const searchValue =
                    searchInput
                        ? searchInput.value
                            .trim()
                            .toLowerCase()
                        : "";


                const studentName =
                    String(
                        student.fullName ||
                        student.name ||
                        ""
                    ).toLowerCase();


                const studentRoll =
                    String(
                        student.rollNumber ||
                        ""
                    ).toLowerCase();


                const studentId =
                    String(
                        student.studentId ||
                        ""
                    ).toLowerCase();


                const searchMatch =
                    searchValue === "" ||
                    studentName.includes(
                        searchValue
                    ) ||
                    studentRoll.includes(
                        searchValue
                    ) ||
                    studentId.includes(
                        searchValue
                    );


                return (
                    classMatch &&
                    sectionMatch &&
                    searchMatch
                );

            }
        );


    // ==========================================
    // CLEAR TABLE
    // ==========================================

    tableBody.innerHTML = "";


    // ==========================================
    // NO STUDENTS
    // ==========================================

    if (
        filteredStudents.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8"
                    style="text-align:center;padding:40px;">
                    No students found.
                </td>
            </tr>
        `;

        const entriesText =
            document.getElementById(
                "attendanceEntriesText"
            );

        if (entriesText) {

            entriesText.textContent =
                "Showing 0 entries";

        }

        updateAttendanceStatistics();

        return;
    }


    // ==========================================
    // RENDER STUDENTS
    // ==========================================

    filteredStudents.forEach(
        function(student, index) {

            const attendanceRecord =
                records.find(
                    function(record) {

                        return (
                            String(
                                record.studentId
                            ) ===
                            String(
                                student.id
                            ) &&
                            record.date ===
                                selectedDate
                        );

                    }
                );


            const row =
                document.createElement("tr");


            row.innerHTML = `

    <td>
        ${index + 1}
    </td>

    <td>
        ${student.rollNumber || "—"}
    </td>

    <td>
        <strong>
            ${
                student.fullName ||
                student.name ||
                "—"
            }
        </strong>
    </td>

    <td>
        ${
            student.studentClass ||
            "—"
        }
    </td>

    <td>
        ${
            student.section ||
            "—"
        }
    </td>

    <td>

        ${
            attendanceRecord &&
            attendanceRecord.status
                ? `
                    <span
                        class="attendance-status-badge
                        ${attendanceRecord.status.toLowerCase()}">
                        ${attendanceRecord.status}
                    </span>
                  `
                : `
                    <span
                        class="attendance-status-badge pending">
                         Not Marked
                    </span>
                  `
        }

    </td>

    <td>

        ${
            attendanceRecord &&
            attendanceRecord.checkIn
                ? attendanceRecord.checkIn
                : "-"
        }

    </td>

`;

            tableBody.appendChild(row);

        }
    );


    // ==========================================
    // UPDATE ENTRY COUNT
    // ==========================================

    const entriesText =
        document.getElementById(
            "attendanceEntriesText"
        );


    if (entriesText) {

        entriesText.textContent =
            `Showing ${filteredStudents.length} entries`;

    }


    // ==========================================
    // UPDATE STATISTICS
    // ==========================================

    updateAttendanceStatistics();

}

// ==========================================
// ATTENDANCE FILTER BUTTON
// ==========================================

const applyAttendanceFilters =
document.getElementById(
"applyAttendanceFilters"
);

if (applyAttendanceFilters) {

applyAttendanceFilters.onclick =
function () {

renderAttendanceTable();
updateAttendanceStatistics();

};

}
// ==========================================
// INDIVIDUAL MARK ATTENDANCE
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".attendance-row-action"
            );

        if (!button) {
            return;
        }

        const studentId =
            Number(
                button.dataset.studentId
            );

        const students =
            getAdminStudentsForAttendance();

        const student =
            students.find(
                function (item) {
                    return Number(item.id) ===
                        studentId;
                }
            );

        if (!student) {

            alert("Student not found.");

            return;
        }

        // Open existing attendance modal
        openAttendanceMarkingModal(
            [student]
        );

    }
);
// ==========================================
// ATTENDANCE STATISTICS
// SUPABASE LIVE DATA ONLY
// ==========================================

async function updateAttendanceStatistics() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.error(
            "Supabase connection is missing."
        );
        return;
    }


    // ==========================================
    // LOAD STUDENTS
    // ==========================================

    const {
        data: students,
        error: studentsError
    } =
        await supabaseClient
            .from("students")
            .select(
                "id, student_class, section"
            );


    if (studentsError) {

        console.error(
            "ATTENDANCE STUDENTS ERROR:",
            studentsError
        );

        return;
    }


    // ==========================================
    // LOAD ATTENDANCE
    // ==========================================

    const {
        data: attendance,
        error: attendanceError
    } =
        await supabaseClient
            .from("attendance")
            .select(
                "id, student_id, attendance_date, status"
            );


    if (attendanceError) {

        console.error(
            "ATTENDANCE RECORDS ERROR:",
            attendanceError
        );

        return;
    }


    // ==========================================
    // GET FILTERS
    // ==========================================

    const classFilter =
        document.getElementById(
            "attendanceClassFilter"
        );

    const sectionFilter =
        document.getElementById(
            "attendanceSectionFilter"
        );

    const dateFilter =
        document.getElementById(
            "attendanceDateFilter"
        );


    const selectedClass =
        classFilter &&
        classFilter.value
            ? classFilter.value
            : "all";


    const selectedSection =
        sectionFilter &&
        sectionFilter.value
            ? sectionFilter.value
            : "all";


    const selectedDate =
        dateFilter &&
        dateFilter.value
            ? dateFilter.value
            : getTodayDate();


    // ==========================================
    // FILTER STUDENTS
    // ==========================================

    const filteredStudents =
        (students || []).filter(
            function(student) {

                const studentClass =
                    String(
                        student.student_class ||
                        ""
                    );

                const studentSection =
                    String(
                        student.section ||
                        ""
                    );


                const classMatch =
                    selectedClass === "all" ||
                    studentClass ===
                        String(
                            selectedClass
                        );


                const sectionMatch =
                    selectedSection === "all" ||
                    studentSection ===
                        String(
                            selectedSection
                        );


                return (
                    classMatch &&
                    sectionMatch
                );
            }
        );


    // ==========================================
    // GET SELECTED DATE RECORDS
    // ==========================================

    const selectedRecords =
        (attendance || []).filter(
            function(record) {

                return String(
                    record.attendance_date ||
                    ""
                ) ===
                String(
                    selectedDate
                );
            }
        );


    // ==========================================
    // SELECTED STUDENT IDs
    // ==========================================

    const filteredStudentIds =
        filteredStudents.map(
            function(student) {

                return String(
                    student.id
                );
            }
        );


    // ==========================================
    // RELEVANT ATTENDANCE
    // ==========================================

    const relevantRecords =
        selectedRecords.filter(
            function(record) {

                return filteredStudentIds.includes(
                    String(
                        record.student_id
                    )
                );
            }
        );


    // ==========================================
    // PRESENT
    // ==========================================

    const present =
        relevantRecords.filter(
            function(record) {

                return String(
                    record.status ||
                    ""
                ).toLowerCase() ===
                "present";
            }
        ).length;


    // ==========================================
    // ABSENT
    // ==========================================

    const absent =
        relevantRecords.filter(
            function(record) {

                return String(
                    record.status ||
                    ""
                ).toLowerCase() ===
                "absent";
            }
        ).length;


    // ==========================================
    // TOTAL
    // ==========================================

    const total =
        filteredStudents.length;


    // ==========================================
    // ATTENDANCE RATE
    // ==========================================

    const rate =
        total > 0
            ? Math.round(
                (
                    present /
                    total
                ) * 100
            )
            : 0;


    // ==========================================
    // UPDATE UI
    // ==========================================

    const totalElement =
        document.getElementById(
            "attendanceTotalStudents"
        );

    const presentElement =
        document.getElementById(
            "attendancePresentToday"
        );

    const absentElement =
        document.getElementById(
            "attendanceAbsentToday"
        );

    const rateElement =
        document.getElementById(
            "attendanceRate"
        );


    if (totalElement) {

        totalElement.textContent =
            total;
    }


    if (presentElement) {

        presentElement.textContent =
            present;
    }


    if (absentElement) {

        absentElement.textContent =
            absent;
    }


    if (rateElement) {

        rateElement.textContent =
            rate + "%";
    }
}
// ==========================================================
// EDU PORTAL - STUDENT SELF ATTENDANCE
// ==========================================================

const STUDENT_ATTENDANCE_KEY = "eduPortalAttendance";


// ==========================================================
// GET TODAY DATE
// ==========================================================

function getStudentAttendanceDate() {

const today = new Date();

const year =
today.getFullYear();

const month =
String(today.getMonth() + 1).padStart(2, "0");

const day =
String(today.getDate()).padStart(2, "0");

return `${year}-${month}-${day}`;

}


// ==========================================================
// GET ATTENDANCE RECORDS
// ==========================================================

function getStudentAttendanceRecords() {

return JSON.parse(
localStorage.getItem(
STUDENT_ATTENDANCE_KEY
)
) || [];

}


// ==========================================================
// SAVE ATTENDANCE RECORDS
// ==========================================================

function saveStudentAttendanceRecords(records) {

localStorage.setItem(
STUDENT_ATTENDANCE_KEY,
JSON.stringify(records)
);

}


// ==========================================================
// UPDATE STUDENT ATTENDANCE UI
// ==========================================================

async function updateStudentAttendanceUI() {

    const checkInButton =
        document.getElementById(
            "studentCheckInBtn"
        );

    const message =
        document.getElementById(
            "todayAttendanceMessage"
        );

    const todayStatus =
        document.getElementById(
            "todayAttendanceStatus"
        );


    if (!checkInButton || !message) {
        return;
    }


    const loggedInStudent =
        JSON.parse(
            localStorage.getItem(
                "loggedInStudent"
            )
        );


    if (!loggedInStudent) {

        message.textContent =
            "Student session not found.";

        return;
    }


    // ==========================================
    // GET DATABASE STUDENT
    // ==========================================

    let dbStudent = null;


    if (loggedInStudent.id) {

        const result =
            await supabaseClient
                .from("students")
                .select(
                    "id, student_id"
                )
                .eq(
                    "id",
                    loggedInStudent.id
                )
                .maybeSingle();


        if (
            !result.error &&
            result.data
        ) {

            dbStudent =
                result.data;

        }
    }


    // ==========================================
    // FALLBACK USING STUDENT ID
    // ==========================================

    if (
        !dbStudent &&
        loggedInStudent.studentId
    ) {

        const result =
            await supabaseClient
                .from("students")
                .select(
                    "id, student_id"
                )
                .eq(
                    "student_id",
                    loggedInStudent.studentId
                )
                .maybeSingle();


        if (
            !result.error &&
            result.data
        ) {

            dbStudent =
                result.data;

        }
    }


    if (!dbStudent) {

        message.textContent =
            "Student record not found.";

        return;
    }


    // ==========================================
    // TODAY
    // ==========================================

    const today =
        getStudentAttendanceDate();


    // ==========================================
    // GET TODAY ATTENDANCE FROM SUPABASE
    // ==========================================

    const {
        data: todayRecord,
        error
    } =
        await supabaseClient
            .from("attendance")
            .select(
                "id, status, check_in_time, check_out_time"
            )
            .eq(
                "student_id",
                dbStudent.id
            )
            .eq(
                "attendance_date",
                today
            )
            .maybeSingle();


    if (error) {

        console.error(
            "TODAY ATTENDANCE LOAD ERROR:",
            error
        );

        message.textContent =
            "Unable to load today's attendance.";

        return;
    }


    // ==========================================
    // ATTENDANCE EXISTS
    // ==========================================

    if (todayRecord) {

        const status =
            String(
                todayRecord.status || ""
            );


        // ------------------------------
        // PRESENT
        // ------------------------------

        if (
            status.toLowerCase() ===
            "present"
        ) {

            checkInButton.disabled =
                true;

            checkInButton.innerHTML =
                "✓ Attendance Marked";


            if (
                todayRecord.check_in_time
            ) {

                const checkInDate =
                    new Date(
                        todayRecord.check_in_time
                    );


                message.textContent =
                    "You checked in today at " +
                    checkInDate.toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );

            }
            else {

                message.textContent =
                    "Today's attendance: Present";

            }


            if (todayStatus) {

                todayStatus.textContent =
                    "Present";

            }

            return;
        }


        // ------------------------------
        // ABSENT
        // ------------------------------

        if (
            status.toLowerCase() ===
            "absent"
        ) {

            checkInButton.disabled =
                true;

            checkInButton.innerHTML =
                "✕ Absent";


            message.textContent =
                "Today's attendance: Absent";


            if (todayStatus) {

                todayStatus.textContent =
                    "Absent";

            }

            return;
        }


        // ------------------------------
        // OTHER STATUS
        // ------------------------------

        checkInButton.disabled =
            true;

        checkInButton.innerHTML =
            status;


        message.textContent =
            "Today's attendance: " +
            status;


        if (todayStatus) {

            todayStatus.textContent =
                status;

        }

        return;
    }


    // ==========================================
    // NO RECORD YET
    // ==========================================

    checkInButton.disabled =
        false;

    checkInButton.innerHTML =
        "🟢 Check In";


    message.textContent =
        "You have not checked in today.";


    if (todayStatus) {

        todayStatus.textContent =
            "Not Marked";

    }

}

// ==========================================================
// STUDENT CHECK-IN - SUPABASE
// ==========================================================

async function studentCheckIn() {

    const loggedInStudent =
        JSON.parse(
            localStorage.getItem(
                "loggedInStudent"
            )
        );


    if (!loggedInStudent) {

        alert(
            "Student session not found. Please login again."
        );

        return;
    }


    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        alert(
            "Supabase connection is missing."
        );

        return;
    }


    // ==========================================
    // FIND DATABASE STUDENT
    // ==========================================

    let dbStudent = null;


    if (loggedInStudent.id) {

        const result =
            await supabaseClient
                .from("students")
                .select(
                    "id, student_id"
                )
                .eq(
                    "id",
                    loggedInStudent.id
                )
                .maybeSingle();


        if (
            !result.error &&
            result.data
        ) {

            dbStudent =
                result.data;

        }
    }


    // ==========================================
    // TRY STUDENT ID
    // ==========================================

    if (
        !dbStudent &&
        loggedInStudent.studentId
    ) {

        const result =
            await supabaseClient
                .from("students")
                .select(
                    "id, student_id"
                )
                .eq(
                    "student_id",
                    loggedInStudent.studentId
                )
                .maybeSingle();


        if (
            !result.error &&
            result.data
        ) {

            dbStudent =
                result.data;

        }
    }


    if (!dbStudent) {

        alert(
            "Student record not found in Supabase."
        );

        return;
    }


    // ==========================================
    // TODAY
    // ==========================================

    const today =
        getStudentAttendanceDate();

        // ==========================================
// 12:00 PM ATTENDANCE CUTOFF
// ==========================================

const pakistanTime =
    new Date().toLocaleString(
        "en-US",
        {
            timeZone: "Asia/Karachi"
        }
    );

const pakistanNow =
    new Date(pakistanTime);

const currentHour =
    pakistanNow.getHours();

if (
    currentHour >= 12
) {

    await autoMarkAbsentAfterNoon();

    await updateStudentAttendanceUI();

    alert(
        "Attendance time is over. " +
        "Attendance is automatically marked Absent after 12:00 PM."
    );

    return;
}


    // ==========================================
    // CHECK IF ALREADY CHECKED IN
    // ==========================================

    const {
        data: existingRecord,
        error: checkError
    } =
        await supabaseClient
            .from("attendance")
            .select(
                "id, status, check_in_time"
            )
            .eq(
                "student_id",
                dbStudent.id
            )
            .eq(
                "attendance_date",
                today
            )
            .maybeSingle();


    if (checkError) {

        console.error(
            "ATTENDANCE CHECK ERROR:",
            checkError
        );

        alert(
            "Unable to check today's attendance:\n" +
            checkError.message
        );

        return;
    }


    // ==========================================
    // ALREADY CHECKED IN
    // ==========================================

    if (existingRecord) {

        updateStudentAttendanceUI();

        alert(
            "You have already checked in today. ✅"
        );

        return;
    }


    // ==========================================
    // CURRENT DATE + TIME
    // ==========================================

    const now =
        new Date();


    const checkInTime =
        now.toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    // ==========================================
    // SAVE TO SUPABASE
    // ==========================================

    const {
        data,
        error
    } =
        await supabaseClient
            .from("attendance")
            .insert([
                {
                    student_id:
                        dbStudent.id,

                    attendance_date:
                        today,

                    status:
                        "Present",

                    check_in_time:
                        now.toISOString()
                }
            ])
            .select()
            .single();


    // ==========================================
    // DATABASE ERROR
    // ==========================================

    if (error) {

        console.error(
            "ATTENDANCE INSERT ERROR:",
            error
        );

        alert(
            "Attendance could not be saved:\n" +
            error.message
        );

        return;
    }


    
    // ==========================================
    // UPDATE STUDENT UI
    // ==========================================

    updateStudentAttendanceUI();

    updateStudentAttendanceSummary();

    await loadRealStudentAttendance();


    // ==========================================
    // RELOAD STUDENT DASHBOARD
    // ==========================================

    if (
        typeof StudentDashboard !==
        "undefined" &&
        typeof StudentDashboard.loadAttendance ===
        "function"
    ) {

        await StudentDashboard.loadAttendance(
            loggedInStudent
        );

    }


    // ==========================================
    // SUCCESS
    // ==========================================

    alert(
        "Attendance marked successfully! ✅\n\n" +
        "Check In: " +
        checkInTime
    );

}

// ==========================================================
// STUDENT ATTENDANCE SUMMARY
// SUPABASE LIVE DATA
// ==========================================================

async function updateStudentAttendanceSummary() {

    const loggedInStudent =
        JSON.parse(
            localStorage.getItem(
                "loggedInStudent"
            )
        );

    if (!loggedInStudent) {
        return;
    }

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.error(
            "Supabase connection is missing."
        );
        return;
    }


    // ==========================================
    // GET DATABASE STUDENT
    // ==========================================

    const {
        data: student,
        error: studentError
    } =
        await supabaseClient
            .from("students")
            .select("id")
            .eq(
                "id",
                loggedInStudent.id
            )
            .maybeSingle();


    if (studentError) {

        console.error(
            "STUDENT LOAD ERROR:",
            studentError
        );

        return;
    }


    if (!student) {
        return;
    }


    // ==========================================
    // GET STUDENT ATTENDANCE
    // ==========================================

    const {
        data: attendanceRecords,
        error: attendanceError
    } =
        await supabaseClient
            .from("attendance")
            .select(
                "id, student_id, attendance_date, status"
            )
            .eq(
                "student_id",
                student.id
            );


    if (attendanceError) {

        console.error(
            "STUDENT ATTENDANCE LOAD ERROR:",
            attendanceError
        );

        return;
    }


    const records =
        attendanceRecords || [];


    // ==========================================
    // TOTAL CLASSES
    // ==========================================

    const totalClasses =
        records.length;


    // ==========================================
    // PRESENT CLASSES
    // ==========================================

    const presentClasses =
        records.filter(
            function(record) {

                return String(
                    record.status ||
                    ""
                ).toLowerCase() ===
                "present";
            }
        ).length;


    // ==========================================
    // ABSENT CLASSES
    // ==========================================

    const absentClasses =
        records.filter(
            function(record) {

                return String(
                    record.status ||
                    ""
                ).toLowerCase() ===
                "absent";
            }
        ).length;


    // ==========================================
    // ATTENDANCE PERCENTAGE
    // ==========================================

    const attendancePercentage =
        totalClasses > 0
            ? Math.round(
                (
                    presentClasses /
                    totalClasses
                ) * 100
            )
            : 0;


    // ==========================================
    // UPDATE UI
    // ==========================================

    const totalElement =
        document.getElementById(
            "totalClasses"
        );

    const presentElement =
        document.getElementById(
            "presentClasses"
        );

    const absentElement =
        document.getElementById(
            "absentClasses"
        );

    const percentageElement =
        document.getElementById(
            "attendancePercentage"
        );

    const attendanceBar =
        document.getElementById(
            "attendanceBar"
        );


    if (totalElement) {

        totalElement.textContent =
            totalClasses;
    }


    if (presentElement) {

        presentElement.textContent =
            presentClasses;
    }


    if (absentElement) {

        absentElement.textContent =
            absentClasses;
    }


    if (percentageElement) {

        percentageElement.textContent =
            attendancePercentage +
            "%";
    }


    if (attendanceBar) {

        attendanceBar.style.width =
            attendancePercentage +
            "%";
    }
}

// ==========================================================
// ATTACH CHECK-IN BUTTON
// ==========================================================

document.addEventListener(
"DOMContentLoaded",
function() {

const checkInButton =
document.getElementById(
"studentCheckInBtn"
);


if (checkInButton) {

checkInButton.addEventListener(
"click",
studentCheckIn
);

}


updateStudentAttendanceUI();

updateStudentAttendanceSummary();


// ==========================================
// AUTO ABSENT CHECK EVERY MINUTE
// ==========================================

autoMarkAbsentAfterNoon();

setInterval(
    async function() {

        await autoMarkAbsentAfterNoon();

        // Refresh Admin Attendance table
        if (
            typeof renderAttendanceTable ===
            "function"
        ) {

            const attendanceTable =
                document.getElementById(
                    "attendanceTableBody"
                );

            if (attendanceTable) {

                await renderAttendanceTable();

            }
        }

    },
    60 * 1000
);

}
);

// ==========================================
// LOAD STUDENTS INTO FEE DROPDOWN
// SUPABASE LIVE DATA
// ==========================================

async function loadFeeStudents() {

    const studentDropdown =
        document.getElementById("feeStudent");

    if (!studentDropdown) {
        return;
    }

    if (typeof supabaseClient === "undefined") {
        alert("Supabase connection is missing.");
        return;
    }

    try {

        const result =
            await supabaseClient
                .from("students")
                .select("*");

        if (result.error) {

            console.error(
                "FEE STUDENTS LOAD ERROR:",
                result.error
            );

            alert(
                "Students could not be loaded.\n\n" +
                result.error.message
            );

            return;
        }

        const students =
            result.data || [];

        console.log(
            "MONTHLY FEE STUDENTS:",
            students
        );


        // RESET DROPDOWN

        studentDropdown.innerHTML = `
            <option value="">
                Select Student
            </option>
        `;


        // ADD STUDENTS

        students.forEach(function (student) {

            const option =
                document.createElement("option");


            option.value =
                student.id;


            option.textContent =
                (
                    student.name ||
                    student.full_name ||
                    "Unnamed Student"
                ) +
                " — Roll No: " +
                (
                    student.roll_number ||
                    student.student_id ||
                    student.id
                );


            option.dataset.databaseId =
                student.id;


            option.dataset.studentClass =
                student.student_class || "";


            option.dataset.section =
                student.section || "";


            studentDropdown.appendChild(
                option
            );

        });


        console.log(
            "Students added to dropdown:",
            studentDropdown.options.length - 1
        );

    } catch (error) {

        console.error(
            "FEE STUDENT LOAD EXCEPTION:",
            error
        );

        alert(
            "Unable to load students.\n\n" +
            error.message
        );

    }
}


// ==========================================
// OPEN ADD MONTHLY FEE FORM
// ==========================================

const addMonthlyFeeBtn =
document.getElementById("addMonthlyFeeBtn");

const monthlyFeeForm =
document.getElementById("monthlyFeeForm");


if (addMonthlyFeeBtn) {

    addMonthlyFeeBtn.addEventListener(
        "click",
        async function () {

            monthlyFeeForm.style.display =
                "block";

            await loadFeeStudents();

        }
    );

}


// ==========================================
// CLOSE FEE FORM
// ==========================================

const closeMonthlyFeeForm =
document.getElementById("closeMonthlyFeeForm");


if (closeMonthlyFeeForm) {

closeMonthlyFeeForm.addEventListener(
"click",
function () {

monthlyFeeForm.style.display =
"none";

}
);

}


// ==========================================
// STUDENT SELECT
// AUTO FILL CLASS / SECTION
// ==========================================

const feeStudent =
document.getElementById("feeStudent");


if (feeStudent) {
    feeStudent.addEventListener(
        "change",
        async function () {

            const selectedOption =
                this.options[this.selectedIndex];

            const databaseId =
                selectedOption
                    ? selectedOption.dataset.databaseId
                    : "";

            const classField =
                document.getElementById(
                    "feeStudentClass"
                );

            if (!databaseId) {

                if (classField) {
                    classField.value = "";
                }

                return;
            }

            if (
                typeof supabaseClient ===
                "undefined"
            ) {

                if (classField) {
                    classField.value = "";
                }

                alert(
                    "Supabase connection is missing."
                );

                return;
            }

            const {
                data: student,
                error
            } =
                await supabaseClient
                    .from("students")
                    .select(
                         "id, student_id, student_class, section, monthly_fee"
                    )
                    .eq(
                        "id",
                        databaseId
                    )
                    .maybeSingle();

            if (error) {

                console.error(
                    "FEE STUDENT LOAD ERROR:",
                    error
                );

                if (classField) {
                    classField.value = "";
                }

                return;
            }

            if (student && classField) {

                classField.value =
                    (student.student_class || "") +
                    (
                        student.section
                            ? " - " +
                              student.section
                            : ""
                    );

            } 
            // ==========================================
// AUTO LOAD STUDENT MONTHLY FEE
// ==========================================

const monthlyFeeField =
    document.getElementById(
        "monthlyFeeAmount"
    );

if (monthlyFeeField && student) {

    monthlyFeeField.value =
        Number(student.monthly_fee || 0);

    calculateFeeRemaining();
}
            else if (classField) {

                classField.value = "";

            }

        }
    );
}

// ==========================================
// CALCULATE REMAINING FEE
// ==========================================

function calculateFeeRemaining() {

const feeAmount =
Number(
document.getElementById(
"monthlyFeeAmount"
).value
) || 0;


const paidAmount =
Number(
document.getElementById(
"feePaidAmount"
).value
) || 0;


let remaining =
feeAmount - paidAmount;


if (remaining < 0) {
remaining = 0;
}


const remainingField =
document.getElementById(
"feeRemainingAmount"
);


if (remainingField) {

remainingField.textContent =
"Rs. " +
remaining.toLocaleString();

}




}


// ==========================================
// FEE AMOUNT CHANGE
// ==========================================

const monthlyFeeAmount =
document.getElementById(
"monthlyFeeAmount"
);


if (monthlyFeeAmount) {

monthlyFeeAmount.addEventListener(
"input",
calculateFeeRemaining
);

}


// ==========================================
// PAID AMOUNT CHANGE
// ==========================================

const feePaidAmount =
document.getElementById(
"feePaidAmount"
);


if (feePaidAmount) {

feePaidAmount.addEventListener(
"input",
calculateFeeRemaining
);

}


// ==========================================
// SAVE MONTHLY FEE
// ==========================================

const saveMonthlyFeeBtn =
document.getElementById(
"saveMonthlyFeeBtn"
);


if (saveMonthlyFeeBtn) {

saveMonthlyFeeBtn.addEventListener(
    "click",
    async function () {

const feeStudentSelect =
    document.getElementById("feeStudent");

const selectedOption =
    feeStudentSelect.options[
        feeStudentSelect.selectedIndex
    ];

const studentId =
    selectedOption.dataset.databaseId ||
    feeStudentSelect.value;


const month =
document.getElementById(
"feeMonth"
).value;


const feeAmount =
Number(
document.getElementById(
"monthlyFeeAmount"
).value
) || 0;


const paidAmount =
Number(
document.getElementById(
"feePaidAmount"
).value
) || 0;


const dueDate =
document.getElementById(
"feeDueDate"
).value;




// Validation

if (!studentId) {

alert(
"Please select a student."
);

return;

}


if (!month) {

alert(
"Please select fee month."
);

return;

}


if (feeAmount <= 0) {

alert(
"Please enter monthly fee amount."
);

return;

}

if (paidAmount > feeAmount) {

alert(
"Paid amount cannot be greater than fee amount."
);

return;

}


// ==========================================
// LOAD STUDENT FROM SUPABASE
// ==========================================

if (
    typeof supabaseClient ===
    "undefined"
) {

    alert(
        "Supabase connection is missing."
    );

    return;
}

const {
    data: student,
    error: studentError
} =
    await supabaseClient
        .from("students")
      .select(`
    id,
    student_id,
    name,
    student_class,
    section
`)
      .eq(
    "id",
    String(studentId)
)
        .maybeSingle();

if (studentError) {

    console.error(
        "FEE STUDENT LOAD ERROR:",
        studentError
    );

    alert(
        "Student could not be loaded.\n\n" +
        studentError.message
    );

    return;
}

if (!student) {

    alert(
        "Student record not found in Supabase."
    );

    return;
}

// ==========================================
// LOAD CURRENT FEE RECORDS
// ==========================================
const {
    data: existingFeeRecords,
    error: feeRecordsLoadError
} = await supabaseClient
    .from("fee_records")
    .select("*");

if (feeRecordsLoadError) {
    console.error(
        "FEE RECORDS LOAD ERROR:",
        feeRecordsLoadError
    );

    alert(
        "Fee records could not be loaded.\n\n" +
        feeRecordsLoadError.message
    );

    return;
}

const feeRecords = existingFeeRecords || [];
// ==========================================
// CHECK DUPLICATE FEE
// ==========================================

const {
    data: duplicateFees,
    error: duplicateError
} =
    await supabaseClient
        .from("fee_records")
        .select("id")
        .eq(
            "student_id",
            student.id
        )
        .eq(
            "month",
            month
        );

if (duplicateError) {

    console.error(
        "FEE DUPLICATE CHECK ERROR:",
        duplicateError
    );

    alert(
        "Fee record could not be checked.\n\n" +
        duplicateError.message
    );

    return;
}

if (
    duplicateFees &&
    duplicateFees.length > 0
) {

    alert(
        "Fee record for this student and month already exists."
    );

    return;
}

// Check duplicate month

const duplicate =
feeRecords.find(
function (record) {

return (
String(
    record.studentId
) === String(studentId)
&&
record.month === month
);

}
);


if (duplicate) {

alert(
"Fee record for this student and month already exists."
);

return;

}


const remainingAmount =
Math.max(
feeAmount - paidAmount,
0
);


const feeRecord = {

id:
"FEE-" +
Date.now()
.toString()
.slice(-8),

studentId:
    student.student_id ||
    student.id,

studentDbId:
    student.id,

studentName:
    student.name ||
    
    "",

studentClass:
    student.student_class ||
    "",

section:
    student.section ||
    "",

month:
month,

feeAmount:
feeAmount,

paidAmount:
paidAmount,

remainingAmount:
remainingAmount,

dueDate:
dueDate,

paymentDate:
paidAmount > 0
    ? new Date().toISOString().split("T")[0]
    : null,

status:
paidAmount >= feeAmount
    ? "Paid"
    : paidAmount > 0
        ? "Partial"
        : "Unpaid",

createdAt:
new Date().toISOString()

};


feeRecords.push(
feeRecord
);

// ==========================================
// GET SUPABASE STUDENT ID
// ==========================================

let studentDbId =
    feeRecord.studentDbId ||
    null;


if (!studentDbId && feeRecord.studentId) {

    const {
        data: dbStudent,
        error: studentLookupError
    } =
        await supabaseClient
            .from("students")
            .select("id")
            .eq(
                "student_id",
                String(
                    feeRecord.studentId
                )
            )
            .maybeSingle();


    if (studentLookupError) {

        console.error(
            "FEE STUDENT LOOKUP ERROR:",
            studentLookupError
        );

        alert(
            "Unable to find student in Supabase.\n\n" +
            studentLookupError.message
        );

        return;
    }


    if (dbStudent) {

        studentDbId =
            dbStudent.id;

    }

}


if (!studentDbId) {

    alert(
        "Student database ID could not be found."
    );

    return;
}
// ==========================================
// SAVE FEE TO SUPABASE
// ==========================================

if (typeof supabaseClient === "undefined") {

    alert("Supabase connection is missing.");

    return;

}


const { data, error } =
    await supabaseClient
        .from("fee_records")
     .insert({
    id:
        feeRecord.id,

    student_id:
        Number(studentDbId),

    student_name:
        feeRecord.studentName,

    student_class:
        feeRecord.studentClass,

    section:
        feeRecord.section,

    month:
        feeRecord.month,

    fee_amount:
        feeRecord.feeAmount,

    paid_amount:
        feeRecord.paidAmount,

    remaining_amount:
        feeRecord.remainingAmount,

    due_date:
        feeRecord.dueDate || null,

    payment_date:
        feeRecord.paymentDate || null,

    payment_method:
        "Cash",

    status:
        feeRecord.status,

    fee_source:
        "Manual",

    created_at:
        feeRecord.createdAt
})
        .select();


if (error) {

    console.error(
        "SUPABASE FEE ERROR:",
        error
    );

    alert(
        "Fee Save Error:\n\n" +
        error.message
    );

    return;

}

// Render immediately

renderFeeRecords();


// Update statistics

updateFeeStatistics(
feeRecords
);


// Clear form

resetMonthlyFeeForm();


// Close form

monthlyFeeForm.style.display =
"none";

}
);

}


// ==========================================
// RENDER FEE RECORDS - SUPABASE
// ==========================================

async function renderFeeRecords() {

    const tableBody =
        document.getElementById(
            "feeTableBody"
        );

    if (!tableBody) {
        return;
    }


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection is missing."
        );

        return;
    }


    // ==========================================
    // LOAD FEES FROM SUPABASE
    // ==========================================

    const {
        data: feeRecords,
        error
    } =
        await supabaseClient
            .from("fee_records")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "SUPABASE FEE LOAD ERROR:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="11"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#dc2626;
                    "
                >
                    Unable to load fee records.
                    <br><br>
                    ${error.message}
                </td>
            </tr>
        `;

        return;
    }


    tableBody.innerHTML = "";


    // ==========================================
    // NO RECORDS
    // ==========================================

    if (
        !feeRecords ||
        feeRecords.length === 0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="11">

                    <div class="fee-empty-state">

                        <div>
                            💰
                        </div>

                        <h3>
                            No Fee Records
                        </h3>

                        <p>
                            Add a monthly fee record
                            to see it here.
                        </p>

                    </div>

                </td>
            </tr>
        `;


        updateFeeStatistics([]);

        return;
    }


    // ==========================================
    // RENDER RECORDS
    // ==========================================

    feeRecords.forEach(
        function(record, index) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${record.student_name || ""}
                </td>

                <td>
                    ${record.student_id || ""}
                </td>

                <td>
                    ${
                        record.student_class ||
                        ""
                    }

                    ${
                        record.section
                            ? " - " +
                              record.section
                            : ""
                    }
                </td>

                <td>
                    ${record.month || ""}
                </td>

                <td>
                    Rs.
                    ${
                        Number(
                            record.fee_amount
                        ).toLocaleString()
                    }
                </td>

                <td>
                    Rs.
                    ${
                        Number(
                            record.paid_amount
                        ).toLocaleString()
                    }
                </td>

        <td>
    Rs.
    ${
        Number(
            record.remaining_amount
        ).toLocaleString()
    }
</td>

<td>
    ${
        record.due_date
            ? new Date(record.due_date)
                .toLocaleDateString("en-GB")
            : "—"
    }
</td>

<td>
    ${
        record.payment_date
            ? new Date(record.payment_date)
                .toLocaleDateString("en-GB")
            : "—"
    }
</td>

<td>
    ${record.status || "Unpaid"}
</td>

          <td>

    ${
        String(record.status || "").toLowerCase() === "paid"
            ? `
                <span
                    style="
                        color:#16a34a;
                        font-weight:600;
                        margin-right:8px;
                    "
                >
                    Paid ✅
                </span>
            `
            : `
                <button
                    type="button"
                    class="result-action-btn"
                    style="
                        background:#16a34a;
                        color:white;
                        margin-right:6px;
                    "
                    onclick="
                        markFeeAsPaid(
                            '${record.id}'
                        )
                    "
                >
                    💰 Mark as Paid
                </button>
            `
    }

<button
    type="button"
    class="result-action-btn"
    style="
        background:#eef2ff;
        color:#4338ca;
        margin-right:6px;
    "
    onclick="
        editFeePayment(
            '${record.id}'
        )
    "
>
    ✏️
</button>

 

</td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );


    // ==========================================
    // ENTRIES COUNT
    // ==========================================

    const entriesText =
        document.getElementById(
            "feeEntriesText"
        );


    if (entriesText) {

        entriesText.textContent =
            "Showing " +
            feeRecords.length +
            " entries";

    }


    // ==========================================
    // STATISTICS
    // ==========================================

    const convertedRecords =
        feeRecords.map(
            function(record) {

                return {

                    ...record,

                    studentId:
                        record.student_id,

                    studentName:
                        record.student_name,

                    studentClass:
                        record.student_class,

                    feeAmount:
                        record.fee_amount,

                    paidAmount:
                        record.paid_amount,

                    remainingAmount:
                        record.remaining_amount

                };

            }
        );


    updateFeeStatistics(
        convertedRecords
    );

}


// ==========================================
// FEE STATISTICS
// ==========================================

function updateFeeStatistics(
feeRecords
) {

let totalFees = 0;
let totalPaid = 0;
let totalPending = 0;
let totalOverdue = 0;


feeRecords.forEach(
function (record) {

totalFees +=
Number(
record.feeAmount
) || 0;


totalPaid +=
Number(
record.paidAmount
) || 0;


if (
record.status ===
"Pending"
) {

totalPending +=
Number(
record.remainingAmount
) || 0;

}


if (
record.status ===
"Overdue"
) {

totalOverdue +=
Number(
record.remainingAmount
) || 0;

}

}
);


const totalField =
document.getElementById(
"adminTotalMonthlyFees"
);


const paidField =
document.getElementById(
"adminTotalPaidFees"
);


const pendingField =
document.getElementById(
"adminTotalPendingFees"
);


const overdueField =
document.getElementById(
"adminTotalOverdueFees"
);


if (totalField) {

totalField.textContent =
"Rs. " +
totalFees.toLocaleString();

}


if (paidField) {

paidField.textContent =
"Rs. " +
totalPaid.toLocaleString();

}


if (pendingField) {

pendingField.textContent =
"Rs. " +
totalPending.toLocaleString();

}


if (overdueField) {

overdueField.textContent =
"Rs. " +
totalOverdue.toLocaleString();

}

}


// ==========================================
// RESET FEE FORM
// ==========================================

function resetMonthlyFeeForm() {

const fields = [

"feeStudent",
"feeMonth",
"monthlyFeeAmount",
"feeDueDate",
"feePaidAmount",
"feeRemarks"

];


fields.forEach(
function (id) {

const field =
document.getElementById(
id
);

if (field) {

if (
id ===
"feePaidAmount"
) {

field.value = "";

}
else {

field.value = "";

}

}

}
);


const classField =
document.getElementById(
"feeStudentClass"
);


if (classField) {

classField.value = "";

}


const statusField =
document.getElementById(
"feeStatus"
);


if (statusField) {

statusField.value =
"Pending";

}


const remainingField =
document.getElementById(
"feeRemainingAmount"
);


if (remainingField) {

remainingField.textContent =
"Rs. 0";

}

}


// ==========================================
// DELETE FEE RECORD - SUPABASE
// ==========================================

async function deleteFeeRecord(
    recordId
) {

    if (!recordId) {

        alert(
            "Fee record ID is missing."
        );

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this fee record?"
        );


    if (!confirmed) {
        return;
    }


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        alert(
            "Supabase connection is missing."
        );

        return;
    }


    // ==========================================
    // DELETE FROM SUPABASE
    // ==========================================

    const {
        error
    } =
        await supabaseClient
            .from("fee_records")
            .delete()
            .eq(
                "id",
                String(recordId)
            );


    if (error) {

        console.error(
            "SUPABASE FEE DELETE ERROR:",
            error
        );

        alert(
            "Fee Delete Error:\n\n" +
            error.message
        );

        return;
    }


    
    // ==========================================
    // REFRESH
    // ==========================================

    await renderFeeRecords();


    alert(
        "Fee record deleted successfully! ✅"
    );

}

// ==========================================
// EDIT / ADD REMAINING FEE PAYMENT
// ==========================================

async function editFeePayment(recordId) {

    if (!recordId) {
        alert("Fee record ID is missing.");
        return;
    }

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        alert(
            "Supabase connection is missing."
        );
        return;
    }


    // ==========================================
    // LOAD CURRENT FEE RECORD
    // ==========================================

    const {
        data: feeRecord,
        error: loadError
    } =
        await supabaseClient
            .from("fee_records")
            .select("*")
            .eq(
                "id",
                String(recordId)
            )
            .maybeSingle();


    if (
        loadError ||
        !feeRecord
    ) {

        console.error(
            "FEE LOAD ERROR:",
            loadError
        );

        alert(
            "Unable to load fee record."
        );

        return;
    }


    // ==========================================
    // CURRENT VALUES
    // ==========================================

    const totalFee =
        Number(
            feeRecord.fee_amount || 0
        );

    const alreadyPaid =
        Number(
            feeRecord.paid_amount || 0
        );

    const remaining =
        Math.max(
            totalFee - alreadyPaid,
            0
        );


    // ==========================================
    // ALREADY FULLY PAID
    // ==========================================

    if (remaining <= 0) {

        alert(
            "This fee is already fully Paid. ✅"
        );

        return;
    }


    // ==========================================
    // ASK ADDITIONAL PAYMENT
    // ==========================================

    const paymentInput =
        prompt(
            "Add Remaining Fee Payment\n\n" +

            "Total Fee: Rs. " +
            totalFee.toLocaleString() +

            "\nAlready Paid: Rs. " +
            alreadyPaid.toLocaleString() +

            "\nRemaining: Rs. " +
            remaining.toLocaleString() +

            "\n\nEnter additional payment amount:"
        );


    if (
        paymentInput === null
    ) {
        return;
    }


    const additionalPayment =
        Number(paymentInput);


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
        !Number.isFinite(
            additionalPayment
        ) ||
        additionalPayment <= 0
    ) {

        alert(
            "Please enter a valid payment amount."
        );

        return;
    }


    if (
        additionalPayment >
        remaining
    ) {

        alert(
            "Payment cannot be greater than remaining fee.\n\n" +

            "Remaining: Rs. " +
            remaining.toLocaleString()
        );

        return;
    }


    // ==========================================
    // CALCULATE NEW VALUES
    // ==========================================

    const newPaidAmount =
        alreadyPaid +
        additionalPayment;

    const newRemainingAmount =
        Math.max(
            totalFee -
            newPaidAmount,
            0
        );

    const newStatus =
        newRemainingAmount === 0
            ? "Paid"
            : "Partial";


    // ==========================================
    // UPDATE SUPABASE
    // ==========================================

    const {
        error
    } =
        await supabaseClient
            .from("fee_records")
            .update({

                paid_amount:
                    newPaidAmount,

                remaining_amount:
                    newRemainingAmount,

                status:
                    newStatus,

                payment_date:
                    new Date()
                        .toISOString()
                        .split("T")[0]

            })
            .eq(
                "id",
                String(recordId)
            );


    if (error) {

        console.error(
            "FEE PAYMENT UPDATE ERROR:",
            error
        );

        alert(
            "Payment Update Error:\n\n" +
            error.message
        );

        return;
    }


    // ==========================================
    // REFRESH TABLE
    // ==========================================

    await renderFeeRecords();


    alert(
        "Payment updated successfully! ✅\n\n" +

        "Paid: Rs. " +
        newPaidAmount.toLocaleString() +

        "\nRemaining: Rs. " +
        newRemainingAmount.toLocaleString()
    );

}

// ==========================================
// RECORD FEE PAYMENT - FULL / PARTIAL
// ==========================================

async function markFeeAsPaid(recordId) {

    if (!recordId) {
        alert("Fee record ID is missing.");
        return;
    }

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        alert(
            "Supabase connection is missing."
        );
        return;
    }

    // ==========================================
    // LOAD CURRENT FEE RECORD
    // ==========================================

    const {
        data: feeRecord,
        error: loadError
    } =
        await supabaseClient
            .from("fee_records")
            .select("*")
            .eq(
                "id",
                String(recordId)
            )
            .maybeSingle();

    if (
        loadError ||
        !feeRecord
    ) {

        console.error(
            "FEE LOAD ERROR:",
            loadError
        );

        alert(
            "Unable to load fee record."
        );

        return;
    }

    // ==========================================
    // CURRENT VALUES
    // ==========================================

    const totalFee =
        Number(
            feeRecord.fee_amount || 0
        );

    const alreadyPaid =
        Number(
            feeRecord.paid_amount || 0
        );

    const remaining =
        Math.max(
            totalFee - alreadyPaid,
            0
        );

    // ==========================================
    // ALREADY PAID
    // ==========================================

    if (remaining <= 0) {

        alert(
            "This fee is already fully Paid. ✅"
        );

        return;
    }

    // ==========================================
    // ASK PAYMENT AMOUNT
    // ==========================================

    const paymentInput =
        prompt(
            "Enter payment amount.\n\n" +
            "Total Fee: Rs. " +
            totalFee.toLocaleString() +
            "\nAlready Paid: Rs. " +
            alreadyPaid.toLocaleString() +
            "\nRemaining: Rs. " +
            remaining.toLocaleString()
        );

    if (
        paymentInput === null
    ) {
        return;
    }

    const paymentAmount =
        Number(paymentInput);

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
        !Number.isFinite(paymentAmount) ||
        paymentAmount <= 0
    ) {

        alert(
            "Please enter a valid payment amount."
        );

        return;
    }

    if (
        paymentAmount > remaining
    ) {

        alert(
            "Payment cannot be greater than remaining amount.\n\n" +
            "Remaining: Rs. " +
            remaining.toLocaleString()
        );

        return;
    }

    // ==========================================
    // NEW TOTALS
    // ==========================================

    const newPaidAmount =
        alreadyPaid +
        paymentAmount;

    const newRemainingAmount =
        Math.max(
            totalFee -
            newPaidAmount,
            0
        );

    const newStatus =
        newRemainingAmount === 0
            ? "Paid"
            : "Partial";

    const paymentDate =
        new Date()
            .toISOString()
            .split("T")[0];

    // ==========================================
    // SAVE PAYMENT
    // ==========================================

    const {
        error: updateError
    } =
        await supabaseClient
            .from("fee_records")
            .update({

                paid_amount:
                    newPaidAmount,

                remaining_amount:
                    newRemainingAmount,

                status:
                    newStatus,

                payment_method:
                    "Cash",

                payment_date:
                    paymentDate

            })
            .eq(
                "id",
                String(recordId)
            );

    if (updateError) {

        console.error(
            "FEE PAYMENT UPDATE ERROR:",
            updateError
        );

        alert(
            "Fee payment could not be saved.\n\n" +
            updateError.message
        );

        return;
    }

    // ==========================================
    // REFRESH RECORDS
    // ==========================================

    await renderFeeRecords();

    // ==========================================
    // SUCCESS
    // ==========================================

    alert(
        "Payment recorded successfully! ✅\n\n" +
        "Paid Now: Rs. " +
        paymentAmount.toLocaleString() +
        "\nTotal Paid: Rs. " +
        newPaidAmount.toLocaleString() +
        "\nRemaining: Rs. " +
        newRemainingAmount.toLocaleString() +
        "\nStatus: " +
        newStatus
    );
}
// ==========================================
// FEE MANAGEMENT INITIAL LOAD + REALTIME
// SUPABASE LIVE SYNC
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // ==========================================
        // INITIAL FEE LOAD
        // ==========================================

        if (
            typeof renderFeeRecords ===
            "function"
        ) {
            await renderFeeRecords();
        }


        // ==========================================
        // SUPABASE CHECK
        // ==========================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            console.error(
                "Supabase connection is missing."
            );
            return;
        }


        // ==========================================
        // REALTIME FEE LISTENER
        // ==========================================

        supabaseClient
            .channel(
                "admin-fees-realtime"
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "fee_records"
                },
                async function () {

                    console.log(
                        "Supabase Fees changed — refreshing..."
                    );


                    // Refresh Fee Table
                    if (
                        typeof renderFeeRecords ===
                        "function"
                    ) {
                        await renderFeeRecords();
                    }


                    // Refresh Admin Dashboard
                    if (
                        typeof AdminDashboard !==
                        "undefined" &&
                        typeof AdminDashboard.refresh ===
                        "function"
                    ) {
                        await AdminDashboard.refresh();
                    }

                }
            )
            .subscribe();

    }
);
// ==========================================
// ADMIN NOTICES MANAGEMENT
// ==========================================

(function () {

// ==========================================
// GET ELEMENTS
// ==========================================

const addNoticeBtn =
document.getElementById("adminAddNoticeBtn");

const noticeForm =
document.getElementById("adminNoticeForm");

const closeNoticeForm =
document.getElementById("closeAdminNoticeForm");

const cancelNoticeBtn =
document.getElementById("cancelAdminNotice");

const saveNoticeBtn =
document.getElementById("saveAdminNotice");

let editingNoticeId = null;

const noticeTableBody =
document.getElementById("adminNoticesTableBody");

const noticeSearch =
document.getElementById("adminNoticeSearch");

const noticeAudienceFilter =
document.getElementById(
"adminNoticeAudienceFilter"
);

const noticeSort =
document.getElementById("adminNoticeSort");


// ==========================================
// OPEN NOTICE FORM
// ==========================================

if (addNoticeBtn) {

addNoticeBtn.addEventListener(
"click",
function () {

if (noticeForm) {

noticeForm.style.display =
"block";

}

}
);

}


// ==========================================
// CLOSE NOTICE FORM
// ==========================================

function closeNoticeFormBox() {

if (noticeForm) {

noticeForm.style.display =
"none";

}

}


if (closeNoticeForm) {

closeNoticeForm.addEventListener(
"click",
closeNoticeFormBox
);

}


if (cancelNoticeBtn) {

cancelNoticeBtn.addEventListener(
"click",
closeNoticeFormBox
);

}


// ==========================================
// GET NOTICES
// ==========================================

function getAdminNotices() {

return JSON.parse(
localStorage.getItem(
"adminNotices"
)
) || [];

}
// ==========================================
// SAVE / UPDATE NOTICE
// ==========================================

if (saveNoticeBtn) {

saveNoticeBtn.addEventListener(
"click",
async function () {

    const title =
        document.getElementById(
            "adminNoticeTitle"
        ).value.trim();

    const audience =
        document.getElementById(
            "adminNoticeAudience"
        ).value;

    const date =
        document.getElementById(
            "adminNoticeDate"
        ).value;

    const description =
        document.getElementById(
            "adminNoticeDescription"
        ).value.trim();


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!title) {

        alert(
            "Please enter notice title."
        );

        return;
    }


    if (!audience) {

        alert(
            "Please select audience."
        );

        return;
    }


    if (!date) {

        alert(
            "Please select notice date."
        );

        return;
    }


    if (!description) {

        alert(
            "Please enter notice description."
        );

        return;
    }


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        alert(
            "Supabase connection is missing."
        );

        return;
    }


    // ==========================================
    // NOTICE ID
    // ==========================================

const noticeId =
    editingNoticeId ||
    null;

    // ==========================================
    // SAVE TO SUPABASE
    // ==========================================

const noticeRecord = {
    title: title,

    message: description,

    target_role: audience,

    expiry_date: date,

    created_at: new Date().toISOString()
};

    const {
        data,
        error
    } =
        await supabaseClient
            .from("notices")
            .upsert(
                noticeRecord,
                {
                    onConflict:
                        "id"
                }
            )
            .select();


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        console.error(
            "SUPABASE NOTICE ERROR:",
            error
        );

        alert(
            "Notice Save Error:\n\n" +
            error.message
        );

        return;
    }

    // ==========================================
    // REFRESH
    // ==========================================

    renderAdminNotices();


    // ==========================================
    // RESET FORM
    // ==========================================

    document.getElementById(
        "adminNoticeTitle"
    ).value = "";


    document.getElementById(
        "adminNoticeAudience"
    ).value = "";


    document.getElementById(
        "adminNoticeDate"
    ).value = "";


    document.getElementById(
        "adminNoticeDescription"
    ).value = "";


    editingNoticeId =
        null;


    saveNoticeBtn.textContent =
        "💾 Save Notice";


    closeNoticeFormBox();


    alert(
        "Notice saved successfully! ✅"
    );

}
);

}
// ==========================================
// EDIT NOTICE - SUPABASE
// ==========================================

document.addEventListener(
    "click",
    async function (event) {

        const editButton =
            event.target.closest(
                ".admin-edit-notice"
            );

        if (!editButton) {
            return;
        }


        const noticeId =
            editButton.dataset.id;


        if (!noticeId) {
            return;
        }


        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            alert(
                "Supabase connection is missing."
            );

            return;
        }


        // ==========================================
        // GET NOTICE FROM SUPABASE
        // ==========================================

        const {
            data: notice,
            error
        } =
            await supabaseClient
                .from("notices")
                .select("*")
                .eq(
                    "id",
                    String(noticeId)
                )
                .maybeSingle();


        if (error) {

            console.error(
                "SUPABASE NOTICE EDIT LOAD ERROR:",
                error
            );

            alert(
                "Unable to load notice.\n\n" +
                error.message
            );

            return;
        }


        if (!notice) {

            alert(
                "Notice not found."
            );

            return;
        }


        // ==========================================
        // LOAD NOTICE INTO FORM
        // ==========================================

        document.getElementById(
            "adminNoticeTitle"
        ).value =
            notice.title || "";


        document.getElementById(
            "adminNoticeAudience"
        ).value =
            notice.target_audience || "";


        document.getElementById(
            "adminNoticeDate"
        ).value =
            notice.created_at
                ? notice.created_at.slice(0, 10)
                : "";


        document.getElementById(
            "adminNoticeDescription"
        ).value =
            notice.message || "";


        // ==========================================
        // ENABLE EDIT MODE
        // ==========================================

        editingNoticeId =
            notice.id;


        saveNoticeBtn.textContent =
            "💾 Update Notice";


        // ==========================================
        // OPEN FORM
        // ==========================================

        if (noticeForm) {

            noticeForm.style.display =
                "block";

        }

    }
);
// ==========================================
// RENDER NOTICES
// ==========================================

async function renderAdminNotices() {

if (!noticeTableBody) {
return;
}


// ==========================================
// LOAD NOTICES FROM SUPABASE
// ==========================================

if (
typeof supabaseClient ===
"undefined"
) {

console.error(
"Supabase connection is missing."
);

return;

}


const {
data: supabaseNotices,
error
} =
await supabaseClient
.from("notices")
.select("*")
.order(
"created_at",
{
ascending: false
}
);


if (error) {

console.error(
"SUPABASE NOTICE LOAD ERROR:",
error
);

noticeTableBody.innerHTML = `

<tr>

<td colspan="5">

<div class="admin-empty-state">

<h3>
❌ Unable to Load Notices
</h3>

<p>
${error.message}
</p>

</div>

</td>

</tr>

`;

return;

}


// ==========================================
// CONVERT SUPABASE DATA
// TO EXISTING FORMAT
// ==========================================

let notices =
(supabaseNotices || [])
.map(
function (notice) {

return {

id:
notice.id,

title:
notice.title || "",

 audience:
       notice.target_role || "",

date:
notice.created_at
? notice.created_at
.slice(0, 10)
: "",

description:
notice.message || ""

};

}
);

// Search

const searchText =
noticeSearch
? noticeSearch.value
.trim()
.toLowerCase()
: "";


if (searchText) {

notices =
notices.filter(
function (notice) {

return (

notice.title
    .toLowerCase()
    .includes(
        searchText
    )

||

notice.description
    .toLowerCase()
    .includes(
        searchText
    )

||

notice.audience
    .toLowerCase()
    .includes(
        searchText
    )

);

}
);

}


// Audience Filter

const selectedAudience =
noticeAudienceFilter
? noticeAudienceFilter.value
: "all";


if (
selectedAudience !==
"all"
) {

notices =
notices.filter(
function (notice) {

return (
notice.audience ===
selectedAudience
);

}
);

}


// Sort

const selectedSort =
noticeSort
? noticeSort.value
: "latest";


if (
selectedSort ===
"latest"
) {

notices.sort(
function (a, b) {

return new Date(
b.date
) - new Date(
a.date
);

}
);

}
else if (
selectedSort ===
"oldest"
) {

notices.sort(
function (a, b) {

return new Date(
a.date
) - new Date(
b.date
);

}
);

}
else if (
selectedSort ===
"title"
) {

notices.sort(
function (a, b) {

return a.title
.localeCompare(
b.title
);

}
);

}


// Empty State

if (
notices.length ===
0
) {

noticeTableBody.innerHTML = `

<tr>

<td colspan="4">

<div class="admin-empty-state">

<h3>
    📢 No Notices Yet
</h3>

<p>
    Click
    <strong>Add Notice</strong>
    to create a new notice.
</p>

</div>

</td>

</tr>

`;

}
else {

noticeTableBody.innerHTML = "";


notices.forEach(
function (notice, index) {

const row =
document.createElement(
"tr"
);


row.innerHTML = `

<td>
${index + 1}
</td>

<td>
<strong>
${escapeNoticeHTML(
notice.title
)}
</strong>
</td>

<td>
${escapeNoticeHTML(
notice.audience
)}
</td>

<td>
${formatNoticeDate(
notice.date
)}
</td>

<td class="notice-actions">

<button
type="button"
class="admin-edit-notice"
data-id="${notice.id}">
✏️ Edit
</button>

<button
type="button"
class="admin-delete-notice"
data-id="${notice.id}">
🗑️ Delete
</button>

</td>
`;
// NOTICE ACTION BUTTONS

const editButton =
row.querySelector(
    ".admin-edit-notice"
);

const deleteButton =
row.querySelector(
    ".admin-delete-notice"
);


// EDIT NOTICE
// SUPABASE LIVE DATA

if (editButton) {

editButton.addEventListener(
    "click",
    async function () {

        const noticeId =
            this.dataset.id;


        // ==========================================
        // SUPABASE CHECK
        // ==========================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            alert(
                "Supabase connection is missing."
            );

            return;
        }


        // ==========================================
        // LOAD NOTICE FROM SUPABASE
        // ==========================================

        const {
            data: notice,
            error
        } =
            await supabaseClient
                .from("notices")
                .select("*")
                .eq(
                    "id",
                    noticeId
                )
                .maybeSingle();


        if (error) {

            console.error(
                "NOTICE EDIT LOAD ERROR:",
                error
            );

            alert(
                "Notice could not be loaded.\n\n" +
                error.message
            );

            return;
        }


        if (!notice) {

            alert(
                "Notice not found."
            );

            return;
        }


        // ==========================================
        // FILL EXISTING FORM
        // ==========================================

        document.getElementById(
            "adminNoticeTitle"
        ).value =
            notice.title || "";


        document.getElementById(
            "adminNoticeAudience"
        ).value =
            notice.target_role || "";


        document.getElementById(
            "adminNoticeDate"
        ).value =
            notice.created_at
                ? notice.created_at.slice(0, 10)
                : "";


        document.getElementById(
            "adminNoticeDescription"
        ).value =
            notice.message || "";


        // ==========================================
        // STORE EDITING ID
        // ==========================================

        editingNoticeId =
            notice.id;


        // ==========================================
        // CHANGE SAVE BUTTON
        // ==========================================

        if (saveNoticeBtn) {

            saveNoticeBtn.textContent =
                "💾 Update Notice";

        }


        // ==========================================
        // OPEN NOTICE FORM
        // ==========================================

        if (noticeForm) {

            noticeForm.style.display =
                "block";

        }

    }
);

}
// DELETE NOTICE

if (deleteButton) {

    deleteButton.addEventListener(
        "click",
        async function () {

            const noticeId =
                this.dataset.id;


            if (
                !confirm(
                    "Are you sure you want to delete this notice?"
                )
            ) {
                return;
            }


            if (
                typeof supabaseClient ===
                "undefined"
            ) {

                alert(
                    "Supabase connection is missing."
                );

                return;
            }


            const {
                error
            } =
                await supabaseClient
                    .from("notices")
                    .delete()
                    .eq(
                        "id",
                        String(noticeId)
                    );


            if (error) {

                console.error(
                    "SUPABASE NOTICE DELETE ERROR:",
                    error
                );

                alert(
                    "Notice Delete Error:\n\n" +
                    error.message
                );

                return;
            }

            await renderAdminNotices();


            alert(
                "Notice deleted successfully! ✅"
            );

        }
    );

}

noticeTableBody.appendChild(
row
);

}
);

}


updateNoticeStatistics();

}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeNoticeHTML(value) {

return String(value || "")
.replace(
/&/g,
"&amp;"
)
.replace(
/</g,
"&lt;"
)
.replace(
/>/g,
"&gt;"
)
.replace(
/"/g,
"&quot;"
)
.replace(
/'/g,
"&#039;"
);

}


// ==========================================
// FORMAT DATE
// ==========================================

function formatNoticeDate(dateValue) {

if (!dateValue) {
return "—";
}


const date =
new Date(
dateValue + "T00:00:00"
);


return date.toLocaleDateString(
"en-GB",
{
day: "2-digit",
month: "short",
year: "numeric"
}
);

}


// ==========================================
// UPDATE NOTICE STATISTICS - SUPABASE
// ==========================================

async function updateNoticeStatistics() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        return;
    }


    const totalField =
        document.getElementById(
            "adminTotalNotices"
        );


    const monthlyField =
        document.getElementById(
            "adminMonthlyNotices"
        );


    const entriesField =
        document.getElementById(
            "adminNoticeEntriesText"
        );


    // ==========================================
    // LOAD NOTICES
    // ==========================================

    const {
        data: notices,
        error
    } =
        await supabaseClient
            .from("notices")
            .select(
                "id, created_at"
            );


    if (error) {

        console.error(
            "NOTICE STATISTICS ERROR:",
            error
        );

        return;
    }


    const records =
        notices || [];


    // ==========================================
    // TOTAL
    // ==========================================

    if (totalField) {

        totalField.textContent =
            records.length;

    }


    // ==========================================
    // CURRENT MONTH
    // ==========================================

    const now =
        new Date();


    const currentMonth =
        now.getMonth();


    const currentYear =
        now.getFullYear();


    const monthlyCount =
        records.filter(
            function (notice) {

                if (!notice.created_at) {
                    return false;
                }


                const date =
                    new Date(
                        notice.created_at
                    );


                return (
                    date.getMonth() ===
                    currentMonth &&
                    date.getFullYear() ===
                    currentYear
                );

            }
        ).length;


    if (monthlyField) {

        monthlyField.textContent =
            monthlyCount;

    }


    // ==========================================
    // ENTRIES
    // ==========================================

    if (entriesField) {

        entriesField.textContent =
            "Showing " +
            records.length +
            " notices";

    }

}


// ==========================================
// SEARCH
// ==========================================

if (noticeSearch) {

noticeSearch.addEventListener(
"input",
renderAdminNotices
);

}


// ==========================================
// AUDIENCE FILTER
// ==========================================

if (noticeAudienceFilter) {

noticeAudienceFilter.addEventListener(
"change",
renderAdminNotices
);

}


// ==========================================
// SORT
// ==========================================

if (noticeSort) {

noticeSort.addEventListener(
"change",
renderAdminNotices
);

}


// ==========================================
// INITIAL LOAD + REALTIME
// SUPABASE LIVE SYNC
// ==========================================

if (
    typeof renderAdminNotices ===
    "function"
) {

    renderAdminNotices();

}


if (
    typeof supabaseClient !==
    "undefined"
) {

    supabaseClient
        .channel(
            "admin-notices-realtime"
        )
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "notices"
            },
            async function () {

                console.log(
                    "Supabase Notices changed — refreshing..."
                );


                // Refresh Notices
                if (
                    typeof renderAdminNotices ===
                    "function"
                ) {

                    await renderAdminNotices();

                }


                // Refresh Student latest notice
                if (
                    typeof loadLatestAdminNotice ===
                    "function"
                ) {

                    await loadLatestAdminNotice();

                }


                // Refresh Admin Dashboard
                if (
                    typeof AdminDashboard !==
                    "undefined" &&
                    typeof AdminDashboard.refresh ===
                    "function"
                ) {

                    await AdminDashboard.refresh();

                }

            }
        )
        .subscribe();

}

})();
// ==========================================
// STUDENT DASHBOARD - LATEST NOTICE
// SUPABASE
// ==========================================

async function loadLatestAdminNotice() {

    const latestNotice =
        document.getElementById(
            "latestNotice"
        );

    if (!latestNotice) {
        return;
    }


    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection missing."
        );

        latestNotice.textContent =
            "Unable to load notices.";

        return;
    }


    // ==========================================
    // LOAD LATEST PUBLISHED NOTICE
    // ==========================================

       const {
       data: notices,
       error
   } =
       await supabaseClient
           .from("notices")
       .select(
    "id, title, message, target_role, expiry_date, created_at"
)
.gte(
    "expiry_date",
    new Date().toISOString().slice(0, 10)
)
.order(
    "created_at",
    {
        ascending: false
    }
)
.limit(1);


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        console.error(
            "STUDENT LATEST NOTICE ERROR:",
            error
        );

        latestNotice.textContent =
            "Unable to load notices.";

        return;
    }


    // ==========================================
    // EMPTY
    // ==========================================

    if (
        !notices ||
        notices.length === 0
    ) {

        latestNotice.textContent =
            "No new notices available.";

        return;
    }

const notice = notices[0];
   // ==========================================
// DISPLAY NOTICE + REAL DATE & TIME
// ==========================================

const noticeDate =
    notice.created_at
        ? new Date(
            notice.created_at
        ).toLocaleString(
            "en-PK",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            }
        )
        : "";


latestNotice.innerHTML = `
    <div class="latest-notice-content">

        <div class="latest-notice-title">
            📢 ${notice.title || "Notice"}
        </div>

        <div class="latest-notice-message">
            ${notice.message || ""}
        </div>

        ${
            noticeDate
                ? `
                    <div class="latest-notice-time">
                        🕐 ${noticeDate}
                    </div>
                `
                : ""
        }

    </div>
`;


    // ==========================================
    // DEBUG
    // ==========================================

  

}

// ==========================================
// LOAD NOTICE
// ==========================================

document.addEventListener(
"DOMContentLoaded",
function () {

loadLatestAdminNotice();

}
);

// ==========================================
// FIX - HIDE TEACHER MODAL ON PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

const teacherModal =
document.getElementById("adminTeacherModal");

if (teacherModal) {
teacherModal.style.display = "none";
}

});
// ==========================================
// SETTINGS - INSTITUTION INFO
// ==========================================

const editInstitutionInfoBtn =
document.getElementById("editInstitutionInfoBtn");

const institutionInfoModal =
document.getElementById("institutionInfoModal");

const closeInstitutionInfoModal =
document.getElementById("closeInstitutionInfoModal");

const cancelInstitutionInfoBtn =
document.getElementById("cancelInstitutionInfoBtn");


// ==========================================
// OPEN MODAL
// ==========================================

if (editInstitutionInfoBtn) {

editInstitutionInfoBtn.addEventListener(
"click",
function () {

institutionInfoModal.style.display = "flex";

}
);

}


// ==========================================
// CLOSE MODAL
// ==========================================

function closeInstitutionModal() {

institutionInfoModal.style.display = "none";

}


if (closeInstitutionInfoModal) {

closeInstitutionInfoModal.addEventListener(
"click",
closeInstitutionModal
);

}


if (cancelInstitutionInfoBtn) {

cancelInstitutionInfoBtn.addEventListener(
"click",
closeInstitutionModal
);

}


// ==========================================
// CLOSE WHEN CLICKING OUTSIDE
// ==========================================

if (institutionInfoModal) {

institutionInfoModal.addEventListener(
"click",
function (event) {

if (
event.target ===
institutionInfoModal
) {

closeInstitutionModal();

}

}
);

}
// ==========================================
// SETTINGS - EMAIL
// ==========================================

const editEmailSettingsBtn =
document.getElementById("editEmailSettingsBtn");

const emailSettingsModal =
document.getElementById("emailSettingsModal");

const closeEmailSettingsModal =
document.getElementById("closeEmailSettingsModal");

const cancelEmailSettingsBtn =
document.getElementById("cancelEmailSettingsBtn");


// ==========================================
// OPEN EMAIL SETTINGS MODAL
// ==========================================

if (editEmailSettingsBtn) {

editEmailSettingsBtn.addEventListener(
"click",
function () {

emailSettingsModal.style.display = "flex";

}
);

}


// ==========================================
// CLOSE EMAIL SETTINGS MODAL
// ==========================================

function closeEmailModal() {

if (emailSettingsModal) {

emailSettingsModal.style.display = "none";

}

}


if (closeEmailSettingsModal) {

closeEmailSettingsModal.addEventListener(
"click",
closeEmailModal
);

}


if (cancelEmailSettingsBtn) {

cancelEmailSettingsBtn.addEventListener(
"click",
closeEmailModal
);

}


// ==========================================
// CLOSE WHEN CLICKING OUTSIDE
// ==========================================

if (emailSettingsModal) {

emailSettingsModal.addEventListener(
"click",
function (event) {

if (event.target === emailSettingsModal) {

closeEmailModal();

}

}
);

}
// ==========================================
// SAVE EMAIL SETTINGS
// ==========================================

const saveEmailSettingsBtn =
document.getElementById("saveEmailSettingsBtn");

const newSettingsEmail =
document.getElementById("newSettingsEmail");

const settingsPhoneInput =
document.getElementById("settingsPhoneInput");

const settingsUpdatedEmailValue =
document.getElementById("settingsUpdatedEmailValue");

const settingsPhoneValue =
document.getElementById("settingsPhoneValue");


if (saveEmailSettingsBtn) {

saveEmailSettingsBtn.addEventListener(
"click",
function () {

const newEmail =
newSettingsEmail.value.trim();

const phoneNumber =
settingsPhoneInput.value.trim();


// Email validation

if (newEmail !== "") {

const emailPattern =
/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(newEmail)) {

alert("Please enter a valid email address.");

return;

}

}


// Phone validation

if (phoneNumber === "") {

alert("Please enter phone number.");

return;

}


// Update card

if (settingsUpdatedEmailValue) {

settingsUpdatedEmailValue.textContent =
newEmail;

}


if (settingsPhoneValue) {

settingsPhoneValue.textContent =
phoneNumber;

}


// Save data

localStorage.setItem(
"adminEmailSettings",
JSON.stringify({
email: newEmail,
phone: phoneNumber
})
);


// Close popup

closeEmailModal();

}
);

}
// ==========================================
// LOAD SAVED EMAIL SETTINGS
// ==========================================

function loadEmailSettings() {

const savedSettings =
JSON.parse(
localStorage.getItem("adminEmailSettings")
);

if (!savedSettings) {
return;
}


const updatedEmail =
document.getElementById(
"settingsUpdatedEmailValue"
);

const phoneValue =
document.getElementById(
"settingsPhoneValue"
);


if (updatedEmail && savedSettings.email) {

updatedEmail.textContent =
savedSettings.email;

}


if (phoneValue && savedSettings.phone) {

phoneValue.textContent =
savedSettings.phone;

}

}


// Load saved settings
loadEmailSettings();
// ==========================================
// SETTINGS - CHANGE PASSWORD MODAL
// ==========================================

const changePasswordBtn =
document.getElementById("changePasswordBtn");

const changePasswordModal =
document.getElementById("changePasswordModal");

const closeChangePasswordModal =
document.getElementById("closeChangePasswordModal");

const cancelChangePasswordBtn =
document.getElementById("cancelChangePasswordBtn");


// ==========================================
// OPEN PASSWORD MODAL
// ==========================================

if (changePasswordBtn) {

changePasswordBtn.addEventListener(
"click",
function () {

changePasswordModal.style.display = "flex";

}
);

}


// ==========================================
// CLOSE PASSWORD MODAL
// ==========================================

function closePasswordModal() {

if (changePasswordModal) {

changePasswordModal.style.display = "none";

}

}


if (closeChangePasswordModal) {

closeChangePasswordModal.addEventListener(
"click",
closePasswordModal
);

}


if (cancelChangePasswordBtn) {

cancelChangePasswordBtn.addEventListener(
"click",
closePasswordModal
);

}


// ==========================================
// CLOSE WHEN CLICKING OUTSIDE
// ==========================================

if (changePasswordModal) {

changePasswordModal.addEventListener(
"click",
function (event) {

if (event.target === changePasswordModal) {

closePasswordModal();

}

}
);

}
// ==========================================
// SAVE NEW ADMIN PASSWORD
// ==========================================

const currentAdminUsername =
document.getElementById("currentAdminUsername");

const newAdminUsername =
document.getElementById("newAdminUsername");

const currentAdminPassword =
document.getElementById("currentAdminPassword");

const newAdminPassword =
document.getElementById("newAdminPassword");

const confirmAdminPassword =
document.getElementById("confirmAdminPassword");

const saveNewPasswordBtn =
document.getElementById("saveNewPasswordBtn");

if (saveNewPasswordBtn) {

saveNewPasswordBtn.addEventListener(
"click",
async function () {

const currentUsername =
currentAdminUsername.value.trim();

const newUsername =
newAdminUsername.value.trim();

const currentPassword =
currentAdminPassword.value.trim();

const newPassword =
newAdminPassword.value.trim();

const confirmPassword =
confirmAdminPassword.value.trim();


// Check required fields

if (
currentUsername === "" ||
newUsername === "" ||
currentPassword === "" ||
newPassword === "" ||
confirmPassword === ""
) {

alert("Please fill all credential fields.");

return;

}


// Get current Administrator account

const adminAccount =
JSON.parse(
localStorage.getItem("adminAccount")
);

if (!adminAccount) {
alert("Administrator account not found.");
return;
}


// Verify current credentials from Supabase

const { data: currentAdmin, error: verifyError } =
await supabaseClient
    .from("admins")
    .select("*")
    .eq("id", adminAccount.id)
    .limit(1);


if (
verifyError ||
!currentAdmin ||
currentAdmin.length === 0
) {

alert(
"Administrator account could not be verified."
);

return;

}


const existingAdmin =
currentAdmin[0];


// Verify current username

if (
String(existingAdmin.username || "")
.trim()
.toLowerCase() !==
currentUsername.toLowerCase()
) {

alert("Current username is incorrect.");

return;

}


// Verify current password

if (
String(existingAdmin.password || "") !==
currentPassword
) {

alert("Current password is incorrect.");

return;

}


// Check new password length

if (newPassword.length < 6) {

alert(
"New password must contain at least 6 characters."
);

return;

}


// Confirm new password

if (newPassword !== confirmPassword) {

alert(
"New password and confirm password do not match."
);

return;

}


// Check if new username already exists

const { data: duplicateAdmin, error: duplicateError } =
await supabaseClient
    .from("admins")
    .select("id")
    .ilike("username", newUsername)
    .neq("id", adminAccount.id)
    .limit(1);


if (duplicateError) {

console.error(
"ADMIN USERNAME CHECK ERROR:",
duplicateError
);

alert(
"Unable to check username:\n" +
duplicateError.message
);

return;

}


if (
duplicateAdmin &&
duplicateAdmin.length > 0
) {

alert(
"This username is already in use. Please choose another username."
);

return;

}


// Update Administrator credentials in Supabase

const { error: updateError } =

await supabaseClient

    .from("admins")

    .update({

        username: newUsername,

        password: newPassword

    })

    .ilike("username", currentUsername);


if (updateError) {

console.error(
"ADMIN CREDENTIAL UPDATE ERROR:",
updateError
);

alert(
"Credentials update failed:\n" +
updateError.message
);

return;

}


// Update current laptop session

adminAccount.username =
newUsername;

adminAccount.password =
newPassword;


localStorage.setItem(
"adminAccount",
JSON.stringify(adminAccount)
);

localStorage.setItem(
"adminPassword",
newPassword
);


// Clear fields

currentAdminUsername.value = "";
newAdminUsername.value = "";
currentAdminPassword.value = "";
newAdminPassword.value = "";
confirmAdminPassword.value = "";


// Close popup

closePasswordModal();


alert(
"Administrator username and password updated successfully. ✅"
);

}
);

}
// ==========================================
// ADMIN FORGOT PASSWORD VISIBILITY
// ==========================================

const loginRole =
document.getElementById("loginRole");

const adminForgotPasswordBox =
document.getElementById("adminForgotPasswordBox");


function updateAdminForgotPassword() {

if (
loginRole &&
adminForgotPasswordBox
) {

if (
loginRole.value === "administrator"
) {

adminForgotPasswordBox.style.display =
"block";

} else {

adminForgotPasswordBox.style.display =
"none";

}

}

}


// Role change hone par

if (loginRole) {

loginRole.addEventListener(
"change",
updateAdminForgotPassword
);

}


// Page load par bhi check

updateAdminForgotPassword();


// ==========================================
// ADMIN PASSWORD RECOVERY MODAL
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const forgotLink =
            event.target.closest(
                "#adminForgotPasswordLink"
            );

        if (!forgotLink) {
            return;
        }

        event.preventDefault();

        const modal =
            document.getElementById(
                "adminPasswordRecoveryModal"
            );

        if (!modal) {

            console.error(
                "adminPasswordRecoveryModal not found"
            );

            return;
        }

        modal.style.setProperty(
            "display",
            "flex",
            "important"
        );

        modal.style.setProperty(
            "visibility",
            "visible",
            "important"
        );

        modal.style.setProperty(
            "opacity",
            "1",
            "important"
        );

        modal.style.setProperty(
            "z-index",
            "99999999",
            "important"
        );

        document.body.style.overflow =
            "hidden";

        console.log(
            "Admin Password Recovery Modal opened ✅"
        );
    }
);

// =========================================================
// EDUPORTAL - NEW ADMINISTRATOR DASHBOARD
// SUPABASE LIVE DATA
// =========================================================

(function () {

    "use strict";

    // =====================================================
    // ADMIN DASHBOARD ELEMENT
    // =====================================================

    const adminDashboard =
        document.getElementById("adminDashboard");

    if (!adminDashboard) {
        return;
    }


    // =====================================================
    // SUPABASE CHECK
    // =====================================================

    if (
        typeof supabaseClient === "undefined"
    ) {
        console.error(
            "Admin Dashboard: Supabase connection not found."
        );
        return;
    }


    // =====================================================
    // ADMIN DASHBOARD STATE
    // =====================================================

    const AdminDashboard = {

        students: [],
        teachers: [],
        attendance: [],
        results: [],
        subjects: [],
        fees: [],
        assignments: [],
        notices: [],


        // =================================================
        // LOAD ALL DATA
        // =================================================

        async loadData() {

            try {

                const [
                    studentsResult,
                    teachersResult,
                    attendanceResult,
                    resultsResult,
                    subjectsResult,
                    feesResult,
                    assignmentsResult,
                    noticesResult
                ] = await Promise.all([

                    supabaseClient
                        .from("students")
                        .select("*")
                        .order(
                            "id",
                            {
                                ascending: false
                            }
                        ),

                    supabaseClient
                        .from("teachers")
                        .select("*")
                        .order(
                            "id",
                            {
                                ascending: false
                            }
                        ),

                    supabaseClient
                        .from("attendance")
                        .select("*")
                        .order(
                            "id",
                            {
                                ascending: false
                            }
                        ),

                    supabaseClient
                        .from("results")
                        .select("*")
                        .order(
                            "id",
                            {
                                ascending: false
                            }
                        ),

                    supabaseClient
                        .from("subjects")
                        .select("*")
                        .order(
                            "id",
                            {
                                ascending: false
                            }
                        ),

                    supabaseClient
                        .from("fee_records")
                        .select("*")
                        .order(
                            "created_at",
                            {
                                ascending: false
                            }
                        ),

                    supabaseClient
                        .from("assignments")
                        .select("*")
                        .order(
                            "id",
                            {
                                ascending: false
                            }
                        ),

                    supabaseClient
                        .from("notices")
                        .select("*")
                        .order(
                            "id",
                            {
                                ascending: false
                            }
                        )

                ]);


                // =========================================
                // STUDENTS
                // =========================================

                if (!studentsResult.error) {

                    this.students =
                        studentsResult.data || [];

                }
                else {

                    console.warn(
                        "Admin Students:",
                        studentsResult.error
                    );

                    this.students = [];

                }


                // =========================================
                // TEACHERS
                // =========================================

                if (!teachersResult.error) {

                    this.teachers =
                        teachersResult.data || [];

                }
                else {

                    console.warn(
                        "Admin Teachers:",
                        teachersResult.error
                    );

                    this.teachers = [];

                }


                // =========================================
                // ATTENDANCE
                // =========================================

                if (!attendanceResult.error) {

                    this.attendance =
                        attendanceResult.data || [];

                }
                else {

                    console.warn(
                        "Admin Attendance:",
                        attendanceResult.error
                    );

                    this.attendance = [];

                }


                // =========================================
                // RESULTS
                // =========================================

                if (!resultsResult.error) {

                    this.results =
                        resultsResult.data || [];

                }
                else {

                    console.warn(
                        "Admin Results:",
                        resultsResult.error
                    );

                    this.results = [];

                }


                // =========================================
                // SUBJECTS
                // =========================================

                if (!subjectsResult.error) {

                    this.subjects =
                        subjectsResult.data || [];

                }
                else {

                    console.warn(
                        "Admin Subjects:",
                        subjectsResult.error
                    );

                    this.subjects = [];

                }


                // =========================================
                // FEES
                // =========================================

                if (!feesResult.error) {

                    this.fees =
                        feesResult.data || [];

                }
                else {

                    console.warn(
                        "Admin Fees:",
                        feesResult.error
                    );

                    this.fees = [];

                }


                // =========================================
                // ASSIGNMENTS
                // =========================================

                if (!assignmentsResult.error) {

                    this.assignments =
                        assignmentsResult.data || [];

                }
                else {

                    console.warn(
                        "Admin Assignments:",
                        assignmentsResult.error
                    );

                    this.assignments = [];

                }


                // =========================================
                // NOTICES
                // =========================================

                if (!noticesResult.error) {

                    this.notices =
                        noticesResult.data || [];

                }
                else {

                    console.warn(
                        "Admin Notices:",
                        noticesResult.error
                    );

                    this.notices = [];

                }


                // =========================================
                // UPDATE DASHBOARD
                // =========================================

                this.updateDashboard();

            }
            catch (error) {

                console.error(
                    "NEW ADMIN DASHBOARD ERROR:",
                    error
                );

            }

        },


        // =================================================
        // UPDATE DASHBOARD CARDS
        // =================================================

        updateDashboard() {

            // =============================================
            // TOTAL STUDENTS
            // =============================================

            const totalStudents =
                this.students.length;

            const studentElements = [

                "adminTotalStudents",
                "adminAnalyticsStudents",
                "analyticsTotalStudents",
                "studentsChartValue"

            ];

            studentElements.forEach(
                function (id) {

                    const element =
                        document.getElementById(id);

                    if (element) {

                        element.textContent =
                            totalStudents;

                    }

                }
            );


            // =============================================
            // TOTAL TEACHERS
            // =============================================

            const totalTeachers =
                this.teachers.length;

           const teacherElements = [

    "adminTotalTeachers",
    "adminAnalyticsTeachers",
    "analyticsTotalTeachers"

];

            teacherElements.forEach(
                function (id) {

                    const element =
                        document.getElementById(id);

                    if (element) {

                        element.textContent =
                            totalTeachers;

                    }

                }
            );


    // =============================================
// DASHBOARD DATE FILTER
// =============================================

const dashboardDateInput =
    document.getElementById(
        "adminDashboardDate"
    );

const selectedDashboardDate =
    dashboardDateInput &&
    dashboardDateInput.value
        ? dashboardDateInput.value
        : new Date()
            .toISOString()
            .split("T")[0];


// =============================================
// ATTENDANCE FOR SELECTED DATE
// =============================================

const todayAttendance =
    this.attendance.filter(
        function (record) {

            const date =
                record.attendance_date ||
                record.attendanceDate ||
                record.date ||
                "";

            return String(date)
                .substring(0, 10) ===
                selectedDashboardDate;

        }
    );


            let present = 0;
            let absent = 0;


            todayAttendance.forEach(
                function (record) {

                    const status =
                        String(
                            record.status || ""
                        )
                        .trim()
                        .toLowerCase();


                    if (
                        status === "present" ||
                        status === "p"
                    ) {

                        present++;

                    }


                    if (
                        status === "absent" ||
                        status === "a"
                    ) {

                        absent++;

                    }

                }
            );


            const attendanceTotal =
                present + absent;


            const attendancePercentage =
                attendanceTotal > 0
                    ? Math.round(
                        (
                            present /
                            attendanceTotal
                        ) * 100
                    )
                    : 0;


        const attendanceElements = [
    "adminAttendance",
    "adminAnalyticsAttendance",
    "attendanceDonutValue"
];

attendanceElements.forEach(
    function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                attendancePercentage + "%";

        }

    }
);


// =============================================
// TODAY ATTENDANCE TOP CARD
// SHOW PRESENT STUDENTS COUNT
// =============================================

const todayAttendanceElement =
    document.getElementById(
        "analyticsAttendance"
    );

if (todayAttendanceElement) {

    todayAttendanceElement.textContent =
        present;

}


     


            const presentElement =
                document.getElementById(
                    "attendancePresentCount"
                );


            if (presentElement) {

                presentElement.textContent =
                    present;

            }


            const absentElement =
                document.getElementById(
                    "attendanceAbsentCount"
                );


            if (absentElement) {

                absentElement.textContent =
                    absent;

            }


            const attendanceProgress =
                document.getElementById(
                    "adminAttendanceProgress"
                );


            if (attendanceProgress) {

                attendanceProgress.style.width =
                    attendancePercentage + "%";

            }


            // =============================================
            // RESULTS
            // =============================================

            let resultPercentageTotal = 0;

            let passed = 0;

            let failed = 0;


            this.results.forEach(
                function (result) {

                    let percentage =
                        Number(
                            result.percentage
                        );


                    if (
                        !Number.isFinite(
                            percentage
                        )
                    ) {

                        const marks =
                            Number(
                                result.marks ??
                                result.obtained_marks ??
                                0
                            );


                        const totalMarks =
                            Number(
                                result.total_marks ??
                                0
                            );


                        percentage =
                            totalMarks > 0
                                ? (
                                    marks /
                                    totalMarks
                                ) * 100
                                : 0;

                    }


                    percentage =
                        Math.max(
                            0,
                            Math.min(
                                100,
                                percentage
                            )
                        );


                    resultPercentageTotal +=
                        percentage;


                    if (percentage >= 40) {

                        passed++;

                    }
                    else {

                        failed++;

                    }

                }
            );


            const averageResult =
                this.results.length > 0
                    ? Math.round(
                        resultPercentageTotal /
                        this.results.length
                    )
                    : 0;


            const resultElements = [

                "analyticsAverageResult",
                "resultsPerformanceValue"

            ];


            resultElements.forEach(
                function (id) {

                    const element =
                        document.getElementById(id);

                    if (element) {

                        element.textContent =
                            averageResult + "%";

                    }

                }
            );


            const passedElement =
                document.getElementById(
                    "passedCount"
                );


            if (passedElement) {

                passedElement.textContent =
                    passed;

            }


            const failedElement =
                document.getElementById(
                    "failedCount"
                );


            if (failedElement) {

                failedElement.textContent =
                    failed;

            }


            // =============================================
            // SUBJECTS
            // =============================================

            const totalSubjects =
                this.subjects.length;


            const subjectElements = [

                "adminTotalSubjects",
                "adminAnalyticsSubjects",
                "subjectsChartValue"

            ];


            subjectElements.forEach(
                function (id) {

                    const element =
                        document.getElementById(id);

                    if (element) {

                        element.textContent =
                            totalSubjects;

                    }

                }
            );


     


     // =============================================
// FEES - REAL SUPABASE COLLECTION
// =============================================

let totalFees = 0;
let paidFees = 0;

(this.fees || []).forEach(
    function (fee) {

        const feeAmount =
            Number(fee.fee_amount || 0);

        const paidAmount =
            Number(fee.paid_amount || 0);

        if (Number.isFinite(feeAmount)) {
            totalFees += feeAmount;
        }

        if (Number.isFinite(paidAmount)) {
            paidFees += paidAmount;
        }

    }
);

// Never allow paid amount to exceed total
paidFees = Math.min(
    paidFees,
    totalFees
);

// Pending amount
const pendingFees =
    Math.max(
        0,
        totalFees - paidFees
    );

// Collection percentage
const feeRate =
    totalFees > 0
        ? Math.min(
            100,
            Math.round(
                (paidFees / totalFees) * 100
            )
        )
        : 0;


// =============================================
// TOP CARD - TOTAL COLLECTIONS
// =============================================

const collectedElement =
    document.getElementById(
        "analyticsTotalCollected"
    );

if (collectedElement) {

    collectedElement.textContent =
        "Rs. " +
        paidFees.toLocaleString();

}


// =============================================
// FEE COLLECTION CARD - COLLECTED
// =============================================

const feeCollectedElement =
    document.getElementById(
        "feeCollectedAmount"
    );

if (feeCollectedElement) {

    feeCollectedElement.textContent =
        "Rs. " +
        paidFees.toLocaleString();

}


// =============================================
// FEE COLLECTION CARD - TOTAL FEE
// =============================================

const feeTotalElement =
    document.getElementById(
        "feeTotalAmount"
    );

if (feeTotalElement) {

    feeTotalElement.textContent =
        "Rs. " +
        totalFees.toLocaleString();

}


// =============================================
// FEE COLLECTION CARD - RATE
// =============================================

const feeRateElement =
    document.getElementById(
        "feeCollectionRate"
    );

if (feeRateElement) {

    feeRateElement.textContent =
        feeRate + "%";

}


// =============================================
// FEE COLLECTION PROGRESS BAR
// =============================================

const feeProgress =
    document.getElementById(
        "feeProgressBar"
    );

if (feeProgress) {

    feeProgress.style.width =
        feeRate + "%";

}


// =============================================
// PENDING FEE
// =============================================

const pendingFeeElement =
    document.getElementById(
        "adminPendingFees"
    );

if (pendingFeeElement) {

    pendingFeeElement.textContent =
        "Rs. " +
        pendingFees.toLocaleString();

}


// =============================================
// OLD ANALYTICS FEE FIELD
// =============================================

const analyticsFeeElement =
    document.getElementById(
        "adminAnalyticsFees"
    );

if (analyticsFeeElement) {

    analyticsFeeElement.textContent =
        "Rs. " +
        pendingFees.toLocaleString();

}
            // =============================================
            // OTHER COUNTS
            // =============================================

            const assignmentElement =
                document.getElementById(
                    "adminTotalAssignments"
                );


            if (assignmentElement) {

                assignmentElement.textContent =
                    this.assignments.length;

            }


            const noticeElement =
                document.getElementById(
                    "adminTotalNotices"
                );


            if (noticeElement) {

                noticeElement.textContent =
                    this.notices.length;

            }


            // =============================================
            // LAST UPDATED
            // =============================================

            const lastUpdated =
                document.getElementById(
                    "adminLastUpdated"
                );


            if (lastUpdated) {

                lastUpdated.textContent =
                    new Date()
                        .toLocaleTimeString();

            }

        }

    };


    // =====================================================
    // GLOBAL ACCESS
    // =====================================================

    window.AdminDashboard =
        AdminDashboard;


// =====================================================
// ADMIN DASHBOARD DATE FILTER
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const dashboardDate =
            document.getElementById(
                "adminDashboardDate"
            );

        // Default date = Today
        if (dashboardDate) {

            dashboardDate.value =
                new Date()
                    .toISOString()
                    .split("T")[0];

        }

        // Load dashboard
        AdminDashboard.loadData();

    }
);


// =====================================================
// DASHBOARD DATE CHANGE
// =====================================================

document.addEventListener(
    "change",
    function (event) {

        if (
            event.target &&
            event.target.id ===
                "adminDashboardDate"
        ) {

            AdminDashboard.loadData();

        }

    }
);
    // =====================================================
    // ADMIN DASHBOARD OPEN
    // =====================================================

    document.addEventListener(
        "click",
        function (event) {

            const menu =
                event.target.closest(
                    "#adminDashboardMenu"
                );


            if (!menu) {

                return;

            }


            setTimeout(
                function () {

                    AdminDashboard.loadData();

                },
                100
            );

        }
    );


    // =====================================================
    // SUPABASE REAL-TIME
    // =====================================================

    const adminRealtimeChannel =
        supabaseClient
            .channel(
                "admin-dashboard-live-sync"
            )


            // =============================================
            // STUDENTS
            // =============================================

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "students"
                },
                function () {

                    queueEduPortalRealtimeRefresh();

                }
            )


            // =============================================
            // TEACHERS
            // =============================================

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "teachers"
                },
                function () {

                    queueEduPortalRealtimeRefresh();

                }
            )


            // =============================================
            // ATTENDANCE
            // =============================================

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "attendance"
                },
                function () {

                    queueEduPortalRealtimeRefresh();

                }
            )


            // =============================================
            // RESULTS
            // =============================================

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "results"
                },
                function () {

                    queueEduPortalRealtimeRefresh();

                }
            )


            // =============================================
            // SUBJECTS
            // =============================================

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "subjects"
                },
                function () {

                    queueEduPortalRealtimeRefresh();

                }
            )


            // =============================================
            // FEES
            // =============================================

        .on(
    "postgres_changes",
    {
        event: "*",
        schema: "public",
        table: "fee_records"
    },
    function () {

        console.log(
            "Admin Dashboard Fees changed — refreshing..."
        );

        queueEduPortalRealtimeRefresh();

    }
)

            // =============================================
            // ASSIGNMENTS
            // =============================================

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "assignments"
                },
                function () {

                    queueEduPortalRealtimeRefresh();

                }
            )


            // =============================================
            // NOTICES
            // =============================================

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "notices"
                },
                function () {

                    queueEduPortalRealtimeRefresh();

                }
            )


            .subscribe(
                function (status) {

                    console.log(
                        "Admin Live Sync:",
                        status
                    );

                }
            );


})();


// ==========================================
// ADMIN USER MANAGEMENT
// ADD STUDENT + ADD TEACHER
// FINAL OPEN HANDLER
// ==========================================

document.addEventListener(
    "click",
    async function (event) {

        // ==========================================
        // ADD NEW STUDENT
        // ==========================================

        const addStudentButton =
            event.target.closest(
                "#adminAddStudentBtn"
            );

        if (addStudentButton) {

closeAllAdminUserModals();

            const studentModal =

            
                document.getElementById(
                    "adminAddStudentModal"
                );


            if (!studentModal) {

                console.error(
                    "adminAddStudentModal not found."
                );

                alert(
                    "Add Student window could not be opened."
                );

                return;
            }


            // ==========================================
            // RESET STUDENT FORM
            // ==========================================

            const studentForm =
                studentModal.querySelector(
                    "form"
                );


            if (studentForm) {
                studentForm.reset();
            }


            // ==========================================
            // OPEN STUDENT MODAL
            // ==========================================

            studentModal.style.display =
                "flex";

            studentModal.style.position =
                "fixed";

            studentModal.style.inset =
                "0";

            studentModal.style.width =
                "100vw";

            studentModal.style.height =
                "100vh";

            studentModal.style.zIndex =
                "9999999";

            studentModal.style.alignItems =
                "center";

            studentModal.style.justifyContent =
                "center";


            // ==========================================
            // GENERATE NEXT STUDENT ID
            // ==========================================

            const studentIdField =
                document.getElementById(
                    "adminNewStudentId"
                );


            if (
                studentIdField &&
                typeof generateAdminStudentId ===
                    "function"
            ) {

                studentIdField.value =
                    "Generating...";


                try {

                    const newStudentId =
                        await generateAdminStudentId();


                    studentIdField.value =
                        newStudentId;


                } catch (error) {

                    console.error(
                        "Student ID generation error:",
                        error
                    );


                    studentIdField.value =
                        "EDU-0001";

                }

            }


            // ==========================================
            // GENERATE USERNAME AFTER RESET
            // ==========================================

            if (
                typeof generateAdminStudentUsername ===
                "function"
            ) {

                generateAdminStudentUsername();

            }


            return;
        }


        // ==========================================
        // ADD NEW TEACHER
        // ==========================================

        const addTeacherButton =
            event.target.closest(
                "#adminUsersAddTeacherBtn, #adminAddTeacherBtn"
            );


        if (addTeacherButton) {

             closeAllAdminUserModals();
            const teacherModal =

           
                document.getElementById(
                    "adminTeacherModal"
                );


            if (!teacherModal) {

                console.error(
                    "adminTeacherModal not found."
                );

                alert(
                    "Add Teacher window could not be opened."
                );

                return;
            }


            // ==========================================
            // RESET TEACHER FORM
            // ==========================================

            const teacherForm =
                document.getElementById(
                    "adminTeacherForm"
                );


            if (teacherForm) {
                teacherForm.reset();
            }


            // ==========================================
            // CLEAR IMPORTANT FIELDS
            // ==========================================

            const teacherEmail =
                document.getElementById(
                    "adminTeacherEmail"
                );


            const teacherPassword =
                document.getElementById(
                    "adminTeacherPassword"
                );


            const teacherUsername =
                document.getElementById(
                    "adminTeacherUsername"
                );


            if (teacherEmail) {
                teacherEmail.value = "";
            }


            if (teacherPassword) {
                teacherPassword.value = "";
            }


            if (teacherUsername) {
                teacherUsername.value = "";
            }


            // ==========================================
            // OPEN TEACHER MODAL
            // ==========================================

            teacherModal.style.setProperty(
    "display",
    "flex",
    "important"
);

           teacherModal.style.setProperty(
    "position",
    "fixed",
    "important"
);

            teacherModal.style.inset =
                "0";

            teacherModal.style.width =
                "100vw";

            teacherModal.style.height =
                "100vh";

           teacherModal.style.setProperty(
    "z-index",
    "99999999",
    "important"
);

            teacherModal.style.alignItems =
                "center";

            teacherModal.style.justifyContent =
                "center";


            return;
        }

    }
);
// ==========================================
// TEACHER PASSWORD SHOW / HIDE - FIXED
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const passwordInput =
        document.getElementById("adminTeacherPassword");

    const passwordToggle =
        document.getElementById("toggleAdminTeacherPassword");

    if (!passwordInput || !passwordToggle) {
        console.warn(
            "Teacher password field or toggle button not found."
        );
        return;
    }

    passwordToggle.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            passwordToggle.textContent = "🙈";
            passwordToggle.title = "Hide Password";

        } else {

            passwordInput.type = "password";

            passwordToggle.textContent = "👁️";
            passwordToggle.title = "Show Password";

        }

    });

});
// ==========================================
// AUTO GENERATE TEACHER USERNAME
// SUPABASE LIVE DATA
// ==========================================

async function generateAdminTeacherUsername() {

    const nameField =
        document.getElementById(
            "adminTeacherName"
        );

    const usernameField =
        document.getElementById(
            "adminTeacherUsername"
        );

    if (!nameField || !usernameField) {
        return;
    }

    const name =
        nameField.value.trim().toLowerCase();

    if (name === "") {
        usernameField.value = "";
        return;
    }

    const cleanName =
        name.replace(/[^a-z0-9]/g, "");

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        return;
    }

    const {
        data: teachers,
        error
    } =
        await supabaseClient
            .from("teachers")
            .select("teacher_id");

    if (error) {

        console.error(
            "TEACHER USERNAME GENERATION ERROR:",
            error
        );

        return;
    }

    let highestNumber = 0;

    (teachers || []).forEach(
        function (teacher) {

            const id =
                teacher.teacher_id ||
                "";

            const match =
                String(id).match(
                    /TCH-(\d+)/
                );

            if (match) {

                const number =
                    parseInt(
                        match[1],
                        10
                    );

                if (
                    number >
                    highestNumber
                ) {
                    highestNumber =
                        number;
                }

            }

        }
    );

    const nextNumber =
        highestNumber + 1;

    usernameField.value =
        cleanName +
        String(nextNumber).padStart(
            4,
            "0"
        );
}
// ==========================================
// UPDATE TEACHER USERNAME WHEN NAME CHANGES
// ==========================================

document.addEventListener(
    "input",
    function (event) {

        if (
            event.target.id ===
            "adminTeacherName"
        ) {

            generateAdminTeacherUsername();

        }

    }
);
// ==========================================
// USER MANAGEMENT STATUS TOGGLE
// SUPABASE LIVE STATUS UPDATE
// ==========================================

async function toggleUserManagementStatus(index) {

    if (typeof supabaseClient === "undefined") {
        alert("Supabase connection is missing.");
        return;
    }

    const studentsResult = await supabaseClient
        .from("students")
        .select("id, status")
        .order("created_at", { ascending: false });

    if (studentsResult.error) {
        console.error("STUDENT STATUS LOAD ERROR:", studentsResult.error);
        alert("Unable to load student records.");
        return;
    }

    const students = studentsResult.data || [];

    // -------------------------------
    // STUDENT
    // -------------------------------

    if (index < students.length) {

        const student = students[index];

        if (!student || !student.id) {
            alert("Student record not found.");
            return;
        }

        const newStatus =
            (student.status || "Active") === "Active"
                ? "Disabled"
                : "Active";

        const { error } = await supabaseClient
            .from("students")
            .update({
                status: newStatus
            })
            .eq("id", student.id);

        if (error) {
            console.error("STUDENT STATUS UPDATE ERROR:", error);
            alert("Student status update failed.");
            return;
        }

        await renderUserManagementStudents();
        return;
    }

    // -------------------------------
    // TEACHER
    // -------------------------------

    const teachersResult = await supabaseClient
        .from("teachers")
        .select("id, status")
        .order("created_at", { ascending: false });

    if (teachersResult.error) {
        console.error("TEACHER STATUS LOAD ERROR:", teachersResult.error);
        alert("Unable to load teacher records.");
        return;
    }

    const teachers = teachersResult.data || [];

    const teacherIndex = index - students.length;
    const teacher = teachers[teacherIndex];

    if (!teacher || !teacher.id) {
        alert("Teacher record not found.");
        return;
    }

    const newStatus =
        (teacher.status || "Active") === "Active"
            ? "Disabled"
            : "Active";

    const { error } = await supabaseClient
        .from("teachers")
        .update({
            status: newStatus
        })
        .eq("id", teacher.id);

    if (error) {
        console.error("TEACHER STATUS UPDATE ERROR:", error);
        alert("Teacher status update failed.");
        return;
    }

    await renderUserManagementStudents();
}


// =========================================================
// STUDENT CARDS
// =========================================================

function renderTeacherStudentCards(
    students
) {

    const container =
        document.getElementById(
            "teacherStudentsList"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!students.length) {

        container.innerHTML = `

            <div class="teacher-no-students">

                <div>
                    🎓
                </div>

                <h3>
                    No Students Found
                </h3>

                <p>
                    No students are currently assigned
                    to your class.
                </p>

            </div>

        `;

        return;
    }


    students.forEach(
        function(student, index) {

            const card =
                document.createElement("div");

            card.className =
                "teacher-student-card";


            const status =
                student.status ||
                "Active";


            const statusClass =
                status === "Active"
                    ? "active"
                    : "disabled";


            card.innerHTML = `

                <div class="teacher-student-card-top">

                    <div class="teacher-student-avatar">

                        ${
                            (student.fullName || "S")
                                .charAt(0)
                                .toUpperCase()
                        }

                    </div>

                    <span
                        class="
                            teacher-student-status
                            ${statusClass}
                        ">

                        ${status}

                    </span>

                </div>


                <div class="teacher-student-info">

                    <h3>
                        ${student.fullName || "—"}
                    </h3>

                    <p class="teacher-student-id">
                        ${student.studentId || "—"}
                    </p>


                    <div class="teacher-student-details">

                        <div>

                            <span>
                                Class
                            </span>

                            <strong>
                                ${
                                    student.studentClass
                                    ? "Class " +
                                      student.studentClass
                                    : "—"
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Section
                            </span>

                            <strong>
                                ${
                                    student.section ||
                                    "—"
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Roll No.
                            </span>

                            <strong>
                                ${
                                    student.rollNumber ||
                                    "—"
                                }
                            </strong>

                        </div>


                        <div>

                            <span>
                                Username
                            </span>

                            <strong>
                                ${
                                    student.username ||
                                    "—"
                                }
                            </strong>

                        </div>

                    </div>

                </div>


                <button
                    type="button"
                    class="teacher-view-student-btn"
                    data-student-id="${student.id}">

                    👁️ View Student

                </button>

            `;


            container.appendChild(card);

        }
    );

}

// =========================================================
// TEACHER - VIEW STUDENT
// SUPABASE LIVE DATA
// =========================================================

document.addEventListener(
    "click",
    async function (event) {

        const button =
            event.target.closest(
                ".teacher-view-student-btn"
            );

        if (!button) {
            return;
        }

        const studentId =
            button.dataset.studentId;

        if (!studentId) {
            return;
        }

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            alert(
                "Supabase connection is missing."
            );

            return;
        }

        const {
            data: student,
            error
        } =
            await supabaseClient
                .from("students")
                .select("*")
                .eq(
                    "id",
                    studentId
                )
                .maybeSingle();

        if (error) {

            console.error(
                "TEACHER VIEW STUDENT ERROR:",
                error
            );

            alert(
                "Student could not be loaded.\n\n" +
                error.message
            );

            return;
        }

        if (!student) {

            alert(
                "Student record not found."
            );

            return;
        }

        // =====================================
        // FILL STUDENT INFORMATION
        // =====================================

        const fields = {

            viewStudentName:
                student.name ||
                student.full_name ||
                "—",

            viewStudentStatus:
                student.status ||
                "—",

            viewStudentId:
                student.student_id ||
                student.id ||
                "—",

            viewStudentFather:
                student.father_name ||
                "—",

            viewStudentClass:
                student.student_class
                    ? "Class " +
                      student.student_class
                    : "—",

            viewStudentSection:
                student.section ||
                "—",

            viewStudentRoll:
                student.roll_number ||
                "—",

            viewStudentDOB:
                student.date_of_birth ||
                "—",

            viewStudentEmail:
                student.email ||
                "—",

            viewStudentMobile:
                student.mobile ||
                "—"
        };

        Object.keys(fields).forEach(
            function (id) {

                const element =
                    document.getElementById(
                        id
                    );

                if (element) {

                    element.textContent =
                        fields[id];

                }

            }
        );

        // =====================================
        // OPEN MODAL
        // =====================================

        const modal =
            document.getElementById(
                "adminViewStudentModal"
            );

        if (modal) {

            modal.style.display =
                "flex";

        }

    }
);
// =========================================================
// TEACHER ATTENDANCE REALTIME
// =========================================================

let teacherAttendanceRealtimeChannel = null;

function initializeTeacherAttendanceRealtime() {

    if (
        typeof supabaseClient === "undefined" ||
        teacherAttendanceRealtimeChannel
    ) {
        return;
    }

    teacherAttendanceRealtimeChannel =
        supabaseClient
            .channel("teacher-attendance-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "attendance"
                },
                async function(payload) {

                    console.log(
                        "TEACHER ATTENDANCE REALTIME UPDATE:",
                        payload
                    );

                    await loadTeacherAttendanceSection();

                }
            )
            .subscribe(function(status) {

                console.log(
                    "TEACHER ATTENDANCE REALTIME:",
                    status
                );

            });

}
// =========================================================
// TEACHER ATTENDANCE - LOAD SECTION
// SUPABASE LIVE DATA
// =========================================================

async function loadTeacherAttendanceSection() {

    const tableBody =
        document.getElementById(
            "teacherAttendanceTableBody"
        );

    if (!tableBody) {
        return;
    }

    // =========================================
    // GET LOGGED-IN TEACHER
    // =========================================

    const teacher =
        JSON.parse(
            localStorage.getItem(
                "loggedInTeacher"
            )
        ) || {};

    // =========================================
    // SUPABASE CHECK
    // =========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection is missing."
        );

        return;
    }

    // =========================================
    // LOAD STUDENTS
    // =========================================

    const {
        data: students,
        error
    } =
        await supabaseClient
            .from("students")
            .select("*");

    if (error) {

        console.error(
            "TEACHER ATTENDANCE STUDENTS ERROR:",
            error
        );

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#ef4444;
                    "
                >
                    Unable to load students.
                </td>
            </tr>
        `;

        return;
    }

    // =========================================
    // TEACHER CLASS
    // =========================================

    const teacherClass =
        String(
            teacher.teacherClass ||
            teacher.teacher_class ||
            teacher.class ||
            teacher.assigned_class ||
            teacher.student_class ||
            ""
        )
        .trim()
        .toLowerCase()
        .replace(/^class\s*/i, "");

    // =========================================
    // ONLY TEACHER'S CLASS STUDENTS
    // =========================================

    const assignedStudents =
        (students || []).filter(
            function (student) {

                const studentClass =
                    String(
                        student.student_class ||
                        ""
                    )
                    .trim()
                    .toLowerCase()
                    .replace(/^class\s*/i, "");

                if (!teacherClass) {
                    return false;
                }

                return (
                    studentClass ===
                    teacherClass
                );

            }
        );

    // =========================================
    // SHOW CLASS
    // =========================================

    const classElement =
        document.getElementById(
            "teacherAttendanceClass"
        );

    if (classElement) {

        classElement.textContent =
            teacher.teacherClass ||
            "Not Assigned";

    }

    // =========================================
    // DATE
    // =========================================

    const dateInput =
        document.getElementById(
            "teacherAttendanceDate"
        );

    if (
        dateInput &&
        !dateInput.value
    ) {

        dateInput.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }

    // =========================================
    // TODAY
    // =========================================

    const today =
        new Date().toLocaleDateString(
            "en-CA"
        );

    // =========================================
    // STUDENT IDS
    // =========================================

    const assignedStudentIds =
        assignedStudents.map(
            function(student) {
                return String(student.id);
            }
        );

    // =========================================
    // LOAD TODAY ATTENDANCE
    // =========================================

    let todayAttendance = [];

    if (
        assignedStudentIds.length > 0
    ) {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("attendance")
                .select(`
                    student_id,
                    status,
                    check_in_time,
                    check_out_time
                `)
                .eq(
                    "attendance_date",
                    today
                )
                .in(
                    "student_id",
                    assignedStudentIds
                );

        if (error) {

            console.error(
                "TODAY ATTENDANCE ERROR:",
                error
            );

        } else {

            todayAttendance =
                data || [];

        }

    }

    // =========================================
    // ATTENDANCE MAP
    // =========================================

    const attendanceMap =
        new Map();

    todayAttendance.forEach(
        function(record) {

            attendanceMap.set(
                String(record.student_id),
                record
            );

        }
    );

    // =========================================
    // CLEAR TABLE
    // =========================================

    tableBody.innerHTML = "";

    // =========================================
    // NO STUDENTS
    // =========================================

    if (
        assignedStudents.length ===
        0
    ) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:50px;
                        color:#64748b;
                    "
                >
                    🎓
                    <br><br>
                    No students found
                    for your class.
                </td>
            </tr>
        `;

        updateTeacherAttendanceCounts();

        return;
    }

    // =========================================
    // RENDER STUDENTS
    // =========================================

    assignedStudents.forEach(
        function(
            student,
            index
        ) {

            const attendance =
                attendanceMap.get(
                    String(student.id)
                );

            const status =
                attendance?.status ||
                "Absent";

            const normalizedStatus =
                String(status)
                    .trim()
                    .toLowerCase();

            const statusClass =
                normalizedStatus ===
                "present"
                    ? "present"
                    : normalizedStatus ===
                      "late"
                        ? "late"
                        : "absent";

            const checkInTime =
                attendance?.check_in_time
                    ? new Date(
                        attendance.check_in_time
                    ).toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )
                    : "—";

            const checkOutTime =
                attendance?.check_out_time
                    ? new Date(
                        attendance.check_out_time
                    ).toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )
                    : "—";

            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${
                            student.name ||
                            student.full_name ||
                            "—"
                        }
                    </strong>
                </td>

                <td>
                    ${
                        student.student_id ||
                        student.id ||
                        "—"
                    }
                </td>

                <td>
                    ${
                        student.student_class
                            ? "Class " +
                              student.student_class
                            : "—"
                    }
                </td>

                <td>

                    <span
                        class="
                            teacher-attendance-status-badge
                            ${statusClass}
                        "
                        data-status="${status}"
                    >
                        ${status}
                    </span>

                </td>

                <td
                    class="teacher-check-in-cell"
                >

                    <strong>
                        ${checkInTime}
                    </strong>

                    ${
                        checkOutTime !==
                        "—"
                            ? `
                                <small
                                    style="
                                        display:block;
                                        margin-top:4px;
                                        opacity:.65;
                                    "
                                >
                                    Out:
                                    ${checkOutTime}
                                </small>
                              `
                            : ""
                    }

                </td>

            `;

            tableBody.appendChild(
                row
            );

        }
    );

    // =========================================
    // LOAD SAVED ATTENDANCE
    // =========================================

    loadSavedTeacherAttendance();

    // =========================================
    // REALTIME
    // =========================================

    initializeTeacherAttendanceRealtime();

}

// =========================================================
// TEACHER DASHBOARD — ATTENDANCE COUNTS
// =========================================================

function updateTeacherAttendanceCounts() {

    const tableBody =
        document.getElementById(
            "teacherAttendanceTableBody"
        );

    let present = 0;
    let absent = 0;
    let late = 0;

    if (tableBody) {

        const badges =
            tableBody.querySelectorAll(
                ".teacher-attendance-status-badge"
            );

        badges.forEach(function (badge) {

            const status =
                String(
                    badge.dataset.status ||
                    badge.textContent ||
                    ""
                )
                .trim()
                .toLowerCase();

            if (
                status === "present" ||
                status === "p"
            ) {
                present++;
            }

            else if (
                status === "absent" ||
                status === "a"
            ) {
                absent++;
            }

            else if (
                status === "late" ||
                status === "l"
            ) {
                late++;
            }

        });
    }


    // =====================================================
    // TOTAL MARKED
    // =====================================================

    const totalMarked =
        present +
        absent +
        late;


    // =====================================================
    // ATTENDANCE PERCENTAGE
    // =====================================================

    const attendancePercentage =
        totalMarked > 0
            ? Math.round(
                (
                    present /
                    totalMarked
                ) * 100
            )
            : 0;


    // =====================================================
    // UPDATE PRESENT
    // =====================================================

    const presentElement =
        document.getElementById(
            "teacherPresentCount"
        );

    if (presentElement) {

        presentElement.textContent =
            present;
    }


    // =====================================================
    // UPDATE ABSENT
    // =====================================================

    const absentElement =
        document.getElementById(
            "teacherAbsentCount"
        );

    if (absentElement) {

        absentElement.textContent =
            absent;
    }


    // =====================================================
    // UPDATE LATE
    // =====================================================

    const lateElement =
        document.getElementById(
            "teacherLateCount"
        );

    if (lateElement) {

        lateElement.textContent =
            late;
    }


    // =====================================================
    // UPDATE ATTENDANCE PERCENTAGE
    // =====================================================

    const percentageElement =
        document.getElementById(
            "teacherAttendanceToday"
        );

    if (percentageElement) {

        percentageElement.textContent =
            attendancePercentage + "%";
    }


    // =====================================================
    // UPDATE OPTIONAL DASHBOARD ELEMENTS
    // =====================================================

    const percentageElement2 =
        document.getElementById(
            "teacherAttendancePercentage"
        );

    if (
        percentageElement2 &&
        percentageElement2 !== percentageElement
    ) {

        percentageElement2.textContent =
            attendancePercentage + "%";
    }

}
// =========================================================
// EDU PORTAL - GET LOGGED IN TEACHER FROM SUPABASE
// =========================================================

async function getLoggedInTeacherFromSupabase() {

    // -----------------------------------------
    // GET LOCAL LOGIN SESSION
    // -----------------------------------------

    const loggedInTeacher =
        JSON.parse(
            localStorage.getItem(
                "loggedInTeacher"
            )
        ) || {};


    if (
        !loggedInTeacher ||
        Object.keys(loggedInTeacher).length === 0
    ) {

        console.error(
            "No logged-in teacher session found."
        );

        return null;
    }


    // -----------------------------------------
    // SUPABASE CHECK
    // -----------------------------------------

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection missing."
        );

        return null;
    }


    let teacher = null;


    // =========================================
    // 1. DATABASE ID
    // =========================================

    if (loggedInTeacher.id) {

        const result =
            await supabaseClient
                .from("teachers")
                .select("*")
                .eq(
                    "id",
                    loggedInTeacher.id
                )
                .maybeSingle();


        if (
            !result.error &&
            result.data
        ) {

            teacher =
                result.data;
        }
    }


    // =========================================
    // 2. TEACHER ID
    // =========================================

    if (
        !teacher &&
        (
            loggedInTeacher.teacherId ||
            loggedInTeacher.teacher_id
        )
    ) {

        const teacherId =
            String(
                loggedInTeacher.teacherId ||
                loggedInTeacher.teacher_id
            ).trim();


        if (teacherId) {

            const result =
                await supabaseClient
                    .from("teachers")
                    .select("*")
                    .eq(
                        "teacher_id",
                        teacherId
                    )
                    .maybeSingle();


            if (
                !result.error &&
                result.data
            ) {

                teacher =
                    result.data;
            }
        }
    }


    // =========================================
    // 3. USERNAME
    // =========================================

    if (
        !teacher &&
        loggedInTeacher.username
    ) {

        const username =
            String(
                loggedInTeacher.username
            ).trim();


        const result =
            await supabaseClient
                .from("teachers")
                .select("*")
                .ilike(
                    "username",
                    username
                )
                .limit(1);


        if (
            !result.error &&
            result.data &&
            result.data.length > 0
        ) {

            teacher =
                result.data[0];
        }
    }


    // =========================================
    // 4. EMAIL
    // =========================================

    if (
        !teacher &&
        loggedInTeacher.email
    ) {

        const email =
            String(
                loggedInTeacher.email
            ).trim();


        const result =
            await supabaseClient
                .from("teachers")
                .select("*")
                .ilike(
                    "email",
                    email
                )
                .limit(1);


        if (
            !result.error &&
            result.data &&
            result.data.length > 0
        ) {

            teacher =
                result.data[0];
        }
    }


    // =========================================
    // NOT FOUND
    // =========================================

    if (!teacher) {

        console.error(
            "Teacher not found in Supabase.",
            loggedInTeacher
        );

        return null;
    }


    // =========================================
    // UPDATE SESSION WITH REAL DB DATA
    // =========================================

    const updatedTeacher = {

        ...loggedInTeacher,

        id:
            teacher.id,

        teacherId:
            teacher.teacher_id,

        teacher_id:
            teacher.teacher_id,

        name:
            teacher.name ||
            loggedInTeacher.name ||
            "Teacher",

        fullName:
            teacher.name ||
            loggedInTeacher.fullName ||
            "Teacher",

        email:
            teacher.email ||
            loggedInTeacher.email ||
            "",

        phone:
            teacher.phone ||
            loggedInTeacher.phone ||
            "",

        subject:
            teacher.subject ||
            loggedInTeacher.subject ||
            "",

        teacherClass:
            teacher.teacher_class ||
            loggedInTeacher.teacherClass ||
            "",

        qualification:
            teacher.qualification ||
            loggedInTeacher.qualification ||
            "",

        joiningDate:
            teacher.joining_date ||
            loggedInTeacher.joiningDate ||
            "",
            academicSession:
    teacher.academic_session ||
    teacher.session ||
    loggedInTeacher.academicSession ||
    loggedInTeacher.academic_session ||
    loggedInTeacher.session ||
    "",

        username:
            teacher.username ||
            loggedInTeacher.username ||
            "",

        password:
            teacher.password ||
            loggedInTeacher.password ||
            "",

        status:
            teacher.status ||
            "Active"

    };


    localStorage.setItem(
        "loggedInTeacher",
        JSON.stringify(
            updatedTeacher
        )
    );


    console.log(
        "Logged-in teacher loaded from Supabase:",
        teacher
    );


    return teacher;
}

// =========================================================
// OPEN TEACHER ATTENDANCE
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const menu =
            event.target.closest(
                "#teacherAttendanceMenu"
            );


        if (!menu) {
            return;
        }


        setTimeout(function() {

            loadTeacherAttendanceSection();

        }, 50);

    }
);
// =========================================================
// DATE CHANGE
// =========================================================

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target.id ===
            "teacherAttendanceDate"
        ) {

            loadSavedTeacherAttendance();

        }

    }
);
// =========================================================
// LOAD SAVED ATTENDANCE
// SUPABASE + CHECK-IN TIME
// =========================================================

async function loadSavedTeacherAttendance() {

    const dateInput =
        document.getElementById(
            "teacherAttendanceDate"
        );

    if (
        !dateInput ||
        !dateInput.value
    ) {
        return;
    }

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        return;
    }

    const date =
        dateInput.value;


    const groups =
        document.querySelectorAll(
            "#teacherAttendanceTableBody " +
            ".teacher-attendance-buttons"
        );


    if (!groups.length) {
        updateTeacherAttendanceCounts();
        return;
    }


    const studentIds =
        Array.from(groups)
            .map(function(group) {

                return Number(
                    group.dataset.studentId
                );

            })
            .filter(function(id) {

                return Number.isFinite(id);

            });


    if (!studentIds.length) {
        updateTeacherAttendanceCounts();
        return;
    }


    // =========================================
    // LOAD ATTENDANCE FROM SUPABASE
    // =========================================

    const {
        data: attendanceRecords,
        error
    } =
        await supabaseClient
            .from("attendance")
            .select(
                "student_id, status, check_in_time"
            )
            .in(
                "student_id",
                studentIds
            )
            .eq(
                "attendance_date",
                date
            );


    if (error) {

        console.error(
            "TEACHER ATTENDANCE LOAD ERROR:",
            error
        );

        return;
    }


    const attendanceMap =
        new Map();


    (attendanceRecords || [])
        .forEach(function(record) {

            attendanceMap.set(
                Number(
                    record.student_id
                ),
                record
            );

        });


    // =========================================
    // APPLY STATUS + CHECK-IN TIME
    // =========================================

 groups.forEach(
    function(group) {

        const studentId =
            Number(
                group.dataset.studentId
            );

        const record =
            attendanceMap.get(
                studentId
            );

        const status =
            record &&
            record.status
                ? String(
                    record.status
                  ).trim()
                : "Not Marked";

        const statusClass =
            status
                .toLowerCase()
                .replace(
                    /\s+/g,
                    "-"
                );

        let checkInTime = "—";

        if (
            record &&
            record.check_in_time
        ) {

            checkInTime =
                new Date(
                    record.check_in_time
                ).toLocaleTimeString(
                    "en-PK",
                    {
                        timeZone:
                            "Asia/Karachi",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    }
                );
        }

        group.innerHTML = `
            <span
                class="
                    teacher-attendance-status-badge
                    ${statusClass}
                "
                data-status="${status}"
            >
                ${status}
            </span>
        `;

        const row =
            group.closest("tr");

        if (row) {

            const checkInElement =
                row.querySelector(
                    ".teacher-check-in-time"
                );

            if (checkInElement) {

                checkInElement.textContent =
                    checkInTime;

            }

        }

    }
);

        

    updateTeacherAttendanceCounts();

}
// =========================================================
// TEACHER - MY STUDENTS
// =========================================================

async function loadTeacherMyStudents() {

    const tableBody =
        document.getElementById(
            "teacherStudentsTableBody"
        );

    const grid =
        document.getElementById(
            "teacherStudentsGrid"
        ) ||
        document.querySelector(
            ".teacher-students-grid"
        );

    if (!tableBody && !grid) {
        console.warn(
            "Teacher students container not found"
        );
        return;
    }

    // =========================================
    // GET LOGGED-IN TEACHER
    // =========================================

    let teacher = {};

    try {

        teacher =
            JSON.parse(
                localStorage.getItem(
                    "loggedInTeacher"
                )
            ) || {};

    } catch (error) {

        console.error(
            "Teacher session error:",
            error
        );

        return;
    }

    // =========================================
    // SUPABASE CHECK
    // =========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection is missing."
        );

        return;
    }

    // =========================================
    // GET CURRENT TEACHER FROM SUPABASE
    // =========================================

    let dbTeacher = null;

    // Find by database ID
    if (teacher.id) {

        const result =
            await supabaseClient
                .from("teachers")
                .select(
                    "id, teacher_id, name, username, teacher_class, section, status"
                )
                .eq(
                    "id",
                    teacher.id
                )
                .maybeSingle();

        if (
            !result.error &&
            result.data
        ) {

            dbTeacher =
                result.data;
        }
    }

    // Find by teacher_id
    if (
        !dbTeacher &&
        (
            teacher.teacherId ||
            teacher.teacher_id
        )
    ) {

        const teacherId =
            String(
                teacher.teacherId ||
                teacher.teacher_id
            ).trim();

        const result =
            await supabaseClient
                .from("teachers")
                .select(
                    "id, teacher_id, name, username, teacher_class, section, status"
                )
                .eq(
                    "teacher_id",
                    teacherId
                )
                .maybeSingle();

        if (
            !result.error &&
            result.data
        ) {

            dbTeacher =
                result.data;
        }
    }

    // Find by username
    if (
        !dbTeacher &&
        teacher.username
    ) {

        const result =
            await supabaseClient
                .from("teachers")
                .select(
                    "id, teacher_id, name, username, teacher_class, section, status"
                )
                .ilike(
                    "username",
                    String(
                        teacher.username
                    ).trim()
                )
                .limit(1);

        if (
            !result.error &&
            result.data &&
            result.data.length > 0
        ) {

            dbTeacher =
                result.data[0];
        }
    }

    // Teacher not found
    if (!dbTeacher) {

        console.error(
            "Teacher not found in Supabase:",
            teacher
        );

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        style="
                            text-align:center;
                            padding:40px;
                            color:#ef4444;
                        "
                    >
                        Teacher account could not be verified.
                    </td>
                </tr>
            `;
        }

        return;
    }

    // =========================================
    // GET TEACHER CLASS
    // =========================================

    const teacherClass =
        String(
            dbTeacher.teacher_class ||
            teacher.teacherClass ||
            teacher.teacher_class ||
            ""
        )
        .trim()
        .toLowerCase()
        .replace(
            /^class\s*/i,
            ""
        );

    // =========================================
    // CLASS MUST EXIST
    // =========================================

    if (!teacherClass) {

        console.error(
            "No class assigned to teacher:",
            dbTeacher
        );

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        style="
                            text-align:center;
                            padding:50px;
                            color:#64748b;
                        "
                    >
                        No class is assigned to this teacher.
                    </td>
                </tr>
            `;
        }

        return;
    }

    // =========================================
    // LOAD STUDENTS
    // =========================================

    const {
        data: students,
        error
    } =
        await supabaseClient
            .from("students")
            .select(`
                id,
                student_id,
                name,
                student_class,
                section,
                roll_number,
                status,
                email,
                mobile,
                date_of_birth
            `)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );

    if (error) {

        console.error(
            "TEACHER STUDENTS LOAD ERROR:",
            error
        );

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        style="
                            text-align:center;
                            padding:40px;
                            color:#ef4444;
                        "
                    >
                        Unable to load students.
                    </td>
                </tr>
            `;
        }

        return;
    }

    // =========================================
    // FILTER STUDENTS BY TEACHER CLASS
    // =========================================

    const assignedStudents =
        (students || []).filter(
            function (student) {

                const studentClass =
                    String(
                        student.student_class ||
                        ""
                    )
                    .trim()
                    .toLowerCase()
                    .replace(
                        /^class\s*/i,
                        ""
                    );

                return (
                    studentClass ===
                    teacherClass
                );
            }
        );

    // =========================================
    // DEBUG
    // =========================================

    console.log(
        "TEACHER MY STUDENTS:",
        {
            teacher:
                dbTeacher.name,

            teacherId:
                dbTeacher.teacher_id,

            teacherClass:
                dbTeacher.teacher_class,

            normalizedClass:
                teacherClass,

            totalStudents:
                assignedStudents.length
        }
    );

    // =========================================
    // TOTAL STUDENTS
    // =========================================

    const totalElement =
        document.getElementById(
            "teacherStudentsTotal"
        );

    if (totalElement) {

        totalElement.textContent =
            assignedStudents.length;
    }

    // =========================================
    // RENDER TABLE
    // =========================================

    if (tableBody) {

        if (
            assignedStudents.length ===
            0
        ) {

            tableBody.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        style="
                            text-align:center;
                            padding:50px;
                            color:#64748b;
                        "
                    >
                        No students found for Class
                        ${teacherClass}.
                    </td>
                </tr>
            `;

        } else {

            tableBody.innerHTML =
                assignedStudents
                    .map(
                        function (student, index) {

                            return `
                                <tr>

                                    <td>
                                        ${index + 1}
                                    </td>

                                    <td>
                                        ${
                                            student.student_id ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        ${
                                            student.name ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        ${
                                            student.student_class ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        ${
                                            student.section ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        ${
                                            student.roll_number ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        ${
                                            student.mobile ||
                                            "-"
                                        }
                                    </td>

                                    <td>
                                        ${
                                            student.status ||
                                            "-"
                                        }
                                    </td>

                                </tr>
                            `;
                        }
                    )
                    .join("");
        }
    }

    // =========================================
    // GRID RENDER
    // =========================================

    if (grid) {

        if (
            assignedStudents.length ===
            0
        ) {

            grid.innerHTML = `
                <div
                    style="
                        text-align:center;
                        padding:50px;
                        color:#64748b;
                        width:100%;
                    "
                >
                    No students found for Class
                    ${teacherClass}.
                </div>
            `;

        } else {

            grid.innerHTML =
                assignedStudents
                    .map(
                        function (student) {

                            return `
                                <div class="student-card">

                                    <div class="student-card-name">
                                        ${
                                            student.name ||
                                            "-"
                                        }
                                    </div>

                                    <div class="student-card-info">
                                        Student ID:
                                        ${
                                            student.student_id ||
                                            "-"
                                        }
                                    </div>

                                    <div class="student-card-info">
                                        Class:
                                        ${
                                            student.student_class ||
                                            "-"
                                        }
                                    </div>

                                    <div class="student-card-info">
                                        Section:
                                        ${
                                            student.section ||
                                            "-"
                                        }
                                    </div>

                                    <div class="student-card-info">
                                        Roll No:
                                        ${
                                            student.roll_number ||
                                            "-"
                                        }
                                    </div>

                                </div>
                            `;
                        }
                    )
                    .join("");
        }
    }
}

// =========================================================
// OPEN TEACHER MY STUDENTS
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const menu =
            event.target.closest(
                "#teacherStudentsMenu"
            );


        if (!menu) {
            return;
        }


        setTimeout(
            function() {

                loadTeacherMyStudents();

            },
            50
        );

    }
);
// =========================================================
// TEACHER STUDENT SEARCH
// =========================================================

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.id !==
            "teacherStudentSearch"
        ) {
            return;
        }


        const search =
            event.target.value
                .trim()
                .toLowerCase();


        const rows =
            document.querySelectorAll(
                "#teacherStudentsTableBody tr"
            );


        rows.forEach(function(row) {

            const text =
                row.textContent
                    .toLowerCase();


            row.style.display =
                text.includes(search)
                    ? ""
                    : "none";

        });

    }
);
// =========================================================
// TEACHER - ASSIGNMENTS
// =========================================================

let teacherEditingAssignmentId = null;


// =========================================================
// LOAD TEACHER ASSIGNMENTS - SUPABASE API
// =========================================================

async function loadTeacherAssignments() {

    const list =
        document.getElementById(
            "teacherAssignmentsList"
        );

    if (!list) {
        return;
    }


    // =========================================
    // LOGGED-IN TEACHER
    // =========================================

    const teacher =
        JSON.parse(
            localStorage.getItem(
                "loggedInTeacher"
            )
        ) || {};


    const teacherId =
        teacher.id ||
        teacher.username ||
        teacher.email ||
        "";


    const teacherClass =
        teacher.teacherClass ||
        "Not Assigned";


    // =========================================
    // SUPABASE CHECK
    // =========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection is missing."
        );

        list.innerHTML = `
            <div class="teacher-assignment-empty">
                <div class="teacher-assignment-empty-icon">
                    ⚠️
                </div>

                <strong>
                    Supabase connection missing
                </strong>

                <p>
                    Unable to load assignments.
                </p>
            </div>
        `;

        return;
    }


    // =========================================
    // LOAD ASSIGNMENTS
    // =========================================

    const {
        data: supabaseAssignments,
        error
    } =
        await supabaseClient
            .from("assignments")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    // =========================================
    // API ERROR
    // =========================================

    if (error) {

        console.error(
            "TEACHER ASSIGNMENTS API ERROR:",
            error
        );

        list.innerHTML = `
            <div class="teacher-assignment-empty">

                <div class="teacher-assignment-empty-icon">
                    ❌
                </div>

                <strong>
                    Unable to load assignments
                </strong>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

        return;
    }


    // =========================================
    // CONVERT DATABASE FORMAT
    // =========================================

    const assignments =
        (supabaseAssignments || [])
            .map(
                function(assignment) {

                    return {

                        id:
                            assignment.id,

                        teacherId:
                            assignment.teacher_id,

                        teacherName:
                            assignment.teacher_name,

                        title:
                            assignment.title,

                        subject:
                            assignment.subject,

                        dueDate:
                            assignment.due_date,

                        marks:
                            assignment.marks,

                        description:
                            assignment.description,

                        className:
                            assignment.class_name,

                        status:
                            assignment.status,

                        createdAt:
                            assignment.created_at

                    };

                }
            );


// =========================================
// USE SUPABASE ASSIGNMENTS
// =========================================

const myAssignments =
    assignments.filter(
        function(assignment) {

            return String(
                assignment.teacherId
            ) === String(
                teacherId
            );

        }
    );

    // =========================================
    // CLASS
    // =========================================

    const classElement =
        document.getElementById(
            "teacherAssignmentsClass"
        );


    if (classElement) {

        classElement.textContent =
            teacherClass;

    }


    // =========================================
    // CLEAR LIST
    // =========================================

    list.innerHTML = "";


    // =========================================
    // EMPTY
    // =========================================

    if (!myAssignments.length) {

        list.innerHTML = `

            <div class="teacher-assignment-empty">

                <div
                    class="teacher-assignment-empty-icon"
                >
                    📝
                </div>

                <strong>
                    No assignments yet
                </strong>

                <p>
                    Create your first assignment
                    using the form above.
                </p>

            </div>

        `;

        return;
    }


    // =========================================
    // RENDER
    // =========================================

    myAssignments.forEach(
        function(assignment) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "teacher-assignment-item";


            item.dataset.id =
                assignment.id;


            item.innerHTML = `

                <div
                    class="
                        teacher-assignment-item-header
                    "
                >

                    <div>

                        <h4>
                            ${
                                assignment.title ||
                                "Untitled Assignment"
                            }
                        </h4>

                        <span
                            class="
                                teacher-assignment-subject
                            "
                        >
                            ${
                                assignment.subject ||
                                "General"
                            }
                        </span>

                    </div>

                </div>


                <p
                    class="
                        teacher-assignment-description
                    "
                >
                    ${
                        assignment.description ||
                        "No description provided."
                    }
                </p>


                <div
                    class="
                        teacher-assignment-meta
                    "
                >

                    <span>
                        📅 Due:
                        ${
                            assignment.dueDate ||
                            "—"
                        }
                    </span>


                    <span>
                        🎯 Marks:
                        ${
                            assignment.marks ||
                            0
                        }
                    </span>


                    <span>
                        📚 Class:
                        ${
                            assignment.className ||
                            teacherClass
                        }
                    </span>

                </div>


                <div
                    class="
                        teacher-assignment-actions
                    "
                >

                    <button
                        type="button"
                        class="
                            teacher-assignment-edit
                        "
                        data-id="${assignment.id}"
                    >
                        ✏ Edit
                    </button>


                    <button
                        type="button"
                        class="
                            teacher-assignment-delete
                        "
                        data-id="${assignment.id}"
                    >
                        🗑 Delete
                    </button>
<button
    type="button"
    class="teacher-assignment-submissions"
    data-id="${assignment.id}"
>
    📥 Student Submissions
</button>
                </div>

            `;


            list.appendChild(
                item
            );

        }
    );

}
// =========================================================
// TEACHER - VIEW / MARK STUDENT SUBMISSIONS
// =========================================================

document.addEventListener(
    "click",
    async function(event) {

        const button =
            event.target.closest(
                ".teacher-assignment-submissions"
            );

        if (!button) {
            return;
        }


        const assignmentId =
            button.dataset.id;


        if (!assignmentId) {
            console.error(
                "Assignment ID missing."
            );
            return;
        }


        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            alert(
                "Supabase connection is missing."
            );

            return;
        }


        const originalText =
            button.textContent;

        button.disabled = true;

        button.textContent =
            "Loading...";


        try {

            // ==========================================
            // LOAD SUBMISSIONS
            // ==========================================

            const {
                data: submissions,
                error: submissionError
            } =
                await supabaseClient
                    .from(
                        "assignment_submissions"
                    )
                   .select(
    "id, assignment_id, student_id, student_name, marks, teacher_feedback, status, submitted_at"
)
                    .eq(
                        "assignment_id",
                        assignmentId
                    )
                    .order(
                        "submitted_at",
                        {
                            ascending: false
                        }
                    );


            if (submissionError) {

                console.error(
                    "SUBMISSIONS LOAD ERROR:",
                    submissionError
                );

                alert(
                    "Unable to load submissions.\n\n" +
                    submissionError.message
                );

                return;
            }


            if (
                !submissions ||
                submissions.length === 0
            ) {

                alert(
                    "No student submissions yet."
                );

                return;
            }


            // ==========================================
            // GET STUDENT IDS
            // ==========================================

            const studentIds =
                [
                    ...new Set(
                        submissions
                            .map(
                                function(item) {

                                    return item.student_id;

                                }
                            )
                            .filter(
                                function(id) {

                                    return (
                                        id !== null &&
                                        id !== undefined
                                    );

                                }
                            )
                    )
                ];


            // ==========================================
            // LOAD STUDENTS
            // ==========================================

            let students = [];


            if (studentIds.length) {

                const {
                    data,
                    error: studentError
                } =
                    await supabaseClient
                        .from("students")
                        .select(
                                "id, name, full_name, student_name, student_id, roll_number"

                        )
                        .in(
                            "id",
                            studentIds
                        );


                if (studentError) {

                    console.error(
                        "STUDENT LOAD ERROR:",
                        studentError
                    );

                }
                else {

                    students =
                        data || [];

                }

            }


            // ==========================================
            // GET ASSIGNMENT MARKS
            // ==========================================

            const {
                data: assignment,
                error: assignmentError
            } =
                await supabaseClient
                    .from("assignments")
                    .select(
                        "id, title, marks"
                    )
                    .eq(
                        "id",
                        assignmentId
                    )
                    .maybeSingle();


            if (assignmentError) {

                console.error(
                    "ASSIGNMENT LOAD ERROR:",
                    assignmentError
                );

            }


            const maxMarks =
                Number(
                    assignment?.marks ||
                    0
                );


            // ==========================================
            // BUILD MODAL
            // ==========================================

            let modal =
                document.getElementById(
                    "teacherSubmissionModal"
                );


            if (modal) {
                modal.remove();
            }


            modal =
                document.createElement(
                    "div"
                );


            modal.id =
                "teacherSubmissionModal";


            modal.style.cssText = `
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,.65);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                padding: 20px;
            `;


            const box =
                document.createElement(
                    "div"
                );


            box.style.cssText = `
                background: #ffffff;
                width: min(900px, 100%);
                max-height: 90vh;
                overflow-y: auto;
                border-radius: 16px;
                padding: 25px;
                box-shadow: 0 20px 60px rgba(0,0,0,.25);
            `;


            let html = `

                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    margin-bottom:20px;
                ">

                    <div>

                        <h2 style="
                            margin:0 0 5px;
                        ">
                            📥 Student Submissions
                        </h2>

                        <small>
                            ${
                                assignment?.title ||
                                "Assignment"
                            }
                        </small>

                    </div>


                    <button
                        type="button"
                        id="closeTeacherSubmissionModal"
                        style="
                            border:none;
                            background:none;
                            font-size:24px;
                            cursor:pointer;
                        "
                    >
                        ✕
                    </button>

                </div>

            `;


            submissions.forEach(
                function(submission, index) {

                    const student =
                        students.find(
                            function(item) {

                                return String(
                                    item.id
                                ) === String(
                                    submission.student_id
                                );

                            }
                        );


                  const studentName =
    student?.name ||
    student?.full_name ||
    student?.student_name ||
    submission?.student_name ||
    student?.student_id ||
    "Unknown Student";

const rollNumber =
    student?.roll_number ||
    student?.rollNumber ||
    "—";


                    html += `

                        <div
                            style="
                                border:1px solid #e2e8f0;
                                border-radius:12px;
                                padding:18px;
                                margin-bottom:15px;
                            "
                        >

                            <div style="
                                display:flex;
                                justify-content:space-between;
                                gap:15px;
                                margin-bottom:15px;
                            ">

                               <div>
    <strong style="
        display:block;
        font-size:18px;
        margin-bottom:5px;
    ">
        ${index + 1}. ${studentName}
    </strong>

    <span style="
        font-size:13px;
        color:#64748b;
    ">
        Roll No: ${rollNumber}
    </span>
</div>

                                <span>
                                    ${
                                        submission.status ||
                                        "Submitted"
                                    }
                                </span>

                            </div>


                            <small style="
                                display:block;
                                margin-bottom:12px;
                            ">
                                Submitted:
                                ${
                                    submission.submitted_at
                                        ? new Date(
                                            submission.submitted_at
                                        ).toLocaleString()
                                        : "N/A"
                                }
                            </small>


                            <label>
                                Marks
                            </label>

                            <input
                                type="number"
                                class="teacher-submission-marks"
                                data-submission-id="${
                                    submission.id
                                }"
                                value="${
                                    submission.marks ??
                                    ""
                                }"
                                min="0"
                                ${
                                    maxMarks > 0
                                        ? `max="${maxMarks}"`
                                        : ""
                                }
                                style="
                                    width:100%;
                                    padding:10px;
                                    margin:6px 0 12px;
                                    box-sizing:border-box;
                                "
                            />


                            <label>
                                Teacher Feedback
                            </label>

                            <textarea
                                class="teacher-submission-feedback"
                                data-submission-id="${
                                    submission.id
                                }"
                                rows="3"
                                placeholder="Enter feedback..."
                                style="
                                    width:100%;
                                    padding:10px;
                                    margin:6px 0 12px;
                                    box-sizing:border-box;
                                    resize:vertical;
                                "
                            >${
                                submission.teacher_feedback ||
                                ""
                            }</textarea>


                            <button
                                type="button"
                                class="save-submission-result"
                                data-submission-id="${
                                    submission.id
                                }"
                                ${
                                    maxMarks <= 0
                                        ? ""
                                        : ""
                                }
                            >
                                💾 Save Result
                            </button>

                        </div>

                    `;

                }
            );


            box.innerHTML =
                html;


            modal.appendChild(
                box
            );


            document.body.appendChild(
                modal
            );


            // ==========================================
            // CLOSE MODAL
            // ==========================================

            document
                .getElementById(
                    "closeTeacherSubmissionModal"
                )
                ?.addEventListener(
                    "click",
                    function() {

                        modal.remove();

                    }
                );


        }
        catch (error) {

            console.error(
                "TEACHER SUBMISSIONS ERROR:",
                error
            );

            alert(
                "Unable to load submissions.\n\n" +
                error.message
            );

        }
        finally {

            button.disabled =
                false;

            button.textContent =
                originalText;

        }

    }
);


// =========================================================
// SAVE ASSIGNMENT SUBMISSION RESULT
// =========================================================

document.addEventListener(
    "click",
    async function(event) {

        const button =
            event.target.closest(
                ".save-submission-result"
            );

        if (!button) {
            return;
        }


        const submissionId =
            button.dataset.submissionId;


        if (!submissionId) {
            return;
        }


        const marksInput =
            document.querySelector(
                `.teacher-submission-marks[data-submission-id="${submissionId}"]`
            );


        const feedbackInput =
            document.querySelector(
                `.teacher-submission-feedback[data-submission-id="${submissionId}"]`
            );


        const marks =
            marksInput?.value === ""
                ? null
                : Number(
                    marksInput?.value
                );


        const feedback =
            feedbackInput?.value.trim() ||
            "";


        if (
            marks !== null &&
            (
                Number.isNaN(marks) ||
                marks < 0
            )
        ) {

            alert(
                "Please enter valid marks."
            );

            return;
        }


        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            alert(
                "Supabase connection is missing."
            );

            return;
        }


        const originalText =
            button.textContent;

        button.disabled =
            true;

        button.textContent =
            "Saving...";


        try {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from(
                        "assignment_submissions"
                    )
                    .update(
                        {
                            marks:
                                marks,

                            teacher_feedback:
                                feedback,

                            status:
                                "Graded"
                        }
                    )
                    .eq(
                        "id",
                        submissionId
                    )
                    .select()
                    .single();


            if (error) {

                console.error(
                    "ASSIGNMENT RESULT SAVE ERROR:",
                    error
                );

                alert(
                    "Unable to save result.\n\n" +
                    error.message
                );

                return;
            }

            button.textContent =
                "✅ Saved";
// Close Student Submissions modal after successful save
const submissionModal =
    document.getElementById("teacherSubmissionModal");

if (submissionModal) {
    setTimeout(function () {
        submissionModal.remove();
    }, 500);
}

            button.style.opacity =
                "0.7";


            alert(
                "Marks and feedback saved successfully! ✅"
            );

        }
        catch (error) {

            console.error(
                "ASSIGNMENT RESULT ERROR:",
                error
            );

            alert(
                "Unable to save result.\n\n" +
                error.message
            );

        }
        finally {

            if (
                button.textContent !==
                "✅ Saved"
            ) {

                button.disabled =
                    false;

                button.textContent =
                    originalText;

            }

        }

    }
);

// ==========================================
// TEACHER ASSIGNMENT CLASS + SUBJECT
// LOAD FROM ADMIN ACADEMIC ASSIGNMENT
// ==========================================

async function loadTeacherAssignmentClass() {

    const classSelect =
        document.getElementById(
            "teacherAssignmentClass"
        );

    const subjectInput =
        document.getElementById(
            "teacherAssignmentSubject"
        );

    if (!classSelect) {
        return;
    }


    // ==========================================
    // GET LOGGED-IN TEACHER
    // ==========================================

    let teacher = {};

    try {

        teacher =
            JSON.parse(
                localStorage.getItem(
                    "loggedInTeacher"
                )
            ) || {};

    }
    catch (error) {

        console.error(
            "TEACHER SESSION ERROR:",
            error
        );

        classSelect.innerHTML =
            '<option value="">Teacher Not Found</option>';

        return;
    }


    // ==========================================
    // FIND TEACHER IN SUPABASE
    // ==========================================

    let dbTeacher = null;


    // FIND BY DATABASE ID
    if (
        teacher.id &&
        !isNaN(
            Number(
                teacher.id
            )
        )
    ) {

        const result =
            await supabaseClient
                .from("teachers")
                .select(
                    "id, teacher_id, name, username, subject"
                )
                .eq(
                    "id",
                    Number(
                        teacher.id
                    )
                )
                .maybeSingle();

        if (
            !result.error &&
            result.data
        ) {

            dbTeacher =
                result.data;
        }
    }


    // FIND BY TEACHER ID
    if (
        !dbTeacher &&
        (
            teacher.teacherId ||
            teacher.teacher_id
        )
    ) {

        const teacherCode =
            String(
                teacher.teacherId ||
                teacher.teacher_id
            ).trim();

        const result =
            await supabaseClient
                .from("teachers")
                .select(
                    "id, teacher_id, name, username, subject"
                )
                .eq(
                    "teacher_id",
                    teacherCode
                )
                .maybeSingle();

        if (
            !result.error &&
            result.data
        ) {

            dbTeacher =
                result.data;
        }
    }


    // FIND BY USERNAME
    if (
        !dbTeacher &&
        teacher.username
    ) {

        const result =
            await supabaseClient
                .from("teachers")
                .select(
                    "id, teacher_id, name, username, subject"
                )
                .ilike(
                    "username",
                    String(
                        teacher.username
                    ).trim()
                )
                .maybeSingle();

        if (
            !result.error &&
            result.data
        ) {

            dbTeacher =
                result.data;
        }
    }


    // ==========================================
    // TEACHER NOT FOUND
    // ==========================================

    if (!dbTeacher) {

        classSelect.innerHTML =
            '<option value="">Teacher Not Found</option>';

        if (subjectInput) {

            subjectInput.value =
                "";

        }

        return;
    }


    // ==========================================
    // LOAD TEACHER SUBJECT
    // SUBJECT IS FIXED
    // ==========================================

    if (subjectInput) {

        subjectInput.value =
            dbTeacher.subject ||
            "";

        subjectInput.readOnly =
            true;
    }


    // ==========================================
    // LOAD ASSIGNED CLASSES
    // FROM teacher_class_subjects
    // ==========================================

    const {
        data: teacherAssignments,
        error: assignmentError
    } =
        await supabaseClient
            .from(
                "teacher_class_subjects"
            )
            .select(
                "class_id"
            )
            .eq(
                "teacher_id",
                dbTeacher.id
            );


    if (assignmentError) {

        console.error(
            "TEACHER CLASS ASSIGNMENT ERROR:",
            assignmentError
        );

        classSelect.innerHTML =
            '<option value="">Unable to Load Classes</option>';

        return;
    }


    // ==========================================
    // GET UNIQUE CLASS IDs
    // ==========================================

    const classIds =
        [
            ...new Set(
                (
                    teacherAssignments ||
                    []
                )
                    .map(
                        function(item) {
                            return item.class_id;
                        }
                    )
                    .filter(
                        function(id) {
                            return id !== null &&
                                   id !== undefined;
                        }
                    )
            )
        ];


    // ==========================================
    // NO CLASSES ASSIGNED
    // ==========================================

    if (
        classIds.length === 0
    ) {

        classSelect.innerHTML =
            '<option value="">No Class Assigned</option>';

        return;
    }


    // ==========================================
    // LOAD CLASS NAMES
    // ==========================================

    const {
        data: classes,
        error: classError
    } =
        await supabaseClient
           .from("classes")
.select(
    "id, name, section"
)
            .in(
                "id",
                classIds
            )
            .order(
                "id",
                {
                    ascending: true
                }
            );


    if (classError) {

        console.error(
            "CLASSES LOAD ERROR:",
            classError
        );

        classSelect.innerHTML =
            '<option value="">Unable to Load Classes</option>';

        return;
    }


  // ==========================================
// FILL CLASS DROPDOWN
// ==========================================

classSelect.disabled = false;

classSelect.innerHTML =
    '<option value="">Select Class</option>';

const assignedClasses =
    classes || [];

assignedClasses.forEach(
    function(item) {

        const option =
            document.createElement("option");

        option.value =
    `${item.id}|${item.name}|${item.section || ""}`;

option.textContent =
    formatClassSection(
        item.name,
        item.section
    );

option.dataset.classId =
    item.id;

option.dataset.class =
    item.name;

option.dataset.section =
    item.section || "";

        classSelect.appendChild(
            option
        );

    }
);

// Make sure dropdown is enabled
classSelect.removeAttribute("disabled");

console.log(
    "CLASS DROPDOWN OPTIONS:",
    Array.from(
        classSelect.options
    ).map(
        function(option) {
            return {
                value: option.value,
                text: option.text
            };
        }
    )
);


    console.log(
        "TEACHER ASSIGNED CLASSES:",
        classes
    );

    console.log(
        "TEACHER SUBJECT:",
        dbTeacher.subject
    );

}
// =========================================================
// CREATE ASSIGNMENT - NEW FORM
// =========================================================

document.addEventListener(
    "click",
    async function(event) {

        const button =
            event.target.closest(
                "#createTeacherAssignmentBtn"
            );

        if (!button) {
            return;
        }


        // =========================================
        // SUPABASE CHECK
        // =========================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            alert(
                "Supabase connection is missing."
            );

            return;
        }


        // =========================================
        // GET LOGGED-IN TEACHER
        // =========================================

        const teacher =
            JSON.parse(
                localStorage.getItem(
                    "loggedInTeacher"
                )
            ) || {};


        const teacherId =
    teacher.teacherId ||
    teacher.teacher_id ||
    teacher.id ||
    teacher.username ||
    teacher.email ||
    "";

        // =========================================
        // GET FORM VALUES
        // =========================================

        const className =
            document.getElementById(
                "teacherAssignmentClass"
            )?.value.trim();


        const sectionName =
            document.getElementById(
                "teacherAssignmentSection"
            )?.value.trim();


        const subject =
            document.getElementById(
                "teacherAssignmentSubject"
            )?.value.trim();


        const marks =
            document.getElementById(
                "teacherAssignmentMarks"
            )?.value;

const dueDate =
    document.getElementById(
        "assignmentDueDate"
    )?.value;

        const description =
            document.getElementById(
                "teacherAssignmentDescription"
            )?.value.trim();


        // =========================================
        // VALIDATION
        // =========================================

console.log("CLASS:", className);
console.log("SECTION:", sectionName);
console.log("SUBJECT:", subject);
console.log("MARKS:", marks);
console.log("DUE DATE:", dueDate);
console.log("DESCRIPTION:", description);

     if (
    !className ||
    !sectionName ||
    !subject ||
    !marks ||
    !dueDate ||
    !description
) {

            alert(
                "Please complete all assignment fields."
            );

            return;
        }


        // =========================================
        // FIND TEACHER
        // =========================================

  let dbTeacher = null;
let teacherError = null;

// =========================================
// 1. FIND BY SUPABASE DATABASE ID
// =========================================

if (
    teacher.id &&
    !isNaN(Number(teacher.id))
) {

    const result =
        await supabaseClient
            .from("teachers")
            .select(
                "id, teacher_id, name, username, teacher_class"
            )
            .eq(
                "id",
                Number(teacher.id)
            )
            .maybeSingle();

    if (
        !result.error &&
        result.data
    ) {
        dbTeacher =
            result.data;
    }
}


// =========================================
// 2. FIND BY TEACHER ID
// Example: TCH-0001
// =========================================

if (
    !dbTeacher &&
    (
        teacher.teacherId ||
        teacher.teacher_id
    )
) {

    const teacherCode =
        String(
            teacher.teacherId ||
            teacher.teacher_id
        ).trim();

    const result =
        await supabaseClient
            .from("teachers")
            .select(
                "id, teacher_id, name, username, teacher_class"
            )
            .eq(
                "teacher_id",
                teacherCode
            )
            .maybeSingle();

    if (
        !result.error &&
        result.data
    ) {
        dbTeacher =
            result.data;
    }
}


// =========================================
// 3. FIND BY USERNAME
// =========================================

if (
    !dbTeacher &&
    teacher.username
) {

    const result =
        await supabaseClient
            .from("teachers")
            .select(
                "id, teacher_id, name, username, teacher_class"
            )
            .ilike(
                "username",
                String(
                    teacher.username
                ).trim()
            )
            .maybeSingle();

    if (
        !result.error &&
        result.data
    ) {
        dbTeacher =
            result.data;
    }
}


     

        if (!dbTeacher) {

            alert(
                "Teacher was not found in Supabase."
            );

            return;
        }


        // =========================================
        // CREATE ASSIGNMENT DATA
        // =========================================

        const assignmentRecord = {

            teacher_id:
                dbTeacher.id,

            teacher_name:
                dbTeacher.name ||
                teacher.name ||
                teacher.fullName ||
                "Teacher",

            title:
                subject + " Assignment",

            subject:
                subject,

            marks:
                Number(marks),

            description:
                description,

            class_name:
                className,

                due_date:
    dueDate,

            status:
                "Pending",

            updated_at:
                new Date().toISOString()

        };


  // =========================================
// CREATE OR UPDATE ASSIGNMENT
// =========================================

let savedAssignment;
let assignmentError;


if (teacherEditingAssignmentId) {

    // =====================================
    // UPDATE EXISTING ASSIGNMENT
    // =====================================

    const result =
        await supabaseClient
            .from("assignments")
            .update({

                subject:
                    subject,

                marks:
                    Number(marks),

                description:
                    description,

                class_name:
                    className,

                title:
                    subject + " Assignment",

                updated_at:
                    new Date().toISOString()

            })
            .eq(
                "id",
                Number(
                    teacherEditingAssignmentId
                )
            )
            .select()
            .single();


    savedAssignment =
        result.data;

    assignmentError =
        result.error;

} else {

    // =====================================
    // CREATE NEW ASSIGNMENT
    // =====================================

    const result =
        await supabaseClient
            .from("assignments")
            .insert(
                assignmentRecord
            )
            .select()
            .single();


    savedAssignment =
        result.data;

    assignmentError =
        result.error;

}


        // =========================================
        // SAVE ERROR
        // =========================================

        if (assignmentError) {

            console.error(
                "SUPABASE ASSIGNMENT ERROR:",
                assignmentError
            );

            alert(
                "Assignment Save Error:\n\n" +
                assignmentError.message
            );

            return;
        }


        // =========================================
        // SUCCESS
        // =========================================

        console.log(
            "ASSIGNMENT CREATED:",
            savedAssignment
        );


        // =========================================
        // RESET FORM
        // =========================================

        const classInput =
            document.getElementById(
                "teacherAssignmentClass"
            );

        const sectionInput =
            document.getElementById(
                "teacherAssignmentSection"
            );

        const subjectInput =
            document.getElementById(
                "teacherAssignmentSubject"
            );

        const marksInput =
            document.getElementById(
                "teacherAssignmentMarks"
            );

        const descriptionInput =
            document.getElementById(
                "teacherAssignmentDescription"
            );


        if (classInput) {
            classInput.value = "";
        }

        if (sectionInput) {
            sectionInput.value = "";
        }

        if (subjectInput) {
            subjectInput.value = "";
        }

        if (marksInput) {
            marksInput.value = "";
        }

        if (descriptionInput) {
            descriptionInput.value = "";
        }

// =========================================
// RELOAD ASSIGNED CLASSES + SUBJECT
// =========================================

await loadTeacherAssignmentClass();
        // =========================================
        // REFRESH ASSIGNMENTS
        // =========================================

        if (
            typeof loadTeacherAssignments ===
            "function"
        ) {

            await loadTeacherAssignments();

        }

// =========================================
// RESET EDIT MODE
// =========================================

teacherEditingAssignmentId = null;

const createButtonAfterSave =
    document.getElementById(
        "createTeacherAssignmentBtn"
    );

if (createButtonAfterSave) {

    createButtonAfterSave.innerHTML =
        '<i class="fas fa-plus"></i> Create Assignment';

}

const editButtonAfterSave =
    document.getElementById(
        "teacherAssignmentEditBtn"
    );

if (editButtonAfterSave) {

    editButtonAfterSave.innerHTML =
        '<i class="fas fa-edit"></i> Edit Assignment';

}
        // =========================================
        // SUCCESS MESSAGE
        // =========================================

        alert(
            "Assignment created successfully! ✅"
        );

    }
);
// =========================================
// EDIT / DELETE ASSIGNMENT
// =========================================

document.addEventListener(
    "click",
    async function(event) {

        // =====================================
        // EDIT
        // =====================================

        const editButton =
            event.target.closest(
                ".teacher-assignment-edit"
            );

        if (editButton) {

            const assignmentId =
                editButton.dataset.id;

            if (!assignmentId) {
                alert("Assignment ID is missing.");
                return;
            }

            if (
                typeof supabaseClient ===
                "undefined"
            ) {
                alert(
                    "Supabase connection is missing."
                );
                return;
            }

            const {
                data: assignment,
                error
            } =
                await supabaseClient
                    .from("assignments")
                    .select("*")
                    .eq(
                        "id",
                        Number(assignmentId)
                    )
                    .maybeSingle();

            if (error) {
                console.error(
                    "ASSIGNMENT EDIT LOAD ERROR:",
                    error
                );

                alert(
                    "Unable to load assignment:\n\n" +
                    error.message
                );

                return;
            }

            if (!assignment) {
                alert(
                    "Assignment not found."
                );
                return;
            }

            const classInput =
                document.getElementById(
                    "teacherAssignmentClass"
                );

            const sectionInput =
                document.getElementById(
                    "teacherAssignmentSection"
                );

            const subjectInput =
                document.getElementById(
                    "teacherAssignmentSubject"
                );

            const marksInput =
                document.getElementById(
                    "teacherAssignmentMarks"

                );

const dueDateInput =
    document.getElementById(
        "teacherAssignmentDueDate"
    );

            const descriptionInput =
                document.getElementById(
                    "teacherAssignmentDescription"
                );

            if (classInput) {
                classInput.value =
                    assignment.class_name || "";
            }

            if (sectionInput) {
                sectionInput.value = "";
            }

            if (subjectInput) {
                subjectInput.value =
                    assignment.subject || "";
            }

            if (marksInput) {
                marksInput.value =
                    assignment.marks ?? "";
            }

            if (dueDateInput) {
    dueDateInput.value =
        assignment.due_date || "";
}

            if (descriptionInput) {
                descriptionInput.value =
                    assignment.description || "";
            }

            teacherEditingAssignmentId =
                assignment.id;

            const createButton =
                document.getElementById(
                    "createTeacherAssignmentBtn"
                );

            if (createButton) {
                createButton.innerHTML =
                    '<i class="fas fa-save"></i> Update Assignment';
            }

            const editFormButton =
                document.getElementById(
                    "teacherAssignmentEditBtn"
                );

            if (editFormButton) {
                editFormButton.innerHTML =
                    '<i class="fas fa-times"></i> Cancel Edit';
            }

            const assignmentSection =
                document.getElementById(
                    "teacherAssignmentsSection"
                );

            if (assignmentSection) {
                assignmentSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

            return;
        }


        // =====================================
        // DELETE
        // =====================================

        const deleteButton =
            event.target.closest(
                ".teacher-assignment-delete"
            );

        if (!deleteButton) {
            return;
        }

        const assignmentId =
            deleteButton.dataset.id;

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            alert(
                "Supabase connection is missing."
            );
            return;
        }

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this assignment?"
            );

        if (!confirmDelete) {
            return;
        }

        const {
            error: deleteError
        } =
            await supabaseClient
                .from("assignments")
                .delete()
                .eq(
                    "id",
                    Number(assignmentId)
                );

        if (deleteError) {

            console.error(
                "ASSIGNMENT DELETE ERROR:",
                deleteError
            );

            alert(
                "Unable to delete assignment:\n\n" +
                deleteError.message
            );

            return;
        }

        if (
            typeof loadTeacherAssignments ===
            "function"
        ) {
            await loadTeacherAssignments();
        }

        alert(
            "Assignment deleted successfully! ✅"
        );

    }
);
// =========================================================
// CANCEL EDIT
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        if (
            !event.target.closest(
                "#teacherAssignmentCancelBtn"
            )
        ) {
            return;
        }


        teacherEditingAssignmentId =
            null;


        const form =
            document.getElementById(
                "teacherAssignmentForm"
            );


        if (form) {
            form.reset();
        }


        const saveButton =
            document.getElementById(
                "teacherAssignmentSaveBtn"
            );


        if (saveButton) {

            saveButton.textContent =
                "➕ Create Assignment";

        }


        const cancelButton =
            document.getElementById(
                "teacherAssignmentCancelBtn"
            );


        if (cancelButton) {

            cancelButton.style.display =
                "none";

        }

    }
);



// =========================================================
// OPEN ASSIGNMENTS
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const menu =
            event.target.closest(
                "#teacherAssignmentsMenu"
            );

        if (!menu) {
            return;
        }

        setTimeout(
            async function() {

                // Load teacher's actual assigned class
                if (
                    typeof loadTeacherAssignmentClass ===
                    "function"
                ) {
                    await loadTeacherAssignmentClass();
                }

                // Load assignments
                if (
                    typeof loadTeacherAssignments ===
                    "function"
                ) {
                    await loadTeacherAssignments();
                }

            },
            50
        );

    }
);


// =========================================================
// SEARCH ASSIGNMENTS
// =========================================================

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.id !==
            "teacherAssignmentSearch"
        ) {
            return;
        }


        const search =
            event.target.value
                .trim()
                .toLowerCase();


        document
            .querySelectorAll(
                "#teacherAssignmentsList " +
                ".teacher-assignment-item"
            )
            .forEach(
                function(item) {

                    const text =
                        item.textContent
                            .toLowerCase();


                    item.style.display =
                        text.includes(search)
                            ? ""
                            : "none";

                }
            );

    }
);
// =========================================================
// TEACHER RESULTS / MARKS - SUPABASE
// =========================================================

async function loadTeacherResults() {

    const tableBody =
        document.getElementById(
            "teacherResultsTableBody"
        );

    if (!tableBody) {
        return;
    }
    // =========================================
    // PREVENT DUPLICATE LOADS
    // =========================================

    const loadId =
        Date.now() +
        Math.random();

    tableBody.dataset.loadId =
        loadId;

    // =========================================
    // LOGGED-IN TEACHER
    // =========================================

    const teacher =
        JSON.parse(
            localStorage.getItem(
                "loggedInTeacher"
            )
        ) || {};


    // =========================================
    // CHECK SUPABASE
    // =========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection is missing."
        );

        return;
    }


    // =========================================
// FIND CURRENT TEACHER IN SUPABASE
// =========================================

let dbTeacher = null;

// 1. Try database ID
if (teacher.id) {

    const result =
        await supabaseClient
            .from("teachers")
            .select(
                "id, teacher_id, name, username, teacher_class, section, status"
            )
            .eq(
                "id",
                teacher.id
            )
            .maybeSingle();

    if (!result.error && result.data) {
        dbTeacher = result.data;
    }
}


// 2. Try teacher_id
if (
    !dbTeacher &&
    (
        teacher.teacherId ||
        teacher.teacher_id
    )
) {

    const result =
        await supabaseClient
            .from("teachers")
            .select(
                "id, teacher_id, name, username, teacher_class, section, status"
            )
            .eq(
                "teacher_id",
                String(
                    teacher.teacherId ||
                    teacher.teacher_id
                )
            )
            .maybeSingle();

    if (!result.error && result.data) {
        dbTeacher = result.data;
    }
}


// 3. Try username
if (
    !dbTeacher &&
    teacher.username
) {

    const result =
        await supabaseClient
            .from("teachers")
            .select(
                "id, teacher_id, name, username, teacher_class, section, status"
            )
            .ilike(
                "username",
                teacher.username
            )
            .maybeSingle();

    if (!result.error && result.data) {
        dbTeacher = result.data;
    }
}


// =========================================
// TEACHER CLASS
// =========================================

const teacherClass =
    String(
        dbTeacher?.teacher_class ||
        teacher.teacherClass ||
        teacher.teacher_class ||
        teacher.class ||
        ""
    )
    .trim()
    .toLowerCase()
    .replace(
        /^class\s*/i,
        ""
    );


// IMPORTANT:
// Never show all students if class is missing.

if (!teacherClass) {

    console.error(
        "Teacher class not found."
    );

    tableBody.innerHTML = `
        <tr>
            <td
                colspan="7"
                style="
                    text-align:center;
                    padding:50px;
                    color:#dc2626;
                "
            >
                Teacher class is not assigned.
            </td>
        </tr>
    `;

    return;
}

    // =========================================
    // GET TEACHER CLASS
    // =========================================

  


    const classElement =
        document.getElementById(
            "teacherResultsClass"
        );


    if (classElement) {

        classElement.textContent =
            dbTeacher?.teacher_class ||
            teacher.teacherClass ||
            "Not Assigned";

    }


    // =========================================
    // LOAD STUDENTS FROM SUPABASE
    // =========================================

    const {
        data: students,
        error: studentsError
    } =
        await supabaseClient
            .from("students")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (studentsError) {

        console.error(
            "Results Students API Error:",
            studentsError
        );

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#dc2626;
                    "
                >
                    Unable to load students.
                    <br><br>
                    ${studentsError.message}
                </td>
            </tr>
        `;

        return;
    }


    // =========================================
    // FILTER TEACHER STUDENTS
    // =========================================

    const assignedStudents =
    (students || []).filter(
        function(student) {

            const studentClass =
                String(
                    student.student_class ||
                    student.studentClass ||
                    student.class ||
                    ""
                )
                .trim()
                .toLowerCase()
                .replace(
                    /^class\s*/i,
                    ""
                );

            return (
                studentClass ===
                teacherClass
            );

        }
    );
// =========================================
// REMOVE DUPLICATE STUDENTS
// =========================================

const uniqueStudents = [];
const seenStudentIds = new Set();

assignedStudents.forEach(
    function(student) {

        const uniqueId =
            String(
                student.student_id ||
                student.id
            );

        if (
            !seenStudentIds.has(
                uniqueId
            )
        ) {

            seenStudentIds.add(
                uniqueId
            );

            uniqueStudents.push(
                student
            );

        }

    }
);

    tableBody.innerHTML = "";


    if (
        !assignedStudents.length
    ) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:50px;
                        color:#64748b;
                    "
                >
                    🎓
                    <br><br>
                    No students found
                    for your assigned class.
                </td>
            </tr>
        `;

        return;
    }


    // =========================================
    // SUBJECT
    // =========================================

    const subject =
        document.getElementById(
            "teacherResultSubject"
        )?.value
            .trim() || "";


    // =========================================
    // TOTAL MARKS
    // =========================================

    const totalMarks =
        Number(
            document.getElementById(
                "teacherResultTotalMarks"
            )?.value
        ) || 0;

    // =========================================
    // LOAD RESULTS FROM SUPABASE
    // =========================================

    let resultsQuery =
        supabaseClient
            .from("results")
            .select("*");


    if (dbTeacher?.id) {

        resultsQuery =
            resultsQuery.eq(
                "teacher_id",
                dbTeacher.id
            );

    }

    const {
        data: results,
        error: resultsError
    } =
        await resultsQuery;


    if (resultsError) {

        console.error(
            "Results API Error:",
            resultsError
        );

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:40px;
                        color:#dc2626;
                    "
                >
                    Unable to load results.
                    <br><br>
                    ${resultsError.message}
                </td>
            </tr>
        `;

        return;
    }


    // =========================================
    // RENDER STUDENTS
    // =========================================

if (
    tableBody.dataset.loadId !=
    loadId
) {
    return;
}

tableBody.innerHTML = "";

    uniqueStudents.forEach(
        function(student, index) {

            const row =
                document.createElement(
                    "tr"
                );

const savedResult =
    (results || []).find(
        function(result) {

            return (
                String(result.student_id) ===
                String(student.id)
            );

        }
    );


            const savedObtained =
                savedResult
                    ? savedResult.obtained_marks
                    : "";


            const savedTotal =
                savedResult
                    ? savedResult.total_marks
                    : totalMarks;


            const percentage =
                calculateTeacherResultPercentage(
                    savedObtained,
                    savedTotal
                );


            const grade =
                calculateTeacherResultGrade(
                    percentage
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    <strong>
                        ${
                            student.full_name ||
                            student.name ||
                            "—"
                        }
                    </strong>
                </td>

                <td>
                    ${
                        student.student_id ||
                        "—"
                    }
                </td>

                <td>
                    <strong
                        class="result-total-marks"
                    >
                        ${
                            savedTotal ||
                            "—"
                        }
                    </strong>
                </td>

                <td>

                    <input
                        type="number"
                        class="teacher-obtained-marks"
                     data-student-id="${student.id}"
                        value="
                            ${savedObtained}
                        "
                        min="0"
                        ${
                            savedTotal
                                ? `max="${savedTotal}"`
                                : ""
                        }
                        placeholder="Marks"
                    >

                </td>

                <td>

                    <span
                        class="
                            teacher-result-percentage
                        "
                     data-percentage-for="${student.id}"
                    >
                        ${percentage}%
                    </span>

                </td>

                <td>

                    <span
                        class="
                            teacher-result-grade
                        "
                       data-grade-for="${student.id}"
                    >
                        ${grade}
                    </span>

                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}


// =========================================================
// CALCULATE PERCENTAGE
// =========================================================

function calculateTeacherResultPercentage(
    obtained,
    total
) {

    const obtainedMarks =
        Number(obtained);


    const totalMarks =
        Number(total);


    if (
        !totalMarks ||
        totalMarks <= 0 ||
        obtained === ""
    ) {

        return 0;

    }


    const percentage =
        (
            obtainedMarks /
            totalMarks
        ) * 100;


    return Math.round(
        percentage * 100
    ) / 100;

}


// =========================================================
// CALCULATE GRADE
// =========================================================

function calculateTeacherResultGrade(
    percentage
) {

    const marks =
        Number(percentage);


    if (marks >= 90) {
        return "A+";
    }


    if (marks >= 80) {
        return "A";
    }


    if (marks >= 70) {
        return "B";
    }


    if (marks >= 60) {
        return "C";
    }


    if (marks >= 50) {
        return "D";
    }


    if (marks > 0) {
        return "F";
    }


    return "—";

}

// =========================================================
// TEACHER SAVE RESULTS - REAL SUPABASE
// =========================================================

document.addEventListener(
    "click",
    async function(event) {

        const saveButton =
            event.target.closest(
                "#teacherSaveResultsBtn"
            );

        if (!saveButton) {
            return;
        }


        // =========================================
        // GET LOGGED-IN TEACHER
        // =========================================

        const teacher =
            JSON.parse(
                localStorage.getItem(
                    "loggedInTeacher"
                )
            ) || {};


        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            alert(
                "Supabase connection is missing."
            );

            return;
        }


        // =========================================
        // SUBJECT
        // =========================================

        const subject =
            document.getElementById(
                "teacherResultSubject"
            )?.value
                .trim() || "";


        if (!subject) {

            alert(
                "Please select or enter a subject."
            );

            return;
        }


        // =========================================
        // TOTAL MARKS
        // =========================================

        const totalMarks =
            Number(
                document.getElementById(
                    "teacherResultTotalMarks"
                )?.value
            );


        if (
            !totalMarks ||
            totalMarks <= 0
        ) {

            alert(
                "Please enter valid total marks."
            );

            return;
        }


        // =========================================
        // FIND SUBJECT IN SUPABASE
        // =========================================

        const {
            data: subjectRows,
            error: subjectError
        } =
            await supabaseClient
                .from("subjects")
                .select(
                    "id, name, code, teacher_id"
                );


        if (subjectError) {

            console.error(
                "Subject lookup error:",
                subjectError
            );

            alert(
                "Unable to load subjects.\n\n" +
                subjectError.message
            );

            return;
        }


        const subjectRow =
            (subjectRows || []).find(
                function(row) {

                    return (
                        String(
                            row.name || ""
                        )
                        .trim()
                        .toLowerCase() ===
                        subject
                            .trim()
                            .toLowerCase()
                    );

                }
            );


        if (!subjectRow) {

            alert(
                "Subject not found in Supabase.\n\n" +
                "Subject: " +
                subject
            );

            return;
        }


        // =========================================
        // FIND TEACHER IN SUPABASE
        // =========================================

        let dbTeacher = null;


        if (
            teacher.teacherId ||
            teacher.teacher_id
        ) {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("teachers")
                    .select(
                        "id, teacher_id, name, teacher_class"
                    )
                    .eq(
                        "teacher_id",
                        String(
                            teacher.teacherId ||
                            teacher.teacher_id
                        )
                    )
                    .maybeSingle();


            if (error) {

                console.error(
                    "Teacher lookup error:",
                    error
                );

                alert(
                    "Unable to find teacher.\n\n" +
                    error.message
                );

                return;
            }


            dbTeacher =
                data;
        }


        // =========================================
        // FALLBACK BY DATABASE ID
        // =========================================

        if (
            !dbTeacher &&
            teacher.id
        ) {

            const {
                data,
                error
            } =
                await supabaseClient
                    .from("teachers")
                    .select(
                        "id, teacher_id, name, teacher_class"
                    )
                    .eq(
                        "id",
                        teacher.id
                    )
                    .maybeSingle();


            if (error) {

                console.error(
                    "Teacher ID lookup error:",
                    error
                );

                alert(
                    "Unable to find teacher.\n\n" +
                    error.message
                );

                return;
            }


            dbTeacher =
                data;
        }


        if (!dbTeacher) {

            alert(
                "Logged-in teacher was not found in Supabase."
            );

            return;
        }


        // =========================================
        // LOAD TEACHER'S STUDENTS
        // =========================================

        const {
            data: students,
            error: studentsError
        } =
            await supabaseClient
                .from("students")
                .select("*");


        if (studentsError) {

            alert(
                "Students could not be loaded.\n\n" +
                studentsError.message
            );

            return;
        }


        // =========================================
        // SAVE EVERY ENTERED MARK
        // =========================================

        const inputs =
            document.querySelectorAll(
                "#teacherResultsTableBody " +
                ".teacher-obtained-marks"
            );


        let savedCount = 0;


        for (
            const input of inputs
        ) {

            const studentId =
                input.dataset.studentId;


            if (
                !studentId ||
                input.value === ""
            ) {

                continue;
            }


            const obtainedMarks =
                Number(
                    input.value
                );


            // =====================================
            // VALIDATE MARKS
            // =====================================

            if (
                obtainedMarks < 0 ||
                obtainedMarks > totalMarks
            ) {

                alert(
                    "Invalid marks for a student.\n\n" +
                    "Obtained marks cannot be greater than total marks."
                );

                return;
            }


            // =====================================
            // FIND STUDENT
            // =====================================

            const student =
                (students || []).find(
                    function(item) {

                        return (
                            String(
                                item.id
                            ) ===
                            String(
                                studentId
                            )
                        );

                    }
                );


            if (!student) {

                console.warn(
                    "Student not found:",
                    studentId
                );

                continue;
            }


            // =====================================
            // CALCULATE RESULT
            // =====================================

            const percentage =
                calculateTeacherResultPercentage(
                    obtainedMarks,
                    totalMarks
                );


            const grade =
                calculateTeacherResultGrade(
                    percentage
                );


            // =====================================
            // CHECK EXISTING RESULT
            // =====================================

            const {
                data: existingResult,
                error: existingError
            } =
                await supabaseClient
                    .from("results")
                    .select("id")
                    .eq(
                        "student_id",
                        student.id
                    )
                    .eq(
                        "subject_id",
                        subjectRow.id
                    )
                    .eq(
                        "teacher_id",
                        dbTeacher.id
                    )
                    .maybeSingle();


            if (existingError) {

                console.error(
                    "Existing result error:",
                    existingError
                );

                alert(
                    "Unable to check existing result.\n\n" +
                    existingError.message
                );

                return;
            }


            // =====================================
            // REAL DATABASE RECORD
            // =====================================

            const record = {

                teacher_id:
                    dbTeacher.id,

                student_id:
                    student.id,

                subject_id:
                    subjectRow.id,

                total_marks:
                    totalMarks,

                marks:
                    obtainedMarks,

                obtained_marks:
                    obtainedMarks,

                percentage:
                    percentage,

                grade:
                    grade

            };


            // =====================================
            // UPDATE
            // =====================================

            if (existingResult) {

                const {
                    error
                } =
                    await supabaseClient
                        .from("results")
                        .update(record)
                        .eq(
                            "id",
                            existingResult.id
                        );


                if (error) {

                    console.error(
                        "Result update error:",
                        error
                    );

                    alert(
                        "Result update failed.\n\n" +
                        error.message
                    );

                    return;
                }

            }

            // =====================================
            // INSERT
            // =====================================

            else {

                const {
                    error
                } =
                    await supabaseClient
                        .from("results")
                        .insert([
                            record
                        ]);


                if (error) {

                    console.error(
                        "Result insert error:",
                        error
                    );

                    alert(
                        "Result save failed.\n\n" +
                        error.message
                    );

                    return;
                }

            }


            savedCount++;

        }


        // =========================================
        // NOTHING ENTERED
        // =========================================

        if (
            savedCount === 0
        ) {

            alert(
                "No marks were entered."
            );

            return;
        }


        // =========================================
        // SUCCESS
        // =========================================

        alert(
            savedCount +
            " student result(s) saved successfully! ✅"
        );


        // =========================================
        // REFRESH TEACHER RESULTS
        // =========================================

        await loadTeacherResults();

    }
);


// =========================================================
// LIVE RESULT CALCULATION
// =========================================================

document.addEventListener(
    "input",
    function(event) {

        if (
            !event.target.classList.contains(
                "teacher-obtained-marks"
            )
        ) {

            return;

        }


        const input =
            event.target;


        const studentId =
            input.dataset.studentId;


        const totalMarks =
            Number(
                document.getElementById(
                    "teacherResultTotalMarks"
                )?.value
            );


        let obtainedMarks =
            Number(input.value);


        if (
            totalMarks > 0 &&
            obtainedMarks > totalMarks
        ) {

            obtainedMarks =
                totalMarks;

            input.value =
                totalMarks;

        }


        if (
            obtainedMarks < 0
        ) {

            obtainedMarks =
                0;

            input.value =
                0;

        }


        const percentage =
            calculateTeacherResultPercentage(
                input.value,
                totalMarks
            );


        const grade =
            calculateTeacherResultGrade(
                percentage
            );


        const percentageElement =
            document.querySelector(
                `[data-percentage-for="${studentId}"]`
            );


        const gradeElement =
            document.querySelector(
                `[data-grade-for="${studentId}"]`
            );


        if (percentageElement) {

            percentageElement.textContent =
                percentage + "%";

        }


        if (gradeElement) {

            gradeElement.textContent =
                grade;

        }

    }
);


// =========================================================
// SUBJECT / RESULTS REFRESH
// =========================================================

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target.id !==
            "teacherResultSubject"
        ) {

            return;

        }


        loadTeacherResults();

    }
);


// =========================================================
// OPEN RESULTS
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const menu =
            event.target.closest(
                "#teacherResultsMenu"
            );


        if (!menu) {
            return;
        }


        setTimeout(
            function() {

                loadTeacherResults();

            },
            50
        );

    }
);
// =========================================================
// SEARCH STUDENTS
// =========================================================

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.id !==
            "teacherResultSearch"
        ) {

            return;

        }


        const search =
            event.target.value
                .trim()
                .toLowerCase();


        document
            .querySelectorAll(
                "#teacherResultsTableBody tr"
            )
            .forEach(
                function(row) {

                    const text =
                        row.textContent
                            .toLowerCase();


                    row.style.display =
                        text.includes(search)
                            ? ""
                            : "none";

                }
            );

    }
);


// =========================================================
// SUBJECT CHANGE
// =========================================================

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target.id !==
            "teacherResultSubject"
        ) {

            return;

        }


        loadTeacherResults();

    }
);


// =========================================================
// OPEN TEACHER RESULTS
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const menu =
            event.target.closest(
                "#teacherResultsMenu"
            );


        if (!menu) {
            return;
        }


        setTimeout(
            function() {

                loadTeacherResults();

            },
            50
        );

    }
);
// =========================================================
// TEACHER NOTICES
// =========================================================

let teacherEditingNoticeId = null;


// =========================================================
// LOAD ADMINISTRATOR NOTICES FOR TEACHER
// SUPABASE + REALTIME
// =========================================================

let teacherAdminNoticesRealtimeChannel = null;


async function loadTeacherNotices() {

    const list =
        document.getElementById(
            "teacherNoticesList"
        );

    if (!list) {
        return;
    }


    // =========================================
    // SUPABASE CHECK
    // =========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        list.innerHTML = `
            <div class="teacher-notice-empty">

                <div class="teacher-notice-empty-icon">
                    ⚠️
                </div>

                <strong>
                    Unable to load notices
                </strong>

                <p>
                    Supabase connection is unavailable.
                </p>

            </div>
        `;

        return;
    }


    // =========================================
    // LOAD ADMINISTRATOR NOTICES
    // =========================================

    const {
        data: notices,
        error
    } =
        await supabaseClient
            .from("notices")
            .select(
                "id, title, message, target_role, created_at"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        console.error(
            "TEACHER ADMIN NOTICES ERROR:",
            error
        );

        list.innerHTML = `
            <div class="teacher-notice-empty">

                <div class="teacher-notice-empty-icon">
                    ⚠️
                </div>

                <strong>
                    Unable to load notices
                </strong>

                <p>
                    ${error.message}
                </p>

            </div>
        `;

        return;
    }


    // =========================================
    // FILTER FOR TEACHER
    // =========================================

    const teacherNotices =
        (notices || []).filter(
            function(notice) {

                const target =
                    String(
                        notice.target_role ||
                        ""
                    )
                        .trim()
                        .toLowerCase();


                // Show notices intended for everyone

                if (
                    !target ||
                    target === "all" ||
                    target === "everyone" ||
                    target === "all users"
                ) {
                    return true;
                }


                // Show notices intended for teachers

                if (
                    target === "teacher" ||
                    target === "teachers"
                ) {
                    return true;
                }


                return false;

            }
        );


    // =========================================
    // NOTICE COUNT
    // =========================================

    const countElement =
        document.getElementById(
            "teacherAdminNoticeCount"
        );


    if (countElement) {

        countElement.textContent =
            teacherNotices.length +
            (
                teacherNotices.length === 1
                    ? " Notice"
                    : " Notices"
            );

    }


    // =========================================
    // CLEAR LIST
    // =========================================

    list.innerHTML = "";


   

    // =========================================
    // RENDER NOTICES
    // =========================================

    teacherNotices.forEach(
        function(notice) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "teacher-notice-item";


            item.dataset.id =
                notice.id;


            const noticeDate =
                notice.created_at
                    ? new Date(
                        notice.created_at
                    ).toLocaleString(
                        "en-PK",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                        }
                    )
                    : "—";


            item.innerHTML = `

                <div
                    class="
                        teacher-notice-item-top
                    "
                >

                    <div>

                        <h4>
                            📢
                            ${
                                notice.title ||
                                "Administrator Notice"
                            }
                        </h4>

                    </div>

                    <span
                        class="
                            teacher-notice-priority
                            normal
                        "
                    >
                        Administrator
                    </span>

                </div>


                <p
                    class="
                        teacher-notice-description
                    "
                >
                    ${
                        notice.message ||
                        "No details provided."
                    }
                </p>


                <div
                    class="
                        teacher-notice-meta
                    "
                >

                    <span>
                        📅
                        ${noticeDate}
                    </span>

                    <span>
                        👤
                        Administrator
                    </span>

                </div>

            `;


            list.appendChild(item);

        }
    );


    // =========================================
    // START REALTIME LISTENER ONCE
    // =========================================

    if (
        !teacherAdminNoticesRealtimeChannel
    ) {

        teacherAdminNoticesRealtimeChannel =
            supabaseClient
                .channel(
                    "teacher-admin-notices-realtime"
                )
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "notices"
                    },
                    async function(payload) {

                        console.log(
                            "ADMIN NOTICE REALTIME UPDATE:",
                            payload
                        );


                        await loadTeacherNotices();

                    }
                )
                .subscribe(
                    function(status) {

                        console.log(
                            "TEACHER ADMIN NOTICES REALTIME:",
                            status
                        );

                    }
                );

    }

}



// =========================================================
// SEARCH NOTICES
// =========================================================

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.id !==
            "teacherNoticeSearch"
        ) {

            return;

        }


        const search =
            event.target.value
                .trim()
                .toLowerCase();


        document
            .querySelectorAll(
                "#teacherNoticesList " +
                ".teacher-notice-item"
            )
            .forEach(
                function(item) {

                    const text =
                        item.textContent
                            .toLowerCase();


                    item.style.display =
                        text.includes(search)
                            ? ""
                            : "none";

                }
            );

    }
);


// =========================================================
// OPEN TEACHER NOTICES
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const menu =
            event.target.closest(
                "#teacherNoticesMenu"
            );


        if (!menu) {
            return;
        }


        setTimeout(
            function() {

                loadTeacherNotices();

            },
            50
        );

    }
);



// =========================================================
// DEFAULT DATE
// =========================================================

function setTeacherAttendanceDate() {

    const dateInput =
        document.getElementById(
            "teacherAttendanceDate"
        );


    if (
        dateInput &&
        !dateInput.value
    ) {

        dateInput.value =
            new Date()
                .toISOString()
                .split("T")[0];

    }

}


// =========================================================
// CHANGE ATTENDANCE STATUS
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".teacher-attendance-status button"
            );


        if (!button) {
            return;
        }


        const row =
            button.closest(
                ".teacher-attendance-row"
            );


        if (!row) {
            return;
        }


        row
            .querySelectorAll(
                ".teacher-attendance-status button"
            )
            .forEach(
                function(item) {

                    item.classList.remove(
                        "active"
                    );

                }
            );


        button.classList.add(
            "active"
        );


        updateTeacherAttendanceSummary();

    }
);


// =========================================================
// UPDATE SUMMARY
// =========================================================

function updateTeacherAttendanceSummary() {

    const rows =
        document.querySelectorAll(
            "#teacherAttendanceList " +
            ".teacher-attendance-row"
        );


    let present = 0;
    let absent = 0;
    let late = 0;


    rows.forEach(
        function(row) {

            const active =
                row.querySelector(
                    ".teacher-attendance-status " +
                    "button.active"
                );


            if (!active) {
                return;
            }


            const status =
                active.dataset.status;


            if (status === "Present") {

                present++;

            }

            else if (status === "Absent") {

                absent++;

            }

            else if (status === "Late") {

                late++;

            }

        }
    );


    const presentElement =
        document.querySelector(
            ".attendance-present-count"
        );


    const absentElement =
        document.querySelector(
            ".attendance-absent-count"
        );


    const lateElement =
        document.querySelector(
            ".attendance-late-count"
        );


    if (presentElement) {

        presentElement.textContent =
            "Present: " + present;

    }


    if (absentElement) {

        absentElement.textContent =
            "Absent: " + absent;

    }


    if (lateElement) {

        lateElement.textContent =
            "Late: " + late;

    }

}


// =========================================================
// SAVE ATTENDANCE
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const saveButton =
            event.target.closest(
                "#teacherSaveAttendanceBtn"
            );


        if (!saveButton) {
            return;
        }


        const teacher =
            JSON.parse(
                localStorage.getItem(
                    "loggedInTeacher"
                )
            ) || {};


        const dateInput =
            document.getElementById(
                "teacherAttendanceDate"
            );


        const attendanceDate =
            dateInput?.value;


        if (!attendanceDate) {

            alert(
                "Please select an attendance date."
            );

            return;

        }


        let attendance =
            JSON.parse(
                localStorage.getItem(
                    "teacherAttendance"
                )
            ) || [];


        const rows =
            document.querySelectorAll(
                "#teacherAttendanceList " +
                ".teacher-attendance-row"
            );


        if (!rows.length) {

            alert(
                "No students available."
            );

            return;

        }


        rows.forEach(
            function(row) {

                const studentId =
                    row.dataset.studentId;


                const activeButton =
                    row.querySelector(
                        ".teacher-attendance-status " +
                        "button.active"
                    );


                const status =
                    activeButton
                        ? activeButton.dataset.status
                        : "Present";


                const existingIndex =
                    attendance.findIndex(
                        function(record) {

                            return (
                                String(
                                    record.studentId
                                ) ===
                                String(
                                    studentId
                                ) &&
                                record.date ===
                                attendanceDate
                            );

                        }
                    );


const subjectId =
    selectedSubject?.id;

                const record = {

                    studentId:
                        studentId,

                    date:
                        attendanceDate,

                    status:
                        status,

                    teacherId:
                        teacher.id ||
                        teacher.username ||
                        teacher.email ||
                        "",

                    teacherName:
                        teacher.name ||
                        teacher.fullName ||
                        "Teacher",

                    className:
                        teacher.teacherClass ||
                        "",

                    updatedAt:
                        new Date().toISOString()

                };


                if (
                    existingIndex !== -1
                ) {

                    attendance[
                        existingIndex
                    ] = record;

                }

                else {

                    attendance.push(
                        record
                    );

                }

            }
        );


        localStorage.setItem(
            "teacherAttendance",
            JSON.stringify(
                attendance
            )
        );


        alert(
            "Attendance saved successfully."
        );


        updateTeacherAttendanceSummary();

    }
);


// =========================================================
// DATE CHANGE
// =========================================================

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target.id !==
            "teacherAttendanceDate"
        ) {

            return;

        }


        loadTeacherAttendance();

    }
);


// =========================================================
// SEARCH STUDENT
// =========================================================

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.id !==
            "teacherAttendanceSearch"
        ) {

            return;

        }


        const search =
            event.target.value
                .trim()
                .toLowerCase();


        document
            .querySelectorAll(
                "#teacherAttendanceList " +
                ".teacher-attendance-row"
            )
            .forEach(
                function(row) {

                    const text =
                        row.textContent
                            .toLowerCase();


                    row.style.display =
                        text.includes(search)
                            ? ""
                            : "none";

                }
            );


        updateTeacherAttendanceSummary();

    }
);




// =========================================================
// INITIALIZE
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setTeacherAttendanceDate();

    }
);



// =========================================================
// RETURN TO TEACHER HOME
// =========================================================

window.openTeacherHome = function (
    menuElement,
    event
) {

    if (event) {

        event.preventDefault();
        event.stopPropagation();

    }


    const dashboard =
        document.getElementById(
            "teacherDashboard"
        );


    const mainContent =
        dashboard
            ? dashboard.querySelector(
                ".main-content"
            )
            : null;


    [
        "teacherStudentsSection",
        "teacherAttendanceSection",
        "teacherAssignmentsSection",
        "teacherResultsSection",
        "teacherNoticesSection"
    ]
    .forEach(function (id) {

        const section =
            document.getElementById(id);

        if (section) {

            section.style.display =
                "none";

        }

    });


    if (mainContent) {

        mainContent.style.display =
            "none";

    }


    document
        .querySelectorAll(
            "#teacherDashboardMenu, " +
            "#teacherStudentsMenu, " +
            "#teacherAttendanceMenu, " +
            "#teacherAssignmentsMenu, " +
            "#teacherResultsMenu, " +
            "#teacherNoticesMenu"
        )
        .forEach(function (item) {

            item.classList.remove("active");

        });


    if (menuElement) {

        menuElement.classList.add("active");

    }

};
// ==========================================
// TEACHER MY PROFILE
// LOAD COMPLETE LOGGED-IN TEACHER DATA
// ==========================================

function loadTeacherProfile() {

    // ==========================================
    // GET LOGGED-IN TEACHER
    // ==========================================

    let teacher = null;

    try {

        teacher =
            JSON.parse(
                localStorage.getItem(
                    "loggedInTeacher"
                )
            );

    } catch (error) {

        console.error(
            "Teacher profile error:",
            error
        );

        teacher = null;
    }


    // ==========================================
    // IF NO TEACHER
    // ==========================================

    if (!teacher) {

        console.warn(
            "No logged-in teacher found."
        );

        return;
    }


    // ==========================================
    // HELPER FUNCTION
    // ==========================================

    function setProfileValue(
        ids,
        value
    ) {

        const idList =
            Array.isArray(ids)
                ? ids
                : [ids];


        idList.forEach(
            function (id) {

                const element =
                    document.getElementById(
                        id
                    );

                if (element) {

                    element.textContent =
                        value ||
                        "—";

                }

            }
        );

    }


    // ==========================================
    // TEACHER BASIC DATA
    // ==========================================

    const teacherName =
        teacher.fullName ||
        teacher.name ||
        teacher.full_name ||
        "Teacher";


    const teacherId =
        teacher.teacherId ||
        teacher.teacher_id ||
        teacher.id ||
        "—";


    const teacherEmail =
        teacher.email ||
        "—";


    const teacherPhone =
        teacher.phone ||
        teacher.mobile ||
        "—";


    const teacherSubject =
    teacher.subject ||
    teacher.subject_name ||
    teacher.Subject ||
    teacher.subjectName ||
    teacher.subject_name ||
    "Not Provided";


    const teacherClass =
        teacher.teacherClass ||
        teacher.teacher_class ||
        "—";


    const teacherQualification =
        teacher.qualification ||
        "—";


    const teacherJoiningDate =
        teacher.joiningDate ||
        teacher.joining_date ||
        "—";
  const teacherSession =
    teacher.academic_session ||
    teacher.academicSession ||
    teacher.session ||
    "—";


    const teacherUsername =
        teacher.username ||
        "—";


    const teacherStatus =
        teacher.status ||
        "Active";


    // ==========================================
    // PROFILE NAME
    // ==========================================

    setProfileValue(
        [
            "teacherName",
            "teacherProfileName",
            "profileTeacherName",
            "teacherProfileFullName"
        ],
        teacherName
    );


    // ==========================================
    // TEACHER ID
    // ==========================================

    setProfileValue(
        [
            "teacherId",
            "teacherProfileId",
            "profileTeacherId",
            "teacherProfileTeacherId"
        ],
        teacherId
    );


    // ==========================================
    // EMAIL
    // ==========================================

    setProfileValue(
        [
            "teacherEmail",
            "teacherProfileEmail",
            "profileTeacherEmail"
        ],
        teacherEmail
    );


    // ==========================================
    // PHONE
    // ==========================================

    setProfileValue(
        [
            "teacherPhone",
            "teacherProfilePhone",
            "profileTeacherPhone"
        ],
        teacherPhone
    );


 // ==========================================
// SUBJECT - MY PROFILE
// ==========================================

setProfileValue(
    [
        "teacherProfileSubject",
        "teacherProfileSubjectValue",
        "teacherInfoSubject",
        "teacherSubject"
    ],
    teacherSubject
);


    // ==========================================
    // CLASS
    // ==========================================

    setProfileValue(
        [
            "teacherClass",
            "teacherProfileClass",
            "profileTeacherClass"
        ],
        teacherClass
    );


    // ==========================================
    // QUALIFICATION
    // ==========================================

    setProfileValue(
        [
            "teacherQualification",
            "teacherProfileQualification",
            "profileTeacherQualification"
        ],
        teacherQualification
    );


    // ==========================================
    // JOINING DATE
    // ==========================================

    setProfileValue(
        [
            "teacherJoiningDate",
            "teacherProfileJoiningDate",
            "profileTeacherJoiningDate"
        ],
        teacherJoiningDate
    );


    // ==========================================
    // USERNAME
    // ==========================================

    setProfileValue(
        [
            "teacherUsername",
            "teacherProfileUsername",
            "profileTeacherUsername"
        ],
        teacherUsername
    );
// ==========================================
// SESSION
// ==========================================

setProfileValue(
    [
        "teacherProfileSession"
    ],
    teacherSession
);

    // ==========================================
    // STATUS
    // ==========================================

    setProfileValue(
        [
            "teacherStatus",
            "teacherProfileStatus",
            "profileTeacherStatus"
        ],
        teacherStatus
    );


    // ==========================================
    // PROFILE AVATAR INITIAL
    // ==========================================

    const avatarInitial =
        teacherName
            .trim()
            .charAt(0)
            .toUpperCase();


    const avatarElements =
        document.querySelectorAll(
            ".teacher-profile-avatar, .teacher-avatar"
        );


    avatarElements.forEach(
        function (avatar) {

            if (
                avatar &&
                !avatar.querySelector("img")
            ) {

                avatar.textContent =
                    avatarInitial;

            }

        }
    );


    // ==========================================
    // DEBUG
    // ==========================================

    console.log(
        "Teacher My Profile loaded:",
        teacher
    );
}  
/* =========================================================
   LOAD PROFILE WHEN PROFILE SECTION OPENS
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const profileMenu =
            event.target.closest(
                "#teacherProfileMenu"
            );

        if (!profileMenu) {
            return;
        }

        setTimeout(
            function() {

                loadTeacherProfile();

            },
            50
        );

    }
);

/* =========================================================
   TEACHER SETTINGS - LOAD SETTINGS
========================================================= */

function loadTeacherSettings() {

    const teacher =
        JSON.parse(
            localStorage.getItem("loggedInTeacher")
        ) || {};

    const settings =
        JSON.parse(
            localStorage.getItem("teacherSettings")
        ) || {};


    /* ACCOUNT INFORMATION */

    const username =
        document.getElementById(
            "teacherSettingsUsername"
        );

    if (username) {
        username.value =
            teacher.username || "";
    }


    const email =
        document.getElementById(
            "teacherSettingsEmail"
        );

    if (email) {
        email.value =
            teacher.email || "";
    }


    const phone =
        document.getElementById(
            "teacherSettingsPhone"
        );

    if (phone) {
        phone.value =
            teacher.phone || "";
    }


    const status =
        document.getElementById(
            "teacherSettingsStatus"
        );

    if (status) {
        status.value =
            teacher.status || "Active";
    }


    /* NOTIFICATIONS */

    const assignmentNotifications =
        document.getElementById(
            "teacherAssignmentNotifications"
        );

    if (assignmentNotifications) {

        assignmentNotifications.checked =
            settings.assignmentNotifications !== false;
    }


    const noticeNotifications =
        document.getElementById(
            "teacherNoticeNotifications"
        );

    if (noticeNotifications) {

        noticeNotifications.checked =
            settings.noticeNotifications !== false;
    }

}


/* =========================================================
   SAVE TEACHER SETTINGS
========================================================= */

async function saveTeacherSettings() {

    const teacher =
        JSON.parse(
            localStorage.getItem("loggedInTeacher")
        ) || {};


    const emailInput =
        document.getElementById(
            "teacherSettingsEmail"
        );

    const phoneInput =
        document.getElementById(
            "teacherSettingsPhone"
        );


    const email =
        emailInput
            ? emailInput.value.trim()
            : "";


    const phone =
        phoneInput
            ? phoneInput.value.trim()
            : "";


    /* -----------------------------------------
       BASIC VALIDATION
    ----------------------------------------- */

    if (!email) {

        alert(
            "Please enter your email address."
        );

        if (emailInput) {
            emailInput.focus();
        }

        return;
    }


    if (!email.includes("@")) {

        alert(
            "Please enter a valid email address."
        );

        if (emailInput) {
            emailInput.focus();
        }

        return;
    }


    if (!phone) {

        alert(
            "Please enter your mobile number."
        );

        if (phoneInput) {
            phoneInput.focus();
        }

        return;
    }


    /* -----------------------------------------
       UPDATE LOGGED-IN TEACHER
    ----------------------------------------- */

    teacher.email =
        email;

    teacher.phone =
        phone;


    localStorage.setItem(
        "loggedInTeacher",
        JSON.stringify(teacher)
    );
/* -----------------------------------------
   UPDATE MASTER TEACHER ACCOUNT
   So changes remain after logout/login
----------------------------------------- */

if (
    typeof supabaseClient ===
    "undefined"
) {

    alert(
        "Supabase connection is missing."
    );

    return;
}

// ==========================================
// UPDATE TEACHER ACCOUNT IN SUPABASE
// ==========================================

let teacherUpdateQuery =
    supabaseClient
        .from("teachers")
        .update({
            email: email,
            phone: phone
        });

// ==========================================
// FIND TEACHER
// ==========================================

if (teacher.id) {

    teacherUpdateQuery =
        teacherUpdateQuery.eq(
            "id",
            teacher.id
        );

} else if (teacher.teacherId) {

    teacherUpdateQuery =
        teacherUpdateQuery.eq(
            "teacher_id",
            teacher.teacherId
        );

} else if (teacher.username) {

    teacherUpdateQuery =
        teacherUpdateQuery.eq(
            "username",
            teacher.username
        );

} else {

    alert(
        "Teacher account could not be identified."
    );

    return;

}

// ==========================================
// SAVE TO SUPABASE
// ==========================================

const {
    data: updatedTeacherData,
    error: teacherUpdateError
} =
    await teacherUpdateQuery
        .select()
        .maybeSingle();

if (teacherUpdateError) {

    console.error(
        "TEACHER ACCOUNT UPDATE ERROR:",
        teacherUpdateError
    );

    alert(
        "Teacher account could not be updated.\n\n" +
        teacherUpdateError.message
    );

    return;
}

// ==========================================
// UPDATE LOCAL SESSION ONLY
// ==========================================

teacher.email =
    email;

teacher.phone =
    phone;

localStorage.setItem(
    "loggedInTeacher",
    JSON.stringify(
        teacher
    )
);

console.log(
    "Teacher account updated in Supabase:",
    updatedTeacherData
);
    /* -----------------------------------------
       SAVE NOTIFICATIONS
    ----------------------------------------- */

    const assignmentNotifications =
        document.getElementById(
            "teacherAssignmentNotifications"
        );

    const noticeNotifications =
        document.getElementById(
            "teacherNoticeNotifications"
        );


    const settings = {

        assignmentNotifications:
            assignmentNotifications
                ? assignmentNotifications.checked
                : true,

        noticeNotifications:
            noticeNotifications
                ? noticeNotifications.checked
                : true

    };


    localStorage.setItem(
        "teacherSettings",
        JSON.stringify(settings)
    );


    /* -----------------------------------------
       SUCCESS
    ----------------------------------------- */

    alert(
        "Settings saved successfully."
    );


    /* Refresh profile data */

    if (
        typeof loadTeacherProfile ===
        "function"
    ) {

        loadTeacherProfile();
    }

}


/* =========================================================
   SETTINGS BUTTON
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const saveButton =
            event.target.closest(
                "#teacherSaveSettingsBtn"
            );


        if (!saveButton) {
            return;
        }


        saveTeacherSettings();

    }
);


/* =========================================================
   LOAD SETTINGS WHEN OPENED
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const settingsMenu =
            event.target.closest(
                "#teacherSettingsMenu"
            );


        if (!settingsMenu) {
            return;
        }


        setTimeout(
            function() {

                loadTeacherSettings();

            },
            50
        );

    }
);

/* =========================================================
   TEACHER CHANGE PASSWORD
========================================================= */

function changeTeacherPassword() {

    const teacher =
        JSON.parse(
            localStorage.getItem("loggedInTeacher")
        ) || {};

    const currentPassword =
        document.getElementById(
            "teacherCurrentPassword"
        ).value.trim();

    const newPassword =
        document.getElementById(
            "teacherNewPassword"
        ).value.trim();

    const confirmPassword =
        document.getElementById(
            "teacherConfirmPassword"
        ).value.trim();


    /* CURRENT PASSWORD */

    if (!currentPassword) {

        alert(
            "Please enter your current password."
        );

        document.getElementById(
            "teacherCurrentPassword"
        ).focus();

        return;
    }


    /* NEW PASSWORD */

    if (!newPassword) {

        alert(
            "Please enter your new password."
        );

        document.getElementById(
            "teacherNewPassword"
        ).focus();

        return;
    }


    /* MINIMUM PASSWORD LENGTH */

    if (newPassword.length < 6) {

        alert(
            "New password must contain at least 6 characters."
        );

        document.getElementById(
            "teacherNewPassword"
        ).focus();

        return;
    }


    /* CONFIRM PASSWORD */

    if (!confirmPassword) {

        alert(
            "Please confirm your new password."
        );

        document.getElementById(
            "teacherConfirmPassword"
        ).focus();

        return;
    }


    /* PASSWORD MATCH */

    if (newPassword !== confirmPassword) {

        alert(
            "New password and confirm password do not match."
        );

        document.getElementById(
            "teacherConfirmPassword"
        ).focus();

        return;
    }


    /* CURRENT PASSWORD CHECK */

    if (
        teacher.password !== currentPassword
    ) {

        alert(
            "Current password is incorrect."
        );

        document.getElementById(
            "teacherCurrentPassword"
        ).focus();

        return;
    }


    /* UPDATE PASSWORD */

 const passwordUpdated =
    updateTeacherPasswordEverywhere(
        newPassword
    );

if (!passwordUpdated) {

    alert(
        "Unable to update teacher password."
    );

    return;
}


    localStorage.setItem(
        "loggedInTeacher",
        JSON.stringify(teacher)
    );


    /* CLEAR FIELDS */

    document.getElementById(
        "teacherCurrentPassword"
    ).value = "";

    document.getElementById(
        "teacherNewPassword"
    ).value = "";

    document.getElementById(
        "teacherConfirmPassword"
    ).value = "";


    alert(
        "Password changed successfully."
    );

}


/* =========================================================
   CHANGE PASSWORD BUTTON
========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "#teacherChangePasswordBtn"
            );

        if (!button) {
            return;
        }

        changeTeacherPassword();

    }
);


/* =========================================================
   TEACHER LOGOUT FUNCTION
========================================================= */
function logoutTeacher() {
    eduPortalShowLogin();
    document.body.style.overflowY = "auto";
document.body.style.overflowX = "hidden";
document.body.style.height = "auto";

    // ==========================================
    // REMOVE TEACHER SESSION
    // ==========================================

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInRole");
    localStorage.removeItem("loggedInTeacher");
    


    // ==========================================
    // HIDE TEACHER DASHBOARD
    // ==========================================

    const teacherDashboard =
        document.getElementById("teacherDashboard");

    if (teacherDashboard) {

        teacherDashboard.style.setProperty(
            "display",
            "none",
            "important"
        );

        teacherDashboard.style.setProperty(
            "visibility",
            "hidden",
            "important"
        );

        teacherDashboard.style.setProperty(
            "opacity",
            "0",
            "important"
        );
    }


    // ==========================================
    // HIDE ADMIN DASHBOARD
    // ==========================================

    const adminDashboard =
        document.getElementById("adminDashboard");

    if (adminDashboard) {

        adminDashboard.style.setProperty(
            "display",
            "none",
            "important"
        );
    }


    // ==========================================
    // HIDE STUDENT DASHBOARD
    // ==========================================

    const studentDashboard =
        document.getElementById("studentDashboard");

    if (studentDashboard) {

        studentDashboard.style.setProperty(
            "display",
            "none",
            "important"
        );
    }


    // ==========================================
    // SHOW LOGIN SCREEN
    // ==========================================

    const loginContainer =
        document.querySelector(".container");

    if (loginContainer) {

        loginContainer.classList.remove(
            "session-hidden"
        );

        loginContainer.style.setProperty(
            "display",
            "flex",
            "important"
        );

        loginContainer.style.setProperty(
            "visibility",
            "visible",
            "important"
        );

        loginContainer.style.setProperty(
            "opacity",
            "1",
            "important"
        );
    }


    // ==========================================
    // RESET LOGIN FORM
    // ==========================================

    if (loginForm) {
        loginForm.reset();
    }

    if (message) {
        message.textContent = "";
    }


    // ==========================================
    // SCROLL TO TOP
    // ==========================================

    window.scrollTo(0, 0);
}



/* =========================================================
   UPDATE TEACHER PASSWORD
   SUPABASE LIVE
   ========================================================= */

async function updateTeacherPasswordEverywhere(
    newPassword
) {

    const loggedTeacher =
        JSON.parse(
            localStorage.getItem(
                "loggedInTeacher"
            )
        ) || null;


    if (!loggedTeacher) {

        return false;

    }


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection is missing."
        );

        return false;

    }


    /* -----------------------------------------
       FIND TEACHER IN SUPABASE
    ----------------------------------------- */

    let teacher = null;
    let teacherError = null;


    if (loggedTeacher.id) {

        const result =
            await supabaseClient
                .from("teachers")
                .select("*")
                .eq(
                    "id",
                    loggedTeacher.id
                )
                .maybeSingle();

        teacher =
            result.data;

        teacherError =
            result.error;

    }


    if (
        !teacher &&
        loggedTeacher.teacherId
    ) {

        const result =
            await supabaseClient
                .from("teachers")
                .select("*")
                .eq(
                    "teacher_id",
                    loggedTeacher.teacherId
                )
                .maybeSingle();

        teacher =
            result.data;

        teacherError =
            result.error;

    }


    if (
        !teacher &&
        loggedTeacher.username
    ) {

        const result =
            await supabaseClient
                .from("teachers")
                .select("*")
                .eq(
                    "username",
                    loggedTeacher.username
                )
                .maybeSingle();

        teacher =
            result.data;

        teacherError =
            result.error;

    }


    if (teacherError) {

        console.error(
            "TEACHER PASSWORD LOAD ERROR:",
            teacherError
        );

        return false;

    }


    if (!teacher) {

        console.error(
            "Teacher record not found in Supabase."
        );

        return false;

    }


    /* -----------------------------------------
       UPDATE PASSWORD
    ----------------------------------------- */

    const {
        data: updatedTeacher,
        error: updateError
    } =
        await supabaseClient
            .from("teachers")
            .update({
                password:
                    newPassword
            })
            .eq(
                "id",
                teacher.id
            )
            .select("*")
            .single();


    if (updateError) {

        console.error(
            "TEACHER PASSWORD UPDATE ERROR:",
            updateError
        );

        return false;

    }


    /* -----------------------------------------
       UPDATE CURRENT LOGIN SESSION
    ----------------------------------------- */

    localStorage.setItem(
        "loggedInTeacher",
        JSON.stringify(
            updatedTeacher
        )
    );


    return true;

}

/* =========================================================
   TEACHER DASHBOARD - LOAD REAL DATA
========================================================= */

async function loadTeacherDashboardData() {

    const teacher =
        JSON.parse(
            localStorage.getItem("loggedInTeacher")
        ) || {};

    if (!teacher) {
        return;
    }


    /* =====================================================
       TEACHER BASIC INFORMATION
    ===================================================== */

    const teacherName =
        teacher.name ||
        teacher.fullName ||
        "Teacher";

    const teacherSubject =
        teacher.subject ||
        "Not Assigned";

  const teacherClass =
    teacher.teacherClass ||
    teacher.teacher_class ||
    teacher.class ||
    teacher.assigned_class ||
    "";

    const teacherEmail =
        teacher.email ||
        "Not Provided";


    /* =====================================================
       HEADER NAME
    ===================================================== */

    const teacherNameElement =
        document.getElementById(
            "teacherName"
        );

    if (teacherNameElement) {

        teacherNameElement.textContent =
            "Welcome, " +
            teacherName +
            " 👋";

    }


    /* =====================================================
       TEACHER INFORMATION
    ===================================================== */

    const infoName =
        document.getElementById(
            "teacherInfoName"
        );

    if (infoName) {
        infoName.textContent =
            teacherName;
    }


    const infoSubject =
        document.getElementById(
            "teacherInfoSubject"
        );

    if (infoSubject) {
        infoSubject.textContent =
            teacherSubject;
    }


    const infoClass =
        document.getElementById(
            "teacherInfoClass"
        );

    if (infoClass) {
        infoClass.textContent =
            teacherClass;
    }


    const infoEmail =
        document.getElementById(
            "teacherInfoEmail"
        );

    if (infoEmail) {
        infoEmail.textContent =
            teacherEmail;
    }


 // ==========================================
// GET REAL STUDENTS FROM SUPABASE
// ==========================================

const {
    data: students,
    error: studentsError
} = await supabaseClient
    .from("students")
    .select("id, student_class, created_at");

if (studentsError) {

    console.error(
        "Teacher Dashboard Students Error:",
        studentsError
    );

    return;
}


    /* =====================================================
       FILTER STUDENTS BY TEACHER CLASS
    ===================================================== */

  const normalizedTeacherClass =
    String(
        teacherClass
    )
    .trim()
    .toLowerCase()
    .replace(
        /^class\s*/i,
        ""
    );


const assignedStudents =
    (students || []).filter(
        function(student) {

            const studentClass =
                String(
                    student.student_class ||
                    student.studentClass ||
                    student.class ||
                    ""
                )
                .trim()
                .toLowerCase()
                .replace(
                    /^class\s*/i,
                    ""
                );


            return (
                normalizedTeacherClass !== "" &&
                normalizedTeacherClass !== "not assigned" &&
                studentClass ===
                normalizedTeacherClass
            );

        }
    );
    /* =====================================================
       TOTAL STUDENTS
    ===================================================== */

    const totalStudents =
        document.getElementById(
            "teacherTotalStudents"
        );

    if (totalStudents) {

        totalStudents.textContent =
            assignedStudents.length;

    }
// =====================================================
// MY STUDENTS GRAPH - LIVE SUPABASE DATA
// =====================================================

const chartBars =
    document.getElementById(
        "teacherStudentsChartBars"
    );

const chartLabels =
    document.getElementById(
        "teacherStudentsChartLabels"
    );

const chartPeriod =
    document.getElementById(
        "teacherStudentsChartPeriod"
    );


// ==========================================
// MY STUDENTS GRAPH - DATE FILTER
// ==========================================

function renderTeacherStudentsChart() {

    if (!chartBars || !chartLabels) {
        return;
    }

    chartBars.innerHTML = "";
    chartLabels.innerHTML = "";

    const selectedPeriod =
        chartPeriod
            ? chartPeriod.value
            : "week";

    const now = new Date();

    const points = [];


    // ==========================================
    // YESTERDAY
    // ==========================================

    if (selectedPeriod === "yesterday") {

        const yesterday =
            new Date(now);

        yesterday.setDate(
            now.getDate() - 1
        );

        points.push({
            start: new Date(
                yesterday.getFullYear(),
                yesterday.getMonth(),
                yesterday.getDate()
            ),
            end: new Date(
                yesterday.getFullYear(),
                yesterday.getMonth(),
                yesterday.getDate() + 1
            ),
            label: "Yesterday"
        });

    }


    // ==========================================
    // LAST WEEK
    // ==========================================

    else if (selectedPeriod === "week") {

        for (
            let i = 6;
            i >= 0;
            i--
        ) {

            const date =
                new Date(now);

            date.setDate(
                now.getDate() - i
            );

            const start =
                new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );

            const end =
                new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate() + 1
                );

            points.push({

                start: start,

                end: end,

                label:
                    date.toLocaleDateString(
                        "en-US",
                        {
                            weekday: "short"
                        }
                    )

            });

        }

    }


    // ==========================================
    // LAST MONTH
    // ==========================================

    else if (selectedPeriod === "month") {

        for (
            let i = 3;
            i >= 0;
            i--
        ) {

            const end =
                new Date(
                    now.getFullYear(),
                    now.getMonth() + 1 - i,
                    1
                );

            const start =
                new Date(
                    end.getFullYear(),
                    end.getMonth() - 1,
                    1
                );

            points.push({

                start: start,

                end: end,

                label:
                    start.toLocaleString(
                        "en-US",
                        {
                            month: "short"
                        }
                    )

            });

        }

    }


    // ==========================================
    // COUNT STUDENTS
    // ==========================================

    points.forEach(
        function (point) {

            point.count =
                assignedStudents.filter(
                    function (student) {

                        const rawDate =
                            student.created_at ||
                            student.createdAt ||
                            student.admission_date ||
                            student.admissionDate;

                        if (!rawDate) {
                            return false;
                        }

                        const studentDate =
                            new Date(rawDate);

                        if (
                            isNaN(
                                studentDate.getTime()
                            )
                        ) {
                            return false;
                        }

                        return (
                            studentDate >=
                                point.start &&
                            studentDate <
                                point.end
                        );

                    }
                ).length;

        }
    );


    // ==========================================
    // MAX VALUE
    // ==========================================

    const maxCount =
        Math.max(
            ...points.map(
                function (point) {
                    return point.count;
                }
            ),
            1
        );


    // ==========================================
    // CREATE GRAPH BARS
    // ==========================================

    points.forEach(
        function (point) {

            const bar =
                document.createElement(
                    "div"
                );

            bar.className =
                "teacher-chart-bar";


            const height =
                point.count > 0
                    ? Math.max(
                        (
                            point.count /
                            maxCount
                        ) * 100,
                        8
                    )
                    : 2;


            bar.style.height =
                height + "%";


            const value =
                document.createElement(
                    "span"
                );

            value.textContent =
                point.count;


            bar.appendChild(value);

            chartBars.appendChild(bar);


            // ==================================
            // LABEL
            // ==================================

            const label =
                document.createElement(
                    "span"
                );

            label.textContent =
                point.label;

            chartLabels.appendChild(
                label
            );

        }
    );

}


// ==========================================
// INITIAL GRAPH
// ==========================================

renderTeacherStudentsChart();


// ==========================================
// FILTER CHANGE
// ==========================================

if (chartPeriod) {

    chartPeriod.addEventListener(
        "change",
        function () {

            renderTeacherStudentsChart();

        }
    );

}
    /* =====================================================
       GET ASSIGNMENTS
    ===================================================== */

    const assignments =
        JSON.parse(
            localStorage.getItem(
                "teacherAssignments"
            )
        ) || [];


    const teacherId =
        teacher.id ||
        teacher.username ||
        teacher.email ||
        "";


    const myAssignments =
        assignments.filter(
            function(assignment) {

                return String(
                    assignment.teacherId ||
                    ""
                ) === String(
                    teacherId
                );

            }
        );


    /* =====================================================
       TOTAL ASSIGNMENTS
    ===================================================== */

    const totalAssignments =
        document.getElementById(
            "teacherTotalAssignments"
        );

    if (totalAssignments) {

        totalAssignments.textContent =
            myAssignments.length;

    }


    /* =====================================================
       GET RESULTS
    ===================================================== */

    const results =
        JSON.parse(
            localStorage.getItem(
                "teacherResults"
            )
        ) || [];


    const myResults =
        results.filter(
            function(result) {

                return String(
                    result.teacherId ||
                    ""
                ) === String(
                    teacherId
                );

            }
        );


    /* =====================================================
       TOTAL RESULTS
    ===================================================== */

    const totalResults =
        document.getElementById(
            "teacherTotalResults"
        );

    if (totalResults) {

        totalResults.textContent =
            myResults.length;

    }


  // =====================================================
// TODAY'S ATTENDANCE - LIVE SUPABASE DATA
// =====================================================

const dashboardDateInput =
    document.getElementById(
        "teacherDashboardDateFilter"
    );

const today =
    new Date()
        .toISOString()
        .split("T")[0];

if (
    dashboardDateInput &&
    !dashboardDateInput.value
) {
    dashboardDateInput.value = today;
}

const selectedDashboardDate =
    dashboardDateInput &&
    dashboardDateInput.value
        ? dashboardDateInput.value
        : today;

let markedStudents = 0;
let presentStudents = 0;
let absentStudents = 0;


// ==========================================
// GET TODAY'S ATTENDANCE
// ==========================================

if (assignedStudents.length > 0) {

    const studentIds =
        assignedStudents
            .map(function (student) {
                return student.id;
            })
            .filter(function (id) {
                return id !== null &&
                       id !== undefined;
            });


    if (studentIds.length > 0) {

        const {
            data: attendanceRecords,
            error: attendanceError
        } =
            await supabaseClient
                .from("attendance")
                .select(
                    "student_id, status, attendance_date"
                )
                .eq(
                    "attendance_date",
                   selectedDashboardDate
                )
                .in(
                    "student_id",
                    studentIds
                );


        if (attendanceError) {

            console.error(
                "Teacher Dashboard Attendance Error:",
                attendanceError
            );

        } else {

            const records =
                attendanceRecords || [];


            markedStudents =
                records.length;


            presentStudents =
                records.filter(
                    function (record) {

                        return String(
                            record.status || ""
                        )
                        .trim()
                        .toLowerCase() ===
                        "present";

                    }
                ).length;

absentStudents =
    records.filter(
        function (record) {

            return String(
                record.status || ""
            )
            .trim()
            .toLowerCase() ===
            "absent";

        }
    ).length;

        }

    }

}


// ==========================================
// CALCULATE ATTENDANCE PERCENTAGE
// ==========================================

let attendancePercentage = 0;

if (markedStudents > 0) {

    attendancePercentage =
        Math.round(
            (
                presentStudents /
                markedStudents
            ) * 100
        );

}


// ==========================================
// UPDATE ATTENDANCE CARD
// ==========================================

const attendanceElement =
    document.getElementById(
        "teacherAttendanceToday"
    );

if (attendanceElement) {

    attendanceElement.textContent =
        attendancePercentage + "%";

}


// ==========================================
// UPDATE TEACHER DASHBOARD STATISTICS
// ==========================================

const teacherPresentCard =
    document.getElementById("teacherTotalPresent");

const teacherAbsentCard =
    document.getElementById("teacherTotalAbsent");

const teacherClassesCard =
    document.getElementById("teacherTotalClasses");

if (teacherPresentCard) {
    teacherPresentCard.textContent =
        presentStudents;
}

if (teacherAbsentCard) {
    teacherAbsentCard.textContent =
        absentStudents;
}

if (teacherClassesCard) {
  const uniqueClasses =
    new Set(
        assignedStudents.map(function (student) {

            return String(
                student.student_class ||
                student.studentClass ||
                student.class ||
                ""
            )
            .trim()
            .toLowerCase()
            .replace(/^class\s*/i, "");

        })
        .filter(function (className) {
            return className !== "";
        })
    );

teacherClassesCard.textContent =
    uniqueClasses.size;
}


}
// ==========================================
// USER MANAGEMENT - EDIT USER
// ==========================================

let editingUserType = "";
let editingUserId = null;




// ==========================================
// CLOSE EDIT USER MODAL
// ==========================================

function closeEditUserManagementModal() {

    const modal =
        document.getElementById(
            "editUserManagementModal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }

}


// ==========================================
// CLOSE BUTTONS
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const closeButton =
            event.target.closest(
                "#closeEditUserManagementModal"
            ) ||
            event.target.closest(
                "#cancelEditUserManagement"
            ) ||
            event.target.closest(
                "#editUserManagementModal button"
            );

        if (!closeButton) {
            return;
        }

        // Agar Edit User modal ka koi bhi button
        // close button hai to modal close karo
        if (
            closeButton.id ===
                "closeEditUserManagementModal" ||
            closeButton.id ===
                "cancelEditUserManagement"
        ) {

            closeEditUserManagementModal();

        }

    }
);


// ==========================================
// SAVE EDIT USER
// SUPABASE LIVE UPDATE
// STUDENT + TEACHER
// ==========================================

document.addEventListener(
    "click",
    async function (event) {

        const saveButton =
            event.target.closest(
                "#saveEditUserManagement"
            );

        if (!saveButton) {
            return;
        }


        // ==========================================
        // GET FIELDS
        // ==========================================

        const nameField =
            document.getElementById(
                "editUserName"
            );

        const usernameField =
            document.getElementById(
                "editUserUsername"
            );

        const newPasswordField =
            document.getElementById(
                "editUserNewPassword"
            );

        const statusField =
            document.getElementById(
                "editUserStatus"
            );


        if (
            !nameField ||
            !usernameField ||
            !statusField
        ) {

            alert(
                "Edit User fields are missing."
            );

            return;
        }


        const newName =
            nameField.value.trim();

        const newUsername =
            usernameField.value.trim();

        const newPassword =
            newPasswordField
                ? newPasswordField.value.trim()
                : "";

        const newStatus =
            statusField.value;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!newName) {

            alert(
                "Please enter the user's name."
            );

            nameField.focus();

            return;
        }


        if (!newUsername) {

            alert(
                "Please enter the username."
            );

            usernameField.focus();

            return;
        }


        if (
            newPassword &&
            !/^[0-9]{8,12}$/.test(
                newPassword
            )
        ) {

            alert(
                "Password must contain 8 to 12 digits only."
            );

            newPasswordField.focus();

            return;
        }


        // ==========================================
        // SUPABASE CHECK
        // ==========================================

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            alert(
                "Supabase connection is missing."
            );

            return;
        }


        if (
            !editingUserId ||
            !editingUserType
        ) {

            alert(
                "No user selected for editing."
            );

            return;
        }


        // ==========================================
        // DETERMINE TABLE
        // ==========================================

        const tableName =
            editingUserType === "student"
                ? "students"
                : "teachers";

// ==========================================
// GET SELECTED STUDENT SUBJECTS
// ==========================================

let selectedSubjectIds = [];

if (editingUserType === "student") {

    selectedSubjectIds =
        Array.from(
            document.querySelectorAll(
                "#editUserSubjects input[type='checkbox']:checked"
            )
        )
        .map(function (checkbox) {
            return Number(checkbox.value);
        })
        .filter(function (id) {
            return !isNaN(id);
        });

}

        // ==========================================
        // CHECK DUPLICATE USERNAME
        // ==========================================

        const {
            data: duplicateUser,
            error: duplicateError
        } =
            await supabaseClient
                .from(tableName)
                .select("id")
                .eq(
                    "username",
                    newUsername
                )
                .neq(
                    "id",
                    editingUserId
                )
                .maybeSingle();


        if (duplicateError) {

            console.error(
                "USERNAME CHECK ERROR:",
                duplicateError
            );

            alert(
                "Unable to verify username.\n\n" +
                duplicateError.message
            );

            return;
        }


        if (duplicateUser) {

            alert(
                "This username is already being used by another account."
            );

            return;
        }


        // ==========================================
        // UPDATE DATA
        // ==========================================

       const updateData = {

    name:
        newName,

    username:
        newUsername,

    status:
        newStatus
};

if (editingUserType === "student") {

    updateData.subject_ids =
        selectedSubjectIds;

}


        if (newPassword) {

            updateData.password =
                newPassword;
        }


        // ==========================================
        // UPDATE SUPABASE
        // ==========================================

        const {
            error
        } =
            await supabaseClient
                .from(tableName)
                .update(
                    updateData
                )
                .eq(
                    "id",
                    editingUserId
                );


        if (error) {

            console.error(
                "USER UPDATE ERROR:",
                error
            );

            alert(
                "User could not be updated.\n\n" +
                error.message
            );

            return;
        }


        // ==========================================
        // CLOSE BOTH POSSIBLE MODALS
        // ==========================================

        const modal1 =
            document.getElementById(
                "adminEditUserModal"
            );

        const modal2 =
            document.getElementById(
                "editUserManagementModal"
            );


        if (modal1) {

            modal1.style.display =
                "none";
        }


        if (modal2) {

            modal2.style.display =
                "none";
        }


        // ==========================================
        // CLEAR EDIT STATE
        // ==========================================

        editingUserId =
            null;

        editingUserType =
            "";


        // ==========================================
        // REFRESH USER MANAGEMENT
        // ==========================================

        if (
            typeof renderUserManagementStudents ===
            "function"
        ) {

            await renderUserManagementStudents();
        }


        // ==========================================
        // REFRESH ADMIN STUDENTS
        // ==========================================

        if (
            typeof renderAdminStudents ===
            "function"
        ) {

            await renderAdminStudents();
        }


        // ==========================================
        // REFRESH ADMIN TEACHERS
        // ==========================================

        if (
            typeof renderAdminTeachers ===
            "function"
        ) {

            await renderAdminTeachers();
        }


        // ==========================================
        // REFRESH DASHBOARD
        // ==========================================

        if (
            typeof AdminDashboard !==
            "undefined" &&
            typeof AdminDashboard.refresh ===
            "function"
        ) {

            await AdminDashboard.refresh();
        }


        // ==========================================
        // SUCCESS
        // ==========================================

        alert(
            "User updated successfully. ✅"
        );
    }
);
// ==========================================
// INDIVIDUAL ATTENDANCE
// ==========================================

function openIndividualAttendance(studentId) {

    const students =
        getAdminStudentsForAttendance();

    const student =
        students.find(function(student) {

            return String(student.id) ===
                String(studentId);

        });

    if (!student) {

        alert("Student not found.");

        return;
    }

    openAttendanceMarkingModal([
        student
    ]);

}
/* =========================================================
   EDUPORTAL - STUDENT DASHBOARD FUNCTIONS
   ========================================================= */

const StudentDashboard = {

    /* -------------------------
       Student Data
    ------------------------- */

    getStudent() {
        const student =
            JSON.parse(localStorage.getItem("currentStudent")) ||
            JSON.parse(localStorage.getItem("loggedInStudent"));

        return student || null;
    },


    /* -------------------------
       Dashboard Initialization
    ------------------------- */

  async init() {

    const student = this.getStudent();

    if (!student) {
        console.warn("No logged-in student found.");
        return;
    }

   await Promise.all([

    this.loadProfile(student),
    this.loadDashboard(student),
    this.loadAttendance(student),
    this.loadSubjects(student),
    this.loadResults(student),
    this.loadFees(student),
    this.loadNotices(student)

]);

await this.loadAssignments(student);

await this.loadAssignmentResults(student);
},

/* -------------------------
   Profile - SUPABASE
------------------------- */

async loadProfile(student) {

    if (!student) {
        return;
    }


    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection missing."
        );

        return;
    }


    // ==========================================
    // FIND STUDENT
    // ==========================================

    let dbStudent = null;


    if (student.id) {

        const result =
            await supabaseClient
                .from("students")
                .select("*")
                .eq(
                    "id",
                    student.id
                )
                .maybeSingle();


        if (
            !result.error &&
            result.data
        ) {

            dbStudent =
                result.data;

        }
    }


    // ==========================================
    // TRY STUDENT ID
    // ==========================================

    if (
        !dbStudent &&
        student.studentId
    ) {

        const result =
            await supabaseClient
                .from("students")
                .select("*")
                .eq(
                    "student_id",
                    student.studentId
                )
                .maybeSingle();


        if (
            !result.error &&
            result.data
        ) {

            dbStudent =
                result.data;

        }
    }


    // ==========================================
    // SOURCE
    // ==========================================

    const data =
        dbStudent ||
        student;


    // ==========================================
    // STUDENT INFORMATION
    // ==========================================

    this.setText(
        "profileFullName",
        data.fullName ||
        data.full_name ||
        data.name ||
        "Not Available"
    );


    this.setText(
        "profileFatherName",
        data.fatherName ||
        data.father_name ||
        "Not Available"
    );


  this.setText(
    "profileStudentClass",
    data.student_class ||
    data.studentClass ||
    data.class ||
    "Not Assigned"
);


    this.setText(
        "profileSectionName",
        data.section ||
        "Not Assigned"
    );


    this.setText(
    "profileRollNumber",
    data.rollNumber ||
    data.roll_no ||
    data.rollNo ||
    data.roll_number ||
    data.studentId ||
    data.student_id ||
    "Not Assigned"
);


    this.setText(
        "profileDOB",
        data.dob ||
        data.date_of_birth ||
        "Not Available"
    );


    this.setText(
        "profileEmail",
        data.email ||
        "Not Available"
    );


    this.setText(
        "profileMobile",
        data.mobile ||
        data.phone ||
        data.phone_number ||
        "Not Available"
    );


    // ==========================================
    // PROFILE IMAGE
    // ==========================================

    const image =
        document.getElementById(
            "profileImage"
        );


    const icon =
        document.getElementById(
            "profileIcon"
        );


    const profileImage =
        data.profileImage ||
        data.profile_image ||
        data.photo ||
        data.image ||
        "";


    if (
        image &&
        profileImage
    ) {

        image.src =
            profileImage;

        image.style.display =
            "block";


        if (icon) {

            icon.style.display =
                "none";

        }

    }
    else {

        if (image) {

            image.style.display =
                "none";

        }


        if (icon) {

            icon.style.display =
                "block";

        }

    }

},

    /* -------------------------
   Dashboard Summary - SUPABASE
------------------------- */

async loadDashboard(student) {

    if (!student) {
        return;
    }


    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection missing."
        );

        return;
    }


    // ==========================================
    // FIND STUDENT
    // ==========================================

    let dbStudent = null;


    if (student.id) {

        const result =
            await supabaseClient
                .from("students")
                .select("*")
                .eq(
                    "id",
                    student.id
                )
                .maybeSingle();


        if (
            !result.error &&
            result.data
        ) {

            dbStudent =
                result.data;

        }
    }


    // ==========================================
    // TRY STUDENT ID
    // ==========================================

    if (
        !dbStudent &&
        student.studentId
    ) {

        const result =
            await supabaseClient
                .from("students")
                .select("*")
                .eq(
                    "student_id",
                    student.studentId
                )
                .maybeSingle();


        if (
            !result.error &&
            result.data
        ) {

            dbStudent =
                result.data;

        }
    }


    // ==========================================
    // DATA SOURCE
    // ==========================================

    const data =
        dbStudent ||
        student;


    // ==========================================
    // DASHBOARD HEADER
    // ==========================================

    this.setText(
        "studentDashboardName",
        data.fullName ||
        data.full_name ||
        data.name ||
        "Student"
    );


    this.setText(
        "studentClass",
        data.studentClass ||
        data.class ||
        "N/A"
    );


    this.setText(
        "studentSection",
        data.section ||
        "N/A"
    );


    this.setText(
        "studentRollNo",
        data.rollNumber ||
        data.roll_no ||
        data.rollNo ||
        "N/A"
    );


    // ==========================================
    // OPTIONAL STUDENT ID
    // ==========================================

    const studentIdElement =
        document.getElementById(
            "studentId"
        );


    if (studentIdElement) {

        studentIdElement.textContent =
            data.student_id ||
            data.studentId ||
            "N/A";

    }

},




/* -------------------------
   Attendance - SUPABASE
------------------------- */

async loadAttendance(student) {

    if (!student) {
        return;
    }
    // ==========================================
// SUPABASE CHECK
// ==========================================

if (
    typeof supabaseClient ===
    "undefined"
) {

    console.error(
        "Supabase connection missing."
    );

    this.setText(
        "presentCount",
        0
    );

    this.setText(
        "absentCount",
        0
    );

    this.setText(
        "lateCount",
        0
    );

    this.setText(
        "attendancePercentage",
        "0%"
    );

    this.setText(
        "attendanceStatus",
        "Unable to load attendance"
    );

    return;
}
    // ==========================================
    // FIND STUDENT IN SUPABASE
    // ==========================================

    let dbStudent = null;


    // First try database ID
    if (student.id) {

        const result =
            await supabaseClient
                .from("students")
                .select("id, student_id")
                .eq("id", student.id)
                .maybeSingle();

        if (!result.error && result.data) {
            dbStudent = result.data;
        }
    }


    // If local ID doesn't match,
    // find student using student_id
    if (!dbStudent && student.studentId) {

        const result =
            await supabaseClient
                .from("students")
                .select("id, student_id")
                .eq(
                    "student_id",
                    student.studentId
                )
                .maybeSingle();

        if (!result.error && result.data) {
            dbStudent = result.data;
        }
    }


    // ==========================================
    // NO DATABASE STUDENT
    // ==========================================

    if (!dbStudent) {

        console.warn(
            "Student not found in Supabase."
        );

        this.setText(
            "presentCount",
            0
        );

        this.setText(
            "absentCount",
            0
        );

        this.setText(
            "lateCount",
            0
        );

        this.setText(
            "attendancePercentage",
            "0%"
        );

        this.setText(
            "attendanceStatus",
            "No Attendance Data"
        );

        return;
    }


    // ==========================================
    // GET ATTENDANCE FROM SUPABASE
    // ==========================================

    const {
        data: attendanceRecords,
        error
    } =
        await supabaseClient
            .from("attendance")
            .select(
                "attendance_date, status"
            )
            .eq(
                "student_id",
                dbStudent.id
            );

    // ==========================================
    // COUNT ATTENDANCE
    // ==========================================

    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;


    (attendanceRecords || [])
        .forEach(function(record) {

            const status =
                String(
                    record.status || ""
                ).toLowerCase();


            if (status === "present") {

                present++;

            }
            else if (status === "absent") {

                absent++;

            }
            else if (status === "late") {

                late++;

            }
            else if (status === "leave") {

                leave++;

            }

        });


    // ==========================================
    // ATTENDANCE PERCENTAGE
    // ==========================================

    const total =
        present +
        absent +
        late;


    const percentage =
        total > 0
            ? Math.round(
                (present / total) * 100
            )
            : 0;


    // ==========================================
    // COUNTS
    // ==========================================

    this.setText(
        "presentCount",
        present
    );

    this.setText(
        "absentCount",
        absent
    );

    this.setText(
        "lateCount",
        late
    );


    // ==========================================
    // PERCENTAGE
    // ==========================================

    this.setText(
        "attendancePercentage",
        percentage + "%"
    );


    // ==========================================
    // PROGRESS BAR
    // ==========================================

    const bar =
        document.getElementById(
            "attendanceBar"
        );

    if (bar) {

        bar.style.width =
            percentage + "%";

        bar.setAttribute(
            "aria-valuenow",
            percentage
        );
    }


    // ==========================================
    // STATUS
    // ==========================================

    let status =
        "No Attendance Data";


    if (total > 0) {

        if (percentage >= 90) {

            status = "Excellent";

        }
        else if (percentage >= 75) {

            status = "Good";

        }
        else if (percentage >= 60) {

            status = "Needs Improvement";

        }
        else {

            status = "Low Attendance";

        }
    }


    this.setText(
        "attendanceStatus",
        status
    );

},

  /* -------------------------
    Subjects - SUPABASE
 ------------------------- */

async loadSubjects(student) {

    const container =
        document.getElementById(
            "studentSubjects"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        container.innerHTML = `
            <div class="empty-state">
                Unable to connect with database.
            </div>
        `;
        return;
    }

    if (!student) {
        return;
    }

    // ==========================================
    // FIND DATABASE STUDENT
    // ==========================================

    let dbStudent = null;

    if (student.id) {

        const result =
            await supabaseClient
                .from("students")
                .select("id, student_id, student_class, section, subject_ids")
                .eq(
                    "id",
                    student.id
                )
                .maybeSingle();

        if (
            !result.error &&
            result.data
        ) {
            dbStudent =
                result.data;
        }
    }

    if (
        !dbStudent &&
        student.studentId
    ) {

        const result =
            await supabaseClient
                .from("students")
                .select("id, student_id, student_class, section, subject_ids")
                .eq(
                    "student_id",
                    student.studentId
                )
                .maybeSingle();

        if (
            !result.error &&
            result.data
        ) {
            dbStudent =
                result.data;
        }
    }

    if (!dbStudent) {

        container.innerHTML = `
            <div class="empty-state">
                Student record not found.
            </div>
        `;

        return;
    }

    // ==========================================
    // LOAD ALL SUBJECTS FROM SUPABASE
    // ==========================================

    const {
        data: subjects,
        error
    } =
        await supabaseClient
            .from("subjects")
            .select("*")
            .order(
                "id",
                {
                    ascending: true
                }
            );

    if (error) {

        console.error(
            "STUDENT SUBJECTS ERROR:",
            error
        );

        container.innerHTML = `
            <div class="empty-state">
                Unable to load subjects.
            </div>
        `;

        return;
    }

    // ==========================================
    // NO SUBJECTS
    // ==========================================

    if (
        !subjects ||
        subjects.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-state">
                No subjects available yet.
            </div>
        `;

        return;
    }

 // ==========================================
// FILTER SUBJECTS BY STUDENT CLASS
// ==========================================

const studentClass =
    String(
        dbStudent.student_class ||
        student.studentClass ||
        ""
    )
    .trim()
    .toLowerCase()
    .replace(/^class\s*/i, "")
    .trim();


// ==========================================
// NORMALIZE CLASS
// ==========================================

function normalizeClass(value) {

    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/^class\s*/i, "")
        .replace(/th$/i, "")
        .replace(/st$/i, "")
        .replace(/nd$/i, "")
        .replace(/rd$/i, "")
        .trim();

}


// ==========================================
// STUDENT CLASS
// ==========================================

const normalizedStudentClass =
    normalizeClass(
        dbStudent.student_class ||
        student.studentClass ||
        ""
    );


// ==========================================
// LOAD ONLY STUDENT'S ASSIGNED SUBJECTS
// ==========================================

let assignedSubjectIds = [];

try {

    assignedSubjectIds =
        Array.isArray(dbStudent.subject_ids)
            ? dbStudent.subject_ids
            : JSON.parse(
                dbStudent.subject_ids || "[]"
            );

} catch (error) {

    console.warn(
        "SUBJECT IDS PARSE ERROR:",
        error
    );

    assignedSubjectIds = [];

}


// ==========================================
// NORMALIZE SUBJECT IDS
// ==========================================

assignedSubjectIds =
    assignedSubjectIds
        .map(function(id) {
            return Number(id);
        })
        .filter(function(id) {
            return !isNaN(id);
        });


// ==========================================
// FILTER MANUALLY ASSIGNED SUBJECTS
// ==========================================

const matchingSubjects =
    (subjects || []).filter(
        function(subject) {

            return assignedSubjectIds.includes(
                Number(subject.id)
            );

        }
    );


// ==========================================
// NO ASSIGNED SUBJECTS
// ==========================================

if (
    matchingSubjects.length === 0
) {

    container.innerHTML = `
        <div class="empty-state">
            No subjects assigned to you yet.
        </div>
    `;

    return;
}


// ==========================================
// DISPLAY ASSIGNED SUBJECTS
// ==========================================

matchingSubjects.forEach(
    function(subject) {

        const name =
            subject.name ||
            subject.subject_name ||
            subject.title ||
            "Subject";


        const code =
            subject.code ||
            "";


        const teacher =
            subject.teacher_name ||
            subject.teacher ||
            "";


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "student-data-item";


        item.innerHTML = `
            <div>

                <strong>
                    📚 ${name}
                </strong>

                ${
                    code
                        ? `
                            <small>
                                Code:
                                ${code}
                            </small>
                        `
                        : ""
                }

                ${
                    teacher
                        ? `
                            <small>
                                Teacher:
                                ${teacher}
                            </small>
                        `
                        : ""
                }

            </div>
        `;


        container.appendChild(
            item
        );

    }
);

// ==========================================
// NO MATCHING SUBJECTS
// ==========================================

if (
    matchingSubjects.length === 0
) {

    container.innerHTML = `
        <div class="empty-state">
            No subjects available for your class.
        </div>
    `;

    return;
}


},
/* -------------------------
   Results - SUPABASE
------------------------- */

async loadResults(student) {

    const container =
        document.getElementById(
            "studentResults"
        );

    if (!container) {
        return;
    }


    container.innerHTML = "";


    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection missing."
        );

        return;
    }


    // ==========================================
    // STUDENT CHECK
    // ==========================================

    if (!student) {
        return;
    }


   // ==========================================
// FIND DATABASE STUDENT
// ==========================================

let dbStudent = null;

// Try database ID first
if (student.id) {

    const studentById =
        await supabaseClient
            .from("students")
            .select("id, student_id, subject_ids")
            .eq(
                "id",
                student.id
            )
            .maybeSingle();

    if (
        !studentById.error &&
        studentById.data
    ) {
        dbStudent =
            studentById.data;
    }
}

// Try Student ID if database ID did not match
if (
    !dbStudent &&
    student.studentId
) {

    const studentByCode =
        await supabaseClient
            .from("students")
           .select("id, student_id, subject_ids")
            .eq(
                "student_id",
                student.studentId
            )
            .maybeSingle();

    if (
        !studentByCode.error &&
        studentByCode.data
    ) {
        dbStudent =
            studentByCode.data;
    }
}

// Student not found
if (!dbStudent) {

    console.error(
        "Student not found in Supabase:",
        student
    );

    container.innerHTML = `
        <div class="empty-state">
            Student record not found.
        </div>
    `;

    return;
}

// ==========================================
// LOAD RESULTS
// ==========================================

const {
    data: results,
    error
} =
    await supabaseClient
        .from("results")
        .select("*")
        .eq(
            "student_id",
            dbStudent.id
        )
        .order(
            "id",
            {
                ascending: false
            }
        );


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        console.error(
            "STUDENT RESULTS ERROR:",
            error
        );

        container.innerHTML = `
            <div class="empty-state">
                Unable to load results.
            </div>
        `;

        return;
    }


    // ==========================================
    // NO RESULTS
    // ==========================================
// ==========================================
// CLEAN RESULT DATA
// ==========================================

const validResults =
    (results || []).filter(function(result) {

        return (
            result.subject_id !== null &&
            result.subject_id !== undefined
        );

    });

// Keep only the latest result for each subject
const latestResults = [];

const seenSubjects = new Set();

validResults.forEach(function(result) {

    const subjectKey =
        String(result.subject_id);

    if (
        !seenSubjects.has(subjectKey)
    ) {

        seenSubjects.add(subjectKey);

        latestResults.push(result);

    }

});

if (
    !latestResults ||
    latestResults.length === 0
) {

    this.setText(
        "totalMarks",
        0
    );

    this.setText(
        "obtainedMarks",
        0
    );

    this.setText(
        "percentage",
        "0%"
    );

    this.setText(
        "grade",
        "-"
    );

    this.setText(
        "resultStatus",
        "No Result"
    );

    container.innerHTML = `
        <div class="empty-state">
            No results available yet.
        </div>
    `;
}


    // ==========================================
// LOAD ALL SUBJECTS FROM SUPABASE
// ==========================================

const {
    data: allSubjects,
    error: subjectsError
} =
    await supabaseClient
        .from("subjects")
        .select("*")
        .order(
            "id",
            {
                ascending: true
            }
        );


if (subjectsError) {

    console.error(
        "SUBJECTS LOAD ERROR:",
        subjectsError
    );

    container.innerHTML = `
        <div class="empty-state">
            Unable to load subjects for results.
        </div>
    `;

    return;
}


// ==========================================
// SHOW ONLY STUDENT'S ASSIGNED SUBJECTS
// ==========================================

let assignedSubjectIds = [];

try {

    assignedSubjectIds =
        Array.isArray(dbStudent.subject_ids)
            ? dbStudent.subject_ids
            : JSON.parse(
                dbStudent.subject_ids || "[]"
            );

} catch (error) {

    console.warn(
        "ASSIGNED SUBJECT IDS ERROR:",
        error
    );

    assignedSubjectIds = [];

}


// Normalize IDs
assignedSubjectIds =
    assignedSubjectIds
        .map(function(id) {
            return Number(id);
        })
        .filter(function(id) {
            return !isNaN(id);
        });


// Filter subjects
const subjects =
    (allSubjects || []).filter(
        function(subject) {

            return assignedSubjectIds.includes(
                Number(subject.id)
            );

        }
    );

console.log(
    "Student Assigned Result Subjects:",
    subjects
);
// ==========================================
// MAP LATEST RESULT WITH SUBJECT
// ==========================================

const resultMap = {};

latestResults.forEach(
    function(result) {

        const key =
            String(
                result.subject_id
            );

        if (
            !resultMap[key]
        ) {

            resultMap[key] =
                result;

        }

    }
);


// ==========================================
// CREATE RESULT ENTRY FOR EVERY SUBJECT
// ==========================================

const cleanResults =
    subjects.map(
        function(subject) {

            const result =
                resultMap[
                    String(subject.id)
                ] || null;


            return {

                subject_id:
                    subject.id,

                subject_name:
                    subject.name ||
                    subject.subject_name ||
                    subject.title ||
                    "Subject",

                subject_code:
                    subject.code ||
                    "",

                marks:
                    result
                        ? (
                            result.marks ??
                            result.obtained_marks ??
                            0
                        )
                        : 0,

                total_marks:
                    result
                        ? (
                            result.total_marks ??
                            0
                        )
                        : 0,

                percentage:
                    result
                        ? (
                            result.percentage ??
                            0
                        )
                        : 0,

                grade:
                    result
                        ? (
                            result.grade ||
                            "-"
                        )
                        : "-",

                remarks:
                    result
                        ? (
                            result.remarks ||
                            ""
                        )
                        : ""

            };

        }
    );


// ==========================================
// RESULT SUBJECT COUNT
// ==========================================

console.log(
    "Student Subjects:",
    cleanResults
);
    // ==========================================
    // TOTAL RESULT
    // ==========================================

    let obtainedMarks = 0;
    let totalMarks = 0;


cleanResults.forEach(
    function(result) {

        obtainedMarks +=
            Number(
                result.marks ||
                result.obtained_marks ||
                0
            );

        totalMarks +=
            Number(
                result.total_marks ||
                0
            );

    }
);


    const percentage =
        totalMarks > 0
            ? Math.round(
                (
                    obtainedMarks /
                    totalMarks
                ) * 100
            )
            : 0;


    // ==========================================
    // OVERALL GRADE
    // ==========================================

    let grade = "-";


    if (percentage >= 90) {
        grade = "A+";
    }
    else if (percentage >= 80) {
        grade = "A";
    }
    else if (percentage >= 70) {
        grade = "B";
    }
    else if (percentage >= 60) {
        grade = "C";
    }
    else if (percentage >= 50) {
        grade = "D";
    }
    else if (totalMarks > 0) {
        grade = "F";
    }


 const status =
    totalMarks === 0
        ? "No Result"
        : (
            percentage >= 40
                ? "Passed"
                : "Failed"
        );


// ==========================================
// UPDATE REAL RESULT SUMMARY
// ==========================================

// TOTAL MARKS

this.setText(
    "totalMarks",
    totalMarks
);


// OBTAINED MARKS

this.setText(
    "obtainedMarks",
    obtainedMarks
);


// PERCENTAGE

this.setText(
    "percentage",
    percentage + "%"
);


// GRADE

this.setText(
    "grade",
    grade
);


// STATUS

this.setText(
    "resultStatus",
    status === "No Result"
        ? "No Result"
        : (
            status === "Passed"
                ? "Pass ✅"
                : "Failed ❌"
        )
);
// ==========================================
// DISPLAY RESULTS
// ==========================================

container.innerHTML = "";

cleanResults.forEach(
    function(result) {

        const subject =
            result.subject_name ||
            "Subject";

        const code =
            result.subject_code ||
            "";

        const marks =
            Number(
                result.marks ||
                0
            );

        const total =
            Number(
                result.total_marks ||
                0
            );

        const subjectPercentage =
            total > 0
                ? Math.round(
                    (
                        marks /
                        total
                    ) * 100
                )
                : 0;

        let subjectGrade = "-";

        if (total > 0) {

            if (
                subjectPercentage >= 90
            ) {
                subjectGrade = "A+";
            }
            else if (
                subjectPercentage >= 80
            ) {
                subjectGrade = "A";
            }
            else if (
                subjectPercentage >= 70
            ) {
                subjectGrade = "B";
            }
            else if (
                subjectPercentage >= 60
            ) {
                subjectGrade = "C";
            }
            else if (
                subjectPercentage >= 50
            ) {
                subjectGrade = "D";
            }
            else {
                subjectGrade = "F";
            }

        }


        const item =
            document.createElement(
                "div"
            );

        item.className =
            "student-data-item";


        item.innerHTML = `
            <div>

                <strong>
                    ${subject}
                </strong>

                ${
                    code
                        ? `
                            <small>
                                ${code}
                            </small>
                        `
                        : ""
                }

                <small>
                    ${marks}
                    /
                    ${total}

                    &nbsp; • &nbsp;

                    ${subjectPercentage}%
                </small>

                ${
                    result.remarks
                        ? `
                            <small>
                                Remarks:
                                ${result.remarks}
                            </small>
                        `
                        : ""
                }

            </div>


            <span
                class="status-badge"
            >
                ${subjectGrade}
            </span>
        `;


        container.appendChild(
            item
        );

    }
);

}};
 /* -------------------------
   Assignments
------------------------- */
StudentDashboard.loadAssignments = async function(student) {

    const container =
        document.getElementById("studentAssignments");

    if (!container) {
        return;
    }

    if (typeof supabaseClient === "undefined") {
        console.error("Supabase connection missing.");
        return;
    }

    const studentClass =
        student?.studentClass ||
        student?.class_name ||
        student?.className ||
        "";

    let query = supabaseClient
        .from("assignments")
        .select(
            "id, title, subject, due_date, marks, description, class_name, status, teacher_name"
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );

    if (studentClass) {

        query = query.eq(
            "class_name",
            studentClass
        );

    }

    const {
        data: assignments,
        error
    } = await query;


    if (error) {

        console.error(
            "Assignments Error:",
            error
        );

        container.innerHTML = `
            <div class="student-assignment-empty">

                <div class="student-assignment-empty-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to Load Assignments
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;

        return;
    }


    const list =
        assignments || [];


    container.innerHTML = "";


    const total =
        list.length;


    const totalHeader =
        document.getElementById(
            "studentAssignmentTotal"
        );

    const totalStat =
        document.getElementById(
            "studentAssignmentTotalStat"
        );


    if (totalHeader) {
        totalHeader.textContent =
            total;
    }


    if (totalStat) {
        totalStat.textContent =
            total;
    }


    let pending = 0;
    let submitted = 0;
    let overdue = 0;


    list.forEach(
        function (assignment) {

            const status =
                String(
                    assignment.status ||
                    "pending"
                ).toLowerCase();


            if (status === "completed") {

                submitted++;

            }
            else if (
                assignment.due_date &&
                new Date(
                    assignment.due_date
                ) < new Date()
            ) {

                overdue++;

            }
            else {

                pending++;

            }

        }
    );


    const pendingElement =
        document.getElementById(
            "studentAssignmentPending"
        );

    const submittedElement =
        document.getElementById(
            "studentAssignmentSubmitted"
        );

    const overdueElement =
        document.getElementById(
            "studentAssignmentOverdue"
        );


    if (pendingElement) {
        pendingElement.textContent =
            pending;
    }


    if (submittedElement) {
        submittedElement.textContent =
            submitted;
    }


    if (overdueElement) {
        overdueElement.textContent =
            overdue;
    }


    if (list.length === 0) {

        container.innerHTML = `
            <div class="student-assignment-empty">

                <div class="student-assignment-empty-icon">
                    📚
                </div>

                <h3>
                    No Assignments Found
                </h3>

                <p>
                    There are currently no assignments
                    available for your class.
                </p>

            </div>
        `;

        return;
    }


    list.forEach(
        function (assignment) {

            const title =
                assignment.title ||
                "Assignment";


            const subject =
                assignment.subject ||
                "General";


            const dueDate =
                assignment.due_date ||
                "N/A";


            const marks =
                assignment.marks ??
                0;


            const description =
                assignment.description ||
                "No description provided.";


            const teacher =
                assignment.teacher_name ||
                "Teacher";


            let status =
                String(
                    assignment.status ||
                    "pending"
                ).toLowerCase();


            if (
                status !== "completed" &&
                dueDate !== "N/A" &&
                new Date(dueDate) < new Date()
            ) {

                status =
                    "overdue";

            }


            let statusText =
                "Pending";


            let statusClass =
                "";


            if (
                status === "completed"
            ) {

                statusText =
                    "Submitted";

                statusClass =
                    "submitted";

            }
            else if (
                status === "overdue"
            ) {

                statusText =
                    "Overdue";

                statusClass =
                    "overdue";

            }


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "student-assignment-card";


            card.dataset.assignmentId =
                assignment.id;


            card.innerHTML = `

                <div
                    class="student-assignment-card-top"
                >

                    <div>

                        <h3
                            class="student-assignment-title"
                        >
                            ${title}
                        </h3>

                        <div
                            class="student-assignment-subject"
                        >
                            📘 ${subject}
                        </div>

                    </div>


                    <span
                        class="
                            student-assignment-status
                            ${statusClass}
                        "
                    >
                        ${statusText}
                    </span>

                </div>


                <p
                    class="student-assignment-description"
                >
                    ${description}
                </p>


                <div
                    class="student-assignment-meta"
                >

                    <div
                        class="student-assignment-meta-item"
                    >

                        <small>
                            📅 Due Date
                        </small>

                        <strong>
                            ${dueDate}
                        </strong>

                    </div>


                    <div
                        class="student-assignment-meta-item"
                    >

                        <small>
                            🎯 Marks
                        </small>

                        <strong>
                            ${marks}
                        </strong>

                    </div>


                    <div
                        class="student-assignment-meta-item"
                    >

                        <small>
                            📚 Subject
                        </small>

                        <strong>
                            ${subject}
                        </strong>

                    </div>

                </div>


                <div
                    class="student-assignment-teacher"
                >

                    <div
                        class="
                            student-assignment-teacher-avatar
                        "
                    >
                        👨‍🏫
                    </div>

                    <span>
                        Teacher:
                        <strong>
                            ${teacher}
                        </strong>
                    </span>

                </div>


                <div
                    class="student-assignment-actions"
                >

                    <button
                        type="button"
                        class="
                            student-assignment-view-btn
                            view-assignment-btn
                        "
                        data-assignment-id="${assignment.id}"
                    >
                        👁 View Assignment
                    </button>


                    <button
                        type="button"
                        class="
                            student-assignment-submit-btn
                            submit-assignment-btn
                        "
                        data-assignment-id="${assignment.id}"
                    >
                        📤 Submit Assignment
                    </button>

                </div>

            `;


            container.appendChild(
                card
            );

        }
    );

};
/* -------------------------
   Assignment Results
------------------------- */

StudentDashboard.loadAssignmentResults = async function(student) {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        return;
    }

// ==========================================
// FIND SUPABASE STUDENT ID
// ==========================================

let studentDbId =
    student?.id ||
    null;


// ==========================================
// VERIFY STUDENT ID IN SUPABASE
// ==========================================

if (studentDbId) {

    const {
        data: dbStudent
    } =
        await supabaseClient
            .from("students")
            .select("id")
            .eq(
                "id",
                studentDbId
            )
            .maybeSingle();


    if (dbStudent) {

        studentDbId =
            dbStudent.id;

    }
    else {

        studentDbId =
            null;

    }

}


// ==========================================
// FALLBACK TO STUDENT ID
// ==========================================

if (
    !studentDbId &&
    student?.studentId
) {

    const {
        data: dbStudent,
        error: studentError
    } =
        await supabaseClient
            .from("students")
            .select("id")
            .eq(
                "student_id",
                String(
                    student.studentId
                )
            )
            .maybeSingle();


    if (
        studentError ||
        !dbStudent
    ) {

        console.error(
            "ASSIGNMENT RESULT STUDENT LOOKUP ERROR:",
            studentError
        );

        return;
    }


    studentDbId =
        dbStudent.id;

}


if (!studentDbId) {

    console.warn(
        "Supabase student ID not found."
    );

    return;
}

    const {
        data: submissions,
        error
    } =
        await supabaseClient
            .from(
                "assignment_submissions"
            )
            .select(
                "assignment_id, marks, teacher_feedback, status"
            )
           .eq(
    "student_id",
    Number(studentDbId)
);

    if (error) {

        console.error(
            "ASSIGNMENT RESULTS ERROR:",
            error
        );

        return;
    }

    if (!submissions) {
        return;
    }

    submissions.forEach(
        function(submission) {

            const card =
                document.querySelector(
                    `.assignment-card[data-assignment-id="${submission.assignment_id}"]`
                );

            if (!card) {
                return;
            }

            const oldResult =
                card.querySelector(
                    ".student-assignment-result"
                );

            if (oldResult) {
                oldResult.remove();
            }

            const result =
                document.createElement(
                    "div"
                );

            result.className =
                "student-assignment-result";

            result.innerHTML = `

                <div>
                    📤 Status:
                    <strong>
                        ${
                            submission.status ||
                            "Submitted"
                        }
                    </strong>
                </div>

                ${
                    submission.marks !== null &&
                    submission.marks !== undefined
                        ? `
                            <div>
                                🎯 Marks:
                                <strong>
                                    ${submission.marks}
                                </strong>
                            </div>
                        `
                        : ""
                }

                ${
                    submission.teacher_feedback
                        ? `
                            <div>
                                💬 Teacher Feedback:
                                <strong>
                                    ${submission.teacher_feedback}
                                </strong>
                            </div>
                        `
                        : ""
                }

            `;

            card.appendChild(
                result
            );

        }
    );
};

/* -------------------------
   Fees - SUPABASE
------------------------- */

StudentDashboard.loadFees = async function(student) {

    // ==========================================
    // DEFAULT VALUES
    // ==========================================

    let total = 0;
    let paid = 0;


    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection missing."
        );

        return;
    }


    // ==========================================
    // STUDENT CHECK
    // ==========================================

    if (!student) {
        return;
    }


    // ==========================================
    // FIND STUDENT IN SUPABASE
    // ==========================================

    let dbStudent = null;


    if (student.id) {

        const result =
            await supabaseClient
                .from("students")
                .select("*")
                .eq(
                    "id",
                    student.id
                )
                .maybeSingle();


        if (
            !result.error &&
            result.data
        ) {

            dbStudent =
                result.data;

        }
    }


    // ==========================================
    // TRY STUDENT ID
    // ==========================================

    if (
        !dbStudent &&
        student.studentId
    ) {

        const result =
            await supabaseClient
                .from("students")
                .select("*")
                .eq(
                    "student_id",
                    student.studentId
                )
                .maybeSingle();


        if (
            !result.error &&
            result.data
        ) {

            dbStudent =
                result.data;

        }
    }


    // ==========================================
// GET FEE DATA FROM SUPABASE
// ==========================================

const studentDbId =
    dbStudent?.id ||
    student.id;


// ==========================================
// LOAD FEE RECORDS
// ==========================================

const {
    data: feeRecords,
    error: feeError
} =
    await supabaseClient
        .from("fee_records")
      .select(
    "fee_amount, paid_amount, remaining_amount, status, month, due_date, payment_method"
)
        .eq(
            "student_id",
            Number(studentDbId)
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


// ==========================================
// ERROR
// ==========================================

if (feeError) {

    console.error(
        "STUDENT FEE ERROR:",
        feeError
    );

    return;
}


// ==========================================
// CALCULATE TOTAL FEES
// ==========================================

total = 0;
paid = 0;

const records =
    feeRecords || [];

records.forEach(function(record) {

    total += Number(
        record.fee_amount || 0
    );

    paid += Number(
        record.paid_amount || 0
    );

});


// ==========================================
// DATABASE REMAINING FEE
// ==========================================

const databaseRemaining =
    records.reduce(
        function(sum, record) {

            return sum +
                Number(
                    record.remaining_amount ??
                    Math.max(
                        0,
                        Number(
                            record.fee_amount || 0
                        ) -
                        Number(
                            record.paid_amount || 0
                        )
                    )
                );

        },
        0
    );


// ==========================================
// REMAINING
// ==========================================

const remaining =
    Math.max(
        0,
        databaseRemaining
    );


// ==========================================
// STATUS
// ==========================================

let status =
    "Pending";

if (total <= 0) {

    status =
        "No Fee";

}
else if (paid >= total) {

    status =
        "Paid";

}
else if (paid > 0) {

    status =
        "Partially Paid";

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

this.setText(
    "totalFee",
    total
);

this.setText(
    "paidFee",
    paid
);

this.setText(
    "remainingFee",
    remaining
);


// ==========================================
// FEE STATUS
// ==========================================

const statusElement =
    document.getElementById(
        "studentFeeStatus"
    );

if (statusElement) {

    statusElement.textContent =
        status;

}

// ==========================================
// DUE DATE
// ==========================================

const latestFeeRecord =
    records.find(function(record) {
        return record.due_date;
    }) || records[0] || null;



const dueDateElement =
    document.getElementById(
        "feeDueDate"
    );

if (dueDateElement) {

    if (
        latestFeeRecord &&
        latestFeeRecord.due_date
    ) {

        const dueDate =
            new Date(
                latestFeeRecord.due_date
            );

        dueDateElement.textContent =
            dueDate.toLocaleDateString(
                "en-GB",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );

    } else {

        dueDateElement.textContent =
            "-";

    }

}

// ==========================================
// PAYMENT METHOD
// ==========================================

const paymentMethodElement =
    document.getElementById(
        "paymentMethod"
    );


if (paymentMethodElement) {

    paymentMethodElement.textContent =
        (
            latestFeeRecord &&
            latestFeeRecord.payment_method
        )
            ? latestFeeRecord.payment_method
            : "Cash";

}


};
// ==========================================
// FEE LIST + PAY BUTTON - NEW ADDITION
// ==========================================

let feeListContainer =
    document.getElementById("studentFeeRecordsList");

// Agar container HTML me nahi hai to khud bana lo
if (!feeListContainer) {

    const feeSection =
        document.getElementById("feeSection");

    if (feeSection) {

        feeListContainer =
            document.createElement("div");

        feeListContainer.id =
            "studentFeeRecordsList";

        feeListContainer.style.marginTop = "20px";

        feeSection.appendChild(feeListContainer);
    }
}

if (feeListContainer) {

    feeListContainer.innerHTML = "";

const records = [];

    records.forEach(function (record) {

        const remainingAmt =
            Number(
                record.remaining_amount ??
                Math.max(
                    0,
                    Number(record.fee_amount || 0) -
                    Number(record.paid_amount || 0)
                )
            );

        const item =
            document.createElement("div");

        item.className = "student-data-item";

        item.innerHTML = `
            <div>
                <strong>${record.month || "Month"}</strong>
                <small>Total: Rs. ${Number(record.fee_amount || 0).toLocaleString()}</small>
                <small>Paid: Rs. ${Number(record.paid_amount || 0).toLocaleString()}</small>
                <small>Remaining: Rs. ${remainingAmt.toLocaleString()}</small>
            </div>
            ${
                remainingAmt > 0
                    ? `<button type="button" class="student-fee-pay-btn" data-fee-record-id="${record.id}" data-remaining="${remainingAmt}">💳 Submit Fee</button>`
                    : `<span class="status-badge">Paid ✅</span>`
            }
        `;

        feeListContainer.appendChild(item);
    });
}
/* -------------------------
   Notices - SUPABASE
------------------------- */

StudentDashboard.loadNotices = async function(student) {

const container =
    document.getElementById(
        "studentNotices"
    );

if (!container) {
    console.warn(
        "studentNotices element NOT FOUND"
    );
    return;
}


    container.innerHTML = "";


    // ==========================================
    // SUPABASE CHECK
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        console.error(
            "Supabase connection missing."
        );

        container.innerHTML = `
            <div class="empty-state">
                Unable to load notices.
            </div>
        `;

        return;
    }


  // ==========================================
// FIND DATABASE STUDENT
// ==========================================

let dbStudent = null;


// ==========================================
// TRY DATABASE ID
// ==========================================

if (student?.id) {

    const {
        data,
        error: studentError
    } =
        await supabaseClient
            .from("students")
            .select(
                "id, student_id, student_class, class, section"
            )
            .eq(
                "id",
                student.id
            )
            .maybeSingle();


    if (!studentError && data) {

        dbStudent =
            data;

    }

}


// ==========================================
// TRY STUDENT ID
// ==========================================

if (
    !dbStudent &&
    student?.studentId
) {

    const {
        data,
        error: studentError
    } =
        await supabaseClient
            .from("students")
            .select(
                "id, student_id, student_class, class, section"
            )
            .eq(
                "student_id",
                String(
                    student.studentId
                )
            )
            .maybeSingle();


    if (!studentError && data) {

        dbStudent =
            data;

    }

}


// ==========================================
// LOAD NOTICES
// ==========================================

const {
    data: allNotices,
    error
} =
    await supabaseClient
        .from("notices")
        .select("*")
        .order(
            "created_at",
            {
                ascending: false
            }
        );

// ==========================================
// FILTER NOTICES FOR STUDENT
// ==========================================

const studentClass =
    String(
        dbStudent?.student_class ||
        dbStudent?.class ||
        student?.studentClass ||
        student?.class ||
        ""
    )
    .trim()
    .toLowerCase();


const studentId =
    String(
        dbStudent?.id ||
        student?.id ||
        ""
    )
    .trim();


const studentCode =
    String(
        dbStudent?.student_id ||
        student?.studentId ||
        ""
    )
    .trim();


const notices =
    (allNotices || []).filter(
        function(notice) {

            const audience =
                String(
                    notice.audience ||
                    "All"
                )
                .trim()
                .toLowerCase();


            // -------------------------------
            // ALL STUDENTS
            // -------------------------------

            if (
                audience === "all" ||
                audience === "all students" ||
                audience === "everyone"
            ) {

                return true;

            }


            // -------------------------------
            // STUDENT ID
            // -------------------------------

            if (
                audience ===
                studentId.toLowerCase() ||

                audience ===
                studentCode.toLowerCase()
            ) {

                return true;

            }


            // -------------------------------
            // CLASS
            // -------------------------------

            if (
                studentClass &&
                (
                    audience ===
                    studentClass ||

                    audience ===
                    "class " +
                    studentClass
                )
            ) {

                return true;

            }


            return false;

        }
    );
    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        console.error(
            "STUDENT NOTICES ERROR:",
            error
        );

        container.innerHTML = `
            <div class="empty-state">
                Unable to load notices.
            </div>
        `;

        this.setText(
            "noticeCount",
            "0"
        );

        return;
    }


    // ==========================================
    // EMPTY
    // ==========================================

    if (
        !notices ||
        notices.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-state">
                No new notices available.
            </div>
        `;

        this.setText(
            "noticeCount",
            "0"
        );

        return;
    }


    // ==========================================
    // NOTICE COUNT
    // ==========================================

    this.setText(
        "noticeCount",
        notices.length
    );


    // ==========================================
    // DISPLAY NOTICES
    // ==========================================

    notices.forEach(
        function(notice) {

            const title =
                notice.title ||
                notice.heading ||
                "Notice";


            const message =
                notice.message ||
                notice.description ||
                "";


            const date =
                notice.date ||
                notice.created_at ||
                "";


            const priority =
                String(
                    notice.priority ||
                    "Normal"
                ).toLowerCase();


            let priorityLabel =
                "Normal";


            if (
                priority ===
                "high"
            ) {

                priorityLabel =
                    "Important";

            }
            else if (
                priority ===
                "low"
            ) {

                priorityLabel =
                    "General";

            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "student-data-item";


            item.innerHTML = `

                <div>

                    <strong>
                        ${title}
                    </strong>

                    <small>
                        ${message}
                    </small>

                    ${
                        date
                            ? `
                                <small>
                                    ${date}
                                </small>
                            `
                            : ""
                    }

                </div>


                <span
                    class="status-badge ${
                        priority === "high"
                            ? "status-danger"
                            : priority === "low"
                                ? "status-info"
                                : ""
                    }"
                >
                    ${priorityLabel}
                </span>

            `;


            container.appendChild(
                item
            );

        }
    );

};
    /* -------------------------
       Utility
    ------------------------- */

   StudentDashboard.setText = function(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value;
    }

};
// ==========================================
// STUDENT SUBMIT ASSIGNMENT
// ==========================================

document.addEventListener(
    "click",
    async function (event) {

        const button =
            event.target.closest(
                ".submit-assignment-btn"
            );

        if (!button) {
            return;
        }

        const assignmentId =
            button.dataset.assignmentId;

        if (!assignmentId) {
            return;
        }

        const student =
            JSON.parse(
                localStorage.getItem(
                    "loggedInStudent"
                )
            ) || {};

        const studentId =
            student.id ||
            student.studentId ||
            "";

        const studentName =
    student.name ||
    student.full_name ||
    student.studentName ||
    student.student_name ||
    "Student";

const studentRollNumber =
    student.rollNumber ||
    student.roll_number ||
    "";

        if (!studentId) {
            alert(
                "Student information not found."
            );
            return;
        }

       // ==========================================
// CHECK IF STUDENT ALREADY SUBMITTED
// ==========================================

const {
    data: existingSubmission,
    error: existingSubmissionError
} = await supabaseClient
    .from("assignment_submissions")
    .select("id, status")
    .eq(
        "assignment_id",
        Number(assignmentId)
    )
    .eq(
        "student_id",
        Number(studentId)
    )
    .limit(1);

if (existingSubmissionError) {

    console.error(
        "SUBMISSION CHECK ERROR:",
        existingSubmissionError
    );

    alert(
        "Unable to check previous submission.\n\n" +
        existingSubmissionError.message
    );

    return;
}


// ==========================================
// ALREADY SUBMITTED
// ==========================================

if (
    existingSubmission &&
    existingSubmission.length > 0
) {

    alert(
        "You have already submitted this assignment. ❌\n\n" +
        "You cannot submit it again."
    );

    return;
}


// ==========================================
// NEW SUBMISSION
// ==========================================

const submissionText =
    prompt(
        "Enter your assignment submission:"
    );

        if (submissionText === null) {
            return;
        }

        if (!submissionText.trim()) {
            alert(
                "Please enter your submission."
            );
            return;
        }

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            alert(
                "Supabase connection is missing."
            );
            return;
        }

        const {
            data,
            error
        } =
            await supabaseClient
                .from(
                    "assignment_submissions"
                )
                .insert([
                    {
                        assignment_id:
                            Number(
                                assignmentId
                            ),

                        student_id:
                            Number(
                                studentId
                            ),

                       student_name:
    studentName,

roll_number:
    studentRollNumber,

submission_text:
    submissionText,

                        status:
                            "Submitted"
                    }
                ])
                .select()
                .single();

        if (error) {

            console.error(
                "SUBMISSION ERROR:",
                error
            );

            alert(
                "Submission failed:\n" +
                error.message
            );

            return;
        }
// ==========================================
        // NEW: UPDATE ASSIGNMENT STATUS
        // ==========================================

        await supabaseClient
            .from("assignments")
            .update({
                status: "Submitted"
            })
            .eq(
                "id",
                Number(assignmentId)
            );
        alert(
            "✅ Assignment submitted successfully!"
        );

    }
);
// ==========================================
// STUDENT VIEW ASSIGNMENT
// ==========================================

document.addEventListener(
    "click",
    async function (event) {

        const button =
            event.target.closest(
                ".view-assignment-btn"
            );

        if (!button) {
            return;
        }

        const assignmentId =
            button.dataset.assignmentId;

        if (!assignmentId) {
            return;
        }

        const {
            data: assignment,
            error
        } =
            await supabaseClient
                .from("assignments")
                .select("*")
                .eq(
                    "id",
                    assignmentId
                )
                .single();

        if (error) {

            console.error(
                "Assignment View Error:",
                error
            );

            alert(
                "Unable to load assignment."
            );

            return;
        }

        alert(
            "📚 " +
            (assignment.title || "Assignment") +
            "\n\n" +
            "Subject: " +
            (assignment.subject || "—") +
            "\n\n" +
            "Teacher: " +
            (assignment.teacher_name || "—") +
            "\n\n" +
            "Due Date: " +
            (assignment.due_date || "—") +
            "\n\n" +
            "Marks: " +
            (assignment.marks ?? 0) +
            "\n\n" +
            "Description:\n" +
            (
                assignment.description ||
                "No description provided."
            )
        );

    }
);

/* =========================================================
   AUTO INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        StudentDashboard.init();

    }
);
/* =========================================================
   STUDENT DASHBOARD - FINAL MODULE NAVIGATION
========================================================= */

StudentDashboard.openModule = function (moduleName) {

    const topHeader =
        document.getElementById("topHeader");


    const dashboardHome = [

        "studentIdCardSection",

        "welcomeBanner",

        "dashboardCards",

        "analyticsSection",

        "quickSection",

        "notificationPanel"

    ];


    const sections = [

        "profileSection",

        "attendanceSection",

        "subjectsSection",

        "resultsSection",

        "assignmentsSection",

        "feeSection",

        "settingsSection"

    ];


    /* -----------------------------------------
       HIDE DASHBOARD HOME
    ----------------------------------------- */

    dashboardHome.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.style.display = "none";

        }

    });


    /* -----------------------------------------
       HIDE ALL MODULES
    ----------------------------------------- */

    sections.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.style.display = "none";

        }

    });


    /* -----------------------------------------
       REMOVE ACTIVE SIDEBAR
    ----------------------------------------- */

    document
        .querySelectorAll(
            "#studentDashboard .sidebar ul li"
        )
        .forEach(function (item) {

            item.classList.remove("active");

        });


    /* -----------------------------------------
       DASHBOARD
    ----------------------------------------- */

    if (moduleName === "dashboard") {

        if (topHeader) {

            topHeader.style.display = "flex";

        }


        const idCard =
            document.getElementById(
                "studentIdCardSection"
            );

        const welcome =
            document.getElementById(
                "welcomeBanner"
            );

        const cards =
            document.querySelector(
                "#studentDashboard .dashboard-cards"
            );

        const analytics =
            document.getElementById(
                "analyticsSection"
            );

        const quick =
            document.getElementById(
                "quickSection"
            );


        if (idCard) {
            idCard.style.display = "flex";
        }

        if (welcome) {
            welcome.style.display = "flex";
        }

        if (cards) {
            cards.style.display = "grid";
        }

        if (analytics) {
            analytics.style.display = "grid";
        }

        if (quick) {
            quick.style.display = "block";
        }


        const dashboardMenu =
            document.getElementById(
                "dashboardMenu"
            );

        if (dashboardMenu) {

            dashboardMenu.classList.add(
                "active"
            );

        }


        this.loadDashboard(
            this.getStudent()
        );

        return;

    }


    /* -----------------------------------------
       OTHER MODULES
    ----------------------------------------- */

    if (topHeader) {

        topHeader.style.display = "none";

    }


    const target =
        document.getElementById(
            moduleName + "Section"
        );


    if (target) {

        target.style.display = "block";

    }


    const menuItem =
        document.querySelector(
            `#studentDashboard .sidebar li[data-module="${moduleName}"]`
        );


    if (menuItem) {

        menuItem.classList.add("active");

    }


    /* -----------------------------------------
       LOAD MODULE DATA
    ----------------------------------------- */

    const student =
        this.getStudent();


    switch (moduleName) {

        case "profile":

            this.loadProfile(student);

            break;


        case "attendance":

            this.loadAttendance(student);

            break;


        case "subjects":

            this.loadSubjects(student);

            break;


        case "results":

            this.loadResults(student);

            break;


        case "assignments":

            this.loadAssignments(student);

            break;


        case "fee":

            this.loadFees(student);

            break;


        case "settings":

            if (
                typeof loadStudentAccountSettings ===
                "function"
            ) {

                loadStudentAccountSettings();

            }

            break;

    }

};
/* =========================================================
   SIDEBAR CLICK HANDLER
   ========================================================= */

document.addEventListener("click", function (event) {

    const menuItem =
        event.target.closest(
            "#studentDashboard .sidebar li[data-module]"
        );

    if (!menuItem) return;

    const moduleName =
        menuItem.dataset.module;

    if (!moduleName) return;

    StudentDashboard.openModule(moduleName);

});
/* =========================================================
   STUDENT ACCOUNT SETTINGS
   USERNAME + PASSWORD SYNC WITH ADMIN
   ========================================================= */

async function loadStudentAccountSettings() {

    let student = null;

    try {

        student =
            JSON.parse(
                localStorage.getItem(
                    "loggedInStudent"
                )
            ) ||
            JSON.parse(
                localStorage.getItem(
                    "studentAccount"
                )
            );

    } catch (error) {

        console.error(
            "Student settings error:",
            error
        );

        return;
    }


    if (!student) {
        return;
    }


    const usernameInput =
        document.getElementById(
            "settingsUsername"
        );

    const currentPasswordInput =
        document.getElementById(
            "settingsCurrentPassword"
        );


    // ==========================================
    // FIRST: SHOW SAVED LOCAL ACCOUNT DATA
    // ==========================================

    if (usernameInput) {

        usernameInput.value =
            student.username ||
            student.userName ||
            "";

        usernameInput.readOnly =
            true;
    }


    if (currentPasswordInput) {

        currentPasswordInput.value =
            student.password ||
            "";

    }


    // ==========================================
    // THEN: GET LATEST DATA FROM SUPABASE
    // ==========================================

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        return;
    }


    try {

        let dbStudent = null;


        // Search by database ID
        if (student.id) {

            const result =
                await supabaseClient
                    .from("students")
                    .select(
                        "username, password"
                    )
                    .eq(
                        "id",
                        student.id
                    )
                    .maybeSingle();

            dbStudent =
                result.data || null;
        }


        // If not found, search by Student ID
        if (
            !dbStudent &&
            student.student_id
        ) {

            const result =
                await supabaseClient
                    .from("students")
                    .select(
                        "username, password"
                    )
                    .eq(
                        "student_id",
                        student.student_id
                    )
                    .maybeSingle();

            dbStudent =
                result.data || null;
        }


        // ==========================================
        // UPDATE SETTINGS WITH DATABASE DATA
        // ==========================================

        if (dbStudent) {

            if (usernameInput) {

                usernameInput.value =
                    dbStudent.username ||
                    student.username ||
                    "";

                usernameInput.readOnly =
                    true;
            }


            if (currentPasswordInput) {

                currentPasswordInput.value =
                    dbStudent.password ||
                    student.password ||
                    "";

            }

        }

    } catch (error) {

        console.error(
            "Supabase student settings error:",
            error
        );

    }

}

/* =========================================================
   SAVE STUDENT ACCOUNT SETTINGS
   SUPABASE LIVE
   ========================================================= */

async function saveStudentAccountSettings() {

    const usernameInput =
        document.getElementById(
            "settingsUsername"
        );

    const passwordInput =
        document.getElementById(
            "settingsPassword"
        );

    if (!usernameInput) {
        return;
    }

    const newUsername =
        usernameInput.value.trim();

    const newPassword =
        passwordInput
            ? passwordInput.value.trim()
            : "";


    /* -----------------------------------------
       VALIDATION
    ----------------------------------------- */

    if (!newUsername) {

        alert(
            "Username cannot be empty. ⚠️"
        );

        return;
    }


    if (
        newPassword !== "" &&
        (
            !/^\d+$/.test(newPassword) ||
            newPassword.length < 6 ||
            newPassword.length > 8
        )
    ) {

        alert(
            "Password must contain 6 to 8 digits. ⚠️"
        );

        return;
    }


    /* -----------------------------------------
       SUPABASE CHECK
    ----------------------------------------- */

    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        alert(
            "Supabase connection is missing."
        );

        return;
    }


    /* -----------------------------------------
       GET LOGGED-IN STUDENT
    ----------------------------------------- */

    const loggedInStudent =
        JSON.parse(
            localStorage.getItem(
                "loggedInStudent"
            )
        );


    if (!loggedInStudent) {

        alert(
            "Student account not found. ⚠️"
        );

        return;
    }


    /* -----------------------------------------
       LOAD CURRENT STUDENT FROM SUPABASE
    ----------------------------------------- */

    let student = null;
    let studentError = null;


    if (loggedInStudent.id) {

        const result =
            await supabaseClient
                .from("students")
                .select("*")
                .eq(
                    "id",
                    loggedInStudent.id
                )
                .maybeSingle();

        student =
            result.data;

        studentError =
            result.error;
    }


    if (!student && loggedInStudent.student_id) {

        const result =
            await supabaseClient
                .from("students")
                .select("*")
                .eq(
                    "student_id",
                    loggedInStudent.student_id
                )
                .maybeSingle();

        student =
            result.data;

        studentError =
            result.error;
    }


    if (!student && loggedInStudent.username) {

        const result =
            await supabaseClient
                .from("students")
                .select("*")
                .ilike(
                    "username",
                    loggedInStudent.username
                )
                .maybeSingle();

        student =
            result.data;

        studentError =
            result.error;
    }


    if (studentError) {

        console.error(
            "STUDENT ACCOUNT LOAD ERROR:",
            studentError
        );

        alert(
            "Student account could not be loaded.\n\n" +
            studentError.message
        );

        return;
    }


    if (!student) {

        alert(
            "Student record was not found in Supabase. ⚠️"
        );

        return;
    }


    /* -----------------------------------------
       CHECK DUPLICATE USERNAME
    ----------------------------------------- */

    const {
        data: duplicateStudents,
        error: duplicateError
    } =
        await supabaseClient
            .from("students")
            .select(
                "id, username"
            )
            .ilike(
                "username",
                newUsername
            )
            .neq(
                "id",
                student.id
            );


    if (duplicateError) {

        console.error(
            "STUDENT USERNAME CHECK ERROR:",
            duplicateError
        );

        alert(
            "Username could not be checked.\n\n" +
            duplicateError.message
        );

        return;
    }


    if (
        duplicateStudents &&
        duplicateStudents.length > 0
    ) {

        alert(
            "This username is already in use. ⚠️"
        );

        return;
    }


    /* -----------------------------------------
       PREPARE UPDATE
    ----------------------------------------- */

    const updateData = {

        username:
            newUsername

    };


    if (newPassword !== "") {

        updateData.password =
            newPassword;
    }


    /* -----------------------------------------
       UPDATE SUPABASE
    ----------------------------------------- */

    const {
        data: updatedStudent,
        error: updateError
    } =
        await supabaseClient
            .from("students")
            .update(
                updateData
            )
            .eq(
                "id",
                student.id
            )
            .select("*")
            .single();


    if (updateError) {

        console.error(
            "STUDENT ACCOUNT UPDATE ERROR:",
            updateError
        );

        alert(
            "Account settings could not be updated.\n\n" +
            updateError.message
        );

        return;
    }


    /* -----------------------------------------
       UPDATE CURRENT SESSION
    ----------------------------------------- */

    localStorage.setItem(
        "loggedInStudent",
        JSON.stringify(
            updatedStudent
        )
    );


    /* -----------------------------------------
       CLEAR PASSWORD FIELD
    ----------------------------------------- */

    if (passwordInput) {

        passwordInput.value = "";
    }


    alert(
        "Account settings updated successfully! ✅"
    );
}

/* =========================================================
   SETTINGS BUTTON
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.id ===
            "saveSettingsBtn"
        ) {

            saveStudentAccountSettings();

        }

    }
);


/* =========================================================
   LOAD SETTINGS WHEN SETTINGS OPENS
   ========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const menuItem =
            event.target.closest(
                "#studentDashboard .sidebar li"
            );

        if (!menuItem) return;

        const text =
            menuItem.textContent
                .trim()
                .toLowerCase();

        if (text.includes("settings")) {

            setTimeout(
                loadStudentAccountSettings,
                50
            );

        }

    }
);

// =========================================================
// EDUPORTAL STUDENT NOTIFICATIONS
// SUPABASE + REALTIME
// ADMIN NOTICES -> STUDENT HEADER BELL
// =========================================================

(function () {

    const button =
        document.getElementById(
            "studentNotificationBtn"
        );

    const dropdown =
        document.getElementById(
            "studentNotificationDropdown"
        );

    const list =
        document.getElementById(
            "studentNotificationList"
        );

    const badge =
        document.getElementById(
            "studentNotificationBadge"
        );

    const countText =
        document.getElementById(
            "studentNotificationCount"
        );

    const markRead =
        document.getElementById(
            "markNotificationsRead"
        );


    if (!button || !dropdown || !list || !badge) {
        console.warn(
            "Student notification elements not found."
        );
        return;
    }


    // =====================================================
    // READ NOTIFICATION IDS
    // =====================================================

    function getReadIds() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "studentReadNotifications"
                )
            ) || [];

        } catch (error) {

            return [];

        }

    }


    // =====================================================
    // SAVE READ IDS
    // =====================================================

    function saveReadIds(ids) {

        localStorage.setItem(
            "studentReadNotifications",
            JSON.stringify(ids)
        );

    }


    // =====================================================
    // GET CURRENT STUDENT
    // =====================================================

    function getCurrentStudent() {

        try {

            return JSON.parse(
                localStorage.getItem(
                    "loggedInStudent"
                )
            ) || JSON.parse(
                localStorage.getItem(
                    "studentAccount"
                )
            ) || null;

        } catch (error) {

            return null;

        }

    }


    // =====================================================
    // GET NOTICE ID
    // =====================================================

    function getNoticeId(notice) {

        return String(
            notice.id ||
            (
                String(
                    notice.created_at ||
                    ""
                ) +
                "_" +
                String(
                    notice.title ||
                    ""
                )
            )
        );

    }


    // =====================================================
    // LOAD NOTICES FROM SUPABASE
    // =====================================================

    async function loadNotifications() {

        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            console.error(
                "Supabase client not available."
            );

            return;

        }


        const student =
            getCurrentStudent();


        const {
            data: notices,
            error
        } =
            await supabaseClient
                .from("notices")
                .select(
                    "id, title, message, target_role, created_at"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "STUDENT NOTIFICATIONS LOAD ERROR:",
                error
            );

            list.innerHTML = `
                <div class="notification-empty">
                    ⚠️ Unable to load notifications
                </div>
            `;

            badge.style.display = "none";

            if (countText) {

                countText.textContent =
                    "Unable to load notifications";

            }

            return;

        }


        // =================================================
        // FILTER NOTICES FOR STUDENT
        // =================================================

        const records =
            (notices || []).filter(
                function (notice) {

                    const target =
                        String(
                            notice.target_role ||
                            ""
                        )
                            .trim()
                            .toLowerCase();


                    // Empty target = show
                    if (!target) {
                        return true;
                    }


                    // Everyone / all users
                    if (
                        target === "all" ||
                        target === "everyone" ||
                        target === "students"
                    ) {
                        return true;
                    }


                    // Student
                    if (
                        target === "student"
                    ) {
                        return true;
                    }


                    return false;

                }
            );


        renderNotifications(
            records
        );

    }


    // =====================================================
    // RENDER NOTIFICATIONS
    // =====================================================

    function renderNotifications(
        notices
    ) {

        const readIds =
            getReadIds();


        const unread =
            notices.filter(
                function (notice) {

                    return !readIds.includes(
                        getNoticeId(notice)
                    );

                }
            );


        // =================================================
        // BADGE
        // =================================================

        if (unread.length > 0) {

            badge.textContent =
                unread.length > 99
                    ? "99+"
                    : unread.length;

            badge.style.display =
                "flex";

        } else {

            badge.textContent =
                "0";

            badge.style.display =
                "none";

        }


        // =================================================
        // COUNT TEXT
        // =================================================

        if (countText) {

            countText.textContent =
                unread.length === 0
                    ? "No new notifications"
                    : unread.length +
                      (
                          unread.length === 1
                              ? " new notification"
                              : " new notifications"
                      );

        }


        // =================================================
        // EMPTY
        // =================================================

        if (!notices.length) {

            list.innerHTML = `
                <div class="notification-empty">
                    🔔 No new notifications
                </div>
            `;

            return;

        }


        // =================================================
        // SHOW LATEST 10
        // =================================================

        list.innerHTML =
            notices
                .slice(0, 10)
                .map(
                    function (notice) {

                        const id =
                            getNoticeId(
                                notice
                            );


                        const isUnread =
                            !readIds.includes(
                                id
                            );


                        const title =
                            notice.title ||
                            "New Notice";


                        const message =
                            notice.message ||
                            "New notice available.";


                        const date =
                            notice.created_at
                                ? new Date(
                                    notice.created_at
                                ).toLocaleString()
                                : "";


                        return `
                            <div
                                class="
                                    student-notification-item
                                    ${isUnread ? "unread" : ""}
                                "
                                data-notification-id="${id}"
                            >

                                <div
                                    class="notification-item-icon"
                                >
                                    📢
                                </div>


                                <div
                                    class="notification-item-content"
                                >

                                    <strong>
                                        ${title}
                                    </strong>


                                    <p>
                                        ${message}
                                    </p>


                                    ${
                                        date
                                            ? `
                                                <span
                                                    class="notification-item-date"
                                                >
                                                    ${date}
                                                </span>
                                            `
                                            : ""
                                    }

                                </div>

                            </div>
                        `;

                    }
                )
                .join("");

    }


    // =====================================================
    // BELL CLICK
    // =====================================================

    button.addEventListener(
        "click",
        async function (event) {

            event.stopPropagation();


            await loadNotifications();


            dropdown.classList.toggle(
                "show"
            );

        }
    );


    // =====================================================
    // CLICK INDIVIDUAL NOTICE
    // =====================================================

    list.addEventListener(
        "click",
        function (event) {

            const item =
                event.target.closest(
                    ".student-notification-item"
                );


            if (!item) {
                return;
            }


            const id =
                item.dataset.notificationId;


            if (!id) {
                return;
            }


            const readIds =
                getReadIds();


            if (!readIds.includes(id)) {

                readIds.push(id);

                saveReadIds(
                    readIds
                );

            }


            loadNotifications();

        }
    );


    // =====================================================
    // MARK ALL AS READ
    // =====================================================

    if (markRead) {

        markRead.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();


                loadNotifications()
                    .then(
                        async function () {

                            const {
                                data: notices
                            } =
                                await supabaseClient
                                    .from("notices")
                                    .select(
                                        "id"
                                    );


                            const ids =
                                (notices || [])
                                    .map(
                                        function (
                                            notice
                                        ) {

                                            return String(
                                                notice.id
                                            );

                                        }
                                    );


                            saveReadIds(
                                ids
                            );


                            await loadNotifications();

                        }
                    );

            }
        );

    }


    // =====================================================
    // CLOSE DROPDOWN OUTSIDE
    // =====================================================

    document.addEventListener(
        "click",
        function (event) {

            if (
                !event.target.closest(
                    ".notification-wrapper"
                )
            ) {

                dropdown.classList.remove(
                    "show"
                );

            }

        }
    );


    // =====================================================
    // SUPABASE REALTIME
    // =====================================================

    if (
        typeof supabaseClient !==
        "undefined"
    ) {

        const notificationChannel =
            supabaseClient.channel(
                "student-notices-live"
            );


        notificationChannel
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "notices"
                },
                async function () {

                    console.log(
                        "New notice received in realtime."
                    );


                    await loadNotifications();

                }
            )
            .subscribe(
                function (status) {

                    console.log(
                        "Student notification realtime:",
                        status
                    );

                }
            );

    }


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    loadNotifications();


})();

// =========================================================
// EDUPORTAL STUDENT DASHBOARD
// FINAL SIDEBAR NAVIGATION FIX
// =========================================================

(function () {

    const dashboard =
        document.getElementById("studentDashboard");

    if (!dashboard) return;


    // -----------------------------------------------------
    // ALL STUDENT SECTIONS
    // -----------------------------------------------------

    const moduleSections = [
        "profileSection",
        "attendanceSection",
        "subjectsSection",
        "assignmentsSection",
        "resultsSection",
        "feeSection",
        "settingsSection"
    ];


    // -----------------------------------------------------
    // DASHBOARD HOME ELEMENTS
    // -----------------------------------------------------

    const dashboardElements = [
        "studentIdCardSection",
        "welcomeBanner",
        "noticeBoard",
        "analyticsSection",
        "quickSection",
        "notificationPanel"
    ];


    // -----------------------------------------------------
    // HIDE EVERYTHING
    // -----------------------------------------------------

    function hideEverything() {

        // Hide modules
        moduleSections.forEach(function (id) {

            const section =
                document.getElementById(id);

            if (section) {
                section.style.display = "none";
            }

        });


        // Hide dashboard elements
        dashboardElements.forEach(function (id) {

            const element =
                document.getElementById(id);

            if (element) {
                element.style.display = "none";
            }

        });


        // Hide dashboard cards
        const cards =
            dashboard.querySelector(
                ".dashboard-cards"
            );

        if (cards) {
            cards.style.display = "none";
        }

    }


    // -----------------------------------------------------
    // SHOW DASHBOARD
    // -----------------------------------------------------

    function showDashboard() {

        hideEverything();


        const idCard =
            document.getElementById(
                "studentIdCardSection"
            );

        const welcome =
            document.getElementById(
                "welcomeBanner"
            );

        const notice =
            document.getElementById(
                "noticeBoard"
            );

        const analytics =
            document.getElementById(
                "analyticsSection"
            );

        const quick =
            document.getElementById(
                "quickSection"
            );

        const notification =
            document.getElementById(
                "notificationPanel"
            );

        const cards =
            dashboard.querySelector(
                ".dashboard-cards"
            );


        if (idCard) {
            idCard.style.display = "flex";
        }

        if (welcome) {
            welcome.style.display = "flex";
        }

        if (notice) {
            notice.style.display = "block";
        }

        if (analytics) {
            analytics.style.display = "grid";
        }

        if (quick) {
            quick.style.display = "block";
        }

        if (notification) {
            notification.style.display = "block";
        }

        if (cards) {
            cards.style.display = "grid";
        }


        // Active Dashboard
        dashboard
            .querySelectorAll(".sidebar ul li")
            .forEach(function (item) {

                item.classList.remove("active");

            });


        const dashboardMenu =
            document.getElementById(
                "dashboardMenu"
            );

        if (dashboardMenu) {
            dashboardMenu.classList.add("active");
        }

    }


    // -----------------------------------------------------
    // SHOW ONE MODULE
    // -----------------------------------------------------

    function showModule(sectionId, menuId) {

        hideEverything();


        const section =
            document.getElementById(sectionId);

        if (section) {
            section.style.display = "block";
        }


        // Remove all active
        dashboard
            .querySelectorAll(".sidebar ul li")
            .forEach(function (item) {

                item.classList.remove("active");

            });


        // Active selected menu
        const menu =
            document.getElementById(menuId);

        if (menu) {
            menu.classList.add("active");
        }

    }


    // -----------------------------------------------------
    // SIDEBAR CLICK
    // -----------------------------------------------------
dashboard.addEventListener(
    "click",
async function (event) {
            const menu =
                event.target.closest(
                    ".sidebar ul li"
                );

            if (!menu) return;


            // Dashboard
            if (menu.id === "dashboardMenu") {

                event.preventDefault();
                event.stopPropagation();

                showDashboard();

                return;
            }


            // Profile
            if (menu.id === "profileMenu") {

                event.preventDefault();
                event.stopPropagation();

                showModule(
                    "profileSection",
                    "profileMenu"
                );

                return;
            }


            // Attendance
            if (menu.id === "attendanceMenu") {

                event.preventDefault();
                event.stopPropagation();

                showModule(
                    "attendanceSection",
                    "attendanceMenu"
                );

                return;
            }


            // Subjects
            if (menu.id === "subjectsMenu") {

                event.preventDefault();
                event.stopPropagation();

                showModule(
                    "subjectsSection",
                    "subjectsMenu"
                );

                return;
            }


            // Assignments
            if (menu.id === "assignmentsMenu") {

                event.preventDefault();
                event.stopPropagation();

                showModule(
                    "assignmentsSection",
                    "assignmentsMenu"
                );

                return;
            }


            // Results
            if (menu.id === "resultsMenu") {

                event.preventDefault();
                event.stopPropagation();

                showModule(
                    "resultsSection",
                    "resultsMenu"
                );

                return;
            }


            // Fee
            if (menu.id === "feeMenu") {

                event.preventDefault();
                event.stopPropagation();

                showModule(
                    "feeSection",
                    "feeMenu"
                );

                return;
            }


            // Notices
     if (menu.id === "noticesMenu") {

    event.preventDefault();
    event.stopPropagation();

    showModule(
        "noticeBoard",
        "noticesMenu"
    );

    // =========================================
    // LOAD NOTICE HISTORY
    // =========================================

    const noticeBoard =
        document.getElementById(
            "noticeBoard"
        );

    if (
        noticeBoard &&
        typeof supabaseClient !== "undefined"
    ) {

        const {
            data: notices,
            error
        } =
            await supabaseClient
                .from("notices")
                .select(
                    "id, title, message, target_role, expiry_date, created_at"
                )
                .order(
                    "created_at",
                    {
                        ascending: false
                    }
                );

        if (error) {

            console.error(
                "NOTICE HISTORY ERROR:",
                error
            );

            noticeBoard.innerHTML = `
                <div class="notice-content">
                    <h3>Notice History</h3>
                    <p>Unable to load notice history.</p>
                </div>
            `;

            return;
        }

        if (
            !notices ||
            notices.length === 0
        ) {

            noticeBoard.innerHTML = `
                <div class="notice-content">
                    <h3>Notice History</h3>
                    <p>No notices available.</p>
                </div>
            `;

            return;
        }

        // =========================================
        // NOTICE HISTORY HTML
        // =========================================

        noticeBoard.innerHTML = `
            <div
                class="notice-history-wrapper"
            >

                <div
                    class="notice-history-header"
                >
                    <div>
                        <div
                            class="notice-history-icon"
                        >
                            📢
                        </div>
                    </div>

                    <div>
                        <h2>
                            Notice History
                        </h2>

                        <p>
                            All previous and current notices
                        </p>
                    </div>
                </div>

                <div
                    class="notice-history-list"
                >

                    ${
                        notices.map(
                            function(notice) {

                                const today =
                                    new Date()
                                        .toISOString()
                                        .slice(
                                            0,
                                            10
                                        );

                                const expiry =
                                    notice.expiry_date ||
                                    "";

                                const expired =
                                    expiry &&
                                    expiry < today;

                                const noticeDate =
                                    notice.created_at
                                        ? new Date(
                                            notice.created_at
                                        ).toLocaleString(
                                            "en-PK",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true
                                            }
                                        )
                                        : "—";

                                return `
                                    <div
                                        class="notice-history-item"
                                    >

                                        <div
                                            class="notice-history-item-top"
                                        >

                                            <h3>
                                                📢
                                                ${
                                                    notice.title ||
                                                    "Notice"
                                                }
                                            </h3>

                                            <span
                                                class="
                                                    notice-history-status
                                                    ${
                                                        expired
                                                            ? "expired"
                                                            : "active"
                                                    }
                                                "
                                            >
                                                ${
                                                    expired
                                                        ? "Expired"
                                                        : "Active"
                                                }
                                            </span>

                                        </div>

                                        <p>
                                            ${
                                                notice.message ||
                                                ""
                                            }
                                        </p>

                                        <div
                                            class="notice-history-meta"
                                        >

                                            <span>
                                                📅
                                                ${noticeDate}
                                            </span>

                                            ${
                                                expiry
                                                    ? `
                                                        <span>
                                                            ⏳
                                                            Expiry:
                                                            ${expiry}
                                                        </span>
                                                    `
                                                    : ""
                                            }

                                        </div>

                                    </div>
                                `;

                            }
                        ).join("")
                    }

                </div>

            </div>
        `;

    }

    return;
}

            // Settings
            if (menu.id === "settingsMenu") {

                event.preventDefault();
                event.stopPropagation();

                showModule(
                    "settingsSection",
                    "settingsMenu"
                );

                return;
            }

        },
        true
    );


    // -----------------------------------------------------
    // INITIAL STATE
    // -----------------------------------------------------

    showDashboard();

})();
// =========================================================
// FINAL FIX - Student ID Card sirf Dashboard par show ho
// =========================================================
(function () {

    const dashboardOnlyIds = [
        "studentIdCardSection",
        "welcomeBanner",
        "noticeBoard",
        "analyticsSection",
        "quickSection",
        "notificationPanel"
    ];

    function toggleDashboardOnlyElements(showThem) {

        dashboardOnlyIds.forEach(function (id) {

            const el = document.getElementById(id);

            if (!el) return;

            if (showThem) {

                const display =
                    (id === "analyticsSection")
                        ? "grid"
                        : (id === "quickSection" || id === "notificationPanel" || id === "noticeBoard")
                            ? "block"
                            : "flex";

                el.style.setProperty("display", display, "important");

            } else {

                el.style.setProperty("display", "none", "important");

            }

        });

        const dashboardCards =
            document.querySelector("#studentDashboard .dashboard-cards");

        if (dashboardCards) {

            dashboardCards.style.setProperty(
                "display",
                showThem ? "grid" : "none",
                "important"
            );

        }

    }

    document
        .querySelectorAll("#studentDashboard .sidebar ul li")
        .forEach(function (menuItem) {

            menuItem.addEventListener("click", function () {

                if (menuItem.id === "dashboardMenu") {

                    toggleDashboardOnlyElements(true);

                } else if (menuItem.id !== "logoutBtn") {

                    toggleDashboardOnlyElements(false);

                }

            });

        });

})();
// =========================================================
// FINAL STUDENT SIDEBAR NAVIGATION FIX
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    const studentDashboard =
        document.getElementById("studentDashboard");

    if (!studentDashboard) return;


    // All student sections
    const sections = [
        "profileSection",
        "attendanceSection",
        "subjectsSection",
        "assignmentsSection",
        "resultsSection",
        "feeSection",
        "settingsSection"
    ];


    function hideStudentSections() {

        sections.forEach(function (id) {

            const section =
                document.getElementById(id);

            if (section) {
                section.style.display = "none";
            }

        });

    }

    // PROFILE
    const profileMenu =
        document.getElementById("profileMenu");

    if (profileMenu) {
        profileMenu.onclick = function () {

            openStudentSection(
                "profileSection",
                "profileMenu"
            );

        };
    }


    // ATTENDANCE
    const attendanceMenu =
        document.getElementById("attendanceMenu");

    if (attendanceMenu) {
        attendanceMenu.onclick = function () {

            openStudentSection(
                "attendanceSection",
                "attendanceMenu"
            );

        };
    }


    // SUBJECTS
    const subjectsMenu =
        document.getElementById("subjectsMenu");

    if (subjectsMenu) {
        subjectsMenu.onclick = function () {

            openStudentSection(
                "subjectsSection",
                "subjectsMenu"
            );

        };
    }


    // ASSIGNMENTS
    const assignmentsMenu =
        document.getElementById("assignmentsMenu");

    if (assignmentsMenu) {
        assignmentsMenu.onclick = function () {

            openStudentSection(
                "assignmentsSection",
                "assignmentsMenu"
            );

        };
    }


    // RESULTS
    const resultsMenu =
        document.getElementById("resultsMenu");

    if (resultsMenu) {
        resultsMenu.onclick = function () {

            openStudentSection(
                "resultsSection",
                "resultsMenu"
            );

        };
    }


    // FEE
    const feeMenu =
        document.getElementById("feeMenu");

    if (feeMenu) {
        feeMenu.onclick = function () {

            openStudentSection(
                "feeSection",
                "feeMenu"
            );

        };
    }


    // SETTINGS
    const settingsMenu =
        document.getElementById("settingsMenu");

    if (settingsMenu) {
        settingsMenu.onclick = function () {

            openStudentSection(
                "settingsSection",
                "settingsMenu"
            );

        };
    }


    // DASHBOARD
    const dashboardMenu =
        document.getElementById("dashboardMenu");

    if (dashboardMenu) {

        dashboardMenu.onclick = function () {

            hideStudentSections();

            const homeSections = [
                "studentIdCardSection",
                "welcomeBanner",
                "noticeBoard",
                "analyticsSection",
                "quickSection",
                "notificationPanel"
            ];

            homeSections.forEach(function (id) {

                const element =
                    document.getElementById(id);

                if (element) {

                    if (id === "analyticsSection") {
                        element.style.display = "grid";
                    }
                    else if (id === "quickSection" ||
                             id === "notificationPanel") {
                        element.style.display = "block";
                    }
                    else {
                        element.style.display = "flex";
                    }

                }

            });

            const dashboardCards =
                studentDashboard.querySelector(
                    ".dashboard-cards"
                );

            if (dashboardCards) {
                dashboardCards.style.display = "grid";
            }

            const menus =
                studentDashboard.querySelectorAll(
                    ".sidebar ul li"
                );

            menus.forEach(function (menu) {
                menu.classList.remove("active");
            });

            dashboardMenu.classList.add("active");

        };

    }

});

// =========================================================
// REAL STUDENT FEE CHART
// SUPABASE
// =========================================================

async function loadRealStudentFeeChart() {

    try {

        const student =
            JSON.parse(
                localStorage.getItem(
                    "loggedInStudent"
                )
            );


        if (!student) {
            return;
        }


        if (
            typeof supabaseClient ===
            "undefined"
        ) {

            console.error(
                "Supabase connection missing."
            );

            return;
        }


        // ==========================================
        // FIND STUDENT IN SUPABASE
        // ==========================================

        let dbStudent = null;


        if (student.id) {

            const result =
                await supabaseClient
                    .from("students")
                    .select(
                        "id, student_id"
                    )
                    .eq(
                        "id",
                        student.id
                    )
                    .maybeSingle();


            if (
                !result.error &&
                result.data
            ) {

                dbStudent =
                    result.data;

            }

        }


        // ==========================================
        // TRY STUDENT ID
        // ==========================================

        if (
            !dbStudent &&
            student.studentId
        ) {

            const result =
                await supabaseClient
                    .from("students")
                    .select(
                        "id, student_id"
                    )
                    .eq(
                        "student_id",
                        student.studentId
                    )
                    .maybeSingle();


            if (
                !result.error &&
                result.data
            ) {

                dbStudent =
                    result.data;

            }

        }


        if (!dbStudent) {

            console.warn(
                "Student not found for fee chart."
            );

            return;

        }


        // ==========================================
        // LOAD REAL FEE RECORDS
        // ==========================================

      const {
    data: feeRecords,
    error
} =
    await supabaseClient
        .from("fee_records")
        .select(
            "fee_amount, paid_amount, remaining_amount, month, fee_period, due_date"
        )
        .eq(
            "student_id",
            Number(dbStudent.id)
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


        if (error) {

            console.error(
                "Fee chart loading error:",
                error
            );

            return;

        }

// ==========================================
// FILTER FEE BY SELECTED ATTENDANCE MONTH
// ==========================================

const selectedFeeMonth =
    window.studentAttendanceSelectedMonth ||
    (
        new Date().getFullYear() +
        "-" +
        String(
            new Date().getMonth() + 1
        ).padStart(2, "0")
    );

const selectedFeeRecords =
    (feeRecords || []).filter(
        function(record) {

            let recordMonth = "";

            // First preference: fee_period
            if (record.fee_period) {

                recordMonth =
                    String(
                        record.fee_period
                    ).substring(
                        0,
                        7
                    );

            }

            // Fallback: due_date
            if (
                !recordMonth &&
                record.due_date
            ) {

                recordMonth =
                    String(
                        record.due_date
                    ).substring(
                        0,
                        7
                    );

            }

            // Fallback: month field
            if (
                !recordMonth &&
                record.month
            ) {

                const monthName =
                    String(
                        record.month
                    ).trim();

                const monthNumber =
                    {
                        January: "01",
                        February: "02",
                        March: "03",
                        April: "04",
                        May: "05",
                        June: "06",
                        July: "07",
                        August: "08",
                        September: "09",
                        October: "10",
                        November: "11",
                        December: "12"
                    }[
                        monthName
                    ];

                if (monthNumber) {

                    recordMonth =
                        selectedFeeMonth.substring(
                            0,
                            4
                        ) +
                        "-" +
                        monthNumber;

                }

            }

            return (
                recordMonth ===
                selectedFeeMonth
            );

        }
    );

        // ==========================================
        // CALCULATE REAL FEE
        // ==========================================

        let totalFee = 0;
        let paidFee = 0;
        let remainingFee = 0;


        (selectedFeeRecords || [])
    .forEach(function(record) {

                totalFee +=
                    Number(
                        record.fee_amount || 0
                    );


                paidFee +=
                    Number(
                        record.paid_amount || 0
                    );


                remainingFee +=
                    Number(
                        record.remaining_amount ??
                        Math.max(
                            0,
                            Number(
                                record.fee_amount || 0
                            ) -
                            Number(
                                record.paid_amount || 0
                            )
                        )
                    );

            });


        // ==========================================
        // PERCENTAGE
        // ==========================================

        const feePercentage =
            totalFee > 0
                ? Math.round(
                    (
                        paidFee /
                        totalFee
                    ) * 100
                )
                : 0;


        // ==========================================
        // DONUT
        // ==========================================

        const feeDonut =
            document.getElementById(
                "studentFeeDonut"
            );


        if (feeDonut) {

            if (totalFee <= 0) {

                feeDonut.style.background =
                    "#edf2f7";

            }
            else {

                const paidDegrees =
                    feePercentage * 3.6;


                feeDonut.style.background =
                    `conic-gradient(
                        #f59e0b 0deg ${paidDegrees}deg,
                        #edf2f7 ${paidDegrees}deg 360deg
                    )`;

            }

        }


        // ==========================================
        // PERCENTAGE
        // ==========================================

        const percentageElement =
            document.getElementById(
                "feeChartPercentage"
            );


        if (percentageElement) {

            percentageElement.textContent =
                feePercentage + "%";

        }
const feeStatusBadge =
    document.getElementById(
        "feeChartStatus"
    );

if (feeStatusBadge) {

    if (totalFee <= 0) {

        feeStatusBadge.textContent =
            "No Fee";

    }
    else {

        feeStatusBadge.textContent =
            feePercentage + "% Paid";

    }

}

        // ==========================================
        // TOTAL FEE
        // ==========================================

        const totalElement =
            document.getElementById(
                "chartTotalFee"
            );


        if (totalElement) {

            totalElement.textContent =
                "Rs. " +
                totalFee.toLocaleString();

        }


        // ==========================================
        // PAID FEE
        // ==========================================

        const paidElement =
            document.getElementById(
                "chartPaidFee"
            );


        if (paidElement) {

            paidElement.textContent =
                "Rs. " +
                paidFee.toLocaleString();

        }


        // ==========================================
        // REMAINING FEE
        // ==========================================

        const remainingElement =
            document.getElementById(
                "chartRemainingFee"
            );


        if (remainingElement) {

            remainingElement.textContent =
                "Rs. " +
                remainingFee.toLocaleString();

        }


        // ==========================================
        // PROGRESS BAR
        // ==========================================

        const progress =
            document.getElementById(
                "feeChartProgress"
            );


        if (progress) {

            progress.style.width =
                feePercentage + "%";

        }


        console.log(
            "Real student fee loaded:",
            {
                total: totalFee,
                paid: paidFee,
                remaining: remainingFee,
                percentage: feePercentage
            }
        );

    }
    catch (error) {

        console.error(
            "Student fee chart error:",
            error
        );

    }

}

// ==========================================
// LOAD REAL ATTENDANCE AFTER DASHBOARD LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setTimeout(
            function () {

                if (
                    typeof loadRealStudentAttendanceChart ===
                    "function"
                ) {
                    loadRealStudentAttendanceChart();
                }

                if (
                    typeof loadRealStudentFeeChart ===
                    "function"
                ) {
                    loadRealStudentFeeChart();
                }

            },
            800
        );

    }
);
// =========================================================
// LOAD STUDENT CHARTS
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        setTimeout(
            function () {

                if (
                    typeof loadRealStudentAttendanceChart ===
                    "function"
                ) {

                    loadRealStudentAttendanceChart();

                }

            },
            500
        );


        setTimeout(
            function () {

                if (
                    typeof updateAnalytics ===
                    "function"
                ) {

                    updateAnalytics();

                }

            },
            800
        );

    }
);
// =========================================================
// STUDENT REAL ATTENDANCE - SUPABASE
// =========================================================

async function loadRealStudentAttendance() {

    const loggedInStudent =
        JSON.parse(
            localStorage.getItem("loggedInStudent")
        );

    if (!loggedInStudent) {
        console.warn(
            "Student session not found."
        );
        return;
    }


    // =========================================
    // FIND DATABASE STUDENT ID
    // =========================================

    const studentId =
        loggedInStudent.id ||
        loggedInStudent.studentId;


    if (!studentId) {
        console.warn(
            "Student database ID not found."
        );
        return;
    }


    try {

        // =========================================
        // GET REAL ATTENDANCE FROM SUPABASE
        // =========================================

        const {
            data: attendanceRows,
            error
        } =
            await supabaseClient
                .from("attendance")
                .select("*")
                .eq(
                    "student_id",
                    studentId
                )
                .order(
                    "attendance_date",
                    {
                        ascending: false
                    }
                );


        if (error) {

            console.error(
                "STUDENT ATTENDANCE ERROR:",
                error
            );

            return;
        }


        const records =
    attendanceRows || [];


// =========================================
// ATTENDANCE HISTORY DATE FILTER
// =========================================

const historyDateInput =
    document.getElementById(
        "attendanceHistoryDateFilter"
    );


// Default date = Latest Attendance Date
if (
    historyDateInput &&
    !historyDateInput.value
) {

    if (
        records &&
        records.length > 0 &&
        records[0].attendance_date
    ) {

        historyDateInput.value =
            String(
                records[0].attendance_date
            ).substring(
                0,
                10
            );

    }
    else {

        historyDateInput.value =
            getStudentAttendanceDate();

    }

}


// Selected date
const selectedHistoryDate =
    historyDateInput &&
    historyDateInput.value
        ? historyDateInput.value
        : getStudentAttendanceDate();


// Only show records for selected date
const historyRecords =
    records.filter(
        function(record) {

            return String(
                record.attendance_date || ""
            ) === String(
                selectedHistoryDate
            );

        }
    );


        // =========================================
        // REAL COUNTS
        // =========================================

        const totalClasses =
            records.length;


        const presentClasses =
            records.filter(function(record) {

                return String(
                    record.status || ""
                ).toLowerCase() ===
                "present";

            }).length;


        const absentClasses =
            records.filter(function(record) {

                return String(
                    record.status || ""
                ).toLowerCase() ===
                "absent";

            }).length;


        const lateClasses =
            records.filter(function(record) {

                return String(
                    record.status || ""
                ).toLowerCase() ===
                "late";

            }).length;


        const leaveClasses =
            records.filter(function(record) {

                return String(
                    record.status || ""
                ).toLowerCase() ===
                "leave";

            }).length;


        // =========================================
        // ATTENDANCE PERCENTAGE
        // =========================================

        const attendancePercentage =
            totalClasses > 0
                ? Math.round(
                    (
                        presentClasses /
                        totalClasses
                    ) * 100
                )
                : 0;


        // =========================================
        // UPDATE SUMMARY CARDS
        // =========================================

        const totalElement =
            document.getElementById(
                "totalClasses"
            );

        const presentElement =
            document.getElementById(
                "presentClasses"
            );

        const absentElement =
            document.getElementById(
                "absentClasses"
            );

        const percentageElement =
            document.getElementById(
                "attendancePercentage"
            );


        if (totalElement) {

            totalElement.textContent =
                totalClasses;

        }


        if (presentElement) {

            presentElement.textContent =
                presentClasses;

        }


        if (absentElement) {

            absentElement.textContent =
                absentClasses;

        }


        if (percentageElement) {

            percentageElement.textContent =
                attendancePercentage + "%";

        }


// =========================================
// UPDATE ATTENDANCE SUMMARY + DONUT
// =========================================

const attendanceBar =
    document.getElementById(
        "attendanceBar"
    );

if (attendanceBar) {

    attendanceBar.style.width =
        attendancePercentage + "%";

}


// =========================================
// UPDATE ATTENDANCE OVERVIEW
// =========================================

const presentDays =
    document.getElementById(
        "chartPresentDays"
    );

const absentDays =
    document.getElementById(
        "chartAbsentDays"
    );

const leaveDays =
    document.getElementById(
        "chartLeaveDays"
    );

const donut =
    document.getElementById(
        "studentAttendanceDonut"
    );

const donutPercentage =
    document.getElementById(
        "studentAttendancePercentage"
    );

const chartStatus =
    document.getElementById(
        "attendanceChartStatus"
    );


// =========================================
// PRESENT / ABSENT / LEAVE COUNTS
// =========================================

if (presentDays) {

    presentDays.textContent =
        presentClasses +
        (presentClasses === 1
            ? " Day"
            : " Days");

}

if (absentDays) {

    absentDays.textContent =
        absentClasses +
        (absentClasses === 1
            ? " Day"
            : " Days");

}

if (leaveDays) {

    leaveDays.textContent =
        leaveClasses +
        (leaveClasses === 1
            ? " Day"
            : " Days");

}


// =========================================
// DONUT PERCENTAGE
// =========================================

if (donutPercentage) {

    donutPercentage.textContent =
        attendancePercentage + "%";

}


// =========================================
// DONUT CHART
// =========================================

if (donut && totalClasses > 0) {

    const presentDegree =
        (presentClasses /
            totalClasses) * 360;

    const absentDegree =
        (absentClasses /
            totalClasses) * 360;

    const leaveDegree =
        (leaveClasses /
            totalClasses) * 360;

    const absentStart =
        presentDegree;

    const leaveStart =
        presentDegree +
        absentDegree;

    donut.style.background =
        "conic-gradient(" +
        "#16a34a 0deg " +
        presentDegree + "deg, " +

        "#ef4444 " +
        presentDegree + "deg " +
        leaveStart + "deg, " +

        "#f59e0b " +
        leaveStart + "deg 360deg" +
        ")";

}


// =========================================
// CHART STATUS
// =========================================

if (chartStatus) {

    if (attendancePercentage >= 90) {

        chartStatus.textContent =
            "Excellent";

    }
    else if (attendancePercentage >= 75) {

        chartStatus.textContent =
            "Good";

    }
    else if (attendancePercentage >= 60) {

        chartStatus.textContent =
            "Average";

    }
    else {

        chartStatus.textContent =
            "Needs Improvement";

    }

}


        // =========================================
        // TODAY'S ATTENDANCE
        // =========================================

        const today =
            new Date()
                .toISOString()
                .split("T")[0];


        const todayRecord =
            records.find(function(record) {

                return String(
                    record.attendance_date
                ) === String(today);

            });


        const todayStatus =
            document.getElementById(
                "todayAttendanceStatus"
            );


        const todayMessage =
            document.getElementById(
                "todayAttendanceMessage"
            );


        if (todayRecord) {

            const status =
                todayRecord.status ||
                "Marked";


            if (todayStatus) {

                todayStatus.textContent =
                    status;

            }


            if (todayMessage) {

                todayMessage.textContent =
                    "Today's attendance: " +
                    status;

            }

        }
        else {

            if (todayStatus) {

                todayStatus.textContent =
                    "Not Marked";

            }


            if (todayMessage) {

                todayMessage.textContent =
                    "Today's attendance has not been marked yet.";

            }

        }


     // =========================================
// LOAD ATTENDANCE HISTORY TABLE
// =========================================

loadStudentTodayAttendanceTable(
    historyRecords.length > 0
        ? historyRecords
        : records
);
        // =========================================================
// STUDENT ATTENDANCE REALTIME
// =========================================================

initializeStudentAttendanceRealtime(
    studentId
);

        console.log(
            "REAL STUDENT ATTENDANCE LOADED:",
            records
        );

    }
    catch (error) {

        console.error(
            "REAL ATTENDANCE LOAD ERROR:",
            error
        );

    }

}

// =========================================================
// STUDENT ATTENDANCE REALTIME
// =========================================================

let studentAttendanceRealtimeChannel = null;


function initializeStudentAttendanceRealtime(
    studentId
) {

    if (
        !studentId ||
        typeof supabaseClient === "undefined"
    ) {
        return;
    }


    // =========================================
    // ALREADY CONNECTED
    // =========================================

    if (
        studentAttendanceRealtimeChannel
    ) {
        return;
    }


    // =========================================
    // CREATE REALTIME CHANNEL
    // =========================================

    studentAttendanceRealtimeChannel =
        supabaseClient
            .channel(
                "student-attendance-" +
                String(studentId)
            )
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "attendance",
                    filter:
                        "student_id=eq." +
                        String(studentId)
                },
                function(payload) {

                    console.log(
                        "STUDENT ATTENDANCE REALTIME UPDATE:",
                        payload
                    );


                    // Reload latest real data
                    loadRealStudentAttendance();

                }
            )
            .subscribe(
                function(status) {

                    console.log(
                        "STUDENT ATTENDANCE REALTIME:",
                        status
                    );

                }
            );

}
// =========================================================
// ATTENDANCE HISTORY TABLE
// DATE | STATUS | CHECK IN
// =========================================================

let studentAttendanceHistoryRecords = [];
let studentAttendanceHistoryVisible = 5;


// =========================================================
// RENDER ATTENDANCE HISTORY
// =========================================================

async function loadStudentTodayAttendanceTable(
    records
) {

    const tableBody =
        document.getElementById(
            "todayAttendanceTableBody"
        );

    const viewMoreWrapper =
        document.getElementById(
            "attendanceHistoryViewMoreWrapper"
        );

    const viewMoreButton =
        document.getElementById(
            "attendanceHistoryViewMoreBtn"
        );


    if (!tableBody) {
        return;
    }


    // =========================================
    // STORE REAL RECORDS
    // =========================================

    studentAttendanceHistoryRecords =
        Array.isArray(records)
            ? [...records]
            : [];


    // =========================================
    // SORT — LATEST DATE FIRST
    // =========================================

    studentAttendanceHistoryRecords.sort(
        function(a, b) {

            return String(
                b.attendance_date || ""
            ).localeCompare(
                String(
                    a.attendance_date || ""
                )
            );

        }
    );


    // =========================================
    // RESET TO FIRST 5 RECORDS
    // =========================================

    studentAttendanceHistoryVisible = 5;


    renderStudentAttendanceHistory();


    // =========================================
    // VIEW MORE CLICK
    // =========================================

    if (
        viewMoreButton &&
        !viewMoreButton.dataset.bound
    ) {

        viewMoreButton.dataset.bound =
            "true";


        viewMoreButton.addEventListener(
            "click",
            function() {

                studentAttendanceHistoryVisible += 5;

                renderStudentAttendanceHistory();

            }
        );

    }

}


// =========================================================
// RENDER VISIBLE ATTENDANCE RECORDS
// =========================================================

function renderStudentAttendanceHistory() {

    const tableBody =
        document.getElementById(
            "todayAttendanceTableBody"
        );

    const viewMoreWrapper =
        document.getElementById(
            "attendanceHistoryViewMoreWrapper"
        );

    const viewMoreButton =
        document.getElementById(
            "attendanceHistoryViewMoreBtn"
        );


    if (!tableBody) {
        return;
    }


    const records =
        studentAttendanceHistoryRecords || [];


    // =========================================
    // NO RECORDS
    // =========================================

    if (records.length === 0) {

        tableBody.innerHTML = `
            <tr>

                <td colspan="3">

                    <div class="attendance-empty-state">

                        <div>📅</div>

                        <strong>
                            No attendance record yet
                        </strong>

                        <span>
                            Attendance will appear here when
                            your teacher marks it.
                        </span>

                    </div>

                </td>

            </tr>
        `;


        if (viewMoreWrapper) {
            viewMoreWrapper.style.display =
                "none";
        }

        return;
    }


    // =========================================
    // GET VISIBLE RECORDS
    // =========================================

    const visibleRecords =
        records.slice(
            0,
            studentAttendanceHistoryVisible
        );


    // =========================================
    // CLEAR TABLE
    // =========================================

    tableBody.innerHTML = "";


    // =========================================
    // CREATE ROWS
    // =========================================

    visibleRecords.forEach(
        function(record) {

            const date =
                record.attendance_date ||
                "—";


            const status =
                record.status ||
                "—";


            // =====================================
            // REAL CHECK-IN TIME
            // =====================================

            let checkInTime = "—";


            if (
                record.check_in_time
            ) {

                const dateTime =
                    new Date(
                        record.check_in_time
                    );


                if (
                    !Number.isNaN(
                        dateTime.getTime()
                    )
                ) {

                    checkInTime =
                        dateTime.toLocaleTimeString(
                            "en-US",
                            {
                                timeZone:
                                    "Asia/Karachi",

                                hour:
                                    "2-digit",

                                minute:
                                    "2-digit",

                                hour12:
                                    true
                            }
                        );

                }

            }


            // =====================================
            // STATUS CLASS
            // =====================================

            let statusClass =
                "attendance-status";


            const normalizedStatus =
                String(status)
                    .trim()
                    .toLowerCase();


            if (
                normalizedStatus ===
                "present"
            ) {

                statusClass +=
                    " present";

            }
            else if (
                normalizedStatus ===
                "absent"
            ) {

                statusClass +=
                    " absent";

            }
            else if (
                normalizedStatus ===
                "late"
            ) {

                statusClass +=
                    " late";

            }
            else if (
                normalizedStatus ===
                "leave"
            ) {

                statusClass +=
                    " leave";

            }


            // =====================================
            // CREATE ROW
            // =====================================

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${date}
                </td>

                <td>

                    <span
                        class="${statusClass}">
                        ${status}
                    </span>

                </td>

                <td>
                    ${checkInTime}
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );


    // =========================================
    // VIEW MORE / HIDE BUTTON
    // =========================================

    if (viewMoreWrapper) {

        if (
            studentAttendanceHistoryVisible <
            records.length
        ) {

            viewMoreWrapper.style.display =
                "flex";


            if (viewMoreButton) {

                viewMoreButton.innerHTML =
                    `
                    View More

                    <span>
                        ↓
                    </span>
                    `;

            }

        }
        else {

            viewMoreWrapper.style.display =
                "none";

        }

    }

}
// =========================================================
// LOAD REAL ATTENDANCE AFTER PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setTimeout(
            function() {

                if (
                    typeof loadRealStudentAttendance ===
                    "function"
                ) {

                    loadRealStudentAttendance();

                }

            },
            800
        );

    }
);
// =========================================================
// ADMIN ATTENDANCE - LOAD ALL REGISTERED STUDENTS
// =========================================================

async function loadRealAdminAttendance() {

    console.log("Loading Admin Attendance...");

    // Use the main attendance renderer.
    // This renderer loads ALL registered students
    // and then matches attendance records against them.

    if (
        typeof renderAttendanceTable ===
        "function"
    ) {

        await renderAttendanceTable();

    } else {

        console.error(
            "renderAttendanceTable() function not found."
        );

    }

}

// =========================================================
// LOAD ADMIN ATTENDANCE WHEN SECTION OPENS
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const attendanceMenu =
            event.target.closest(
                "#adminAttendanceMenu"
            );


        if (!attendanceMenu) {
            return;
        }


        setTimeout(
            function() {

                loadRealAdminAttendance();

            },
            300
        );

    }
);


// =========================================================
// REFRESH ADMIN ATTENDANCE
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const refreshButton =
            event.target.closest(
                "#refreshAttendance"
            );


        if (!refreshButton) {
            return;
        }


        loadRealAdminAttendance();

    }
);

// =========================================================
// EXPORT ADMIN ATTENDANCE TO EXCEL
// =========================================================

document.addEventListener(
    "click",
    function (event) {

        const exportButton =
            event.target.closest(
                "#exportAttendanceExcel"
            );

        if (!exportButton) {
            return;
        }

       const table =
    document.querySelector(
        ".attendance-table"
    );

        const tableBody =
            document.getElementById(
                "attendanceTableBody"
            );

        if (!table || !tableBody) {
            alert(
                "Attendance table not found."
            );
            return;
        }

        const rows =
            table.querySelectorAll(
                "tr"
            );

        if (!rows.length) {
            alert(
                "No attendance data available to export."
            );
            return;
        }

        let csv = [];

        rows.forEach(
            function (row) {

                const cells =
                    row.querySelectorAll(
                        "th, td"
                    );

                const rowData = [];

                cells.forEach(
                    function (cell) {

                        let value =
                            cell.innerText
                                .replace(
                                    /\s+/g,
                                    " "
                                )
                                .trim();

                        value =
                            '"' +
                            value.replace(
                                /"/g,
                                '""'
                            ) +
                            '"';

                        rowData.push(
                            value
                        );

                    }
                );

                if (rowData.length) {

                    csv.push(
                        rowData.join(",")
                    );

                }

            }
        );

        const csvContent =
            "\uFEFF" +
            csv.join("\r\n");

        const blob =
            new Blob(
                [csvContent],
                {
                    type:
                        "text/csv;charset=utf-8;"
                }
            );

        const url =
            URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        const date =
            document.getElementById(
                "attendanceDateFilter"
            );

        const selectedDate =
            date && date.value
                ? date.value
                : "attendance";

        link.download =
            "EduPortal_Attendance_" +
            selectedDate +
            ".csv";

        document.body.appendChild(
            link
        );

        link.click();

        document.body.removeChild(
            link
        );

        URL.revokeObjectURL(
            url
        );

    }
);
// =========================================================
// APPLY ADMIN ATTENDANCE FILTERS
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const filterButton =
            event.target.closest(
                "#applyAttendanceFilters"
            );


        if (!filterButton) {
            return;
        }


        loadRealAdminAttendance();

    }
);
// =========================================================
// ADMIN ATTENDANCE DATE
// TODAY BY DEFAULT
// DATA LOADS ONLY AFTER APPLY FILTERS
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const dateFilter =
            document.getElementById(
                "attendanceDateFilter"
            );

        if (!dateFilter) {
            return;
        }

        dateFilter.value =
            getTodayDate();

    }
);
// =========================================================
// VIEW STUDENT ALL SUBJECT RESULTS
// =========================================================

async function viewStudentResults(studentId) {

  // ==========================================
// LOAD RESULTS FROM SUPABASE
// ==========================================

if (
    typeof supabaseClient ===
    "undefined"
) {
    alert(
        "Supabase connection is missing."
    );
    return;
}


const {
    data: rawResults,
    error: resultsError
} =
    await supabaseClient
        .from("results")
        .select(`
            id,
            student_id,
            subject_id,
            total_marks,
            marks,
            obtained_marks,
            percentage,
            grade
        `);


if (resultsError) {

    console.error(
        "VIEW RESULTS LOAD ERROR:",
        resultsError
    );

    alert(
        "Unable to load student results.\n\n" +
        resultsError.message
    );

    return;
}


// ==========================================
// LOAD STUDENTS
// ==========================================

const {
    data: students
} =
    await supabaseClient
        .from("students")
        .select(
            "id, student_id, name, full_name, student_class, section"
        );


// ==========================================
// LOAD SUBJECTS
// ==========================================

const {
    data: subjects
} =
    await supabaseClient
        .from("subjects")
        .select(
            "id, name"
        );


// ==========================================
// CONVERT SUPABASE DATA TO UI FORMAT
// ==========================================

const results =
    (rawResults || []).map(
        function(result) {

            const student =
                (students || []).find(
                    function(item) {

                        return String(
                            item.id
                        ) ===
                        String(
                            result.student_id
                        );
                    }
                );


            const subject =
                (subjects || []).find(
                    function(item) {

                        return String(
                            item.id
                        ) ===
                        String(
                            result.subject_id
                        );
                    }
                );


            return {

                id:
                    result.id,

                studentId:
                    student
                        ? (
                            student.student_id ||
                            student.id
                        )
                        : result.student_id,

                studentName:
                    student
                        ? (
                            student.name ||
                            student.full_name ||
                            "Student"
                        )
                        : "Student",

                studentClass:
                    student
                        ? (
                            student.student_class ||
                            "—"
                        )
                        : "—",

                section:
                    student
                        ? (
                            student.section ||
                            "—"
                        )
                        : "—",

                subject:
                    subject
                        ? (
                            subject.name ||
                            "—"
                        )
                        : "—",

                totalMarks:
                    result.total_marks ||
                    0,

                obtainedMarks:
                    result.obtained_marks ??
                    result.marks ??
                    0,

                percentage:
                    Number(
                        result.percentage
                    ) || 0,

                grade:
                    result.grade ||
                    "—"
            };
        }
    );


    // ==========================================
    // FIND STUDENT RESULTS
    // ==========================================

    const studentResults =
        results.filter(
            function(result) {

                return String(
                    result.studentId ||
                    result.student
                ) === String(
                    studentId
                );

            }
        );


    // ==========================================
    // NO RESULTS
    // ==========================================

    if (
        studentResults.length === 0
    ) {

        alert(
            "No results found for this student."
        );

        return;
    }


    // ==========================================
    // STUDENT INFORMATION
    // ==========================================

    const firstResult =
        studentResults[0];


    const studentName =
        firstResult.studentName ||
        firstResult.student ||
        "Student";


    const studentIdText =
        firstResult.studentId ||
        studentId;


    const studentClass =
        firstResult.studentClass ||
        "—";


    const section =
        firstResult.section ||
        "—";


    // ==========================================
    // CALCULATE OVERALL RESULT
    // ==========================================

    let totalMarks = 0;

    let obtainedMarks = 0;


    studentResults.forEach(
        function(result) {

            totalMarks +=
                Number(
                    result.totalMarks
                ) || 0;


            obtainedMarks +=
                Number(
                    result.obtainedMarks
                ) || 0;

        }
    );


    const overallPercentage =
        totalMarks > 0
            ? (
                obtainedMarks /
                totalMarks
            ) * 100
            : 0;


    let overallGrade = "—";


    if (
        overallPercentage >= 90
    ) {

        overallGrade = "A+";

    }

    else if (
        overallPercentage >= 80
    ) {

        overallGrade = "A";

    }

    else if (
        overallPercentage >= 70
    ) {

        overallGrade = "B";

    }

    else if (
        overallPercentage >= 60
    ) {

        overallGrade = "C";

    }

    else if (
        overallPercentage >= 50
    ) {

        overallGrade = "D";

    }

    else {

        overallGrade = "F";

    }


    // ==========================================
    // CREATE MODAL
    // ==========================================

    const oldModal =
        document.getElementById(
            "studentResultsViewModal"
        );


    if (oldModal) {

        oldModal.remove();

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "studentResultsViewModal";


    modal.innerHTML = `

        <div
            class="student-results-view-overlay"
        >

            <div
                class="student-results-view-modal"
            >

                <!-- HEADER -->

                <div
                    class="student-results-view-header"
                >

                    <div>

                        <h2>
                            📊 ${studentName}
                        </h2>

                        <p>
                            Student ID:
                            <strong>
                                ${studentIdText}
                            </strong>
                        </p>

                    </div>


                    <button
                        type="button"
                        class="student-results-close-btn"
                        id="closeStudentResultsView"
                    >
                        ✕
                    </button>

                </div>


                <!-- STUDENT INFO -->

                <div
                    class="student-results-info"
                >

                    <div>

                        <span>
                            Class
                        </span>

                        <strong>
                            ${studentClass}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Section
                        </span>

                        <strong>
                            ${section}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Subjects
                        </span>

                        <strong>
                            ${studentResults.length}
                        </strong>

                    </div>

                </div>


                <!-- OVERALL RESULT -->

                <div
                    class="student-results-overall"
                >

                    <div>

                        <span>
                            Total Marks
                        </span>

                        <strong>
                            ${totalMarks}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Obtained Marks
                        </span>

                        <strong>
                            ${obtainedMarks}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Percentage
                        </span>

                        <strong>
                            ${overallPercentage.toFixed(1)}%
                        </strong>

                    </div>


                    <div>

                        <span>
                            Grade
                        </span>

                        <strong>
                            ${overallGrade}
                        </strong>

                    </div>

                </div>


                <!-- SUBJECT RESULTS -->

                <div
                    class="student-results-subjects"
                >

                    <h3>
                        📚 Subject Results
                    </h3>


                    <div
                        class="student-results-subject-list"
                    >

                        ${studentResults.map(
                            function(result) {

                                return `

                                    <div
                                        class="student-result-subject-card"
                                    >

                                        <div>

                                            <strong>
                                                ${
                                                    result.subject ||
                                                    "Subject"
                                                }
                                            </strong>

                                            <span>
                                                ${
                                                    result.exam ||
                                                    "Exam"
                                                }
                                            </span>

                                        </div>


                                        <div>

                                            <span>
                                                ${
                                                    result.obtainedMarks ||
                                                    0
                                                }
                                                /
                                                ${
                                                    result.totalMarks ||
                                                    0
                                                }
                                            </span>

                                            <strong>
                                                ${
                                                    result.percentage ||
                                                    0
                                                }%
                                            </strong>

                                        </div>


                                        <div
                                            class="result-grade"
                                        >
                                            ${
                                                result.grade ||
                                                "—"
                                            }
                                        </div>

                                    </div>

                                `;

                            }
                        ).join("")}

                    </div>

                </div>


                <!-- CLOSE -->

                <div
                    class="student-results-view-footer"
                >

                    <button
                        type="button"
                        id="closeStudentResultsViewBottom"
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // ==========================================
    // CLOSE BUTTONS
    // ==========================================

    const closeModal =
        function() {

            const currentModal =
                document.getElementById(
                    "studentResultsViewModal"
                );


            if (currentModal) {

                currentModal.remove();

            }

        };


    const closeButton =
        document.getElementById(
            "closeStudentResultsView"
        );


    const closeBottomButton =
        document.getElementById(
            "closeStudentResultsViewBottom"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (closeBottomButton) {

        closeBottomButton.addEventListener(
            "click",
            closeModal
        );

    }


    // ==========================================
    // CLOSE WHEN CLICKING OUTSIDE
    // ==========================================

    const overlay =
        modal.querySelector(
            ".student-results-view-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            function(event) {

                if (
                    event.target ===
                    overlay
                ) {

                    closeModal();

                }

            }
        );

    }

}



// =========================================================
// EDU PORTAL - FINAL ADMIN MODULE NAVIGATION
// =========================================================

window.showAdminModuleDirect = function (module) {

 const moduleMap = {

    dashboard: "adminHomeSection",
    students: "adminStudentsSection",
    teachers: "adminTeachersSection",
    academicSetup: "adminAcademicSetupSection",
    attendance: "adminAttendanceSection",
    results: "adminResultsSection",
    fees: "adminFeesSection",
    assignments: "adminAssignmentsSection",
    notices: "adminNoticesSection",
    users: "adminUsersStudentsSection",
    settings: "adminSettingsSection"

};

    const targetId =
        moduleMap[module];

        if (module === "academicSetup") {

    setTimeout(function () {

        loadAcademicSetupAssignmentData();

    }, 100);

}

    if (!targetId) {
        console.error(
            "Unknown Admin Module:",
            module
        );
        return;
    }

    const sections = Object.values(
        moduleMap
    );

    // Hide all modules
    sections.forEach(
        function (sectionId) {

            const section =
                document.getElementById(
                    sectionId
                );

            if (section) {

                section.style.display =
                    "none";

                section.style.visibility =
                    "hidden";

                section.style.opacity =
                    "0";

            }

        }
    );

    // Show selected module
    const target =
        document.getElementById(
            targetId
        );

    if (!target) {
        console.error(
            "Admin section not found:",
            targetId
        );
        return;
    }

    target.style.display =
        "block";

    target.style.visibility =
        "visible";

    target.style.opacity =
        "1";

    // Active sidebar item
    document
        .querySelectorAll(
            "#adminDashboard .admin-sidebar li"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

            }
        );

    const activeMenu =
        document.getElementById(
            "admin" +
            module.charAt(0).toUpperCase() +
            module.slice(1) +
            "Menu"
        );

    if (activeMenu) {

        activeMenu.classList.add(
            "active"
        );

    }

    // Load module data
    setTimeout(
        async function () {

            try {

                if (
                    module ===
                    "students" &&
                    typeof renderAdminStudents ===
                    "function"
                ) {
                    await renderAdminStudents();
                }

                if (
                    module ===
                    "teachers" &&
                    typeof renderAdminTeachers ===
                    "function"
                ) {
                    await renderAdminTeachers();
                }

                if (
                    module ===
                    "attendance"
                ) {

                    if (
                        typeof renderAttendanceTable ===
                        "function"
                    ) {
                        await renderAttendanceTable();
                    }

                    if (
                        typeof updateAttendanceStatistics ===
                        "function"
                    ) {
                        await updateAttendanceStatistics();
                    }

                }

                if (
                    module ===
                    "results" &&
                    typeof renderResultsTable ===
                    "function"
                ) {
                    await renderResultsTable();
                }

                if (
                    module ===
                    "fees"
                ) {

                    if (
                        typeof loadFeeStudents ===
                        "function"
                    ) {
                        await loadFeeStudents();
                    }

                    if (
                        typeof renderFeeRecords ===
                        "function"
                    ) {
                        await renderFeeRecords();
                    }

                    if (
                        typeof updateAdminFeeAnalytics ===
                        "function"
                    ) {
                        await updateAdminFeeAnalytics();
                    }

                }

                if (
                    module ===
                    "assignments" &&
                    typeof renderAdminAssignments ===
                    "function"
                ) {
                    await renderAdminAssignments();
                }

                if (
                    module ===
                    "notices" &&
                    typeof renderAdminNotices ===
                    "function"
                ) {
                    await renderAdminNotices();
                }

                if (
                    module ===
                    "users" &&
                    typeof renderUserManagementStudents ===
                    "function"
                ) {
                    await renderUserManagementStudents();
                }

                if (
                    module ===
                    "settings" &&
                    typeof loadEmailSettings ===
                    "function"
                ) {
                    await loadEmailSettings();
                }

            }
            catch (error) {

                console.error(
                    "Admin Module Load Error:",
                    module,
                    error
                );

            }

        },
        0
    );

};
// ==========================================
// ADMINISTRATOR LIVE DATE
// ==========================================

function updateAdminLiveDate() {
    const dateElement = document.getElementById("adminLiveDate");

    if (!dateElement) return;

    const now = new Date();

    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    };

    dateElement.textContent = now.toLocaleDateString("en-GB", options);
}

// Run immediately
updateAdminLiveDate();

// Keep date updated
setInterval(updateAdminLiveDate, 60000);

// =========================================================
// TEACHER HEADER - LIVE DATE
// =========================================================

function updateTeacherLiveDate() {

    const dateElement =
        document.getElementById(
            "teacherLiveDate"
        );

    if (!dateElement) {
        return;
    }

    const now = new Date();

    dateElement.textContent =
        now.toLocaleDateString(
            "en-GB",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );
}

document.addEventListener(
    "DOMContentLoaded",
    function () {
        updateTeacherLiveDate();
    }
);

setInterval(
    updateTeacherLiveDate,
    60000
);
// =========================================================
// TEACHER HEADER PROFILE + LOGOUT
// =========================================================

document.addEventListener("click", function (event) {

    // PROFILE BUTTON
    const profileButton = event.target.closest(
        "#teacherHeaderProfileBtn"
    );

    const dropdown = document.getElementById(
        "teacherHeaderDropdown"
    );

    // Open / close profile dropdown
    if (profileButton) {

        event.preventDefault();

        if (dropdown) {
            dropdown.classList.toggle("open");
        }

        return;
    }


    // LOGOUT BUTTONS
    const logoutButton = event.target.closest(
        "#teacherHeaderLogoutBtn, #teacherLogoutMenu"
    );

    if (logoutButton) {

        event.preventDefault();
        event.stopPropagation();

        if (dropdown) {
            dropdown.classList.remove("open");
        }

        logoutTeacher();

        return;
    }


    // CLICK OUTSIDE DROPDOWN
    if (
        dropdown &&
        !event.target.closest(".teacher-header-profile")
    ) {
        dropdown.classList.remove("open");
    }

});
// ==========================================
// ADMIN TEACHER MODAL - CLOSE / CANCEL FIX
// ==========================================

document.addEventListener("click", function (event) {

    // CLOSE X BUTTON
    const closeTeacherButton =
        event.target.closest("#closeAdminTeacherModal");

    if (closeTeacherButton) {

        const teacherModal =
            document.getElementById("adminTeacherModal");

        if (teacherModal) {
            teacherModal.style.display = "none";
        }

        const teacherForm =
            document.getElementById("adminTeacherForm");

        if (teacherForm) {
            teacherForm.reset();
        }

        return;
    }


    // CANCEL BUTTON
    const cancelTeacherButton =
        event.target.closest("#cancelAdminTeacher");

    if (cancelTeacherButton) {

        const teacherModal =
            document.getElementById("adminTeacherModal");

        if (teacherModal) {
            teacherModal.style.display = "none";
        }

        const teacherForm =
            document.getElementById("adminTeacherForm");

        if (teacherForm) {
            teacherForm.reset();
        }

        return;
    }


    // CLICK ON BACKDROP TO CLOSE
    const teacherModal =
        document.getElementById("adminTeacherModal");

    if (
        teacherModal &&
        event.target === teacherModal
    ) {
        teacherModal.style.display = "none";
    }

});
// ==========================================
// STUDENT SUBMIT FEE PAYMENT
// ==========================================

document.addEventListener(
    "click",
    async function (event) {

        const button =
            event.target.closest(
                ".student-fee-pay-btn"
            );

        if (!button) {
            return;
        }

        const feeRecordId =
            button.dataset.feeRecordId;

        const remainingAmount =
            Number(
                button.dataset.remaining
            ) || 0;

        if (!feeRecordId) {
            return;
        }

        const confirmPay =
            confirm(
                "Confirm submitting fee payment of Rs. " +
                remainingAmount.toLocaleString() +
                "?"
            );

        if (!confirmPay) {
            return;
        }

        if (
            typeof supabaseClient ===
            "undefined"
        ) {
            alert(
                "Supabase connection is missing."
            );
            return;
        }

        // ==========================================
        // GET CURRENT RECORD
        // ==========================================

        const {
            data: feeRecord,
            error: loadError
        } =
            await supabaseClient
                .from("fee_records")
                .select("*")
                .eq(
                    "id",
                    feeRecordId
                )
                .maybeSingle();

        if (loadError || !feeRecord) {

            alert(
                "Unable to load fee record."
            );

            return;
        }

        const newPaidAmount =
            Number(feeRecord.fee_amount || 0);

        // ==========================================
        // UPDATE FEE RECORD - MARK AS PAID
        // ==========================================

        const {
            error
        } =
            await supabaseClient
                .from("fee_records")
                .update({
                    paid_amount:
                        newPaidAmount,

                    remaining_amount:
                        0,

                    status:
                        "Paid",

                    payment_date:
                        new Date()
                            .toISOString()
                            .split("T")[0]
                })
                .eq(
                    "id",
                    feeRecordId
                );

        if (error) {

            console.error(
                "FEE PAYMENT ERROR:",
                error
            );

            alert(
                "Payment could not be submitted.\n\n" +
                error.message
            );

            return;
        }

        alert(
            "Fee submitted successfully! ✅"
        );

        // Refresh fee section
        const student =
            StudentDashboard.getStudent();

        StudentDashboard.loadFees(student);

    }
);
// =========================================================
// EDUPORTAL - FAST + SAFE LIVE DATA SYSTEM
// REALTIME PRIMARY + 60 SECOND SAFETY SYNC
// =========================================================

let eduPortalRefreshRunning = false;
let eduPortalRefreshTimer = null;
let eduPortalLastRefresh = 0;

const EDUPORTAL_SAFETY_REFRESH = 60000;
const EDUPORTAL_REALTIME_DEBOUNCE = 500;


// =========================================================
// GET CURRENT LOGIN ROLE
// =========================================================

function getEduPortalRole() {

    const loggedIn =
        localStorage.getItem("isLoggedIn");

    const role =
        localStorage.getItem("loggedInRole");

    if (loggedIn !== "true") {
        return null;
    }

    return role || null;
}


// =========================================================
// DASHBOARD REFRESH
// =========================================================

async function refreshActiveDashboardData(force = false) {

    if (eduPortalRefreshRunning) {
        return;
    }

    const role = getEduPortalRole();

    if (!role) {
        return;
    }

    if (
        !force &&
        document.visibilityState !== "visible"
    ) {
        return;
    }

    const now = Date.now();

    if (
        !force &&
        now - eduPortalLastRefresh < 3000
    ) {
        return;
    }

    eduPortalRefreshRunning = true;
    eduPortalLastRefresh = now;

    try {

        if (role === "administrator") {

            if (
                typeof AdminDashboard !== "undefined" &&
                typeof AdminDashboard.loadData === "function"
            ) {

                await AdminDashboard.loadData();

            }

            return;
        }


        if (role === "teacher") {

            if (
                typeof loadTeacherDashboardData ===
                "function"
            ) {

                await loadTeacherDashboardData();

            }

            return;
        }


        if (role === "student") {

            if (
                typeof StudentDashboard !==
                "undefined" &&
                typeof StudentDashboard.loadDashboard ===
                "function"
            ) {

                const savedStudent =
                    localStorage.getItem(
                        "loggedInStudent"
                    );

                if (savedStudent) {

                    const student =
                        JSON.parse(savedStudent);

                    await StudentDashboard.loadDashboard(
                        student
                    );
                }
            }

            return;
        }

    }
    catch (error) {

        console.error(
            "EduPortal Safety Sync Error:",
            error
        );

    }
    finally {

        eduPortalRefreshRunning = false;

    }
}


// =========================================================
// REALTIME DEBOUNCED REFRESH
// =========================================================

function queueEduPortalRealtimeRefresh() {

    clearTimeout(
        eduPortalRefreshTimer
    );

    eduPortalRefreshTimer =
        setTimeout(
            function () {

                refreshActiveDashboardData(true);

            },
            EDUPORTAL_REALTIME_DEBOUNCE
        );
}


// =========================================================
// INITIAL LOAD
// =========================================================

window.addEventListener(
    "load",
    function () {

        setTimeout(
            function () {

                refreshActiveDashboardData(true);

            },
            800
        );

    }
);


// =========================================================
// 60 SECOND SAFETY REFRESH
// =========================================================

setInterval(
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            refreshActiveDashboardData(false);

        }

    },
    EDUPORTAL_SAFETY_REFRESH
);


// =========================================================
// TAB RETURN
// =========================================================

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState ===
            "visible"
        ) {

            refreshActiveDashboardData(true);

        }

    }
);


// =========================================================
// INTERNET RETURN
// =========================================================

window.addEventListener(
    "online",
    function () {

        refreshActiveDashboardData(true);

    }
);


console.log(
    "EduPortal Fast + Safe Live Data System Loaded."
);
// =========================================================
// EDUPORTAL - ADMIN FORGOT PASSWORD
// OPEN RECOVERY SCREEN
// =========================================================

document.addEventListener(
    "click",
    function (event) {

        const forgotLink =
            event.target.closest(
                "#adminForgotPasswordLink"
            );

        if (!forgotLink) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const loginBox =
            document.querySelector(".login-box");

        const recoveryPage =
            document.getElementById(
                "adminRecoveryPage"
            );

        if (!recoveryPage) {

            console.error(
                "adminRecoveryPage not found."
            );

            alert(
                "Password recovery page could not be loaded."
            );

            return;
        }

        // Hide login
        if (loginBox) {
            loginBox.style.display = "none";
        }

        // Hide login
        if (loginBox) {
            loginBox.style.display = "none";
        }

        // Move recovery page out of the hidden adminDashboard container
        document.body.appendChild(recoveryPage);

        // Show recovery page
        recoveryPage.style.display = "flex";


        // Show recovery page
        recoveryPage.style.display = "flex";

        recoveryPage.style.position = "fixed";
        recoveryPage.style.inset = "0";
        recoveryPage.style.width = "100%";
        recoveryPage.style.height = "100%";
        recoveryPage.style.zIndex = "999999";

        document.body.style.overflow = "auto";

        console.log(
            "Admin Recovery Screen Opened ✅"
        );
    },
    true
);
// ==========================================
// ADMIN FORGOT PASSWORD - LIVE EMAIL OTP
// ==========================================

(function () {

    const RECOVERY_ENDPOINT =
        SUPABASE_URL + "/functions/v1/admin-recovery";

    let recoveryUsername = null;
    let recoveryOtp = null;


    function recoveryMessage(text, isError) {

        const box =
            document.getElementById("adminRecoveryMessage");

        if (!box) return;

        box.textContent = text;

        box.style.color =
            isError ? "#dc2626" : "#16a34a";
    }


    function setButtonLoading(button, isLoading, originalText) {

        if (!button) return;

        button.disabled = isLoading;

        button.textContent =
            isLoading ? "Please wait..." : originalText;
    }


    async function callRecovery(payload) {

        const response =
            await fetch(RECOVERY_ENDPOINT, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + SUPABASE_PUBLISHABLE_KEY,
                    "apikey": SUPABASE_PUBLISHABLE_KEY
                },

                body: JSON.stringify(payload)
            });

        let result = {};

        try {
            result = await response.json();
        } catch (error) {
            result = { error: "Unexpected server response." };
        }

        return result;
    }


    // ==========================================
    // STEP 1 - SEND OTP TO REGISTERED EMAIL
    // ==========================================

    document.addEventListener("click", async function (event) {

        const button =
            event.target.closest("#adminSendOtpBtn");

        if (!button) return;

        const input =
            document.getElementById("adminRecoveryEmail");

        const username =
            input ? input.value.trim() : "";

        if (!username) {
            recoveryMessage(
                "Please enter your administrator username.",
                true
            );
            return;
        }

        setButtonLoading(button, true, "Send OTP to Email");

        const result =
            await callRecovery({
                action: "send",
                username: username
            });

        setButtonLoading(button, false, "Send OTP to Email");

        if (result.error) {
            recoveryMessage(result.error, true);
            return;
        }

        recoveryUsername = username;

        recoveryMessage(
            "A 6-digit code has been sent to " +
            (result.maskedEmail || "your registered email") +
            ". It expires in 10 minutes.",
            false
        );

        const emailStep =
            document.getElementById("adminRecoveryEmailStep");

        const otpStep =
            document.getElementById("adminRecoveryOtpStep");

        if (emailStep) emailStep.style.display = "none";
        if (otpStep) otpStep.style.display = "block";

    });


    // ==========================================
    // STEP 2 - VERIFY OTP
    // ==========================================

    document.addEventListener("click", async function (event) {

        const button =
            event.target.closest("#adminVerifyOtpBtn");

        if (!button) return;

        const input =
            document.getElementById("adminRecoveryOtp");

        const otp =
            input ? input.value.trim() : "";

        if (!otp) {
            recoveryMessage(
                "Please enter the verification code.",
                true
            );
            return;
        }

        if (!recoveryUsername) {
            recoveryMessage(
                "Session expired. Please start again.",
                true
            );
            return;
        }

        setButtonLoading(button, true, "Verify OTP");

        const result =
            await callRecovery({
                action: "verify",
                username: recoveryUsername,
                otp: otp
            });

        setButtonLoading(button, false, "Verify OTP");

        if (result.error) {
            recoveryMessage(result.error, true);
            return;
        }

        recoveryOtp = otp;

        recoveryMessage(
            "Code verified. Please set your new password.",
            false
        );

        const otpStep =
            document.getElementById("adminRecoveryOtpStep");

        const passwordStep =
            document.getElementById("adminRecoveryPasswordStep");

        if (otpStep) otpStep.style.display = "none";
        if (passwordStep) passwordStep.style.display = "block";

    });


    // ==========================================
    // STEP 3 - RESET PASSWORD
    // ==========================================

    document.addEventListener("click", async function (event) {

        const button =
            event.target.closest("#adminResetPasswordBtn");

        if (!button) return;

        const newInput =
            document.getElementById("adminNewPassword");

        const confirmInput =
            document.getElementById("adminConfirmPassword");

        const newPassword =
            newInput ? newInput.value.trim() : "";

        const confirmPassword =
            confirmInput ? confirmInput.value.trim() : "";

        if (!newPassword || !confirmPassword) {
            recoveryMessage(
                "Please fill in both password fields.",
                true
            );
            return;
        }

        if (newPassword.length < 6) {
            recoveryMessage(
                "Password must be at least 6 characters.",
                true
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            recoveryMessage(
                "Passwords do not match.",
                true
            );
            return;
        }

        if (!recoveryUsername || !recoveryOtp) {
            recoveryMessage(
                "Session expired. Please start again.",
                true
            );
            return;
        }

        setButtonLoading(button, true, "Reset Password");

        const result =
            await callRecovery({
                action: "reset",
                username: recoveryUsername,
                otp: recoveryOtp,
                newPassword: newPassword
            });

        setButtonLoading(button, false, "Reset Password");

        if (result.error) {
            recoveryMessage(result.error, true);
            return;
        }

              recoveryMessage(
            "Password reset successfully! Redirecting to login...",
            false
        );

        setTimeout(function () {

            recoveryUsername = null;
            recoveryOtp = null;

            const emailStep =
                document.getElementById("adminRecoveryEmailStep");

            const otpStep =
                document.getElementById("adminRecoveryOtpStep");

            const passwordStep =
                document.getElementById("adminRecoveryPasswordStep");

            if (emailStep) emailStep.style.display = "block";
            if (otpStep) otpStep.style.display = "none";
            if (passwordStep) passwordStep.style.display = "none";

            const usernameInput =
                document.getElementById("adminRecoveryEmail");

            const otpInput =
                document.getElementById("adminRecoveryOtp");

            if (usernameInput) usernameInput.value = "";
            if (otpInput) otpInput.value = "";
            if (newInput) newInput.value = "";
            if (confirmInput) confirmInput.value = "";

            recoveryMessage("", false);

            // ==========================================
            // DIRECTLY SHOW LOGIN SCREEN
            // NO PAGE REFRESH NEEDED
            // ==========================================

            const recoveryPage =
                document.getElementById("adminRecoveryPage");

            const loginBox =
                document.querySelector(".login-box");

            const loginContainer =
                document.querySelector(".container");

            if (recoveryPage) {

                recoveryPage.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

            }

            if (loginContainer) {

                loginContainer.classList.remove(
                    "session-hidden"
                );

                loginContainer.style.setProperty(
                    "display",
                    "flex",
                    "important"
                );

                loginContainer.style.setProperty(
                    "visibility",
                    "visible",
                    "important"
                );

                loginContainer.style.setProperty(
                    "opacity",
                    "1",
                    "important"
                );

            }

            if (loginBox) {

                loginBox.style.setProperty(
                    "display",
                    "flex",
                    "important"
                );

            }

            document.body.style.overflow = "";

            // Reset the login form fields too
            const usernameField =
                document.getElementById("username");

            const passwordField =
                document.getElementById("password");

            const roleField =
                document.getElementById("loginRole");

            const messageField =
                document.getElementById("message");

            if (usernameField) usernameField.value = "";
            if (passwordField) passwordField.value = "";
            if (roleField) roleField.value = "administrator";
            if (messageField) messageField.textContent = "";

            window.scrollTo({
                top: 0,
                behavior: "instant"
            });

        }, 2000);

    });

})();
// =========================================================
// ATTENDANCE HISTORY DATE FILTER
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const dateInput =
            document.getElementById(
                "attendanceHistoryDateFilter"
            );

        if (!dateInput) {
            return;
        }


        // Default = Today
        if (!dateInput.value) {

            dateInput.value =
                getStudentAttendanceDate();

        }


        // Load selected date
        dateInput.addEventListener(
            "change",
            function() {

                loadRealStudentAttendance();

            }
        );

    }
);
// =========================================================
// TEACHER DASHBOARD - REAL TIME ATTENDANCE OVERVIEW
// FIXED VERSION
// =========================================================

async function renderTeacherAttendanceOverview() {

    const chart =
        document.getElementById(
            "teacherAttendanceChart"
        );

    const periodSelect =
        document.getElementById(
            "teacherAttendancePeriod"
        );

    if (!chart) {
        return;
    }

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.error(
            "Supabase client not available."
        );
        return;
    }


    // =====================================================
    // GET LOGGED-IN TEACHER
    // =====================================================

    let teacher = {};

    try {

        teacher =
            JSON.parse(
                localStorage.getItem(
                    "loggedInTeacher"
                )
            ) || {};

    } catch (error) {

        console.error(
            "Teacher session error:",
            error
        );

        return;
    }


    // =====================================================
    // GET TEACHER CLASS
    // =====================================================

    const teacherClass =
        String(
            teacher.teacherClass ||
            teacher.teacher_class ||
            teacher.class ||
            teacher.assigned_class ||
            ""
        )
        .trim()
        .toLowerCase()
        .replace(
            /^class\s+/i,
            ""
        );


    if (!teacherClass) {

        console.warn(
            "Teacher class not found."
        );

        return;
    }


    // =====================================================
    // GET STUDENTS
    // =====================================================

    const {
        data: students,
        error: studentsError
    } =
        await supabaseClient
            .from("students")
            .select(
                "id, student_class"
            );


    if (studentsError) {

        console.error(
            "Teacher attendance students error:",
            studentsError
        );

        return;
    }


    // =====================================================
    // ONLY TEACHER'S CLASS
    // =====================================================

    const assignedStudents =
        (students || []).filter(
            function(student) {

                const studentClass =
                    String(
                        student.student_class ||
                        ""
                    )
                    .trim()
                    .toLowerCase()
                    .replace(
                        /^class\s+/i,
                        ""
                    );

                return (
                    studentClass ===
                    teacherClass
                );

            }
        );


    const studentIds =
        assignedStudents.map(
            function(student) {

                return student.id;

            }
        );


    const totalStudents =
        assignedStudents.length;


    // =====================================================
    // SELECT PERIOD
    // =====================================================

    const selectedPeriod =
        periodSelect &&
        periodSelect.value
            ? periodSelect.value
            : "today";


    // =====================================================
    // CURRENT DATE
    // =====================================================

    const now =
        new Date();


    // =====================================================
    // HELPER - START OF DAY
    // =====================================================

    function startOfDay(date) {

        const result =
            new Date(date);

        result.setHours(
            0,
            0,
            0,
            0
        );

        return result;

    }


    // =====================================================
    // HELPER - FORMAT YYYY-MM-DD
    // =====================================================

    function formatDate(date) {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(
                2,
                "0"
            );

        const day =
            String(
                date.getDate()
            ).padStart(
                2,
                "0"
            );

        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }


    // =====================================================
    // BUILD PERIODS
    // =====================================================

    let points = [];


    // =====================================================
    // TODAY
    // =====================================================

    if (
        selectedPeriod ===
        "today"
    ) {

        const start =
            startOfDay(now);

        const end =
            new Date(start);

        end.setDate(
            end.getDate() + 1
        );

        points.push({

            start:
                start,

            end:
                end,

            label:
                "Today"

        });

    }


    // =====================================================
    // YESTERDAY
    // =====================================================

    else if (
        selectedPeriod ===
        "yesterday"
    ) {

        const end =
            startOfDay(now);

        const start =
            new Date(end);

        start.setDate(
            start.getDate() - 1
        );

        points.push({

            start:
                start,

            end:
                end,

            label:
                "Yesterday"

        });

    }


    // =====================================================
    // LAST 7 DAYS
    // =====================================================

    else if (
        selectedPeriod ===
        "last7"
    ) {

        for (
            let i = 6;
            i >= 0;
            i--
        ) {

            const start =
                startOfDay(now);

            start.setDate(
                start.getDate() - i
            );

            const end =
                new Date(start);

            end.setDate(
                end.getDate() + 1
            );

            points.push({

                start:
                    start,

                end:
                    end,

                label:
                    start.toLocaleDateString(
                        "en-US",
                        {
                            weekday:
                                "short"
                        }
                    )

            });

        }

    }


    // =====================================================
    // LAST MONTH / MONTH VIEW
    // =====================================================

    else {

        const monthStart =
            new Date(
                now.getFullYear(),
                now.getMonth(),
                1
            );

        const nextMonth =
            new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                1
            );

        const totalDays =
            Math.round(
                (
                    nextMonth -
                    monthStart
                ) /
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            );


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const start =
                new Date(
                    monthStart
                );

            start.setDate(
                1 +
                Math.floor(
                    (
                        i *
                        totalDays
                    ) / 5
                )
            );

            start.setHours(
                0,
                0,
                0,
                0
            );


            const end =
                new Date(
                    monthStart
                );

            end.setDate(
                1 +
                Math.floor(
                    (
                        (i + 1) *
                        totalDays
                    ) / 5
                )
            );

            end.setHours(
                0,
                0,
                0,
                0
            );


            points.push({

                start:
                    start,

                end:
                    end,

                label:
                    "Week " +
                    (i + 1)

            });

        }

    }


    // =====================================================
    // GET ATTENDANCE DATA
    // =====================================================

    let attendance = [];


    if (
        studentIds.length > 0 &&
        points.length > 0
    ) {

        const firstDate =
            points[0].start;

        const lastDate =
            points[
                points.length - 1
            ].end;


        const {
            data,
            error
        } =
            await supabaseClient
                .from("attendance")
                .select(
                    "student_id, attendance_date, status"
                )
                .in(
                    "student_id",
                    studentIds
                )
                .gte(
                    "attendance_date",
                    formatDate(
                        firstDate
                    )
                )
                .lt(
                    "attendance_date",
                    formatDate(
                        lastDate
                    )
                );


        if (error) {

            console.error(
                "Teacher attendance query error:",
                error
            );

            return;
        }


        attendance =
            data || [];

    }


    // =====================================================
    // CALCULATE ATTENDANCE FOR EACH PERIOD
    // =====================================================

    points.forEach(
        function(point) {

            point.present = 0;

            point.absent =
                totalStudents;


            const pointStart =
                startOfDay(
                    point.start
                );

            const pointEnd =
                point.end;


            // ------------------------------------------------
            // FIND RECORDS FOR THIS PERIOD
            // ------------------------------------------------

            const periodRecords =
                attendance.filter(
                    function(record) {

                        const recordDate =
                            String(
                                record.attendance_date ||
                                ""
                            )
                            .substring(
                                0,
                                10
                            );


                        const recordDateObject =
                            new Date(
                                recordDate +
                                "T00:00:00"
                            );


                        return (
                            recordDateObject >=
                                pointStart &&
                            recordDateObject <
                                pointEnd
                        );

                    }
                );


            // ------------------------------------------------
            // UNIQUE STUDENTS PRESENT
            // ------------------------------------------------

            const presentStudentIds =
                new Set();


            periodRecords.forEach(
                function(record) {

                    const status =
                        String(
                            record.status ||
                            ""
                        )
                        .trim()
                        .toLowerCase();


                    if (
                        status === "present" ||
                        status === "late" ||
                        status === "p"
                    ) {

                        presentStudentIds.add(
                            String(
                                record.student_id
                            )
                        );

                    }

                }
            );


            point.present =
                presentStudentIds.size;


            // ------------------------------------------------
            // NO RECORD = ABSENT
            // ------------------------------------------------

            point.absent =
                Math.max(
                    0,
                    totalStudents -
                    point.present
                );

        }
    );


    // =====================================================
    // HEATMAP ELEMENTS
    // =====================================================

    const heatmapCells =
        chart.querySelectorAll(
            ".teacher-heatmap-cell"
        );

    const heatmapLabels =
        chart.querySelectorAll(
            ".teacher-heatmap-day"
        );

    const heatmapPercentages =
        chart.querySelectorAll(
            ".teacher-heatmap-percentage"
        );

    const heatmapIcons =
        chart.querySelectorAll(
            ".teacher-heatmap-icon"
        );


    // =====================================================
    // UPDATE HEATMAP
    // =====================================================

    points.forEach(
        function(point, index) {

            if (
                !heatmapCells[index]
            ) {
                return;
            }


            const percentage =
                totalStudents > 0
                    ? Math.round(
                        (
                            point.present /
                            totalStudents
                        ) * 100
                    )
                    : 0;


            // ------------------------------------------------
            // LABEL
            // ------------------------------------------------

            if (
                heatmapLabels[index]
            ) {

                heatmapLabels[index]
                    .textContent =
                        point.label;

            }


            // ------------------------------------------------
            // PERCENTAGE
            // ------------------------------------------------

            if (
                heatmapPercentages[index]
            ) {

                heatmapPercentages[index]
                    .textContent =
                        percentage +
                        "%";

            }


            // ------------------------------------------------
            // REMOVE OLD LEVEL
            // ------------------------------------------------

            heatmapCells[index]
                .classList.remove(
                    "heatmap-level-good",
                    "heatmap-level-warning",
                    "heatmap-level-danger"
                );


            // ------------------------------------------------
            // STATUS
            // ------------------------------------------------

            if (
                percentage >= 80
            ) {

                heatmapCells[index]
                    .classList.add(
                        "heatmap-level-good"
                    );


                if (
                    heatmapIcons[index]
                ) {

                    heatmapIcons[index]
                        .textContent =
                            "✓";

                }

            }

            else if (
                percentage >= 60
            ) {

                heatmapCells[index]
                    .classList.add(
                        "heatmap-level-warning"
                    );


                if (
                    heatmapIcons[index]
                ) {

                    heatmapIcons[index]
                        .textContent =
                            "!";

                }

            }

            else {

                heatmapCells[index]
                    .classList.add(
                        "heatmap-level-danger"
                    );


                if (
                    heatmapIcons[index]
                ) {

                    heatmapIcons[index]
                        .textContent =
                            "×";

                }

            }


            // ------------------------------------------------
            // TOOLTIP
            // ------------------------------------------------

            heatmapCells[index].title =
                "Present: " +
                point.present +
                " | Absent: " +
                point.absent;

        }
    );


    // =====================================================
    // HIDE UNUSED HEATMAP CELLS
    // =====================================================

    for (
        let i = 0;
        i < heatmapCells.length;
        i++
    ) {

        if (
            i < points.length
        ) {

            heatmapCells[i].style.display =
                "";

        } else {

            heatmapCells[i].style.display =
                "none";

        }

    }


    // =====================================================
    // ALSO SUPPORT OLD BAR CHART IF PRESENT
    // =====================================================

    const presentBars =
        chart.querySelectorAll(
            ".teacher-present-bar"
        );

    const absentBars =
        chart.querySelectorAll(
            ".teacher-absent-bar"
        );

    const labels =
        chart.querySelectorAll(
            ".teacher-chart-column small"
        );


    points.forEach(
        function(point, index) {

            if (
                !presentBars[index] ||
                !absentBars[index]
            ) {
                return;
            }


            const total =
                point.present +
                point.absent;


            const presentHeight =
                total > 0
                    ? (
                        point.present /
                        total
                    ) * 100
                    : 0;


            const absentHeight =
                total > 0
                    ? (
                        point.absent /
                        total
                    ) * 100
                    : 0;


            presentBars[index]
                .style.height =
                    presentHeight +
                    "%";


            absentBars[index]
                .style.height =
                    absentHeight +
                    "%";


            presentBars[index].title =
                "Present: " +
                point.present;


            absentBars[index].title =
                "Absent: " +
                point.absent;


            if (
                labels[index]
            ) {

                labels[index]
                    .textContent =
                        point.label;

            }

        }
    );


    // =====================================================
    // CLEAR EXTRA OLD BARS
    // =====================================================

    for (
        let i = points.length;
        i < presentBars.length;
        i++
    ) {

        presentBars[i]
            .style.height =
                "0%";

        absentBars[i]
            .style.height =
                "0%";

    }


    // =====================================================
    // FINAL LOG
    // =====================================================

    console.log(
        "TEACHER ATTENDANCE OVERVIEW LIVE:",
        {
            teacherClass,
            totalStudents,
            selectedPeriod,
            points
        }
    );

}
// =========================================================
// TEACHER ATTENDANCE OVERVIEW - REALTIME
// =========================================================

let teacherAttendanceOverviewRealtime =
    null;

function initializeTeacherAttendanceOverviewRealtime() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        return;
    }

    if (
        teacherAttendanceOverviewRealtime
    ) {
        return;
    }

    teacherAttendanceOverviewRealtime =
        supabaseClient
            .channel(
                "teacher-attendance-overview-live"
            )

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "attendance"
                },
                async function(payload) {

                    console.log(
                        "ATTENDANCE OVERVIEW REALTIME:",
                        payload
                    );

                    await renderTeacherAttendanceOverview();

                }
            )

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "students"
                },
                async function(payload) {

                    console.log(
                        "STUDENT OVERVIEW REALTIME:",
                        payload
                    );

                    await renderTeacherAttendanceOverview();

                }
            )

            .subscribe(
                function(status) {

                    console.log(
                        "ATTENDANCE OVERVIEW REALTIME STATUS:",
                        status
                    );

                }
            );

}


// =========================================================
// INITIALIZE REALTIME
// =========================================================

setTimeout(
    function() {

        if (
            typeof renderTeacherAttendanceOverview ===
            "function"
        ) {

            renderTeacherAttendanceOverview();

        }

        initializeTeacherAttendanceOverviewRealtime();

    },
    1000
);

// =========================================================
// TEACHER ATTENDANCE CHART INITIALIZATION
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const periodSelect =
            document.getElementById(
                "teacherAttendancePeriod"
            );


        if (periodSelect) {

            periodSelect.addEventListener(
                "change",
                function () {

                    renderTeacherAttendanceOverview();

                }
            );

        }

    }
);


// =========================================================
// REFRESH CHART WHEN TEACHER OPENS DASHBOARD
// =========================================================

document.addEventListener(
    "click",
    function (event) {

        const dashboardMenu =
            event.target.closest(
                "#teacherDashboardMenu"
            );


        if (!dashboardMenu) {
            return;
        }


        setTimeout(
            function () {

const periodSelect =
    document.getElementById(
        "teacherAttendancePeriod"
    );

if (periodSelect) {

    periodSelect.value =
        "today";

}

                renderTeacherAttendanceOverview();
loadTeacherStudentsDistribution();

            },
            150
        );

    }
);
// =========================================================
// EDUPORTAL — TEACHER SIDEBAR FINAL NAVIGATION
// SINGLE WORKING HANDLER
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

    const teacherDashboard =
        document.getElementById("teacherDashboard");

    if (!teacherDashboard) {
        console.warn(
            "Teacher Dashboard not found."
        );
        return;
    }


    // =====================================================
    // TEACHER MENU MAP
    // =====================================================

    const teacherMenus = [
        "teacherDashboardMenu",
        "teacherStudentsMenu",
        "teacherAttendanceMenu",
        "teacherAssignmentsMenu",
        "teacherResultsMenu",
        "teacherNoticesMenu",
        "teacherProfileMenu",
        "teacherSettingsMenu"
    ];


    // =====================================================
    // TEACHER SECTIONS
    // =====================================================

    const teacherSections = [
        "teacherDashboardHome",
        "teacherStudentsSection",
        "teacherAttendanceSection",
        "teacherAssignmentsSection",
        "teacherResultsSection",
        "teacherNoticesSection",
        "teacherProfileSection",
        "teacherSettingsSection"
    ];


    // =====================================================
    // PAGE TITLES
    // =====================================================

    const teacherTitles = {

        teacherDashboardHome:
            "Dashboard",

        teacherStudentsSection:
            "My Students",

        teacherAttendanceSection:
            "Attendance",

        teacherAssignmentsSection:
            "Assignments",

        teacherResultsSection:
            "Results",

        teacherNoticesSection:
            "Notices",

        teacherProfileSection:
            "My Profile",

        teacherSettingsSection:
            "Settings"

    };


    // =====================================================
    // HIDE ALL TEACHER SECTIONS
    // =====================================================

    function hideTeacherSections() {

        teacherSections.forEach(function (sectionId) {

            const section =
                document.getElementById(sectionId);

            if (!section) {
                return;
            }

            section.style.setProperty(
                "display",
                "none",
                "important"
            );

            section.style.setProperty(
                "visibility",
                "hidden",
                "important"
            );

            section.style.setProperty(
                "opacity",
                "0",
                "important"
            );

        });

    }


    // =====================================================
    // REMOVE ACTIVE FROM MENU
    // =====================================================

    function clearTeacherActiveMenu() {

        teacherMenus.forEach(function (menuId) {

            const menu =
                document.getElementById(menuId);

            if (menu) {
                menu.classList.remove("active");
            }

        });

    }


    // =====================================================
    // LOAD SECTION DATA
    // =====================================================

    function loadTeacherSectionData(sectionId) {

        if (
            sectionId ===
            "teacherDashboardHome"
        ) {

            if (
                typeof loadTeacherDashboardData ===
                "function"
            ) {

                loadTeacherDashboardData();

            }

            return;
        }


        if (
            sectionId ===
            "teacherStudentsSection"
        ) {

            if (
                typeof loadTeacherMyStudents ===
                "function"
            ) {

                loadTeacherMyStudents();

            }

            return;
        }


        if (
            sectionId ===
            "teacherAttendanceSection"
        ) {

            if (
                typeof setTeacherAttendanceDate ===
                "function"
            ) {

                setTeacherAttendanceDate();

            }


            if (
                typeof loadTeacherAttendanceSection ===
                "function"
            ) {

                loadTeacherAttendanceSection();

            }
            else if (
                typeof loadTeacherAttendance ===
                "function"
            ) {

                loadTeacherAttendance();

            }

            return;
        }


        if (
            sectionId ===
            "teacherAssignmentsSection"
        ) {

            if (
                typeof loadTeacherAssignments ===
                "function"
            ) {

                loadTeacherAssignments();

            }

            return;
        }


        if (
            sectionId ===
            "teacherResultsSection"
        ) {

            if (
                typeof loadTeacherResults ===
                "function"
            ) {

                loadTeacherResults();

            }

            return;
        }


        if (
            sectionId ===
            "teacherNoticesSection"
        ) {

            if (
                typeof loadTeacherNotices ===
                "function"
            ) {

                loadTeacherNotices();

            }

            return;
        }


        if (
            sectionId ===
            "teacherProfileSection"
        ) {

            if (
                typeof loadTeacherProfile ===
                "function"
            ) {

                loadTeacherProfile();

            }

            return;
        }


        if (
            sectionId ===
            "teacherSettingsSection"
        ) {

            if (
                typeof loadTeacherSettings ===
                "function"
            ) {

                loadTeacherSettings();

            }

        }

    }


    // =====================================================
    // OPEN TEACHER SECTION
    // =====================================================

    function openTeacherSection(
        sectionId,
        menuElement
    ) {

        if (!sectionId) {
            return;
        }


        const selectedSection =
            document.getElementById(sectionId);


        if (!selectedSection) {

            console.error(
                "Teacher section not found:",
                sectionId
            );

            return;

        }


        // -----------------------------------------------
        // HIDE ALL
        // -----------------------------------------------

        hideTeacherSections();


        // -----------------------------------------------
        // REMOVE ACTIVE
        // -----------------------------------------------

        clearTeacherActiveMenu();


        // -----------------------------------------------
        // SHOW SELECTED
        // -----------------------------------------------

        selectedSection.style.setProperty(
            "display",
            "block",
            "important"
        );

        selectedSection.style.setProperty(
            "visibility",
            "visible",
            "important"
        );

        selectedSection.style.setProperty(
            "opacity",
            "1",
            "important"
        );

        selectedSection.style.setProperty(
            "position",
            "relative",
            "important"
        );

        selectedSection.style.setProperty(
            "width",
            "100%",
            "important"
        );

        selectedSection.style.setProperty(
            "min-height",
            "0",
            "important"
        );

        selectedSection.style.setProperty(
            "box-sizing",
            "border-box",
            "important"
        );


        // -----------------------------------------------
        // ACTIVE MENU
        // -----------------------------------------------

        if (menuElement) {

            menuElement.classList.add(
                "active"
            );

        }


        // -----------------------------------------------
        // UPDATE HEADER TITLE
        // -----------------------------------------------

        const pageTitle =
            document.getElementById(
                "teacherPageTitle"
            );


    if (pageTitle) {

    pageTitle.textContent =
        "Dashboard";

}


        // -----------------------------------------------
        // LOAD DATA
        // -----------------------------------------------

        setTimeout(function () {

            loadTeacherSectionData(
                sectionId
            );

        }, 50);


        // -----------------------------------------------
        // SCROLL MAIN CONTENT TOP
        // -----------------------------------------------

        const mainContent =
            document.getElementById(
                "teacherMainContent"
            );


        if (mainContent) {

            mainContent.scrollTop = 0;

        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    // =====================================================
    // DIRECT MENU CLICK HANDLERS
    // =====================================================

    teacherMenus.forEach(function (menuId) {

        const menu =
            document.getElementById(menuId);


        if (!menu) {
            return;
        }


        // Remove any previous direct handler
        menu.onclick = null;


        menu.onclick = function (event) {

            event.preventDefault();
            event.stopPropagation();


            const sectionId =
                menu.getAttribute(
                    "data-section"
                );


            if (!sectionId) {

                console.error(
                    "Teacher menu has no data-section:",
                    menuId
                );

                return;

            }


            openTeacherSection(
                sectionId,
                menu
            );

        };

    });


    // =====================================================
    // SET INITIAL DASHBOARD
    // =====================================================

    const dashboardMenu =
        document.getElementById(
            "teacherDashboardMenu"
        );


    const dashboardHome =
        document.getElementById(
            "teacherDashboardHome"
        );


    if (
        dashboardMenu &&
        dashboardHome
    ) {

        openTeacherSection(
            "teacherDashboardHome",
            dashboardMenu
        );

    }


    console.log(
        "EduPortal Teacher Navigation Ready ✅"
    );

});
// =========================================================
// TEACHER ASSIGNMENT FORM - EDIT / CANCEL BUTTON
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "#teacherAssignmentEditBtn"
            );

        if (!button) {
            return;
        }


        // =====================================
        // CANCEL EDIT
        // =====================================

        if (teacherEditingAssignmentId) {

            teacherEditingAssignmentId =
                null;


            const classInput =
                document.getElementById(
                    "teacherAssignmentClass"
                );

            const sectionInput =
                document.getElementById(
                    "teacherAssignmentSection"
                );

            const subjectInput =
                document.getElementById(
                    "teacherAssignmentSubject"
                );

            const marksInput =
                document.getElementById(
                    "teacherAssignmentMarks"
                );

            const descriptionInput =
                document.getElementById(
                    "teacherAssignmentDescription"
                );


            if (classInput) {
                classInput.value = "";
            }

            if (sectionInput) {
                sectionInput.value = "";
            }

            if (subjectInput) {
                subjectInput.value = "";
            }

            if (marksInput) {
                marksInput.value = "";
            }

            if (descriptionInput) {
                descriptionInput.value = "";
            }


            const createButton =
                document.getElementById(
                    "createTeacherAssignmentBtn"
                );


            if (createButton) {

                createButton.innerHTML =
                    '<i class="fas fa-plus"></i> Create Assignment';

            }


            button.innerHTML =
                '<i class="fas fa-edit"></i> Edit Assignment';


            return;
        }


        // =====================================
        // NO ASSIGNMENT SELECTED
        // =====================================

        alert(
            "Please click the Edit button on an assignment below first."
        );

    }
);
// ==========================================
// TEACHER RESULTS - SEARCH STUDENT
// ==========================================

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.id !==
            "teacherResultSearch"
        ) {
            return;
        }

        const search =
            event.target.value
                .trim()
                .toLowerCase();

        const rows =
            document.querySelectorAll(
                "#teacherResultsTableBody tr"
            );

        rows.forEach(
            function(row) {

                const studentName =
                    row
                        .textContent
                        .toLowerCase();

                row.style.display =
                    studentName.includes(search)
                        ? ""
                        : "none";

            }
        );

    }
);
// =========================================================
// TEACHER DASHBOARD
// STUDENTS DISTRIBUTION - ASSIGNED CLASS ONLY
// =========================================================

function loadTeacherDashboardClassFilter() {

    const classFilter =
        document.getElementById(
            "teacherClassFilter"
        );

    if (!classFilter) {
        return;
    }

    let teacher = {};

    try {

        teacher =
            JSON.parse(
                localStorage.getItem(
                    "loggedInTeacher"
                )
            ) || {};

    } catch (error) {

        console.error(
            "TEACHER SESSION ERROR:",
            error
        );

        classFilter.innerHTML =
            '<option value="">Class Not Found</option>';

        return;
    }


    const teacherClass =
    String(
        teacher.teacherClass ||
        teacher.teacher_class ||
        teacher.class_name ||
        teacher.class ||
        ""
    )
    .trim()
    .toLowerCase()
    .replace(
        /^class\s*/i,
        ""
    );


    if (!teacherClass) {

        classFilter.innerHTML =
            '<option value="">Class Not Assigned</option>';

        return;
    }


    classFilter.innerHTML =
        `
        <option value="${teacherClass}">
            ${teacherClass}
        </option>
        `;

    classFilter.value =
        teacherClass;

    // Teacher cannot change class
    classFilter.disabled = true;

    console.log(
        "Dashboard Class Filter:",
        teacherClass
    );
}


// =========================================================
// LOAD WHEN DASHBOARD OPENS
// =========================================================

document.addEventListener(
    "click",
    function(event) {

        const dashboardMenu =
            event.target.closest(
                "#teacherDashboardMenu"
            );

        if (!dashboardMenu) {
            return;
        }

        setTimeout(
            function() {

                loadTeacherDashboardClassFilter();

            },
            200
        );

    }
);


// =========================================================
// ALSO LOAD AFTER PAGE LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadTeacherDashboardClassFilter();

    }
);
// =========================================================
// TEACHER STUDENTS DISTRIBUTION
// REAL SUPABASE DATA + REALTIME
// =========================================================

async function loadTeacherStudentsDistribution() {

    const totalEl =
        document.getElementById(
            "teacherDistributionTotal"
        );

    const presentEl =
        document.getElementById(
            "teacherDistributionPresent"
        );

    const absentEl =
        document.getElementById(
            "teacherDistributionAbsent"
        );

    const donut =
        document.getElementById(
            "teacherStudentsDonut"
        );

    if (
        !totalEl ||
        !presentEl ||
        !absentEl
    ) {
        return;
    }

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.error(
            "Supabase connection missing."
        );
        return;
    }


    // =========================================
    // LOGGED-IN TEACHER
    // =========================================

    let teacher = {};

    try {

        teacher =
            JSON.parse(
                localStorage.getItem(
                    "loggedInTeacher"
                )
            ) || {};

    } catch (error) {

        console.error(
            "Teacher session error:",
            error
        );

        return;
    }


    // =========================================
    // TEACHER CLASS
    // =========================================

    const teacherClass =
        String(
            teacher.teacherClass ||
            teacher.teacher_class ||
            teacher.class ||
            ""
        )
        .trim()
        .toLowerCase()
        .replace(
            /^class\s+/,
            ""
        );


    if (!teacherClass) {

        totalEl.textContent = "0";
        presentEl.textContent = "0";
        absentEl.textContent = "0";

        if (donut) {
            donut.style.background =
                "#e2e8f0";
        }

        console.warn(
            "Teacher class not found."
        );

        return;
    }


    // =========================================
    // LOAD REAL STUDENTS FROM SUPABASE
    // =========================================

    const {
        data: students,
        error: studentsError
    } =
        await supabaseClient
            .from("students")
            .select(
                "id, student_class"
            );


    if (studentsError) {

        console.error(
            "Students distribution error:",
            studentsError
        );

        return;
    }


    // =========================================
    // ONLY TEACHER'S CLASS
    // =========================================

    const assignedStudents =
        (students || []).filter(
            function(student) {

                const studentClass =
                    String(
                        student.student_class ||
                        ""
                    )
                    .trim()
                    .toLowerCase()
                    .replace(
                        /^class\s+/,
                        ""
                    );

                return (
                    studentClass ===
                    teacherClass
                );

            }
        );


    const total =
        assignedStudents.length;


    // =========================================
    // TODAY DATE
    // =========================================

    const today =
        new Date();

    const todayDate =
        today.getFullYear() +
        "-" +
        String(
            today.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            today.getDate()
        ).padStart(2, "0");


    // =========================================
    // TODAY ATTENDANCE
    // =========================================

    const {
        data: attendance,
        error: attendanceError
    } =
        await supabaseClient
            .from("attendance")
            .select(
                "student_id, attendance_date, status"
            )
            .eq(
                "attendance_date",
                todayDate
            );


    if (attendanceError) {

        console.error(
            "Attendance distribution error:",
            attendanceError
        );

        return;
    }


    // =========================================
    // COUNT PRESENT / ABSENT
    // =========================================

    let present = 0;
    let absent = 0;


    assignedStudents.forEach(
        function(student) {

            const record =
                (attendance || []).find(
                    function(item) {

                        return (
                            String(
                                item.student_id
                            ) ===
                            String(
                                student.id
                            )
                        );

                    }
                );


            // No attendance record = Absent
            if (!record) {

                absent++;

                return;
            }


            const status =
                String(
                    record.status ||
                    ""
                )
                .trim()
                .toLowerCase();


            if (
                status === "present" ||
                status === "late"
            ) {

                present++;

            } else {

                absent++;

            }

        }
    );


    // =========================================
    // UPDATE COUNTS
    // =========================================

    totalEl.textContent =
        total;

    presentEl.textContent =
        present;

    absentEl.textContent =
        absent;


    // =========================================
    // UPDATE DONUT
    // =========================================

    if (donut) {

        if (total > 0) {

            const presentPercentage =
                (
                    present /
                    total
                ) * 100;

            donut.style.background =
                "conic-gradient(" +
                "#3b82f6 0% " +
                presentPercentage +
                "%, " +
                "#ef4444 " +
                presentPercentage +
                "% 100%)";

        } else {

            donut.style.background =
                "#e2e8f0";

        }

    }


    console.log(
        "STUDENTS DISTRIBUTION LIVE DATA:",
        {
            teacherClass,
            total,
            present,
            absent
        }
    );
}



// =========================================================
// REALTIME STUDENTS DISTRIBUTION
// =========================================================

let teacherDistributionRealtimeChannel =
    null;


function initializeTeacherDistributionRealtime() {

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        return;
    }


    if (
        teacherDistributionRealtimeChannel
    ) {
        return;
    }


    teacherDistributionRealtimeChannel =
        supabaseClient
            .channel(
                "teacher-students-distribution-live"
            )


            // =====================================
            // STUDENTS TABLE
            // =====================================

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "students"
                },
                async function(payload) {

                    console.log(
                        "STUDENTS REALTIME UPDATE:",
                        payload
                    );

                    await loadTeacherStudentsDistribution();

                }
            )


            // =====================================
            // ATTENDANCE TABLE
            // =====================================

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "attendance"
                },
                async function(payload) {

                    console.log(
                        "ATTENDANCE REALTIME UPDATE:",
                        payload
                    );

                    await loadTeacherStudentsDistribution();

                }
            )


            .subscribe(
                function(status) {

                    console.log(
                        "DISTRIBUTION REALTIME STATUS:",
                        status
                    );

                }
            );

}



// =========================================================
// INITIAL LOAD
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        setTimeout(
            async function() {

                await loadTeacherStudentsDistribution();

                initializeTeacherDistributionRealtime();

            },
            500
        );

// =========================================================
// AUTO REFRESH ATTENDANCE OVERVIEW + STUDENTS DISTRIBUTION
// EVERY 30 SECONDS
// =========================================================

setInterval(
    async function() {

        console.log(
            "AUTO REFRESH: Attendance Dashboard"
        );

        if (
            typeof renderTeacherAttendanceOverview ===
            "function"
        ) {
            await renderTeacherAttendanceOverview();
        }

        if (
            typeof loadTeacherStudentsDistribution ===
            "function"
        ) {
            await loadTeacherStudentsDistribution();
        }

    },
    30000
);

    }
);
// =========================================================
// STUDENT DASHBOARD - FINAL REAL ATTENDANCE HISTORY
// =========================================================

async function loadRealStudentAttendance() {

    const loggedInStudent =
        JSON.parse(
            localStorage.getItem(
                "loggedInStudent"
            )
        );

    if (!loggedInStudent) {
        return;
    }

    if (
        typeof supabaseClient ===
        "undefined"
    ) {
        console.error(
            "Supabase connection missing."
        );
        return;
    }

    try {

        // =========================================
        // FIND REAL DATABASE STUDENT
        // =========================================

        let dbStudent = null;

        // First try database ID
        if (loggedInStudent.id) {

            const result =
                await supabaseClient
                    .from("students")
                    .select(
                        "id, student_id"
                    )
                    .eq(
                        "id",
                        loggedInStudent.id
                    )
                    .maybeSingle();

            if (
                !result.error &&
                result.data
            ) {
                dbStudent =
                    result.data;
            }
        }

        // Fallback: Student ID
        if (
            !dbStudent &&
            loggedInStudent.studentId
        ) {

            const result =
                await supabaseClient
                    .from("students")
                    .select(
                        "id, student_id"
                    )
                    .eq(
                        "student_id",
                        loggedInStudent.studentId
                    )
                    .maybeSingle();

            if (
                !result.error &&
                result.data
            ) {
                dbStudent =
                    result.data;
            }
        }

        if (!dbStudent) {

            console.error(
                "Student database record not found."
            );

            return;
        }

        // =========================================
        // GET ALL REAL ATTENDANCE
        // =========================================

        const {
            data: attendanceRows,
            error
        } =
            await supabaseClient
                .from("attendance")
                .select(
                    "id, student_id, attendance_date, status, check_in_time, check_out_time"
                )
                .eq(
                    "student_id",
                    dbStudent.id
                )
                .order(
                    "attendance_date",
                    {
                        ascending: false
                    }
                );

        if (error) {

            console.error(
                "STUDENT ATTENDANCE HISTORY ERROR:",
                error
            );

            return;
        }

       const records =
    attendanceRows || [];



    
// =========================================
// ATTENDANCE MONTH DROPDOWN
// =========================================

const monthSelect =
    document.getElementById(
        "studentAttendanceMonthSelect"
    );

const today =
    new Date();

const currentMonthKey =
    today.getFullYear() +
    "-" +
    String(
        today.getMonth() + 1
    ).padStart(2, "0");


// Default current month
if (
    !window.studentAttendanceSelectedMonth
) {
    window.studentAttendanceSelectedMonth =
        currentMonthKey;
}


// =========================================
// CREATE MONTH OPTIONS
// =========================================

if (
    monthSelect &&
    monthSelect.options.length === 0
) {

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const date =
            new Date(
                today.getFullYear(),
                today.getMonth() - i,
                1
            );

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const monthValue =
            year + "-" + month;

        const option =
            document.createElement(
                "option"
            );

        option.value =
            monthValue;

        option.textContent =
            date.toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    year: "numeric"
                }
            );

        monthSelect.appendChild(
            option
        );
    }

}


// =========================================
// SET SELECTED MONTH
// =========================================

if (monthSelect) {

    monthSelect.value =
        window.studentAttendanceSelectedMonth;

}


// =========================================
// FILTER ATTENDANCE BY MONTH
// =========================================

const selectedAttendanceMonth =
    window.studentAttendanceSelectedMonth;

const overviewRecords =
    records.filter(
        function(record) {

            return String(
                record.attendance_date || ""
            ).substring(
                0,
                7
            ) === selectedAttendanceMonth;

        }
    );


// =========================================
// MONTH CHANGE
// =========================================

if (
    monthSelect &&
    monthSelect.dataset.bound !== "true"
) {

monthSelect.addEventListener(
    "change",
    function() {

        window.studentAttendanceSelectedMonth =
            this.value;

        // Reload Attendance
        loadRealStudentAttendance();

        // Reload Fee Status
        if (
            typeof loadRealStudentFeeChart ===
            "function"
        ) {

            loadRealStudentFeeChart();

        }

    }
);

    monthSelect.dataset.bound =
        "true";

}

            // =========================================================
// UPDATE ATTENDANCE OVERVIEW DONUT
// =========================================================

const presentDays =
    document.getElementById(
        "chartPresentDays"
    );

const absentDays =
    document.getElementById(
        "chartAbsentDays"
    );



const donut =
    document.getElementById(
        "studentAttendanceDonut"
    );

const donutPercentage =
    document.getElementById(
        "studentAttendancePercentage"
    );


// =========================================
// COUNT REAL ATTENDANCE
// =========================================

const totalAttendance =
    overviewRecords.length;

const presentCount =
   overviewRecords.filter(function(record) {

        return String(
            record.status || ""
        )
        .trim()
        .toLowerCase() === "present";

    }).length;

const absentCount =
    overviewRecords.filter(function(record) {

        return String(
            record.status || ""
        )
        .trim()
        .toLowerCase() === "absent";

    }).length;




// =========================================
// ATTENDANCE PERCENTAGE
// =========================================

const livePercentage =
    totalAttendance > 0
        ? Math.round(
            (
                presentCount /
                totalAttendance
            ) * 100
        )
        : 0;


// =========================================
// UPDATE TEXT
// =========================================

if (presentDays) {

    presentDays.textContent =
        presentCount +
        (
            presentCount === 1
                ? " Day"
                : " Days"
        );

}

if (absentDays) {

    absentDays.textContent =
        absentCount +
        (
            absentCount === 1
                ? " Day"
                : " Days"
        );

}


if (donutPercentage) {

    donutPercentage.textContent =
        livePercentage + "%";

}


// =========================================
// UPDATE DONUT
// =========================================

if (donut) {

    if (totalAttendance > 0) {

        const presentDegree =
            (
                presentCount /
                totalAttendance
            ) * 360;

        const absentDegree =
            (
                absentCount /
                totalAttendance
            ) * 360;

const absentStart =
    presentDegree;

const absentEnd =
    presentDegree +
    absentDegree;

        donut.style.background =
    "conic-gradient(" +

    "#16a34a 0deg " +
    presentDegree +
    "deg, " +

    "#ef4444 " +
    presentDegree +
    "deg " +
    absentEnd +
    "deg, " +

    "#e2e8f0 " +
    absentEnd +
    "deg 360deg" +

    ")";

    }
    else {

        donut.style.background =
            "#e2e8f0";

    }

}


// =========================================
// INITIALIZE REALTIME
// =========================================

if (
    typeof initializeStudentAttendanceRealtime ===
    "function"
) {

    initializeStudentAttendanceRealtime(
        dbStudent.id
    );

}

console.log(
    "STUDENT ATTENDANCE OVERVIEW LIVE:",
    {
        total: totalAttendance,
        present: presentCount,
        absent: absentCount,
        percentage: livePercentage
    }
);

        // =========================================
        // UPDATE TODAY'S BUTTON
        // =========================================

        if (
            typeof updateStudentAttendanceUI ===
            "function"
        ) {
            await updateStudentAttendanceUI();
        }

        // =========================================
        // UPDATE SUMMARY
        // =========================================

        if (
            typeof updateStudentAttendanceSummary ===
            "function"
        ) {
            await updateStudentAttendanceSummary();
        }

        // =========================================
        // SHOW DAILY HISTORY
        // =========================================

        if (
            typeof loadStudentTodayAttendanceTable ===
            "function"
        ) {

            await loadStudentTodayAttendanceTable(
                records
            );
        }

        console.log(
            "STUDENT ATTENDANCE HISTORY:",
            records
        );

    }
    catch (error) {

        console.error(
            "FINAL STUDENT ATTENDANCE ERROR:",
            error
        );

    }
}
// =========================================================
// EDUPORTAL - INITIAL LOGIN SCREEN FIX
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const isLoggedIn =
            localStorage.getItem(
                "isLoggedIn"
            );

        const role =
            localStorage.getItem(
                "loggedInRole"
            );

        // =========================================
        // NO LOGIN = SHOW LOGIN ONLY
        // =========================================

        if (
            isLoggedIn !== "true"
        ) {

            const loginContainer =
                document.querySelector(
                    ".container"
                );

            if (loginContainer) {

                loginContainer.style.setProperty(
                    "display",
                    "flex",
                    "important"
                );

                loginContainer.style.setProperty(
                    "visibility",
                    "visible",
                    "important"
                );

                loginContainer.style.setProperty(
                    "opacity",
                    "1",
                    "important"
                );
            }


            // Hide Student
            const studentDashboard =
                document.getElementById(
                    "studentDashboard"
                );

            if (studentDashboard) {

                studentDashboard.style.setProperty(
                    "display",
                    "none",
                    "important"
                );

                studentDashboard.style.setProperty(
                    "visibility",
                    "hidden",
                    "important"
                );

                studentDashboard.style.setProperty(
                    "opacity",
                    "0",
                    "important"
                );
            }


            // Hide Teacher
            const teacherDashboard =
                document.getElementById(
                    "teacherDashboard"
                );

            if (teacherDashboard) {

                teacherDashboard.style.setProperty(
                    "display",
                    "none",
                    "important"
                );
            }


            // Hide Admin
            const adminDashboard =
                document.getElementById(
                    "adminDashboard"
                );

            if (adminDashboard) {

                adminDashboard.style.setProperty(
                    "display",
                    "none",
                    "important"
                );
            }

        }

    }
);
function openAdminTeacherModalDirect() {

    const modal =
        document.getElementById(
            "adminTeacherModal"
        );

        // Move modal to BODY so dashboard containers
    // cannot hide or clip it
    if (
        modal.parentElement !==
        document.body
    ) {
        document.body.appendChild(
            modal
        );
    }

    if (!modal) {

        alert(
            "Teacher form not found."
        );

        return;
    }

    modal.style.display = "flex";
    modal.style.position = "fixed";
    modal.style.inset = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.zIndex = "99999999";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";

}


// =========================================================
// ACADEMIC SETUP - TEACHER ASSIGNMENT
// Class + Subject + Existing Teacher
// =========================================================

async function loadAcademicAssignmentOptions() {

    const classSelect = document.getElementById("academicAssignmentClass");
    const subjectSelect = document.getElementById("academicAssignmentSubject");
    const teacherSelect = document.getElementById("academicAssignmentTeacher");

    if (!classSelect || !subjectSelect || !teacherSelect) return;

    // Reset dropdowns
    classSelect.innerHTML = `<option value="">Select Class</option>`;
    subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
    teacherSelect.innerHTML = `<option value="">Select Teacher</option>`;

    // -----------------------------
    // LOAD CLASSES
    // -----------------------------
    const { data: classes, error: classError } =
        await supabaseClient
            .from("classes")
            .select("id, name")
            .order("id", { ascending: true });

    if (classError) {
        console.error("Classes Load Error:", classError);
        return;
    }

    classes.forEach(function (item) {

        const option = document.createElement("option");

        option.value = item.id;
        option.textContent = item.name;

        classSelect.appendChild(option);
    });


    // -----------------------------
    // LOAD SUBJECTS
    // -----------------------------
    const { data: subjects, error: subjectError } =
        await supabaseClient
            .from("subjects")
            .select("id, name, code")
            .order("id", { ascending: true });

    if (subjectError) {
        console.error("Subjects Load Error:", subjectError);
        return;
    }

    subjects.forEach(function (item) {

        const option = document.createElement("option");

        option.value = item.id;
        option.textContent = item.code
            ? `${item.name} (${item.code})`
            : item.name;

        subjectSelect.appendChild(option);
    });


    // -----------------------------
    // LOAD EXISTING TEACHERS
    // -----------------------------
    const { data: teachers, error: teacherError } =
        await supabaseClient
            .from("teachers")
            .select("id, name, teacher_id")
            .order("id", { ascending: true });

    if (teacherError) {
        console.error("Teachers Load Error:", teacherError);
        return;
    }

    teachers.forEach(function (teacher) {

        const option = document.createElement("option");

        option.value = teacher.id;

        option.textContent =
            teacher.teacher_id
                ? `${teacher.name} (${teacher.teacher_id})`
                : teacher.name;

        teacherSelect.appendChild(option);
    });

    console.log("Academic Assignment dropdowns loaded.");
}
// =========================================================
// LOAD ACADEMIC ASSIGNMENT DATA
// =========================================================

async function loadAcademicSetupAssignmentData() {

    await loadAcademicAssignmentOptions();
    await loadAcademicAssignments();

}
// =========================================================
// SAVE TEACHER + CLASS + SUBJECT ASSIGNMENT
// =========================================================

async function saveAcademicAssignment() {

    const classSelect =
        document.getElementById("academicAssignmentClass");

    const subjectSelect =
        document.getElementById("academicAssignmentSubject");

    const teacherSelect =
        document.getElementById("academicAssignmentTeacher");

    const classId = classSelect.value;
    const subjectId = subjectSelect.value;
    const teacherId = teacherSelect.value;

    // Validation
    if (!classId || !subjectId || !teacherId) {
        alert("Please select Class, Subject and Teacher.");
        return;
    }

    const { error } = await supabaseClient
        .from("teacher_class_subjects")
        .insert([
            {
                teacher_id: Number(teacherId),
                class_id: Number(classId),
                subject_id: Number(subjectId)
            }
        ]);

    if (error) {

        console.error("Assignment Error:", error);

        // Duplicate assignment
        if (error.code === "23505") {
            alert("This teacher is already assigned to this subject in this class.");
        } else {
            alert("Unable to assign teacher.\n\n" + error.message);
        }

        return;
    }

    alert("Teacher assigned successfully!");

    // Reset dropdowns
    classSelect.value = "";
    subjectSelect.value = "";
    teacherSelect.value = "";

    // Refresh assignment lists
    loadAcademicAssignments();
}
// =========================================================
// ASSIGN TEACHER BUTTON
// =========================================================

document.addEventListener("click", function (event) {

    if (event.target.closest("#saveAcademicAssignmentBtn")) {
        saveAcademicAssignment();
    }

});
// =========================================================
// LOAD ALL TEACHER ASSIGNMENTS
// =========================================================

async function loadAcademicAssignments() {

    const classList =
    document.getElementById("academicClassAssignmentList");

if (!classList) return;

    classList.innerHTML = `
        <div class="academic-empty-state">
            Loading class assignments...
        </div>
    `;

  


    // -----------------------------------------
    // GET ASSIGNMENTS
    // -----------------------------------------

    const { data: assignments, error } =
        await supabaseClient
            .from("teacher_class_subjects")
            .select("*")
            .order("id", { ascending: true });

    if (error) {

        console.error("Assignment Load Error:", error);

        classList.innerHTML = `
            <div class="academic-empty-state">
                Unable to load assignments.
            </div>
        `;

        teacherList.innerHTML = `
            <div class="academic-empty-state">
                Unable to load assignments.
            </div>
        `;

        return;
    }


    // -----------------------------------------
    // GET CLASSES
    // -----------------------------------------

    const { data: classes } =
        await supabaseClient
            .from("classes")
            .select("id, name")
            .order("id", { ascending: true });


    // -----------------------------------------
    // GET SUBJECTS
    // -----------------------------------------

    const { data: subjects } =
        await supabaseClient
            .from("subjects")
            .select("id, name, code")
            .order("id", { ascending: true });


    // -----------------------------------------
    // GET TEACHERS
    // -----------------------------------------

    const { data: teachers } =
        await supabaseClient
            .from("teachers")
            .select("id, name, teacher_id")
            .order("id", { ascending: true });


    // -----------------------------------------
    // CREATE LOOKUP MAPS
    // -----------------------------------------

    const classMap = {};

    (classes || []).forEach(function (item) {
        classMap[item.id] = item.name;
    });


    const subjectMap = {};

    (subjects || []).forEach(function (item) {
        subjectMap[item.id] = item.name;
    });


    const teacherMap = {};

    (teachers || []).forEach(function (item) {

        teacherMap[item.id] = {
            name: item.name,
            teacher_id: item.teacher_id
        };

    });


    // -----------------------------------------
    // NO ASSIGNMENTS
    // -----------------------------------------

    if (!assignments || assignments.length === 0) {

        classList.innerHTML = `
            <div class="academic-empty-state">
                No teacher assignments found.
            </div>
        `;

      

        return;
    }


    // =====================================================
    // GROUP BY CLASS
    // =====================================================

    const classGroups = {};

    assignments.forEach(function (assignment) {

        if (!classGroups[assignment.class_id]) {
            classGroups[assignment.class_id] = [];
        }

        classGroups[assignment.class_id].push(assignment);

    });


    let classHTML = "";

    Object.keys(classGroups).forEach(function (classId) {

        const className =
            classMap[classId] || "Unknown Class";

        classHTML += `
            <div class="academic-setup-card">
                
                <div class="academic-setup-card-header">
                    <strong>🏫 ${className}</strong>
                </div>

                <div style="margin-top:15px;">
        `;


        classGroups[classId].forEach(function (assignment) {

            const subjectName =
                subjectMap[assignment.subject_id] || "Unknown Subject";

            const teacher =
                teacherMap[assignment.teacher_id];

            const teacherName =
                teacher
                    ? teacher.name
                    : "Unknown Teacher";

            const teacherCode =
                teacher && teacher.teacher_id
                    ? ` (${teacher.teacher_id})`
                    : "";


            classHTML += `
                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:12px 0;
                    border-bottom:1px solid #eee;
                ">

                    <div>
                        <strong>📖 ${subjectName}</strong>
                        <span style="margin-left:10px;">
                            → 👨‍🏫 ${teacherName}${teacherCode}
                        </span>
                    </div>

                    <button
                        type="button"
                        onclick="deleteAcademicAssignment(${assignment.id})"
                        style="
                            border:none;
                            background:#fee2e2;
                            color:#b91c1c;
                            padding:7px 10px;
                            border-radius:7px;
                            cursor:pointer;
                        "
                    >
                        🗑️
                    </button>

                </div>
            `;

        });


        classHTML += `
                </div>
            </div>
        `;

    });


    classList.innerHTML = classHTML;


}
// =========================================================
// DELETE TEACHER ASSIGNMENT
// =========================================================

async function deleteAcademicAssignment(assignmentId) {

    const confirmDelete =
        confirm("Are you sure you want to remove this assignment?");

    if (!confirmDelete) return;


    const { error } =
        await supabaseClient
            .from("teacher_class_subjects")
            .delete()
            .eq("id", assignmentId);


    if (error) {

        console.error("Delete Assignment Error:", error);

        alert(
            "Unable to delete assignment.\n\n" +
            error.message
        );

        return;
    }


    alert("Assignment removed successfully!");

    loadAcademicAssignments();
}