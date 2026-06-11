// createCards
// - Input: an array (the playlist array)
// - Output: displays cards for every playlist in the array
// - DOM element: main
// - Fields from object used: playlistCoverUrl, playlistCreator, likeCount
function createCards(playlists) {
    const playlistCardsContainer = document.querySelector('.playlist-cards');

    if (!playlists || playlists.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No playlists found';
        message.style.textAlign = 'center';
        message.style.color = '#7f8c8d';
        message.style.fontSize = '1.2rem';
        message.style.marginTop = '2rem';
        playlistCardsContainer.appendChild(message);
        return;
    }

    for (let playlist of playlists) {
        const card = document.createElement('article');
        card.className = 'playlist-card';

        const img = document.createElement('img');
        img.src = playlist.playlistCoverUrl;
        img.alt = `${playlist.playlistName} playlist cover`;
        img.className = 'playlist-cover';

        const playlistInfo = document.createElement('div');
        playlistInfo.className = 'playlist-info';

        const title = document.createElement('h2');
        title.className = 'playlist-title';
        title.textContent = playlist.playlistName;

        const creator = document.createElement('p');
        creator.className = 'playlist-creator';
        creator.textContent = `Created by ${playlist.playlistCreator}`;

        const playlistLikes = document.createElement('div');
        playlistLikes.className = 'playlist-likes';

        const likeBtn = document.createElement('button');
        likeBtn.className = 'like-btn';
        likeBtn.setAttribute('aria-label', 'Like playlist');

        likeBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleLike(playlist, likeBtn);
        });

        const likeIcon = document.createElement('span');
        likeIcon.className = 'like-icon';
        likeIcon.textContent = '♥';

        const likeCount = document.createElement('span');
        likeCount.className = 'like-count';
        likeCount.textContent = playlist.likeCount;

        likeBtn.appendChild(likeIcon);
        playlistLikes.appendChild(likeBtn);
        playlistLikes.appendChild(likeCount);

        playlistInfo.appendChild(title);
        playlistInfo.appendChild(creator);
        playlistInfo.appendChild(playlistLikes);

        card.appendChild(img);
        card.appendChild(playlistInfo);

        playlistCardsContainer.appendChild(card);
    }
}

