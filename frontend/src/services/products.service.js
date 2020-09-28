export default {
  name: "ui.products",
  events: {
    "products.created"(ctx) {
      console.log("Product created", ctx.params);
    }
  }
};
