'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

interface OobePage {
  id: number;
  page_number: number;
  title: string;
  content: string;
}

const AdminPage = () => {
  const [pages, setPages] = useState<OobePage[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPage, setEditingPage] = useState<OobePage | null>(null);
  const [form] = Form.useForm();

  const fetchPages = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/oobe-pages');
      setPages(response.data.sort((a: OobePage, b: OobePage) => a.page_number - b.page_number));
    } catch (error) {
      message.error('Failed to fetch pages');
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleAdd = () => {
    setEditingPage(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (page: OobePage) => {
    setEditingPage(page);
    form.setFieldsValue(page);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/oobe-pages/${id}`);
      message.success('Page deleted successfully');
      fetchPages();
    } catch (error) {
      message.error('Failed to delete page');
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      values.page_number = Number(values.page_number);

      if (editingPage) {
        await axios.put(`http://localhost:3000/api/v1/oobe-pages/${editingPage.id}`, values);
        message.success('Page updated successfully');
      } else {
        await axios.post('http://localhost:3000/api/v1/oobe-pages', values);
        message.success('Page created successfully');
      }
      setIsModalVisible(false);
      fetchPages();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  const columns = [
    { title: 'Page Number', dataIndex: 'page_number', key: 'page_number', sorter: (a: OobePage, b: OobePage) => a.page_number - b.page_number },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Content', dataIndex: 'content', key: 'content' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: OobePage) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Are you sure to delete this page?" onConfirm={() => handleDelete(record.id)} okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleAdd}
        style={{ marginBottom: '16px' }}
      >
        Add Page
      </Button>
      <Table columns={columns} dataSource={pages} rowKey="id" />
      <Modal
        title={editingPage ? 'Edit Page' : 'Add Page'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical" name="oobe_page_form">
          <Form.Item name="page_number" label="Page Number" rules={[{ required: true, message: 'Please input the page number!' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true, message: 'Please input the title!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="content" label="Content" rules={[{ required: true, message: 'Please input the content!' }]}>
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPage;