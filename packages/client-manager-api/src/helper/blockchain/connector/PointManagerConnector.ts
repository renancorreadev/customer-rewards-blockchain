import { PointCoreBlockchainConnector } from '../PointsCoreBlockchainConnector';
import { BalanceOfBatchParam, BalanceOfParam } from '../types/contracts/client-manager-types';
import { AddPointsParamInput } from '../types/contracts/points-core-types';

/// @interfaces
import { IPointManagerConnector } from './interfaces/IPointManagerConnector';

export class PointsManagerConnector extends PointCoreBlockchainConnector implements IPointManagerConnector {
	// Setters blockchain States
	async addPoints(params: AddPointsParamInput) {
		try {
			const { clientId, points } = params;
			const tx = await this.contract.addPoints(clientId, points, {
				gasLimit: 500000,
				gasPrice: 0,
			});

			await tx.wait();
		} catch (e) {
			console.error('Erro ao enviar pontos para o cliente:', e);

			const errorMessage = e instanceof Error ? e.message : 'Unknown error';
			throw new Error(`Erro ao escrever na função addPoints do contrato na EVM: ${errorMessage}`);
		}
	}

	async getClientLevel(clientID: number): Promise<number> {
		try {
			return Number(await this.contract.getClientLevel(clientID));
		} catch (e) {
			console.error('Erro ao recuperar level do cliente:', e);

			const errorMessage = e instanceof Error ? e.message : 'Unknown error';
			throw new Error(`Erro na function getClientLevel do contrato na EVM: ${errorMessage}`);
		}
	}

	async getClientPoints(clientID: number): Promise<number> {
		try {
			return Number(await this.contract.getClientPoints(clientID));
		} catch (e) {
			console.error('Erro ao recuperar pontos do cliente:', e);

			const errorMessage = e instanceof Error ? e.message : 'Unknown error';
			throw new Error(`Erro na function getClientPoints do contrato na EVM: ${errorMessage}`);
		}
	}

	async getBalanceOf(params: BalanceOfParam): Promise<number> {
		const { account, id } = params;

		const balance = await this.contract.balanceOf(account, id);

		return Number(balance);
	}

	async getBalanceOfAllClients(params: BalanceOfBatchParam): Promise<number[]> {
		const { accounts, ids } = params;
		const balance = await this.contract.balanceOfBatch(accounts, ids);

		if (balance.length === 0) {
			return [];
		}

		if (balance.length !== accounts.length) {
			throw new Error('The length of balance and accounts must be the same');
		}

		return balance.map((bigIntValue) => Number(bigIntValue));
	}
}
