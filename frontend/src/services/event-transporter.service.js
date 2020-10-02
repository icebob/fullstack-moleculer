import bus from "../bus";

export default {
	name: "event-transporter",
	events: {
	  "greeter.counting"() {
		//bus.$emit(ctx.eventName, ctx.params);
	  }
	}
  };
  