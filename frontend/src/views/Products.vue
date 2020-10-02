<template>
  <div class="p-5">
    <table
      v-if="products"
      class="rounded-lg shadow border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative"
    >
      <thead>
        <tr
          class="sticky top-0 border-b border-teal-500 bg-teal-600 text-white"
        >
          <th class="px-4 py-2 rounded-tl-lg">Name</th>
          <th class="px-4 py-2">Quantity</th>
          <th class="px-4 py-2 rounded-tr-lg">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="cursor-pointer hover:bg-teal-100 transition-colors transition duration-200 ease-in-out"
          :class="{ 'bg-teal-200': selected && selected._id == product._id }"
          v-for="product in products"
          :key="product._id"
          @click="selectItem(product)"
        >
          <td class="border px-4 py-2">{{ product.name }}</td>
          <td class="border px-4 py-2">{{ product.quantity }}</td>
          <td class="border px-4 py-2">${{ product.price }}</td>
        </tr>
      </tbody>
    </table>

    <div class="my-4">
      <button
        class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
        type="button"
        @click="selected = {}"
      >
        <svg
          class="fill-current w-6 h-6 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        New product
      </button>
    </div>

    <div v-if="selected" class="mt-10">
      <div class="w-full max-w-sm m-auto">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2 text-left"
              for="name"
            >
              Name
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              :value="selected.name"
              @input="selected.name = $event.target.value"
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2 text-left"
              for="quantity"
            >
              Quantity
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="quantity"
              type="number"
              placeholder="Quantity"
              v-model.number="selected.quantity"
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2 text-left"
              for="price"
            >
              Price
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="price"
              type="text"
              placeholder="Price"
              v-model.number="selected.price"
            />
          </div>
          <div v-if="create" class="mb-4 text-sm text-red-700 font-bold">
            {{ error }}
          </div>
          <div class="flex items-center justify-between">
            <button
              class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              @click="selected._id ? update() : create()"
            >
              {{ selected._id ? "Update" : "Create" }}
            </button>
            <button
              v-if="selected._id"
              class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
              type="button"
              @click="remove()"
            >
              <svg
                class="fill-current w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path
                  fill-rule="evenodd"
                  d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Products",
  data() {
    return {
      products: null,
      selected: null,
      error: null
    };
  },

  events: {
    "products.*"(ctx) {
      console.log("Products changed.", ctx.eventName, ctx.params);
    }
  },

  methods: {
    selectItem(item) {
      this.selected = Object.assign({}, item);
    },

    async create() {
      this.error = null;
      try {
        const res = await this.broker.call("products.create", this.selected);
        this.products.push(res);
        this.selectItem(res);
      } catch (err) {
        const msg =
          err.name == "ValidationError"
            ? err.data.map(e => e.message).join(" ")
            : err.message;
        this.error = "Unable to create product: " + msg;
        console.error("Unable to create product", err);
      }
    },

    async update() {
      this.error = null;
      try {
        const res = await this.broker.call("products.update", this.selected);
        const orig = this.products.find(p => p._id == res._id);
        if (orig) {
          Object.assign(orig, res);
          this.selectItem(orig);
        }
      } catch (err) {
        const msg =
          err.name == "ValidationError"
            ? err.data.map(e => e.message).join(" ")
            : err.message;
        this.error = "Unable to update product: " + msg;
        console.error("Unable to update product", err);
      }
    },

    async remove() {
      this.error = null;
      try {
        await this.broker.call("products.remove", { id: this.selected._id });

        this.products = this.products.filter(p => p._id != this.selected._id);
        this.selectItem(null);
      } catch (err) {
        const msg = err.message;
        this.error = "Unable to remove product: " + msg;
        console.error("Unable to remove product", err);
      }
    },

    async fetch() {
      this.products = await this.broker.call("products.find");
    }
  },

  async mounted() {
    await this.fetch();
  }
};
</script>
