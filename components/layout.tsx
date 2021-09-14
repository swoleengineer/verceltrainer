import React from 'react';

import { Card, Typography, List, Button, PageHeader, PageHeaderProps } from 'antd'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router';
const { Title } = Typography;

const LayoutComponent = ({ children, title, after, subTitle }: any) => {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const headProps: PageHeaderProps = { title, subTitle };
  if (!isHome) {
    headProps['onBack'] = () => router.back()
  }
  return (
    <div
      className={styles.pt_home_wrapper}
    >
      <div
        className={styles.pt_home_container}>
          <header
            className={styles.pt_home_header}
          >
            <PageHeader {...headProps} />
            {/* <Title level={2} >{title}</Title> */}
          </header>
          <Card

            style={{
              borderRadius: 16
            }}
          >
            {children}
          </Card>
          {after}
        </div>
    </div>
  );
}

export default LayoutComponent
