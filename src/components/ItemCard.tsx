// ItemCard.tsx
import React, { use, useEffect, useState } from "react";
import { Card, Text, Button, Icon, useTheme, Chip } from "react-native-paper";
import { View, StyleSheet, useColorScheme } from "react-native";
import {Item} from "../interfaces/Item";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fontSizes } from "./Themes/Typography";

interface Props {
  item: Item;
  onEdit: () => void;
  onDelete: () => void;
}

const ItemCard = ({ item, onEdit, onDelete }: Props) => {
  const [mediaHistorica, setMediaHistorica] = useState<number | null>(null);
  const { colors } = useTheme();
  const scheme = useColorScheme();

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
            {item.isPromotion && <Icon source="star-outline" color={scheme === 'dark' ? '#FFA000' : '#FFCA28'} size={24} />}
            <Text
              style={{
                marginLeft: item.isPromotion ? 8 : 0,
                fontWeight: "bold",
                fontSize: fontSizes.medium
              }}
            >
              {item.name}
            </Text>
          </View>
          <Text style={{ fontSize: fontSizes.small }}>
            Qtd: <Text style={{ fontWeight: "bold", fontSize: fontSizes.normal, fontStyle: 'italic' }}>{item.quantity}x</Text>
          </Text>
        </View>
        <Text style={{ fontSize: fontSizes.small }}>
          Preço Unitário:{" "}
          <Text style={{ fontWeight: "bold", fontSize: fontSizes.normal, fontStyle: 'italic' }}>
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.pricePerItem)}
          </Text>
        </Text>
        <Text style={{ fontSize: fontSizes.small }}>
          Preço Total:{" "}
          <Text style={{ fontWeight: "bold", fontSize: fontSizes.normal, fontStyle: 'italic' }}>
            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.priceFull)}
          </Text>
        </Text>
        {mediaHistorica !== null && (
          <Text style={{ fontStyle: "italic", marginTop: 4, fontSize: fontSizes.small }}>
            Preço médio histórico: R$ {mediaHistorica.toFixed(2)}
          </Text>
        )}
      </Card.Content>
      <Card.Actions>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 }}>
          <Chip textStyle={{ color: colors.primary, fontSize: fontSizes.normal, fontWeight: 'bold', fontStyle: 'italic' }} >{item.category}</Chip>
          <View style={{ flexDirection: 'row' }}>
        <Button 
          // style={{ borderColor: '#004D40' }}
          // textColor="#004D40"
          mode='outlined'
          labelStyle={{ fontSize: fontSizes.normal }}
          onPress={onEdit}>Editar</Button>
        <Button 
          // style={{ backgroundColor: '#004D40', borderColor: '#004D40' }}
          style={{ marginLeft: 10 }}
          mode='contained'
          labelStyle={{ fontSize: fontSizes.normal }}
          onPress={onDelete}>Excluir</Button>
          </View>
        </View>
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
  },
  promotion: {
    // backgroundColor: "#E6EE9C",
    // borderColor: "#4CAF50",
    borderWidth: 2,
  },
  not_promotion: {
    // backgroundColor: "#F1F8E9",
    // borderColor: "#B2DFDB",
    borderWidth: 2,
  },
});

export default ItemCard;
