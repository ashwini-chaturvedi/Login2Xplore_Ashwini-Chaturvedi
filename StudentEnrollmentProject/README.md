# Student Enrollment Project

A NetBeans HTML5/JS Micro Project using JsonPowerDB (JPDB).

## Database
| Field           | Detail                  |
|-----------------|-------------------------|
| Database        | SCHOOL-DB               |
| Relation        | STUDENT-TABLE           |
| Primary Key     | Roll-No                 |
| Input Fields    | Full-Name, Class, Birth-Date, Address, Enrollment-Date |

## How to Open in NetBeans
1. **File → Open Project** → select `StudentEnrollmentProject` folder
2. NetBeans detects it as an HTML5 Client-Side project
3. Right-click `web/index.html` → **Run File**

## Form Behaviour
| Scenario        | Enabled Buttons      | Fields         |
|-----------------|----------------------|----------------|
| Page load       | None                 | Roll-No only   |
| New Roll-No     | Save, Reset          | All fields     |
| Existing Roll-No| Update, Reset        | All except Roll-No |

## Token
Replace `CONN_TOKEN` in `web/index.html` with your own JsonPowerDB connection token from:
http://api.login2explore.com:5577/user/index.html
