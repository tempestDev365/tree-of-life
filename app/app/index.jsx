import { 
    View, 
    Text, 
    ImageBackground,
    StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import StartButton from '../components/custom/StartButton';
import HelpButton from '../components/custom/HelpButton';
import AboutButton from '../components/custom/AboutButton';
import TreeHero from '@/assets/images/tree-of-life-hero.png';


const App = () => {

    const router = useRouter();

    return (
        <View
            style={styles.mainContainer}>
            <ImageBackground
                source={TreeHero}
                resizeMode='cover'
                style={styles.imageBg}
                >
                <View>
                    
                    <Text
                        style={styles.textTitle}>Tree Of Life
                    </Text>

                    <View style={styles.buttonContainer}>

                        <StartButton 
                            titleBtn="Start"
                            Btn={()=> router.push('/categories')}/>

                        <HelpButton
                            titleBtn="Help"
                            Btn={() => router.push('/help')}/>

                        <AboutButton
                            titleBtn="About"
                            Btn={() => router.push('/about')}/>

                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({

    mainContainer: {
        flex: 1,
    },
    
    imageBg: {
        flex: 1,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
    },

    textTitle: {
        fontSize: 50,
        fontWeight: 'bold',
    },

    buttonContainer: {
        marginTop: 20,
    }

})  



export default App;