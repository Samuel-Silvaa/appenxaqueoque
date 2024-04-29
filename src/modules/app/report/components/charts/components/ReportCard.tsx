import { Text, View } from 'react-native';
const stylesheet = {
  wrapper:
    'min-h-[200px] h-[300px] w-full rounded-[25px] bg-white shadow-sm my-4 ',
  header:
    'bg-primary h-[10%] w-full rounded-t-[25px] flex-row justify-between items-center px-4',
  status: 'w-[26px] h-[26px] rounded-full',
  contentWrapper:
    'h-[85%] w-full p-[28px] flex-col justify-between items-center',
  content: 'bg-primary w-full rounded-[16px] p-6 flex-col justify-around ',
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
      <View className={stylesheet.header + ' bg-beige-primary/50 h-[50px]'}>
        <Text className='font-semibold text-black py-5 text-md'>{title}</Text>
      </View>
      <View className={stylesheet.contentWrapper}>
        <View className={stylesheet.content}>
          {Array.isArray(description) &&
            description.map((desc, index) =>
              desc ? (
                <View key={index} className={stylesheet.summaryItem}>
                  <Text>•</Text>
                  <Text className='m-y-4 font-xs'> {desc} </Text>
                </View>
              ) : (
                <Text></Text>
              )
            )}
          {typeof description == 'string' && (
            <View key='desc@' className={stylesheet.summaryItem}>
              <Text>•</Text>
              <Text className='m-y-4 font-xs'> {description} </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
