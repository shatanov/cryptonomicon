const API_KEY = '9cb9107f4629d0eda02c98db8f3b9ffc7b640005a366d59a9d5cc50c7dc92d50'

export const loadTicker = tickers => 
    fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=${tickers}&api_key=${API_KEY}`
    ).then(d => d.json())
