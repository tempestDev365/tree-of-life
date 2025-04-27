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
  LEVEL: '@green_runs_level',
  XP: '@green_runs_xp',
  TREE_STAGE: '@green_runs_tree_stage',
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
    case "forestry":
      return <Text style={{ fontSize: size * 1.5, color }}>🌴</Text>;
    default:
      return null;
  }
};

const RunningStepCounter = () => {
  // Global refs
  const pedometerSubscriptionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const mathTimerIntervalRef = useRef(null);
  const stepsCountRef = useRef(0); // Add ref for steps count

  // Game Configuration for Running Category
  const RUNNING_CONFIG = {
    minDistance: 1.5,  // 2000m
    minSteps: 1980,
    basePoints: 800,
    correctAnswerPoints: 750,
    extraPointsPer100m: 150
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
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [treeStage, setTreeStage] = useState("Sprout");  // Initial tree stage
  const [pulseAnim] = useState(new Animated.Value(1));
  const [stepGoalPercent, setStepGoalPercent] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Tree progression stages
  const TREE_STAGES = [
    { maxLevel: 5, stage: "Exotic Sprout 🌱", icon: "sapling" },
    { maxLevel: 15, stage: "Tropical Sapling 🌴", icon: "forestry" },
    { maxLevel: 30, stage: "Rainforest Tree 🌴🌴", icon: "forestry" },
    { maxLevel: 50, stage: "Lush Rainforest 🌴🌴🌴", icon: "forestry" },
  ];

  // Running tips to rotate through
  const RUNNING_TIPS = [
    "Proper running form includes keeping your head up and shoulders relaxed.",
    "Breathe in through your nose and out through your mouth while running.",
    "Running regularly helps strengthen your heart and lungs.",
    "Track your progress by time or distance, not just speed.",
    "Intervals of fast and slow running build endurance more effectively."
  ];

  // Format time in minutes:seconds
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Load saved data when app starts
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const savedLevel = await AsyncStorage.getItem(STORAGE_KEYS.LEVEL);
        const savedXp = await AsyncStorage.getItem(STORAGE_KEYS.XP);
        const savedTreeStage = await AsyncStorage.getItem(STORAGE_KEYS.TREE_STAGE);
        
        if (savedLevel) setLevel(parseInt(savedLevel));
        if (savedXp) setXp(parseInt(savedXp));
        if (savedTreeStage) setTreeStage(savedTreeStage);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading saved data:', error);
        // Continue with default values if loading fails
        setIsInitialized(true);
      }
    };
    
    loadSavedData();

    // Cleanup function when component unmounts
    return () => {
      cleanupSubscriptions();
    };
  }, []);

  // Save data whenever level, xp, or treeStage changes
  useEffect(() => {
    const saveData = async () => {
      if (!isInitialized) return;
      
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.LEVEL, level.toString());
        await AsyncStorage.setItem(STORAGE_KEYS.XP, xp.toString());
        await AsyncStorage.setItem(STORAGE_KEYS.TREE_STAGE, treeStage);
      } catch (error) {
        console.error('Error saving data:', error);
        Alert.alert(
          "Save Error", 
          "There was a problem saving your progress. Please check your storage permissions."
        );
      }
    };
    
    if (isInitialized) {
      saveData();
    }
  }, [level, xp, treeStage, isInitialized]);

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
    const percent = Math.min(100, (steps / RUNNING_CONFIG.minSteps) * 100);
    setStepGoalPercent(percent);
    // Keep track of steps in ref for access in cleanup functions
    stepsCountRef.current = steps;
  }, [steps]);

  // Rotate tips
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prevIndex) => (prevIndex + 1) % RUNNING_TIPS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup subscriptions and timers
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
            // First clean up any existing subscriptions
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
        // Stopping tracking - clean up
        console.log("Cleanup called from isTracking effect");
        cleanupSubscriptions();
      }
    };
    
    setupTracking();
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
      
      if (currentSteps >= RUNNING_CONFIG.minSteps && distance >= RUNNING_CONFIG.minDistance) {
        generateMathProblem();
        setIsModalVisible(true);
        setFeedback("");
        setMathTimer(10);
        startMathTimer();
      } else {
        Alert.alert("Goal Not Met", 
          `You need at least ${RUNNING_CONFIG.minSteps} steps and ${RUNNING_CONFIG.minDistance} km. You did: ${currentSteps} steps and ${distance} km`
        );
        resetTracking();
      }
    }, 1000);
  };

  const generateMathProblem = () => {
    // More complex math for running mode
    const num1 = Math.floor(Math.random() * 20) + 10;
    const num2 = Math.floor(Math.random() * 20) + 5;
    const operations = ["+", "-", "*", "/"];
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
      case "/":
        // Ensure clean division for easier mental math
        const product = num1 * num2;
        answer = num1;
        setMathProblem(`${product} ${operation} ${num2} = ?`);
        break;
      default:
        setMathProblem(`${num1} ${operation} ${num2} = ?`);
    }
    
    if (operation !== "/") {
      setMathProblem(`${num1} ${operation} ${num2} = ?`);
    }
    
    // Generate options with appropriate difficulty
    const options = [answer];
    
    // Add two wrong answers that are within a reasonable range
    while (options.length < 3) {
      const offset = Math.floor(Math.random() * 10) + 1;
      const sign = Math.random() < 0.5 ? 1 : -1;
      const wrongAnswer = answer + (sign * offset);
      
      // Ensure no duplicates
      if (!options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Randomize the order of options
    const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
    
    setMathAnswer(answer);
    setMathOptions(shuffledOptions);
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
    
    // Calculate XP
    let earnedXp = 0;
    const stepsToUse = finalizedSteps || stepsCountRef.current;
    const distance = parseFloat(getDistance(stepsToUse));
    
    if (isCorrect) {
      // Base points for correct answer
      earnedXp += RUNNING_CONFIG.correctAnswerPoints;
      
      // Extra points for additional distance
      const extraDistancePoints = Math.floor((distance - RUNNING_CONFIG.minDistance) / 0.1) * RUNNING_CONFIG.extraPointsPer100m;
      earnedXp += Math.max(0, extraDistancePoints);
    }

    // Update XP and check for level up
    const newXp = xp + earnedXp;
    setXp(newXp);

    // Determine new level
    const newLevel = Math.floor(newXp / 20000) + 1;
    const oldLevel = level;
    setLevel(newLevel);
    
    // Check if leveled up
    const leveledUp = newLevel > oldLevel;

    // Determine tree stage
    const currentTreeStage = TREE_STAGES.find(stage => newLevel <= stage.maxLevel)?.stage || "Lush Rainforest 🌴🌴🌴";
    setTreeStage(currentTreeStage);

    // Show results
    if (isCorrect) {
      if (leveledUp) {
        Alert.alert(
          "Level Up!", 
          `Congratulations! You reached level ${newLevel}!\nYou earned ${earnedXp} XP!`,
          [{ text: "Awesome!" }]
        );
      } else {
        Alert.alert(
          "Great Job!", 
          `You earned ${earnedXp} XP!\nTotal XP: ${newXp}`,
          [{ text: "Continue" }]
        );
      }
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
    // Running step length (longer than walking/jogging)
    const stepLength = 1.2;
    return ((stepsCount || 0) * stepLength / 1000).toFixed(2);
  };

  const getTreeIcon = () => {
    const stage = TREE_STAGES.find(s => level <= s.maxLevel) || TREE_STAGES[TREE_STAGES.length - 1];
    return stage.icon;
  };

  // Calculate pace (minutes per km)
  const getPace = () => {
    const distance = parseFloat(getDistance());
    if (distance > 0 && timer > 0) {
      const minutesPerKm = (timer / 60) / distance;
      return minutesPerKm.toFixed(2);
    }
    return "0.00";
  };

  // Calculate XP progress to next level
  const currentLevelXp = (level - 1) * 20000;
  const nextLevelXp = level * 20000;
  const xpProgress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  // Don't render until data is loaded
  if (!isInitialized) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#00BFA5" />
        <Text style={styles.loadingText}>Loading your Green Runs...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Green Runs</Text>
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
                color={level <= 5 ? "#00BFA5" : "#004D40"} 
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
              <Text style={styles.progressText}>{Math.round(xpProgress)}% to Level {level + 1}</Text>
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
                <Text style={styles.goalText}>{Math.min(100, Math.round(stepGoalPercent))}%</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <SimpleIcon name="route" size={24} color="#333" />
              <Text style={styles.statValue}>{getDistance()}</Text>
              <Text style={styles.statLabel}>km</Text>
              <Text style={styles.goalText}>Goal: {RUNNING_CONFIG.minDistance} km</Text>
            </View>

            <View style={styles.statCard}>
              <SimpleIcon name="clock" size={24} color="#333" />
              <Text style={styles.statValue}>{formatTime(timer)}</Text>
              <Text style={styles.statLabel}>Time</Text>
              <Text style={styles.goalText}>{getPace()} min/km</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              isTracking ? styles.stopButton : styles.startButton
            ]}
            onPress={isTracking ? stopTracking : startTracking}
            disabled={isLoading}
          >
            <Text style={styles.actionButtonText}>
              {isTracking ? "STOP TRACKING" : "START RUNNING"}
            </Text>
            <SimpleIcon
              name={isTracking ? "stop" : "play"}
              size={20}
              color="white"
            />
          </TouchableOpacity>

          {/* Running Stats Summary */}
          {finalizedSteps && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Last Run Summary</Text>
              <View style={styles.summaryContent}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Steps:</Text>
                  <Text style={styles.summaryValue}>{finalizedSteps}</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Distance:</Text>
                  <Text style={styles.summaryValue}>{getDistance(finalizedSteps)} km</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Time:</Text>
                  <Text style={styles.summaryValue}>{formatTime(timer)}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Health Tips Section */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Running Tip</Text>
            <Text style={styles.tipsText}>{RUNNING_TIPS[tipIndex]}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Loading Modal */}
      {isLoading && (
        <Modal transparent={true} visible={isLoading}>
          <View style={styles.modalContainer}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00BFA5" />
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
  safeArea: {
    flex: 1,
    backgroundColor: '#E0F2F1',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0F2F1',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
    backgroundColor: '#00BFA5',
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
    backgroundColor: '#B2DFDB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#80CBC4',
  },
  treeStage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00695C',
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
    backgroundColor: '#E0F7FA',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#B2EBF2',
  },
  xpText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006064',
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
    backgroundColor: '#00BFA5',
  },
  progressText: {
    fontSize: 12,
    marginTop: 5,
    color: '#006064',
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
    backgroundColor: '#00BFA5',
    
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
    backgroundColor: '#00BFA5',
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
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00695C',
    marginBottom: 10,
  },
  summaryContent: {
    flexDirection: 'column',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
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
    color: '#00695C',
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
    color: '#00BFA5',
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
    backgroundColor: '#26A69A',
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
    backgroundColor: '#E0F2F1',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    margin: 5,
    minWidth: 80,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00BFA5',
  },
  mathOptionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00BFA5',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    padding: 10,
    borderRadius: 10,
  },
  correctFeedback: {
    backgroundColor: '#E0F2F1',
    color: '#00695C',
  },
  incorrectFeedback: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
});

export default RunningStepCounter;