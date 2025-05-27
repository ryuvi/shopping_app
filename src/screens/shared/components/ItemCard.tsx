// ItemCard.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Button, Icon, useTheme, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Itens } from "../../../db/schema";
import { fontSizes } from "../ui/Typography";
import { useColorScheme } from "react-native";

interface Props {
  item: Itens;
  onEdit: () => void;
  onDelete: () => void;
}

const ItemCard = ({ item, onEdit, onDelete }: Props) => {
  const [mediaHistorica, setMediaHistorica] = useState<number | null>(null);
  const { colors } = useTheme();
  const scheme = useColorScheme();

  useEffect(() => {
    const carregarMedia = async () => {
      try {
        const historicoAtual = await AsyncStorage.getItem("historico-items");
        if (historicoAtual) {
          const historico = JSON.parse(historicoAtual);
          const valores = historico[item.nome] || []; // Usando item.nome conforme schema
          if (valores.length > 0) {
            const soma = valores.reduce((acc: number, v: number) => acc + v, 0);
            const media = soma / valores.length;
            setMediaHistorica(media);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar média histórica:", error);
      }
    };
    carregarMedia();
  }, [item.nome]);

  // Calcula o preço total baseado nos campos do schema
  const precoTotal = item.peso != 1 ? (item.price * item.peso) : (item.price * item.quantity);

  return (
    <Card
      style={[
        styles.card,
        item.isPromocao ? styles.promotion : styles.not_promotion,
      ]}
    >
      <Card.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {item.isPromocao && (
              <Icon 
                source="star-outline" 
                color={scheme === 'dark' ? '#FFA000' : '#FFCA28'} 
                size={24} 
              />
            )}
            <Text
              style={{
                marginLeft: item.isPromocao ? 8 : 0,
                fontWeight: "bold",
                fontSize: fontSizes.medium
              }}
            >
              {item.nome} {/* Usando item.nome conforme schema */}
            </Text>
          </View>
          <Text style={{ fontSize: fontSizes.small }}>
            Qtd: <Text style={{ fontWeight: "bold", fontSize: fontSizes.normal, fontStyle: 'italic' }}>
              {item.quantity}x
            </Text>
          </Text>
        </View>
        <Text style={{ fontSize: fontSizes.small }}>
          Preço Unitário:{" "}
          <Text style={{ fontWeight: "bold", fontSize: fontSizes.normal, fontStyle: 'italic' }}>
            {new Intl.NumberFormat("pt-BR", { 
              style: "currency", 
              currency: "BRL" 
            }).format(item.price)}
          </Text>
        </Text>
        <Text style={{ fontSize: fontSizes.small }}>
          Peso:{" "}
          <Text style={{ fontWeight: "bold", fontSize: fontSizes.normal, fontStyle: 'italic' }}>
            {item.peso} kg
          </Text>
        </Text>
        <Text style={{ fontSize: fontSizes.small }}>
          Preço Total:{" "}
          <Text style={{ fontWeight: "bold", fontSize: fontSizes.normal, fontStyle: 'italic' }}>
            {new Intl.NumberFormat("pt-BR", { 
              style: "currency", 
              currency: "BRL" 
            }).format(precoTotal)}
          </Text>
        </Text>
        {mediaHistorica !== null && (
          <Text style={{ fontStyle: "italic", marginTop: 4, fontSize: fontSizes.small }}>
            Preço médio histórico:{" "}
            {new Intl.NumberFormat("pt-BR", { 
              style: "currency", 
              currency: "BRL" 
            }).format(mediaHistorica)}
          </Text>
        )}
      </Card.Content>
      <Card.Actions>
        <View style={styles.actionsContainer}>
          <Chip 
            textStyle={{ 
              color: colors.primary, 
              fontSize: fontSizes.normal, 
              fontWeight: 'bold', 
              fontStyle: 'italic' 
            }}
          >
            {item.category}
          </Chip>
          <View style={styles.buttonsContainer}>
            <Button 
              mode='outlined'
              labelStyle={{ fontSize: fontSizes.normal }}
              onPress={onEdit}
            >
              Editar
            </Button>
            <Button 
              style={{ marginLeft: 10 }}
              mode='contained'
              labelStyle={{ fontSize: fontSizes.normal }}
              onPress={onDelete}
            >
              Excluir
            </Button>
          </View>
        </View>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderWidth: 2,
  },
  promotion: {
    borderColor: "#FFD700", // Cor dourada para promoção
  },
  not_promotion: {
    borderColor: "#E0E0E0", // Cor cinza para itens normais
  },
  actionsContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    paddingHorizontal: 10
  },
  buttonsContainer: {
    flexDirection: 'row'
  }
});

export default ItemCard;