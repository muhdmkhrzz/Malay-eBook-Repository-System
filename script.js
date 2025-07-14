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
const authUsernameInput = document.getElementById('auth-username'); 
const authButton = document.getElementById('auth-button');
const showRegisterLink = document.getElementById('show-register'); // Link on login.html to signup.html
const showLoginLink = document.getElementById('show-login'); // Link on signup.html to login.html
const confirmPasswordInput = document.getElementById('confirm-password'); // Only present on signup.html
const signupMessageDiv = document.getElementById('signup-message'); // New: For displaying messages on signup page

// Custom Modal Elements
const customModalOverlay = document.getElementById('custom-modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalCloseButton = document.getElementById('modal-close-button'); // This button was removed from HTML, but variable still exists.

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

// Function to show the custom modal
function showCustomModal(title, message, isSuccess = true) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalTitle.style.color = isSuccess ? '#28a745' : '#dc3545'; // Green for success, red for error
    customModalOverlay.classList.add('visible');
}

// Function to hide the custom modal (no longer directly called by a button)
function hideCustomModal() {
    customModalOverlay.classList.remove('visible');
}

// Event listener for the modal close button (no longer exists in HTML, but keeping this for robustness)
if (modalCloseButton) {
    modalCloseButton.addEventListener('click', hideCustomModal);
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
            userEmailSpan.textContent = user.user_metadata.username || user.email; // Prioritize username
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
    console.log("Auth form found, attaching submit listener."); // Log 1
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log("Auth form submitted!"); // Log 2
        const email = authEmailInput.value;
        const password = authPasswordInput.value;

        // Determine if it's register mode based on the presence of confirmPasswordInput
        const isRegisterMode = !!confirmPasswordInput; 
        console.log("Is Register Mode:", isRegisterMode); // Log 3

        if (isRegisterMode) {
            const confirmPassword = confirmPasswordInput.value;
            if (password !== confirmPassword) {
                signupMessageDiv.textContent = 'Passwords do not match!';
                console.log("Passwords do not match."); // Log 4
                return;
            }
            signupMessageDiv.textContent = ''; // Clear previous messages
            const username = authUsernameInput ? authUsernameInput.value : null;
            console.log("Attempting to sign up with:", { email, username }); // Log 5

            try {
                const { data, error } = await supabase.auth.signUp({ 
                    email, 
                    password,
                    options: {
                        data: {
                            username: username
                        }
                    }
                });
                if (error) {
                    console.error("Supabase Sign Up Error:", error.message); // Log 6 (Error)
                    showCustomModal('Sign Up Error', error.message, false);
                } else {
                    console.log("Supabase Sign Up Success:", data); // Log 7 (Success)
                    showCustomModal('Sign Up Successful!', 'Please Log In now.');
                    // Redirect after a short delay to allow user to read the message
                    setTimeout(() => {
                        window.location.href = '../screens/login.html'; 
                    }, 2000); 
                }
            } catch (err) {
                console.error("Unexpected error during Supabase sign up:", err); // Log 8 (Catch-all error)
                showCustomModal('Sign Up Error', 'An unexpected error occurred. Please try again.', false);
            }
        } else {
            // This is the login path
            console.log("Attempting to sign in with:", { email }); // Log A
            try {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    console.error("Supabase Login Error:", error.message); // Log B (Error)
                    showCustomModal('Login Error', error.message, false);
                } else {
                    console.log("Supabase Login Success:", data); // Log C (Success)
                    showCustomModal('Login Successful!', 'You have been logged in.');
                    // --- START OF RELEVANT CHANGE ---
                    setTimeout(() => {
                        // Assuming dashboard.html is in the 'user' folder, relative to the root
                        window.location.href = '../user/dashboard.html';
                    }, 2000);
                    // --- END OF RELEVANT CHANGE ---
                }
            } catch (err) {
                console.error("Unexpected error during Supabase login:", err); // Log D (Catch-all error)
                showCustomModal('Login Error', 'An unexpected error occurred. Please try again.', false);
            }
        }
    });
} else {
    console.log("Auth form element not found on this page."); // Log 13
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
        if (error) {
            showCustomModal('Logout Error', error.message, false);
        } else {
            showCustomModal('Logged Out', 'You have been successfully logged out.');
            setTimeout(() => {
                window.location.href = '../index.html'; 
            }, 2000);
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
                case 'price_asc':
                    query = query.order('price', { ascending: true });
                    break;
                case 'price_desc':
                    query = query.order('price', { ascending: false });
                    break;
                default:
                    // No specific sorting
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

        ebookList.innerHTML = ''; // Clear loading message or previous content
        allGenres.clear(); // Clear genres before repopulating

        if (ebooks.length === 0) {
            ebookList.innerHTML = '<p>No eBooks found.</p>';
            return;
        }

        ebooks.forEach(ebook => {
            const ebookCard = document.createElement('div');
            ebookCard.classList.add('ebook-card');
            ebookCard.innerHTML = `
                <h3>${ebook.title}</h3>
                <p><strong>Author:</strong> ${ebook.author}</p>
                <p><strong>Genre:</strong> ${ebook.genre}</p>
                <p><strong>Price:</strong> $${ebook.price ? ebook.price.toFixed(2) : 'N/A'}</p>
                <button class="view-details-btn" data-id="${ebook.id}">View Details</button>
            `;
            ebookList.appendChild(ebookCard);
            allGenres.add(ebook.genre);
        });

        // Add event listeners for "View Details" buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const ebookId = e.target.dataset.id;
                fetchEbookDetails(ebookId);
            });
        });

        populateGenreFilter();

    } catch (error) {
        console.error("Error fetching ebooks:", error);
        if (ebookList) {
            ebookList.innerHTML = '<p style="color: red;">Error loading eBooks. Please try again.</p>';
        }
    }
}

