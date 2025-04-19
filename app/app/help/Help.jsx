import { Text, View, ScrollView, StyleSheet } from 'react-native';

const About = () => {
    return (
        <View style={styles.container}>
            <ScrollView horizontal={false}>
                <Text style={styles.title}>How it works?</Text>
                <Text style={styles.point}>1. User select a category (Walking, Jogging, Running).</Text>
                <Text style={styles.point}>2. The user need reach the required minimum distance and steps.</Text>
                <Text style={styles.point}>3. Math quiz appears after they finished the activity (10 seconds timer per question).</Text>
                <Text style={styles.point}>4. Correct answer = Full points, Incorrect answer = 0 points</Text>
                <Text style={styles.point}>5. Bonus points for extra effort (e.g., extra distance, streaks).</Text>
                <Text style={styles.point}>6. Total points added to level progression.</Text>
                
                <ScrollView horizontal={true} style={styles.tableScroll}>
                    <View style={styles.tableContainer}>
                        {/* Table Header */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableHeaderCell}>
                                <Text style={styles.headerText}>Category</Text>
                            </View>
                            <View style={styles.tableHeaderCell}>
                                <Text style={styles.headerText}>Minimum Distance</Text>
                            </View>
                            <View style={styles.tableHeaderCell}>
                                <Text style={styles.headerText}>Minimum Steps</Text>
                            </View>
                            <View style={styles.tableHeaderCell}>
                                <Text style={styles.headerText}>Base Points</Text>
                            </View>
                            <View style={styles.tableHeaderCell}>
                                <Text style={styles.headerText}>Correct Answer</Text>
                            </View>
                            <View style={styles.tableHeaderCell}>
                                <Text style={styles.headerText}>Incorrect Answer</Text>
                            </View>
                            <View style={styles.tableHeaderCell}>
                                <Text style={styles.headerText}>Extra points{'\n'}for every{'\n'}100m distance</Text>
                            </View>
                        </View>
                        
                        {/* Walking Row */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableCell}>
                                <Text>Walking</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>500m</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>640 steps</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>250 xp</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>250 xp</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>0</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>50 xp</Text>
                            </View>
                        </View>
                        
                        {/* Jogging Row */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableCell}>
                                <Text>Jogging</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>1000m</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>1280 steps</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>500 xp</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>500 xp</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>0</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>100 xp</Text>
                            </View>
                        </View>
                        
                        {/* Running Row */}
                        <View style={styles.tableRow}>
                            <View style={styles.tableCell}>
                                <Text>Running</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>1500m</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>1980 steps</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>1000 xp</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>1000 xp</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>0</Text>
                            </View>
                            <View style={styles.tableCell}>
                                <Text>150 xp</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                
                {/* Leveling System Section */}
                <View style={styles.levelContainer}>
                    <View style={styles.levelHeader}>
                        <Text style={styles.levelHeaderText}>🚀 Leveling System</Text>
                    </View>
                    <View style={styles.levelCard}>
                        <View style={styles.levelRow}>
                            <Text style={styles.levelText}>Level 1</Text>
                            <Text style={styles.levelXp}>→ 20,000 xp</Text>
                        </View>
                        <View style={styles.levelRow}>
                            <Text style={styles.levelText}>Level 2</Text>
                            <Text style={styles.levelXp}>→ 40,000 xp (+20k)</Text>
                        </View>
                        <View style={styles.levelRow}>
                            <Text style={styles.levelText}>Level 3</Text>
                            <Text style={styles.levelXp}>→ 60,000 xp (+20k)</Text>
                        </View>
                        <View style={styles.levelRow}>
                            <Text style={styles.levelText}>Level 4</Text>
                            <Text style={styles.levelXp}>→ 80,000 xp (+20k)</Text>
                        </View>
                        <View style={styles.levelNote}>
                            <Text style={styles.levelNoteText}>Each level requires +20k more points than the previous level</Text>
                        </View>
                    </View>
                </View>
                
                {/* Tree Progression Section */}
                <View style={styles.treeContainer}>
                    <View style={styles.treeHeader}>
                        <Text style={styles.treeHeaderText}>🌳 Tree Progression (Every 50 Levels)</Text>
                    </View>
                    <View style={styles.treeCard}>
                        <View style={styles.treeRow}>
                            <Text style={styles.treeNumber}>1.</Text>
                            <View style={styles.treeContent}>
                                <Text style={styles.treeText}>
                                    <Text style={styles.treeLevelRange}>Level 1-50</Text> → Sprout to Small Oak Tree 🌱🌳
                                </Text>
                                <Text style={styles.treeDescription}>(Basic starter tree)</Text>
                            </View>
                        </View>
                        
                        <View style={styles.treeRow}>
                            <Text style={styles.treeNumber}>2.</Text>
                            <View style={styles.treeContent}>
                                <Text style={styles.treeText}>
                                    <Text style={styles.treeLevelRange}>Level 51-100</Text> → Pine Tree 🌲
                                </Text>
                                <Text style={styles.treeDescription}>(Tall and sturdy)</Text>
                            </View>
                        </View>
                        
                        <View style={styles.treeRow}>
                            <Text style={styles.treeNumber}>3.</Text>
                            <View style={styles.treeContent}>
                                <Text style={styles.treeText}>
                                    <Text style={styles.treeLevelRange}>Level 101-150</Text> → Cherry Blossom Tree 🌸
                                </Text>
                                <Text style={styles.treeDescription}>(Delicate and beautiful)</Text>
                            </View>
                        </View>
                        
                        <View style={styles.treeRow}>
                            <Text style={styles.treeNumber}>4.</Text>
                            <View style={styles.treeContent}>
                                <Text style={styles.treeText}>
                                    <Text style={styles.treeLevelRange}>Level 151-200</Text> → Banyan Tree 🌳
                                </Text>
                                <Text style={styles.treeDescription}>(Thicker trunk, aerial roots)</Text>
                            </View>
                        </View>
                        
                        <View style={styles.treeRow}>
                            <Text style={styles.treeNumber}>5.</Text>
                            <View style={styles.treeContent}>
                                <Text style={styles.treeText}>
                                    <Text style={styles.treeLevelRange}>Level 201-250</Text> → Baobab Tree 🌳
                                </Text>
                                <Text style={styles.treeDescription}>(Massive, ancient-looking tree)</Text>
                            </View>
                        </View>
                        
                        <View style={styles.treeRow}>
                            <Text style={styles.treeNumber}>6.</Text>
                            <View style={styles.treeContent}>
                                <Text style={styles.treeText}>
                                    <Text style={styles.treeLevelRange}>Level 251-300</Text> → Maple Tree 🍁
                                </Text>
                                <Text style={styles.treeDescription}>(Classic broadleaf tree)</Text>
                            </View>
                        </View>
                        
                        <View style={styles.treeRow}>
                            <Text style={styles.treeNumber}>7.</Text>
                            <View style={styles.treeContent}>
                                <Text style={styles.treeText}>
                                    <Text style={styles.treeLevelRange}>Level 301-350</Text> → Willow Tree 🌿
                                </Text>
                                <Text style={styles.treeDescription}>(Graceful, hanging branches)</Text>
                            </View>
                        </View>
                        
                        <View style={styles.treeRow}>
                            <Text style={styles.treeNumber}>8.</Text>
                            <View style={styles.treeContent}>
                                <Text style={styles.treeText}>
                                    <Text style={styles.treeLevelRange}>Level 351-400</Text> → Redwood Tree 🌲
                                </Text>
                                <Text style={styles.treeDescription}>(Huge, towering forest giant)</Text>
                            </View>
                        </View>
                        
                        <View style={styles.treeRow}>
                            <Text style={styles.treeNumber}>9.</Text>
                            <View style={styles.treeContent}>
                                <Text style={styles.treeText}>
                                    <Text style={styles.treeLevelRange}>Level 401-450</Text> → Mangrove Tree 🌊
                                </Text>
                                <Text style={styles.treeDescription}>(Roots extending into water)</Text>
                            </View>
                        </View>
                        
                        <View style={styles.treeRow}>
                            <Text style={styles.treeNumber}>10.</Text>
                            <View style={styles.treeContent}>
                                <Text style={styles.treeText}>
                                    <Text style={styles.treeLevelRange}>Level 451-500+</Text> → Sacred or Legendary Tree 🌳✨
                                </Text>
                                <Text style={styles.treeDescription}>(Final stage, but keeps growing infinitely)</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        margin: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
    },
    point: {
        marginBottom: 5,
        marginLeft: 10,
    },
    tableScroll: {
        marginTop: 20,
        marginBottom: 20,
    },
    tableContainer: {
        borderWidth: 1,
        borderColor: 'black',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },
    tableHeaderCell: {
        width: 100,
        padding: 8,
        borderRightWidth: 1,
        borderRightColor: 'black',
        backgroundColor: '#f0f0f0',
    },
    tableCell: {
        width: 100,
        padding: 8,
        borderRightWidth: 1,
        borderRightColor: 'black',
    },
    headerText: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 12,
    },
    // Level System Styles
    levelContainer: {
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    levelHeader: {
        backgroundColor: '#3498db',
        padding: 10,
        alignItems: 'center',
    },
    levelHeaderText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    levelCard: {
        padding: 15,
        backgroundColor: '#f8f9fa',
    },
    levelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eaeaea',
    },
    levelText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    levelXp: {
        fontSize: 16,
    },
    levelNote: {
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    levelNoteText: {
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
    },
    // Tree Progression Styles
    treeContainer: {
        marginTop: 10,
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    treeHeader: {
        backgroundColor: '#2ecc71',
        padding: 10,
        alignItems: 'center',
    },
    treeHeaderText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    treeCard: {
        padding: 10,
        backgroundColor: '#f8fff9',
    },
    treeRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0f5e0',
    },
    treeNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        width: 25,
    },
    treeContent: {
        flex: 1,
    },
    treeText: {
        fontSize: 16,
    },
    treeLevelRange: {
        fontWeight: 'bold',
    },
    treeDescription: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 3,
    }
});

export default About;