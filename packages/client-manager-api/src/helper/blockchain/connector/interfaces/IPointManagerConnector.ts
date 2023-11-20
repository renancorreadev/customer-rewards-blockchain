import { BalanceOfBatchParam, BalanceOfParam } from '@helper/blockchain/types/contracts/client-manager-types';
import { AddPointsParamInput } from '@helper/blockchain/types/contracts/points-core-types';

export interface IPointManagerConnector {
	// Setters blockchain States
	addPoints(params: AddPointsParamInput): Promise<void>;
	// Getters blockchain States
	getClientLevel(clientID: number): Promise<number>;
	getClientPoints(clientID: number): Promise<number>;
	getBalanceOf(params: BalanceOfParam): Promise<number>;
	getBalanceOfAllClients(params: BalanceOfBatchParam): Promise<number[]>;
}
