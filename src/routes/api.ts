import express from "express";
import { userController } from "../controllers/user.controller";
import { contactController } from "../controllers/contact.controller";
import { addressController } from "../controllers/address.controller";

export const apiRouter = express.Router();

apiRouter.get("/api/users/current", userController.get);
apiRouter.patch("/api/users/current", userController.update);
apiRouter.delete("/api/users/logout", userController.logout);

apiRouter.post("/api/contacts", contactController.create);
apiRouter.get("/api/contacts/:contactId", contactController.get);
apiRouter.patch("/api/contacts/:contactId", contactController.update);
apiRouter.delete("/api/contacts/:contactId", contactController.remove);
apiRouter.get("/api/contacts", contactController.search);

apiRouter.post("/api/contacts/:contactId/addresses", addressController.create);
apiRouter.get(
  "/api/contacts/:contactId/addresses/:addressId",
  addressController.get
);
apiRouter.patch(
  "/api/contacts/:contactId/addresses/:addressId",
  addressController.update
);
apiRouter.delete(
  "/api/contacts/:contactId/addresses/:addressId",
  addressController.remove
);
apiRouter.get("/api/contacts/:contactId/addresses", addressController.list);
