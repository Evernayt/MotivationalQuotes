import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {QUOTE_ROUTE} from './src/constants/routes';
import {Quote} from './src/screens';

export type RootStackParamList = {
  QUOTE_ROUTE: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={QUOTE_ROUTE}>
        <Stack.Screen name={QUOTE_ROUTE} component={Quote} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
