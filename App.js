import { useState ,useEffect } from 'react';
import { Dimensions,StyleSheet, Text, View, ScrollView, ActivityIndicator} from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';
const SCREEN_WIDTH = Dimensions.get('window').width;
const API_KEY ="8d5239160dee3a59639f541c87fc9698";
const icons = {
  "Clouds" :"cloudy",
  "Clear" : "day-sunny",
  "Rain" : "rain"
}

export default function App() {
  const [city, setCity] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [days, setDays] = useState([]);
  const getWeather = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setErrorMsg("실패했어요...");
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:3});
    const [{city}] = await Location.reverseGeocodeAsync({latitude, longitude});
    setCity(city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_KEY}`);
    const json = await response.json();
    await setDays(json.daily);
    }
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled showsHorizontalScrollIndicator={false} horizontal contentContainerStyle={styles.weather}>
        {days.length === 0 ? 
        (<View style={{ width: SCREEN_WIDTH, alignItems: 'center'}}>
          <ActivityIndicator size='large' color='white' />
        </View>
        ) : ( 
          days.map((day, index) => (
          <View key={index} style={styles.day}>
            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}°</Text>
            <View style={styles.box}>
              <View>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              </View>
              <View style={styles.iconsBox}>
                <Fontisto style={styles.icons} name={icons[day.weather[0].main]} size={24} color="black" />
              </View>
            </View>
          </View>
        ))
      )}
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet. create({
  container: {
    flex: 1,
    backgroundColor: 'tomato'
  },
  city: {
    flex: 1.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 60,
    color: 'white',
    fontWeight: '600'
  },
  day: {
    width: SCREEN_WIDTH,
    marginTop: 10,
    paddingLeft: 40,
    alignItems: 'flex-start',
  },
  temp: {
    fontSize: 120,
    color: 'white',
    fontWeight: '600',
  },
  description: {
    marginTop: -20,
    fontSize: 40,
    fontWeight: '500',
    color: 'white'
  },
  tinyText: {
    color: 'white',
    fontSize: 30,
  },
  icons: {
    color: 'white',
    fontSize: 60,
    marginRight: 40
  },
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH,
    paddingRight: 40,
  }
});

