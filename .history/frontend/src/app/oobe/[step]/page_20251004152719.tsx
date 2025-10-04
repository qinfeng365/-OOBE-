'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Button, Card, Spin, Alert } from 'antd';

interface OobePage {
  id: number;
  pageNumber: number;
  title: string;
  content: string;
}

interface Block {
  id: string;
  type: 'title' | 'text' | 'image';
  x: number;
  y: number;
  w: number;
  h: number;
  content: string;
}

interface CanvasSettings {
  width: number;
  height: number;
  backgroundUrl?: string;
}

function parseDocument(content: string): { canvas?: CanvasSettings; blocks?: Block[] } {
  try {
    const data = JSON.parse(content);
    if (Array.isArray(data)) {
      return { blocks: data as Block[] };
    } else if (data && typeof data === 'object' && Array.isArray((data as any).blocks)) {
      const doc = data as any;
      return {
        canvas: {
          width: typeof doc.canvas?.width === 'number' ? doc.canvas.width : 1024,
          height: typeof doc.canvas?.height === 'number' ? doc.canvas.height : 576,
          backgroundUrl: typeof doc.canvas?.backgroundUrl === 'string' ? doc.canvas.backgroundUrl : undefined,
        },
        blocks: doc.blocks as Block[],
      };
    }
  } catch { /* ignore parse error */ }
  return {};
}

const OobeStepPage = () => {
  const router = useRouter();
  const params = useParams();
  const step = Number(params.step);

  const [pages, setPages] = useState<OobePage[]>([]);
  const [currentPage, setCurrentPage] = useState<OobePage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/v1/oobe-pages');
        const sortedPages = response.data.sort((a: OobePage, b: OobePage) => a.pageNumber - b.pageNumber);
        setPages(sortedPages);
        setError(null);
      } catch (err) {
        setError('Failed to load page data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  useEffect(() => {
    if (pages.length > 0 && step) {
      const page = pages.find(p => p.pageNumber === step);
      setCurrentPage(page || null);
    }
  }, [pages, step]);

  const handlePrev = () => {
    if (step > 1) {
      router.push(`/oobe/${step - 1}`);
    }
  };

  const handleNext = () => {
    const nextStep = step + 1;
    const nextPage = pages.find(p => p.pageNumber === nextStep);
    if (nextPage) {
      router.push(`/oobe/${nextStep}`);
    } else {
      // Optional: Redirect to a completion page or back to the start
      router.push('/admin');
    }
  };

  if (loading) {
    return <div className="oobe-container"><Spin size="large" /></div>;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!currentPage) {
    return <Alert message="Error" description="Page not found." type="error" showIcon />;
  }

  const isFirstStep = step === 1;
  const isLastStep = !pages.some(p => p.pageNumber === step + 1);

  // Compute card width from canvas settings to override default .oobe-card width:860px
  const docForStyle = parseDocument(currentPage.content);
  const canvasForStyle = docForStyle.canvas ?? { width: 1024, height: 576 };

  return (
    <div className="oobe-container">
      <Card
        className="oobe-card"
        title={currentPage.title}
        style={{ width: `min(${canvasForStyle.width}px, 95vw)`, margin: '0 auto' }}
      >
        {(() => {
          const doc = parseDocument(currentPage.content);
          const canvas = doc.canvas ?? { width: 1024, height: 576, backgroundUrl: undefined };
          const blocks: Block[] | undefined = doc.blocks;

          if (blocks && blocks.length > 0) {
            return (
              <div
                style={{
                  position: 'relative',
                  width: `min(${canvas.width}px, 95vw)`,
                  aspectRatio: `${canvas.width} / ${canvas.height}`,
                  backgroundImage: canvas.backgroundUrl ? `url(${canvas.backgroundUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              >
                {blocks.map((b: Block) => (
                  <div
                    key={b.id}
                    style={{
                      position: 'absolute',
                      left: `${(b.x / canvas.width) * 100}%`,
                      top: `${(b.y / canvas.height) * 100}%`,
                      width: `${(b.w / canvas.width) * 100}%`,
                      height: `${(b.h / canvas.height) * 100}%`,
                      overflow: 'hidden',
                      borderRadius: 8,
                      background: b.type === 'image' ? 'transparent' : 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {b.type === 'image' ? (
                      <img src={b.content} alt="" style={{ width: `min(${canvas.width}px, 95vw)`, height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div
                        style={{
                          padding: 12,
                          fontSize: b.type === 'title' ? 24 : 16,
                          fontWeight: b.type === 'title' ? 700 : 400,
                          lineHeight: 1.6,
                        }}
                      >
                        {b.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div className="oobe-content">
              <p>{currentPage.content}</p>
            </div>
          );
        })()}
        <div className="oobe-nav">
          <Button onClick={handlePrev} disabled={isFirstStep}>
            Previous
          </Button>
          <Button type="primary" onClick={handleNext}>
            {isLastStep ? 'Finish' : 'Next'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OobeStepPage;