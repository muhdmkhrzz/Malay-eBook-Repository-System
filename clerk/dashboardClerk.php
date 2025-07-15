<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>eBook Management Dashboard</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      /* Light Glassmorphism Color Palette */
      --light-bg-start: #e0f2f7; /* Very light blue */
      --light-bg-end: #f0f8ff;   /* Even lighter blue/white */
      --surface-text-dark: #333333; /* Dark text for readability */
      --surface-text-light: #666666; /* Lighter text for descriptions */

      /* Glass elements */
      --glass-bg-color: rgba(255, 255, 255, 0.6); /* More transparent white */
      --glass-border-color: rgba(255, 255, 255, 0.8); /* Brighter border */
      --glass-shadow: 0 4px 15px rgba(0, 0, 0, 0.1); /* Softer shadow */
      --glass-blur: 15px; /* Consistent blur */

      /* Accent Colors (softer tones) */
      --accent-blue: #64b5f6; /* Soft blue for primary actions */
      --accent-pending: #ffca28; /* Soft yellow for pending */
      --accent-rejected: #ef5350; /* Soft red for rejected */
      --accent-available: #66bb6a; /* Soft green for available */
      --accent-number: #ef5350; /* Specific color for numbers, matching rejected accent */

      --sidebar-width: 250px; /* Define a width for the sidebar */
    }

    * {
      box-sizing: border-box;
      font-family: 'Poppins', sans-serif;
    }

    body {
      background: linear-gradient(135deg, var(--light-bg-start) 0%, var(--light-bg-end) 100%); /* Soft light gradient */
      margin: 0;
      padding: 0; /* Main content div will handle padding */
      color: var(--surface-text-dark); /* Default text color */
      display: flex; /* Use flex to center main content */
      flex-direction: column;
      min-height: 100vh;
      align-items: center; /* Center content horizontally */
      justify-content: center; /* Center content vertically if not much content */
      overflow-x: hidden;
    }

    h1 {
      font-family: 'Poppins', sans-serif;
      text-align: center;
      margin-bottom: 40px;
      color: var(--surface-text-dark);
      font-size: 3em;
      font-weight: 700;
      text-shadow: none;
      letter-spacing: 1px;
    }

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

    /* Main content area - now acts as the primary container */
    #mainContent {
      padding: 60px 40px 40px 40px; /* Adjusted padding-top for more space */
      width: 100%;
      max-width: 1200px; /* Max width for the entire dashboard content */
      margin: 0 auto; /* Center the content */
      flex-grow: 1; /* Allows it to take available height */
      position: relative; /* For absolute positioning of date/time */
      transition: margin-left 0.5s ease-in-out; /* Add transition for smooth push */
    }

    /* Dashboard cards */
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); /* Default flexible columns */
      gap: 40px;
      width: 100%;
    }

    .dashboard-card {
      background: var(--glass-bg-color);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border-color);
      box-shadow: var(--glass-shadow);
      border-radius: 15px;
      padding: 35px;
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 320px;
      position: relative;
      overflow: hidden;
    }

    .dashboard-card > a {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      padding: 35px;
      text-decoration: none;
      color: inherit;
      z-index: 1;
    }

    .dashboard-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border-color: rgba(255,255,255,0.9);
    }

    .dashboard-card h2 {
      font-family: 'Poppins', sans-serif;
      color: var(--surface-text-dark);
      font-size: 2.2em;
      margin-top: 0;
      margin-bottom: 20px;
      font-weight: 700;
    }
    .dashboard-card p.description,
    .dashboard-card .stats,
    .dashboard-card .stats strong {
        color: var(--surface-text-light);
        font-weight: 400;
    }
    .dashboard-card .stats strong {
        color: var(--surface-text-dark);
        font-weight: 600;
    }

    .dashboard-card .card-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 30px;
    }

    .dashboard-card p.description {
      font-size: 1.1em;
      line-height: 1.6;
      margin-bottom: 20px;
    }

    /* Specific style for the big, colorful number */
    .dashboard-card .total-number {
      font-size: 3em; /* Much larger font */
      font-weight: 700;
      color: var(--accent-number); /* Use the specific accent color for numbers */
      margin-bottom: 5px; /* Space between number and description */
      display: block; /* Ensure it takes its own line */
    }

    /* Specific style for the small, grey text below the number */
    .dashboard-card .number-subtext {
        font-size: 0.9em; /* Small font size */
        color: #888888; /* Grey color */
        margin-top: 5px; /* Space above */
    }


    /* Action text/button styles */
    .dashboard-card .action-text {
        display: block;
        padding: 18px 30px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        text-decoration: none;
        font-size: 1.15em;
        width: 100%;
        text-align: center;
        margin-top: auto;
        transition: background-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
        border: none;
        font-family: 'Poppins', sans-serif;
        box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    }

    /* Specific background colors for the action text */
    .dashboard-card.pending .action-text { background-color: var(--accent-pending); }
    .dashboard-card.rejected .action-text { background-color: var(--accent-rejected); }
    .dashboard-card.available .action-text { background-color: var(--accent-available); }
    .dashboard-card.create .action-text { background-color: var(--accent-blue); }

    .dashboard-card > a:hover .action-text {
        filter: brightness(1.05);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.15);
    }

    /* Date and Time Display */
    .date-time-display {
      position: absolute;
      top: 40px; /* Adjusted to align with new padding-top of mainContent */
      right: 40px;
      font-size: 1em;
      color: var(--surface-text-dark);
      font-weight: 600;
      background-color: var(--glass-bg-color);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border-color);
      box-shadow: var(--glass-shadow);
      padding: 10px 20px;
      border-radius: 10px;
      z-index: 10;
      font-family: 'Poppins', sans-serif;
    }

    /* New styles for Genre Totals box */
    .genre-totals-card {
      grid-column: 1 / -1; /* Span full width of the grid */
      background: var(--glass-bg-color);
      backdrop-filter: blur(var(--glass-blur));
      -webkit-backdrop-filter: blur(var(--glass-blur));
      border: 1px solid var(--glass-border-color);
      box-shadow: var(--glass-shadow);
      border-radius: 15px;
      padding: 35px;
      text-align: center;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .genre-totals-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      border-color: rgba(255,255,255,0.9);
    }

    .genre-totals-card h2 {
      font-family: 'Poppins', sans-serif;
      color: var(--surface-text-dark);
      font-size: 2.2em;
      margin-top: 0;
      margin-bottom: 20px;
      font-weight: 700;
    }

    .genre-list {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .genre-item {
      background-color: rgba(255, 255, 255, 0.3); /* Slightly more opaque glass for items */
      backdrop-filter: blur(5px); /* Less blur for individual items */
      -webkit-backdrop-filter: blur(5px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      border-radius: 10px;
      padding: 15px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      text-align: center;
      transition: transform 0.2s ease, background-color 0.2s ease;
    }

    .genre-item:hover {
        transform: translateY(-3px);
        background-color: rgba(255, 255, 255, 0.5);
    }

    .genre-item strong {
      display: block;
      font-size: 1.1em;
      color: var(--surface-text-dark);
      margin-bottom: 5px;
      font-weight: 600;
    }

    .genre-item span {
      font-size: 1.8em;
      font-weight: 700;
      color: var(--accent-blue); /* Use accent blue for numbers */
    }


    /* Responsive adjustments */
    @media (min-width: 769px) { /* Adjust main content margin for sidebar on large screens */
      #mainContent {
        margin-left: var(--sidebar-width);
      }
      .dashboard-grid {
        grid-template-columns: repeat(2, 1fr); /* Two columns on larger screens */
      }
    }

    @media (max-width: 992px) {
      .dashboard-grid {
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 30px;
      }
      .dashboard-card {
        min-height: 300px;
        padding: 30px;
      }
      .dashboard-card h2 {
        font-size: 2em;
      }
      .dashboard-card p.description {
        font-size: 1em;
      }
      .dashboard-card > a {
        padding: 30px;
      }
      .dashboard-card .action-text {
        padding: 15px 25px;
        font-size: 1.05em;
      }
      .genre-totals-card {
        padding: 30px;
      }
      .genre-totals-card h2 {
        font-size: 2em;
      }
      .genre-list {
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 15px;
      }
      .genre-item {
        padding: 12px;
      }
      .genre-item strong {
        font-size: 1em;
      }
      .genre-item span {
        font-size: 1.6em;
      }
    }

    @media (max-width: 768px) {
      body {
        padding: 0; /* #mainContent handles padding */
        justify-content: flex-start;
      }
      #mainContent {
        padding: 20px; /* Adjusted padding for mobile */
      }
      h1 {
        font-size: 2.5em;
        margin-bottom: 30px;
      }
      .date-time-display {
        position: static;
        margin-bottom: 20px;
        text-align: center;
        width: 100%;
        box-shadow: var(--glass-shadow);
        background-color: var(--glass-bg-color);
        border: 1px solid var(--glass-border-color);
        padding: 10px 15px;
        font-size: 0.9em;
      }
      .dashboard-grid {
        grid-template-columns: 1fr; /* Single column on small screens */
        gap: 25px;
      }
      .dashboard-card {
        padding: 25px;
        min-height: unset;
      }
      .dashboard-card h2 {
        font-size: 1.8em;
      }
      .dashboard-card p.description {
        display: none; /* Hide description on mobile for cleaner look */
      }
      .dashboard-card > a {
        padding: 25px;
      }
      .dashboard-card .action-text {
        padding: 12px 20px;
        font-size: 1em;
        margin-top: 20px;
      }
      .genre-totals-card {
        padding: 25px;
      }
      .genre-totals-card h2 {
        font-size: 1.8em;
      }
      .genre-list {
        grid-template-columns: repeat(2, 1fr); /* Two columns on small phones */
        gap: 10px;
      }
      .genre-item {
        padding: 10px;
      }
      .genre-item strong {
        font-size: 0.95em;
      }
      .genre-item span {
        font-size: 1.4em;
      }
    }

    @media (max-width: 480px) {
      h1 {
        font-size: 2em;
      }
      .dashboard-card h2 {
        font-size: 1.6em;
      }
      .dashboard-card p.description {
        display: none; /* Ensure hidden on very small screens too */
      }
      .dashboard-card .action-text {
        font-size: 0.95em;
      }
      .genre-list {
        grid-template-columns: 1fr; /* Stack on very small phones */
      }
    }
  </style>
