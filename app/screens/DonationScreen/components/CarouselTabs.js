import React from 'react';
import {View, FlatList, I18nManager} from 'react-native';
import TabItem from '../../../components/TabItem';

export default function CarouselTabs({
  tabsData = [],
  setCurrentTab,
  currentTab,
  setWithFilter,
}) {
  const renderItem = ({item: tab}) => {
    if (tab.hide) {
      tab.withFilter ? setWithFilter(true) : setWithFilter(false);
      setCurrentTab(tab.name);
      return null;
    }
    return (
      <TabItem
        isActive={currentTab === tab.name}
        label={tab.label}
        icon={tab.icon}
        onPress={() => {
          tab.withFilter ? setWithFilter(true) : setWithFilter(false);
          setCurrentTab(tab.name);
        }}
      />
    );
  };

  return (
    <View
      style={{
        width: '90%',
        alignSelf: 'center',
      }}>
      <FlatList
        inverted={I18nManager.allowRTL}
        horizontal
        data={tabsData}
        renderItem={renderItem}
        keyExtractor={(tab, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
