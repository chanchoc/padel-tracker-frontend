import { useLocalSearchParams } from "expo-router";
import { MatchDetails } from "../../components/MatchDetails.jsx";

export default function MatchDetailsScreen() {
    const { id } = useLocalSearchParams();

    return <MatchDetails matchId={id} />;
}
