import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Icon from 'react-native-vector-icons/Feather';

const Profile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Profile Header with Edit Icon */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Account</Text>
        <Icon name="edit-2" size={24} color="#ccc" />
      </View>

      {/* User Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={require('./assets/avatar.png')}
          style={styles.avatar}
        />
      </View>

      {/* User Information */}
      <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>Devcent NIYO</Text>
        <Text style={styles.userDetail}>devcentniyo@gmail.com</Text>
        <Text style={styles.userDetail}>078879667</Text>
      </View>
    </View>
  );
};

export default Profile;

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#282B34",
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfoContainer: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ccc",
    marginBottom: 10,
  },
  userDetail: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 5,
  },
});
