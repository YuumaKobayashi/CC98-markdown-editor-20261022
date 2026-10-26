const imageVisibilityAttribute = "data-ubb-image-visibility";
const visibleImageState = "visible";
const hiddenImageState = "hidden";

export const visibleUbbImageProps = {
  [imageVisibilityAttribute]: visibleImageState,
} as const;

export const hiddenUbbImageProps = {
  [imageVisibilityAttribute]: hiddenImageState,
} as const;

export function setAllUbbImagesVisible(visible: boolean): void {
  const currentState = visible ? hiddenImageState : visibleImageState;
  const controls = Array.from(
    document.querySelectorAll<HTMLElement>(
      `[${imageVisibilityAttribute}="${currentState}"]`
    )
  );

  controls.forEach((control) => control.click());
}
