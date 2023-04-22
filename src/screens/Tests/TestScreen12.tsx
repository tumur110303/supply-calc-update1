import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Alert,
} from "react-native";
import React, { FC, useEffect, useState, useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { dark, main, w500 } from "../../constants";
import Button from "../../components/Button";
import CountContext from "../../context/CountContext";

const { width } = Dimensions.get("screen");

const TestScreen12: FC = () => {
  const { increase } = useContext(CountContext);
  const [hariulsan, setHariulsan] = useState<number[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [shalgasan, setShalgasan] = useState<boolean>(false);
  const [zowHariulsan, setZowHariulsan] = useState<boolean[]>([]);
  const [totalScore, setTotalScore] = useState<number>(0);

  const utgaUurchluh = (a: number, i: number) => {
    setHariulsan((state) => {
      const copyState = [...state];
      if (copyState[a] === i) {
        copyState[a] = -1;
      } else {
        copyState[a] = i;
      }

      return copyState;
    });
  };

  useEffect(() => {
    tests.map((el, i) => {
      setZowHariulsan((state) => {
        const copy = [...state];

        copy[i] = hariulsan[i] + 1 === tests[i].hariu;
        return copy;
      });
    });
  }, [hariulsan]);

  useEffect(() => {
    const scores: number[] = [];

    zowHariulsan.map((el, i) =>
      el === false ? (scores[i] = 0) : (scores[i] = 1)
    );

    setTotalScore(() => {
      const total = scores.reduce((a, b) => a + b, 0);
      return total;
    });
  }, [hariulsan, zowHariulsan]);

  const clicked = async () => {
    setShalgasan(!shalgasan);
    let dvn = "";
    if (totalScore < 6) dvn = "F";
    else if (totalScore < 7) dvn = "D";
    else if (totalScore < 8) dvn = "C";
    else if (totalScore < 9) dvn = "B";
    else dvn = "A";

    if (shalgasan) {
      setHariulsan(() => []);
    } else {
      Alert.alert(
        `Таны дүн : ${dvn}`,
        `Та 10-н асуултаас ${totalScore} асуултанд зөв хариулсан байна.`,
        [
          {
            text: "Ойлгосон",
            onPress: () => {},
            style: "cancel",
          },
        ]
      );
    }

    await increase();
  };

  const tests = [
    {
      question: "Хэлхээний хэсгийн Омын хууль аль нь вэ?",
      songoltuud: ["I = U / R", "I = E / R", "I = (E + Uдот) / R"],
      hariu: 1,
    },
    {
      question: "Чадлын коэффициент гэж юу вэ?",
      songoltuud: [
        "Чадлын алдагдлыг нийт чадалд харьцуулсан харьцаа.",
        "Ашигтай чадлыг нийт чадалд харьцуулсан харьцаа.",
        "Идэвхитэй болон бүрэн чадлуудын хоорондох өнцөгийн косинус.",
        "Бүрэн чадлыг идэвхитэй чадалд харьцуулсан харьцаа.",
      ],
      hariu: 3,
    },
    {
      question: "Багтаамжийг (C) ямар нэгжээр хэмжих вэ?",
      songoltuud: ["Фарад", "микроФарад", "Тесла"],
      hariu: 2,
    },
    {
      question:
        "Нийтийн хоолны газрын хоол бэлтгэх, хооллох өрөөнүүдэд хамгаалагдаагүй цахилгаан дамжуулах ПВ маягийн утсыг ил тавихыг зөвшөөрөх үү?",
      songoltuud: [
        "Зөвшөөрнө.",
        "Зөвшөөрөхгүй.",
        "Тавиур дээр тавихаар бол зөвшөөрнө.",
      ],
      hariu: 2,
    },
    {
      question:
        "Ослын гэрэлтүүлгийн сүлжээнд холбогдсон розеткыг тэжээх шугамыг хэдэн mA-ын хамгаалалтын таслах төхөөрөмжөөр хамгаалах вэ?",
      songoltuud: [
        "30mA хүртэл хамгаалалтын таслах төхөөрөмжөөр хамгаална.",
        "Ослын гэрэлтүүлгийн сүлжээнд розетка тоноглохыг хориглоно.",
        "10mA хүртэл хамгаалалтын таслах төхөөрөмжөөр хамгаална.",
      ],
      hariu: 2,
    },
    {
      question:
        "Амралт, сувиллын газар ЦХНА-ны хэддүгээр зэргийн хэрэглэгч вэ?",
      songoltuud: ["I", "II", "III"],
      hariu: 2,
    },
    {
      question:
        "10кВ-ын ЦДАШ-ын утаснаас газрын гадарга хүртэл хамгийн багадаа хэвийн горимд хэдэн метр байхыг зөвшөөрөх вэ?",
      songoltuud: ["5 метр", "6 метр", "7 метр"],
      hariu: 1,
    },
    {
      question: "tgф  = b / g - Энэ томьёоны g юу вэ?",
      songoltuud: [
        "Хуурмаг дамжуулах чадвар",
        "Идэвхитэй дамжуулах чадвар",
        "Бүрэн дамжуулах чадвар",
      ],
      hariu: 2,
    },
    {
      question: "Гүйдлийн трансформаторын ... нарвийвчлалын ангилал гэнэ.",
      songoltuud: [
        "утгын алдааг",
        "утгын алдааг коэффициентоор илэрхийлснийг",
        "утгын алдааг процентоор илэрхийлснийг",
      ],
      hariu: 3,
    },
    {
      question: "Ослын гэрэлтүүлгийг зориулалтаар нь юу гэж ангилах вэ?",
      songoltuud: [
        "Ажлын ба ослын",
        "Ерөнхий, орчны, хосолсон",
        "Ажил хэвийн үргэлжлүүлэх ба нүүлгэн шилжүүлэх",
      ],
      hariu: 3,
    },
  ];

  useEffect(() => {
    const hariulaagu = hariulsan.findIndex((index) => index === -1);
    if (hariulaagu === -1) {
      if (hariulsan.length === 10) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } else {
      setDisabled(true);
    }
  }, [hariulsan]);

  return (
    <ScrollView style={css.container}>
      {tests.map((test, index) => (
        <View key={index} style={css.item}>
          <Text style={css.question}>{test.question}</Text>
          <View>
            {test.songoltuud.map((songolt, i) => (
              <TouchableOpacity
                disabled={shalgasan}
                key={i}
                style={css.songolt}
                activeOpacity={0.7}
                onPress={() => utgaUurchluh(index, i)}
              >
                <MaterialCommunityIcons
                  name={
                    hariulsan[index] === i
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={22}
                  color={hariulsan[index] === i ? main : dark}
                />
                {(() => {
                  const green = "#a4e170";
                  if (!shalgasan)
                    return (
                      <Text style={{ marginHorizontal: 10 }}>{songolt}</Text>
                    );
                  else {
                    return i + 1 === tests[index].hariu ? (
                      <Text
                        style={{ marginHorizontal: 10, backgroundColor: green }}
                      >
                        {songolt}
                      </Text>
                    ) : (
                      <Text style={{ marginHorizontal: 10 }}>{songolt}</Text>
                    );
                  }
                })()}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <Button disable={disabled} onPress={clicked}>
        {!shalgasan ? "Хариултаа шалгах" : "Эхлэх"}
      </Button>
      <View style={{ marginBottom: 30 }}></View>
    </ScrollView>
  );
};

export default TestScreen12;

const css = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  item: {
    marginVertical: 10,
  },
  question: {
    color: main,
    fontSize: 18,
    width: width - 20,
    fontFamily: w500,
  },
  songolt: {
    marginVertical: 5,
    fontSize: 16,
    flexDirection: "row",
    alignItems: "center",
  },
});
