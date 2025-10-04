'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Result, Button } from 'antd';

export default function DesignerIndex() {
  const router = useRouter();

  return (
    <div className="oobe-container">
      <Result
        status="info"
        title="请选择要设计的页面"
        subTitle="请从管理后台列表点击 Design 按钮，或访问 /admin/designer/{id}（id 可以是主键或页码）。"
        extra={[
          <Button type="primary" key="admin" onClick={() => router.push('/admin')}>
            返回管理后台
          </Button>,
        ]}
      />
    </div>
  );
}