import { 
    View, 
    Text, 
    ImageBackground,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Image,
    Alert,
    Share // Import Share API
} from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { useEffect, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import TreeHero from '@/assets/images/hero.png';
import Banner from '@/assets/images/TOL-BANNER.png';
import DefaultAvatar from '@/assets/images/default-avatar.jpg';

const { width, height } = Dimensions.get('window');

// Storage helper functions
const storeData = async (key, value) => {
    try {
        await SecureStore.setItemAsync(key, value);
        return true;
    } catch (error) {
        console.error(`Error saving ${key}:`, error);
        return false;
    }
};

const getData = async (key) => {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (error) {
        console.error(`Error getting ${key}:`, error);
        return null;
    }
};

const ModernButton = ({ title, onPress, icon, color }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };
    
    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
        >
            <Animated.View style={[
                styles.button,
                { transform: [{ scale: scaleAnim }], backgroundColor: color || 'rgba(255, 255, 255, 0.15)' }
            ]}>
                <BlurView intensity={25} style={styles.buttonBlur}>
                    <View style={styles.buttonInner}>
                        <Ionicons name={icon} size={24} color="white" style={styles.buttonIcon} />
                        <Text style={styles.buttonText}>{title}</Text>
                    </View>
                </BlurView>
            </Animated.View>
        </TouchableOpacity>
    );
};

