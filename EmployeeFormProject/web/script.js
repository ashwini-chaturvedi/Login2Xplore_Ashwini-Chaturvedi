
    const DB_BASE_URL   = "http://api.login2explore.com:5577";
    const API_IML       = "/api/iml";
    const API_IRL       = "/api/irl";
    const CONN_TOKEN    = "90935177|-31949239634005669|90958751";
    const DB_NAME       = "EMP-DB";
    const REL_NAME      = "EmpData";


    let currentRecNo = null; 

    $(document).ready(function () {
        initForm();
        $("#empId").on("keydown", function (e) {
            if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                lookupEmployee();
            }
        });
    });

    function initForm() {
        $("#empId, #empName, #empSalary, #empHRA, #empDA, #empDeduction").val("");

        $("#empId").prop("disabled", false);
        setFieldsDisabled(true);

        $("#btnSave, #btnChange, #btnReset").prop("disabled", true);

        $("#empIdMsg").text("").removeClass("new-id existing-id");
        clearStatus();
        currentRecNo = null;
        $("#btnLookup").prop("disabled", false);
        $("#empId").focus();
    }

    function resetForm() {
        initForm();
    }

    function setFieldsDisabled(state) {
        $("#empName, #empSalary, #empHRA, #empDA, #empDeduction").prop("disabled", state);
    }

    function lookupEmployee() {
        var id = $("#empId").val().trim();
        if (id === "") {
            showStatus("Please enter an Employee ID first.", "warning");
            $("#empId").focus();
            return;
        }

        var getReq = createGETRequest(id);
        jQuery.ajaxSetup({ async: false });
        var result = executeCommand(getReq, DB_BASE_URL, API_IRL);
        jQuery.ajaxSetup({ async: true });

        if (!result) {
            showStatus("Could not connect to the database.", "danger");
            return;
        }

        if (result.status === 400) {
            currentRecNo = null;
            $("#empIdMsg").text("✦ New ID").removeClass("existing-id").addClass("new-id");
            setFieldsDisabled(false);
            $("#btnSave, #btnReset").prop("disabled", false);
            $("#btnChange").prop("disabled", true);
            $("#empId").prop("disabled", false);
            clearStatus();
            $("#empName").focus();

        } else if (result.status === 200) {
            var recData = (typeof result.data === "string") ? JSON.parse(result.data) : result.data;
            currentRecNo = recData.rec_no;

            var rec = recData.record || recData;

            $("#empName").val(rec.name || "");
            $("#empSalary").val(rec.salary || "");
            $("#empHRA").val(rec.hra || "");
            $("#empDA").val(rec.da || "");
            $("#empDeduction").val(rec.deduction || "");

            $("#empIdMsg").text("✦ Existing record").removeClass("new-id").addClass("existing-id");
            setFieldsDisabled(false);
            $("#btnChange, #btnReset").prop("disabled", false);
            $("#btnSave").prop("disabled", true);
            $("#empId").prop("disabled", true);
            $("#btnLookup").prop("disabled", true);
            clearStatus();
            $("#empName").focus();

        } else {
            showStatus("Unexpected response: " + JSON.stringify(result), "danger");
        }
    }

    function validateForm() {
        var fields = [
            { id: "#empName",      label: "Employee Name" },
            { id: "#empSalary",    label: "Basic Salary" },
            { id: "#empHRA",       label: "HRA" },
            { id: "#empDA",        label: "DA" },
            { id: "#empDeduction", label: "Deduction" },
        ];
        for (var i = 0; i < fields.length; i++) {
            var val = $(fields[i].id).val().trim();
            if (val === "" || val === null) {
                showStatus(fields[i].label + " cannot be empty.", "danger");
                $(fields[i].id).focus();
                return null;
            }
        }
        return {
            id:        $("#empId").val().trim(),
            name:      $("#empName").val().trim(),
            salary:    parseFloat($("#empSalary").val()),
            hra:       parseFloat($("#empHRA").val()),
            da:        parseFloat($("#empDA").val()),
            deduction: parseFloat($("#empDeduction").val()),
        };
    }

    function saveEmployee() {
        var data = validateForm();
        if (!data) return;

        var putReq = createPUTRequest(data);

        jQuery.ajaxSetup({ async: false });
        var result = executeCommand(putReq, DB_BASE_URL, API_IML);
        jQuery.ajaxSetup({ async: true });

        if (result && result.status === 200) {
            showStatus("Record saved successfully! (ID: " + data.id + ")", "success");
            setTimeout(resetForm, 1500);
        } else {
            showStatus("Save failed: " + (result ? result.message : "No response"), "danger");
        }
    }

    function changeEmployee() {
        var data = validateForm();
        if (!data) return;

        if (!currentRecNo) {
            showStatus("Record number not found. Cannot update.", "danger");
            return;
        }

        var updateReq = createUPDATERequest(data, currentRecNo);

        jQuery.ajaxSetup({ async: false });
        var result = executeCommand(updateReq, DB_BASE_URL, API_IML);
        jQuery.ajaxSetup({ async: true });

        if (result && result.status === 200) {
            showStatus("Record updated successfully! (ID: " + data.id + ")", "success");
            setTimeout(resetForm, 1500);
        } else {
            showStatus("Update failed: " + (result ? result.message : "No response"), "danger");
        }
    }

    function createGETRequest(id) {
        return JSON.stringify({
            token:   CONN_TOKEN,
            cmd:     "GET_BY_KEY",
            dbName:  DB_NAME,
            rel:     REL_NAME,
            jsonStr: { id: id }
        });
    }

    function createPUTRequest(data) {
        return JSON.stringify({
            token:  CONN_TOKEN,
            cmd:    "PUT",
            dbName: DB_NAME,
            rel:    REL_NAME,
            jsonStr: data
        });
    }

    function createUPDATERequest(data, recNo) {

        var jsonStr = {};
        jsonStr[recNo] = data;
        return JSON.stringify({
            token:  CONN_TOKEN,
            cmd:    "UPDATE",
            dbName: DB_NAME,
            rel:    REL_NAME,
            jsonStr: jsonStr
        });
    }


    function executeCommand(reqString, baseUrl, endpoint) {
        var url = baseUrl + endpoint;
        var jsonObj;

        $.ajax({
            url: url,
            type: "POST",
            data: reqString,
            async: false,
            success: function (result) {
                jsonObj = (typeof result === "string") ? JSON.parse(result) : result;
            },
            error: function (xhr) {
                try { jsonObj = JSON.parse(xhr.responseText); }
                catch(e) { jsonObj = null; }
            }
        });
        return jsonObj;
    }


    function showStatus(msg, type) {
        var icons = { success: "✓", danger: "✗", warning: "⚠", info: "ℹ" };
        var icon = icons[type] || "";
        $("#statusBar").html(
            '<div class="alert alert-' + type + '">' + icon + ' ' + msg + '</div>'
        );
    }

    function clearStatus() {
        $("#statusBar").html("");
    }