import { Controller, Get, Inject, Logger } from '@nestjs/common';
import {
	ApiBadRequestResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseUrls, DependencyInjectionTokens } from 'customer-rewards-api/src/helper/AppConstants';

import { GetClientResponse } from '../../Domain/Dto/HTTPResponse/GetClientResponse';
import { CustomerDBTokenUseCase } from '../../Port/Input/db/CustomerDBTokenUseCase';

@Controller({
	path: BaseUrls.CUSTOMER,
})
@ApiTags('Blockchain Customer Endpoints')
export class CustomerDBWebAdapter {
	private readonly logger = new Logger('CustomerDBWebAdapter');
	constructor(
		@Inject(DependencyInjectionTokens.CUSTOMER_DB_TOKEN_USE_CASE)
		private customerDBService: CustomerDBTokenUseCase,
	) {}

	/// ------------------------      GET ALL CLIENTs DATAs          ---------------------
	/// --------------------------------------------------------------------------------------
	@ApiOperation({
		summary: 'Get All Clients Data ',
		description: 'Find All Clients Information',
	})
	@ApiOkResponse({
		description: 'Success operation',
		type: GetClientResponse,
	})
	@ApiBadRequestResponse({ description: 'Bad request' })
	@ApiUnauthorizedResponse({ description: 'Unauthorized' })
	@ApiForbiddenResponse({ description: 'Forbidden' })
	@ApiNotFoundResponse({ description: 'Segment not found' })
	@Get('/all')
	async getAllCustomers() {
		try {
			this.logger.log('---------- PROCESS BEGIN ----------');
			this.logger.log(`Running Client Blockchain Web adapter`);

			return await this.customerDBService.findAll();
		} catch (e) {
			const errorMessage = e.response ? e.response.data : e.message;
			this.logger.error(`Error : ${JSON.stringify(errorMessage)}`);
			throw new Error(`An error ocurred in read contract getAllCustomers on clientWebAdapter `);
		}
	}
}
