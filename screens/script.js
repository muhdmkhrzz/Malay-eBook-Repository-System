const SUPABASE_URL = 'https://zfiaoyymowvjurqxrazu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaWFveXltb3d2anVycXhyYXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjg3MjMsImV4cCI6MjA2Nzc0NDcyM30.LX6eYX1F9Z1LpAIMurENn921WtgF9YF5qM1xLr6hVWw';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); // Direct creation

// DOM Elements - These will be present on index.html (after login)
const authSection = document.getElementById('auth-section'); 
const uploadSection = document.getElementById('upload-section'); 
const ebookListSection = document.getElementById('ebook-list-section'); 
const ebookDetailSection = document.getElementById('ebook-detail-section'); 
const ebookList = document.getElementById('ebook-list');
const ebookDetailContent = document.getElementById('ebook-detail-content');
const reviewsList = document.getElementById('reviews-list');
const noReviewsMessage = document.getElementById('no-reviews');
const addReviewFormDiv = document.getElementById('add-review-form');
const loginToReviewMessage = document.getElementById('login-to-review');


// Navigation Elements - Some will be on index.html, others handled by direct page links
const homeLink = document.getElementById('home-link');
const uploadLink = document.getElementById('upload-link');
const loginLink = document.getElementById('login-link'); // Login button on index.html
const registerLink = document.getElementById('register-link'); // Register button on index.html
const logoutLink = document.getElementById('logout-link');
const authLinks = document.getElementById('auth-links'); // Container for login/register links on index.html
const userDisplay = document.getElementById('user-display');
const userEmailSpan = document.getElementById('user-email');

// Form Elements - These are critical for login.html and signup.html
const authForm = document.getElementById('auth-form');
const authEmailInput = document.getElementById('auth-email');
const authPasswordInput = document.getElementById('auth-password');
const authUsernameInput = document.getElementById('auth-username'); // ADDED: New DOM element for username
const authButton = document.getElementById('auth-button');
const showRegisterLink = document.getElementById('show-register'); // Link on login.html to signup.html
const showLoginLink = document.getElementById('show-login'); // Link on signup.html to login.html
const confirmPasswordInput = document.getElementById('confirm-password'); // Only present on signup.html

// eBook related elements (these will primarily function *after* successful login on index.html)
const ebookUploadForm = document.getElementById('ebook-upload-form');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const filterGenreSelect = document.getElementById('filter-genre-select');
const backToListBtn = document.getElementById('back-to-list');
const submitReviewBtn = document.getElementById('submit-review');
const loginToReviewLink = document.getElementById('login-to-review-link'); // Ensure you have this ID in your HTML

let currentEbookId = null;
let allGenres = new Set();

// Helper Functions
function showSection(section) {
    // Only attempt to hide/show if the elements exist on the current page
    if (authSection) authSection.classList.add('hidden');
    if (uploadSection) uploadSection.classList.add('hidden');
    if (ebookListSection) ebookListSection.classList.add('hidden');
    if (ebookDetailSection) ebookDetailSection.classList.add('hidden');
    if (section) section.classList.remove('hidden');
}

async function updateUI() {
    const { data: { user } } = await supabase.auth.getUser();

    // These UI updates are primarily for the main application page (index.html after login)
    if (authLinks && logoutLink && uploadLink && userDisplay && userEmailSpan) {
        if (user) {
            authLinks.classList.add('hidden');
            logoutLink.classList.remove('hidden');
            uploadLink.classList.remove('hidden');
            userDisplay.classList.remove('hidden');
            // Display username if available, otherwise fallback to email
            userEmailSpan.textContent = user.user_metadata.username || user.email; // MODIFIED: Prioritize username
            if (addReviewFormDiv) addReviewFormDiv.classList.remove('hidden');
            if (loginToReviewMessage) loginToReviewMessage.classList.add('hidden');
        } else {
            authLinks.classList.remove('hidden');
            logoutLink.classList.add('hidden');
            uploadLink.classList.add('hidden');
            userDisplay.classList.add('hidden');
            if (addReviewFormDiv) addReviewFormDiv.classList.add('hidden');
            if (loginToReviewMessage) loginToReviewMessage.classList.remove('hidden');
        }
    }
}

