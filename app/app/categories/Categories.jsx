import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WalkingBG from '@/assets/images/walking-keeps-you-healthy.webp';

const Categories = () => { 

    const navigation = useNavigation(); // <-- Get navigation object

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.categoriesButtonWrapper}>
                <TouchableOpacity style={styles.categoriesButton}>
                    <ImageBackground
                        source={WalkingBG}
                        resizeMode='cover'
                        style={{width: '100%', height: '100%'}}>
                    <Text>Category 1</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
            <View style={styles.categoriesButtonWrapper}>
                <TouchableOpacity style={styles.categoriesButton}>
                    <Text>Category 2</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.categoriesButtonWrapper}>
                <TouchableOpacity style={styles.categoriesButton}>
                    <Text>Category 3</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.backButton} 
                onPress={() => navigation.goBack()}>
                <Text
                    style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        justifyContent: 'start',
        alignItems: 'center',
        gap: 20,
        position: 'relative',
    },
    categoriesButtonWrapper: {
        width: '85%',
        height: '15%',
    },
    categoriesButton: {
        borderColor: 'black',
        borderWidth: 1,
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
    }
})

export default Categories;