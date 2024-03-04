import { Pressable, PressableProps, Text } from 'react-native';

const stylesheet = {
  title: 'font-semibold',
};

interface ExPressableProps extends PressableProps {
  title: string;
  colorScheme?: string;
}

const getColorScheme = (
  scheme: string
): { pressable: string; title: string } => {
  const stylesheet = {
    pressable:
      'w-full flex items-center justify-center round rounded-full h-[63px]',
    title: 'font-semibold ',
  };
  switch (scheme) {
    case 'primary':
      return {
        pressable: `${stylesheet.pressable} bg-blue-primary`,
        title: `${stylesheet.title} text-primary`,
      };
    default:
      return {
        pressable: `${stylesheet.pressable} bg-white`,
        title: `${stylesheet.title} `,
      };
  }
};

const ExPressable = ({
  title,
  colorScheme = 'primary',
  ...res
}: ExPressableProps) => {
  const { pressable, title: titleStyle } = getColorScheme(colorScheme);
  return (
    <Pressable className={pressable} {...res}>
      <Text className={titleStyle}>{title}</Text>
    </Pressable>
  );
};

export default ExPressable;