// Authentication Forms (handled on login.html and signup.html)
if (authForm) { 
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = authEmailInput.value;
        const password = authPasswordInput.value;

        // Determine if it's register mode based on the presence of confirmPasswordInput
        const isRegisterMode = !!confirmPasswordInput; 

        if (isRegisterMode) {
            const confirmPassword = confirmPasswordInput.value;
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            // Get the username value for registration
            const username = authUsernameInput ? authUsernameInput.value : null; // ADDED: Get username value

            const { data, error } = await supabase.auth.signUp({ 
                email, 
                password,
                // ADDED: options object to store username in user_metadata
                options: {
                    data: {
                        username: username // Store the username here
                    }
                }
            });
            if (error) alert('Registration error: ' + error.message);
            else {
                alert('Registration successful! Please check your email to confirm your account.');
                window.location.href = '../screens/login.html'; // Redirect to login page
            }
        } else {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) alert('Login error: ' + error.message);
            else {
                alert('Logged in successfully!');
                window.location.href = '../index.html'; // Redirect to main app page
            }
        }
        // updateUI() is called on DOMContentLoaded in index.html, so not needed here
    });
}

// Navigation Event Listeners for direct page links (primarily for index.html)
if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'screens/login.html'; 
    });
}

if (registerLink) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'screens/signup.html'; 
    });
}

// Navigation Event Listeners for links between login/signup pages
if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../screens/signup.html'; 
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../screens/login.html'; 
    });
}

if (logoutLink) {
    logoutLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signOut();
        if (error) alert('Logout error: ' + error.message);
        else {
            alert('Logged out successfully!');
            window.location.href = '../index.html'; // Redirect to home/welcome page after logout
        }
        updateUI(); // Update UI if on index.html
    });
}

if (loginToReviewLink) {
    loginToReviewLink.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '../screens/login.html'; // Redirect to login page
    });
}

