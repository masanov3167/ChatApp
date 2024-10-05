import { Path, Svg } from "react-native-svg"
import { colors } from "../utils/variables"

type Props = {
    light?: boolean
}
export const Microphone = ({ light }: Props) => {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 27 27" fill="none">
            <Path strokeWidth={1.9} d="M14 25C14 25 14 22.9525 14 21.4222M14 21.4222C6 21.4222 6 13.4148 6 13.4148M14 21.4222C22 21.4222 22 13.4148 22 13.4148M14 17.3333C18.2553 17.3333 18.2553 13.0741 18.2553 13.0741V6.25926C18.2553 6.25926 18.2553 2 14 2C9.74468 2 9.74468 6.25926 9.74468 6.25926V13.0741C9.74468 13.0741 9.74468 17.3333 14 17.3333Z" stroke={light ? colors.tgWhite : colors.blue} stroke-width="1.5" stroke-linecap="round" />
        </Svg>
    )
}

export const PlusCircle = ({ light }: Props) => {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 27 27" fill="none">
            <Path strokeWidth={1.9} d="M6.2782 11.8065L12.9998 4.98249C19.0116 -1.02903 28.0292 7.98825 22.0174 13.9998L13.3335 22.6783C9.32562 26.686 3.31388 20.6745 7.32171 16.6668L16.0057 7.98825C17.9947 6.04839 20.9973 9.09678 19.3452 10.994L11.0383 19.4274" stroke={light ? "white" : colors.tgWhite} stroke-width="1.5" stroke-linecap="round" />
        </Svg>

    )
}

export const Send = ({ light }: Props) => {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 27 27" fill="none">
            <Path d="M3.0016 3.98437C3.0016 3.65625 3.0016 3.00001 4.16548 3C5.6619 2.99998 22.2888 11.5313 23.4527 12.5156C24.3838 13.3031 23.9499 14.1562 23.4511 14.4844C22.2875 15.4685 5.50289 23.9949 4.16388 24C3 24 3 23.3438 3 23.0156L4.16505 15.7969C4.29771 15.0094 4.66401 14.8125 4.83057 14.8125L14.8067 13.8281C14.9175 13.8281 15.1392 13.7625 15.1392 13.5C15.1392 13.2375 14.9175 13.1719 14.8067 13.1719L4.83057 12.1875C4.66401 12.1875 4.29771 11.9906 4.16505 11.2031C3.77561 8.82365 3.0016 4.3125 3.0016 3.98437Z" fill={light ? "white" : colors.tgWhite} />
        </Svg>

    )
}

export const Play = ({ light }: Props) => {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 27 27" fill="none">
            <Path d="M5 5.62683C5 4.01474 6.8601 3.6587 7.87469 4.30355L20.219 12.2646C20.8954 12.7202 21.5718 13.8487 20.219 14.8592L7.87469 22.6818C6.8601 23.3266 5 23.0378 5 21.3881V13.5733V5.62683Z" fill={light ? "white" : colors.tgWhite} />
        </Svg>

    )
}

export const Pause = ({ light }: Props) => {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 27 27" fill="none">
            <Path d="M7.07692 22C6.71795 22 6 21.7882 6 20.9412V5.05884C6 4.7059 6.21538 4.00002 7.07692 4.00002H10.3077C10.6667 4.00002 11.3846 4.21178 11.3846 5.05884V20.9412C11.3846 21.2941 11.1692 22 10.3077 22H7.07692Z" fill={light ? "white" : colors.tgWhite} />
            <Path d="M15.6923 22C15.3333 22 14.6154 21.7882 14.6154 20.9412V5.05882C14.6154 4.70588 14.8308 4 15.6923 4H18.9231C19.2821 4 20 4.21176 20 5.05882V20.9412C20 21.2941 19.7846 22 18.9231 22H15.6923Z" fill={light ? "white" : colors.tgWhite} />
        </Svg>

    )
}

export const Download = () => {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 27 27" fill="none" style={{ transform: [{ rotate: '90deg' }] }}>
            <Path d="M15.4351 22L24 13.5L15.4351 5V10.6667H2V16.3333H15.4351V22Z" fill="#868686" />
        </Svg>
    )
}

export const File = () => {
    return (
        <Svg width="17" height="19" viewBox="0 0 17 19" fill="none">
            <Path fillRule="evenodd" clipRule="evenodd" d="M2.97087 0C1.98058 0 0 0.594783 0 2.97391V16.0261C0 18.4052 1.98058 19 2.97087 19H14.0291C15.0194 19 17 18.4052 17 16.0261V6.68556C17 6.54979 17 6.44348 16.835 6.27826L11.2233 0.66087C11.2233 0.660868 10.5631 0 10.233 0H2.97087ZM14.7108 6.46501L10.7083 2.45837C10.2895 2.03911 9.57281 2.33574 9.57281 2.92835V6.935C9.57281 7.30227 9.87055 7.6 10.2378 7.6H14.2404C14.8327 7.6 15.1294 6.88404 14.7108 6.46501Z" fill="#868686" />
        </Svg>
    )
}

export const Done = ({ light }: Props) => {
    return (
        <Svg width="100%" height="100%" viewBox="0 0 19 14" fill="none">
            <Path d="M6.5 10.1379L2 5.7931L0 7.72414L6.5 14L19 1.93103L17 0L6.5 10.1379Z" fill={light ? colors.tgWhite : colors.blue} />
        </Svg>

    )
}