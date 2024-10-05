import { StyleSheet } from "react-native";
import { colors } from "./variables";

export const Flex = StyleSheet.create({
    row:{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        flexDirection:"row"
    }
})

export const headerStyles = StyleSheet.create({
    main: {
        ...Flex.row,
        padding: 5,
        paddingBottom: 10,
        borderColor: colors.blue,
        borderBottomWidth: 1,
        backgroundColor: colors.blue
    },
    left: {
        width: 30,
        height: 30,
        ...Flex.row
    },
    right: {
        flex: 1,
        marginLeft: 10,
        ...Flex.row
    },
    rightText: {
        fontSize: 18,
        fontWeight: "800",
        color: "white"
    }
});

export const submitBtn = StyleSheet.create({
    btn: {
        ...Flex.row,
        justifyContent: "center",
        marginTop: 10,
        backgroundColor: colors.blue,
        padding: 10,
        borderRadius: 6,
        marginBottom: 30
    },
    text: {
        color: "white",
        fontSize: 17,
        fontWeight: "700"
    }
});

export const Default = StyleSheet.create({
    bg:{
        backgroundColor:"white"
    },
    text:{
        color:"dark"
    }
})