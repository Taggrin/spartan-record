import { AutocodeStockpileMode } from "../../Database/Schemas/AutocodeMultiplayerServiceRecord";

export class Stockpile
{
	killsAsPowerSeedCarrier: number = 0;
	powerSeedCarriersKilled: number = 0;
	powerSeedsDeposited: number = 0;
	powerSeedsStolen: number = 0;
	timeAsPowerSeedCarrier: string = "";
	timeAsPowerSeedDriver: string = "";

	constructor(data?: AutocodeStockpileMode)
	{
		if (!data) { return; }
		this.killsAsPowerSeedCarrier = data.kills_as_power_seed_carrier;
		this.powerSeedCarriersKilled = data.power_seed_carriers_killed;
		this.powerSeedsDeposited = data.power_seeds_deposited;
		this.powerSeedsStolen = data.power_seeds_stolen;
		this.timeAsPowerSeedCarrier = data.time_as_power_seed_carrier?.human ?? "";
		this.timeAsPowerSeedDriver = data.time_as_power_seed_driver?.human ?? "";
	}
}