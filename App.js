import React, { useState } from 'react';
import type { Node } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,

} from 'react-native';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Queue from './queue.js';
import Modal from 'react-native-modal';

const App: () => Node = () => {
  return (
    <View style={[styles.MainContainer]}>
      <GameBoard />
    </View>
  );
}

const GridTile = (props) => {
  return (
    <View style={[styles.GridBox]}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: '#FAFAFA'}}>{props.value}</Text>
    </View>
  );
}

const GameBoard = () => {
  const [Board, SetBoardState] = useState([
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]);
  const rows = 4;
  const columns = 4;

  const [ShowModal, SetShowModal] = useState(false);

  let openSpots = (rows * columns) - 2;
  /*
  Algorithm
  Data structures used: queue and array
  Time complexity: O(n^2)
  nRow / nColumn will be initialized to have four elements, all are zeroes which will be replaced.
  nIndex is the current index of the new array
    - if swipe direction is left or up, nIndex starts at 0, and we increment nIndex for every number added into the new array
    - if swipe direction is right or down, nIndex starts are rows/column_size - 1, and we decrement nIndex for every number added into the new array
  1. Read entire row or column
  2. If the tile == 0, continue to the next index
  3. If tile != 0
    a. Check if queue is empty
      - If queue is empty, add number into queue
    b. If not empty,
      - Pop the top item, if queue number == current tile number
         Double the number and add it into the new row / column array
        - Increase the index
  4. Upon finishing tile row / column iteration, check if there's still one more element in the queue
  5. Add into the last index of the new array
  6. Two cases
    - If horizontal swipe, just set the matrix row = the new array
    - If vertical swipe, do another for loop and replace the row column tile with a value from the array
  */

  // IMPORTANT: FIX RIGHT SWIPE DISPLAY (NUMBERS ARE SWAPPING)
  function leftSwipe() {
    let addedRandNum = false;
    const updatedBoard = [...Board];
    let runningSum = 0;
    for (let i = 0; i < columns; i++) {
      let numQueue = new Queue();
      let nRow = [0, 0, 0, 0];
      let nIndex = 0;
      for (let j = 0; j < 4; j++) {
        if (updatedBoard[i][j] === 0) continue;
        if (!numQueue.isEmpty()) {
          // first peek
          if (numQueue.top() === updatedBoard[i][j]) {
            nRow[nIndex++] = updatedBoard[i][j] * 2;
            numQueue.pop();
          } else {
            nRow[nIndex++] = numQueue.top();
            numQueue.pop();
            numQueue.push(updatedBoard[i][j]);
          }
        } else numQueue.push(updatedBoard[i][j]);
      }
      if (!numQueue.isEmpty()) nRow[nIndex++] = numQueue.top();
      
      // console.log(nRow);
      runningSum += nIndex;
      console.log(runningSum);
      if(runningSum >= 16) {
        SetShowModal(!ShowModal);
      }
      updatedBoard[i] = nRow;
    }
    SetBoardState(updatedBoard);
    // console.log('Left swipe');
  }

  function rightSwipe() {
    const updatedBoard = [...Board];
    for (let i = 0; i < columns; i++) {
      let numQueue = new Queue();
      let nRow = [0, 0, 0, 0];
      let nIndex = rows - 1; // 3
      for (let j = rows - 1; j >= 0; j--) {
        if (updatedBoard[i][j] === 0) continue;
        if (!numQueue.isEmpty()) {
          if (numQueue.top() === updatedBoard[i][j]) {
            nRow[nIndex--] = updatedBoard[i][j] * 2;
            numQueue.pop();
          } else {
            nRow[nIndex--] = numQueue.top();
            numQueue.pop();
            numQueue.push(updatedBoard[i][j]);
          }
        } else numQueue.push(updatedBoard[i][j]);
      }
      if (!numQueue.isEmpty()) nRow[nIndex--] = numQueue.top();
      updatedBoard[i] = nRow;
      console.log(nIndex);
      SetBoardState(updatedBoard);
    }
  }


  function upSwipe() {
    const updatedBoard = [...Board];
    for (let i = 0; i < rows; i++) {
      let numQueue = new Queue();
      let nColumn = [0, 0, 0, 0];
      let nIndex = 0;
      let runningSum = 0;
      for (let j = 0; j < columns; j++) {
        if (updatedBoard[j][i] === 0) continue;
        if (!numQueue.isEmpty()) {
          if (numQueue.top() === updatedBoard[j][i]) {
            nColumn[nIndex++] = updatedBoard[j][i] * 2;
            numQueue.pop();
          } else {
            nColumn[nIndex++] = numQueue.top();
            numQueue.pop();
            numQueue.push(updatedBoard[j][i]);
          }
        } else numQueue.push(updatedBoard[j][i]);
      }
      if (!numQueue.isEmpty()) nColumn[nIndex++] = numQueue.top();
      for (let j = 0; j < columns; j++) {
        updatedBoard[j][i] = nColumn[j];
      }
      runningSum += nIndex;
      if(runningSum >= 16) return;
      SetBoardState(updatedBoard);
    }
  }

  function downSwipe() {
    const updatedBoard = [...Board];
    for (let i = 0; i < rows; i++) {
      let numQueue = new Queue();
      let nColumn = [0, 0, 0, 0];
      let nIndex = rows - 1;
      for (let j = columns - 1; j >= 0; j--) {
        if (updatedBoard[j][i] === 0) continue;
        if (!numQueue.isEmpty()) {
          if (numQueue.top() === updatedBoard[j][i]) {
            nColumn[nIndex--] = updatedBoard[j][i] * 2;
            numQueue.pop();
          } else {
            nColumn[nIndex--] = numQueue.top();
            numQueue.pop();
            numQueue.push(updatedBoard[j][i]);
          }
        } else numQueue.push(updatedBoard[j][i]);
      }
      if (!numQueue.isEmpty()) nColumn[nIndex] = numQueue.top();
      for (let j = 0; j < rows; j++) {
        updatedBoard[j][i] = nColumn[j];
      }
      // console.log(nColumn);
      SetBoardState(updatedBoard);
    }

  }

  function generateTwo() {

  }

  function restart() {
    /*
    const updatedBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
   ]; */
    // temporary reset for testing
    const updatedBoard = [
      [0, 0, 0, 0],
      [2, 4, 2, 4],
      [6, 2, 4, 2],
      [2, 4, 2, 2]
    ];
    console.log("Restarted");
    SetBoardState(updatedBoard);
  }

  function DisplayNum(xPos, yPos) {
    if (Board[xPos][yPos] === 0) return ' '; // return an empty string
    return Board[xPos][yPos];
  }


  function isFull() {
    if (openSpots === 0) {
      SetShowModal(!ShowModal);
    }
  }

  return (
    <View style={[styles.MainContainer]}>

      <Modal isVisible={ShowModal}>
        <View style={[styles.CenteredContainer, {marginBottom: 350, marginTop: 300, borderRadius: 20, opacity:0.9}]}>
          <Text style={{ paddingBottom: 20 ,fontWeight:'bold' }}>No more spots :( </Text>
          <TouchableOpacity style={[styles.BtnRestart]} onPress={() => SetShowModal(!ShowModal)}>
            <Text style={{ textAlign: 'center', fontWeight:'bold', color:'#FAFAFA'}}>Continue</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <GestureRecognizer
        onSwipeLeft={() => leftSwipe()}
        onSwipeRight={() => rightSwipe()}
        onSwipeUp={() => upSwipe()}
        onSwipeDown={() => downSwipe()}
      >
        <TouchableOpacity style={[styles.BtnRestart, { marginBottom: 30 }]} onPress={() => restart()}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center', color:'#FAFAFA' }}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.BtnRestart, { marginBottom: 30 }]} onPress={() => SetShowModal(!ShowModal)}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center', color:'#FAFAFA' }}>Show Modal</Text>
        </TouchableOpacity>
        <View style={[styles.GridContainer, { flexDirection: 'column' }]}>
          <View style={[styles.GridContainer, { flexDirection: 'row' }]}>
            <GridTile value={DisplayNum(0, 0)} />
            <GridTile value={DisplayNum(0, 1)} />
            <GridTile value={DisplayNum(0, 2)} />
            <GridTile value={DisplayNum(0, 3)} />
          </View>
          <View style={[styles.GridContainer, { flexDirection: 'row' }]}>
            <GridTile value={DisplayNum(1, 0)} />
            <GridTile value={DisplayNum(1, 1)} />
            <GridTile value={DisplayNum(1, 2)} />
            <GridTile value={DisplayNum(1, 3)} />
          </View>
          <View style={[styles.GridContainer, { flexDirection: 'row' }]}>
            <GridTile value={DisplayNum(2, 0)} />
            <GridTile value={DisplayNum(2, 1)} />
            <GridTile value={DisplayNum(2, 2)} />
            <GridTile value={DisplayNum(2, 3)} />
          </View>
          <View style={[styles.GridContainer, { flexDirection: 'row' }]}>
            <GridTile value={DisplayNum(3, 0)} />
            <GridTile value={DisplayNum(3, 1)} />
            <GridTile value={DisplayNum(3, 2)} />
            <GridTile value={DisplayNum(3, 3)} />
          </View>
        </View>
      </GestureRecognizer>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: {
    backgroundColor: '#282828',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  CenteredContainer: {
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
    flex:1,
  },
  GridContainer: {
    backgroundColor: 'transparent',
  },
  GridBox: {
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3400C1',
    borderWidth: 1,
  },
  BtnRestart: {
    height: 50,
    width: 110,
    backgroundColor: '#F64C72',
    textAlign: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,

    elevation: 1,
  }
});

export default App;
