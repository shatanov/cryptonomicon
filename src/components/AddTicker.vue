<template>
  <div class="flex">
    <div class="max-w-xs">
      <label for="wallet" class="block text-sm font-medium text-gray-700"
        >Тикер</label
      >
      <div class="mt-1 relative rounded-md shadow-md">
        <input
          @keyup.enter="addTicker"
          @input="addHint"
          v-model="ticker"
          type="text"
          name="wallet"
          id="wallet"
          class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
          placeholder="Например DOGE"
        />
      </div>
      <div
        v-show="hintState"
        class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
      >
        <span
          class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          v-for="hint in cardHintState"
          :key="hint.FullName"
          @click="addTicker(hint)"
        >
          {{ hint.Symbol }}
        </span>
      </div>
      <add-button @click="addTicker" />
      <div class="text-sm text-red-600" v-show="cardReplayState">
        Такой тикер уже добавлен
      </div>
    </div>
  </div>
</template>

<script>
import AddButton from "./AddButton";

export default {
  components: {
    AddButton
  },

  emits: {
    "add-ticker": value => typeof value === 'string',
  },

  data() {
    return {
      ticker: "",
    };
  },

  methods: {
    addTicker() {
      this.$emit("add-ticker", this.ticker);
      this.ticker = "";
    },
  },
};
</script>
