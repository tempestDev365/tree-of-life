import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator, Button, Alert } from "react-native";
import { Pedometer } from "expo-sensors";

const StepCounter = () => {
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
  const [mathTimer, setMathTimer] = useState(3);
  const [feedback, setFeedback] = useState("");
  const [level, setLevel] = useState(1);
  const [selectedMode, setSelectedMode] = useState("Walking");

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
      generateMathProblem();
      setIsModalVisible(true);
      setFeedback("");
      setMathTimer(3);
      startMathTimer();
    }, 3000);
  };

  const generateMathProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
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
    
    const options = [answer, answer + 2, answer - 2].sort(() => Math.random() - 0.5);
    
    setMathProblem(`${num1} ${operation} ${num2} = ?`);
    setMathAnswer(answer);
    setMathOptions(options);
  };

  const startMathTimer = () => {
    let timeLeft = 3;
    const timerInterval = setInterval(() => {
      timeLeft -= 1;
      setMathTimer(timeLeft);
      if (timeLeft === 0) {
        clearInterval(timerInterval);
        setFeedback(`⏳ Time's up! The correct answer was ${mathAnswer}`);
        setTimeout(() => {
          Alert.alert("Time's up!", "You failed to answer.");
          setIsModalVisible(false);
        }, 500);
      }
    }, 1000);

    // Store the interval ID in a ref so we can clear it when needed
    window.mathTimerInterval = timerInterval;
  };

  const checkMathAnswer = (selectedOption) => {
    if (selectedOption === mathAnswer) {
      // Clear the timer interval
      if (window.mathTimerInterval) {
        clearInterval(window.mathTimerInterval);
      }
      setFeedback("✅ Correct! Well done!");
      setLevel(level + 1);
      // Show success message and close modal
      setTimeout(() => {
        Alert.alert("Great job!", "You solved the math problem correctly!");
        setIsModalVisible(false);
      }, 1000);
    } else {
      setFeedback(`❌ Incorrect! The correct answer was ${mathAnswer}`);
      setTimeout(() => {
        setIsModalVisible(false);
      }, 1500);
    }
  };

  const getDistance = () => {
    let stepLength = selectedMode === "Running" ? 1.5 : selectedMode === "Jogging" ? 1.0 : 0.7;
    return (steps * stepLength / 1000).toFixed(2) + " km";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Tracker ({selectedMode} Mode)</Text>
      <Text style={styles.level}>Level: {level}</Text>
      <Text style={styles.steps}>Steps: {steps}</Text>
      <Text style={styles.timer}>Time: {timer}s</Text>
      <Text style={styles.distance}>Distance: {getDistance()}</Text>
      <Button title={isTracking ? "Stop" : "Start"} onPress={() => (isTracking ? stopTracking() : setIsTracking(true))} />

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
            <Button title="Close" onPress={() => setIsModalVisible(false)} />
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