// populateModal
// - Input: a playlist object
// - Output: updates modal with playlist details and songs, then displays the modal
// - DOM elements: .modal-playlist-cover, .modal-playlist-title, .modal-playlist-creator, .songs-list, .modal-overlay
// - Fields from object used: playlistName, playlistCoverUrl, playlistCreator, songs (array of song objects with coverUrl, title, artist, album, duration)
function populateModal(playlist) {
    const modalCover = document.querySelector('.modal-playlist-cover');
    const modalTitle = document.querySelector('.modal-playlist-title');
    const modalCreator = document.querySelector('.modal-playlist-creator');
    const songsList = document.querySelector('.modal-songs .songs-list');
    const modalOverlay = document.querySelector('.modal-overlay');
    const shuffleBtn = document.querySelector('.shuffle-btn');

    modalCover.src = playlist.playlistCoverUrl;
    modalCover.alt = `${playlist.playlistName} playlist cover`;

    modalTitle.textContent = playlist.playlistName;

    modalCreator.textContent = `Created by ${playlist.playlistCreator}`;

    songsList.innerHTML = '';

    for (let song of playlist.songs) {
        const songItem = document.createElement('li');
        songItem.className = 'song-item';

        const songCover = document.createElement('img');
        songCover.src = song.coverUrl;
        songCover.alt = `${song.title} cover`;
        songCover.className = 'song-cover';

        const songDetails = document.createElement('div');
        songDetails.className = 'song-details';

        const songTitle = document.createElement('div');
        songTitle.className = 'song-title';
        songTitle.textContent = song.title;

        const songArtist = document.createElement('div');
        songArtist.className = 'song-artist';
        songArtist.textContent = song.artist;

        const songAlbum = document.createElement('div');
        songAlbum.className = 'song-album';
        songAlbum.textContent = song.album;

        const songDuration = document.createElement('time');
        songDuration.className = 'song-duration';
        songDuration.textContent = song.duration;

        songDetails.appendChild(songTitle);
        songDetails.appendChild(songArtist);
        songDetails.appendChild(songAlbum);

        songItem.appendChild(songCover);
        songItem.appendChild(songDetails);
        songItem.appendChild(songDuration);

        songsList.appendChild(songItem);
    }

    // Remove any existing shuffle event listeners to prevent duplicates
    const newShuffleBtn = shuffleBtn.cloneNode(true);
    shuffleBtn.parentNode.replaceChild(newShuffleBtn, shuffleBtn);

    // Add event listener for shuffle button
    newShuffleBtn.addEventListener('click', function() {
        const shuffledSongs = shuffleSongs(playlist.songs);
        renderSongs(shuffledSongs);
    });

    // Close button handler
    const closeBtn = document.querySelector('.close-btn');
    const newCloseBtn = closeBtn.cloneNode(true);
    closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);

    newCloseBtn.addEventListener('click', function() {
        modalOverlay.classList.remove('active');
    });

    // Get Description button
    const getDescriptionBtn = document.querySelector('.get-description-btn');
    const newGetDescriptionBtn = getDescriptionBtn.cloneNode(true);
    getDescriptionBtn.parentNode.replaceChild(newGetDescriptionBtn, getDescriptionBtn);

    // Reset button to default state for this playlist
    newGetDescriptionBtn.textContent = 'Get Description';
    newGetDescriptionBtn.classList.remove('loading');

    newGetDescriptionBtn.addEventListener('click', async function() {
        // Prevent multiple simultaneous requests
        if (this.classList.contains('loading')) return;

        // Get DOM references
        const descriptionContainer = document.querySelector('.modal-description-container');
        const descriptionText = document.querySelector('.modal-description-text');

        // Show loading state
        this.classList.add('loading');
        this.textContent = 'Generating...';

        try {
            // Call API
            const description = await getPlaylistDescription(playlist);

            // Display result
            descriptionText.textContent = description;
            descriptionContainer.style.display = 'block';

            // Update button
            this.textContent = 'Refresh Description';

        } catch (error) {
            console.error('Error getting playlist description:', error);

            // Show error in the description area
            descriptionText.textContent = 'Unable to generate description at this time. Please try again later.';
            descriptionContainer.style.display = 'block';

            // Reset button
            this.textContent = 'Get Description';
        } finally {
            this.classList.remove('loading');
        }
    });

    // Reset description state when modal opens
    const descriptionContainer = document.querySelector('.modal-description-container');
    const descriptionText = document.querySelector('.modal-description-text');
    descriptionText.textContent = '';
    descriptionContainer.style.display = 'none';

    modalOverlay.classList.add('active');
}

// shuffleSongs
// - Input: an array of songs
// - Output: a new array with the same songs in randomized order
// - Data preservation: creates a copy of songs array before shuffling, never mutates original
// - Algorithm: Fisher-Yates shuffle for random ordering
function shuffleSongs(songs) {
    // Create a shallow copy of the songs array to avoid mutating original data
    const shuffledSongs = [...songs];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffledSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
    }

    return shuffledSongs;
}

