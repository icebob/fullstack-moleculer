const { MoleculerError } = require("moleculer").Errors;

class UnAuthorizedError extends MoleculerError {
	constructor(type, data) {
		super("Unauthorized", 401, type || "INVALID_TOKEN", data);
	}
}

class ForbiddenError extends MoleculerError {
	constructor(type, data) {
		super("Forbidden", 403, type, data);
	}
}

module.exports = {
	name: "AuthMiddleware",

	localAction(next, action) {
		if (action.authRole) {
			return async function AuthMiddleware(ctx) {
				if (!ctx.meta.user) {
					const token = ctx.meta.token;
					if (!token) throw new UnAuthorizedError("MISSING_TOKEN");

					// Resolve user against token
					const user = await ctx.call("auth.resolveToken", { token });
					if (!user) throw new UnAuthorizedError();

					ctx.meta.user = user;
				}

				if (action.authRole != ctx.meta.user.role)
					throw new ForbiddenError();

				return next(ctx);
			};
		}

		return next;
	}
};
