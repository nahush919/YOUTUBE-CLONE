// Theme functionality
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
html.setAttribute('data-theme', savedTheme);

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// API key and endpoints
const API_KEY = "ENTER YOUR YOUTUBE API";
const VIDEO_HTTP = "https://www.googleapis.com/youtube/v3/videos?";
const CHANNEL_HTTP = "https://www.googleapis.com/youtube/v3/channels?";
const SEARCH_HTTP = "https://www.googleapis.com/youtube/v3/search?";

// Select DOM elements
const videoCardContainer = document.querySelector('.video-container');
const exploreContent = document.querySelector('.explore-content');
const subscriptionsContent = document.querySelector('.subscriptions-content');
const historyContent = document.querySelector('.history-content');

// Fetch trending videos for explore section
const fetchTrendingVideos = (categoryId = '0') => {
    videoCardContainer.innerHTML = ''; // Clear existing videos
    
    fetch(VIDEO_HTTP + new URLSearchParams({
        key: API_KEY,
        part: 'snippet,statistics',
        chart: 'mostPopular',
        maxResults: 50,
        videoCategoryId: categoryId
    }))
    .then(res => res.json())
    .then(data => {
        data.items.forEach(item => {
            getChannelIcon(item);
        });
    })
    .catch(err => console.error("Error fetching trending videos:", err));
};

// Fetch subscribed channels
const fetchSubscriptions = () => {
    
    const popularChannels = [
        'UC_x5XG1OV2P6uZZ5FSM9Ttw', // Google Developers
        'UCVHFbqXqoYvEWM1Ddxl0QDg', // Android Developers
        'UCzoVCacndDCfGDf41P-z0iA'  // YouTube Creators
    ];

    popularChannels.forEach(channelId => {
        fetch(CHANNEL_HTTP + new URLSearchParams({
            key: API_KEY,
            part: 'snippet,statistics',
            id: channelId
        }))
        .then(res => res.json())
        .then(data => {
            const channel = data.items[0];
            const subLink = document.createElement('a');
            subLink.href = `https://youtube.com/channel/${channel.id}`;
            subLink.className = 'sub-link';
            subLink.innerHTML = `
                <img src="${channel.snippet.thumbnails.default.url}" alt="" class="channel-avatar">
                <div class="sub-info">
                    <span class="sub-title">${channel.snippet.title}</span>
                    <span class="sub-text">${parseInt(channel.statistics.subscriberCount).toLocaleString()} subscribers</span>
                    <span class="sub-status ${Math.random() > 0.5 ? 'online' : ''}"></span>
                </div>
            `;
            subscriptionsContent.appendChild(subLink);
        })
        .catch(err => console.error("Error fetching channel:", err));
    });
};

// Fetch watch history
const fetchWatchHistory = () => {
    
    fetch(VIDEO_HTTP + new URLSearchParams({
        key: API_KEY,
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: 3,
        videoCategoryId: '28' // Science & Technology
    }))
    .then(res => res.json())
    .then(data => {
        data.items.forEach((item, index) => {
            const timeAgo = ['2 hours ago', 'yesterday', '2 days ago'][index];
            const historyLink = document.createElement('a');
            historyLink.href = `https://youtube.com/watch?v=${item.id}`;
            historyLink.className = 'sub-link';
            historyLink.innerHTML = `
                <img src="${item.snippet.thumbnails.default.url}" alt="" class="history-thumbnail">
                <div class="sub-info">
                    <span class="sub-title">${item.snippet.title}</span>
                    <span class="sub-text">Watched ${timeAgo}</span>
                </div>
            `;
            historyContent.appendChild(historyLink);
        });
    })
    .catch(err => console.error("Error fetching history:", err));
};

// Initialize all sections
const initializeSidebar = () => {
    fetchTrendingVideos();
    fetchSubscriptions();
    fetchWatchHistory();
};

// Modified to handle explore section clicks
const exploreLink = document.querySelector('.explore-link');
const trendingLink = document.querySelector('.trending-link');
const musicLink = document.querySelector('.music-link');
const gamingLink = document.querySelector('.gaming-link');
const mainContent = document.querySelector('.video-container');
const filtersSection = document.querySelector('.filters');
const allLinks = document.querySelectorAll('.links');

// Function to update active link
const updateActiveLink = (clickedLink) => {
    allLinks.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
};

// Handle explore link click
exploreLink.addEventListener('click', (e) => {
    e.preventDefault();
    updateActiveLink(exploreLink);
    filtersSection.style.display = 'none';
    mainContent.innerHTML = '';
});

// Handle trending link click
trendingLink.addEventListener('click', (e) => {
    e.preventDefault();
    updateActiveLink(exploreLink);
    filtersSection.style.display = 'flex';
    mainContent.innerHTML = '';
    fetchTrendingVideos();
});