// renderSongs
// - Input: an array of songs, optional containerSelector for target DOM element
// - Output: updates the song list in the specified container DOM
// - DOM elements: containerSelector (defaults to .modal-songs .songs-list) (clears and rebuilds with provided songs)
function renderSongs(songs, containerSelector = '.modal-songs .songs-list') {
    const songsList = document.querySelector(containerSelector);

    // Clear existing songs
    songsList.innerHTML = '';

    // Render songs
    for (let song of songs) {
        const songItem = document.createElement('li');
        songItem.className = 'song-item';

        const songCover = document.createElement('img');
        songCover.src = song.coverUrl;
        songCover.alt = `${song.title} cover`;
        songCover.className = 'song-cover';

        const songDetails = document.createElement('div');
        songDetails.className = 'song-details';

        const songTitle = document.createElement('div');
        songTitle.className = 'song-title';
        songTitle.textContent = song.title;

        const songArtist = document.createElement('div');
        songArtist.className = 'song-artist';
        songArtist.textContent = song.artist;

        const songAlbum = document.createElement('div');
        songAlbum.className = 'song-album';
        songAlbum.textContent = song.album;

        const songDuration = document.createElement('time');
        songDuration.className = 'song-duration';
        songDuration.textContent = song.duration;

        songDetails.appendChild(songTitle);
        songDetails.appendChild(songArtist);
        songDetails.appendChild(songAlbum);

        songItem.appendChild(songCover);
        songItem.appendChild(songDetails);
        songItem.appendChild(songDuration);

        songsList.appendChild(songItem);
    }
}

// toggleLike
// - Input: playlist object, like button element
// - Output: toggles like state and updates both data and DOM
// - Branch 1 - Unliked → Liked:
//   - Data: increment playlist.likeCount by 1, set liked state to true
//   - DOM: add 'liked' class to button, update like count text
// - Branch 2 - Liked → Unliked:
//   - Data: decrement playlist.likeCount by 1, set liked state to false
//   - DOM: remove 'liked' class from button, update like count text
// - Constraint: button state (presence/absence of 'liked' class) determines which branch executes
function toggleLike(playlist, likeButton) {
    const likeCountElement = likeButton.parentElement.querySelector('.like-count');

    if (likeButton.classList.contains('liked')) {
        // Branch 2: Liked → Unliked
        playlist.likeCount--;
        likeButton.classList.remove('liked');
    } else {
        // Branch 1: Unliked → Liked
        playlist.likeCount++;
        likeButton.classList.add('liked');
    }

    likeCountElement.textContent = playlist.likeCount;
}

// Event listener to close modal when clicking on overlay
document.querySelector('.modal-overlay').addEventListener('click', function(event) {
    if (event.target === this) {
        this.classList.remove('active');
    }
});

// Event listeners for playlist cards to open modal
// Note: This should be called after playlist data is loaded and cards are created
function addPlaylistCardListeners(playlists) {
    const playlistCards = document.querySelectorAll('.playlist-card');

    playlistCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            populateModal(playlists[index]);
        });
    });
}

// initSearch
// - Input: the full playlist array
// - Output: shows a live dropdown of matching playlists below the search bar
// - Matches against playlistName and playlistCreator (case-insensitive)
// - Each result shows the cover, playlist name, and author; clicking opens the modal
// - DOM elements: .search-input, .search-results
function initSearch(playlists) {
    const searchInput = document.querySelector('.search-input');
    const resultsList = document.querySelector('.search-results');

    function closeResults() {
        resultsList.innerHTML = '';
        resultsList.classList.remove('active');
    }

    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();

        // Empty query: hide the dropdown
        if (query === '') {
            closeResults();
            return;
        }

        const matches = playlists.filter(playlist =>
            playlist.playlistName.toLowerCase().includes(query) ||
            playlist.playlistCreator.toLowerCase().includes(query)
        );

        // Rebuild the dropdown
        resultsList.innerHTML = '';

        if (matches.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'search-result-empty';
            empty.textContent = 'No playlists found';
            resultsList.appendChild(empty);
            resultsList.classList.add('active');
            return;
        }

        for (let playlist of matches) {
            const item = document.createElement('li');
            item.className = 'search-result-item';
            item.setAttribute('role', 'option');

            const cover = document.createElement('img');
            cover.src = playlist.playlistCoverUrl;
            cover.alt = `${playlist.playlistName} cover`;
            cover.className = 'search-result-cover';

            const info = document.createElement('div');
            info.className = 'search-result-info';

            const name = document.createElement('div');
            name.className = 'search-result-name';
            name.textContent = playlist.playlistName;

            const author = document.createElement('div');
            author.className = 'search-result-author';
            author.textContent = playlist.playlistCreator;

            info.appendChild(name);
            info.appendChild(author);

            item.appendChild(cover);
            item.appendChild(info);

            // Clicking a result opens that playlist and clears the search
            item.addEventListener('click', function() {
                populateModal(playlist);
                searchInput.value = '';
                closeResults();
            });

            resultsList.appendChild(item);
        }

        resultsList.classList.add('active');
    });

    // Close the dropdown when clicking outside the search container
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.search-container')) {
            closeResults();
        }
    });
}

