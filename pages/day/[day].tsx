import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout';
import useSwr from 'swr';
import { Form, Input, Avatar, Divider, Button, Modal, Select, List, Tag, message } from 'antd';
import { useRouter } from 'next/router';
import { editSingleDay, getSingleDay } from '../../config/day';
import Api from '../../config/api';
import moment from 'moment';

const bodypartslist = ["back",
"cardio",
"chest",
"lower arms",
"lower legs",
"neck",
"shoulders",
"upper arms",
"upper legs",
"waist"]

interface NewExerciseProps {
  isvisible: boolean;
  processForm: {
    (selectedExercises: Array<any>): void;
  }
  onClose: { (): void }
  currenExercises: Array<any>
}
const NewExerciseForm = ({ isvisible, processForm, onClose, currenExercises }: NewExerciseProps) => {
  const [selectedBodyPart, setBodyPart] = useState('back');
  const [selectedExercises, setSelectedExercises] = useState(currenExercises);
  const { data } = useSwr(selectedBodyPart && selectedBodyPart, () => Api.get(selectedBodyPart as string).then(
    res => {
      const { data = [] } = res;
      return data;
    }
  ));
  return (
    <Modal
      visible={isvisible}
      okText={`Add exercise${selectedExercises.length !== 1 ? 's' : ''}`}
      onOk={() => processForm(selectedExercises)}
      onCancel={() => onClose()}
      title='Add Exercises'
      destroyOnClose={true}
      afterClose={() => onClose()}
    > 
      <Select
        onChange={value => setBodyPart(value)}
        value={selectedBodyPart}
        style={{ width: '100%'}}
      >
        {bodypartslist.map((bodyPart, i) => {
          return (
            <Select.Option
              key={i}
              value={bodyPart}
            >
              {bodyPart}
            </Select.Option>
          )
        })}
      </Select>
      <Divider />
      {(selectedExercises && selectedExercises.length > 0) && (
        <>
        {selectedExercises.map(exercise => {
          const { name } = exercise;
          return (
            <Tag
              closable={true}
              key={name}
              onClose={() => setSelectedExercises(selectedExercises.filter(x => x.name !== name))}
            >
              {name}
            </Tag>
          )
        })}
        <Divider />
        </>
      )}
      <List
        size='small'
        pagination={{
          pageSize: 5
        }}
        dataSource={data}
        renderItem={(exercise: any, i) => {
          const { name, target, gifUrl } = exercise || {};
          const isSelected: boolean = selectedExercises.find(selectedExercise => selectedExercise.name === name);
          if (isSelected) {
            return null;
          }
          return (
            <List.Item
              key={i}
              onClick={() => {
                setSelectedExercises(selectedExercises.concat(exercise))
              }}
            >
              <List.Item.Meta
                title={name}
                description={`Target: ${target}`}
                avatar={<Avatar src={gifUrl} />}
              />
            </List.Item>
          );
        }}
      />
    </Modal>
  );
}

const ExerciseComponent = ({exercise, activity = [], updateActivity: setActivity}: any) => {
  const { name } = exercise;
  
  return (
    <List
      size='small'
      style={{
        borderRadius: 8,
        marginBottom: 8
      }}
      header={(
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ flexGrow: 1 }}>{name}</span>
          <Button 
            size='small' 
            shape='round'
            onClick={() => {
              setActivity(activity.concat({
                weight: 0,
                reps: 0
              }))
            }}
            >
              Add Set
            </Button>
        </div>
      )}
      bordered={true}
      dataSource={activity}
      renderItem={(item: any, i) => {
        return (
          <List.Item key={i} >
            <Input
              size='small'
              placeholder='weight'
              value={item.weight}
              onChange={e => setActivity(activity.map((x: any, index: number) => index === i ? {
                ...x,
                weight: e.target.value
              } : x))}
              suffix='lb'
            />
            <Input
              size='small'
              placeholder='reps'
              value={item.reps}
              onChange={e => setActivity(activity.map((x: any, index: number) => index === i ? {
                ...x,
                reps: e.target.value
              } : x))}
              suffix='times'
            />
          </List.Item>
        )
      }}
    ></List>
  )
}

const DayComponent = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [dayData, setDayData] = useState<any>();
  const [activity, setActivity] = useState<any>({});
  const { day, train } = router.query;
  const { data: dayObject = [], error, mutate } = useSwr(day as string, getSingleDay);
  const [newExerciseFormVisible, setExerciseFormVisible] = useState<boolean>(false);
  useEffect(() => {
    setDayData(dayObject[0]);
    form.setFieldsValue(dayObject[0]);
  }, [dayObject]);
  const processForm = (values: { [key: string]: any }) => {
    editSingleDay({ ...values, day, exercises: dayData?.exercises || [] }).then(
      (res: any) => {
        message.success('Updated');
        mutate();
      },
      (err: Error) => {
        console.error(err);
        message.error('Error updating this Day')
      }
    )
  }
  if (train && train === 'true') {
    return (
      <Layout
        title={dayData?.title}
        subTitle={moment().format('MM/DD/YYYY')}
      >
        {dayData?.exercises?.map((exercise: any,i: number)=> {
          return (
            <ExerciseComponent
              exercise={exercise}
              key={i}
              activity={activity[exercise.name]}
              updateActivity={(newActivity: any) => setActivity({
                ...activity,
                [exercise.name]: newActivity
              })}
            />
          )
        })}
      </Layout>
    );
  }
  return (
    <Layout
      title={`Day ${day}`}
      after={(
        <Button
          shape='round'
          type='primary'
          style={{
            display: 'block',
            margin: '15px auto',
            width: '80%'
          }}
          onClick={() => form.submit()}
        >
          Save
        </Button>
      )}
    >
      <Form
        form={form}
        name='Day_form'
        initialValues={dayObject[0]}
        onFinish={processForm}
      >
        <Form.Item
          name='title'
          rules={[{
            required: true
          }]}
          label='Day title'
        >
          <Input
            placeholder='Enter Title (Legs)'
          />
        </Form.Item>
        <List
          header='Exercises'
          dataSource={(dayData?.exercises || [])}
          renderItem={(item: any, i) => {
            return (
              <List.Item
                key={item.name}
                extra={(
                  <Button
                    size='small'
                    onClick={() => setDayData({
                      ...(dayData || {}),
                      exercises: (dayData?.exercises || []).filter(({ name }: any) => name !== item.name)
                    })}
                    shape='round'
                  >
                    remove
                  </Button>
                )}
              >
                <List.Item.Meta
                  title={item.name}
                />
              </List.Item>
            );
          }}
        />
        <Button
          shape='round'
          onClick={() => {
            setExerciseFormVisible(true);
          }}
          style={{ width: '100%' }}
        >
          Add Exercise
        </Button>
      </Form>
      {newExerciseFormVisible && (
        <NewExerciseForm
          isvisible={newExerciseFormVisible}
          onClose={() => setExerciseFormVisible(false)}
          processForm={(newExercises) => {
            setDayData({
              ...dayData,
              exercises: newExercises
            });
            setExerciseFormVisible(false);
          }}
          currenExercises={dayData?.exercises || []}
        />
      )}
    </Layout>
  );
}

export default DayComponent;
