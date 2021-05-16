const API_KEY = '9cb9107f4629d0eda02c98db8f3b9ffc7b640005a366d59a9d5cc50c7dc92d50'

const tickersHandlers = new Map;

const loadTickers = () => {
    if(tickersHandlers.size === 0){
        return;
    }

    fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${[...tickersHandlers.keys()].join(',')}&tsyms=USD&api_key=${API_KEY}`
    )
    .then(d => d.json())
    .then(rawData => {
        const updatedPrice = Object.fromEntries(
            Object.entries(rawData).map(([key, value]) => [key, value.USD])
        );

        Object.entries(updatedPrice).forEach(([currency, newPrice]) => {
            const handlers = tickersHandlers.get(currency) ?? [];
            handlers.forEach(fn => fn(newPrice));
        })
    }
    );
};

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, subscribers.filter(fn => fn != cb));
}

setInterval(loadTickers, 5000);

window.tickersHandlers = tickersHandlers;