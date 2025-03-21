import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator, Button, TextInput, Alert } from "react-native";
import { Pedometer } from "expo-sensors";

const StepCounter = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [steps, setSteps] = useState(0);
  const [finalizedSteps, setFinalizedSteps] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [guess, setGuess] = useState("");
  const [feedback, setFeedback] = useState("");
  const [attempts, setAttempts] = useState(2);
  const [hint, setHint] = useState(null);
  const [level, setLevel] = useState(1);
  const [selectedMode, setSelectedMode] = useState("Walking");

  useEffect(() => {
    let subscription;
    let interval;
    let lastSteps = 0;
    let lastTime = Date.now();

    const checkPedometer = async () => {
      const available = await Pedometer.isAvailableAsync();
      setIsAvailable(available);
      if (available) {
        subscription = Pedometer.watchStepCount((result) => {
          if (isTracking) {
            const currentTime = Date.now();
            const stepDifference = result.steps - lastSteps;
            const timeDifference = (currentTime - lastTime) / 1000;
            const stepRate = stepDifference / timeDifference;

            if (selectedMode === "Walking" && stepRate > 2.5) {
              Alert.alert("Warning", "You are moving too fast for walking mode!");
            }

            setSteps(result.steps);
            lastSteps = result.steps;
            lastTime = currentTime;
          }
        });
      }
    };

    if (isTracking) {
      setSteps(0);
      setFinalizedSteps(null);
      setTimer(0);
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
      checkPedometer();
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
      setIsModalVisible(true);
      setAttempts(2);
      setFeedback("");
      setHint(null);
    }, 5000);
  };

  const checkGuess = () => {
    const guessedNumber = parseInt(guess);
    const lowerBound = finalizedSteps - 5;
    const upperBound = finalizedSteps + 5;

    if (guessedNumber >= lowerBound && guessedNumber <= upperBound) {
      setFeedback(`Correct! The exact step count was ${finalizedSteps}.`);
    } else {
      if (attempts > 1) {
        setAttempts(attempts - 1);
        if (!hint) {
          setHint([finalizedSteps - 50, finalizedSteps + 50]);
        }
        setFeedback(`Incorrect, you have ${attempts - 1} attempt(s) left.`);
      } else {
        setFeedback(`Failed! No attempts left. The exact step count was ${finalizedSteps}.`);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Tracker</Text>
      <Text style={styles.level}>Level: {level}</Text>
      {isTracking ? (
        <Text style={styles.timer}>Time: {timer}s</Text>
      ) : finalizedSteps === null ? (
        <Text style={styles.status}>Press start to begin tracking.</Text>
      ) : null}
      
      <Button title={isTracking ? "Stop" : "Start"} onPress={() => isTracking ? stopTracking() : setIsTracking(true)} />
      
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
            <Text style={styles.modalTitle}>Your Steps are Finalized!</Text>
            <TextInput 
              style={styles.input}
              placeholder="Enter your guess"
              keyboardType="numeric"
              value={guess}
              onChangeText={setGuess}
            />
            <Button title="Submit Guess" onPress={checkGuess} />
            {feedback !== "" && <Text style={styles.modalText}>{feedback}</Text>}
            {hint && <Text style={styles.modalText}>Hint: Between {hint[0]} and {hint[1]}</Text>}
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
  timer: { fontSize: 18, marginTop: 10 },
  status: { fontSize: 16, color: "gray", marginTop: 10 },
  finalized: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 10 },
  input: { borderBottomWidth: 1, width: 100, textAlign: "center", marginBottom: 10 }
});

export default StepCounter;