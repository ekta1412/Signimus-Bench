// public/injectSidebar.js
document.addEventListener('DOMContentLoaded', function() {
  fetch('/sidebar.html')
    .then(response => response.text())
    .then(html => {
      const body = document.body;
      if (body) {
        // Create a div to hold the sidebar content
        const sidebarContainer = document.createElement('div');
        sidebarContainer.innerHTML = html;
        // Prepend the sidebar to the body
        body.prepend(sidebarContainer.firstChild); // Assuming sidebar.html has a single root element

        // Add flex classes to body
        body.classList.add('flex');
      }
    })
    .catch(error => console.error('Error injecting sidebar:', error));
});