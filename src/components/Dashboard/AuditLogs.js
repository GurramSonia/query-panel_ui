import React, { useState, useEffect } from 'react';
import PaginationControls from './PaginationControls.js';
import axiosInstance from '../../axios'; // Adjust path as needed

const AuditLogs = ({activeSection,paginate}) => 
{
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLogsError, setAuditLogsError] = useState('');
  const [auditLogsPage, setAuditLogsPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10)
  const currentAuditLogs = paginate(auditLogs, auditLogsPage, resultsPerPage);
  const [isLoading, setIsLoading] = useState(false);

  
 
  useEffect(() => {
    if (activeSection === 'audit_logs') {
      const fetchAuditLogs = async () => {
        try {
          setIsLoading(true);
          const response = await axiosInstance.get('admin/audit_logs', {
            withCredentials: true,
          });
          if (response.data.length > 0) {
            setAuditLogs(response.data || []);
            // Show "loaded" message for 1 millisecond
            setTimeout(() => setIsLoading(false), 2);
          } else {
            setIsLoading(false); // No data case
            setAuditLogs([]);
          }
          //setAuditLogs(response.data || []);
        
        } catch (err) {
          setAuditLogsError(err.response?.data?.error || 'An error occurred while fetching audit logs.');
        }
      };

      fetchAuditLogs();
    }
  }, [activeSection]);
  if (auditLogsError) {
    return <p className="error-message">{auditLogsError}</p>;
  }

  return (
    <div className="audit-logs-container">
      <h3 className="audit_logs-heading">Audit Logs</h3>
      {auditLogs.length > 0 ? (
        <div className="table1">
          <table className="dashboard-results-table">
            <thead>
              <tr>
                {Object.keys(auditLogs[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentAuditLogs.map((log, index) => (
                <tr key={index}>
                  {Object.values(log).map((value, i) => (
                    <td key={i} title={String(value)}>
                      {typeof value === 'string' && value.length > 20
                        ? `${value.slice(0, 20)}...`
                        : value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <PaginationControls
            currentPage={auditLogsPage}
            totalPages={Math.ceil(auditLogs.length / resultsPerPage)}
            onPageChange={setAuditLogsPage}
          />
        </div>
        ) : (
        <p></p>
      )}
    </div>
  );
};

export default AuditLogs;
