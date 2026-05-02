// Function to load and inject the sidebar component
function loadSidebar() {
  // Check if sidebar already exists
  if (document.getElementById('sidebar')) {
    return;
  }
  
  // Create a container for the sidebar
  const sidebarContainer = document.createElement('div');
  sidebarContainer.id = 'sidebar-container';
  document.body.insertBefore(sidebarContainer, document.body.firstChild);
  
  // Define the sidebar HTML
  const sidebarHTML = `
    <!-- Google Cloud Console Style Sidebar -->
    <div id="sidebar" class="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out translate-x-0 shadow-xl">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L12 19.25L14.25 17L12 14.75L9.75 17Z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2L18.75 5.5V18.5L12 22L5.25 18.5V5.5L12 2Z" />
          </svg>
          <span class="text-xl font-bold text-gray-800">Signimus</span>
        </div>
        <button id="sidebar-close" class="text-gray-500 hover:text-gray-700 md:hidden">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <nav class="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
        <div class="mb-6">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Main</h3>
          <ul class="space-y-1">
            <li>
              <a href="/bench" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fas fa-th-large mr-3 text-gray-500"></i>
                <span>Talent Bench</span>
              </a>
            </li>
            <li>
              <a href="/homepage" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fas fa-home mr-3 text-gray-500"></i>
                <span>Home</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="mb-6">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tools</h3>
          <ul class="space-y-1">
            <li>
              <a href="/homepage#salary-calculator" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fas fa-calculator mr-3 text-gray-500"></i>
                <span>Salary Calculator</span>
              </a>
            </li>
            <li>
              <a href="/homepage#react-guide" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fas fa-book mr-3 text-gray-500"></i>
                <span>React Guide</span>
              </a>
            </li>
            <li>
              <a href="/homepage#python-guide" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fas fa-book mr-3 text-gray-500"></i>
                <span>Python Guide</span>
              </a>
            </li>
            <li>
              <a href="/homepage#wordpress-guide" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fas fa-book mr-3 text-gray-500"></i>
                <span>WordPress Guide</span>
              </a>
            </li>
            <li>
              <a href="/homepage#kotlin-vs-java-guide" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fas fa-book mr-3 text-gray-500"></i>
                <span>Kotlin vs Java</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="mb-6">
          <h3 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Resources</h3>
          <ul class="space-y-1">
            <li>
              <a href="#" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fas fa-question-circle mr-3 text-gray-500"></i>
                <span>Help Center</span>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fas fa-comments mr-3 text-gray-500"></i>
                <span>Community</span>
              </a>
            </li>
            <li>
              <a href="#" class="flex items-center p-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                <i class="fas fa-newspaper mr-3 text-gray-500"></i>
                <span>Blog</span>
              </a>
            </li>
          </ul>
        </div>
        
        <div class="absolute bottom-4 left-4 right-4">
          <div class="bg-indigo-50 rounded-lg p-3">
            <div class="flex items-center">
              <div class="bg-indigo-100 p-2 rounded-lg mr-3">
                <i class="fas fa-lightbulb text-indigo-600"></i>
              </div>
              <div>
                <p class="text-xs font-semibold text-indigo-800">New Feature</p>
                <p class="text-xs text-indigo-600">Check out our latest tools</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- Sidebar Backdrop for Mobile -->
    <div id="sidebar-backdrop" class="fixed inset-0 z-20 bg-black bg-opacity-50 hidden md:hidden"></div>

    <!-- Sidebar Toggle Button (Visible on Mobile) -->
    <button id="sidebar-toggle" class="fixed top-4 left-4 z-40 p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-gray-900 md:hidden">
      <i class="fas fa-bars"></i>
    </button>
  `;
  
  // Inject the sidebar HTML into the container
  sidebarContainer.innerHTML = sidebarHTML;
  
  // Add CSS for the main content to accommodate the sidebar
  const style = document.createElement('style');
  style.textContent = `
    .main-content {
      margin-left: 0;
    }
    
    @media (min-width: 768px) {
      .main-content {
        margin-left: 16rem;
      }
    }
    
    #sidebar-toggle {
      margin-left: 1rem;
    }
  `;
  document.head.appendChild(style);
  
  // Add event listeners for sidebar functionality
  document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebarClose = document.getElementById('sidebar-close');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    
    function toggleSidebar() {
      if (sidebar) {
        sidebar.classList.toggle('translate-x-0');
        sidebar.classList.toggle('-translate-x-full');
      }
      if (sidebarBackdrop) {
        sidebarBackdrop.classList.toggle('hidden');
      }
    }
    
    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarClose) {
      sidebarClose.addEventListener('click', toggleSidebar);
    }
    
    if (sidebarBackdrop) {
      sidebarBackdrop.addEventListener('click', toggleSidebar);
    }
    
    // Close sidebar when clicking on a link (mobile)
    if (sidebar) {
      const sidebarLinks = sidebar.querySelectorAll('a');
      sidebarLinks.forEach(link => {
        // Only close sidebar on mobile devices
        if (window.innerWidth < 768) {
          link.addEventListener('click', toggleSidebar);
        }
      });
    }
  });
}

// Load the sidebar when the script is executed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSidebar);
} else {
  loadSidebar();
}