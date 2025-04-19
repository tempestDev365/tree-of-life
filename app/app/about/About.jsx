import React from 'react';
import { Text, View, ScrollView, StyleSheet } from 'react-native';

const AboutSection = ({ title, emoji, children }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );
};

const BulletPoint = ({ text }) => {
  return (
    <View style={styles.bulletPoint}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  );
};

const About = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>About This Game</Text>
        <Text style={styles.subtitle}>Fitness meets fun in a whole new way</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 Why This System Works</Text>
        <BulletPoint text="Encourages accuracy – No free points for guessing." />
        <BulletPoint text="More challenging & engaging – Users must focus on both fitness and quiz." />
        <BulletPoint text="Balances difficulty – Walking is easier but has lower rewards, running is harder but gives more points." />
      </View>

      <Text style={styles.purposeTitle}>📜 Why We Need This Game</Text>

      <AboutSection 
        title="Promote an Active Lifestyle" 
        emoji="❤️"
      >
        <BulletPoint text="Encourages people to walk, jog, or run daily to improve health." />
        <BulletPoint text="Makes exercise more fun and rewarding with points and challenges." />
      </AboutSection>

      <AboutSection 
        title="Gamifying Fitness" 
        emoji="🎮"
      >
        <BulletPoint text="Instead of just tracking steps, players interact with the game by guessing step counts and solving quizzes." />
        <BulletPoint text="Earning points and leveling up makes walking/jogging feel like an adventure!" />
      </AboutSection>

      <AboutSection 
        title="Building Healthy Habits" 
        emoji="🌱"
      >
        <BulletPoint text="Helps users stay consistent in their daily activity." />
        <BulletPoint text="Small, gradual improvements lead to long-term fitness success." />
      </AboutSection>

      <AboutSection 
        title="Encouraging Cognitive Engagement" 
        emoji="🧠"
      >
        <BulletPoint text="Math quizzes keep the mind sharp while exercising." />
        <BulletPoint text="Adds an extra mental challenge instead of just moving." />
      </AboutSection>

      <AboutSection 
        title="Sense of Growth & Progress" 
        emoji="🌳"
      >
        <BulletPoint text="Watching the tree grow and evolve reflects personal improvement." />
        <BulletPoint text="Gives a tangible reward for physical effort, making fitness more satisfying." />
      </AboutSection>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  purposeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 8,
    marginBottom: 16,
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 24,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#333',
  },
  sectionContent: {
    paddingLeft: 4,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontSize: 18,
    marginRight: 8,
    color: '#4CAF50',
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
  },
});

export default About;