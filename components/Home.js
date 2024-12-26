

import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ToDoList = () => {
  // Initialize local state
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null); // Track the todo being edited



  // Save todoList Data to AsyncStorage whenever it changes
  useEffect(() => {
    const storeData = async () => {
      try {
        if (todoList.length) {
          await AsyncStorage.setItem('todoList', JSON.stringify(todoList));
        }
      } catch (error) {
        console.error('Error saving todos to AsyncStorage:', error);
      }
    };

    storeData(); // Call the storeData function when todoList changes
  }, [todoList]); // This effect runs whenever todoList changes

    // Get data from AsyncStorage when the app starts
    useEffect(() => {
      const getData = async () => {
        try {
          const storedData = await AsyncStorage.getItem('todoList');// 
          if (storedData) {
            setTodoList(JSON.parse(storedData));
          } else {
            setTodoList([]); // If no data exists, initialize as empty list
          }
        } catch (error) {
          console.error('Error getting data from AsyncStorage:', error);
        }
      };
      getData();
    }, []); // This effect runs once when the component mounts
  // Handle adding or updating a todo
  const handleAddOrUpdateTodo = () => {
    if (editingTodo) {
      // Update the todo item
      const updatedTodoList = todoList.map((item) =>
        item.id === editingTodo.id ? { ...item, title: todo } : item
      );
      setTodoList(updatedTodoList);
      setEditingTodo(null); // Clear editing state
    } else {
      // Add a new todo item
      setTodoList([
        ...todoList,
        { id: Math.random().toString(), title: todo, completed: false },
      ]);
    }
    setTodo(''); // Clear input field after adding/updating
  };

  // Handle deleting a todo
  const handleDeleteTodo = (id) => {
    const updatedTodoList = todoList.filter((todo) => todo.id !== id);
    setTodoList(updatedTodoList);
  };

  // Handle toggling completion of a task
  const handleToggleComplete = (id) => {
    const updatedTodoList = todoList.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodoList(updatedTodoList);
  };

  // Render each todo item
  const renderItem = ({ item }) => {
    return (
      <View style={styles.textView}>
        {/* Checkbox for marking task as completed */}
        <IconButton
          icon={item.completed ? 'check-circle' : 'circle-outline'} // Change the icon based on completion
          size={24}
          onPress={() => handleToggleComplete(item.id)} // Toggle complete status when checkbox is clicked
        />

        {/* Task Title */}
        <Text
          style={[styles.todoText, item.completed && styles.completedText]}
        >
          {item.title}
        </Text>

        {/* Icon Buttons for Edit and Delete */}
        <View style={styles.iconContainer}>
          <IconButton icon="pencil" size={24} onPress={() => handleEditTodo(item)} />
          <IconButton icon="trash-can" size={24} onPress={() => handleDeleteTodo(item.id)} />
        </View>
      </View>
    );
  };

  // Set todo to edit state
  const handleEditTodo = (todoItem) => {
    setEditingTodo(todoItem);
    setTodo(todoItem.title); // Populate the input field with the todo title
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>To Do List</Text>
      </View>
      <TextInput
        value={todo}
        placeholder="Enter task"
        onChangeText={(value) => setTodo(value)}
        style={styles.input}
      />
      <View>
        <TouchableOpacity style={styles.button} onPress={handleAddOrUpdateTodo}>
          <Text style={styles.buttonText}>
            {editingTodo ? 'Update' : 'Add'} {/* Show 'Update' if editing, else 'Add' */}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList data={todoList} renderItem={renderItem} />
    </View>
  );
};

export default ToDoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: "90%",
    height: 100,
    backgroundColor: 'white',
    elevation: 5,
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'grey',
  },
  textView: {
    backgroundColor: 'grey',
    marginTop: 10,
    padding: 12,
    borderRadius: 6,
    width: 350,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todoText: {
    fontSize: 20,
    color: 'white',
    fontWeight: '700',
    flexShrink: 1,
    paddingRight: 10,
    flex: 1,
  },
  completedText: {
    color: 'lightgray', // Change color for completed tasks
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 50,
    width: 350,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 20,
    paddingLeft: 10,
  },
  button: {
    width: 350,
    height: 50,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
