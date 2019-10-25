import React, { useState, useEffect } from 'react';
import { StyleSheet, View, PanResponder, Text, TouchableOpacity, Animated, Easing } from 'react-native';

const testButtons = [
  <View style={{ height: 80, backgroundColor: '#ec3a42' }}></View>,
  <View style={{ height: 80, backgroundColor: '#46db90' }}></View>,
  // <View style={{ height: 80, backgroundColor: '#892DB8'}}></View>
]

export default function App() {
  const [animateValue, setAnimateValue] = useState(new Animated.ValueXY({ x: 0, y: 0 }))
  const [width, setWidth] = useState(0)
  const [pan, setPan] = useState(PanResponder.create({
    onStartShouldSetPanResponder: (e, gestureState) => true,
    onStartShouldSetPanResponderCapture: (e, gestureState) => true,
    onMoveShouldSetPanResponder: (e, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (e, gestureState) => true,
    onPanResponderStart: (e, gestureState) => {
      Animated.timing(
        animateValue,
        {
          toValue: { x: 0, y: 0 },
          duration: 250,
          easing: Easing.elastic(0.5)
        }
      ).start()
    },
    onPanResponderMove: (e, gestureState) => {
      const { dx, vx } = gestureState
      if (vx < 0) {
        handlePan(e, gestureState)
        setWidth(-dx)
      }
    },
    onPanResponderEnd: (e, gestureState) => {
      if (Math.abs(gestureState.dx) > 150) {
        Animated.timing(
          animateValue,
          {
            toValue: { x: -150, y: 0 },
            duration: 80,
            easing: Easing.in,
          }
        ).start()
      } else {
        Animated.timing(
          animateValue,
          {
            toValue: { x: 0, y: 0 },
            duration: 80,
            easing: Easing.in,
          }
        ).start()
      }
    }
  }))


  const transform = [{
    translateX: animateValue.x.interpolate({
      inputRange: [-width, 0],
      outputRange: [-width + StyleSheet.hairlineWidth, 0],
      extrapolate: 'clamp'
    })
  }]

  const handleLayout = ({ nativeEvent: { layout: { width } } }) => setWidth(width)

  const handlePan = Animated.event([null, {
    dx: animateValue.x,
    dy: animateValue.y
  }])

  const renderButton = () => {
    const buttonLength = testButtons.length

    return testButtons.map((item, index) => {
      const outputMultiplier = -index / buttonLength

      const transform = [{
        translateX: animateValue.x.interpolate({
          inputRange: [-width, 0],
          outputRange: [-width * outputMultiplier, 0],
          extrapolate: 'clamp'
        })
      }]

      const buttonStyle = [
        {
          width,
          transform,
          position: 'absolute',
          top: 0
        },
      ]

      return (
        <Animated.View key={index} style={buttonStyle}>
          {item}
        </Animated.View>
      )
    })
  }

  // console.log(animateValue)

  return (
    <View style={styles.container}>
      <View style={styles.item} {...pan.panHandlers}>
        <Animated.View style={[{ transform, marginRight: -width, width, position: 'relative' }]}>
          {renderButton()}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#222222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    height: 80,
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
  },
  cube1: {
    height: 80,
    backgroundColor: '#46db90'
  },
  cube2: {
    height: 65,
    backgroundColor: '#ec3a42'
  }
});