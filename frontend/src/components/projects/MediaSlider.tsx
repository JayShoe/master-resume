'use client';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode, Zoom } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Import Swiper styles
import 'swiper/swiper-bundle.css';

interface DirectusFile {
  id: string;
  filename_download?: string;
  title?: string;
  description?: string;
  type?: string;
  width?: number;
  height?: number;
}

interface MediaRelation {
  directus_files_id?: DirectusFile;
  id?: string;
}

interface MediaSliderProps {
  media: MediaRelation[] | DirectusFile[];
  directusUrl?: string;
}

export default function MediaSlider({ media, directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL }: MediaSliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);


  if (!media || media.length === 0) {
    return null;
  }

  // Helper function to extract DirectusFile from media item
  const getDirectusFile = (mediaItem: any): DirectusFile | null => {
    // Check if mediaItem is null, undefined, or not an object
    if (!mediaItem || typeof mediaItem !== 'object') {
      console.log('MediaItem is not an object:', mediaItem);
      return null;
    }

    console.log('Processing media item:', mediaItem);

    // If it's a direct DirectusFile
    if (mediaItem.filename_download || mediaItem.type || mediaItem.id) {
      console.log('Found direct DirectusFile');
      return mediaItem as DirectusFile;
    }

    // If it's a relation with directus_files_id
    if (mediaItem.directus_files_id) {
      console.log('Found relation with directus_files_id:', mediaItem.directus_files_id);
      return mediaItem.directus_files_id;
    }

    console.log('Could not extract DirectusFile from:', mediaItem);
    return null;
  };

  const getImageUrl = (mediaItem: any) => {
    if (!directusUrl) {
      console.log('No directus URL provided');
      return '';
    }
    const file = getDirectusFile(mediaItem);
    if (!file || !file.id) {
      console.log('No file ID found for:', file);
      return '';
    }
    // Remove trailing slash from directusUrl to prevent double slashes
    const baseUrl = directusUrl.endsWith('/') ? directusUrl.slice(0, -1) : directusUrl;
    const url = `${baseUrl}/assets/${file.id}`;
    console.log('Generated image URL:', url);
    return url;
  };

  const isVideoFile = (mediaItem: any) => {
    const file = getDirectusFile(mediaItem);
    if (!file || !file.type) return false;
    return file.type.startsWith('video/');
  };

  const getVideoThumbnail = (mediaItem: any) => {
    const file = getDirectusFile(mediaItem);
    if (!file || !file.id || !directusUrl) return '';
    // Remove trailing slash from directusUrl to prevent double slashes
    const baseUrl = directusUrl.endsWith('/') ? directusUrl.slice(0, -1) : directusUrl;
    // Generate a thumbnail for video files
    return `${baseUrl}/assets/${file.id}?fit=cover&width=400&height=300&quality=80`;
  };

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Main Slider */}
      <div style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto 32px',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'white',
        border: '1px solid #e5e7eb'
      }}>
        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          spaceBetween={0}
          navigation={{
            nextEl: '.custom-swiper-button-next',
            prevEl: '.custom-swiper-button-prev',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          style={{
            height: '500px',
            '--swiper-pagination-color': '#3b82f6',
          } as any}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
        >
          {media.map((mediaItem, index) => {
            const file = getDirectusFile(mediaItem);
            const itemId = file?.id || (mediaItem as any).id || index;

            return (
              <SwiperSlide key={itemId}>
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    background: '#f9fafb'
                  }}
                >
                  {isVideoFile(mediaItem) ? (
                    <video
                      src={getImageUrl(mediaItem)}
                      controls
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                      poster={getVideoThumbnail(mediaItem)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={getImageUrl(mediaItem)}
                      alt={file?.title || `Project media ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  )}

                  {/* Fullscreen button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(index);
                    }}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(8px)',
                      border: 'none',
                      borderRadius: '8px',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      zIndex: 10,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
                      <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
                      <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
                      <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
                    </svg>
                  </button>

                  {/* Image title overlay */}
                  {file?.title && (
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.6))',
                      color: 'white',
                      padding: '24px 20px 16px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {file.title}
                    </div>
                  )}
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Navigation Buttons */}
        {media.length > 1 && (
          <>
            <button
              className="custom-swiper-button-prev"
              style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                opacity: 0.7,
                transition: 'all 0.2s ease',
                fontSize: '18px',
                color: '#374151'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(-51px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.7';
                e.currentTarget.style.transform = 'translateY(-50%)';
              }}
            >
              ←
            </button>
            <button
              className="custom-swiper-button-next"
              style={{
                position: 'absolute',
                right: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
                opacity: 0.7,
                transition: 'all 0.2s ease',
                fontSize: '18px',
                color: '#374151'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(-51px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '0.7';
                e.currentTarget.style.transform = 'translateY(-50%)';
              }}
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {media.length > 1 && (
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto 24px',
          padding: '0 24px'
        }}>
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Navigation, Thumbs]}
            spaceBetween={12}
            slidesPerView="auto"
            freeMode={true}
            watchSlidesProgress={true}
            style={{
              height: '72px',
              '--swiper-navigation-size': '14px',
            } as any}
            breakpoints={{
              320: {
                slidesPerView: 4,
                spaceBetween: 8,
              },
              640: {
                slidesPerView: 6,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 8,
                spaceBetween: 12,
              },
              1024: {
                slidesPerView: 10,
                spaceBetween: 12,
              },
            }}
          >
            {media.map((mediaItem, index) => {
              const file = getDirectusFile(mediaItem);
              const itemId = file?.id || (mediaItem as any).id || index;

              return (
                <SwiperSlide key={`thumb-${itemId}`} style={{ width: 'auto' }}>
                  <div style={{
                    width: '72px',
                    height: '54px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: index === currentIndex ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    transition: 'all 0.2s ease',
                    opacity: index === currentIndex ? 1 : 0.6,
                    background: '#f9fafb',
                    position: 'relative'
                  }}>
                    {isVideoFile(mediaItem) ? (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#e5e7eb',
                        color: '#6b7280'
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    ) : (
                      <img
                        src={getImageUrl(mediaItem)}
                        alt={file?.title || `Thumbnail ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* Lightbox Modal */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.92)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px'
          }}
          onClick={closeModal}
        >
          <div style={{
            position: 'relative',
            maxWidth: '95vw',
            maxHeight: '90vh',
            width: '100%'
          }}>
            <Swiper
              modules={[Navigation, Pagination, Zoom]}
              spaceBetween={0}
              navigation={true}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              zoom={true}
              initialSlide={currentIndex}
              style={{
                width: '100%',
                height: '85vh',
                '--swiper-navigation-color': '#fff',
                '--swiper-pagination-color': '#3b82f6',
                '--swiper-navigation-size': '28px',
                borderRadius: '12px',
                overflow: 'hidden'
              } as any}
            >
              {media.map((mediaItem, index) => {
                const file = getDirectusFile(mediaItem);
                const itemId = file?.id || (mediaItem as any).id || index;

                return (
                  <SwiperSlide key={`modal-${itemId}`}>
                    <div className="swiper-zoom-container" style={{ background: '#000' }}>
                      {isVideoFile(mediaItem) ? (
                        <video
                          src={getImageUrl(mediaItem)}
                          controls
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                          poster={getVideoThumbnail(mediaItem)}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={getImageUrl(mediaItem)}
                          alt={file?.title || `Project media ${index + 1}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Close button */}
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '-56px',
                right: '0',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Custom Swiper Styles */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(0, 0, 0, 0.2) !important;
          opacity: 1 !important;
        }

        .swiper-pagination-bullet-active {
          background: #3b82f6 !important;
        }

        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }

        .swiper-zoom-container {
          cursor: zoom-in;
        }

        .swiper-zoom-container img {
          cursor: pointer;
        }
      `}</style>
    </>
  );
}