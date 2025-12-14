import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export function CreateMatchSkeleton() {
    const blocks = [
        { h: 20, w: "40%" },
        { h: 56, w: "100%" },
        { h: 56, w: "100%" },
        { h: 56, w: "100%" },
        { h: 56, w: "100%" },
        { h: 20, w: "40%" },
        { h: 56, w: "100%" },
        { h: 56, w: "100%" },
        { h: 20, w: "40%" },
        { h: 56, w: "100%" },
        { h: 56, w: "100%" },
        { h: 20, w: "40%" },
        { h: 96, w: "100%" },
    ];

    return (
        <>
            {blocks.map((item, idx) => (
                <AnimatedSkeleton key={idx} height={item.h} width={item.w} className="mb-3" />
            ))}
        </>
    );
}

function AnimatedSkeleton({ height = 56, width = "100%", radius = 14, className = "" }) {
    const opacity = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        const anim = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.55, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        );
        anim.start();
        return () => anim.stop();
    }, [opacity]);

    return (
        <Animated.View style={{ opacity, width }} className={className}>
            <View style={{ height, borderRadius: radius }} className="bg-gray-200" />
        </Animated.View>
    );
}
