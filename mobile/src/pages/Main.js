import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

import {
  requestPermissionsAsync,
  getCurrentPositionAsync,
} from 'expo-location';

function Main({ navigation }) {
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();
      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });
        const { latitude, longitude } = coords;
        setCurrentPosition({
          latitude,
          longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
    }
    loadInitialPosition();
  }, []);

  if (!currentPosition) {
    return null;
  }

  return (
    <>
      <MapView initialRegion={currentPosition} style={styles.map}>
        <Marker coordinate={{ latitude: -29.3982398, longitude: -45.23438 }}>
          <Image
            style={styles.avatar}
            source={{
              uri:
                'https://avatars3.githubusercontent.com/u/19177095?s=460&v=4',
            }}
          />
          <Callout
            onPress={() => {
              navigation.navigate('Profile', {
                github_username: 'leomarzochi',
              });
            }}
          >
            <View style={styles.callout}>
              <Text style={styles.name}>Leonardo</Text>
              <Text style={styles.bio}>Bio</Text>
              <Text style={styles.techs}>Techs</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
      <View style={styles.searchForm}>
        <TextInput
          style={styles.searchInput}
          placeholder='Buscar devs por techs...'
          placeholderTextColor='#999'
          autoCapitalize='words'
          autoCorrect={true}
        />
        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons name='my-location' size={20} color='#FFF' />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 3,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  callout: {
    width: 250,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bio: {
    color: '#666',
    marginTop: 5,
  },
  techs: {
    marginTop: 5,
  },
  searchForm: {},
});

export default Main;
