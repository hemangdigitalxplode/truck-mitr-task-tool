import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { NavLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import DataTable from 'react-data-table-component';

const Tasks = () => {
  const { employee } = useUser();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    client: '',
    status: '',
    from: '',
    to: ''
  });

  useEffect(() => {
    const fetchTasks = async () => {
      if (!employee?.emp_id) return;

      try {
        const res = await axiosInstance.get(`/employee-tasks/${employee.emp_id}`);
        console.log(res.data.tasks)
        const sorted = res.data.tasks.sort((a, b) => new Date(b.assigned_date) - new Date(a.assigned_date));
        setTasks(sorted);
        setFilteredTasks(sorted);

        // Extract unique clients and statuses
        const uniqueClients = [...new Set(sorted.map(task => task.client?.name).filter(Boolean))];
        setClients(uniqueClients);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false); // stop loader
      }
    };

    fetchTasks();
  }, [employee]);

  const formatTime = (totalSeconds) => {
    if (!totalSeconds || isNaN(totalSeconds)) return '00:00:00';
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handleFilter = () => {
    const { client, status, from, to } = filters;

    const filtered = tasks.filter(task => {
      const matchClient = client ? task.client?.name === client : true;
      const matchStatus = status ? task.status === status : true;
      const matchFrom = from ? new Date(task.assigned_date) >= new Date(from) : true;
      const matchTo = to ? new Date(task.assigned_date) <= new Date(to) : true;
      return matchClient && matchStatus && matchFrom && matchTo;
    });

    setFilteredTasks(filtered);
  };

  const resetFilter = () => {
    setFilters({ client: '', status: '', from: '', to: '' });
    setFilteredTasks(tasks);
  };

  const liveFilteredTasks = filteredTasks.filter(task =>
    task.task_id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.client?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { name: 'Task ID', selector: row => row.task_id, sortable: true },
    { name: 'Task Title', selector: row => row.subject, sortable: true },
    { name: 'Client Name', selector: row => row.client?.name || 'N/A' },
    { name: 'Assigned By', selector: row => row.assigned_by || 'N/A' },
    {
      name: 'Status',
      selector: row => row.status,
      cell: row => {
        let badgeColor = 'secondary';

        if (row.status === 'Completed') badgeColor = 'success';
        else if (row.status === 'Working') badgeColor = 'warning';
        else if (row.status === 'Pending') badgeColor = 'danger';

        return (
          <span className={`badge text-white bg-${badgeColor}`}>
            {row.status}
          </span>
        );
      }
    },
    {
      name: 'Priority',
      selector: row => row.priority,
      cell: row => {
        const priority = row.priority.toLowerCase();

        let badgeClass = 'bg-secondary';
        if (priority === 'critical' || priority === 'high') {
          badgeClass = 'bg-danger';
        } else if (priority === 'moderate' || priority === 'medium') {
          badgeClass = 'bg-warning text-dark';
        } else if (priority === 'to-do' || priority === 'low') {
          badgeClass = 'bg-primary';
        }

        return (
          <span className={`badge ${badgeClass}`}>
            {row.priority}
          </span>
        );
      }
    },

    {
      name: 'Assigned Date',
      selector: row => new Date(row.assigned_date).toLocaleDateString('en-GB').replaceAll('/', '-'),
      sortable: true
    },
    {
      name: 'Deadline',
      selector: row => new Date(row.due_date).toLocaleDateString('en-GB').replaceAll('/', '-'),
      sortable: true
    },
    {
      name: 'Total Time',
      selector: row => formatTime(row.total_time_spent),
      sortable: true
    },
    {
      name: 'Actions',
      cell: row => (
        <NavLink to={`/dashboard/task/${row.id}`} state={{ task: row }}>
          <button className='btn btn-sm bg-warning'>
            <i className="bi bi-pencil"></i>
          </button>
        </NavLink>
      )
    }
  ];

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1" style={{ minHeight: '100vh', background: '#f9f9f9' }}>
        <Header />
        <div className="p-4">
          <button
            className="btn btn-outline-dark rounded-circle mb-3"
            style={{ width: '40px', height: '40px' }}
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left"></i>
          </button>
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            {/* Left: Heading */}
            <h4 className="mb-0">My Tasks</h4>

            {/* Right: Filter + Search */}
            <div className="d-flex align-items-center gap-2 ms-auto">
              {/* Filter Button with Icon */}
              {/* <a style={{ textDecoration: 'none' }} className='' href="/dashboard/add-task">
                <button
                  className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                  data-bs-toggle="modal"
                  data-bs-target="#filterModal"
                >
                  <i className="bi bi-clipboard-plus"></i> Create 
                </button>
              </a> */}
              <button
                className="btn btn-primary btn-sm d-flex align-items-center gap-1"
                data-bs-toggle="modal"
                data-bs-target="#filterModal"
              >
                <i className="bi bi-filter"></i> Filter
              </button>

              {/* Search Input */}
              <div className="input-group" style={{ maxWidth: '280px' }}>
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by ID, Subject, Client..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="table-responsive">
            {loading ? (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className={`fade-in-table ${!loading ? 'show' : ''}`}>
                <DataTable
                  columns={columns}
                  data={liveFilteredTasks}
                  pagination
                  paginationPerPage={30}
                  striped
                  highlightOnHover
                  persistTableHead
                  conditionalRowStyles={[
                    {
                      when: row => row.status === 'Completed',
                      style: {
                        backgroundColor: '#d4edda',
                        border: '1px solid #c3e6cb',
                      },
                    },
                    {
                      when: row => row.status === 'Working',
                      style: {
                        backgroundColor: '#fff3cd',
                        border: '1px solid #ffeeba',
                      },
                    },
                    {
                      when: row => row.status === 'Pending',
                      style: {
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                      },
                    },
                    {
                      when: row => row.status === 'To-do',
                      style: {
                        backgroundColor: 'rgb(193, 221, 238)',
                        border: '1px solid rgb(193, 221, 238)',
                      },
                    },
                  ]}
                  customStyles={{
                    rows: {
                      style: {
                        border: '1px solid #dee2e6',
                        backgroundColor: '#fff',
                        padding: '6px 6px',
                        fontSize: '0.99rem',
                      },
                    },
                    headRow: {
                      style: {
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                      },
                    },
                    headCells: {
                      style: {
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        padding: '12px',
                        borderRight: '1px solid #dee2e6',
                        backgroundColor: '#f1f1f1',
                      },
                    },
                    cells: {
                      style: {
                        padding: '4px',
                        borderRight: '1px solid #dee2e6',
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ✅ Filter Modal */}
      <div className="modal fade" id="filterModal" tabIndex="-1" aria-labelledby="filterModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="filterModalLabel">Filter Tasks</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Client</label>
                <select
                  className="form-select"
                  value={filters.client}
                  onChange={e => setFilters({ ...filters, client: e.target.value })}
                >
                  <option value="">All</option>
                  {clients.map((client, idx) => (
                    <option key={idx} value={client}>{client}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={filters.status}
                  onChange={e => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="To-do">To-do</option>
                  <option value="Working">Working</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">From Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.from}
                  onChange={e => setFilters({ ...filters, from: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">To Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={filters.to}
                  onChange={e => setFilters({ ...filters, to: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={resetFilter}>Reset</button>
              <button className="btn btn-primary btn-sm" onClick={handleFilter} data-bs-dismiss="modal">Apply Filter</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
