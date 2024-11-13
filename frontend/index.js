import { backend } from "declarations/backend";

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const UPDATE_INTERVAL = 5 * 60 * 1000; // 5 minutes
let updateTimer;

async function fetchCoinList() {
    const response = await fetch(`${COINGECKO_API}/coins/list`);
    const coins = await response.json();
    return coins;
}

async function fetchRandomCoins() {
    try {
        // Show loading spinner
        document.getElementById('loading').classList.remove('d-none');

        // Get full coin list
        const allCoins = await fetchCoinList();
        
        // Select 10 random coins
        const randomCoins = [];
        const selectedIndices = new Set();
        
        while (randomCoins.length < 10) {
            const randomIndex = Math.floor(Math.random() * allCoins.length);
            if (!selectedIndices.has(randomIndex)) {
                selectedIndices.add(randomIndex);
                randomCoins.push(allCoins[randomIndex]);
            }
        }

        // Fetch price data for selected coins
        const coinIds = randomCoins.map(coin => coin.id).join(',');
        const priceResponse = await fetch(
            `${COINGECKO_API}/simple/price?ids=${coinIds}&vs_currencies=usd&include_last_updated_at=true`
        );
        const priceData = await priceResponse.json();

        // Combine coin data
        const cryptoData = randomCoins.map(coin => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            price: priceData[coin.id]?.usd || 0,
            lastUpdated: priceData[coin.id]?.last_updated_at || 0
        }));

        // Update backend
        await backend.updateCryptoData(cryptoData);
        
        // Update UI
        updateUI(cryptoData);
    } catch (error) {
        console.error('Error fetching crypto data:', error);
    } finally {
        document.getElementById('loading').classList.add('d-none');
    }
}

function updateUI(cryptoData) {
    const tableBody = document.getElementById('cryptoTable');
    tableBody.innerHTML = '';

    cryptoData.forEach(coin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${coin.name}</td>
            <td>${coin.symbol}</td>
            <td>$${coin.price.toFixed(2)}</td>
            <td>${new Date(coin.lastUpdated * 1000).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    let timeLeft = UPDATE_INTERVAL;

    const countdown = setInterval(() => {
        timeLeft -= 1000;
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        timerElement.textContent = `Next update in: ${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
        }
    }, 1000);
}

async function initialize() {
    await fetchRandomCoins();
    updateTimerDisplay();
    
    // Set up periodic updates
    setInterval(async () => {
        await fetchRandomCoins();
        updateTimerDisplay();
    }, UPDATE_INTERVAL);
}

// Start the application
initialize();
