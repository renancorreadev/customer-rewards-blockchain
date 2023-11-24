import { JsonRpcProvider, Wallet } from 'ethers';
import { CustomerManagementCore, ClientManager__factory } from '@smart-contracts';

export class ClientManagerBlockchainConnector {
	protected contract: CustomerManagementCore;
	protected provider: JsonRpcProvider;
	protected wallet: Wallet;

	constructor(contractAddress: string, provider: string, privateKey: string) {
		this.provider = new JsonRpcProvider(provider);
		this.wallet = new Wallet(privateKey, this.provider);
		this.contract = ClientManager__factory.connect(contractAddress, this.wallet);
	}
}
