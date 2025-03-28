import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WalkingBG from '@/assets/images/walking-keeps-you-healthy.webp';
import JoggingBG from '@/assets/images/jogging.jpg';
import RunningBG from '@/assets/images/running.jpg';


const Categories = () => { 

    const navigation = useNavigation();

    return(
        <SafeAreaView style={styles.main}>

            <ImageBackground style={styles.container}>
                <View style={styles.categoriesButtonWrapper}>
                    <TouchableOpacity 
                        style={styles.categoriesButton}
                        onPress={() => navigation.push('walking/Walking')}>
                        <ImageBackground
                            source={WalkingBG}
                            resizeMode='cover'
                            style={styles.imageContainer}>
                                <View style={styles.overlay}>
                                    <Text style={styles.imageText}>WALKING</Text> 
                                </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

                <View style={styles.categoriesButtonWrapper}>
                    <TouchableOpacity 
                        style={styles.categoriesButton}
                        onPress={() => navigation.push('jogging/jogging')}>
                        <ImageBackground
                            source={JoggingBG}
                            resizeMode='cover' 
                            style={styles.imageContainer}>
                                <View style={styles.overlay}>
                                    <Text style={styles.imageText}>JOGGING</Text>
                                </View>
                        </ImageBackground>  
                    </TouchableOpacity>
                </View>

                <View style={styles.categoriesButtonWrapper}>
                    <TouchableOpacity 
                        style={styles.categoriesButton}
                        onPress={() => navigation.push('running/running')}>
                        <ImageBackground
                            source={RunningBG}
                            resizeMode='cover' 
                            style={styles.imageContainer}>
                                <View style={styles.overlay}>
                                    <Text style={styles.imageText}>RUNNING</Text>
                                </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.backButton} 
                    onPress={() => navigation.goBack()}>
                    <Text
                        style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    main: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingTop: 30,
        justifyContent: 'start',
        alignItems: 'center',
        gap: 20,
        position: 'relative',
    },
    categoriesButtonWrapper: {
        width: '85%',
        height: '20%',
        
    },
    categoriesButton: {
      
        borderRadius: 10,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    backButton: {
        position: 'absolute',
        bottom: "5%",
        right: "7%",
        width: '30%',
        height: '5%',
        backgroundColor: 'green',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        color: 'white',
        fontSize: 20,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Black overlay with 40% opacity
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },  
})

export default Categories;