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
  const [options, setOptions] = useState([]);
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
      setIsModalVisible(true);
      setFeedback("");
      generateChoices(steps);
      setLevel((prevLevel) => prevLevel + Math.floor(steps / 1000));
    }, 3000);
  };

  const generateChoices = (actualSteps) => {
    const correctRange = `Between ${actualSteps - 5} to ${actualSteps + 5}`;
    const wrongRange1 = `Between ${actualSteps + 10} to ${actualSteps + 20}`;
    const wrongRange2 = `Between ${actualSteps - 20} to ${actualSteps - 10}`;
    const choices = [correctRange, wrongRange1, wrongRange2].sort(() => Math.random() - 0.5);
    setOptions(choices);
  };

  const checkAnswer = (selectedOption) => {
    if (selectedOption === `Between ${finalizedSteps - 5} to ${finalizedSteps + 5}`) {
      setFeedback("✅ Correct! Well done!");
    } else {
      setFeedback(`❌ Incorrect! The correct answer was Between ${finalizedSteps - 5} to ${finalizedSteps + 5}`);
    }
  };

  const getDistance = () => {
    let stepLength;
    switch (selectedMode) {
      case "Jogging":
        stepLength = 1.0;
        break;
      case "Running":
        stepLength = 1.5;
        break;
      default:
        stepLength = 0.7;
    }
    const distanceMeters = steps * stepLength;
    const distanceKm = (distanceMeters / 1000).toFixed(2);
    return `${distanceMeters.toFixed(1)} meters (${distanceKm} km)`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Tracker ({selectedMode} Mode)</Text>
      <Text style={styles.level}>Level: {level}</Text>
      <Text style={styles.timer}>Time: {timer}s</Text>
      <Text style={styles.steps}>Steps: {steps}</Text>
      <Text style={styles.distance}>Distance: {getDistance()}</Text>

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
            {options.map((option, index) => (
              <Button key={index} title={option} onPress={() => checkAnswer(option)} />
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
  timer: { fontSize: 18, marginTop: 10 },
  steps: { fontSize: 18, marginTop: 10, color: "green" },
  distance: { fontSize: 18, marginTop: 10, color: "purple" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "white", padding: 20, borderRadius: 10, alignItems: "center" },
  modalText: { fontSize: 18, marginTop: 10, textAlign: "center" }
});

export default StepCounter;