import { Box, Divider, Grid, Toolbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ServiceRecordFilter } from "../Database/ArrowheadFirebase";
import { Player } from "../Objects/Model/Player";
import { PlayerCard } from "../Assets/Components/Cards/PlayerCard";
import { ViewProps } from "./Props/ViewProps";
import { FilterCount } from "../Objects/Pieces/FilterCounts";
import { ChipFilters } from "./Subpage/ChipFilters";
import { Match } from "../Objects/Model/Match";
import { MatchSummary } from "../Assets/Components/Match/MatchSummary";
import { FirebaseBest } from "../Database/Schemas/FirebaseBest";

export function BestMatchesView(props: ViewProps)
{
	//#region Props and Navigate
	const { app, setLoadingMessage, setGamertag } = props;
	const { filter, gamertag } = useParams();
	const navigate = useNavigate();
	//#endregion
	
	//#region State
	const [myPlayer, setMyPlayer] = useState(new Player());
	const [bests, setBests] = useState<FirebaseBest>();
    const [bestKDA, setBestKDA] = useState<Match>();
	const [worstKDA, setWorstKDA] = useState<Match>();
	const [mostKills, setMostKills] = useState<Match>();
	const [mostDeaths, setMostDeaths] = useState<Match>();
	const [mostAssists, setMostAssists] = useState<Match>();
	const [highestKDSpread, setHighestKDSpread] = useState<Match>();
	const [lowestKDSpread, setLowestKDSpread] = useState<Match>();
    const [image, setImage] = useState("");
	const [availableFilters, setAvailableFilters] = useState<FilterCount[]>([]);
	const [selectedFilter, setSelectedFilter] = useState(filter);
	//#endregion

	const loadData = useCallback(async () => 
	{		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Filters");
		
		// Get player's service record
		if (gamertag)
		{
			setLoadingMessage("Loading " + gamertag);

			const player = await app.GetPlayerAppearanceOnly(gamertag);
			const [filters, bests] = await Promise.all([
				await app.GetAvailableFilters(gamertag, ServiceRecordFilter.Map),
				await app.GetBest(gamertag)
			]);
			
			const [highKDA, lowKDA, highKills, highDeaths, highAssists, highKDS, lowKDS] = await Promise.all([
				await app.GetMatch(bests.match_ids.best_kda),
				await app.GetMatch(bests.match_ids.worst_kda),
				await app.GetMatch(bests.match_ids.most_kills),
				await app.GetMatch(bests.match_ids.most_deaths),
				await app.GetMatch(bests.match_ids.most_assists),
				await app.GetMatch(bests.match_ids.highest_kd_spread),
				await app.GetMatch(bests.match_ids.worst_kd_spread)
			]);
			
			setBestKDA(highKDA);
			setWorstKDA(lowKDA);
			setMostKills(highKills);
			setMostDeaths(highDeaths);
			setMostAssists(highAssists);
			setHighestKDSpread(highKDS);
			setLowestKDSpread(lowKDS);
			
			setBests(bests);
			setAvailableFilters(filters);
			setMyPlayer(player);
			setGamertag(gamertag);
		}

		setLoadingMessage("");
	}, [app, gamertag, setMyPlayer, setLoadingMessage]);

	const loadFilteredSR = useCallback(async () => 
	{		
		// Check if we need to check Firebase or HaloDotAPI
		setLoadingMessage("Loading Best Matches");
		
		// Get player's service record
		if (gamertag && selectedFilter)
		{
			const bests = await app.GetBestForMap(gamertag, selectedFilter);			
			const [highKDA, lowKDA, highKills, highDeaths, highAssists, highKDS, lowKDS] = await Promise.all([
				await app.GetMatch(bests.match_ids.best_kda),
				await app.GetMatch(bests.match_ids.worst_kda),
				await app.GetMatch(bests.match_ids.most_kills),
				await app.GetMatch(bests.match_ids.most_deaths),
				await app.GetMatch(bests.match_ids.most_assists),
				await app.GetMatch(bests.match_ids.highest_kd_spread),
				await app.GetMatch(bests.match_ids.worst_kd_spread)
			]);
			
			setBestKDA(highKDA);
			setWorstKDA(lowKDA);
			setMostKills(highKills);
			setMostDeaths(highDeaths);
			setMostAssists(highAssists);
			setHighestKDSpread(highKDS);
			setLowestKDSpread(lowKDS);
			
			setBests(bests);

			const imageName = selectedFilter.toLowerCase().replace(" ", "-");
			setImage(`https://halo.public.files.stdlib.com/static/infinite/images/multiplayer/maps/${imageName}.jpg`);
		}
		else if (gamertag)
		{
			const bests = await app.GetBest(gamertag);			
			const [highKDA, lowKDA, highKills, highDeaths, highAssists, highKDS, lowKDS] = await Promise.all([
				await app.GetMatch(bests.match_ids.best_kda),
				await app.GetMatch(bests.match_ids.worst_kda),
				await app.GetMatch(bests.match_ids.most_kills),
				await app.GetMatch(bests.match_ids.most_deaths),
				await app.GetMatch(bests.match_ids.most_assists),
				await app.GetMatch(bests.match_ids.highest_kd_spread),
				await app.GetMatch(bests.match_ids.worst_kd_spread)
			]);
			
			setBestKDA(highKDA);
			setWorstKDA(lowKDA);
			setMostKills(highKills);
			setMostDeaths(highDeaths);
			setMostAssists(highAssists);
			setHighestKDSpread(highKDS);
			setLowestKDSpread(lowKDS);
			
			setBests(bests);
		}


		setLoadingMessage("");
	}, [app, gamertag, selectedFilter]);

	const onFilterSelected = useCallback((filter: string) =>
	{
		setSelectedFilter(filter);
	}, []);

    useEffect(() =>
    {
        loadData();
    }, [gamertag]);

	useEffect(() =>
	{
		if (selectedFilter)
		{
			loadFilteredSR();
		}
	}, [selectedFilter]);

	/**
	 * Goes to the selected match
	 * @param id the match ID
	 */
	function goToMatch(id: string): void
    {
		if (gamertag)
		{
			navigate(`/match/${id}/${gamertag}`);
		}
		else 
		{
			navigate(`/match/${id}`);
		}
    }

	return (
		<Box component="main" sx={{ flexGrow: 1 }}>
			<Toolbar />
			<Divider />
			<Box sx={{ p: 2 }}>
				<Grid container spacing={2}>
					{/* Top */}
					<Grid item xs={12}>
						<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
							<PlayerCard player={myPlayer} />
						</Box>
					</Grid>
					{/* Still top but less so*/}
					<Grid item xs={12}>
						<Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
							<ChipFilters activeFilter={selectedFilter ?? ""} filters={availableFilters} onFilterClick={onFilterSelected} />
						</Box>
					</Grid>
				</Grid>
				<Grid container spacing={2} sx={{ mt: 1 }}>
					{bestKDA ? <MatchSummary match={bestKDA} goToMatch={goToMatch} category="Highest KDA" value={bests?.values.best_kda ?? 0} /> : undefined}
					{worstKDA ? <MatchSummary match={worstKDA} goToMatch={goToMatch} category="Lowest KDA" value={bests?.values.worst_kda ?? 0} /> : undefined}
					{mostKills ? <MatchSummary match={mostKills} goToMatch={goToMatch} category="Most Kills" value={bests?.values.most_kills ?? 0} /> : undefined}
					{mostDeaths ? <MatchSummary match={mostDeaths} goToMatch={goToMatch} category="Most Deaths" value={bests?.values.most_deaths ?? 0} /> : undefined}
					{mostAssists ? <MatchSummary match={mostAssists} goToMatch={goToMatch} category="Most Assists" value={bests?.values.most_assists ?? 0} /> : undefined}
					{highestKDSpread ? <MatchSummary match={highestKDSpread} goToMatch={goToMatch} category="Highest KD Spread" value={bests?.values.highest_kd_spread ?? 0} /> : undefined}
					{lowestKDSpread ? <MatchSummary match={lowestKDSpread} goToMatch={goToMatch} category="Lowest KD Spread" value={bests?.values.worst_kd_spread ?? 0} /> : undefined}
				</Grid>
			</Box>
		</Box>
	);
}