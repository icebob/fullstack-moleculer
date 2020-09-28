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
        class="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="button"
        @click="selected = {}"
      >
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

  methods: {
    selectItem(item) {
      this.selected = Object.assign({}, item);
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
    }
  },

  async mounted() {
    this.products = await this.broker.call("products.find");
  }
};
</script>
