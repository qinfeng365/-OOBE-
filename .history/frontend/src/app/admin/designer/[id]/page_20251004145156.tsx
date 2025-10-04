'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Button, Input, message, Spin, Alert, Space, Divider } from 'antd';
import { useParams, useRouter } from 'next/navigation';

interface OobePage {
  id: number;
  pageNumber: number;
  title: string;
  content: string;
}

type BlockType = 'title' | 'text' | 'image';

interface Block {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  w: number;
  h: number;
  content: string; // text or image url
}

const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576; // 16:9

const DesignerPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<OobePage | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const draggingRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const resp = await axios.get<OobePage>(`http://localhost:3000/api/v1/oobe-pages/${id}`);
        const p = resp.data;
        setPage(p);

        // Try parse content as JSON blocks
        try {
          const parsed = JSON.parse(p.content) as Block[];
          if (Array.isArray(parsed)) {
            setBlocks(parsed);
          } else {
            throw new Error('not array');
          }
        } catch {
          // fallback: build default blocks from title/content
          const defaults: Block[] = [];
          if (p.title) {
            defaults.push({
              id: genId(),
              type: 'title',
              x: 64,
              y: 64,
              w: 640,
              h: 80,
              content: p.title,
            });
          }
          if (p.content) {
            defaults.push({
              id: genId(),
              type: 'text',
              x: 64,
              y: 168,
              w: 800,
              h: 240,
              content: p.content,
            });
          }
          setBlocks(defaults);
        }

        setError(null);
      } catch (e) {
        console.error(e);
        setError('Failed to load page');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addBlock = (type: BlockType) => {
    const base: Block = {
      id: genId(),
      type,
      x: 64,
      y: 64,
      w: type === 'image' ? 320 : 640,
      h: type === 'image' ? 180 : type === 'title' ? 80 : 160,
      content: type === 'image' ? 'https://via.placeholder.com/640x360?text=Image' : (type === 'title' ? 'Title' : 'Text...'),
    };
    setBlocks(prev => [...prev, base]);
    setSelectedId(base.id);
  };

  const onMouseDownBlock = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const block = blocks.find(b => b.id === id);
    if (!block) return;
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    draggingRef.current = { id, offsetX: mouseX - block.x, offsetY: mouseY - block.y };
    setSelectedId(id);
  };

  const onMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!draggingRef.current) return;
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    setBlocks(prev =>
      prev.map(b => {
        if (b.id !== draggingRef.current!.id) return b;
        let nx = mouseX - draggingRef.current!.offsetX;
        let ny = mouseY - draggingRef.current!.offsetY;
        // keep within canvas
        nx = Math.max(0, Math.min(nx, CANVAS_WIDTH - b.w));
        ny = Math.max(0, Math.min(ny, CANVAS_HEIGHT - b.h));
        return { ...b, x: nx, y: ny };
      }),
    );
  };

  const onMouseUpCanvas = () => {
    draggingRef.current = null;
  };

  const updateSelected = (patch: Partial<Block>) => {
    if (!selectedId) return;
    setBlocks(prev => prev.map(b => (b.id === selectedId ? { ...b, ...patch } : b)));
  };

  const onInputText = (id: string, e: React.FormEvent<HTMLDivElement>) => {
    const text = (e.target as HTMLDivElement).innerText;
    setBlocks(prev => prev.map(b => (b.id === id ? { ...b, content: text } : b)));
  };

  const onSave = async () => {
    if (!page) return;
    try {
      // sync title from first title block if exists
      const titleBlock = blocks.find(b => b.type === 'title');
      const newTitle = titleBlock ? titleBlock.content : page.title;

      const payload = {
        title: newTitle,
        content: JSON.stringify(blocks),
      };
      await axios.patch(`http://localhost:3000/api/v1/oobe-pages/${page.id}`, payload);
      message.success('Saved successfully');
    } catch (e) {
      console.error(e);
      message.error('Save failed');
    }
  };

  const onBack = () => {
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="oobe-container">
        <Spin size="large" />
      </div>
    );
  }
  if (error) {
    return <Alert type="error" message="Error" description={error} showIcon />;
  }
  if (!page) {
    return <Alert type="error" message="Error" description="Page not found" showIcon />;
  }

  const sel = blocks.find(b => b.id === selectedId) || null;

  return (
    <div className="oobe-container" style={{ gap: 24, flexDirection: 'column' }}>
      <div style={{ width: CANVAS_WIDTH, maxWidth: '95vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button onClick={onBack}>Back</Button>
          <Button type="primary" onClick={onSave}>Save</Button>
        </Space>
        <Space>
          <Button onClick={() => addBlock('title')}>Add Title</Button>
          <Button onClick={() => addBlock('text')}>Add Text</Button>
          <Button onClick={() => addBlock('image')}>Add Image</Button>
        </Space>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Canvas */}
        <div
          ref={canvasRef}
          className="oobe-card"
          style={{
            position: 'relative',
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            maxWidth: '95vw',
          }}
          onMouseMove={onMouseMoveCanvas}
          onMouseUp={onMouseUpCanvas}
          onMouseLeave={onMouseUpCanvas}
          onClick={() => setSelectedId(null)}
        >
          {blocks.map((b) => (
            <div
              key={b.id}
              onMouseDown={(e) => onMouseDownBlock(e, b.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(b.id);
              }}
              style={{
                position: 'absolute',
                left: b.x,
                top: b.y,
                width: b.w,
                height: b.h,
                border: selectedId === b.id ? '2px solid #5AA3E8' : '1px solid rgba(0,0,0,0.14)',
                borderRadius: 8,
                background: b.type === 'image' ? 'transparent' : 'rgba(255,255,255,0.85)',
                boxShadow: selectedId === b.id ? '0 0 0 2px rgba(90,163,232,0.25)' : 'none',
                padding: b.type === 'image' ? 0 : 12,
                overflow: 'hidden',
                cursor: 'move',
              }}
            >
              {b.type === 'title' && (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => onInputText(b.id, e)}
                  style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, outline: 'none' }}
                >
                  {b.content}
                </div>
              )}
              {b.type === 'text' && (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => onInputText(b.id, e)}
                  style={{ fontSize: 18, lineHeight: 1.7, outline: 'none', height: '100%' }}
                >
                  {b.content}
                </div>
              )}
              {b.type === 'image' && (
                <img
                  src={b.content}
                  alt="block-img"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Properties panel */}
        <div className="oobe-card" style={{ width: 340, padding: 16 }}>
          <div className="oobe-title">Properties</div>
          <Divider style={{ margin: '12px 0' }} />
          {!sel && <div style={{ color: 'var(--neutral-foreground-secondary)' }}>Select a block on canvas to edit its properties</div>}
          {sel && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ gridColumn: '1 / span 2', marginBottom: 8, color: 'var(--neutral-foreground-secondary)' }}>
                Type: {sel.type}
              </div>

              <label>X</label>
              <Input
                type="number"
                value={sel.x}
                onChange={(e) =>
                  updateSelected({ x: clamp(Number(e.target.value), 0, CANVAS_WIDTH - sel.w) })
                }
              />

              <label>Y</label>
              <Input
                type="number"
                value={sel.y}
                onChange={(e) =>
                  updateSelected({ y: clamp(Number(e.target.value), 0, CANVAS_HEIGHT - sel.h) })
                }
              />

              <label>W</label>
              <Input
                type="number"
                value={sel.w}
                onChange={(e) =>
                  updateSelected({ w: clamp(Number(e.target.value), 40, CANVAS_WIDTH - sel.x) })
                }
              />

              <label>H</label>
              <Input
                type="number"
                value={sel.h}
                onChange={(e) =>
                  updateSelected({ h: clamp(Number(e.target.value), 40, CANVAS_HEIGHT - sel.y) })
                }
              />

              {sel.type === 'image' && (
                <>
                  <div style={{ gridColumn: '1 / span 2' }}>Image URL</div>
                  <Input
                    style={{ gridColumn: '1 / span 2' }}
                    value={sel.content}
                    onChange={(e) => updateSelected({ content: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function clamp(n: number, min: number, max: number) {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(n, max));
}

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

export default DesignerPage;