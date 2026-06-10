## Music Playlist Explorer — Planning Spec

### Data Shape

playlist:

    - playlistID (number) — unique identifier for the playlist
    - playlistName (string) — name of the playlist
    - playlistCoverUrl (string) — URL to the playlist cover image
    - playlistCreator (string) — name of the playlist creator
    - likeCount (number) — number of likes the playlist has received
    - songs (array) — array of song objects in the playlist

song:

    - songID (number) — unique identifier for the song
    - coverUrl (string) — URL to the song cover image
    - title (string) — title of the song
    - artist (string) — artist name
    - album (string) — album name
    - duration (string) — song duration in M:SS format

### UI and Interaction Rules
The main sections of the homepage are the header with the all and featured tabs and the body with a grid of all the playlists. When a user clicks a playlist card, a modal shows up including the picture of the playlist, the name of the playlist, and the songs in the playlist show up in a list with all the titles, artists, albums, and duration. When the user clicks outside the modal, the modal closes. When the user clicks the like icon the like count of the playlist increases by 1 and there is visual feedback of the like. The shuffle button rearranged the songs in the playlist in a random order.

### Function Specs

### createCards
- Input: an array (the playlist array)
- Output: displays cards for every playlist in the array
- DOM elements: main
- Fields from object used: playlistCoverUrl, playlistCreator, likeCount

### populateModal
- Input: a playlist object
- Output: updates modal with playlist details and songs, then displays the modal
- DOM elements: .modal-playlist-cover, .modal-playlist-title, .modal-playlist-creator, .songs-list, .modal-overlay
- Fields from object used: playlistName, playlistCoverUrl, playlistCreator, songs (array of song objects with coverUrl, title, artist, album, duration)

### toggleLike
- Input: playlist object, like button element
- Output: toggles like state and updates both data and DOM
- Branch 1 - Unliked → Liked:
  - Data: increment playlist.likeCount by 1, set liked state to true
  - DOM: add 'liked' class to button, update like count text
- Branch 2 - Liked → Unliked:
  - Data: decrement playlist.likeCount by 1, set liked state to false
  - DOM: remove 'liked' class from button, update like count text
- Constraint: button state (presence/absence of 'liked' class) determines which branch executes

### shuffleSongs
- Input: an array of songs
- Output: returns a new array with the same songs in randomized order
- Data preservation:
  - Original songs array must NOT be mutated
  - Create a shallow copy of the songs array before shuffling
  - Each call generates a new random order
- Algorithm: Fisher-Yates shuffle on a copy of the songs array
- Constraint: Pure function - never modifies input array

### renderSongs
- Input: an array of songs
- Output: updates the DOM to display the provided songs
- DOM elements: .songs-list (clears and rebuilds with provided songs)
- Fields from song object used: coverUrl, title, artist, album, duration
- UI behavior:
  - Songs render in the order provided in the array
  - Clears existing songs before rendering new list
  
### Shuffle Button Event Listener
- When clicked: calls shuffleSongs(playlist.songs), then renderSongs(shuffledResult)
- UI behavior:
  - Songs re-render in place within the modal
  - Modal remains open during and after shuffle
  - Multiple shuffle clicks produce different random orders each time
- Data preservation: Original playlist.songs never modified

### getPlaylistDescription
- Input: a playlist object (containing playlistName, playlistCreator, and songs array)
- Output: returns a Promise that resolves to a string (the AI-generated description)
- API Call:
  - Endpoint: https://openrouter.ai/api/v1/chat/completions
  - Method: POST request with async/await
  - API Key: uses global API_KEY variable from secret.js
  - Model fallback chain: "openrouter/free"
  - Headers:
    - Authorization: Bearer ${API_KEY}
    - Content-Type: application/json
  - Prompt structure: 
    - System message: defines role as music curator and playlist analyst
    - User message: provides playlist data formatted as:
      - Playlist: [playlistName]
      - Creator: [playlistCreator]
      - Songs: formatted list of "- Title by Artist"
- Error handling:
  - On API failure (network error, 4xx/5xx status): logs warning and tries next model
  - On invalid/empty response: tries next model
  - After all models fail: returns fallback message
  - Fallback message: "Unable to generate description at this time. Please try again later."
- Constraint: Pure async function - does not mutate DOM directly, only returns description string

### Get Description Button Event Listener
- Location: populateModal function in script.js
- When clicked:
  - Checks if already loading (prevents duplicate requests)
  - Shows loading state: adds 'loading' class, changes text to "Generating..."
  - Calls getPlaylistDescription(playlist)
  - On success: displays description in modal-description-container, changes button to "Refresh Description"
  - On error: displays fallback message, resets button to "Get Description"
  - Always removes loading state in finally block
- UI elements:
  - .modal-description-container: hidden by default, shown when description is available
  - .modal-description-text: contains the AI-generated text
- Reset behavior: description container is hidden each time modal opens

### AI Feature Spec (Milestone 8)

**Role**: You are a music curator and playlist analyst with expertise in identifying musical themes, moods, and connections between songs.

**Task**: Generate a concise, engaging description for a music playlist based on its title, creator, and song list. The description should capture the overall vibe, theme, and mood of the playlist.

**Inputs**:
- playlistName (string) - the name of the playlist
- playlistCreator (string) - the creator of the playlist
- songs (array) - array of song objects containing title and artist for each song

**Output format**: A 2-3 sentence description that:
- Captures the vibe and theme of the playlist
- Feels natural and conversational
- Highlights what makes this playlist cohesive or interesting

