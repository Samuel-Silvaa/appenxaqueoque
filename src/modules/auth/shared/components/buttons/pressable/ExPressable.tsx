import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { getBtnColorScheme } from 'src/modules/shared/style/SharedProcessedStyle';

interface ExPressableProps extends TouchableOpacityProps {
  title: string;
  colorScheme?: string;
  icon?: ImageSourcePropType;
  selected?: boolean;
  disabled?:boolean
}

const ExPressable = ({
  title,
  colorScheme = 'primary',
  icon,
  selected = false,
  disabled,
  ...res
}: ExPressableProps) => {
  const { pressable, title: titleStyle } = getBtnColorScheme(
    selected ? 'primary' : colorScheme
  );

  return (
    <TouchableOpacity className={pressable.concat(disabled ? ' opacity-50' : '')} {...res} disabled={disabled}>
      {icon && <Image source={icon}></Image>}
      <Text className={titleStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ExPressable;