const ProfileModal = ({ visible, initialName, initialAvatar, onSubmit, onCancel }) => {
    const [name, setName] = useState(initialName || '');
    const [avatar, setAvatar] = useState(initialAvatar || null);
    const inputRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        if (visible) {
            setName(initialName || '');
            setAvatar(initialAvatar);
            
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                })
            ]).start();
            
            // Focus input after animation
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 300);
        }
    }, [visible, initialName, initialAvatar]);

    const handleSubmit = () => {
        if (name.trim().length > 0) {
            onSubmit(name, avatar);
        }
    };

    const pickImage = async () => {
        try {
            // Request media library permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert('Permission Required', 'Please allow access to your photo library to select a profile picture.');
                return;
            }
            
            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });
            
            if (!result.canceled && result.assets && result.assets[0]) {
                setAvatar(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to select image. Please try again.');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            statusBarTranslucent
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.modalContainer}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View 
                        style={[
                            styles.modalContent,
                            { 
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <Text style={styles.modalTitle}>Edit Your Profile</Text>
                        
                        <TouchableOpacity 
                            style={styles.avatarContainer}
                            onPress={pickImage}
                        >
                            {avatar ? (
                                <Image 
                                    source={{ uri: avatar }} 
                                    style={styles.avatar} 
                                />
                            ) : (
                                <Image 
                                    source={DefaultAvatar} 
                                    style={styles.avatar} 
                                />
                            )}
                            <View style={styles.editAvatarBadge}>
                                <Ionicons name="camera" size={14} color="white" />
                            </View>
                        </TouchableOpacity>
                        
                        <TextInput
                            ref={inputRef}
                            style={styles.nameInput}
                            placeholder="Your adventurer name"
                            placeholderTextColor="rgba(255,255,255,0.5)"
                            value={name}
                            onChangeText={setName}
                            onSubmitEditing={handleSubmit}
                            maxLength={20}
                        />
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[
                                    styles.submitButton,
                                    !name.trim() && styles.disabledButton
                                ]}
                                onPress={handleSubmit}
                                disabled={!name.trim()}
                            >
                                <Text style={styles.submitButtonText}>Save Profile</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

// New Share Modal Component
const ShareModal = ({ visible, onClose, playerName }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [visible]);
    
    const handleShare = async (platform) => {
        try {
            const message = playerName 
                ? `${playerName} is on an epic journey in Tree of Life! Join the adventure!` 
                : `Join me on an epic adventure in Tree of Life!`;
                
            const url = 'https://treeoflife-app.com'; // Replace with your actual app link
            
            // Platform-specific share messages
            let shareOptions = {
                message,
                url,
            };
            
            // You can customize messages for different platforms if needed
            if (platform === 'twitter') {
                shareOptions.message = `${message} #TreeOfLifeApp`;
            }
            
            const result = await Share.share(shareOptions);
            
            if (result.action === Share.sharedAction) {
                // Shared successfully
                onClose();
            }
        } catch (error) {
            Alert.alert('Error', 'Could not share content');
            console.error('Share error:', error);
        }
    };
    
    const handleShareLink = async () => {
        try {
            const message = playerName 
                ? `${playerName} is on an epic journey in Tree of Life! Join the adventure!` 
                : `Join me on an epic adventure in Tree of Life!`;
                
            const url = 'https://treeoflife-app.com'; // Replace with your actual app link
            
            const result = await Share.share({
                message: `${message} ${url}`,
                url: url,
            });
            
            if (result.action === Share.sharedAction) {
                // Shared successfully
                onClose();
            }
        } catch (error) {
            Alert.alert('Error', 'Could not share link');
            console.error('Share error:', error);
        }
    };
    
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            statusBarTranslucent
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalOverlay}>
                    <Animated.View 
                        style={[
                            styles.modalContent,
                            { 
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <Text style={styles.modalTitle}>Share Your Journey</Text>
                        
                        <View style={styles.shareButtonsContainer}>
                            <TouchableOpacity 
                                style={styles.shareButton}
                                onPress={() => handleShare('facebook')}
                            >
                                <Ionicons name="logo-facebook" size={28} color="white" />
                                <Text style={styles.shareButtonText}>Facebook</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.shareButton}
                                onPress={() => handleShare('twitter')}
                            >
                                <Ionicons name="logo-twitter" size={28} color="white" />
                                <Text style={styles.shareButtonText}>Twitter</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.shareButton}
                                onPress={() => handleShare('instagram')}
                            >
                                <Ionicons name="logo-instagram" size={28} color="white" />
                                <Text style={styles.shareButtonText}>Instagram</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <TouchableOpacity 
                            style={styles.linkShareButton}
                            onPress={handleShareLink}
                        >
                            <Ionicons name="link-outline" size={20} color="white" />
                            <Text style={styles.linkShareText}>Share Link</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={onClose}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </Modal>
    );
};

const App = () => {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const [nameModalVisible, setNameModalVisible] = useState(false);
    const [profileModalVisible, setProfileModalVisible] = useState(false);
    const [shareModalVisible, setShareModalVisible] = useState(false); // New state for share modal
    const [playerName, setPlayerName] = useState('');
    const [playerAvatar, setPlayerAvatar] = useState(null);

    useEffect(() => {
        // Load saved player profile on startup
        const loadPlayerProfile = async () => {
            try {
                const savedName = await getData('player_name');
                const savedAvatar = await getData('player_avatar');
                
                if (savedName) {
                    setPlayerName(savedName);
                }
                
                if (savedAvatar) {
                    setPlayerAvatar(savedAvatar);
                }
                
                // Animate the header if we have profile data
                if (savedName) {
                    Animated.timing(headerOpacity, {
                        toValue: 1,
                        duration: 500,
                        delay: 1000,
                        useNativeDriver: true,
                    }).start();
                }
            } catch (e) {
                console.error('Failed to load player profile', e);
            }
        };

        loadPlayerProfile();
        
        // Main screen animations
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(titleOpacity, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 6,
                tension: 20,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handleStartGame = () => {
        if (playerName) {
            router.push('/categories');
        } else {
            setNameModalVisible(true);
        }
    };

    const handleOpenProfile = () => {
        setProfileModalVisible(true);
    };
    
    // New function to open share modal
    const handleOpenShareModal = () => {
        setShareModalVisible(true);
    };

    const handleProfileSubmit = async (name, avatar) => {
        setPlayerName(name);
        setPlayerAvatar(avatar);
        setProfileModalVisible(false);
        
        // Save player profile
        await storeData('player_name', name);
        if (avatar) {
            await storeData('player_avatar', avatar);
        }
        
        // Animate the header appearance if it's not already visible
        if (headerOpacity._value !== 1) {
            Animated.timing(headerOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    };

    const handleInitialNameSubmit = async (name) => {
        setPlayerName(name);
        setNameModalVisible(false);
        
        // Save player name
        await storeData('player_name', name);
        
        // Animate the header appearance
        Animated.timing(headerOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            // Navigate after animation completes
            setTimeout(() => {
                router.push('/categories');
            }, 300);
        });
    };
    
    // Quick share function for the footer icons
    const handleQuickShare = async (platform) => {
        try {
            const message = playerName 
                ? `${playerName} is on an epic journey in Tree of Life! Join the adventure!` 
                : `Join me on an epic adventure in Tree of Life!`;
                
            const url = 'https://treeoflife-app.com'; // Replace with your actual app link
            
            // Platform-specific share messages
            let shareOptions = {
                message,
                url,
            };
            
            if (platform === 'twitter') {
                shareOptions.message = `${message} #TreeOfLifeApp`;
            }
            
            await Share.share(shareOptions);
        } catch (error) {
            console.error('Share error:', error);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor="transparent" />
            <ImageBackground
                source={TreeHero}
                style={styles.imageBg}
            >
                <View style={styles.overlay} />
                
                {/* Player profile header */}
                {playerName && (
                    <Animated.View 
                        style={[
                            styles.nameHeader,
                            { opacity: headerOpacity }
                        ]}
                    >
                        <TouchableOpacity onPress={handleOpenProfile}>
                            <BlurView intensity={20} style={styles.nameHeaderBlur}>
                                {playerAvatar ? (
                                    <Image 
                                        source={{ uri: playerAvatar }} 
                                        style={styles.headerAvatar} 
                                    />
                                ) : (
                                    <Ionicons name="person-circle-outline" size={22} color="white" />
                                )}
                                <Text style={styles.playerNameText}>{playerName}</Text>
                                <Ionicons name="chevron-down-outline" size={16} color="rgba(255,255,255,0.7)" style={styles.editIcon} />
                            </BlurView>
                        </TouchableOpacity>
                    </Animated.View>
                )}
                
                

                
                <Animated.View 
                    style={[
                        styles.buttonContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <ModernButton 
                        title="START JOURNEY"
                        icon="leaf-outline"
                        color="rgba(76, 175, 80, 0.6)"
                        onPress={handleStartGame}
                    />
                    
                    <ModernButton 
                        title="HOW TO PLAY"
                        icon="information-circle-outline"
                        onPress={() => router.push('/help')}
                    />
                    
                    <ModernButton 
                        title="ABOUT"
                        icon="people-outline"
                        onPress={() => router.push('/about')}
                    />
                    
                    {/* New Share button */}
                    <ModernButton 
                        title="SHARE"
                        icon="share-social-outline"
                        color="rgba(59, 130, 246, 0.6)" // Blue color for share button
                        onPress={handleOpenShareModal}
                    />
                </Animated.View>
                
          
                
                {/* Initial name prompt modal */}
                <ProfileModal 
                    visible={nameModalVisible}
                    initialName=""
                    initialAvatar={null}
                    onSubmit={handleInitialNameSubmit}
                    onCancel={() => setNameModalVisible(false)}
                />
                
                {/* Edit profile modal */}
                <ProfileModal 
                    visible={profileModalVisible}
                    initialName={playerName}
                    initialAvatar={playerAvatar}
                    onSubmit={handleProfileSubmit}
                    onCancel={() => setProfileModalVisible(false)}
                />
                
                {/* Share modal */}
                <ShareModal 
                    visible={shareModalVisible}
                    onClose={() => setShareModalVisible(false)}
                    playerName={playerName}
                />
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    nameHeader: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
        right: 16,
        zIndex: 10,
    },
    nameHeaderBlur: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: 'rgba(70, 70, 70, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    headerAvatar: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#ccc',
    },
    playerNameText: {
        color: 'white',
        fontWeight: '600',
        marginLeft: 6,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    editIcon: {
        marginLeft: 4,
    },
    banner: {
        width: width * 0.85,
        height: height * 0.25,
        position: 'absolute',
        top: height * 0.12,
    },
    buttonContainer: {
        width: width * 0.8,
        position: 'absolute',
        bottom: height * 0.2,
        gap: 16,
        alignSelf: 'center',
    },
    button: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonBlur: {
        overflow: 'hidden',
        borderRadius: 16,
    },
    buttonInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
        letterSpacing: 0.5,
    },
    buttonIcon: {
        marginRight: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        flexDirection: 'row',
        gap: 15,
    },
    socialButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.85,
        backgroundColor: 'rgba(40, 40, 40, 0.95)',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    modalTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    avatarContainer: {
        marginBottom: 24,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#555',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    editAvatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(76, 175, 80, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.7)',
    },
    nameInput: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        padding: 12,
        color: 'white',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginBottom: 24,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        backgroundColor: 'rgba(150, 150, 150, 0.2)',
    },
    cancelButtonText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '600',
    },
    submitButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(76, 175, 80, 0.7)',
        borderWidth: 1,
        borderColor: 'rgba(76, 175, 80, 0.9)',
    },
    disabledButton: {
        backgroundColor: 'rgba(76, 175, 80, 0.3)',
        borderColor: 'rgba(76, 175, 80, 0.4)',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    
    // Share Modal specific styles
    shareButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 24,
    },
    shareButton: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        width: width * 0.22,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    shareButtonText: {
        color: 'white',
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
    },
    linkShareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    linkShareText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: '600',
    },
    closeButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        backgroundColor: 'rgba(150, 150, 150, 0.3)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    closeButtonText: {
        color: 'white',
        fontWeight: '600',
    }
});

export default App;