// Navigation between All Playlists and Featured views
function initNavigation(playlists) {
    const navItems = document.querySelectorAll('.nav-item');
    const playlistSection = document.querySelector('.playlist-section:not(.featured-view)');
    const featuredView = document.querySelector('.featured-view');
    const heroBanner = document.querySelector('.hero-banner');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const view = this.dataset.view;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Toggle views
            if (view === 'all') {
                heroBanner.style.display = 'flex';
                playlistSection.style.display = 'block';
                featuredView.style.display = 'none';
            } else if (view === 'featured') {
                heroBanner.style.display = 'none';
                playlistSection.style.display = 'none';
                featuredView.style.display = 'block';
                featuredView.classList.add('active');

                // Load random featured playlist
                const randomPlaylist = playlists[Math.floor(Math.random() * playlists.length)];
                showFeaturedPlaylist(randomPlaylist);
            }
        });
    });
}

// Show featured playlist in the featured view
function showFeaturedPlaylist(playlist) {
    const featuredCover = document.querySelector('.featured-cover');
    const featuredTitle = document.querySelector('.featured-title');
    const featuredCreator = document.querySelector('.featured-creator');
    const featuredSongsList = document.querySelector('.featured-view .songs-list');
    const shuffleBtnLarge = document.querySelector('.shuffle-btn-large');

    featuredCover.src = playlist.playlistCoverUrl;
    featuredCover.alt = `${playlist.playlistName} playlist cover`;

    featuredTitle.textContent = playlist.playlistName;
    featuredCreator.textContent = `Created by ${playlist.playlistCreator}`;

    // Render songs
    featuredSongsList.innerHTML = '';
    playlist.songs.forEach(song => {
        const songItem = document.createElement('li');
        songItem.className = 'song-item';

        const songCover = document.createElement('img');
        songCover.src = song.coverUrl;
        songCover.alt = `${song.title} cover`;
        songCover.className = 'song-cover';

        const songDetails = document.createElement('div');
        songDetails.className = 'song-details';

        const songTitle = document.createElement('div');
        songTitle.className = 'song-title';
        songTitle.textContent = song.title;

        const songArtist = document.createElement('div');
        songArtist.className = 'song-artist';
        songArtist.textContent = song.artist;

        const songAlbum = document.createElement('div');
        songAlbum.className = 'song-album';
        songAlbum.textContent = song.album;

        const songDuration = document.createElement('time');
        songDuration.className = 'song-duration';
        songDuration.textContent = song.duration;

        songDetails.appendChild(songTitle);
        songDetails.appendChild(songArtist);
        songDetails.appendChild(songAlbum);

        songItem.appendChild(songCover);
        songItem.appendChild(songDetails);
        songItem.appendChild(songDuration);

        featuredSongsList.appendChild(songItem);
    });

    // Add shuffle handler
    const newShuffleBtn = shuffleBtnLarge.cloneNode(true);
    shuffleBtnLarge.parentNode.replaceChild(newShuffleBtn, shuffleBtnLarge);

    newShuffleBtn.addEventListener('click', function() {
        const shuffled = shuffleSongs(playlist.songs);
        renderSongs(shuffled, '.featured-view .songs-list');
    });
}

