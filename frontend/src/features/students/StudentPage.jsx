import React, { useEffect, useState } from "react";
import { createApi } from "../../api/genericApi";
import StudentForm from "./StudentForm";

const studentApi = createApi("students");

const StudentPage = () => {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const fetchData = async () => {
        try {
            const res = await studentApi.getAll();
            setData(Array.isArray(res) ? res : []);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete student?")) {
            await studentApi.remove(id);
            fetchData();
        }
    };

    // Stats calculation
    const total = data.length;
    const courses = [...new Set(data.map(i => i.course))].length;
    const batches = [...new Set(data.map(i => i.batch))].length;

    return (
        <div className="dashboard-layout">
            <div className="main-content">
                <header className="page-header">
                    <div className="header-text">
                        <h1>Students List</h1>
                        <p>Manage all registered students</p>
                    </div>
                    <button className="add-btn" onClick={() => { setEditData(null); setOpen(true); }}>
                        + Add Student
                    </button>
                </header>

                <div className="attendance-container">
                    <div className="table-wrapper">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>ID</th>
                                    <th>Course</th>
                                    <th>Batch</th>
                                    <th>Email</th>
                                    <th className="actions-cell">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr><td colSpan="6" className="empty-state">No students found.</td></tr>
                                ) : (
                                    data.map((item) => (
                                        <tr key={item._id}>
                                            <td className="student-cell">
                                                <div className="avatar">{item.name.charAt(0)}</div>
                                                <span>{item.name}</span>
                                            </td>
                                            <td>{item.student_id}</td>
                                            <td>{item.course}</td>
                                            <td>{item.batch}</td>
                                            <td>{item.email}</td>
                                            <td className="actions-cell">
                                                <button className="edit-btn" onClick={() => { setEditData(item); setOpen(true); }}>✎</button>
                                                <button className="delete-btn" onClick={() => handleDelete(item._id)}>✖</button>
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
                <div className="stats-card">
                    <h3>Student Stats</h3>
                    <div className="stat-item">
                        <label>Total Enrolled</label>
                        <div className="value">{total}</div>
                    </div>
                    <div className="stat-item">
                        <label>Unique Courses</label>
                        <div className="value success">{courses}</div>
                    </div>
                    <div className="stat-item">
                        <label>Active Batches</label>
                        <div className="value warning">{batches}</div>
                    </div>
                    
                    <div className="stat-chart">
                        <div className="circular-progress" style={{ '--percent': '100%' }}>
                            <div className="inner-circle">
                                <span className="rate-value">{total}</span>
                                <span className="rate-label">Total Profile</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {open && (
                <StudentForm
                    close={() => setOpen(false)}
                    refresh={fetchData}
                    editData={editData}
                />
            )}
        </div>
    );
};



export default StudentPage;