// Handle music link click
musicLink.addEventListener('click', (e) => {
    e.preventDefault();
    updateActiveLink(exploreLink);
    filtersSection.style.display = 'flex';
    mainContent.innerHTML = '';
    // Set Music filter as active
    document.querySelectorAll('.filter-options').forEach(button => {
        if(button.textContent === 'Music') {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    fetchTrendingVideos('10'); // 10 is the category ID for Music
});

// Handle gaming link click
gamingLink.addEventListener('click', (e) => {
    e.preventDefault();
    updateActiveLink(exploreLink);
    filtersSection.style.display = 'flex';
    mainContent.innerHTML = '';
    // Set Gaming filter as active
    document.querySelectorAll('.filter-options').forEach(button => {
        if(button.textContent === 'Gaming') {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    fetchTrendingVideos('20'); // 20 is the category ID for Gaming
});

// Modify home link to show regular content
const homeLink = document.querySelector('.links.active');
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    updateActiveLink(homeLink);
    filtersSection.style.display = 'none';
    mainContent.innerHTML = '';
    fetchHomePageVideos();
});

// Function to fetch regular videos for home page
const fetchHomePageVideos = () => {
    fetch(VIDEO_HTTP + new URLSearchParams({
        key: API_KEY,
        part: 'snippet',
        chart: 'mostPopular',
        maxResults: 50,
        regionCode: 'US'
    }))
    .then(res => res.json())
    .then(data => {
        data.items.forEach(item => {
            getChannelIcon(item);
        });
    })
    .catch(err => console.error("Error fetching videos:", err));
};

// Initialize the page with home content
document.addEventListener('DOMContentLoaded', () => {
    filtersSection.style.display = 'none';
    fetchHomePageVideos();
    initializeSidebar();
});

// Existing video container code
fetch(VIDEO_HTTP + new URLSearchParams({
    key: API_KEY,
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 100,
    regionCode: 'IN'
}))
.then(res => res.json())
.then(data => {
    data.items.forEach(item => {
        getChannelIcon(item);
    });
})
.catch(err => console.error("Error fetching videos:", err));

// Existing channel icon fetching code
const getChannelIcon = (videoData) => {
    fetch(CHANNEL_HTTP + new URLSearchParams({
        key: API_KEY,
        part: 'snippet',
        id: videoData.snippet.channelId
    }))
    .then(res => res.json())
    .then(channelData => {
        videoData.channelThumbnail = channelData.items[0].snippet.thumbnails.default.url;
        makeVideoCard(videoData);
    })
    .catch(err => console.error("Error fetching channel icon:", err));
};

// Function to generate random view count string
const getRandomViewCount = () => {
    const formats = [
        () => Math.floor(Math.random() * 900 + 100) + 'K', // 100K-999K
        () => (Math.random() * 9 + 1).toFixed(1) + 'M',    // 1.0M-9.9M
        () => Math.floor(Math.random() * 90 + 10) + 'K',   // 10K-99K
        () => Math.floor(Math.random() * 900 + 100) + 'K'  // 100K-999K
    ];
    return formats[Math.floor(Math.random() * formats.length)]();
};

// Existing video card creation code
const makeVideoCard = (data) => {
    const viewCount = getRandomViewCount();
    const publishedAt = new Date(data.snippet.publishedAt).toLocaleDateString();
    
    videoCardContainer.innerHTML += `
        <div class="video" data-video-id="${data.id}">
            <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="${data.snippet.title}">
            <div class="content">
                <img src="${data.channelThumbnail}" class="channel-icon" alt="${data.snippet.channelTitle}">
                <div class="info">
                    <h4 class="title">${data.snippet.title}</h4>
                    <p class="channel-name">${data.snippet.channelTitle}</p>
                    <p class="video-stats">${viewCount} views • ${publishedAt}</p>
                </div>
            </div>
        </div>
    `;
};

// Add video player functionality
const videoPlayerContainer = document.querySelector('.video-player-container');
const videoPlayer = document.getElementById('video-player');

// Handle video card clicks
document.addEventListener('click', (e) => {
    const videoCard = e.target.closest('.video');
    if (videoCard) {
        const videoId = videoCard.dataset.videoId;
        videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        videoPlayerContainer.style.display = 'flex';
    }
});

// Handle video player close
videoPlayerContainer.addEventListener('click', (e) => {
    if (e.target === videoPlayerContainer || e.target === videoPlayerContainer.querySelector('::before')) {
        videoPlayer.src = '';
        videoPlayerContainer.style.display = 'none';
    }
});

// Search functionality
const searchInput = document.querySelector('.search-bar');
const searchBtn = document.querySelector('.search-btn');

// Function to fetch search results
const fetchSearchResults = (query) => {
    videoCardContainer.innerHTML = ''; // Clear existing videos
    
    fetch(SEARCH_HTTP + new URLSearchParams({
        key: API_KEY,
        part: 'snippet',
        maxResults: 50,
        q: query,
        type: 'video'
    }))
    .then(res => res.json())
    .then(data => {
        data.items.forEach(item => {
            // Get video details for each search result
            fetch(VIDEO_HTTP + new URLSearchParams({
                key: API_KEY,
                part: 'snippet,statistics',
                id: item.id.videoId
            }))
            .then(res => res.json())
            .then(videoData => {
                getChannelIcon(videoData.items[0]);
            })
            .catch(err => console.error("Error fetching video details:", err));
        });
    })
    .catch(err => console.error("Error fetching search results:", err));
};

// Handle search button click
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        fetchSearchResults(query);
    }
});

// Handle Enter key in search input
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            fetchSearchResults(query);
        }
    }
});

// Sidebar toggle functionality
const toggleBtn = document.querySelector('.toggle-btn');
const sideBar = document.querySelector('.side-bar');

toggleBtn.addEventListener('click', () => {
    sideBar.classList.toggle('collapsed');
});

// Add event listeners for filter buttons
document.querySelectorAll('.filter-options').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelector('.filter-options.active').classList.remove('active');
        button.classList.add('active');
        
        // Map filter text to video category IDs
        const categoryMap = {
            'All': '0',
            'Music': '10',
            'Gaming': '20',
            'Entertainment': '24',
            'Sports': '17',
            'News': '25',
            'Education': '27',
            'Science & Tech': '28',
            'Comedy': '23',
            'Movies': '1'
        };
        
        const categoryId = categoryMap[button.textContent] || '0';
        fetchTrendingVideos(categoryId);
    });
});
