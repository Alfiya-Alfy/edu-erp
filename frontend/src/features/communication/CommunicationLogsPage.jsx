import React, { useEffect, useState } from "react";
import commsApi from "../../api/commsApi";

const CommunicationLogsPage = () => {
    const [logs, setLogs] = useState([]);

    const fetchData = async () => {
        try {
            const res = await commsApi.getLogs();
            setLogs(res.data);
        } catch (error) {
            console.error("Failed to fetch comms logs:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="dashboard-layout">
            <div className="main-content">
                <header className="page-header">
                    <div className="header-text">
                        <h1>Communication Logs</h1>
                        <p>Track history of SMS and Email alerts sent</p>
                    </div>
                </header>

                <div className="attendance-container">
                    <div className="table-wrapper">
                        <table className="attendance-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>Recipient</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="empty-state">No communication logs found.</td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log._id}>
                                            <td style={{ fontSize: '0.85rem' }}>{log.sent_at}</td>
                                            <td>
                                                <span className={`type-badge ${log.type.toLowerCase()}`}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td>{log.recipient}</td>
                                            <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.subject}</td>
                                            <td>
                                                <span className={`status-badge ${log.delivery_status.toLowerCase()}`}>
                                                    {log.delivery_status}
                                                </span>
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
                    <h3>Summary</h3>
                    <div className="stat-item">
                        <label>Total Sent</label>
                        <div className="value">{logs.length}</div>
                    </div>
                    <div className="stat-item">
                        <label>Latest</label>
                        <div className="value success">{logs[0]?.type || 'N/A'}</div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default CommunicationLogsPage;
