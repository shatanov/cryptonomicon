<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <template v-if="apiState">
      <div
        class="fixed w-100 h-100 opacity-80 bg-purple-800 inset-0 z-50 flex items-center justify-center"
      >
        <svg
          class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </template>
    <div class="container">
      <add-ticker @add-ticker="addTicker" />

      <template v-if="tickerCards.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div>
          <button
            class="my-4 mr-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="page = page - 1"
            v-show="page > 1"
          >
            Назад
          </button>
          <button
            class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="page = page + 1"
            v-show="hasNextPage"
          >
            Вперед
          </button>
          <div>Фильтр: <input v-model="filter" @input="page = 1" /></div>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
            v-for="item in paginatedTickers"
            :key="item.cardTitle"
            @click="selectedCard(item)"
            :class="{
              'bg-red-100': !item.tickerExistence,
              'border-4': cardState === item,
            }"
          >
            <div class="px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ item.cardTitle }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(item.cardPrice) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="deleteCard(item)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path></svg
              >Удалить
            </button>
          </div>
        </dl>
      </template>
      <hr class="w-full border-t border-gray-600 my-4" />
      <section v-if="cardState" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ cardState.cardTitle }} - USD
        </h3>
        <div
          class="flex items-end border-gray-600 border-b border-l h-64"
          ref="graph"
        >
          <div
            v-for="(bar, idx) in normalizeGraph"
            :key="idx"
            :style="{ height: `${bar}%`, width: `${this.graphElementWidth}px` }"
            class="bg-purple-800 border h-24"
          ></div>
        </div>
        <button
          @click="cardState = null"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background:new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from "./api";
import AddTicker from "./components/AddTicker.vue";

export default {
  name: "App",

  components: {
    AddTicker
  },

  data() {
    return {
      filter: "",

      tickerCards: [],
      graphState: [],
      dataAll: [],
      cardHintState: [],

      cardState: null,
      apiState: true,
      cardReplayState: false,
      hintState: false,

      graphElementWidth: 38,
      page: 1,
      maxGraphElements: 1
    };
  },

  created() {
    fetch("https://min-api.cryptocompare.com/data/all/coinlist?summary=true")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.dataAll = Object.values(data.Data);
        this.apiState = false;
      });

    const tickersData = localStorage.getItem("cryptonomicon-list");

    if (tickersData) {
      this.tickerCards = JSON.parse(tickersData);
      this.tickerCards.forEach((ticker) => {
        subscribeToTicker(ticker.cardTitle, (newPrice) =>
          this.updateTicker(ticker.cardTitle, newPrice)
        );
      });
    }

    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    const VALID_KEYS = ["filter", "page"];
    // Ошибка при изменение страницы(не сохраняется страница при перезагрузке)
    VALID_KEYS.forEach((key) => {
      if (windowData[key]) {
        this[key] = windowData[key];
      }
    });
  },

  mounted() {
    window.addEventListener("resize", this.calculateMaxGraphElements);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.calculateMaxGraphElements);
  },

  computed: {
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },

    startPage() {
      return (this.page - 1) * 6;
    },

    endPage() {
      return this.page * 6;
    },

    filteredTickers() {
      return this.tickerCards.filter((t) =>
        t.cardTitle.includes(this.filter.toUpperCase())
      );
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startPage, this.endPage);
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endPage;
    },

    normalizeGraph() {
      const maxValue = Math.max(...this.graphState);
      const minValue = Math.min(...this.graphState);
      if (maxValue === minValue) {
        return this.graphState.map(() => 50);
      }
      return this.graphState.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },
  },

  methods: {
    updateTicker(tickerName, price) {
      this.tickerCards
        .filter((ticker) => ticker.cardTitle === tickerName)
        .forEach((ticker) => {
          if (ticker === this.cardState) {
            this.graphState.push(price);
            this.updateGraph();
          }
          price === undefined
            ? (ticker.tickerExistence = false)
            : ((ticker.cardPrice = price), (ticker.tickerExistence = true));
        });
    },

    updateGraph() {
      if (this.graphState.length > this.maxGraphElements) {
        this.graphState = this.graphState.slice(-this.maxGraphElements);
      }
    },

    formatPrice(price) {
      if (typeof price === "number") {
        return price > 1 ? price.toFixed(2) : price.toPrecision(2);
      }

      return price;
    },

    calculateMaxGraphElements() {
      if (!this.$refs.graph) {
        return;
      }

      this.maxGraphElements =
        this.$refs.graph.clientWidth / this.graphElementWidth;
    },

    addTicker(ticker) {
      const currentTicker = {
        cardTitle: ticker.toUpperCase(),
        cardPrice: "-",
        tickerExistence: true,
      };

      if (this.tickerCards.some((e) => e.cardTitle === currentTicker.cardTitle)) {
        this.cardReplayState = true;
        return;
      }
      this.cardReplayState = false;
      this.tickerCards = [...this.tickerCards, currentTicker];
      this.filter = "";
      this.cardHintState.splice(0);
      this.hintState = false;
      subscribeToTicker(currentTicker.cardTitle, (newPrice) =>
        this.updateTicker(currentTicker.cardTitle, newPrice)
      );
    },

    deleteCard(itemDelete) {
      this.tickerCards = this.tickerCards.filter((t) => t != itemDelete);
      if (this.cardState === itemDelete) {
        this.cardState = null;
      }
      unsubscribeFromTicker(itemDelete.cardTitle);
    },

    selectedCard(item) {
      this.cardState = item;
    },

    addHint() {
      this.cardHintState = this.dataAll.filter(
        (h) =>
          h.Symbol.toLowerCase().indexOf(this.ticker.toLowerCase()) != -1 ||
          h.FullName.toLowerCase().indexOf(this.ticker.toLowerCase()) != -1
      );
      this.cardHintState.splice(4);
      this.ticker === ""
        ? ((this.hintState = false), this.cardHintState.splice(0))
        : (this.hintState = true);
      this.cardHintState == 0
        ? (this.hintState = false)
        : (this.hintState = true);
      this.cardReplayState === true
        ? (this.cardReplayState = false)
        : (this.cardReplayState = false);
    },
  },

  watch: {
    tickerCards() {
      localStorage.setItem(
        "cryptonomicon-list",
        JSON.stringify(this.tickerCards)
      );
    },

    cardState() {
      this.graphState = [];
      this.$nextTick().then(this.calculateMaxGraphElements);
    },

    maxGraphElements() {
      this.updateGraph();
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },

    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    }
  }
};
</script>
