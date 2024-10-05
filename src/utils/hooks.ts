import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

type Props = {
    duration: number,
    inputRange: number[],
    outputRange: string[]
}

export const useAnim = ({duration, inputRange, outputRange} :Props) =>{
    const animatedColor = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const colorAnimation = Animated.timing(animatedColor, {
            toValue: 1,
            duration,
            easing: Easing.linear,
            useNativeDriver: false,
        });

        const loopedAnimation = Animated.loop(colorAnimation);
        loopedAnimation.start(); // Start the animation only once when the component mounts

        // Clean up the animation when the component is unmounted
        return () => loopedAnimation.stop();
    }, [animatedColor]);

    const result = animatedColor.interpolate({
        inputRange,
        outputRange
    });
    return result
}