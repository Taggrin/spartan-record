import { Box, Button, Checkbox, Typography } from "@mui/material";
import { Company } from "../../../Objects/Model/Company";

import GroupsIcon from '@mui/icons-material/Groups';
import { Player } from "../../../Objects/Model/Player";
import { Halo5Converter } from "../../../Objects/Helpers/Halo5Converter";

import ArrowheadImg from "../../Images/arrowhead.png";
import { User } from "../../../Objects/Model/User";

export function MemberList(props: { company: Company, goToMember: Function, setPlayer: Function })
{
	const { company, goToMember, setPlayer } = props;

	return (
		<Box sx={{ backgroundColor: "divider", borderRadius: 3, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
			<GroupsIcon sx={{ fontSize: "160px", padding: 2 }} />
			{company.players.map(player => <MemberComponent player={player} goToMember={goToMember} setPlayer={setPlayer} />)}
		</Box>
	);
}

function MemberComponent(props: { player: Player, goToMember: Function, setPlayer: Function })
{
	const { player, goToMember, setPlayer } = props;

	function setPlayerClick(): void
	{
		setPlayer(player);
		goToMember(player.gamertag);
	}

	return (
		<Box sx={{ backgroundColor: "secondary.main", borderRadius: 3, display: "flex", flexDirection: "row", alignItems: "center", width: "90%", margin: 1, padding: 1 }}>
			<Button onClick={setPlayerClick} sx={{ width: "100%", justifyContent: "flex-start", borderRadius: 2, textTransform: "none", textAlign: "left" }}>
				<img src={player.appearance.emblemURL === "" ? ArrowheadImg : player.appearance.emblemURL} alt="emblem" height="48px" />
				<Box sx={{ ml: 1, flexGrow: 1, display: "flex", flexDirection: "column" }}>
					<Typography variant="body1">{player.gamertag}</Typography>
					<Typography variant="body2" sx={{ fontWeight: 100 }}>{Halo5Converter.GetLevelFromScore(player.serviceRecord.totalScore)}</Typography>
				</Box>
			</Button>
		</Box>
	);
}