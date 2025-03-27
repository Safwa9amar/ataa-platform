import {createNativeStackNavigator} from '@react-navigation/native-stack';
import KibarMohsninScreeen from './screens/KibarMohsninScreeen';
import GeneralStatistics from './screens/GeneralStatistics';
import GivingPartners from './screens/GivingPartners';
import AtaaInNumbers from './screens/AtaaInNumbers';
import AmbassadorsScreen from './screens/AmbassadorsScreen';
import Charities from './screens/Charities';
import DefaultScreen from './screens/DefaultScreen';
import SupervisoryAuthorities from './screens/SupervisoryAuthorities';
import CompletedOpportunities from './screens/CompletedOpportunities';
import {useTheme} from '../../context/ThemeContext';
import { KibarMohsninProvider } from '../../context/KibarMohsninContext';
import AboutAtaa from './screens/AboutAtaa';

const HomeStack = createNativeStackNavigator();
const HomeScreen = () => {
  const {theme} = useTheme();
    // const { user } = useCredentials();

    // useEffect(() => {
    //   console.log("user:", user);
    // }, [user]);
  return (
    <KibarMohsninProvider>

    <HomeStack.Navigator
      screenOptions={{

        animation: 'slide_from_bottom',
        headerShown: false,
        contentStyle: {backgroundColor: theme.backgroundColor},
      }}
      initialRouteName="DefaultScreen">
      <HomeStack.Screen name="DefaultScreen" component={DefaultScreen} />
      <HomeStack.Screen
        name="KibarMohsninScreeen"
        component={KibarMohsninScreeen}
      />
      <HomeStack.Screen
        name="GeneralStatistics"
        component={GeneralStatistics}
      />
      <HomeStack.Screen
        name="GivingPartners"
        // options={{headerShown: false}}
        component={GivingPartners}
      />
      <HomeStack.Screen
        name="AtaaInNumbers"
        // options={{headerShown: false}}
        component={AtaaInNumbers}
      />
      <HomeStack.Screen name="CharitableSocieties" component={Charities} />
      <HomeStack.Screen
        name="AmbassadorsScreen"
        component={AmbassadorsScreen}
      />
      <HomeStack.Screen
        name="SupervisoryAuthorities"
        component={SupervisoryAuthorities}
      />
      <HomeStack.Screen
        name="AboutAtaa"
        component={AboutAtaa}
      />
      <HomeStack.Screen
        name="CompletedOpportunities"
        component={CompletedOpportunities}
      />
    </HomeStack.Navigator>
    </KibarMohsninProvider>

  );
};

export default HomeScreen;
