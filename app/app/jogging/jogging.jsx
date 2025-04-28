import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert,
  Animated,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Pedometer } from "expo-sensors";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  LEVEL: '@green_jogs_level',
  XP: '@green_jogs_xp',
  TREE_STAGE: '@green_jogs_tree_stage',
};

// Simple icon component to replace expo/vector-icons
const SimpleIcon = ({ name, size = 24, color = "#000" }) => {
  // Basic icons using Text component
  switch(name) {
    case "footsteps":
      return <Text style={{ fontSize: size, color }}>👣</Text>;
    case "route":
      return <Text style={{ fontSize: size, color }}>🛣️</Text>;
    case "clock":
      return <Text style={{ fontSize: size, color }}>⏱️</Text>;
    case "play":
      return <Text style={{ fontSize: size, color }}>▶️</Text>;
    case "stop":
      return <Text style={{ fontSize: size, color }}>⏹️</Text>;
    case "star":
      return <Text style={{ fontSize: size, color }}>⭐</Text>;
    case "tree":
      return <Text style={{ fontSize: size * 1.5, color }}>🌳</Text>;
    case "sapling":
      return <Text style={{ fontSize: size * 1.5, color }}>🌱</Text>;
    case "pine":
      return <Text style={{ fontSize: size * 1.5, color }}>🌲</Text>;
    default:
      return null;
  }
};

