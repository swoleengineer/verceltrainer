import { useEffect } from 'react';
import { Card, Typography, List, Button } from 'antd'
import type { NextPage } from 'next';
import Link from 'next/link';
import Layout from '../components/layout';
import { getAllDays } from '../config/day';
import useSwr from 'swr'
const { Title } = Typography;

const daysList: Array<{
  day: string;
  title: string;
  isRest?: boolean;
}> = [{
  day: '1',
  title: '-'
}, {
  day: '2',
  title: '-'
}, {
  day: '3',
  title: '-'
}, {
  day: '4',
  title: 'rest',
  isRest: true
}, {
  day: '5',
  title: '-'
}, {
  day: '6',
  title: '-'
}, {
  day: '7',
  title: 'Rest',
  isRest: true
}]
const Home: NextPage = () => {
  const { data: days = []} = useSwr('home', () => getAllDays())
  const daysMap = days.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.day]: curr
    }
  }, {})
  return (
    <Layout
      title='My Training Plan'
    >
      <List
        size='small'
        dataSource={daysList.map(day => ({ ...day, ...(daysMap[day.day] || {})}))}
        renderItem={(item: any, index) => {
          const { title, isRest = false, day } = item;
          return (
            <List.Item
              key={index}
              extra={(
                <>
                  <Link
                    key={'edit_btn'}
                    href={'/day/[day]'}
                    as={`/day/${day}`}
                    passHref={true}
                  >
                    <Button
                      type='link'
                      shape='round'
                      size='small'
                      style={{
                        color: `rgba(0,0,0,.5)`
                      }}
                    >
                      Edit
                    </Button>
                  </Link>
                  <Link
                    key={'edit_btn'}
                    href={{
                      pathname: '/day/[day]',
                      query: { train: true }
                    }}
                    as={`/day/${day}?train=true`}
                    passHref={true}
                  >
                    <Button
                      shape='round'
                      key={'active_btn'}
                      size='small'
                      disabled={isRest || !title || title === '-'}
                    >
                      Start
                    </Button>
                  </Link>
                  
                </>
              )}
            >
              <List.Item.Meta
                title={`Day ${day}`}
                description={title}
              />
            </List.Item>
          );
        }}
      />
    </Layout>
  )
}

export default Home
