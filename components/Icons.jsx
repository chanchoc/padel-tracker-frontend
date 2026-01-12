import FontAwesome from "@expo/vector-icons/FontAwesome";
import { View } from "react-native";

const IconWrapper = ({ children, size = 24 }) => {
    return <View style={{ width: size, alignItems: "center", justifyContent: "center" }}>{children}</View>;
};

export const PasswordIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="lock" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const EmailIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="at" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const UserIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="user" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const BackArrowIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="arrow-left" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const SaveIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="save" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const EditIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="pencil" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const DropdownIcon = (props) => {
    const { size = 24, ...rest } = props;
    return <FontAwesome name="chevron-down" size={size} color="black" {...rest} />;
};

export const CalendarIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="calendar" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export function TennisIcon(props) {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="list-ul" size={size} color="black" {...rest} />
        </IconWrapper>
    );
}

export const StatsIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="signal" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const LocationIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="location-arrow" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const TeammateIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size + 3}>
            <FontAwesome name="user-plus" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const OpponentIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size + 3}>
            <FontAwesome name="user-times" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const LevelIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="list-ol" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const SideIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="expand" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const ResultIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="flag" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const CommentIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="comment" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const ScoreIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="star" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const FiltersIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="filter" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const PlusIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="plus" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const WinIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="trophy" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const LoseIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="ban" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};

export const UnknownIcon = (props) => {
    const { size = 24, ...rest } = props;
    return (
        <IconWrapper size={size}>
            <FontAwesome name="question" size={size} color="black" {...rest} />
        </IconWrapper>
    );
};
