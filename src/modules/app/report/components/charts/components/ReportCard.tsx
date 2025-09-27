import { Fragment } from 'react';
import { Text, View } from 'react-native';
const stylesheet = {
  wrapper:
    'w-full rounded-[25px] bg-white dark:bg-d-blue-primary shadow-sm my-4 ',
  header: 'w-full rounded-t-[25px] flex-row justify-between items-center px-4',
  status: 'w-[26px] h-[26px] rounded-full',
  contentWrapper: 'w-full p-[28px] flex-col justify-between items-center',
  content:
    'bg-beige-primary/40 w-full rounded-[25px] p-6 flex-col justify-around ',
  summaryItem: 'flex-row gap-x-4 my-1',
};

export const ReportCard = ({
  title,
  description,
}: {
  title: string;
  description: string[] | string | null;
}) => {
  return (
    <View className={stylesheet.wrapper}>
      <View
        className={
          stylesheet.header +
          ' bg-beige-primary/50 dark:bg-d-blue-primary/50 h-[60px] '
        }
      >
        <Text className='font-semibold text-black dark:text-d-text-gray py-5 text-md'>
          {title}
        </Text>
      </View>
      <View className={stylesheet.contentWrapper}>
        <View className={stylesheet.content}>
          {Array.isArray(description) &&
            description.map((desc, index) =>
              desc ? (
                <View key={index} className={stylesheet.summaryItem}>
                  <Text className='dark:text-d-text-dark'>•</Text>
                  <Text className='m-y-4 font-xs dark:text-d-text-dark'>
                    {' '}
                    {desc}{' '}
                  </Text>
                </View>
              ) : (
                <Fragment></Fragment>
              )
            )}
          {typeof description == 'string' && (
            <View key='desc@' className={stylesheet.summaryItem}>
              <Text className='dark:text-d-text-dark'>•</Text>
              <Text className='m-y-4 font-xs dark:text-d-text-dark'>
                {' '}
                {description}{' '}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
