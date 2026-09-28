"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";
import type { ArticleImage } from "@/lib/article-images";

type View = { scale: number; x: number; y: number };
const initialView: View = { scale: 1, x: 0, y: 0 };

export function ScreenshotGallery({ images, basePath }: { images: ArticleImage[]; basePath: string }) {
  const [active, setActive] = useState<number | null>(null);
  const [view, setView] = useState<View>(initialView);
  const current = useRef<View>(initialView);
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const displayedImage = useRef<HTMLImageElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const openedFrom = useRef<number | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDistance = useRef<number | null>(null);

  useEffect(() => {
    if (active !== null && !dialog.current?.open) dialog.current?.showModal();
  }, [active]);

  function updateView(next: View) {
    const viewport = stage.current;
    const image = displayedImage.current;
    if (viewport && image) {
      const maxX = Math.max(0, (image.offsetWidth * next.scale - viewport.clientWidth) / 2);
      const maxY = Math.max(0, (image.offsetHeight * next.scale - viewport.clientHeight) / 2);
      next = { ...next, x: Math.max(-maxX, Math.min(maxX, next.x)), y: Math.max(-maxY, Math.min(maxY, next.y)) };
    }
    current.current = next;
    setView(next);
  }

  function zoomTo(scale: number, clientX?: number, clientY?: number) {
    const viewport = stage.current?.getBoundingClientRect();
    const previous = current.current;
    const nextScale = Math.max(1, Math.min(5, scale));
    if (!viewport || nextScale === 1) return updateView(initialView);
    const x = (clientX ?? viewport.left + viewport.width / 2) - viewport.left - viewport.width / 2;
    const y = (clientY ?? viewport.top + viewport.height / 2) - viewport.top - viewport.height / 2;
    const ratio = nextScale / previous.scale;
    updateView({ scale: nextScale, x: x - (x - previous.x) * ratio, y: y - (y - previous.y) * ratio });
  }

  function open(index: number) {
    openedFrom.current = index;
    updateView(initialView);
    setActive(index);
  }

  function changeImage(index: number) {
    pointers.current.clear();
    pinchDistance.current = null;
    updateView(initialView);
    setActive(index);
  }

  function close() { dialog.current?.close(); }

  function onClose() {
    setActive(null);
    pointers.current.clear();
    pinchDistance.current = null;
    updateView(initialView);
    if (openedFrom.current !== null) triggers.current[openedFrom.current]?.focus();
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchDistance.current = Math.hypot(a.x - b.x, a.y - b.y);
    }
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const previous = pointers.current.get(event.pointerId);
    if (!previous) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchDistance.current) zoomTo(current.current.scale * distance / pinchDistance.current, (a.x + b.x) / 2, (a.y + b.y) / 2);
      pinchDistance.current = distance;
    } else if (current.current.scale > 1) {
      updateView({ ...current.current, x: current.current.x + event.clientX - previous.x, y: current.current.y + event.clientY - previous.y });
    }
  }

  function onPointerEnd(event: PointerEvent<HTMLDivElement>) {
    pointers.current.delete(event.pointerId);
    pinchDistance.current = null;
  }

  function onWheel(event: WheelEvent<HTMLDivElement>) {
    event.preventDefault();
    zoomTo(current.current.scale * (event.deltaY < 0 ? 1.2 : 1 / 1.2), event.clientX, event.clientY);
  }

  const image = active === null ? null : images[active];
  return <>
    {images.map((item, index) => <figure className="screenshot-figure" key={item.file}>
      <button className="screenshot-trigger" type="button" aria-label={`View screenshot: ${item.alt}`} ref={(node) => { triggers.current[index] = node; }} onClick={() => open(index)}>
        <Image src={`${basePath}/screens/${item.file}`} alt={item.alt} width={item.width} height={item.height} unoptimized loading="lazy" />
        <span className="screenshot-open" aria-hidden="true">View and zoom <span>↗</span></span>
      </button>
      <figcaption>{item.caption} <span>Select image to explore.</span></figcaption>
    </figure>)}
    <dialog className="screenshot-viewer" ref={dialog} onClose={onClose} aria-label="Screenshot viewer">
      {image && <div className="viewer-shell">
        <div className="viewer-topbar">
          <div className="viewer-title"><span className="viewer-eyebrow">CLEOS VISUAL GUIDE</span><span>{image.caption}</span></div>
          <button className="viewer-icon viewer-close" type="button" aria-label="Close screenshot viewer" onClick={close}>×</button>
        </div>
        <div className={`viewer-stage${view.scale > 1 ? " is-zoomed" : ""}`} ref={stage} onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd} onDoubleClick={(event) => zoomTo(view.scale > 1 ? 1 : 2, event.clientX, event.clientY)}>
          <Image ref={displayedImage} className="viewer-image" src={`${basePath}/screens/${image.file}`} alt={image.alt} width={image.width} height={image.height} unoptimized priority style={{ transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})` }} draggable={false} />
        </div>
        <div className="viewer-toolbar">
          <span className="viewer-help"><span className="viewer-help-desktop">Scroll or pinch to zoom · Drag to move · Double-click to zoom</span><span className="viewer-help-mobile">Pinch to zoom · Drag to move</span></span>
          <div className="viewer-controls">
            {images.length > 1 && <><button className="viewer-icon" type="button" aria-label="Previous screenshot" onClick={() => changeImage((active! - 1 + images.length) % images.length)}>←</button><span className="viewer-count">{active! + 1} / {images.length}</span><button className="viewer-icon" type="button" aria-label="Next screenshot" onClick={() => changeImage((active! + 1) % images.length)}>→</button></>}
            <span className="viewer-divider" aria-hidden="true" />
            <button className="viewer-icon" type="button" aria-label="Zoom out" disabled={view.scale <= 1} onClick={() => zoomTo(view.scale / 1.25)}>−</button>
            <button className="viewer-zoom" type="button" aria-label="Reset zoom" onClick={() => zoomTo(1)}>{Math.round(view.scale * 100)}%</button>
            <button className="viewer-icon" type="button" aria-label="Zoom in" disabled={view.scale >= 5} onClick={() => zoomTo(view.scale * 1.25)}>+</button>
          </div>
        </div>
      </div>}
    </dialog>
  </>;
}
