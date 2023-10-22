import { useState } from 'react';
import { Button, View } from 'react-native';

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { Text } from '&/components/core';

export default function AnimationRenderer() {
  const height = useSharedValue(20); //this value is shared between worker threads
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: height.value, //change the height property of the component
    };
  });

  const [expandCaption, setExpandCaption] = useState<number>(1);

  return (
    <View>
      <Animated.View style={[{ backgroundColor: 'blue' }, animatedStyles]}>
        <Text numberOfLines={expandCaption}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Fermentum dui
          faucibus in ornare quam viverra orci. Quam id leo in vitae turpis massa sed elementum tempus. Cursus turpis massa tincidunt dui ut ornare.
          Laoreet id donec ultrices tincidunt arcu non sodales. Nunc lobortis mattis aliquam faucibus purus in massa tempor nec. Dolor sit amet
          consectetur adipiscing elit duis tristique. Amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Dictum at tempor commodo
          ullamcorper. Nec ultrices dui sapien eget. Id interdum velit laoreet id donec ultrices tincidunt arcu non. Aenean et tortor at risus viverra
          adipiscing. Pellentesque id nibh tortor id aliquet lectus proin nibh. Dui accumsan sit amet nulla facilisi morbi. Duis at tellus at urna
          condimentum. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper. Volutpat diam ut venenatis tellus. Eget mi proin sed libero enim.
          Commodo odio aenean sed adipiscing diam donec adipiscing tristique. Hendrerit gravida rutrum quisque non tellus orci. Vel pretium lectus
          quam id leo in. Et malesuada fames ac turpis egestas. Velit laoreet id donec ultrices tincidunt arcu non. Duis tristique sollicitudin nibh
          sit amet commodo nulla. Facilisis gravida neque convallis a cras. Iaculis eu non diam phasellus vestibulum. Nisl nisi scelerisque eu
          ultrices vitae auctor eu augue ut. Mattis nunc sed blandit libero volutpat sed. Ut faucibus pulvinar elementum integer enim neque volutpat
          ac tincidunt. Eget aliquet nibh praesent tristique. Ut tellus elementum sagittis vitae et leo duis ut diam. Varius quam quisque id diam. Dui
          faucibus in ornare quam. Vel quam elementum pulvinar etiam non quam lacus. Gravida quis blandit turpis cursus in hac habitasse. Nibh mauris
          cursus mattis molestie a. Nibh cras pulvinar mattis nunc sed blandit libero volutpat sed. A lacus vestibulum sed arcu non. Sit amet cursus
          sit amet dictum sit amet justo. Nec ullamcorper sit amet risus nullam eget felis eget nunc. Tellus in hac habitasse platea dictumst
          vestibulum rhoncus est pellentesque. Egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Vitae aliquet nec ullamcorper sit amet
          risus nullam eget. Bibendum ut tristique et egestas quis ipsum suspendisse. Pulvinar etiam non quam lacus suspendisse. Nulla at volutpat
          diam ut venenatis tellus. Eu facilisis sed odio morbi quis commodo. Ornare massa eget egestas purus viverra. Consequat id porta nibh
          venenatis cras. Nunc sed velit dignissim sodales ut eu sem integer. Vitae proin sagittis nisl rhoncus mattis rhoncus urna neque viverra.
          Nullam ac tortor vitae purus. Non nisi est sit amet facilisis magna etiam. Etiam sit amet nisl purus in. Accumsan lacus vel facilisis
          volutpat est velit egestas dui id. In metus vulputate eu scelerisque felis. Ornare suspendisse sed nisi lacus sed viverra tellus in hac.
          Sagittis id consectetur purus ut faucibus. Ornare arcu dui vivamus arcu felis bibendum. Felis eget nunc lobortis mattis aliquam faucibus
          purus in massa. At tempor commodo ullamcorper a lacus vestibulum. Nisi scelerisque eu ultrices vitae auctor eu. Ut tristique et egestas
          quis. Faucibus scelerisque eleifend donec pretium. Enim lobortis scelerisque fermentum dui faucibus. Consequat interdum varius sit amet.
          Purus in mollis nunc sed id semper risus in. Enim nec dui nunc mattis enim ut tellus. Ultrices gravida dictum fusce ut placerat orci nulla
          pellentesque dignissim. Vitae sapien pellentesque habitant morbi tristique senectus et netus. Semper eget duis at tellus at urna condimentum
          mattis pellentesque. Commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula. In massa tempor nec feugiat nisl pretium fusce
          id velit. Ac orci phasellus egestas tellus. Eu non diam phasellus vestibulum lorem sed risus. Lobortis elementum nibh tellus molestie nunc
          non blandit. Hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit. Pulvinar neque laoreet suspendisse interdum consectetur
          libero. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae. Et malesuada fames ac turpis egestas integer eget aliquet.
          Mauris nunc congue nisi vitae suscipit tellus mauris a. Pretium aenean pharetra magna ac. Nunc scelerisque viverra mauris in aliquam sem
          fringilla ut morbi. Quis eleifend quam adipiscing vitae proin sagittis nisl. Pretium viverra suspendisse potenti nullam. Vitae nunc sed
          velit dignissim sodales ut eu sem integer. Enim lobortis scelerisque fermentum dui faucibus in ornare quam viverra.
        </Text>
      </Animated.View>
      {/* When clicked, increment the shared value*/}
      {/* this will increase the height of the component.*/}
      <Button
        onPress={() => {
          setExpandCaption(expandCaption + 5);
          height.value = withSpring(height.value + 50);
        }}
        title="Increase" //when clicked, increment 'height'
      />
    </View>
  );
}
