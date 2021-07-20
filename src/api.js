const API_KEY =
  "9cb9107f4629d0eda02c98db8f3b9ffc7b640005a366d59a9d5cc50c7dc92d50";

const tickersHandlers = new Map();

const AGGREGATE_INDEX = "5";
const INVALID_SUB = "500";

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
    PARAMETER: parameter,
  } = JSON.parse(e.data);

  if (
    (type === AGGREGATE_INDEX && newPrice != undefined) ||
    checkExistenceCoin(type)
  ) {
    const handlers = tickersHandlers.get(currency || getCurrencyFromParametr(parameter)) ?? [];
    handlers.forEach((fn) => fn(newPrice));
  }
});

function getCurrencyFromParametr(parameter){
  const firstOccurrence = parameter?.indexOf("~", 2) + 1;
  const secondOccurrence = parameter?.lastIndexOf("~");
  
  return parameter?.slice(firstOccurrence, secondOccurrence)
}


function checkExistenceCoin(type) {
  if (type === INVALID_SUB) {
    return true;
  }
}

function sendToWebSocket(message) {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message));
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(JSON.stringify(message));
    },
    { once: true }
  );
}

function subscribeToTickerOnWS(ticker) {
  const message = {
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  };

  sendToWebSocket(message);
}

function unsubscribeFromTickerOnWS(ticker) {
  const message = {
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  };

  sendToWebSocket(message);
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerOnWS(ticker);
};

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker);
  unsubscribeFromTickerOnWS(ticker);
};

window.tickersHandlers = tickersHandlers;
