/// <reference types="vite/client" />

// Declare JSON modules for i18n
declare module "*.json" {
  const value: any;
  export default value;
}
