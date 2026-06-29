import classNames from "classnames";
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from "react";

import styles from "./CustomScrollbar.module.scss";

const MIN_THUMB_HEIGHT = 24;
const SCROLL_STEP = 120;
const SCROLLBAR_OFFSET_RIGHT = 15;
const SCROLLBAR_CHROME_HEIGHT = 36;

interface ThumbMetrics {
  height: number;
  top: number;
}

interface ScrollbarLayout {
  top: number;
  height: number;
}

interface CustomScrollbarProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

const getTrackHeight = (
  content: HTMLDivElement,
  track: HTMLDivElement | null,
): number => {
  if (track && track.clientHeight > 0) {
    return track.clientHeight;
  }

  return Math.max(content.clientHeight - SCROLLBAR_CHROME_HEIGHT, 0);
};

const CustomScrollbar: FC<CustomScrollbarProps> = ({
  children,
  className,
  contentClassName,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({
    isDragging: false,
    startY: 0,
    startScrollTop: 0,
  });
  const [thumbMetrics, setThumbMetrics] = useState<ThumbMetrics>({
    height: 0,
    top: 0,
  });
  const [canScroll, setCanScroll] = useState(false);
  const [scrollbarLayout, setScrollbarLayout] = useState<ScrollbarLayout>({
    top: 0,
    height: 0,
  });

  const updateThumb = useCallback(() => {
    const content = contentRef.current;
    const track = trackRef.current;

    if (!content) {
      return;
    }

    const contentRect = content.getBoundingClientRect();

    setScrollbarLayout({
      top: contentRect.top,
      height: contentRect.height,
    });

    const { scrollTop, scrollHeight, clientHeight } = content;
    const hasOverflow = scrollHeight > clientHeight + 1;

    setCanScroll(hasOverflow);

    if (!hasOverflow) {
      setThumbMetrics({ height: 0, top: 0 });
      return;
    }

    const trackHeight = getTrackHeight(content, track);

    if (trackHeight <= 0) {
      return;
    }

    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * trackHeight,
      MIN_THUMB_HEIGHT,
    );
    const maxThumbTop = trackHeight - thumbHeight;
    const scrollRatio =
      scrollHeight - clientHeight > 0
        ? scrollTop / (scrollHeight - clientHeight)
        : 0;
    const thumbTop = scrollRatio * maxThumbTop;

    setThumbMetrics({ height: thumbHeight, top: thumbTop });
  }, []);

  const scheduleUpdate = useCallback(() => {
    requestAnimationFrame(() => {
      updateThumb();
      requestAnimationFrame(updateThumb);
    });
  }, [updateThumb]);

  const handleScrollUp = () => {
    contentRef.current?.scrollBy({ top: -SCROLL_STEP });
  };

  const handleScrollDown = () => {
    contentRef.current?.scrollBy({ top: SCROLL_STEP });
  };

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const content = contentRef.current;
    const track = trackRef.current;

    if (!content || !track || !canScroll) {
      return;
    }

    if ((event.target as HTMLElement).dataset.part === "thumb") {
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const clickOffset = event.clientY - trackRect.top;
    const { scrollHeight, clientHeight } = content;
    const trackHeight = getTrackHeight(content, track);
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * trackHeight,
      MIN_THUMB_HEIGHT,
    );
    const maxThumbTop = trackHeight - thumbHeight;
    const targetThumbTop = Math.min(
      Math.max(clickOffset - thumbHeight / 2, 0),
      maxThumbTop,
    );
    const scrollRatio = maxThumbTop > 0 ? targetThumbTop / maxThumbTop : 0;

    content.scrollTop = scrollRatio * (scrollHeight - clientHeight);
  };

  const handleThumbPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const content = contentRef.current;

    if (!content || !canScroll) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragStateRef.current = {
      isDragging: true,
      startY: event.clientY,
      startScrollTop: content.scrollTop,
    };
  };

  const handleThumbPointerMove = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    const content = contentRef.current;
    const track = trackRef.current;
    const dragState = dragStateRef.current;

    if (!content || !track || !dragState.isDragging) {
      return;
    }

    const { scrollHeight, clientHeight } = content;
    const trackHeight = getTrackHeight(content, track);
    const thumbHeight = Math.max(
      (clientHeight / scrollHeight) * trackHeight,
      MIN_THUMB_HEIGHT,
    );
    const maxThumbTop = trackHeight - thumbHeight;
    const scrollableDistance = scrollHeight - clientHeight;
    const deltaY = event.clientY - dragState.startY;
    const scrollDelta =
      maxThumbTop > 0 ? (deltaY / maxThumbTop) * scrollableDistance : 0;

    content.scrollTop = dragState.startScrollTop + scrollDelta;
  };

  const handleThumbPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStateRef.current.isDragging = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  useEffect(() => {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    scheduleUpdate();

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(content);

    const observeContentChildren = () => {
      Array.from(content.children).forEach((child) => {
        resizeObserver.observe(child);
      });
    };

    observeContentChildren();

    const mutationObserver = new MutationObserver(() => {
      observeContentChildren();
      scheduleUpdate();
    });

    mutationObserver.observe(content, { childList: true });

    const track = trackRef.current;

    if (track) {
      resizeObserver.observe(track);
    }

    const handleWindowChange = () => {
      scheduleUpdate();
    };

    const handleContentLoad = () => {
      scheduleUpdate();
    };

    window.addEventListener("resize", handleWindowChange);
    window.addEventListener("scroll", handleWindowChange, true);
    content.addEventListener("load", handleContentLoad, true);

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", handleWindowChange);
      window.removeEventListener("scroll", handleWindowChange, true);
      content.removeEventListener("load", handleContentLoad, true);
    };
  }, [scheduleUpdate]);

  return (
    <div
      className={[styles.customScrollbar, className].filter(Boolean).join(" ")}
    >
      <div
        ref={contentRef}
        className={[styles.content, contentClassName].filter(Boolean).join(" ")}
        onScroll={updateThumb}
      >
        {children}
      </div>

      <div
        className={classNames(styles.scrollbar, {
          [styles.scrollbarHidden]: !canScroll,
        })}
        style={{
          top: `${scrollbarLayout.top}px`,
          height: `${scrollbarLayout.height}px`,
          right: `${SCROLLBAR_OFFSET_RIGHT}px`,
        }}
        aria-hidden={!canScroll}
      >
        <button
          className={styles.scrollButton}
          type="button"
          aria-label="Прокрутить вверх"
          disabled={!canScroll}
          onClick={handleScrollUp}
          tabIndex={canScroll ? 0 : -1}
        >
          <span className={styles.chevronUp} />
        </button>

        <div
          ref={trackRef}
          className={styles.track}
          onClick={handleTrackClick}
          role="presentation"
        >
          {canScroll && (
            <div
              className={styles.thumb}
              data-part="thumb"
              style={{
                height: `${thumbMetrics.height}px`,
                top: `${thumbMetrics.top}px`,
              }}
              onPointerDown={handleThumbPointerDown}
              onPointerMove={handleThumbPointerMove}
              onPointerUp={handleThumbPointerUp}
              onPointerCancel={handleThumbPointerUp}
            />
          )}
        </div>

        <button
          className={styles.scrollButton}
          type="button"
          aria-label="Прокрутить вниз"
          disabled={!canScroll}
          onClick={handleScrollDown}
          tabIndex={canScroll ? 0 : -1}
        >
          <span className={styles.chevronDown} />
        </button>
      </div>
    </div>
  );
};

export default CustomScrollbar;