</head>
<body>

  <!-- Sidebar Component (You would typically include this using PHP include 'sidebar.php';) -->
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

  <!-- Main Content Area -->
  <div id="mainContent">
    <h1>📚 eBook Management Dashboard</h1>

    <!-- Date and Time Display -->
    <div class="date-time-display">
      <span id="currentDateTime"></span>
    </div>

    <div class="dashboard-grid">

      <div class="dashboard-card pending">
        <a href="manageEbook.html">
          <h2>Pending Approvals</h2>
          <div class="card-content">
            <div class="stats">
              <span class="total-number">[Backend Data: X]</span>
              <p class="number-subtext">Total Pending</p>
            </div>
          </div>
          <span class="action-text">Go to Pending List</span>
        </a>
      </div>

      <div class="dashboard-card rejected">
        <a href="rejectedeBook.html">
          <h2>Rejected eBooks</h2>
          <div class="card-content">
            <div class="stats">
              <span class="total-number" style="color: var(--accent-rejected);">[Backend Data: Z]</span>
              <p class="number-subtext">Rejected by Admin</p>
            </div>
          </div>
          <span class="action-text">Go to Rejected List</span>
        </a>
      </div>

      <div class="dashboard-card available">
        <a href="manageEbookC.html">
          <h2>Available eBooks</h2>
          <div class="card-content">
            <div class="stats">
              <span class="total-number" style="color: var(--accent-available);">[Backend Data: P]</span>
              <p class="number-subtext">Total Available</p>
            </div>
          </div>
          <span class="action-text">Go to Available List</span>
        </a>
      </div>

      <div class="dashboard-card create">
        <a href="createEbook.html">
          <h2>Create New Entry</h2>
          <div class="card-content">
            <p class="number-subtext" style="font-size: 1.1em; color: var(--surface-text-light);">Click below to submit a new eBook for approval.</p>
          </div>
          <span class="action-text">Create New eBook</span>
        </a>
      </div>

      <!-- Total eBooks by Genre Card (remains detailed) -->
      <div class="genre-totals-card">
        <h2>Total eBooks by Genre</h2>
        <div class="genre-list">
          <div class="genre-item">
            <strong>Fiction</strong>
            <span>450</span>
          </div>
          <div class="genre-item">
            <strong>Fantasy</strong>
            <span>180</span>
          </div>
          <div class="genre-item">
            <strong>Science Fiction</strong>
            <span>120</span>
          </div>
          <div class="genre-item">
            <strong>Mystery</strong>
            <span>90</span>
          </div>
          <div class="genre-item">
            <strong>Biography</strong>
            <span>75</span>
          </div>
          <div class="genre-item">
            <strong>History</strong>
            <span>60</span>
          </div>
          <div class="genre-item">
            <strong>Self-Help</strong>
            <span>110</span>
          </div>
          <div class="genre-item">
            <strong>Cookbook</strong>
            <span>45</span>
          </div>
          <div class="genre-item">
            <strong>Children</strong>
            <span>130</span>
          </div>
          <div class="genre-item">
            <strong>Horror</strong>
            <span>55</span>
          </div>
        </div>
        <p style="margin-top: 20px; color: var(--surface-text-light);">
          <small>(Data dynamically loaded from backend)</small>
        </p>
      </div>

    </div>

    <script>
      function updateDateTime() {
        const now = new Date();
        const options = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        };
        const formattedDateTime = now.toLocaleDateString('en-US', options);
        document.getElementById('currentDateTime').textContent = formattedDateTime;
      }

      // Update time every second
      setInterval(updateDateTime, 1000);

      // Initial call to display time immediately
      updateDateTime();

      // Sidebar functions (needed here since sidebar is directly in this HTML)
      function openNav() {
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("mySidebar").style.left = "0";
        if (window.innerWidth > 768) {
          document.getElementById("mainContent").style.marginLeft = "250px";
        }
        document.getElementById("openBtnContainer").style.display = "none";
        document.body.style.overflow = "hidden";
      }

      function closeNav() {
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("mySidebar").style.left = "-250px";
        document.getElementById("mainContent").style.marginLeft = "0";
        document.getElementById("openBtnContainer").style.display = "block";
        document.body.style.overflow = "auto";
      }

      function handleResize() {
        if (window.innerWidth > 768) {
          document.getElementById("mySidebar").style.width = "250px";
          document.getElementById("mySidebar").style.left = "0";
          document.getElementById("mainContent").style.marginLeft = "250px";
          document.getElementById("openBtnContainer").style.display = "none";
          document.body.style.overflow = "auto";
        } else {
          document.getElementById("mySidebar").style.width = "0";
          document.getElementById("mySidebar").style.left = "-250px";
          document.getElementById("mainContent").style.marginLeft = "0";
          document.getElementById("openBtnContainer").style.display = "block";
          document.body.style.overflow = "auto";
        }
      }

      window.addEventListener('load', handleResize);
      window.addEventListener('resize', handleResize);
    </script>

  </div>
</body>
</html>
