import {
  Image,
  ImageSourcePropType,
  Pressable,
  PressableProps,
  Text,
} from 'react-native';
import { getBtnColorScheme } from 'src/modules/shared/style/SharedProcessedStyle';

interface ExPressableProps extends PressableProps {
  title: string;
  colorScheme?: string;
  icon?: ImageSourcePropType;
  selected?: boolean;
}

const ExPressable = ({
  title,
  colorScheme = 'primary',
  icon,
  selected = false,
  ...res
}: ExPressableProps) => {
  const { pressable, title: titleStyle } = getBtnColorScheme(
    selected ? 'primary' : colorScheme
  );

  return (
    <Pressable className={pressable} {...res}>
      {icon && <Image source={icon}></Image>}
      <Text className={titleStyle}>{title}</Text>
    </Pressable>
  );
};

export default ExPressable;
