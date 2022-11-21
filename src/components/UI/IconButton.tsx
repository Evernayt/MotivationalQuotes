import {FC} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

interface IconButtonProps extends TouchableOpacityProps {
  icon: ImageSourcePropType;
  containerStyle?: StyleProp<ViewStyle>;
}

const IconButton: FC<IconButtonProps> = ({icon, containerStyle, ...props}) => {
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} {...props}>
      <Image style={styles.icon} source={icon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  icon: {
    height: 24,
    width: 24,
  },
});

export default IconButton;
