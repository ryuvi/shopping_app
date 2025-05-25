import React, { useEffect, useState } from "react";
import { Card, Text, Button, Icon } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import Item from "../interfaces/Item";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
}

const ItemCard = ({ item, onEdit, onDelete }: Props) => {
  const [mediaHistorica, setMediaHistorica] = useState<number | null>(null);

  useEffect(() => {
    const carregarMedia = async () => {
      const historicoAtual = await AsyncStorage.getItem("historico-items");
      if (historicoAtual) {
        const historico = JSON.parse(historicoAtual);
        const valores = historico[item.name] || [];
        if (valores.length > 0) {
          const soma = valores.reduce((acc: number, v: number) => acc + v, 0);
          const media = soma / valores.length;
          setMediaHistorica(media);
        }
      }
    };
    carregarMedia();
  }, [item.name]);

  return (
    <Card
      style={[
        styles.card,
        item.isPromotion ? styles.promotion : styles.not_promotion,
      ]}
    >
      <Card.Content>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {item.isPromotion && <Icon source="star-outline" size={24} />}
            <Text
              variant="titleMedium"
              style={{
                marginLeft: item.isPromotion ? 8 : 0,
                fontWeight: "bold",
              }}
            >
              {item.name}
            </Text>
          </View>
          <Text>
            Qtd: <Text style={{ fontWeight: "bold" }}>{item.quantity}x</Text>
          </Text>
        </View>
        <Text>
          Preço Unitário:{" "}
          <Text style={{ fontWeight: "bold" }}>
            R${item.pricePerItem.toFixed(2)}
          </Text>
        </Text>
        <Text>
          Preço Total:{" "}
          <Text style={{ fontWeight: "bold" }}>
            R$ {item.priceFull.toFixed(2)}
          </Text>
        </Text>
        {mediaHistorica !== null && (
          <Text style={{ fontStyle: "italic", marginTop: 4 }}>
            Preço médio histórico: R$ {mediaHistorica.toFixed(2)}
          </Text>
        )}
      </Card.Content>
      <Card.Actions>
        <Button style={{ borderColor: '#004D40' }} textColor="#004D40" onPress={onEdit}>Editar</Button>
        <Button style={{ backgroundColor: '#004D40', borderColor: '#004D40' }} onPress={onDelete}>Excluir</Button>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  promotion: {
    backgroundColor: "#E6EE9C",
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  not_promotion: {
    backgroundColor: "#F1F8E9",
    borderColor: "#B2DFDB",
    borderWidth: 2,
  },
});

export default ItemCard;
