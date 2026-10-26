type Bounds = Pick<DOMRect, "top" | "bottom" | "left" | "right" | "width" | "height">;

/** Controls belong to a reserved header row; never pin them over image pixels. */
export function imageToggleLayout(
  image: Bounds,
  viewport: Bounds,
  host: Pick<DOMRect, "top" | "left">,
  button: { width: number; height: number },
  _expanded: boolean,
) {
  const top = image.top + 4;
  const hidden = image.width <= 0 || image.height <= 0 ||
    top < viewport.top || top + button.height > viewport.bottom ||
    image.right <= viewport.left || image.left >= viewport.right ||
    viewport.bottom <= viewport.top || viewport.right <= viewport.left;
  const leftEdge = viewport.left + 3;
  const rightEdge = Math.max(leftEdge, viewport.right - button.width - 3);
  return {
    hidden,
    left: Math.round(Math.min(Math.max(image.left + 3, leftEdge), rightEdge) - host.left),
    top: Math.round(top - host.top),
  };
}