// getPlaylistDescription
// - Input: a playlist object (containing playlistName, playlistCreator, and songs array)
// - Output: returns a Promise that resolves to a string (the AI-generated description)
// - API Call: OpenRouter API with fallback between multiple free models
// - Error handling: returns fallback message on failure
async function getPlaylistDescription(playlist) {
    
    const API_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
    const FALLBACK_MESSAGE = "Unable to generate description at this time. Please try again later.";

    // Build the song list for the prompt
    const songsList = playlist.songs.map(s => `- ${s.title} by ${s.artist}`).join('\n');

    const systemPrompt = 'You are a music curator and playlist analyst with expertise in identifying musical themes, moods, and connections between songs.';

    const userPrompt = `Generate a 2-3 sentence description for this playlist. Capture the vibe and theme. Do NOT list songs individually. Do NOT use generic marketing language. Keep it authentic and music-focused.
    
    Playlist: ${playlist.playlistName}
    Creator: ${playlist.playlistCreator}
    Songs: ${songsList}`;

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "openrouter/free",
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ]
            })
        });
    
        if (!response.ok) {
            console.warn(`Model ${model} failed with status ${response.status}, trying next model...`);
        }
    
        const data = await response.json();
    
        // Check if we got a valid response
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            return data.choices[0].message.content.trim();
        }
    
        console.warn(`Model ${model} returned invalid response, trying next model...`);
    } catch (error) {
        console.warn(`Model ${model} encountered error:`, error.message);
        // Continue to next model
        }
    
        // All models failed
        return FALLBACK_MESSAGE;
}

// Play/Pause audio waveform animation
function initAudioControls() {
    const playButton = document.querySelector('.control-play');
    const waveform = document.querySelector('.audio-waveform');
    let isPlaying = true; // Start with animation playing

    playButton.addEventListener('click', function() {
        isPlaying = !isPlaying;

        if (isPlaying) {
            // Playing - remove paused class
            waveform.classList.remove('paused');
            // Update button icon to pause icon
            playButton.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
            `;
        } else {
            // Paused - add paused class
            waveform.classList.add('paused');
            // Update button icon to play icon
            playButton.innerHTML = `
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }
    });
}

// Mobile hamburger menu: toggle the sidebar drawer and backdrop
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const closeBtn = document.querySelector('.sidebar-close');

    function openMenu() {
        sidebar.classList.add('open');
        overlay.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle.addEventListener('click', function() {
        if (sidebar.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Clicking the backdrop closes the drawer
    overlay.addEventListener('click', closeMenu);

    // The close (×) button dismisses the drawer without changing tabs
    closeBtn.addEventListener('click', closeMenu);

    // Selecting a nav tab also dismisses the drawer on mobile
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', closeMenu);
    });
}

// Hero "Browse All" button: smoothly scroll to the playlist grid
function initHeroBrowse() {
    const browseBtn = document.querySelector('.hero-btn');
    const playlistSection = document.querySelector('.playlist-section');

    browseBtn.addEventListener('click', function() {
        playlistSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// Fetch playlist data from data.json and initialize the app
fetch('data/data.json')
    .then(response => response.json())
    .then(playlists => {
        // Clear existing HTML cards and create new ones from data
        document.querySelector('.playlist-cards').innerHTML = '';
        createCards(playlists);

        // Add event listeners to playlist cards for modal
        addPlaylistCardListeners(playlists);

        // Initialize navigation
        initNavigation(playlists);

        // Initialize live search
        initSearch(playlists);

        // Initialize audio controls
        initAudioControls();

        // Initialize mobile menu and hero browse button
        initMobileMenu();
        initHeroBrowse();
    })
    .catch(error => {
        console.error('Error loading playlist data:', error);
    });