import React, { useEffect, useState } from "react";
import {
    getAttendance,
    deleteAttendance,
    createAttendance,
    updateAttendance,
    getStudents,
    getBatches,
    getInstitutions,
    getCourses,
    getStaff
} from "./attendanceApi";
import AttendanceForm from "./AttendanceForm";

const AttendancePage = () => {
    const [type, setType] = useState('students'); // 'students' or 'teachers'


    const [logs, setLogs] = useState([]); // Attendance logs from server
    const [filters, setFilters] = useState({
        institution_id: "1",
        course_id: "",
        batch_id: "",
        date: new Date().toISOString().split("T")[0]
    });

    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [metadata, setMetadata] = useState({
        students: [],
        batches: [],
        institutions: [],
        courses: [],
        staff: []
    });

    const fetchData = async () => {
        try {
            const [att, stu, bat, inst, cour, sta] = await Promise.all([
                getAttendance(type),
                getStudents(),
                getBatches(),
                getInstitutions(),
                getCourses(),
                getStaff()
            ]);
            setLogs(att.data);
            setMetadata({ students: stu, batches: bat, institutions: inst, courses: cour, staff: sta });
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [type]);

    const markStatus = async (item, status) => {
        const idField = type === 'students' ? 'student_id' : 'staff_id';
        const existingLog = logs.find(l =>
            l[idField] === item._id &&
            l.attendance_date === filters.date &&
            (type === 'teachers' || l.batch_id === filters.batch_id)
        );

        const data = {
            [idField]: item._id,
            [type === 'students' ? 'student_name' : 'staff_name']: type === 'students' ? item.student_name : item.staff_name,
            institution_id: filters.institution_id || item.institution_id,
            attendance_date: filters.date,
            status: status,
            marked_by: "1",
            remarks: existingLog ? existingLog.remarks : "Quick Mark"
        };

        if (type === 'students') {
            data.course_id = filters.course_id || item.course_id;
            data.batch_id = filters.batch_id || item.batch_id;
        }

        try {
            if (existingLog) {
                await updateAttendance(existingLog._id, data, type);
            } else {
                await createAttendance(data, type);
            }
            fetchData();
        } catch (err) {
            console.error("Failed to mark status:", err);
        }
    };

    const handleBatchMark = async (status = "Present") => {
        if (type === 'students' && !filters.batch_id) return alert("Select a batch first.");

        const listToMark = type === 'students'
            ? metadata.students.filter(s => s.batch_id === filters.batch_id)
            : metadata.staff.filter(s => !filters.institution_id || s.institution_id === filters.institution_id);

        if (window.confirm(`Mark all ${listToMark.length} ${type} as ${status}?`)) {
            const promises = listToMark.map(item => markStatus(item, status));
            await Promise.all(promises);
        }
    };

    // Calculate display list
    const displayList = (type === 'students' ? metadata.students : metadata.staff)
        .filter(item => {
            if (type === 'students') {
                return (!filters.batch_id || item.batch_id === filters.batch_id) &&
                    (!filters.institution_id || item.institution_id === filters.institution_id);
            } else {
                return (!filters.institution_id || item.institution_id === filters.institution_id);
            }
        })
        .map(item => {
            const idField = type === 'students' ? 'student_id' : 'staff_id';
            const log = logs.find(l =>
                l[idField] === item._id &&
                l.attendance_date === filters.date &&
                (type === 'teachers' || l.batch_id === item.batch_id)
            );
            return { ...item, log };
        });

    return (
        <div className="dashboard-layout">
            <div className="main-content">
                <header className="page-header">
                    <div className="header-text">
                        <div className="tab-switcher" style={{ marginBottom: '0.8rem' }}>
                            <button className={type === 'students' ? 'active' : ''} onClick={() => setType('students')}>Students</button>
                            <button className={type === 'teachers' ? 'active' : ''} onClick={() => setType('teachers')}>Staff Members</button>
                        </div>
                        <h1>{type === 'students' ? 'Student Attendance' : 'Staff Attendance'}</h1>
                        <p>Mark attendance for {filters.date}</p>
                    </div>
                    <div className="header-actions">
                        <button className="bulk-btn" onClick={() => handleBatchMark("Present")} style={{ background: 'var(--success)', color: 'white', border: 'none' }}>All Present</button>
                        <button className="bulk-btn" onClick={() => handleBatchMark("Absent")} style={{ background: 'var(--danger)', color: 'white', border: 'none' }}>All Absent</button>
                    </div>
                </header>

                <div className="filter-bar">
                    <div className="filter-group">
                        <label>Campus</label>
                        <select value={filters.institution_id} onChange={(e) => setFilters({ ...filters, institution_id: e.target.value, batch_id: "" })}>
                            <option value="">All Locations</option>
                            {metadata.institutions.map(i => <option key={i._id} value={i._id}>{i.place}</option>)}
                        </select>
                    </div>
                    {type === 'students' && (
                        <>
                            <div className="filter-group">
                                <label>Course</label>
                                <select value={filters.course_id} onChange={(e) => setFilters({ ...filters, course_id: e.target.value, batch_id: "" })}>
                                    <option value="">All Courses</option>
                                    {metadata.courses.map(c => <option key={c._id} value={c._id}>{c.course_name}</option>)}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Batch</label>
                                <select value={filters.batch_id} onChange={(e) => setFilters({ ...filters, batch_id: e.target.value })}>
                                    <option value="">Select Batch</option>
                                    {metadata.batches.filter(b => (!filters.institution_id || b.institution_id === filters.institution_id) && (!filters.course_id || b.course_id === filters.course_id)).map(b => <option key={b._id} value={b._id}>{b.batch_name}</option>)}
                                </select>
                            </div>
                        </>
                    )}
                    <div className="filter-group">
                        <label>Date</label>
                        <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
                    </div>
                </div>

                <div className="attendance-container">
                    <div className="table-wrapper">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>{type === 'students' ? 'Student Name' : 'Staff Name'}</th>
                                    <th>{type === 'students' ? 'Batch' : 'Department/Role'}</th>
                                    <th style={{ textAlign: 'center' }}>Quick Mark</th>
                                    <th style={{ textAlign: 'center' }}>Current Status</th>
                                    <th className="actions-cell">Log</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayList.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-state">No {type} found for this selection.</td>
                                    </tr>
                                ) : (
                                    displayList.map((item) => (
                                        <tr key={item._id}>
                                            <td className="student-cell">
                                                <div className="avatar">{(type === 'students' ? item.student_name : item.staff_name || "U").charAt(0)}</div>
                                                <div className="info">
                                                    <strong>{type === 'students' ? item.student_name : item.staff_name}</strong>
                                                    <span style={{ fontSize: '0.75rem', display: 'block', color: 'var(--text-muted)' }}>
                                                        {type === 'students' ? `ID: ${item.student_id}` : item.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                {type === 'students'
                                                    ? (metadata.batches.find(b => b._id === item.batch_id)?.batch_name || "-")
                                                    : (item.role || item.department || "Staff")
                                                }
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                                                    <button className={`action-dot ${item.log?.status === 'Present' ? 'active-p' : ''}`} onClick={() => markStatus(item, 'Present')}>P</button>
                                                    <button className={`action-dot ${item.log?.status === 'Absent' ? 'active-a' : ''}`} onClick={() => markStatus(item, 'Absent')}>A</button>
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                {item.log ? (
                                                    <span className={`status-badge ${item.log.status.toLowerCase()}`}>{item.log.status}</span>
                                                ) : (
                                                    <span className="status-badge" style={{ background: '#f1f5f9', color: '#94a3b8' }}>Not Marked</span>
                                                )}
                                            </td>
                                            <td className="actions-cell">
                                                <button className="edit-btn" onClick={() => { setEditData(item.log || { ...item, attendance_date: filters.date }); setOpen(true); }}>✎</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <aside className="sidebar-right">
                <div className="stats-card" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <h3>{type.charAt(0).toUpperCase() + type.slice(1)} Summary</h3>
                    <div className="stat-item">
                        <label>Total {type}</label>
                        <div className="value">{displayList.length}</div>
                    </div>
                    <div className="stat-item">
                        <label>Present Now</label>
                        <div className="value success">{displayList.filter(s => s.log?.status === 'Present').length}</div>
                    </div>
                    <div className="stat-item">
                        <label>Absent</label>
                        <div className="value danger">{displayList.filter(s => s.log?.status === 'Absent').length}</div>
                    </div>
                </div>
            </aside>

            {open && (
                <AttendanceForm
                    close={() => setOpen(false)}
                    refresh={fetchData}
                    editData={editData}
                    type={type}
                />
            )}
        </div>
    );
};

export default AttendancePage;






