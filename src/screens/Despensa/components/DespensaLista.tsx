import { List, Text } from "react-native-paper";
import { DespensaItem } from "../hooks/useDespensa";

interface Props {
  items: DespensaItem[];
  expanded: Record<string, boolean>;
  onToggleAccordion: (category: string) => void;
  onToggleStatus: (id: string) => void;
}

export default function DespensaLista({
  items,
  expanded,
  onToggleAccordion,
  onToggleStatus,
}: Props) {

  return (
    <List.Section>
      {items.map(item => (
        <List.Item
          key={item.id}
          title={`${item.name} - ${item.quantity} ${item.peso ? `(${item.peso}kg)` : ""}`}
          description={item.isAberto ? "Aberto" : "Fechado"}
          left={props => (
            <List.Icon
              {...props}
              icon={item.isAberto ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
            />
          )}
          onPress={() => onToggleStatus(item.id)}
        />
      ))}
    </List.Section>
  )


  // const categories = [...new Set(items.map(item => item.category))];

  // return (
  //   <List.Section>
  //     {categories.map(category => {
  //       const filteredItems = items.filter(item => item.category === category);
  //       return (
  //         <List.Accordion
  //           key={category}
  //           title={category}
  //           expanded={expanded[category] || false}
  //           onPress={() => onToggleAccordion(category)}
  //         >
  //           {expanded[category] &&
  //             filteredItems.map(item => (
  //               <List.Item
  //                 key={item.id}
  //                 title={`${item.name} - ${item.quantity} ${item.peso ? `(${item.peso}kg)` : ""}`}
  //                 description={item.isAberto ? "Aberto" : "Fechado"}
  //                 left={props => (
  //                   <List.Icon
  //                     {...props}
  //                     icon={item.isAberto ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
  //                   />
  //                 )}
  //                 onPress={() => onToggleStatus(item.id)}
  //                 right={() => (
  //                   <Text style={{ alignSelf: "center" }}>
  //                     {item.quantity}x
  //                   </Text>
  //                 )}
  //               />
  //             ))}
  //         </List.Accordion>
  //       );
  //     })}
  //   </List.Section>
  // );
}
