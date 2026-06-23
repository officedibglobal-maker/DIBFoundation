
export const isAdminDevelopmentBypass =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_ADMIN_DEV_BYPASS === "true";