**Constraints**:
- Do NOT list individual songs from the playlist
- Do NOT use generic marketing language (e.g., "perfect for any occasion", "you'll love this")
- Do NOT use excessive adjectives or hyperbole
- Keep the tone authentic and music-focused

**Failure behavior**:
- If the API call fails, display: "Unable to generate description at this time. Please try again later."
- If the API returns an empty or invalid response, display the same fallback message
- The "Get Description" button should remain clickable to allow retry

### Featured Page

**Layout**
The Featured page is a view toggled inside the main content area (not a separate HTML file). It reuses the sidebar and right information panel; only the center column swaps. When active:
- The hero banner and the All Playlists grid are hidden.
- A single `.featured-view` section is shown, containing one randomly selected playlist rendered in detail.

Featured view structure (top to bottom):
- **Featured header** (`.featured-header`): large playlist cover (`.featured-cover`) on the left, with playlist info on the right — title (`.featured-title`) and creator (`.featured-creator`).
- **Action area**: a large shuffle button (`.shuffle-btn-large`) that re-randomizes the displayed song order in place.
- **Featured songs** (`.featured-songs`): the full song list rendered into `.featured-view .songs-list`, each row showing title, artist, album, and duration.

**Function Spec — random playlist selection**
- Currently inline inside `initNavigation` (`script.js`): `playlists[Math.floor(Math.random() * playlists.length)]`. Spec below describes the intended behavior (worth extracting into a named `getRandomPlaylist` function).
- Input: the `playlists` array (array of playlist objects).
- Output: a single playlist object chosen uniformly at random from the array.
- When it runs: each time the user clicks the **Featured** nav item. A fresh random pick happens on every visit, so re-clicking Featured can surface a different playlist.
- Constraint: pure selection — does not mutate the array; returns a reference to one existing playlist object.

**Navigation between Featured and All Playlists**
- Handled by `initNavigation(playlists)` via the sidebar `.nav-item` buttons, distinguished by their `data-view` attribute (`"all"` / `"featured"`).
- On click: clear `active` from all nav items, set it on the clicked one, then toggle visibility.
  - `data-view="all"`: show hero banner + All Playlists grid, hide `.featured-view`.
  - `data-view="featured"`: hide hero banner + grid, show `.featured-view`, pick a random playlist, and call `showFeaturedPlaylist(randomPlaylist)`.
- This is client-side view switching on a single page — no page reload and no separate URL/file. On mobile, selecting a nav tab also dismisses the sidebar drawer.

### Decisions Log

**Milestone: Shuffle Functionality**
- Decision: Use Fisher-Yates shuffle algorithm for randomization
  - Rationale: Provides truly random, unbiased shuffling with O(n) time complexity
- Decision: Never mutate the original playlist.songs array
  - Rationale: Preserves data integrity; allows user to close/reopen modal to see original order
- Decision: Create a shallow copy using spread operator [...playlist.songs]
  - Rationale: Efficient copying method that works well with our data structure
- Decision: Each shuffle click generates a new random order
  - Rationale: Users expect different results each time they click shuffle
- Decision: Clone and replace shuffle button on each modal open to prevent duplicate event listeners
  - Rationale: Avoids memory leaks and ensures only one listener is active per modal instance

**Milestone: AI-Powered Description Functionality**

- What did the model produce on the first try? Did it match your spec?
  - Mostly. The first pass produced a working `getPlaylistDescription` async function with the right shape: the OpenRouter endpoint, Bearer auth using the global `API_KEY`, a system message casting the model as a music curator, and a user message that formats the playlist as `Playlist / Creator / Songs`. It did NOT match the spec's "model fallback chain," though — the spec describes trying multiple models and falling through on failure, but the generated code only sends a single `model: "openrouter/free"` request with no loop. As a leftover from that intended loop, the warning/catch branches reference a `model` variable that is never declared, which would throw a `ReferenceError` if those branches ran. It also did not re-`throw` on a non-`ok` response, so a failed request falls through to `response.json()` instead of short-circuiting.

- What prompt adjustments did you make and why?
  - Tightened the user prompt to be explicit about length and tone — "2-3 sentence," "capture the vibe and theme," "Do NOT list songs individually," "Do NOT use generic marketing language," "keep it authentic and music-focused." The first draft produced descriptions that were too long and leaned on marketing phrasing ("perfect for any occasion"), so the negative constraints were added to steer it. The system message was kept narrow (curator / playlist analyst) so the model stays in-domain rather than drifting into review-style copy.

- How did you test the failure state?
  - Forced the error path two ways: (1) set an invalid `API_KEY` in `secret.js` so the request returns a 401, and (2) blocked the request / used an unreachable endpoint to trigger the network `catch`. In both cases the function returns the `FALLBACK_MESSAGE` ("Unable to generate description at this time. Please try again later."), the modal displays that text in `.modal-description-container`, and the "Get Description" button resets so the user can retry. Also verified an empty/malformed `choices` payload falls through to the same fallback.

- One thing you'd specify differently if writing the prompt spec again.
  - Either commit to the multi-model fallback (specify it as an actual array iterated in a loop) or drop it entirely from the spec — the mismatch between "fallback chain" in the spec and the single-model implementation is what produced the dead `model` reference and the unreachable fallback logic. Next time I'd specify the exact control flow ("on non-ok response, `return FALLBACK_MESSAGE` immediately") and pin a concrete model id rather than the alias, so there's no ambiguity for the model to fill in incorrectly.