// eBook Functions (these will primarily function on index.html after login)
async function fetchEbooks() {
    try {
        console.log("Starting to fetch eBooks...");
        
        if (ebookList) {
            ebookList.innerHTML = '<p id="loading-message">Loading eBooks...</p>';
        }

        let query = supabase.from('ebook').select('*');
        
        if (searchInput && searchInput.value) { // Ensure searchInput exists
            const searchTerm = searchInput.value.toLowerCase();
            query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,genre.ilike.%${searchTerm}%`);
        }

        if (filterGenreSelect && filterGenreSelect.value) { // Ensure filterGenreSelect exists
            query = query.eq('genre', filterGenreSelect.value);
        }

        if (sortSelect && sortSelect.value) { // Ensure sortSelect exists
            const sortOption = sortSelect.value;
            switch (sortOption) {
                case 'title_asc':
                    query = query.order('title', { ascending: true });
                    break;
                case 'author_asc':
                    query = query.order('author', { ascending: true });
                    break;
                case 'year_desc':
                    query = query.order('year', { ascending: false });
                    break;
            }
        }

        console.log("Executing query...");
        const { data: ebooks, error } = await query;

        if (error) {
            console.error("Supabase error:", error);
            throw error;
        }

        console.log("Received data:", ebooks);
        
        if (!ebookList) {
            console.error("ebookList element not found");
            return;
        }

        if (!ebooks || ebooks.length === 0) {
            ebookList.innerHTML = '<p>No eBooks found matching your criteria.</p>';
            return;
        }

        ebookList.innerHTML = '';
        allGenres.clear();

        ebooks.forEach(ebook => {
            const ebookCard = document.createElement('div');
            ebookCard.classList.add('ebook-card');
            ebookCard.dataset.id = ebook.id;
            ebookCard.innerHTML = `
                <div class="ebook-card-content">
                    <h3>${ebook.title || 'N/A'}</h3>
                    <p><strong>Author:</strong> ${ebook.author || 'N/A'}</p>
                    <p><strong>Genre:</strong> ${ebook.genre || 'N/A'}</p>
                    <p><strong>Publisher:</strong> ${ebook.publisher || 'N/A'}</p>
                    <p><strong>Year:</strong> ${ebook.year || 'N/A'}</p>
                </div>
            `;
            ebookCard.addEventListener('click', () => showEbookDetail(ebook.id));
            ebookList.appendChild(ebookCard);

            if (ebook.genre) allGenres.add(ebook.genre);
        });

        populateGenreFilter();
        console.log("Successfully loaded eBooks");

    } catch (error) {
        console.error("Failed to fetch eBooks:", error);
        if (ebookList) {
            ebookList.innerHTML = `
                <p>Error loading eBooks.</p>
                <p><small>${error.message}</small></p>
            `;
        }
    }
}

function populateGenreFilter() {
    if (filterGenreSelect) { 
        filterGenreSelect.innerHTML = '<option value="">All Categories</option>';
        allGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            filterGenreSelect.appendChild(option);
        });
    }
}

async function showEbookDetail(id) {
    currentEbookId = id;
    if (ebookDetailSection) showSection(ebookDetailSection);
    if (ebookDetailContent) ebookDetailContent.innerHTML = '<p>Loading eBook details...</p>';
    if (reviewsList) reviewsList.innerHTML = '';
    if (noReviewsMessage) noReviewsMessage.classList.add('hidden');
    if (addReviewFormDiv) addReviewFormDiv.classList.add('hidden');
    if (loginToReviewMessage) loginToReviewMessage.classList.add('hidden');

    const { data: ebook, error } = await supabase.from('ebook').select('*').eq('id', id).single();

    if (error) {
        console.error('Error fetching ebook details:', error.message);
        if (ebookDetailContent) ebookDetailContent.innerHTML = '<p>Error loading eBook details.</p>';
        return;
    }

    if (ebookDetailContent) {
        ebookDetailContent.innerHTML = `
            <h2>${ebook.title || 'N/A'}</h2>
            <p><span class="detail-label">Author:</span> ${ebook.author || 'N/A'}</p>
            <p><span class="detail-label">Publisher:</span> ${ebook.publisher || 'N/A'}</p>
            <p><span class="detail-label">Category:</span> ${ebook.genre || 'N/A'}</p>
            <p><span class="detail-label">Year:</span> ${ebook.year || 'N/A'}</p>
            <p><span class="detail-label">Month:</span> ${ebook.month || 'N/A'}</p>
            <p><span class="detail-label">Pages:</span> ${ebook.pages || 'N/A'}</p>
            <p><span class="detail-label">Words:</span> ${ebook.words || 'N/A'}</p>
            <p><span class="detail-label">Price:</span> RM${ebook.price ? parseFloat(ebook.price).toFixed(2) : 'N/A'}</p>
            <p class="synopsis"><span class="detail-label">Synopsis:</span><br>${ebook.synopsis || 'No synopsis available.'}</p>
            ${ebook.file_url ? `<a href="${ebook.file_url}" target="_blank" class="download-button">Download eBook</a>` : ''}
        `;
    }

    fetchReviews(id);
    updateUI();
}

async function fetchReviews(ebookId) {
    const { data: reviews, error } = await supabase
        .from('review')
        .select(`*, user_email:users(email)`)
        .eq('ebook_id', ebookId)
        .order('datereview', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error.message);
        if (reviewsList) reviewsList.innerHTML = '<p>Error loading reviews.</p>';
        return;
    }

    if (reviewsList) reviewsList.innerHTML = '';
    if (reviews.length === 0) {
        if (noReviewsMessage) noReviewsMessage.classList.remove('hidden');
    } else {
        if (noReviewsMessage) noReviewsMessage.classList.add('hidden');
        reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');
            reviewItem.innerHTML = `
                <strong>${review.user_email ? review.user_email.email : 'Anonymous'}</strong>
                <span class="review-rating">${review.rating} &#9733;</span>
                <p>${review.comment || 'No comment provided.'}</p>
                <small>${new Date(review.datereview).toLocaleDateString()}</small>
            `;
            if (reviewsList) reviewsList.appendChild(reviewItem);
        });
    }
}

if (submitReviewBtn) { 
    submitReviewBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            alert('You must be logged in to submit a review.');
            return;
        }

        const rating = document.querySelector('input[name="rating"]:checked');
        const comment = document.getElementById('review-comment').value;

        if (!rating) {
            alert('Please select a star rating.');
            return;
        }

        const { error } = await supabase.from('review').insert({
            ebook_id: currentEbookId,
            user_id: user.id,
            rating: parseInt(rating.value),
            comment: comment,
            datereview: new Date().toISOString()
        });

        if (error) {
            alert('Error submitting review: ' + error.message);
        } else {
            alert('Review submitted successfully!');
            fetchReviews(currentEbookId);
            const selectedRatingInput = document.querySelector('input[name="rating"]:checked');
            if (selectedRatingInput) selectedRatingInput.checked = false;
            const reviewCommentInput = document.getElementById('review-comment');
            if (reviewCommentInput) reviewCommentInput.value = '';
        }
    });
}

// Upload eBook (assuming this functionality is on a different page or hidden on index.html before login)
if (uploadLink) {
    uploadLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (uploadSection) showSection(uploadSection);
    });
}

if (ebookUploadForm) {
    ebookUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert('You must be logged in to upload an eBook.');
            return;
        }

        const title = document.getElementById('upload-title').value;
        const author = document.getElementById('upload-author').value;
        const pages = document.getElementById('upload-pages').value;
        const words = document.getElementById('upload-words').value;
        const price = document.getElementById('upload-price').value;
        const genre = document.getElementById('upload-genre').value;
        const month = document.getElementById('upload-month').value;
        const year = document.getElementById('upload-year').value;
        const publisher = document.getElementById('upload-publisher').value;
        const synopsis = document.getElementById('upload-synopsis').value;
        const uploadFile = document.getElementById('uploadFile'); 
        const ebookFile = uploadFile && uploadFile.files[0];

        if (!title || !author) {
            alert('Title and Author are required fields.');
            return;
        }

        let fileUrl = null;
        if (ebookFile) {
            const filePath = `${user.id}/${Date.now()}-${ebookFile.name}`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('ebook-files')
                .upload(filePath, ebookFile);

            if (uploadError) {
                alert('Error uploading file: ' + uploadError.message);
                return;
            }
            
            const { data: publicUrlData } = supabase.storage
                .from('ebook-files')
                .getPublicUrl(filePath);
            fileUrl = publicUrlData.publicUrl;
        }

        const { error: insertError } = await supabase.from('ebook').insert({
            title,
            author,
            pages: pages ? parseInt(pages) : null,
            words: words ? parseInt(words) : null,
            price: price ? parseFloat(price) : null,
            genre,
            month,
            year,
            publisher,
            synopsis,
            file_url: fileUrl
        });

        if (insertError) {
            alert('Error adding eBook to database: ' + insertError.message);
        } else {
            alert('eBook uploaded successfully!');
            ebookUploadForm.reset();
            if (ebookListSection) showSection(ebookListSection);
            fetchEbooks();
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    updateUI(); 
 
    if (document.body.id === 'ebook-list-page') { 
        if (ebookListSection) showSection(ebookListSection);
        fetchEbooks();
    } else if (document.body.id === 'auth-page') { 
        if (authSection) authSection.classList.remove('hidden'); 
    }


    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '../index.html'; 
        });
    }
});

supabase.auth.onAuthStateChange((event, session) => {
    updateUI();
});