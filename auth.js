// auth.js - Sistema de control de acceso mejorado
const currentDate = new Date().toLocaleString('es-CL'); // o ajusta el formato
currentUser.lastLogin = currentDate;
localStorage.setItem('currentUser', JSON.stringify(currentUser));

// Verificar si hay un usuario autenticado
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Si no hay usuario autenticado, redirigir al login
    if (!currentUser) {
        redirectToLogin();
        return null;
    }
    
    return currentUser;
}

// Redirigir al login
function redirectToLogin() {
    window.location.href = 'login.html';
}

// Verificar permisos específicos para la página actual
function checkPagePermission() {
    const currentUser = checkAuth();
    if (!currentUser) return;
    
    // Obtener el nombre de la página actual (sin la extensión .html)
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    // Si es la página principal, permitir a todos los usuarios autenticados
    if (currentPage === 'index' || currentPage === '') {
        updateUIBasedOnRole(currentUser);
        return;
    }
    
    // Director tiene acceso completo
    if (currentUser.role === 'director') {
        updateUIBasedOnRole(currentUser);
        return;
    }
    
    // Administrador tiene acceso completo también
    if (currentUser.role === 'admin') {
        updateUIBasedOnRole(currentUser);
        return;
    }
    
    // Supervisor tiene acceso limitado según sus permisos específicos
    if (currentUser.role === 'Combustible' && currentUser.permissions && 
        (currentUser.permissions.includes(currentPage) || 
         (currentPage === 'dashboard-abastecimiento' && currentUser.permissions.includes('combustible')))) {
        updateUIBasedOnRole(currentUser);
        return;
    }
    
    // Usuario regular tiene acceso limitado según sus permisos específicos
    if (currentUser.role === 'user' && currentUser.permissions && 
        (currentUser.permissions.includes(currentPage) || 
         (currentPage === 'formulario-1' && currentUser.permissions.includes('pac')))) {
        updateUIBasedOnRole(currentUser);
        return;
    }
    
    // Si llega aquí, el usuario no tiene permiso para esta página
    window.location.href = 'acceso-denegado.html';
}

// Actualizar la interfaz según el rol del usuario
function updateUIBasedOnRole(user) {
    // Mostrar nombre de usuario e información de sesión
    const userInfoElement = document.createElement('div');
    userInfoElement.className = 'user-info';
    userInfoElement.innerHTML = `
        <div class="welcome-container">
    <div class="welcome-user">
        <div class="user-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" class="user-icon">
                <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="40" cy="32" r="10" fill="currentColor"/>
                <path d="M28,52 C28,42 52,42 52,52" fill="currentColor"/>
            </svg>
        </div>
        <div class="user-info">
            <p class="welcome-text">Bienvenido,</p>
            <h2 class="user-name">${user.fullName}</h2>
            <p class="user-role">Panel de Control DIMAO</p>
        </div>
        <div class="welcome-actions">
            <div class="action-buttons">
                <span class="user-role">${getRoleDisplayName(user.role)}</span>
                <button onclick="logout()" class="logout-btn">Cerrar sesión</button>
            </div>
        </div>
    </div>
</div>
   <!-- Estilos CSS para el encabezado de bienvenida -->
<style>
.welcome-header {
    background-color: rgba(255, 255, 255, 0.5); /* Fondo blanco translúcido */
    border-bottom: 1px solid #e9ecef;
    padding: 12px 20px;
    backdrop-filter: blur(5px); /* Difumina el fondo (efecto cristal) */
}

.welcome-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
}

.welcome-user {
    display: flex;
    align-items: center;
    gap: 15px;
}

.user-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 22px;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.welcome-text {
    margin: 0;
    color: #6c757d;
    font-size: 14px;
}

.user-name {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #212529;
}

.user-role {
    margin: 0;
    color: #495057;
    font-size: 13px;
}




.action-buttons {
    display: flex;
    gap: 10px;
}

.profile-button, .logout-button {
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.profile-button {
    background-color: transparent;
    border: 1px solid #ced4da;
    color: #495057;
}

.logout-button {
    background-color: #dc3545;
    border: 1px solid #dc3545;
    color: white;
}

.profile-button:hover {
    background-color: #f8f9fa;
    border-color: #adb5bd;
}

.logout-button:hover {
    background-color: #c82333;
    border-color: #bd2130;
}

/* Responsive para móviles */
@media (max-width: 768px) {
    .welcome-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
    
    .welcome-actions {
        align-items: flex-start;
        width: 100%;
    }
    
    .action-buttons {
        width: 100%;
    }
    
    .profile-button, .logout-button {
        flex: 1;
        text-align: center;
    }
}
    .welcome-container {
    display: flex;
    width: 100%;
}

.welcome-user {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between; /* Distribuye el espacio entre los elementos */
}

.user-avatar {
    margin-right: 15px;
}

.user-icon {
    width: 36px;
    height: 36px;
    color:rgb(0, 0, 0);
    display: block;
}

.user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1; /* Permite que este elemento crezca y ocupe el espacio disponible */
}

.welcome-actions {
    display: flex;
    align-items: center;
}

.action-buttons {
    display: flex;
    align-items: center;
    gap: 15px; /* Espacio entre el rol y el botón de cerrar sesión */
}

.logout-btn {
    padding: 8px 16px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.logout-btn:hover {
    background-color: #e0e0e0;
}
</style> 
    
    
    
        `
    ;
    
    // Buscar donde insertar esta información (puede ser el header)
    const header = document.querySelector('header');
    if (header) {
        // Verificar si ya existe un userInfo y eliminarlo para no duplicar
        const existingUserInfo = header.querySelector('.user-info');
        if (existingUserInfo) {
            existingUserInfo.remove();
        }
        header.appendChild(userInfoElement);
    }
    
    // Ajustar la visibilidad de los elementos del menú según los permisos
    updateMenuVisibility(user);
}

// Función para mostrar un nombre más amigable del rol
function getRoleDisplayName(role) {
    switch(role) {
        case 'director': return 'Director';
        case 'admin': return 'Administrador';
        case 'Combustible': return 'Combustible';
        case 'user': return 'Usuario';
        default: return role;
    }
}

// Actualizar la visibilidad de los elementos del menú según los permisos
function updateMenuVisibility(user) {
    const menuItems = document.querySelectorAll('.main-menu li a');
    
    // Para director y admin, mostrar todo
    if (user.role === 'director' || user.role === 'admin') {
        menuItems.forEach(item => {
            item.parentElement.style.display = '';
        });
        return;
    }
    
    // Para otros roles, mostrar solo lo permitido
    menuItems.forEach(item => {
        const href = item.getAttribute('href').replace('.html', '');
        const shouldShow = determineMenuVisibility(href, user);
        
        item.parentElement.style.display = shouldShow ? '' : 'none';
    });
}

// Determinar si un elemento de menú debe ser visible para un usuario
function determineMenuVisibility(pageId, user) {
    // La página principal siempre es visible
    if (pageId === 'index') return true;
    
    // Supervisor puede ver el dashboard de combustible
    if (user.role === 'Combustible' && pageId === 'dashboard-abastecimiento') {
        return user.permissions && user.permissions.includes('combustible');
    }
    
    // Usuario regular puede ver el formulario PAC
    if (user.role === 'user' && pageId === 'formulario-1') {
        return user.permissions && user.permissions.includes('pac');
    }
    
    // Verificar permisos explícitos
    return user.permissions && user.permissions.includes(pageId);
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Ejecutar verificación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    checkPagePermission();
});