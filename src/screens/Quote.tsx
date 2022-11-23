import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {ImageBackground, Linking, StyleSheet, Text, View} from 'react-native';
import {FIREBASE_URL_KEY, QUOTE_INDEX_KEY} from '../constants/storage';
import remoteConfig from '@react-native-firebase/remote-config';
import SplashScreen from 'react-native-splash-screen';
import DeviceInfo from 'react-native-device-info';
import {BG_IMAGES, ICONS} from '../constants/images';
import {QUOTES} from '../constants/data';
import greetings from '../helpers/greetings';
import randomNumber from '../helpers/randomNumber';
import Tts from 'react-native-tts';
import {IconButton} from '../components';

const maxQuoteIndex = QUOTES.length - 1;
const maxBgIndex = BG_IMAGES.length - 1;

const Quote = () => {
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [bgIndex, setBgIndex] = useState<number>(randomNumber(0, maxBgIndex));
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    AsyncStorage.getItem(FIREBASE_URL_KEY).then(path =>
      remoteConfig()
        .fetchAndActivate()
        .then(() => loadFire(path)),
    );
    AsyncStorage.getItem(QUOTE_INDEX_KEY).then(index =>
      setQuoteIndex(index ? Number(index) : 0),
    );

    Tts.setDefaultLanguage('en-US');
    Tts.addEventListener('tts-finish', listeningFinished);

    return () => {
      Tts.removeAllListeners('tts-finish');
    };
  }, []);

  const loadFire = (path: string | null) => {
    if (path) {
      Linking.openURL(path);
    } else {
      const url = remoteConfig().getValue('url').asString();
      DeviceInfo.isEmulator().then(isEmulator => {
        if (!isEmulator) {
          Linking.openURL(url);
          AsyncStorage.setItem(FIREBASE_URL_KEY, url);
        }
      });
    }

    SplashScreen.hide();
  };

  const getQuote = () => {
    setBgIndex(randomNumber(0, maxBgIndex));

    if (quoteIndex === maxQuoteIndex) {
      setQuoteIndex(0);
    } else {
      AsyncStorage.setItem(QUOTE_INDEX_KEY, `${quoteIndex + 1}`);
      setQuoteIndex(prevState => prevState + 1);
    }
  };

  const listenText = () => {
    if (isPlaying) {
      Tts.stop();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    Tts.speak(`${QUOTES[quoteIndex].quote}.. ${QUOTES[quoteIndex].author}`);
  };

  const listeningFinished = () => {
    setIsPlaying(false);
  };

  return (
    <ImageBackground style={styles.container} source={BG_IMAGES[bgIndex]}>
      <Text style={[styles.textShadow, styles.title]}>{greetings()}</Text>
      <View style={styles.quoteContainer}>
        <Text
          adjustsFontSizeToFit={true}
          style={[styles.textShadow, styles.quote]}>
          {QUOTES[quoteIndex].quote}
        </Text>
        <Text style={[styles.textShadow, styles.author]}>
          — {QUOTES[quoteIndex].author}
        </Text>
        <View style={styles.controls}>
          <IconButton
            icon={isPlaying ? ICONS.stopIcon : ICONS.playIcon}
            containerStyle={{marginRight: 16}}
            onPress={listenText}
          />
          <IconButton icon={ICONS.nextIcon} onPress={getQuote} />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'space-between',
  },
  quoteContainer: {
    height: 500,
    justifyContent: 'flex-end',
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
    color: 'white',
  },
  title: {
    fontSize: 32,
  },
  quote: {
    fontSize: 42,
    marginBottom: 24,
  },
  author: {
    fontSize: 24,
    textAlign: 'right',
    fontStyle: 'italic',
  },
  link: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
});

export default Quote;
