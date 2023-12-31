import { ApiProperty } from '@nestjs/swagger';

export class AttributeLevel {
	@ApiProperty({ example: 'Nível', description: 'Tipo do atributo' })
	level_type: string;

	@ApiProperty({ example: 1, description: 'O nível do cliente' })
	value: number;
}

export class AttributeNFT {
	@ApiProperty({ example: 'Nível', description: 'Tipo do atributo' })
	nft_type: string;

	@ApiProperty({ example: 'CUSTOMER_PREMIUM', description: 'Tipo de NFT' })
	value: string;
}

export class Benefit {
	@ApiProperty({ example: 2, description: 'TokenID' })
	TokenID?: number;

	@ApiProperty({ example: 'Descrição do benefício', description: 'Descrição do benefício' })
	description: string;

	@ApiProperty({ example: '10%', description: 'Desconto oferecido' })
	discount?: string;

	@ApiProperty({ example: 'Frete GRATIS', description: 'Frete grátis' })
	freeFrete?: string;

	@ApiProperty({ example: 'Promoção nivel I', description: 'Promoção de nível I' })
	promotionLevel?: string;
}

export class AttributeBenefits {
	@ApiProperty({ example: 'CUSTOMER_PREMIUM', description: 'Tipo de atributo' })
	benefit_type: string;

	@ApiProperty({ type: [Benefit], description: 'Lista de benefícios' })
	value: Benefit[];
}

export class RegisterMetadataBodySwaggerAPI {
	@ApiProperty({ example: 1, description: 'O ID único do token' })
	tokenID: number;

	@ApiProperty({ example: 'Nome do cliente', description: 'Nome do cliente' })
	customer: string;

	@ApiProperty({ example: 'Descrição do nível do cliente', description: 'Descrição do nível do cliente' })
	description: string;

	@ApiProperty({ example: 'https://meusite.com/imagens/nft/1.png', description: 'URL da imagem do NFT' })
	image: string;

	@ApiProperty({ example: 'Insígnia do cliente', description: 'Insígnia do cliente' })
	insight: string;

	@ApiProperty({
		type: 'object',
		properties: {
			level: { type: 'number', example: 1 },
			points: { type: 'number', example: 240 },
			benefits: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						level_type: { type: 'string', example: 'Nível' },
						value: { type: 'number', example: 1 },
					},
				},
				example: [
					{
						level_type: 'Nível',
						value: 1,
					},
					{
						nft_type: 'NFT',
						value: 'CUSTOMER_TITANIUM',
					},
					{
						benefit_type: 'Benefits',
						value: [
							{
								discount: '20%',
								description: 'Desconto de 20% em todos os produtos.',
							},
							{
								freeFrete: 'Frete GRATIS',
								description: 'Frete GRATIS no seu estado.',
							},
							{
								promotionLevel: 'Promoção nivel 1',
								description: 'Com esse benefício você tem acesso ao nível 1 do catálogo de promoção',
							},
						],
					},
				],
			},
		},
	})
	attributes: {
		points?: number;
		level?: number;
		benefits?: {
			level_type?: string;
			value?: number;
		}[];
	};
}
