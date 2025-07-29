// src/hooks/useDashboardEffects.js
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
// Import axiosInstance or pass it as an argument
import axiosInstance from '../axios';

const useDashboardEffects = (navigate) => {
  const [flashMessage, setFlashMessage] = useState('');
  const [userInitial, setUserInitial] = useState('');
  const [username, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [activeSection, setActiveSection] = useState('queryPanel');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [nonAdmins, setNonAdmins] = useState([]);
  const [userError, setUserError] = useState('');
  const [availableDatabases, setAvailableDatabases] = useState([]);
 
  const [groups, setGroups] = useState([]);
  const [showAddContainer, setShowAddContainer] = useState(false);
  const [receivedDatabase, setReceivedDatabase] = useState("");

  const location = useLocation();
 
  const { section } = useParams();


  // Pagination function
  const paginate = (data, page, perPage) => {
    const indexOfLastItem = page * perPage;
    const indexOfFirstItem = indexOfLastItem - perPage;
    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Flash message effect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    if (message) {
      setFlashMessage(message);
      setTimeout(() => setFlashMessage(null), 3000);
    }
  }, [location]);
 
  


  // Admin-only access restriction
  useEffect(() => {
    const adminOnlySections = ['addUser', 'audit_logs', 'users', 'group-permissions', 'user-permission', 'user-management', 'group-management'];
    if (!userRole) return;
    if (adminOnlySections.includes(activeSection) && userRole !== 'admin') {
      alert("Access Denied: Admins Only!");
      setActiveSection('queryPanel');
      navigate('/queryPanel', { replace: true });
    }
    if (!['users', 'user-permission', 'user-management'].includes(activeSection)) {
      setShowUserDropdown(false);
    }
    if (!['group-management', 'group-permissions'].includes(activeSection)) {
      setShowGroupDropdown(false);
    }
    navigate(`/${activeSection}`, { replace: true });
  }, [activeSection, userRole, navigate]);

  // Verify if the user is logged in
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const initial = localStorage.getItem('userInitial') || 'U';
    const username = localStorage.getItem('username');
    setUserInitial(initial);
    setUserName(username);

    if (!userId) {
      navigate('/query-login');
    } else {
      const fetchUserRole = async () => {
        try {
          const response = await axiosInstance.get('auth/current_user', { withCredentials: true });
          const { role } = response.data;
          setUserRole(role);
        } catch (err) {
          console.error('Error fetching user role:', err);
        }
      };

      fetchUserRole();
    }
  }, [navigate]);

  // Fetch Groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axiosInstance.get('/admin/groups', { withCredentials: true });
        const groupsData = response.data.map((group) => ({
          ...group,
          users: group.users?.split(',') || [],
        }));
        setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };
    fetchGroups();
  }, [!showAddContainer]);

  // Fetch Users (admins and non-admins)
  useEffect(() => {
    if (activeSection === 'users' || activeSection === 'group-management' || activeSection === 'user-permission') {
      const fetchUsers = async () => {
        try {
          const response = await axiosInstance.get('admin/users');
          const users = response.data;
          const adminUsers = users.filter((user) => user.role === 'admin');
          const nonAdminUsers = users.filter((user) => user.role !== 'admin');
          setAdmins(adminUsers);
          setNonAdmins(nonAdminUsers);
        } catch (err) {
          console.error('Failed to fetch users:', err);
          setUserError('Unable to fetch user data.');
        }
      };
      fetchUsers();
    }
  }, [activeSection]);

  // Fetch Available Databases
  useEffect(() => {
    if (activeSection === 'queryPanel') {
      const fetchAvailableDatabases = async () => {
        try {
          const response = await axiosInstance.get('/admin/available_databases', { withCredentials: true });
          console.log(response.data)
          setAvailableDatabases(response.data);
        } catch (err) {
          console.error('Failed to fetch databases:', err);
          setAvailableDatabases([]);
        }
      };
      fetchAvailableDatabases();
    }
  }, [activeSection, username]);
  /* useEffect(() => {
    if (activeSection === 'queryPanel') {
      const fetchAvailableConnections = async () => {
        try {
          const response = await axiosInstance.get('/admin/available_connections', { withCredentials: true });
          console.log(response.data)
          setAvailableConnections(response.data);
        } catch (err) {
          console.error('Failed to fetch databases:', err);
          setAvailableConnections([]);
        }
      };
      fetchAvailableConnections();
    }
  }, [activeSection, username]); */

  // Handlers for dropdowns
  const handleUserDropdown = () => {
    setShowUserDropdown((prev) => {
      if (!prev) setShowGroupDropdown(false); 
      return !prev;
    });
  };

  const handleGroupDropdown = () => {
    setShowGroupDropdown((prev) => {
      if (!prev) setShowUserDropdown(false);
      return !prev;
    });
  };


  return {
    flashMessage,
    userInitial,
    username,
    userRole,
    activeSection,
    showUserDropdown,
    showGroupDropdown,
    admins,
    nonAdmins,
    userError,
    availableDatabases,
   
    groups,
    setGroups,
    showAddContainer,
    paginate,
    handleUserDropdown,
    handleGroupDropdown,
    setActiveSection,
    setShowAddContainer,
  };
};

export default useDashboardEffects;
