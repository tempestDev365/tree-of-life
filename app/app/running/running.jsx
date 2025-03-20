import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator, Button, TextInput, Alert, Image } from "react-native";
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
  const [selectedMode, setSelectedMode] = useState("Running");

  useEffect(() => {
    let subscription;
    let interval;
    let validationInterval;
    let lastSteps = 0;
    let lastTime = Date.now();

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
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
      checkPedometer();
      
      validationInterval = setInterval(() => {
        const currentTime = Date.now();
        const stepDifference = steps - lastSteps;
        const timeDifference = (currentTime - lastTime) / 1000;
        const stepRate = stepDifference / timeDifference;

        if (selectedMode === "Running" && stepRate < 6) {
          Alert.alert("Warning", "You are moving too slow for running mode!");
        }

        lastSteps = steps;
        lastTime = currentTime;
      }, 5000);
    }

    return () => {
      if (subscription) subscription.remove();
      if (interval) clearInterval(interval);
      if (validationInterval) clearInterval(validationInterval);
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
      setLevel((prevLevel) => prevLevel + Math.floor(steps / 1000));
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

  const getTreeImage = () => {
    if (level >= 1001) {
      return { uri: "https://example.com/full_tree.png" };
    } else if (level >= 101) {
      return { uri: "https://example.com/half_tree.png" };
    } else {
      return { uri: "https://images.unsplash.com/photo-1617488983195-93997cb57cdd?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" };
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Tracker</Text>
      <Text style={styles.level}>Level: {level}</Text>
      <Image source={getTreeImage()} style={styles.treeImage} />
      {isTracking ? (
        <Text style={styles.timer}>Time: {timer}s</Text>
      ) : finalizedSteps === null ? (
        <Text style={styles.status}>Press start to begin tracking.</Text>
      ) : (
        <Text style={styles.finalized}>Steps Finalized</Text>
      )}
      
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
  treeImage: { width: 100, height: 100, marginTop: 10 },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" }
});

export default StepCounter;