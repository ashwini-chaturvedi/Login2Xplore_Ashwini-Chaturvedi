# FOR COMPLETE WORKING ADD YOUR CONNECTION TOKEN IN .js FILE
---
---
#  Student Enrollment Form

A web-based student enrollment system built with **HTML**, **JavaScript**, **Bootstrap**, and **JsonPowerDB (JPDB)** as the backend database. This project is part of a micro-project submission demonstrating real-time CRUD operations using JsonPowerDB's REST API.

---

##  Table of Contents

- [Title of the Project](#title-of-the-project)
- [Description](#description)
- [Benefits of Using JsonPowerDB](#benefits-of-using-jsonpowerdb)
- [Scope of Functionalities](#scope-of-functionalities)
- [Examples of Use](#examples-of-use)
- [Project Status](#project-status)

---

## Title of the Project

**Student Enrollment Form**
> Stores and manages student enrollment records in the `STUDENT-TABLE` relation of the `SCHOOL-DB` database using JsonPowerDB.

---

## Description

The **Student Enrollment Form** is a client-side web application that allows school administrators to:

- **Register** new students by entering their Roll No, Full Name, Class, Birth Date, Address, and Enrollment Date.
- **Retrieve** existing student records instantly by entering a Roll No.
- **Update** student details without duplicating records.
- **Reset** the form to its default state at any time.

The application uses **JsonPowerDB** as its primary data store — a high-performance, REST API-based NoSQL database that requires no setup, no schema, and no SQL. All data operations (PUT, GET_BY_KEY, UPDATE) are performed through simple JSON-based HTTP POST requests.



##  Benefits of Using JsonPowerDB

JsonPowerDB (JPDB) is a Real-time, High Performance, Lightweight, and Simple-to-Use Multi-Mode DBMS. Below are the key benefits that make it ideal for this project:

| Benefit | Detail |
|---|---|
| **Schema-free** | No need to define table structure in advance. Records with any fields can be inserted directly. |
| **REST API Based** | All CRUD operations are performed via simple HTTP POST requests — no driver or ORM needed. |
| **Serverless Ready** | Can be used directly from the frontend (HTML/JS) without any server-side backend code. |
| **High Performance** | Inbuilt caching and indexing make reads and writes extremely fast compared to traditional databases. |
| **Multi-Mode Database** | Supports Document DB, Key-Value DB, RDBMS, GeoSpatial, Time Series, and more — all in one. |
| **Minimal Code** | A full Save + Retrieve + Update flow requires fewer than 50 lines of JavaScript. |
| **Free to Use** | Available for developers at no cost with a simple token-based authentication system. |
| **Real-Time Data** | Changes reflect instantly across all connected clients — ideal for live enrollment systems. |

---


##  Scope of Functionalities

### Implemented
-  Auto-focus on Roll-No field on page load
-  Roll-No acts as Primary Key — no duplicates possible
-  Real-time lookup via `GET_BY_KEY` on Search click or Enter key
-  Dynamic button enabling — only relevant buttons active per state
-  Full form validation — no empty fields allowed before Save/Update
-  Date validation — prevents impossible date entries
-  Success/error status messages with auto-reset after save/update
-  CORS-safe AJAX requests (no preflight triggered)

### Possible Future Enhancements
-  Delete student record functionality
-  Search by name (not just Roll-No)
-  Pagination / list view of all enrolled students
-  Export records to CSV/PDF
-  Photo upload for student profile

---

##  Examples of Use

### Enrolling a New Student

1. Open `index.html` in a browser
2. Enter a new Roll No e.g. `STU-2024-001` and click **Search →**
3. Badge shows **✦ New** — all fields unlock, **Save** and **Reset** enable
4. Fill in: Full Name, Class, Birth Date, Address, Enrollment Date
5. Click **Save** — record stored in `SCHOOL-DB › STUDENT-TABLE`
6. Form resets automatically after 2 seconds

### Updating an Existing Student

1. Enter an existing Roll No e.g. `STU-2024-001` and click **Search →**
2. Badge shows **✦ Found** — form fills with stored data, Roll-No locks
3. Only **Update** and **Reset** are enabled
4. Change any field (e.g. update Address or Class)
5. Click **Update** — record updated in database
6. Form resets automatically after 2 seconds

### JPDB Request Examples

**Save (PUT):**
```json
{
  "token": "<connection-token>",
  "cmd": "PUT",
  "dbName": "SCHOOL-DB",
  "rel": "STUDENT-TABLE",
  "jsonStr": {
    "Roll-No": "STU-2024-001",
    "Full-Name": "Aarav Sharma",
    "Class": "10-A",
    "Birth-Date": "2009-03-15",
    "Address": "12 MG Road, Varanasi",
    "Enrollment-Date": "2024-04-01"
  }
}
```

**Retrieve (GET_BY_KEY):**
```json
{
  "token": "<connection-token>",
  "cmd": "GET_BY_KEY",
  "dbName": "SCHOOL-DB",
  "rel": "STUDENT-TABLE",
  "jsonStr": { "Roll-No": "STU-2024-001" }
}
```

**Update (UPDATE):**
```json
{
  "token": "<connection-token>",
  "cmd": "UPDATE",
  "dbName": "SCHOOL-DB",
  "rel": "STUDENT-TABLE",
  "jsonStr": {
    "5": {
      "Roll-No": "STU-2024-001",
      "Full-Name": "Aarav Sharma",
      "Class": "10-B",
      "Birth-Date": "2009-03-15",
      "Address": "45 Lanka, Varanasi",
      "Enrollment-Date": "2024-04-01"
    }
  }
}
```

---

## Project Status

**Current Status: Complete (v1.1)**

The core enrollment functionality — Save, Retrieve, Update, Reset — is fully implemented and tested. The project meets all micro-project requirements as specified. Future enhancements (Delete, List View, Export) are scoped but not yet implemented.

---

### Tech Stack
```
Frontend  :  HTML5, CSS3, JavaScript (ES5)
Styling   :  Bootstrap 3.4.1
DOM/AJAX  :  jQuery 3.5.1
Database  :  JsonPowerDB (SCHOOL-DB)
IDE       :  NetBeans (HTML5 Client Side Project)
```

---