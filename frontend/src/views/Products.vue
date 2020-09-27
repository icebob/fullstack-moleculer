<template>
  <div class="p-5">
    <table
      v-if="products"
      class="rounded-lg shadow border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative"
    >
      <thead>
        <tr class="sticky top-0 border-b border-gray-200 bg-gray-100">
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Quantity</th>
          <th class="px-4 py-2">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product._id">
          <td class="border px-4 py-2">{{ product.name }}</td>
          <td class="border px-4 py-2">{{ product.quantity }}</td>
          <td class="border px-4 py-2">${{ product.price }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "Products",
  data() {
    return {
      products: null
    };
  },

  async mounted() {
    this.products = await this.broker.call("products.find");
  }
};
</script>
