import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator, Button, Alert } from "react-native";
import { Pedometer } from "expo-sensors";

const StepCounter = () => {
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
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [treeStage, setTreeStage] = useState("Sprout");  // Initial tree stage

  // Tree progression stages
  const TREE_STAGES = [
    { maxLevel: 50, stage: "Small Oak Tree 🌱🌳" },
    { maxLevel: 100, stage: "Pine Tree 🌲" },
    // Future stages can be added
  ];

  useEffect(() => {
    let subscription;
    let interval;

    const checkPedometer = async () => {
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available);
      if (available) {
        subscription = Pedometer.watchStepCount((result) => {
          if (isTracking) {
            setSteps(result.steps);
          }
        });
      }
    };

    if (isTracking) {
      setSteps(0);
      setFinalizedSteps(null);
      setTimer(0);
      checkPedometer();
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }

    return () => {
      if (subscription) subscription.remove();
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const stopTracking = () => {
    setIsTracking(false);
    setIsLoading(true);
    setTimeout(() => {
      setFinalizedSteps(steps);
      setIsLoading(false);
      
      // Check if minimum requirements are met
      const distance = getDistance();
      const distanceNum = parseFloat(distance);
      
      if (steps >= JOGGING_CONFIG.minSteps && distanceNum >= JOGGING_CONFIG.minDistance) {
        generateMathProblem();
        setIsModalVisible(true);
        setFeedback("");
        setMathTimer(10);
        startMathTimer();
      } else {
        Alert.alert("Goal Not Met", 
          `Jogging Goal: ${JOGGING_CONFIG.minSteps} steps and ${JOGGING_CONFIG.minDistance} km\nYou did: ${steps} steps and ${distance} km`
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
    const timerInterval = setInterval(() => {
      timeLeft -= 1;
      setMathTimer(timeLeft);
      if (timeLeft === 0) {
        clearInterval(timerInterval);
        processGameOutcome(false);
      }
    }, 1000);

    window.mathTimerInterval = timerInterval;
  };

  const processGameOutcome = (isCorrect) => {
    // Calculate XP
    let earnedXp = 0;
    const distance = parseFloat(getDistance());
    
    if (isCorrect) {
      // Base points for correct answer
      earnedXp += JOGGING_CONFIG.correctAnswerPoints;
      
      // Extra points for additional distance
      const extraDistancePoints = Math.floor((distance - JOGGING_CONFIG.minDistance) / 0.1) * JOGGING_CONFIG.extraPointsPer100m;
      earnedXp += Math.max(0, extraDistancePoints);
    }

    // Update XP and check for level up
    const newXp = xp + earnedXp;
    setXp(newXp);

    // Determine new level
    const newLevel = Math.floor(newXp / 20000) + 1;
    setLevel(newLevel);

    // Determine tree stage
    const currentTreeStage = TREE_STAGES.find(stage => newLevel <= stage.maxLevel)?.stage || "Small Oak Tree 🌱🌳";
    setTreeStage(currentTreeStage);

    // Show results
    if (isCorrect) {
      Alert.alert("Great Job!", `You earned ${earnedXp} XP!\nTotal XP: ${newXp}`);
    } else {
      Alert.alert("Time's Up!", "No points earned this time.");
    }

    // Reset tracking
    resetTracking();
  };

  const checkMathAnswer = (selectedOption) => {
    if (window.mathTimerInterval) {
      clearInterval(window.mathTimerInterval);
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
    setIsTracking(false);
    setSteps(0);
    setTimer(0);
    setFinalizedSteps(null);
  };

  const getDistance = () => {
    // Jogging step length (slightly longer than walking)
    const stepLength = 1.0;
    return (steps * stepLength / 1000).toFixed(2) + " km";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Tracker (Jogging Mode)</Text>
      <Text style={styles.level}>Level: {level} - {treeStage}</Text>
      <Text style={styles.xp}>XP: {xp}</Text>
      <Text style={styles.steps}>Estimated Steps: {steps}</Text>
      <Text style={styles.timer}>Time: {timer}s</Text>
      <Text style={styles.distance}>Estimated Distance: {getDistance()}</Text>
      <Button 
        title={isTracking ? "Stop" : "Start"} 
        onPress={() => (isTracking ? stopTracking() : setIsTracking(true))} 
      />

      {isLoading && (
        <Modal transparent={true} visible={isLoading}>
          <View style={styles.modalContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Finalizing steps...</Text>
          </View>
        </Modal>
      )}

      <Modal transparent={true} visible={isModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Solve the Math Problem!</Text>
            <Text style={styles.mathProblem}>{mathProblem}</Text>
            <Text>Time left: {mathTimer}s</Text>
            {mathOptions.map((option, index) => (
              <Button key={index} title={option.toString()} onPress={() => checkMathAnswer(option)} />
            ))}
            {feedback !== "" && <Text style={styles.modalText}>{feedback}</Text>}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  level: { fontSize: 18, color: "blue", marginTop: 10 },
  xp: { fontSize: 18, color: "green", marginTop: 10 },
  steps: { 
    fontSize: 18, 
    marginTop: 10, 
    color: 'green',
    fontWeight: 'bold' 
  },
  timer: { fontSize: 18, marginTop: 10 },
  distance: { fontSize: 18, marginTop: 10, color: "purple" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 18, marginTop: 10, textAlign: "center" }
});

export default StepCounter;