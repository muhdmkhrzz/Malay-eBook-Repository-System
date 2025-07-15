<?php
// dashboard.php - This file is the main admin dashboard page.
// It includes the reusable sidebar and contains the dashboard content.

// Placeholder data for demonstration (you would fetch this from your database)
$totalUsers = 5234;
$totalEbooks = 1876;
$totalClerks = 7;
$newEbooksLast30Days = 45;
$newUsersLast30Days = 120;
$activeUsersYesterday = 850;

$mostPopularEbooks = [
    ['title' => 'Hikayat Hang Tuah', 'reads' => 2100],
    ['title' => 'Tingkat-Tingkat Syurga', 'reads' => 1850],
    ['title' => 'Resepi Warisan Nenek', 'reads' => 1520],
];

$ebookCategories = [
    ['name' => 'Fiction', 'count' => 600],
    ['name' => 'History', 'count' => 300],
    ['name' => 'Religion', 'count' => 250],
    ['name' => 'Children', 'count' => 200],
    ['name' => 'Science', 'count' => 150],
    ['name' => 'Others', 'count' => 376],
];

$userRoles = [
    ['role' => 'Admin', 'count' => 2],
    ['role' => 'Clerk', 'count' => 7],
    ['role' => 'Regular User', 'count' => 5225],
];

function calculatePercentage($value, $total) {
    return $total > 0 ? number_format(($value / $total) * 100, 1) : 0;
}

function getCategoryColor($index) {
    $colors = ['#3b82f6','#22c55e','#ef4444','#f59e0b','#a855f7','#ec4899','#6366f1','#14b8a6'];
    return $colors[$index % count($colors)];
}

