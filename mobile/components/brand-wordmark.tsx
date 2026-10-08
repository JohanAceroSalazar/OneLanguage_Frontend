import type { StyleProp, ViewStyle } from "react-native";
import { StyleSheet, Text, View } from "react-native";

type BrandWordmarkProps = {
    color: string;
    style?: StyleProp<ViewStyle>;
};

export function BrandWordmark({ color, style }: BrandWordmarkProps) {
    return (
        <View style={style} accessible accessibilityRole="header" accessibilityLabel="One Language">
            <Text style={[styles.text, { color }]}>ONE{"\n"}LANGUAGE</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        width: 128,
        height: 44,
        fontSize: 20,
        lineHeight: 22,
        fontWeight: "800",
        letterSpacing: 0,
        includeFontPadding: false,
        textAlign: "left",
    },
});
