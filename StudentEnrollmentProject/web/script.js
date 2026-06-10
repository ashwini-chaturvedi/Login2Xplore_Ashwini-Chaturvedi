/* ── Config ── */
    const DB_BASE_URL = "http://api.login2explore.com:5577";
    const API_IML     = "/api/iml";
    const API_IRL     = "/api/irl";
    const CONN_TOKEN  = "";
    const DB_NAME     = "SCHOOL-DB";
    const REL_NAME    = "STUDENT-TABLE";

    let currentRecNo = null;

    /* ── On Load ── */
    $(document).ready(function () {
        initForm();
        $("#rollNo").on("keydown", function (e) {
            if (e.key === "Enter") { e.preventDefault(); lookupStudent(); }
        });
    });

    /* ── Init / Reset ── */
    function initForm() {
        $("#rollNo,#fullName,#studentClass,#birthDate,#address,#enrollmentDate").val("");
        $("#rollNo").prop("disabled", false);
        setFieldsDisabled(true);
        $("#btnSave,#btnUpdate,#btnReset").prop("disabled", true);
        $("#btnSearch").prop("disabled", false);
        $("#rollNoMsg").text("").removeClass("new-id existing-id");
        clearStatus();
        currentRecNo = null;
        $("#rollNo").focus();
    }
    function resetForm() { initForm(); }
    function setFieldsDisabled(s) {
        $("#fullName,#studentClass,#birthDate,#address,#enrollmentDate").prop("disabled", s);
    }

    /* ── Lookup ── */
    function lookupStudent() {
        var rollNo = $("#rollNo").val().trim();
        if (!rollNo) {
            showStatus("Please enter a Roll No first.", "warning");
            $("#rollNo").focus();
            return;
        }
        jQuery.ajaxSetup({ async: false });
        var result = executeCommand(createGETRequest(rollNo), DB_BASE_URL, API_IRL);
        jQuery.ajaxSetup({ async: true });

        if (!result) {
            showStatus("Could not connect to the database.", "danger");
            return;
        }

        if (result.status === 400) {
            /* New record */
            currentRecNo = null;
            $("#rollNoMsg").text("✦ New").removeClass("existing-id").addClass("new-id");
            setFieldsDisabled(false);
            $("#btnSave,#btnReset").prop("disabled", false);
            $("#btnUpdate").prop("disabled", true);
            clearStatus();
            $("#fullName").focus();

        } else if (result.status === 200) {
            /* Existing record */
            var recData  = (typeof result.data === "string") ? JSON.parse(result.data) : result.data;
            currentRecNo = recData.rec_no;
            var rec      = recData.record || recData;

            $("#fullName").val(rec["Full-Name"]        || "");
            $("#studentClass").val(rec["Class"]        || "");
            $("#birthDate").val(rec["Birth-Date"]      || "");
            $("#address").val(rec["Address"]           || "");
            $("#enrollmentDate").val(rec["Enrollment-Date"] || "");

            $("#rollNoMsg").text("✦ Found").removeClass("new-id").addClass("existing-id");
            setFieldsDisabled(false);
            $("#rollNo").prop("disabled", true);
            $("#btnSearch").prop("disabled", true);
            $("#btnUpdate,#btnReset").prop("disabled", false);
            $("#btnSave").prop("disabled", true);
            clearStatus();
            $("#fullName").focus();

        } else {
            showStatus("Unexpected response: " + JSON.stringify(result), "danger");
        }
    }

    /* ── Validate ── */
    function validateForm() {
        var fields = [
            { id: "#fullName",       label: "Full Name" },
            { id: "#studentClass",   label: "Class" },
            { id: "#birthDate",      label: "Birth Date" },
            { id: "#address",        label: "Address" },
            { id: "#enrollmentDate", label: "Enrollment Date" }
        ];
        for (var i = 0; i < fields.length; i++) {
            if (!$(fields[i].id).val().trim()) {
                showStatus(fields[i].label + " cannot be empty.", "danger");
                $(fields[i].id).focus();
                return null;
            }
        }
        return {
            "Roll-No":         $("#rollNo").val().trim(),
            "Full-Name":       $("#fullName").val().trim(),
            "Class":           $("#studentClass").val().trim(),
            "Birth-Date":      $("#birthDate").val(),
            "Address":         $("#address").val().trim(),
            "Enrollment-Date": $("#enrollmentDate").val()
        };
    }

    /* ── Save ── */
    function saveStudent() {
        var data = validateForm();
        if (!data) return;
        jQuery.ajaxSetup({ async: false });
        var result = executeCommand(createPUTRequest(data), DB_BASE_URL, API_IML);
        jQuery.ajaxSetup({ async: true });
        if (result && result.status === 200) {
            showStatus("Student saved! (Roll No: " + data["Roll-No"] + ")", "success");
            setTimeout(resetForm, 1800);
        } else {
            showStatus("Save failed: " + (result ? result.message : "No response"), "danger");
        }
    }

    /* ── Update ── */
    function updateStudent() {
        var data = validateForm();
        if (!data) return;
        if (!currentRecNo) { showStatus("Record number missing.", "danger"); return; }
        jQuery.ajaxSetup({ async: false });
        var result = executeCommand(createUPDATERequest(data, currentRecNo), DB_BASE_URL, API_IML);
        jQuery.ajaxSetup({ async: true });
        if (result && result.status === 200) {
            showStatus("Student updated! (Roll No: " + data["Roll-No"] + ")", "success");
            setTimeout(resetForm, 1800);
        } else {
            showStatus("Update failed: " + (result ? result.message : "No response"), "danger");
        }
    }

    /* ── Request Builders ── */
    function createGETRequest(rollNo) {
        return JSON.stringify({
            token: CONN_TOKEN, cmd: "GET_BY_KEY",
            dbName: DB_NAME,   rel: REL_NAME,
            jsonStr: { "Roll-No": rollNo }
        });
    }
    function createPUTRequest(data) {
        return JSON.stringify({
            token: CONN_TOKEN, cmd: "PUT",
            dbName: DB_NAME,   rel: REL_NAME,
            jsonStr: data
        });
    }
    function createUPDATERequest(data, recNo) {
        var js = {};
        js[recNo] = data;
        return JSON.stringify({
            token: CONN_TOKEN, cmd: "UPDATE",
            dbName: DB_NAME,   rel: REL_NAME,
            jsonStr: js
        });
    }

    /* ── AJAX ── */
    function executeCommand(reqString, baseUrl, endpoint) {
        var jsonObj;
        $.ajax({
            url: baseUrl + endpoint, type: "POST",
            data: reqString,         async: false,
            success: function (r) { jsonObj = (typeof r === "string") ? JSON.parse(r) : r; },
            error:   function (x) { try { jsonObj = JSON.parse(x.responseText); } catch(e) { jsonObj = null; } }
        });
        return jsonObj;
    }

    /* ── Status ── */
    function showStatus(msg, type) {
        var ic = { success:"✓", danger:"✗", warning:"⚠", info:"ℹ" };
        $("#statusBar").html('<div class="alert alert-' + type + '">' + (ic[type]||"") + " " + msg + "</div>");
    }
    function clearStatus() { $("#statusBar").html(""); }