<template>
  <div class="p-5">
    <h3 class="text-xl text-left">User list (protected)</h3>
    <table
      v-if="users"
      class="m-auto rounded-lg shadow border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative"
      style="max-width: 960px"
    >
      <thead>
        <tr
          class="sticky top-0 border-b border-primary-dark bg-primary-dark text-white"
        >
          <th class="px-4 py-2 rounded-tl-lg">ID</th>
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="cursor-pointer hover:bg-primary-lightest transition-colors transition duration-200 ease-in-out"
          v-for="user in users"
          :key="user.id"
        >
          <td class="border px-4 py-2">{{ user.id }}</td>
          <td class="border px-4 py-2">{{ user.username }}</td>
          <td class="border px-4 py-2">{{ user.role }}</td>
        </tr>
      </tbody>
    </table>

    <hr class="my-6" />

    <div v-if="error">
      <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span class="block sm:inline">{{ error }}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg
            class="fill-current h-6 w-6 text-red-500"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path
              d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
            />
          </svg>
        </span>
      </div>
    </div>

    <div v-if="!token" class="mt-10">
      <div class="w-full max-w-md m-auto">
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2 text-left"
              for="name"
            >
              Username
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Username"
              v-model="loginUsername"
            />
          </div>
          <div class="mb-4">
            <label
              class="block text-gray-700 text-sm font-bold mb-2 text-left"
              for="password"
            >
              Password
            </label>
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              v-model="loginPassword"
            />
          </div>
          <div class="flex items-center justify-between">
            <button class="" type="button" @click="login()">Login</button>
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
      loginUsername: null,
      loginPassword: null,
      users: null,
      error: null,
      token: null,
    };
  },

  methods: {
    /**
     * Login with "auth.login". In case of success authentication
     * it receives a token what we should send for every call.
     */
    async login() {
      this.error = null;
      try {
        const res = await this.broker.call("auth.login", {
          username: this.loginUsername,
          password: this.loginPassword,
        });
        this.token = res.token;
      } catch (err) {
        this.error = "Unable to login: " + err.message;
        console.error("Unable to login", err.message);
      }
      if (this.token) await this.fetch();
    },

    /**
     * Fetch the products. Call the "products.find" action
     * on the backend side.
     */
    async fetch() {
      this.error = null;
      try {
        this.users = await this.broker.call("auth.listUsers", null, {
          meta: { token: this.token },
        });
      } catch (err) {
        this.error = "Unable to fetch users: " + err.message;
        console.error("Unable to fetch users", err.message);
      }
    },
  },

  async mounted() {
    await this.fetch();
  },
};
</script>
