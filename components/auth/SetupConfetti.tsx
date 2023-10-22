// https://github.com/peacechen/react-native-make-it-rain/blob/master/src/confetti.js
// https://gist.github.com/ShopifyEng/96b5f2f55b274dab3a957bb12c3f2c4d

// TODO: make this work
// import { Fragment, useEffect, useMemo } from 'react';
// import { Dimensions, StyleSheet, View } from 'react-native';
//
// import Animated, {
//   Clock,
//   Value,
//   add,
//   clockRunning,
//   cond,
//   diff,
//   divide,
//   eq,
//   greaterThan,
//   lessOrEq,
//   lessThan,
//   multiply,
//   set,
//   startClock,
//   stopClock,
//   sub,
// } from 'react-native-reanimated';
//
// import { makeStyles } from '&/utils/makeStyles';

import { View } from 'react-native';

type ConfettiProps = {
  continuous?: boolean;
  fallSpeed: number;
  flipSpeed: number;
  horizSpeed: number;
  itemColors: string[];
  itemDimensions: {
    height: number;
    width: number;
  };
  itemTintStrength: number;
  numItems: number;
};

// type Confetti = {
//   angle: Animated.Value<number>;
//   angleVel: Animated.Value<number>;
//   color: string;
//   delay: Animated.Value<number>;
//   elasticity: number;
//   key: number;
//   x: Animated.Value<number>;
//   xVel: Animated.Value<number>;
//   y: Animated.Value<number>;
//   yVel: Animated.Value<number>;
// };
//
export function Confetti(props: ConfettiProps): JSX.Element {
  return <View />;
  //   const styles = useStyles();
  //
  //   const { continuous, fallSpeed, flipSpeed, horizSpeed, itemColors, itemDimensions, itemTintStrength, numItems } = props;
  //   const { width: screenWidth, height: screenHeight } = Dimensions.get('screen');
  //
  //   const clock = new Clock();
  //   const confetti = useMemo(() => {
  //     const angleVelMax = flipSpeed;
  //     const xVelMax = horizSpeed * 8;
  //     const yVelMax = fallSpeed * 3;
  //
  //     return [...new Array(numItems)].map((_, index: number) => ({
  //       angle: new Value(0),
  //       angleVel: new Value((Math.random() * angleVelMax - angleVelMax / 2) * Math.PI),
  //       color: itemColors[index % itemColors.length],
  //       delay: new Value(Math.floor(index / 10) * 0.3),
  //       elasticity: Math.random() * 0.9 + 0.1,
  //       key: index,
  //       x: new Value(Math.random() * (screenWidth - itemDimensions.width)),
  //       xVel: new Value(Math.random() * xVelMax - xVelMax / 2),
  //       y: new Animated.Value(-60),
  //       yVel: new Value(Math.random() * yVelMax + yVelMax),
  //     }));
  //   }, [itemColors.length, screenWidth, itemDimensions.width]);
  //
  //   useEffect(() => {
  //     return () => {
  //       stopClock(clock);
  //     };
  //   }, []);
  //
  //   return (
  //     <View pointerEvents="none" style={StyleSheet.absoluteFill} testID="confetti">
  //       {confetti.map(({ angle, angleVel, color, delay, elasticity, key, x, xVel, y, yVel }: Confetti) => {
  //         return (
  //           <Fragment key={key}>
  //             <Animated.Code>
  //               {() => {
  //                 const timeDiff = diff(clock);
  //                 const dt = divide(timeDiff, 1000);
  //                 const dy = multiply(dt, yVel);
  //                 const dx = multiply(dt, xVel);
  //                 const dAngle = multiply(dt, angleVel);
  //
  //                 return cond(
  //                   clockRunning(clock),
  //                   [
  //                     cond(
  //                       lessOrEq(y, screenHeight + itemDimensions.height),
  //                       cond(
  //                         greaterThan(delay, 0),
  //                         [set(delay, sub(delay, dt))],
  //                         [set(y, add(y, dy)), set(x, add(x, dx)), set(angle, add(angle, dAngle))],
  //                       ),
  //                     ),
  //                     cond(greaterThan(x, screenWidth - itemDimensions.width), [
  //                       set(x, screenWidth - itemDimensions.width),
  //                       set(xVel, multiply(xVel, -elasticity)),
  //                     ]),
  //                     cond(lessThan(x, 0), [set(x, 0), set(xVel, multiply(xVel, -elasticity))]),
  //                     cond(
  //                       eq(new Animated.Value(continuous ? 1 : 0), 1),
  //                       cond(greaterThan(y, screenHeight + itemDimensions.height), set(y, -itemDimensions.height * 2)),
  //                     ),
  //                   ],
  //                   [startClock(clock), timeDiff],
  //                 );
  //               }}
  //             </Animated.Code>
  //
  //             <Animated.View
  //               style={[
  //                 styles.animationContainer,
  //                 {
  //                   transform: [
  //                     { translateX: x },
  //                     { translateY: y },
  //                     { rotate: angle as unknown as Animated.Value<string> },
  //                     { rotateX: angle as unknown as Animated.Value<string> },
  //                     { rotateY: angle as unknown as Animated.Value<string> },
  //                   ],
  //                 },
  //               ]}>
  //               <View style={[{ backgroundColor: color, opacity: itemTintStrength }, itemDimensions]} />
  //             </Animated.View>
  //           </Fragment>
  //         );
  //       })}
  //     </View>
  //   );
}

// const useStyles = makeStyles(theme => ({
//   animationContainer: {
//     left: theme.space['0'],
//     position: 'absolute',
//     top: theme.space['0'],
//   },
// }));
