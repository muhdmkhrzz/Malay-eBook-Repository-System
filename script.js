const SUPABASE_URL = 'https://zfiaoyymowvjurqxrazu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmaWFveXltb3d2anVycXhyYXp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjg3MjMsImV4cCI6MjA2Nzc0NDcyM30.LX6eYX1F9Z1LpAIMurENn921WtgF9YF5qM1xLr6hVWw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM Elements
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

// Navigation Elements
const homeLink = document.getElementById('home-link');
const uploadLink = document.getElementById('upload-link');
const loginLink = document.getElementById('login-link');
const registerLink = document.getElementById('register-link');
const logoutLink = document.getElementById('logout-link');
const authLinks = document.getElementById('auth-links');
const userDisplay = document.getElementById('user-display');
const userEmailSpan = document.getElementById('user-email');

// Form Elements
const authForm = document.getElementById('auth-form');
const authEmailInput = document.getElementById('auth-email');
const authPasswordInput = document.getElementById('auth-password');
const authButton = document.getElementById('auth-button');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const ebookUploadForm = document.getElementById('ebook-upload-form');
const searchInput = document.getElementById('search-input');
const sortSelect = document.getElementById('sort-select');
const filterGenreSelect = document.getElementById('filter-genre-select');
const backToListBtn = document.getElementById('back-to-list');
const submitReviewBtn = document.getElementById('submit-review');

let currentEbookId = null;
let isRegisterMode = false;
let allGenres = new Set();

// Helper Functions
function showSection(section) {
    authSection.classList.add('hidden');
    uploadSection.classList.add('hidden');
    ebookListSection.classList.add('hidden');
    ebookDetailSection.classList.add('hidden');
    section.classList.remove('hidden');
}

async function updateUI() {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        authLinks.classList.add('hidden');
        logoutLink.classList.remove('hidden');
        uploadLink.classList.remove('hidden');
        userDisplay.classList.remove('hidden');
        userEmailSpan.textContent = user.email;
        addReviewFormDiv.classList.remove('hidden');
        loginToReviewMessage.classList.add('hidden');
    } else {
        authLinks.classList.remove('hidden');
        logoutLink.classList.add('hidden');
        uploadLink.classList.add('hidden');
        userDisplay.classList.add('hidden');
        addReviewFormDiv.classList.add('hidden');
        loginToReviewMessage.classList.remove('hidden');
    }
}

// Authentication
authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = authEmailInput.value;
    const password = authPasswordInput.value;

    if (isRegisterMode) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) alert('Registration error: ' + error.message);
        else {
            alert('Registration successful! Please check your email to confirm your account.');
            isRegisterMode = false;
            authButton.textContent = 'Login';
            showRegisterLink.classList.remove('hidden');
            showLoginLink.classList.add('hidden');
            authForm.reset();
        }
    } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert('Login error: ' + error.message);
        else {
            alert('Logged in successfully!');
            showSection(ebookListSection);
        }
    }
    updateUI();
});

// Navigation Event Listeners
loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    isRegisterMode = false;
    authButton.textContent = 'Login';
    showRegisterLink.classList.remove('hidden');
    showLoginLink.classList.add('hidden');
    showSection(authSection);
});

registerLink.addEventListener('click', (e) => {
    e.preventDefault();
    isRegisterMode = true;
    authButton.textContent = 'Register';
    showRegisterLink.classList.add('hidden');
    showLoginLink.classList.remove('hidden');
    showSection(authSection);
});

showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    isRegisterMode = true;
    authButton.textContent = 'Register';
    showRegisterLink.classList.add('hidden');
    showLoginLink.classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    isRegisterMode = false;
    authButton.textContent = 'Login';
    showRegisterLink.classList.remove('hidden');
    showLoginLink.classList.add('hidden');
});

logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signOut();
    if (error) alert('Logout error: ' + error.message);
    else {
        alert('Logged out successfully!');
        showSection(ebookListSection);
    }
    updateUI();
});

loginToReviewLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(authSection);
    isRegisterMode = false;
    authButton.textContent = 'Login';
    showRegisterLink.classList.remove('hidden');
    showLoginLink.classList.add('hidden');
});

