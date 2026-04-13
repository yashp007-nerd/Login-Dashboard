// Predefined Users
const users = [
    { username: 'admin', password: 'password123', role: 'admin' },
    { username: 'user', password: 'password123', role: 'user' }
];

const appContainer = document.getElementById('app');

// Component rendering functions
function renderLogin(error = '') {
    appContainer.className = 'glass-container';
    appContainer.innerHTML = `
        <h2>Secure Login</h2>
        <div class="error-msg" id="error-msg">${error}</div>
        <form id="login-form">
            <div class="input-group">
                <label>Username</label>
                <input type="text" id="username" required autocomplete="off" placeholder="admin / user">
            </div>
            <div class="input-group">
                <label>Password</label>
                <input type="password" id="password" required placeholder="password123">
            </div>
            <button type="submit" class="btn">Login</button>
        </form>
    `;

    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

function handleLogin(e) {
    e.preventDefault();
    const userIn = document.getElementById('username').value;
    const passIn = document.getElementById('password').value;

    const user = users.find(u => u.username === userIn && u.password === passIn);

    if (user) {
        // Save session
        sessionStorage.setItem('loggedInUser', JSON.stringify({ username: user.username, role: user.role }));
        renderDashboard();
    } else {
        renderLogin('Invalid username or password.');
    }
}

function renderDashboard() {
    const sessionData = sessionStorage.getItem('loggedInUser');
    if (!sessionData) {
        renderLogin();
        return;
    }

    const user = JSON.parse(sessionData);
    appContainer.className = 'glass-container dashboard';

    let dashboardContent = '';

    if (user.role === 'admin') {
        dashboardContent = `
            <div class="badge admin">Administrator</div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, ${user.username}. You have full system access.</p>
            <div class="dashboard-grid">
                <div class="card">
                    <h3>Manage Users</h3>
                    <p>Add, edit, or remove system users across the organization.</p>
                </div>
                <div class="card">
                    <h3>System Settings</h3>
                    <p>Configure global platform preferences and security controls.</p>
                </div>
                 <div class="card">
                    <h3>Server Logs</h3>
                    <p>View real-time analytic logs, network traces, and active errors.</p>
                </div>
            </div>
        `;
    } else {
         dashboardContent = `
            <div class="badge">Standard User</div>
            <h2>User Dashboard</h2>
            <p>Welcome, ${user.username}. Here is your account overview.</p>
            <div class="dashboard-grid">
                <div class="card">
                    <h3>My Profile</h3>
                    <p>Update your personal information and contact details.</p>
                </div>
                <div class="card">
                    <h3>My Tasks</h3>
                    <p>View and complete assigned activities and workflows.</p>
                </div>
            </div>
        `;
    }

    dashboardContent += `
        <button id="logout-btn" class="btn logout">Logout Session</button>
    `;

    appContainer.innerHTML = dashboardContent;
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

function handleLogout() {
    sessionStorage.removeItem('loggedInUser');
    renderLogin();
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is already logged in
    if (sessionStorage.getItem('loggedInUser')) {
        renderDashboard();
    } else {
        renderLogin();
    }
});
