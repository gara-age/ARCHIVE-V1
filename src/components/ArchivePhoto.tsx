import { assetUrl } from "../utils/assetUrl";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ArchivePhoto as Photo } from "../data/photos";
function PhotoViewer({
  photo,
  onClose,
}: {
  photo: Photo;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const node = dialog.current;
    document.querySelectorAll("video").forEach((video) => video.pause());
    node?.showModal();
    return () => {
      node?.close();
      previous?.focus({ preventScroll: true });
    };
  }, []);
  return createPortal(
    <dialog
      ref={dialog}
      data-content
      className={`photo-viewer ${zoomed ? "is-zoomed" : ""}`}
      aria-label={`${photo.caption} 크게 보기`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <header>
        <h2>{photo.caption}</h2>
        <div>
          <button aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>
            {zoomed ? "화면에 맞추기" : "확대해서 보기"}
          </button>
          <button autoFocus onClick={onClose} aria-label="사진 닫기">
            닫기 <span>×</span>
          </button>
        </div>
      </header>
      <div className="photo-viewport">
        <img src={assetUrl(photo.full)} alt={photo.alt} />
      </div>
    </dialog>,
    document.body,
  );
}
export default function ArchivePhoto({ photo }: { photo: Photo }) {
  const [open, setOpen] = useState(false);
  return (
    <figure className={`archive-photo archive-photo--${photo.kind}`}>
      <button
        className="photo-open"
        onClick={() => setOpen(true)}
        aria-label={`${photo.caption} 크게 보기`}
      >
        <img
          src={assetUrl(photo.src)}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
        />
        <span className="photo-expand" aria-hidden="true">
          사진 크게 보기 ↗
        </span>
      </button>
      <figcaption>{photo.caption}</figcaption>
      {open && <PhotoViewer photo={photo} onClose={() => setOpen(false)} />}
    </figure>
  );
}