async function fetchEbookDetails(ebookId) {
    try {
        currentEbookId = ebookId;
        const { data: ebook, error } = await supabase
            .from('ebook')
            .select('*')
            .eq('id', ebookId)
            .single();

        if (error) throw error;
        if (!ebook) {
            ebookDetailContent.innerHTML = '<p>Ebook not found.</p>';
            showSection(ebookDetailSection);
            return;
        }

        ebookDetailContent.innerHTML = `
            <h2>${ebook.title}</h2>
            <p><strong>Author:</strong> ${ebook.author}</p>
            <p><strong>Genre:</strong> ${ebook.genre}</p>
            <p><strong>Pages:</strong> ${ebook.pages || 'N/A'}</p>
            <p><strong>Words:</strong> ${ebook.words || 'N/A'}</p>
            <p><strong>Publisher:</strong> ${ebook.publisher || 'N/A'}</p>
            <p><strong>Publication Date:</strong> ${ebook.month || 'N/A'} ${ebook.year || 'N/A'}</p>
            <p><strong>Price:</strong> $${ebook.price ? ebook.price.toFixed(2) : 'N/A'}</p>
            <p><strong>Synopsis:</strong> ${ebook.synopsis || 'No synopsis available.'}</p>
            ${ebook.file_url ? `<a href="${ebook.file_url}" target="_blank" class="download-btn">Download Ebook</a>` : '<p>No file available for download.</p>'}
        `;
        showSection(ebookDetailSection);
        fetchReviews(ebookId);
    } catch (error) {
        console.error("Error fetching ebook details:", error);
        ebookDetailContent.innerHTML = '<p style="color: red;">Error loading ebook details. Please try again.</p>';
    }
}

async function fetchReviews(ebookId) {
    if (!reviewsList || !noReviewsMessage) return;

    try {
        const { data: reviews, error } = await supabase
            .from('reviews')
            .select(`
                *,
                profiles (
                    username
                )
            `)
            .eq('ebook_id', ebookId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        reviewsList.innerHTML = ''; // Clear existing reviews

        if (reviews.length === 0) {
            noReviewsMessage.classList.remove('hidden');
        } else {
            noReviewsMessage.classList.add('hidden');
            reviews.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.classList.add('review-item');
                const reviewerName = review.profiles ? review.profiles.username : 'Anonymous';
                reviewItem.innerHTML = `
                    <p><strong>${reviewerName}</strong> (${new Date(review.created_at).toLocaleDateString()}):</p>
                    <p>${review.review_text}</p>
                `;
                reviewsList.appendChild(reviewItem);
            });
        }
    } catch (error) {
        console.error("Error fetching reviews:", error);
        reviewsList.innerHTML = '<p style="color: red;">Error loading reviews.</p>';
        noReviewsMessage.classList.add('hidden');
    }
}

