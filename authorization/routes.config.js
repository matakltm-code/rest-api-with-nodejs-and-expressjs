const VerifyUserMiddleware = require("./middlewares/verify.user.middleware");
const AuthorizationController = require("./controllers/authorization.controller");
const AuthValidationMiddleware = require("../middlewares/auth.validation");
exports.routesConfig = function (app) {
  app.post("/auth/login", [
    VerifyUserMiddleware.hasAuthValidFields,
    VerifyUserMiddleware.isPasswordAndUserMatch,
    AuthorizationController.login,
  ]);

  // System admin registration
  app.post("/auth/register-admin", [AuthorizationController.registerAdminUser]);
  // Normal users registration
  app.post("/auth/register", [AuthorizationController.registerNormalUser]);

  app.post("/auth/refresh", [
    AuthValidationMiddleware.validJWTNeeded,
    AuthValidationMiddleware.verifyRefreshBodyField,
    AuthValidationMiddleware.validRefreshNeeded,
    AuthorizationController.login,
  ]);
};
