/**
 * P09 legacy compatibility facade.
 *
 * New application code imports from @app/store. Legacy modules can keep their
 * existing relative Store imports until their owning feature phase.
 */
export { default } from "./src/app/store";
export * from "./src/app/store";
