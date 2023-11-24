import { RegisterMetadataRequestDTO, UpdateMetadataRequestDTO } from '../../Domain/Dto/HTTPRequest';
import { MetadataResponse } from '../../Domain/Dto/HTTPResponse/MetadataResponse';

export interface MetadataTokenOutputPort {
	registerMetadata(registerMetadata: RegisterMetadataRequestDTO): Promise<string>;
	getTokenID(tokenID: number): Promise<MetadataResponse>;
	updateMetadata(updateMetadataDto: UpdateMetadataRequestDTO): Promise<string>;
	deleteMetadata(tokenID: number): Promise<string>;
}
