import React, { useState } from 'react';
import { Layout, Button, Input, Typography, Space, Card, Row, Col } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './App.css';

const { Title, Text } = Typography;
const { Content } = Layout;

function App() {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setResult(`You typed: ${e.target.value}`);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '50px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1}>ThisInterview App</Title>
          
          <Card title="Counter Component">
            <Space>
              <Button icon={<MinusOutlined />} onClick={decrement}>Decrease</Button>
              <Text strong>{count}</Text>
              <Button icon={<PlusOutlined />} onClick={increment}>Increase</Button>
            </Space>
          </Card>

          <Card title="Input Component">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Input 
                  placeholder="Type something..." 
                  value={inputValue}
                  onChange={handleInputChange}
                />
              </Col>
              <Col span={24}>
                <Text>{result}</Text>
              </Col>
            </Row>
          </Card>
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