async function addReview(ebookId, reviewText) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        showCustomModal('Authentication Required', 'You must be logged in to add a review.', false);
        return;
    }

    try {
        const { error } = await supabase
            .from('reviews')
            .insert({
                ebook_id: ebookId,
                user_id: user.id,
                review_text: reviewText
            });

        if (error) throw error;
        showCustomModal('Review Added', 'Your review has been successfully added!');
        fetchReviews(ebookId); // Refresh reviews
        document.getElementById('review-text').value = ''; // Clear the textarea
    } catch (error) {
        console.error("Error adding review:", error);
        showCustomModal('Error Adding Review', error.message, false);
    }
}

async function uploadEbook(event) {
    event.preventDefault();

    const title = document.getElementById('ebook-title').value;
    const author = document.getElementById('ebook-author').value;
    const pages = document.getElementById('ebook-pages').value;
    const words = document.getElementById('ebook-words').value;
    const price = document.getElementById('ebook-price').value;
    const genre = document.getElementById('ebook-genre').value;
    const month = document.getElementById('ebook-month').value;
    const year = document.getElementById('ebook-year').value;
    const publisher = document.getElementById('ebook-publisher').value;
    const synopsis = document.getElementById('ebook-synopsis').value;
    const ebookFile = document.getElementById('ebook-file').files[0];

    if (!title || !author || !genre || !price) {
        showCustomModal('Missing Information', 'Please fill in all required fields (Title, Author, Genre, Price).', false);
        return;
    }

    let fileUrl = null;
    if (ebookFile) {
        const filePath = `${Date.now()}-${ebookFile.name}`;
        const { error: uploadError } = await supabase.storage
            .from('ebook-files')
            .upload(filePath, ebookFile);

        if (uploadError) {
            showCustomModal('Upload Error', 'Error uploading file: ' + uploadError.message, false);
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
        showCustomModal('Upload Error', 'Error inserting ebook data: ' + insertError.message, false);
    } else {
        showCustomModal('Upload Successful', 'Ebook uploaded successfully!');
        ebookUploadForm.reset(); // Clear the form
        fetchEbooks(); // Refresh the list of ebooks
        showSection(ebookListSection); // Go back to the ebook list
    }
}


function populateGenreFilter() {
    if (filterGenreSelect) {
        filterGenreSelect.innerHTML = '<option value="">All Genres</option>'; // Default option
        allGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            filterGenreSelect.appendChild(option);
        });
    }
}

// Event Listeners for main app functionality (primarily for index.html)
if (ebookUploadForm) {
    ebookUploadForm.addEventListener('submit', uploadEbook);
}

if (backToListBtn) {
    backToListBtn.addEventListener('click', () => {
        showSection(ebookListSection);
        fetchEbooks(); // Refresh the list in case anything changed
    });
}

if (submitReviewBtn) {
    submitReviewBtn.addEventListener('click', () => {
        const reviewText = document.getElementById('review-text').value;
        if (reviewText && currentEbookId) {
            addReview(currentEbookId, reviewText);
        } else {
            showCustomModal('Empty Review', 'Please write something before submitting your review.', false);
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('input', fetchEbooks);
}

if (sortSelect) {
    sortSelect.addEventListener('change', fetchEbooks);
}

if (filterGenreSelect) {
    filterGenreSelect.addEventListener('change', fetchEbooks);
}

// Initial load logic
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the main application page (index.html)
    if (document.getElementById('ebook-list-section')) {
        updateUI();
        fetchEbooks();
    } else if (document.getElementById('auth-page')) {
        // We are on login.html or signup.html, no initial UI update needed here
        // The form submission listener handles the redirects
        console.log("On auth-page. Auth form setup should be handled.");
    }
});
