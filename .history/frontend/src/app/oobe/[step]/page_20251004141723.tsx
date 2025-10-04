'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Button, Card, Spin, Alert } from 'antd';

interface OobePage {
  id: number;
  page_number: number;
  title: string;
  content: string;
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
        const response = await axios.get('http://localhost:3001/api/v1/oobe-pages');
        const sortedPages = response.data.sort((a: OobePage, b: OobePage) => a.page_number - b.page_number);
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
      const page = pages.find(p => p.page_number === step);
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
    const nextPage = pages.find(p => p.page_number === nextStep);
    if (nextPage) {
      router.push(`/oobe/${nextStep}`);
    } else {
      // Optional: Redirect to a completion page or back to the start
      router.push('/admin');
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!currentPage) {
    return <Alert message="Error" description="Page not found." type="error" showIcon />;
  }

  const isFirstStep = step === 1;
  const isLastStep = !pages.some(p => p.page_number === step + 1);

  return (
    <div style={{ padding: '50px' }}>
      <Card title={currentPage.title}>
        <p>{currentPage.content}</p>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
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