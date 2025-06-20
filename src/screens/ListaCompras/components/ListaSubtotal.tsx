import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { fontSizes } from "../../shared/ui/Typography";

export default function ListaSubtotal({ subtotal, limite }: { subtotal: number, limite: number }) {
  const { colors } = useTheme();
  const width = useWindowDimensions().width;

  const progress = Math.min(subtotal / limite, 1);
  const progressPercentage = Math.round(progress * 100);

  // Função que calcula a cor baseada no progresso (HSL)
  const getProgressColor = () => {
    if (subtotal === 0) return '#4CAF50'; // Verde quando zerado
    
    // Transição: verde (0%) → amarelo (50%) → vermelho (100%)
    const hue = Math.max(0, (1 - progress) * 120); // HSL: verde=120, vermelho=0
    return `hsl(${hue}, 100%, 45%)`;
  };

  return (
    <View style={{ backgroundColor: colors.surface, paddingVertical: 5 }}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Subtotal: <Text style={{ 
            fontWeight: "bold",
            color: getProgressColor()
          }}>
            {new Intl.NumberFormat("pt-BR", { 
              style: "currency", 
              currency: "BRL" 
            }).format(subtotal)}
          </Text>
        </Text>
        
        <Text style={[styles.limitText, { color: colors.onSurfaceDisabled, }]}>
          Limite: {new Intl.NumberFormat("pt-BR", { 
            style: "currency", 
            currency: "BRL" 
          }).format(limite)}
          <Text style={{ 
            fontWeight: 'bold', 
            color: getProgressColor() 
          }}>
            {' '}({progressPercentage}%)
          </Text>
        </Text>
      </View>

      <View style={[styles.progressTrack, { width }]}>
        <View style={[
          styles.progressBar, 
          { 
            borderTopRightRadius: subtotal < limite ? 12 : 0,
            borderBottomRightRadius: subtotal < limite ? 12 : 0,
            width: `${Math.max(3, progress * 100)}%`,
            backgroundColor: getProgressColor(),
            opacity: subtotal === 0 ? 0.5 : 1
          }
        ]}>
          {progress > 0.15 && (
            <Text style={styles.progressText}>
              {progressPercentage}%
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
    paddingHorizontal: 14
  },
  text: {
    fontSize: fontSizes.medium,
  },
  limitText: {
    fontSize: fontSizes.small,
  },
  progressTrack: {
    height: 24,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: fontSizes.small,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});