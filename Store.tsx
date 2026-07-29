/**
 * P09 legacy compatibility facade.
 *
 * New application code imports from @application/store. Legacy modules can keep their
 * existing relative Store imports until their owning feature phase.
 */
export { default } from "./src/application/store";
export * from "./src/application/store";