$currentDate = date('l, F j, Y');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest/dist/lucide.min.js"></script>
    <script>document.addEventListener('DOMContentLoaded', function() { lucide.createIcons(); });</script>
    <style>
        * { box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        html, body { background: #f9fafb; color: #1f2937; margin: 0; padding: 0; }
        .main-layout-container { display: flex; min-height: 100vh; }
        .main-content { flex: 1; padding: 2rem; }
        .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .dashboard-header h1 { font-size: 2rem; font-weight: 600; color: #111827; }
        .dashboard-header .date-info { text-align: right; font-size: 0.9rem; color: #6b7280; }
        .overview-cards, .detailed-stats { display: grid; gap: 1.5rem; margin-bottom: 2rem; }
        @media (min-width: 768px) { .overview-cards { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .detailed-stats { grid-template-columns: repeat(2, 1fr); } }
        .card, .stat-panel {
            background: #ffffff; border-radius: 1rem;
            padding: 1.5rem; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover, .stat-panel:hover { transform: scale(1.02); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); }
        .card .icon-value { font-size: 2rem; font-weight: 600; display: flex; align-items: center; justify-content: center; color: #2563eb; margin-bottom: 0.5rem; }
        .card .icon-value i { margin-right: 0.5rem; }
        .card .label { text-align: center; font-weight: 500; color: #4b5563; }
        .stat-panel h2 { font-size: 1.25rem; font-weight: 600; display: flex; align-items: center; margin-bottom: 1rem; }
        .stat-panel h2 i { margin-right: 0.5rem; color: #3b82f6; }
        .stat-panel .metric { font-size: 1rem; margin-bottom: 1rem; }
        .stat-panel .metric .value { color: #16a34a; font-weight: 600; }
        .stat-panel h3 { font-size: 1.1rem; font-weight: 600; color: #1f2937; margin-bottom: 0.5rem; }
        .stat-panel ul { padding-left: 1rem; color: #374151; }
        .stat-panel ul li { margin-bottom: 0.25rem; }
        .chart-placeholder {
            background: #f3f4f6; border: 2px dashed #d1d5db;
            color: #6b7280; padding: 1rem; border-radius: 0.75rem;
            text-align: center; font-style: italic;
        }
        .category-list, .role-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .category-item, .role-bar-container { display: flex; align-items: center; }
        .color-box { width: 0.75rem; height: 0.75rem; border-radius: 9999px; margin-right: 0.5rem; }
        .role-bar-label { width: 96px; font-size: 0.875rem; font-weight: 500; }
        .role-bar-fill { flex-grow: 1; background-color: #e5e7eb; border-radius: 9999px; height: 1rem; overflow: hidden; }
        .role-bar-inner { height: 100%; border-radius: 9999px; transition: width 0.3s ease-in-out; }
        .role-bar-count { margin-left: 0.5rem; font-size: 0.875rem; }
    </style>
</head>
<body>
<div class="main-layout-container">
    <?php include '../admin/sidebarAdmin.php';?>
    <div class="main-content">
        <div class="dashboard-header">
            <h1>Admin Dashboard</h1>
            <div class="date-info">
                <p>Welcome, Administrator!</p>
                <p><?php echo $currentDate; ?></p>
            </div>
        </div>

        <div class="overview-cards">
            <div class="card users">
                <div class="icon-value"><i class="lucide lucide-users"></i> <?php echo $totalUsers; ?></div>
                <p class="label">Total Registered Users</p>
            </div>
            <div class="card ebooks">
                <div class="icon-value"><i class="lucide lucide-book-open"></i> <?php echo $totalEbooks; ?></div>
                <p class="label">Total Ebooks</p>
            </div>
            <div class="card clerks">
                <div class="icon-value"><i class="lucide lucide-user-cog"></i> <?php echo $totalClerks; ?></div>
                <p class="label">Total Clerks</p>
            </div>
        </div>

        <div class="detailed-stats">
            <div class="stat-panel">
                <h2><i class="lucide lucide-bar-chart-2"></i> Ebook Statistics</h2>
                <div class="metric">
                    <p><span class="value"><?php echo $newEbooksLast30Days; ?></span> New Ebooks (Last 30 Days)</p>
                </div>
                <div>
                    <h3>Most Popular Ebooks</h3>
                    <ul>
                        <?php foreach ($mostPopularEbooks as $ebook): ?>
                            <li><span class="title"><?php echo $ebook['title']; ?></span> (<?php echo $ebook['reads']; ?> Reads)</li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div>
                    <h3>Ebooks by Category</h3>
                    <div class="category-list">
                        <?php foreach ($ebookCategories as $index => $category): ?>
                            <div class="category-item">
                                <span class="color-box" style="background-color: <?php echo getCategoryColor($index); ?>;"></span>
                                <span><?php echo $category['name']; ?> (<?php echo calculatePercentage($category['count'], $totalEbooks); ?>%)</span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="chart-placeholder">
                        <p>Pie chart for ebook categories will be displayed here using a charting library (e.g., Chart.js).</p>
                    </div>
                </div>
            </div>

            <div class="stat-panel">
                <h2><i class="lucide lucide-users-round"></i> User Statistics</h2>
                <div class="metric">
                    <p><span class="value"><?php echo $newUsersLast30Days; ?></span> New Users (Last 30 Days)</p>
                </div>
                <div class="metric">
                    <p><span class="value"><?php echo $activeUsersYesterday; ?></span> Active Users Yesterday</p>
                </div>
                <div>
                    <h3>User Role Distribution</h3>
                    <div class="role-list">
                        <?php foreach ($userRoles as $index => $role): ?>
                            <div class="role-bar-container">
                                <span class="role-bar-label"><?php echo $role['role']; ?>:</span>
                                <div class="role-bar-fill">
                                    <div
                                        class="role-bar-inner"
                                        style="width: <?php echo calculatePercentage($role['count'], $totalUsers); ?>%; background-color: <?php echo getCategoryColor($index); ?>;">
                                    </div>
                                </div>
                                <span class="role-bar-count"><?php echo $role['count']; ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="chart-placeholder">
                        <p>Bar chart for user role distribution will be displayed here using a charting library.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
