<?php
// sidebar.php - This file contains the reusable sidebar component for the eBook Management System.
// It includes its own HTML, CSS, and JavaScript for responsiveness and open/close functionality.
// This file can be included in any HTML/PHP page using: <?php include 'sidebar.php'; ? >
?>
<style>
    /* Sidebar specific styles */
    .sidebar {
      height: 100%;
      width: 0; /* Initially closed on small screens */
      position: fixed;
      z-index: 1001; /* Higher than other modals if any */
      top: 0;
      left: -250px; /* Hidden off-screen initially */
      background-color: rgba(255, 255, 255, 0.9); /* Opaque white for sidebar */
      overflow-x: hidden;
      transition: 0.5s ease-in-out;
      padding-top: 80px; /* More space from top */
      box-shadow: 5px 0 15px rgba(0,0,0,0.1); /* Soft shadow */
      color: var(--surface-text-dark);
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(0,0,0,0.05); /* Very subtle border */
    }

    .sidebar a {
      padding: 18px 30px; /* Larger padding for links */
      text-decoration: none;
      font-size: 1.15em;
      color: var(--surface-text-dark);
      display: block;
      transition: 0.3s ease-in-out;
      border-bottom: 1px solid rgba(0,0,0,0.03); /* Very faint separator */
    }

    .sidebar a:last-child {
      border-bottom: none;
    }

    .sidebar a:hover {
      background-color: rgba(0,0,0,0.05); /* Subtle hover background */
      color: var(--accent-blue); /* Accent color on hover */
    }

    .sidebar .closebtn {
      position: absolute;
      top: 20px; /* Adjusted position */
      right: 25px;
      font-size: 45px;
      color: var(--surface-text-light); /* Muted close button */
      border-bottom: none;
      transition: 0.3s;
    }

    .sidebar .closebtn:hover {
      background-color: transparent;
      color: var(--accent-rejected); /* Accent red on hover */
      transform: none; /* No spin */
    }

    .sidebar-header {
      padding: 30px 25px 20px;
      text-align: center;
      color: var(--surface-text-dark);
      font-size: 1.8em;
      font-weight: 700;
      border-bottom: 1px solid rgba(0,0,0,0.1);
      margin-bottom: 15px;
      font-family: 'Poppins', sans-serif;
    }

    /* Open button for small screens */
    .openbtn-container {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
      display: none; /* Hidden by default, shown on small screens by JS */
    }

    .openbtn {
      font-size: 22px;
      cursor: pointer;
      background-color: var(--glass-bg-color); /* Glassy button */
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border-color);
      color: var(--surface-text-dark);
      padding: 12px 18px;
      border-radius: 10px;
      box-shadow: var(--glass-shadow);
      transition: 0.3s ease-in-out;
      font-family: 'Poppins', sans-serif;
    }

    .openbtn:hover {
      background-color: rgba(255, 255, 255, 0.8); /* More opaque on hover */
      box-shadow: 0 6px 20px rgba(0,0,0,0.15);
    }

    /* Responsive adjustments for sidebar */
    @media (min-width: 769px) {
      .sidebar {
        width: var(--sidebar-width); /* Always open on large screens */
        left: 0;
        position: fixed;
      }
      /* Adjust main content margin to make space for sidebar */
      #mainContent {
        margin-left: var(--sidebar-width);
      }
      .openbtn-container {
        display: none !important; /* Hide open button on large screens */
      }
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 0; /* Initially closed */
        left: -250px; /* Hidden off-screen */
        box-shadow: 5px 0 15px rgba(0,0,0,0.3); /* More pronounced shadow when open */
      }
      /* Reset main content margin on small screens */
      #mainContent {
        margin-left: 0;
      }
      .openbtn-container {
        display: block; /* Show open button on small screens */
      }
    }
</style>

<!-- Sidebar Component HTML -->
<div id="mySidebar" class="sidebar">
  <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
  <div class="sidebar-header">
    <h3>eBook Admin</h3>
  </div>
  <a href="dashboard.php">Dashboard</a>
  <a href="manageEbook.html">Pending Approvals</a>
  <a href="rejectedeBook.html">Rejected eBooks</a>
  <a href="manageEbookC.html">Available eBooks</a>
  <a href="createEbook.html">Create New Entry</a>
</div>

<!-- Button to open the sidebar on small screens -->
<div id="openBtnContainer" class="openbtn-container">
  <button class="openbtn" onclick="openNav()">&#9776; Open Sidebar</button>
</div>

<script>
  // Sidebar JavaScript functions
  function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("mySidebar").style.left = "0";
    if (window.innerWidth > 768) {
      document.getElementById("mainContent").style.marginLeft = "250px";
    }
    document.getElementById("openBtnContainer").style.display = "none";
    document.body.style.overflow = "hidden"; // Prevent body scroll when sidebar is open
  }

  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("mySidebar").style.left = "-250px"; // Slide out to left
    document.getElementById("mainContent").style.marginLeft = "0"; // Reset main content margin
    document.getElementById("openBtnContainer").style.display = "block"; // Show open button
    document.body.style.overflow = "auto"; // Allow body scroll
  }

  // Handle responsiveness on window resize/load
  function handleResize() {
    if (window.innerWidth > 768) { // For larger screens
      document.getElementById("mySidebar").style.width = "250px";
      document.getElementById("mySidebar").style.left = "0";
      document.getElementById("mainContent").style.marginLeft = "250px";
      document.getElementById("openBtnContainer").style.display = "none";
      document.body.style.overflow = "auto";
    } else { // For smaller screens
      document.getElementById("mySidebar").style.width = "0";
      document.getElementById("mySidebar").style.left = "-250px";
      document.getElementById("mainContent").style.marginLeft = "0";
      document.getElementById("openBtnContainer").style.display = "block"; // Always show on small screens initially
      document.body.style.overflow = "auto";
    }
  }

  // Initial call and event listener
  window.addEventListener('load', handleResize);
  window.addEventListener('resize', handleResize);
</script>
