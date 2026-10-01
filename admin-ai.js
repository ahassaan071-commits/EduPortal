// =========================================================
// EDU PORTAL - ADMIN AI ASSISTANT
// =========================================================

(function () {

    const FUNCTION_URL =
        "https://aylpjvqlowuvbmkqxfcx.supabase.co/functions/v1/admin-ai";

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getAdminAccount() {
        try {
            return JSON.parse(
                localStorage.getItem("adminAccount") || "null"
            );
        } catch (error) {
            return null;
        }
    }

    function appendMessage(role, html) {

        const container =
            document.getElementById("adminAiMessages");

        if (!container) return;

        const message =
            document.createElement("div");

        message.className =
            "admin-ai-message " + role;

        message.innerHTML = `
            <div class="admin-ai-avatar">
                ${role === "user" ? "🛡️" : "🤖"}
            </div>

            <div class="admin-ai-bubble">
                ${html}
            </div>
        `;

        container.appendChild(message);
        container.scrollTop = container.scrollHeight;
    }

    function formatValue(value) {

        if (value === null || value === undefined || value === "") {
            return "—";
        }

        if (typeof value === "object") {
            return escapeHtml(JSON.stringify(value));
        }

        return escapeHtml(value);
    }

    function renderRows(rows) {

        if (!Array.isArray(rows) || rows.length === 0) {
            return "<p>No matching records found.</p>";
        }

        const visibleRows = rows.slice(0, 50);
        const keys = [
            ...new Set(
                visibleRows.flatMap(
                    row => Object.keys(row || {})
                )
            )
        ].slice(0, 8);

        let html = `
            <div style="overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;font-size:13px;">
                    <thead>
                        <tr>
        `;

        keys.forEach(function (key) {
            html += `
                <th style="text-align:left;padding:9px;border-bottom:1px solid #e2e8f0;white-space:nowrap;">
                    ${escapeHtml(key.replace(/_/g, " "))}
                </th>
            `;
        });

        html += "</tr></thead><tbody>";

        visibleRows.forEach(function (row) {

            html += "<tr>";

            keys.forEach(function (key) {

                html += `
                    <td style="padding:9px;border-bottom:1px solid #f1f5f9;">
                        ${formatValue(row[key])}
                    </td>
                `;

            });

            html += "</tr>";
        });

        html += "</tbody></table></div>";

        if (rows.length > 50) {
            html += `
                <p style="margin-top:10px;color:#64748b;font-size:12px;">
                    Showing first 50 of ${rows.length} records.
                </p>
            `;
        }

        return html;
    }

    function renderResult(result) {

        if (!result) {
            return "<p>No result returned.</p>";
        }

        let html = "";

        if (result.title) {
            html += `<strong>${escapeHtml(result.title)}</strong>`;
        }

        if (result.message) {
            html += `<p>${escapeHtml(result.message)}</p>`;
        }

        if (result.summary) {

            html += `
                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:12px 0;">
            `;

            Object.entries(result.summary).forEach(function ([key, value]) {

                html += `
                    <div style="padding:10px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;">
                        <div style="font-size:11px;color:#64748b;text-transform:capitalize;">
                            ${escapeHtml(key.replace(/_/g, " "))}
                        </div>
                        <strong style="display:block;margin-top:3px;">
                            ${formatValue(value)}
                        </strong>
                    </div>
                `;

            });

            html += "</div>";
        }

        if (result.counts) {

            html += `
                <div style="display:flex;flex-wrap:wrap;gap:8px;margin:12px 0;">
            `;

            Object.entries(result.counts).forEach(function ([key, value]) {

                html += `
                    <span style="padding:7px 10px;border-radius:9px;background:#f1f5f9;font-size:12px;">
                        <strong>${escapeHtml(key)}:</strong> ${formatValue(value)}
                    </span>
                `;

            });

            html += "</div>";
        }

        if (result.student) {

            const student = result.student;

            html += `
                <div style="margin:12px 0;padding:14px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
                    <strong>${formatValue(student.name)}</strong>
                    <div style="margin-top:5px;font-size:13px;color:#475569;">
                        ${formatValue(student.student_id)}
                        • Class ${formatValue(student.student_class)}
                        • Section ${formatValue(student.section)}
                    </div>
                    <div style="margin-top:8px;font-size:13px;">
                        Status: <strong>${formatValue(student.status)}</strong>
                        &nbsp; | &nbsp;
                        Monthly Fee: <strong>Rs. ${formatValue(student.monthly_fee)}</strong>
                    </div>
                </div>
            `;
        }

        if (Array.isArray(result.rows)) {
            html += renderRows(result.rows);
        }

        if (Array.isArray(result.attendance) && result.attendance.length) {
            html += `
                <details style="margin-top:12px;">
                    <summary style="cursor:pointer;font-weight:600;">
                        Attendance history (${result.attendance.length})
                    </summary>
                    ${renderRows(result.attendance)}
                </details>
            `;
        }

        if (Array.isArray(result.fees) && result.fees.length) {
            html += `
                <details style="margin-top:12px;">
                    <summary style="cursor:pointer;font-weight:600;">
                        Fee history (${result.fees.length})
                    </summary>
                    ${renderRows(result.fees)}
                </details>
            `;
        }

        if (Array.isArray(result.results) && result.results.length) {
            html += `
                <details style="margin-top:12px;">
                    <summary style="cursor:pointer;font-weight:600;">
                        Results (${result.results.length})
                    </summary>
                    ${renderRows(result.results)}
                </details>
            `;
        }

        return html || "<p>No displayable result returned.</p>";
    }

    async function sendQuestion(question) {

        const cleanQuestion =
            String(question || "").trim();

        if (!cleanQuestion) return;

        const input =
            document.getElementById("adminAiInput");

        const sendButton =
            document.getElementById("adminAiSendBtn");

        const typing =
            document.getElementById("adminAiTyping");

        appendMessage(
            "user",
            `<p>${escapeHtml(cleanQuestion)}</p>`
        );

        if (input) input.value = "";
        if (sendButton) sendButton.disabled = true;
        if (typing) typing.style.display = "flex";

        try {

            const admin =
                getAdminAccount();

            if (
                !admin ||
                !admin.username ||
                !admin.password
            ) {
                throw new Error(
                    "Administrator session could not be verified. Please login again."
                );
            }

            const response =
                await fetch(
                    FUNCTION_URL,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "apikey":
                                window.SUPABASE_PUBLISHABLE_KEY || ""
                        },
                        body: JSON.stringify({
                            username:
                                admin.username,

                            password:
                                admin.password,

                            question:
                                cleanQuestion
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "AI Assistant request failed."
                );
            }

            appendMessage(
                "assistant",
                renderResult(
                    data.result
                )
            );

        } catch (error) {

            console.error(
                "ADMIN AI ASSISTANT:",
                error
            );

            appendMessage(
                "assistant",
                `
                    <strong>AI Assistant</strong>
                    <p>${escapeHtml(error.message)}</p>
                `
            );

        } finally {

            if (typing) {
                typing.style.display = "none";
            }

            if (sendButton) {
                sendButton.disabled = false;
            }

            if (input) {
                input.focus();
            }

        }
    }

    function initializeAdminAI() {

        const input =
            document.getElementById("adminAiInput");

        const sendButton =
            document.getElementById("adminAiSendBtn");

        if (!input || !sendButton) {
            return;
        }

        if (sendButton.dataset.ready === "true") {
            return;
        }

        sendButton.dataset.ready = "true";

        sendButton.addEventListener(
            "click",
            function () {
                sendQuestion(input.value);
            }
        );

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();
                    sendQuestion(input.value);

                }

            }
        );

        input.addEventListener(
            "input",
            function () {

                input.style.height = "auto";

                input.style.height =
                    Math.min(
                        input.scrollHeight,
                        140
                    ) + "px";

            }
        );

        document
            .querySelectorAll(
                "[data-ai-prompt]"
            )
            .forEach(
                function (button) {

                    if (
                        button.dataset.aiReady ===
                        "true"
                    ) {
                        return;
                    }

                    button.dataset.aiReady =
                        "true";

                    button.addEventListener(
                        "click",
                        function () {

                            sendQuestion(
                                button.dataset.aiPrompt
                            );

                        }
                    );

                }
            );
    }

    window.initializeAdminAI =
        initializeAdminAI;

    window.sendAdminAIQuestion =
        sendQuestion;

    document.addEventListener(
        "DOMContentLoaded",
        initializeAdminAI
    );

})();
