import adminRoutes from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import webRoutes from "./routes/webRoutes";

export default {
  ...webRoutes,
  ...vendorRoutes,
  ...adminRoutes,
  ...authRoutes,
};