const JoggingStepCounter = () => {
  // Global refs for tracking subscriptions and intervals
  const pedometerSubscriptionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const mathTimerIntervalRef = useRef(null);
  const stepsCountRef = useRef(0); // Add ref for steps count

  // Game Configuration for Jogging Category
  const JOGGING_CONFIG = {
    minDistance: 1.0,  // 1000m
    minSteps: 1280,
    basePoints: 500,
    correctAnswerPoints: 500,
    extraPointsPer100m: 100
  };

  const [isAvailable, setIsAvailable] = useState(false);
  const [steps, setSteps] = useState(0);
  const [finalizedSteps, setFinalizedSteps] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mathProblem, setMathProblem] = useState("");
  const [mathAnswer, setMathAnswer] = useState(null);
  const [mathOptions, setMathOptions] = useState([]);
  const [mathTimer, setMathTimer] = useState(10);  // 10 seconds timer
  const [feedback, setFeedback] = useState("");
  const [level, setLevel] = useState(100); // Starting level is 100
  const [xp, setXp] = useState(2000000); // Setting high XP value
  const [treeStage, setTreeStage] = useState("Pine Tree");  // Master tree stage
  const [pulseAnim] = useState(new Animated.Value(1));
  const [stepGoalPercent, setStepGoalPercent] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Tree progression stages - adding a higher level stage for level 100
  const TREE_STAGES = [
    { maxLevel: 5, stage: "Sprout 🌱", icon: "sapling" },
    { maxLevel: 15, stage: "Small Oak Tree 🌱🌳", icon: "tree" },
    { maxLevel: 30, stage: "Pine Tree 🌲", icon: "pine" },
    { maxLevel: 99, stage: "Forest Grove 🌲🌳", icon: "pine" },
    { maxLevel: 1000, stage: "Pine Tree", icon: "pine" }, // Higher max level for level 100+
  ];

  // Jogging tips to rotate through
  const JOGGING_TIPS = [
    "Jogging 30 minutes per day can boost your cardiovascular endurance.",
    "Alternate between jogging and walking for better endurance building.",
    "Maintain good posture while jogging to prevent injuries.",
    "Breathe deeply and rhythmically to maximize oxygen intake.",
    "Jogging can help burn more calories than walking at the same distance."
  ];

  // Format time in minutes:seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Initialize with level 100 and bypass the loading of saved data
  useEffect(() => {
    // Set default values first to ensure they are used
    setLevel(100);
    setXp(2000000);
    setTreeStage("Pine Tree 🌲");
    setIsInitialized(true);

    // Immediately save these values to AsyncStorage to persist them
    const saveInitialData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.LEVEL, "100");
        await AsyncStorage.setItem(STORAGE_KEYS.XP, "2000000");
        await AsyncStorage.setItem(STORAGE_KEYS.TREE_STAGE, "Master Forest 🌲🌳🌲");
      } catch (error) {
        console.error('Error saving initial data:', error);
      }
    };
    
    saveInitialData();
    
    // Cleanup function when component unmounts
    return () => {
      cleanupSubscriptions();
    };
  }, []);

  // Cleanup all subscriptions and intervals
  const cleanupSubscriptions = () => {
    if (pedometerSubscriptionRef.current) {
      try {
        pedometerSubscriptionRef.current.remove();
      } catch (e) {
        console.error("Error removing pedometer subscription:", e);
      }
      pedometerSubscriptionRef.current = null;
    }
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    if (mathTimerIntervalRef.current) {
      clearInterval(mathTimerIntervalRef.current);
      mathTimerIntervalRef.current = null;
    }
  };

  // Animation for steps count
  useEffect(() => {
    if (isTracking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isTracking]);

  // Update step goal percentage
  useEffect(() => {
    const percent = Math.min(100, (steps / JOGGING_CONFIG.minSteps) * 100);
    setStepGoalPercent(percent);
    // Keep track of steps in ref for access in cleanup functions
    stepsCountRef.current = steps;
  }, [steps]);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % JOGGING_TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Handle tracking state changes
  useEffect(() => {
    const setupTracking = async () => {
      if (isTracking) {
        // Starting tracking - reset states
        setSteps(0);
        setFinalizedSteps(null);
        setTimer(0);
        
        // Check if pedometer is available
        const available = await Pedometer.isAvailableAsync();
        setIsAvailable(available);
        
        if (available) {
          try {
            // Clean up any existing subscriptions
            cleanupSubscriptions();
            
            // Set up new pedometer subscription
            console.log("Setting up new pedometer subscription");
            const subscription = Pedometer.watchStepCount(result => {
              console.log("New step count:", result.steps);
              setSteps(result.steps);
            });
            
            pedometerSubscriptionRef.current = subscription;
            
            // Set up timer
            timerIntervalRef.current = setInterval(() => {
              setTimer(prev => prev + 1);
            }, 1000);
            
          } catch (error) {
            console.error("Error setting up pedometer:", error);
            setIsTracking(false);
            Alert.alert("Error", "Could not start step tracking.");
          }
        } else {
          setIsTracking(false);
          Alert.alert("Error", "Pedometer is not available on this device.");
        }
      } else {
        // Stopping tracking - clean up is handled elsewhere
        console.log("Tracking stopped through useEffect");
      }
    };
    
    setupTracking();
    
    // Clean up subscriptions on unmount
    return () => {
      cleanupSubscriptions();
    };
  }, [isTracking]);

  const startTracking = () => {
    console.log("Starting tracking");
    setIsTracking(true);
  };

  const stopTracking = () => {
    console.log("Stopping tracking");
    
    // First capture the current steps before we clean up and reset states
    const currentSteps = stepsCountRef.current;
    
    // Stop tracking
    setIsTracking(false);
    
    // Show loading indicator
    setIsLoading(true);
    
    // Clean up subscriptions
    cleanupSubscriptions();
    
    // Use timeout to ensure UI updates properly
    setTimeout(() => {
      console.log("Finalizing steps:", currentSteps);
      setFinalizedSteps(currentSteps);
      setIsLoading(false);
      
      // Check if minimum requirements are met
      const distance = parseFloat(getDistance(currentSteps));
      if (currentSteps >= JOGGING_CONFIG.minSteps && distance >= JOGGING_CONFIG.minDistance) {
        generateMathProblem();
        setIsModalVisible(true);
        setFeedback("");
        setMathTimer(10);
        startMathTimer();
      } else {
        // Alert the user they haven't met the minimum requirements
        Alert.alert(
          "Not enough steps!",
          `You need at least ${JOGGING_CONFIG.minSteps} steps and ${JOGGING_CONFIG.minDistance}km to earn XP.`,
          [{ text: "Try Again" }]
        );
        resetTracking();
      }
    }, 3000);
  };

  const generateMathProblem = () => {
    // Slightly more complex math for jogging mode
    const num1 = Math.floor(Math.random() * 15) + 5;
    const num2 = Math.floor(Math.random() * 15) + 5;
    const operations = ["+", "-", "*"];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let answer;
    switch (operation) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "*":
        answer = num1 * num2;
        break;
    }
    
    const options = [answer, answer + 3, answer - 3].sort(() => Math.random() - 0.5);
    
    setMathProblem(`${num1} ${operation} ${num2} = ?`);
    setMathAnswer(answer);
    setMathOptions(options);
  };

  const startMathTimer = () => {
    let timeLeft = 10;
    
    // Clear any existing timer before setting a new one
    if (mathTimerIntervalRef.current) {
      clearInterval(mathTimerIntervalRef.current);
    }
    
    const timerInterval = setInterval(() => {
      timeLeft -= 1;
      setMathTimer(timeLeft);
      if (timeLeft === 0) {
        clearInterval(timerInterval);
        processGameOutcome(false);
      }
    }, 1000);

    // Store the interval reference in our useRef
    mathTimerIntervalRef.current = timerInterval;
  };

  const processGameOutcome = (isCorrect) => {
    // Clear the math timer interval
    if (mathTimerIntervalRef.current) {
      clearInterval(mathTimerIntervalRef.current);
      mathTimerIntervalRef.current = null;
    }
    
    // Calculate XP - but we'll maintain level 100
    let earnedXp = 0;
    const stepsToUse = finalizedSteps || stepsCountRef.current;
    const distance = parseFloat(getDistance(stepsToUse));
    
    // Only award XP if they've met the minimum requirements
    if (stepsToUse >= JOGGING_CONFIG.minSteps && distance >= JOGGING_CONFIG.minDistance) {
      earnedXp += JOGGING_CONFIG.basePoints; // Add base points for meeting requirements
      
      if (isCorrect) {
        earnedXp += JOGGING_CONFIG.correctAnswerPoints;
        const extraDistancePoints = Math.floor((distance - JOGGING_CONFIG.minDistance) / 0.1) * JOGGING_CONFIG.extraPointsPer100m;
        earnedXp += Math.max(0, extraDistancePoints);
      }
    }

    // Add XP but keep level at 100
    const newXp = xp + earnedXp;
    setXp(newXp);
    
    // Critical fix: ALWAYS enforce level 100, regardless of XP
    setLevel(100);
    setTreeStage("Master Forest 🌲🌳🌲");

    // Save these values immediately
    const saveUpdatedData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.LEVEL, "100");
        await AsyncStorage.setItem(STORAGE_KEYS.XP, newXp.toString());
        await AsyncStorage.setItem(STORAGE_KEYS.TREE_STAGE, "Master Forest 🌲🌳🌲");
      } catch (error) {
        console.error('Error saving updated data:', error);
      }
    };
    saveUpdatedData();

    // Show results
    if (isCorrect) {
      Alert.alert(
        "Great Job!", 
        `You earned ${earnedXp} XP!\nTotal XP: ${newXp}`,
        [{ text: "Continue" }]
      );
    } else {
      Alert.alert(
        "Time's Up!", 
        "No points earned this time. Keep trying!",
        [{ text: "OK" }]
      );
    }

    // Reset tracking
    resetTracking();
  };

  const checkMathAnswer = (selectedOption) => {
    // Clear the math timer interval
    if (mathTimerIntervalRef.current) {
      clearInterval(mathTimerIntervalRef.current);
      mathTimerIntervalRef.current = null;
    }

    if (selectedOption === mathAnswer) {
      setFeedback("✅ Correct! Well done!");
      processGameOutcome(true);
    } else {
      setFeedback(`❌ Incorrect! The correct answer was ${mathAnswer}`);
      processGameOutcome(false);
    }
    
    setIsModalVisible(false);
  };

  const resetTracking = () => {
    // Clean up any existing subscriptions and intervals
    cleanupSubscriptions();
    
    // Reset all tracking states
    setIsTracking(false);
    setSteps(0);
    setTimer(0);
    setFinalizedSteps(null);
    stepsCountRef.current = 0;
  };

  const getDistance = (stepsCount = steps) => {
    // Jogging step length (slightly longer than walking)
    const stepLength = 1.0;
    return ((stepsCount || 0) * stepLength / 1000).toFixed(2);
  };

  const getTreeIcon = () => {
    // Always return "pine" icon for level 100
    return "pine";
  };

  // Calculate XP progress - but for level 100, it's not really meaningful
  // This is just for visual display
  const xpProgress = 50; // Set to middle of progress bar

  // Don't render until data is loaded
  if (!isInitialized) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#F57C00" />
        <Text style={styles.loadingText}>Loading your Green Jogs...</Text>
      </View>
    );
  }

  // Determine if goal is achieved
  const isGoalAchieved = steps >= JOGGING_CONFIG.minSteps && parseFloat(getDistance()) >= JOGGING_CONFIG.minDistance;
  const goalText = isGoalAchieved ? "Goal Achieved!" : `Goal: ${JOGGING_CONFIG.minSteps} steps`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Green Jogs</Text>
            <View style={styles.levelContainer}>
              <SimpleIcon name="star" size={18} color="#FFD700" />
              <Text style={styles.levelText}>Level {level}</Text>
            </View>
          </View>

          {/* Tree Visualization */}
          <View style={styles.treeContainer}>
            <Text style={styles.treeStage}>{treeStage}</Text>
            <View style={styles.treeImageContainer}>
              <SimpleIcon 
                name={getTreeIcon()} 
                size={60} 
                color="#006400" // Dark green for the master level
              />
            </View>
          </View>

          {/* XP Progress */}
          <View style={styles.xpContainer}>
            <Text style={styles.xpText}>{xp} XP</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBar, { width: `${xpProgress}%` }]} />
              </View>
              <Text style={styles.progressText}>Master Level</Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <SimpleIcon name="footsteps" size={24} color="#333" />
              </Animated.View>
              <Text style={styles.statValue}>{steps}</Text>
              <Text style={styles.statLabel}>Steps</Text>
              <View style={styles.goalProgressContainer}>
                <View style={styles.goalProgressBackground}>
                  <View
                    style={[
                      styles.goalProgress,
                      { width: `${stepGoalPercent}%` }
                    ]}
                  />
                </View>
                <Text style={styles.goalText}>{goalText}</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <SimpleIcon name="route" size={24} color="#333" />
              <Text style={styles.statValue}>{getDistance()}</Text>
              <Text style={styles.statLabel}>km</Text>
              <Text style={styles.goalText}>Goal: {JOGGING_CONFIG.minDistance} km</Text>
            </View>

            <View style={styles.statCard}>
              <SimpleIcon name="clock" size={24} color="#333" />
              <Text style={styles.statValue}>{formatTime(timer)}</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
          </View>

          {/* Action Button - FIXED: Now uses direct function references instead of inline arrow functions */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              isTracking ? styles.stopButton : styles.startButton
            ]}
            onPress={isTracking ? stopTracking : startTracking}
            disabled={isLoading} // Disable button during loading
          >
            <Text style={styles.actionButtonText}>
              {isTracking ? "STOP TRACKING" : "START JOGGING"}
            </Text>
            <SimpleIcon
              name={isTracking ? "stop" : "play"}
              size={20}
              color="white"
            />
          </TouchableOpacity>

          {/* Health Tips Section */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Jogging Tip</Text>
            <Text style={styles.tipsText}>{JOGGING_TIPS[tipIndex]}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Loading Modal */}
      {isLoading && (
        <Modal transparent={true} visible={isLoading}>
          <View style={styles.modalContainer}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F57C00" />
              <Text style={styles.loadingText}>Finalizing steps...</Text>
            </View>
          </View>
        </Modal>
      )}

      {/* Math Problem Modal */}
      <Modal transparent={true} visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.mathModalContent}>
            <Text style={styles.mathModalTitle}>Brain Boost Challenge!</Text>
            <Text style={styles.mathProblem}>{mathProblem}</Text>
            
            <View style={styles.mathTimerContainer}>
              <View style={styles.mathTimerBackground}>
                <View 
                  style={[
                    styles.mathTimerProgress, 
                    { width: `${(mathTimer/10) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.mathTimerText}>{mathTimer}s</Text>
            </View>
            
            <View style={styles.mathOptionsContainer}>
              {mathOptions.map((option, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.mathOptionButton}
                  onPress={() => checkMathAnswer(option)}
                >
                  <Text style={styles.mathOptionText}>{option.toString()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {feedback !== "" && (
              <Text style={[
                styles.feedbackText, 
                feedback.includes("Correct") ? styles.correctFeedback : styles.incorrectFeedback
              ]}>
                {feedback}
              </Text>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 15,
    color: '#F57C00',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF3E0',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF3E0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
    backgroundColor: '#F57C00',
    borderRadius: 10,
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 5,
  },
  treeContainer: {
    alignItems: 'center',
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#FFF8E1',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  treeStage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 10,
  },
  treeImageContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  xpContainer: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#FFF9C4',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFF59D',
  },
  xpText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F57F17',
    marginBottom: 8,
  },
  progressBarContainer: {
    marginTop: 5,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700',
  },
  progressText: {
    fontSize: 12,
    marginTop: 5,
    color: '#F57F17',
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  goalProgressContainer: {
    width: '100%',
    marginTop: 8,
  },
  goalProgressBackground: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  goalProgress: {
    height: '100%',
    backgroundColor: '#F57C00',
  },
  goalText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  startButton: {
    backgroundColor: '#F57C00',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  tipsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  mathModalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mathModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F57C00',
    marginBottom: 15,
  },
  mathProblem: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
  },
  mathTimerContainer: {
    width: '100%',
    marginVertical: 15,
  },
  mathTimerBackground: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  mathTimerProgress: {
    height: '100%',
    backgroundColor: '#FFC107',
  },
  mathTimerText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'right',
  },
  mathOptionsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  mathOptionButton: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    margin: 5,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F57C00',
  },
  mathOptionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F57C00',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
  },
  correctFeedback: {
    backgroundColor: '#FFF8E1',
    color: '#E65100',
  },
  incorrectFeedback: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
});

export default JoggingStepCounter;