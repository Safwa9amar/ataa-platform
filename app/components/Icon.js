import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIconsI from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeI from 'react-native-vector-icons/FontAwesome';
import FontAwesomeII from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIII from 'react-native-vector-icons/FontAwesome6';
import AntDesignI from 'react-native-vector-icons/AntDesign';
import IoniconsI from 'react-native-vector-icons/Ionicons';
import FeatherI from 'react-native-vector-icons/Feather';
import FontistoI from 'react-native-vector-icons/Fontisto';
import EntypoI from 'react-native-vector-icons/Entypo';
import React from 'react';

const MaterialCommunityIcons = props => <MaterialCommunityIconsI {...props} />;
const MaterialIcons = props => <MaterialIconsI {...props} />;
const FontAwesome5 = props => <FontAwesomeII {...props} />;
const FontAwesome6 = props => <FontAwesomeIII {...props} />;
const FontAwesome = props => <FontAwesomeI {...props} />;
const Fontisto = props => <FontistoI {...props} />;
const Ionicons = props => <IoniconsI {...props} />;
const Feather = props => <FeatherI {...props} />;
const Entypo = props => <EntypoI {...props} />;
export const AntDesign = props => <AntDesignI {...props} />;

export default {
  MaterialCommunityIcons,
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  AntDesign,
  Ionicons,
  Fontisto,
  Feather,
  Entypo,
};
