import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../Context/AuthContext';
import TabsNavigation from './TabsNavegation';
import StackNavigation from './StackNavegation'; // Tu stack con el Login/Register

export default function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1d6395" />
      </View>
    );
  }

  return user ? <TabsNavigation /> : <StackNavigation />;
}