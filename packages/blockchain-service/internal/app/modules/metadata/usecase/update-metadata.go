package usecase

import (
	"context"
	"math/big"
	"service/internal/app/modules/metadata/domain"
	"service/internal/app/modules/metadata/repository"
)

type MetadataUpdaterURI struct {
	Repo repository.BlockchainRepository
}

func NewMetadataUpdaterURI(repo repository.BlockchainRepository) *MetadataUpdaterURI {
	return &MetadataUpdaterURI{Repo: repo}
}

func (updater *MetadataUpdaterURI) UpdateMetadata(ctx context.Context, clientID string, newPoints *big.Int) error {
	thresholds, err := updater.Repo.GetThresholds(ctx)
	if err != nil {
			return err
	}

	metadata := determineMetadata(clientID, newPoints.Int64(), thresholds) // Converta *big.Int para int64, se necessário
	return updater.Repo.UpdateMetadata(ctx, clientID, metadata)
}

func determineMetadata(clientID string, newPoints int64, thresholds domain.Thresholds) domain.Metadata {
	metadata := domain.Metadata{
			TokenID:  clientID,
			Customer: "Nome do Cliente", // Este valor deve ser obtido de forma dinâmica
			Image:    "https://meusite.com/imagens/nft/1.png",
	}

	switch {
	case newPoints < thresholds.PointsForPremium:
			metadata.Description = "Voce ainda não alcançou nenhuma insignia e nenhum nivel"
			metadata.Insight = "sem insignia"
			metadata.Attributes = []domain.Attribute{
					{Type: "level_type", Value: 0},
					{Type: "nft_type", Value: "Sem NFT"},
					{Type: "benefit_type", Value: []interface{}{}},
			}

	case newPoints >= thresholds.PointsForPremium && newPoints < thresholds.PointsForGold:
			metadata.Description = "Voce está no nivel I com a insignia Customer Premium"
			metadata.Insight = "CUSTOMER_PREMIUM"
			metadata.Attributes = []domain.Attribute{
					{Type: "level_type", Value: 1},
					{Type: "nft_type", Value: "CUSTOMER_PREMIUM"},
					{Type: "benefit_type", Value: []interface{}{
							map[string]interface{}{"discount": "10%", "description": "Desconto de 10%"},
							map[string]interface{}{"FreeFrete": "Frete gratis", "description": "Frete gratis para todo o Brasil"},
							map[string]interface{}{"promotionLevel": "Promoção nivel I", "description": "Com esse benefício voce tem acesso ao nivel 1 do catalogo de promoção"},
					}},
			}

	case newPoints >= thresholds.PointsForGold && newPoints < thresholds.PointsForTitanium:
			metadata.Description = "Voce está no nivel II com a insignia Customer Gold"
			metadata.Insight = "CUSTOMER_GOLD"
			metadata.Attributes = []domain.Attribute{
					{Type: "level_type", Value: 2},
					{Type: "nft_type", Value: "CUSTOMER_GOLD"},
					{Type: "benefit_type", Value: []interface{}{
							map[string]interface{}{"discount": "35%", "description": "Desconto de 35%"},
							map[string]interface{}{"FreeFrete": "Frete gratis", "description": "Frete gratis para todo o Brasil"},
							map[string]interface{}{"promotionLevel": "Promoção nivel II", "description": "Com esse benefício voce tem acesso ao nivel 2 do catalogo de promoção"},
							map[string]interface{}{"doublePoints": "Pontuação em dobro", "description": "Pontuação em dobro a cada vez que você compra na loja para chegar no próximo nivel mais rapido."},
					}},
			}

	// newPoints >= thresholds.PointsForTitanium
	default: 
			metadata.Description = "Voce está no nivel III com a insignia Customer Titanium"
			metadata.Insight = "CUSTOMER_TITANIUM"
			metadata.Attributes = []domain.Attribute{
					{Type: "level_type", Value: 3},
					{Type: "nft_type", Value: "CUSTOMER_TITANIUM"},
					{Type: "benefit_type", Value: []interface{}{
							map[string]interface{}{"discount": "50%", "description": "Desconto de 50%"},
							map[string]interface{}{"FreeFrete": "Frete gratis", "description": "Frete gratis para todo o Brasil"},
							map[string]interface{}{"promotionLevel": "Promoção nivel III", "description": "Com esse benefício voce tem acesso ao nivel 3 do catalogo de promoção"},
							map[string]interface{}{"doublePoints": "Pontuação em Triplo", "description": "Pontuação em dobro a cada vez que você compra na loja para chegar no próximo nivel mais rapido."},
							map[string]interface{}{"gifts": "Presente para o cliente", "description": "Diversos produtos e serviços de brinde para o cliente que recebeu o NFT do nível 3"},
							map[string]interface{}{"priority": "Prioridade para o cliente", "description": "Prioridade para o cliente em atendimentos, recursos, trocas, pedidos e vendas"},
							map[string]interface{}{"birthdays": "Ofertas imperdiveis para Aniversariantes", "description": "É seu aniversário? Com esse benefício voce tem acesso a ofertas imperdiveis para Aniversariantes"},
					}},
			}
	}

	return metadata
}