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
[Add function specs here as you plan each milestone]

### AI Feature Spec (Milestone 8)
[Leave blank — fill in before Milestone 8]

### Decisions Log
[One entry per milestone where you make spec-informed decisions]
