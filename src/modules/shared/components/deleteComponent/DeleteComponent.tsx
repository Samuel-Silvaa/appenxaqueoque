import { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";
import { Episode } from "src/infra/@types/app.types";

 export const DeleteComponent = ({
    item,
    onPress,
  }: {
    index: number;
    item: any;
    onPress: () => void;
  }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);

    return (
      <Animated.View
      key={item.id}
        style={{ opacity: fadeAnim }}
        className='h-full pr-4 flex  items-end justify-center'
      >
        <TouchableOpacity
          className='bg-error rounded-full'
          onPress={() => onPress()}
          style={{ padding: 12 }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Deletar</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };