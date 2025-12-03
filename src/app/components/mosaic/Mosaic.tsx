"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import "./Mosaic.css";
import clsx from "clsx";
import { formatDate } from "../../../lib/date-utils";

export interface MosaicItem {
  id: string;
  url: string;
  type: "image" | "video";
  title?: string | null;
  description: string;
  tags: string[];
  alt: string;
  aspectRatio?: string;
  featured?: boolean;
  captureDate?: string | null;
  location?: string | null;
}

export interface MosaicGalleryProps {
  items: MosaicItem[];
  className?: string;
  itemClassName?: string;
  maxColumns?: number;
  gap?: number;
  enableLazyLoad?: boolean;
  animations?: boolean;
  onItemClick?: (item: MosaicItem, index: number) => void;
}

interface LoadingImageProps {
  src: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const LoadingImage: React.FC<LoadingImageProps> = ({
  src,
  alt,
  className = "",
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  return (
    <div className={`mosaic-image-container ${className}`}>
      {isLoading && (
        <div className="mosaic-skeleton">
          <div className="mosaic-skeleton-pulse"></div>
        </div>
      )}
      {hasError ? (
        <div className="mosaic-error-placeholder">
          <svg
            width="48"
            height="48"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="mosaic-error-icon"
          >
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
          </svg>
          <span>Image unavailable</span>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={clsx("mosaic-image", {
            "mosaic-image-loading": isLoading,
          })}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
};

const Modal: React.FC<{
  item: MosaicItem;
  isOpen: boolean;
  onClose: () => void;
}> = ({ item, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    // Reset loading states when modal opens
    if (isOpen) {
      setImageLoading(true);
      setImageError(false);
      setShowInfo(true);
    }
  }, [isOpen, item.url]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="mosaic-modal-overlay" role="dialog" aria-modal="true">
      <div className="mosaic-modal-content" ref={modalRef}>
        <button
          className="mosaic-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Info button to toggle metadata overlay */}
        <button
          className="mosaic-modal-info-toggle"
          onClick={() => setShowInfo(!showInfo)}
          aria-label="Toggle image information"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>

        <div className="mosaic-modal-image">
          {imageLoading && (
            <div className="mosaic-modal-loading">
              <div className="mosaic-skeleton">
                <div className="mosaic-skeleton-pulse"></div>
              </div>
            </div>
          )}
          {imageError ? (
            <div className="mosaic-error-placeholder">
              <svg
                width="48"
                height="48"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="mosaic-error-icon"
              >
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
              <span>Image unavailable</span>
            </div>
          ) : (
            <Image
              src={item.url}
              alt={item.alt || item.description}
              width={800}
              height={800}
              className={`mosaic-modal-img ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              // style={{
              //   objectFit: "contain",
              //   maxWidth: "100%",
              //   maxHeight: "100%",
              //   width: "100%",
              //   height: "100%",
              // }}
              onLoad={() => {
                console.log("Image loaded successfully:", item.url);
                setImageLoading(false);
              }}
              onError={(e) => {
                console.error("Image failed to load:", item.url, e);
                setImageLoading(false);
                setImageError(true);
              }}
            />
          )}
        </div>

        {/* Overlay info panel */}
        {showInfo && (
          <div className="mosaic-modal-info-overlay">
            <div className="mosaic-modal-info">
              {item.title && (
                <h3 className="mosaic-modal-title">{item.title}</h3>
              )}
              <p className="mosaic-modal-description">{item.description}</p>
              {item.location && (
                <p className="mosaic-modal-location">
                  <svg
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="mosaic-location-icon"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {item.location}
                </p>
              )}
              {item.captureDate && (
                <p className="mosaic-modal-date">
                  {formatDate(item.captureDate)}
                </p>
              )}
              {item.tags.length > 0 && (
                <div className="mosaic-modal-tags">
                  {item.tags.map((tag, index) => (
                    <span key={index} className="mosaic-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LazyImage: React.FC<{
  item: MosaicItem;
  className?: string;
  onClick: () => void;
}> = ({ item, className, onClick }) => {
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={`mosaic-item ${item.featured ? "mosaic-item-featured" : ""} ${
        className || ""
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`View ${item.title || item.description} in full screen`}
    >
      {isInView ? (
        <LoadingImage src={item.url} alt={item.alt || item.description} />
      ) : (
        <div className="mosaic-skeleton">
          <div className="mosaic-skeleton-pulse"></div>
        </div>
      )}
    </div>
  );
};

const MosaicGallery: React.FC<MosaicGalleryProps> = ({
  items,
  className = "",
  itemClassName = "",
  maxColumns = 4,
  gap = 16,
  enableLazyLoad = true,
  animations = true,
  onItemClick,
}) => {
  const [selectedItem, setSelectedItem] = useState<MosaicItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = useCallback(
    (item: MosaicItem, index: number) => {
      console.log(
        "Modal opening for item:",
        item.title || item.description,
        "URL:",
        item.url
      );
      setSelectedItem(item);
      setIsModalOpen(true);
      onItemClick?.(item, index);
    },
    [onItemClick]
  );

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedItem(null), 300);
  }, []);

  const mosaicStyle = {
    "--mosaic-gap": `${gap}px`,
    "--mosaic-max-columns": maxColumns,
  } as React.CSSProperties;

  return (
    <div
      className={`mosaic-gallery ${
        animations ? "mosaic-animated" : ""
      } ${className}`}
      style={mosaicStyle}
    >
      {items.map((item, index) => {
        const ItemComponent = enableLazyLoad
          ? LazyImage
          : ({
              item,
              className,
              onClick,
            }: {
              item: MosaicItem;
              className?: string;
              onClick: () => void;
            }) => (
              <div
                className={`mosaic-item ${
                  item.featured ? "mosaic-item-featured" : ""
                } ${className || ""}`}
                onClick={onClick}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View ${
                  item.title || item.description
                } in full screen`}
              >
                <LoadingImage
                  src={item.url}
                  alt={item.alt || item.description}
                />
              </div>
            );

        return (
          <ItemComponent
            key={item.id}
            item={item}
            className={itemClassName}
            onClick={() => handleItemClick(item, index)}
          />
        );
      })}

      {selectedItem && (
        <Modal item={selectedItem} isOpen={isModalOpen} onClose={closeModal} />
      )}
    </div>
  );
};

export default MosaicGallery;