// eBook Functions
async function fetchEbooks() {
    try {
        console.log("Starting to fetch eBooks...");
        
        // Show loading message
        if (elements.ebookList) {
            elements.ebookList.innerHTML = '<p id="loading-message">Loading eBooks...</p>';
        }

        // Build the query
        let query = supabase.from('ebook').select('*');
        
        // Add search filter if needed
        if (elements.searchInput?.value) {
            const searchTerm = elements.searchInput.value.toLowerCase();
            query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,genre.ilike.%${searchTerm}%`);
        }

        // Add genre filter if selected
        if (elements.filterGenreSelect?.value) {
            query = query.eq('genre', elements.filterGenreSelect.value);
        }

        // Add sorting
        if (elements.sortSelect?.value) {
            const sortOption = elements.sortSelect.value;
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
        
        if (!elements.ebookList) {
            console.error("ebookList element not found");
            return;
        }

        if (!ebooks || ebooks.length === 0) {
            elements.ebookList.innerHTML = '<p>No eBooks found matching your criteria.</p>';
            return;
        }

        // Clear existing content and genres
        elements.ebookList.innerHTML = '';
        allGenres.clear();

        // Populate eBooks
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
            elements.ebookList.appendChild(ebookCard);

            if (ebook.genre) allGenres.add(ebook.genre);
        });

        populateGenreFilter();
        console.log("Successfully loaded eBooks");

    } catch (error) {
        console.error("Failed to fetch eBooks:", error);
        if (elements.ebookList) {
            elements.ebookList.innerHTML = `
                <p>Error loading eBooks.</p>
                <p><small>${error.message}</small></p>
            `;
        }
    }
}

    ebookList.innerHTML = '';
    allGenres.clear();

    if (ebooks.length === 0) {
        ebookList.innerHTML = '<p>No eBooks found matching your criteria.</p>';
        return;
    }

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

function populateGenreFilter() {
    filterGenreSelect.innerHTML = '<option value="">All Categories</option>';
    allGenres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        filterGenreSelect.appendChild(option);
    });
}

async function showEbookDetail(id) {
    currentEbookId = id;
    showSection(ebookDetailSection);
    ebookDetailContent.innerHTML = '<p>Loading eBook details...</p>';
    reviewsList.innerHTML = '';
    noReviewsMessage.classList.add('hidden');
    addReviewFormDiv.classList.add('hidden');
    loginToReviewMessage.classList.add('hidden');

    const { data: ebook, error } = await supabase.from('ebook').select('*').eq('id', id).single();

    if (error) {
        console.error('Error fetching ebook details:', error.message);
        ebookDetailContent.innerHTML = '<p>Error loading eBook details.</p>';
        return;
    }

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
        reviewsList.innerHTML = '<p>Error loading reviews.</p>';
        return;
    }

    reviewsList.innerHTML = '';
    if (reviews.length === 0) {
        noReviewsMessage.classList.remove('hidden');
    } else {
        noReviewsMessage.classList.add('hidden');
        reviews.forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.classList.add('review-item');
            reviewItem.innerHTML = `
                <strong>${review.user_email ? review.user_email.email : 'Anonymous'}</strong>
                <span class="review-rating">${review.rating} &#9733;</span>
                <p>${review.comment || 'No comment provided.'}</p>
                <small>${new Date(review.datereview).toLocaleDateString()}</small>
            `;
            reviewsList.appendChild(reviewItem);
        });
    }
}

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
        document.querySelector('input[name="rating"]:checked').checked = false;
        document.getElementById('review-comment').value = '';
    }
});

// Upload eBook
uploadLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(uploadSection);
});

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
    const ebookFile = uploadFile.files[0];

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
        showSection(ebookListSection);
        fetchEbooks();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    fetchEbooks();
    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(ebookListSection);
        fetchEbooks();
    });
});

supabase.auth.onAuthStateChange((event, session) => {
    updateUI();
});

function createClient(supabaseUrl, supabaseKey) {
    return window.supabase.createClient(supabaseUrl, supabaseKey);
}