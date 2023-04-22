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

const { width } = Dimensions.get("screen");

const TestScreen11: FC = () => {
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
  };

  const tests = [
    {
      question: "Бүрэн хэлхээний Омын хууль аль нь вэ?",
      songoltuud: ["I = U / R", "I = E / R", "I = (E + Uдот) / R"],
      hariu: 2,
    },
    {
      question:
        "Ижил чадалтай 220B-ын хэрэглэгчийн гүйдэл 380B-ын хэрэглэгчийн гүйдлээс ямагт их байдаг нь ямар учиртай вэ?",
      songoltuud: [
        "Учир нь гүйдэл, хүчдэл хоёр урвуу хамааралтай байна.",
        "Тухайн чадлыг бага хүчдэлээр хангаж байгаа тул илүү их гүйдэл гүйлгэх шаардлага үүсдэг.",
        "Дээрх хоёрын аль нь ч биш.",
        "Нэг ба гурван фазын гүйдэл хоорондоо тэнцүү байдаг. Өөрөөр хэлбэл асуулт нь буруу байна.",
      ],
      hariu: 2,
    },
    {
      question: "Соронзон урсгалыг (Ф) ямар нэгжээр хэмжих вэ?",
      songoltuud: ["Генри", "Тесла", "Вб"],
      hariu: 3,
    },
    {
      question:
        "Барилгын доторх гэрэлтүүлгийн группын сүлжээний автоматын гүйдэл хамгийн ихдээ хэдэн А байх вэ?",
      songoltuud: ["32A", "25A", "16A"],
      hariu: 2,
    },
    {
      question:
        "Саун, ванны өрөө, сантехникийн узель гэх мэт өрөөнд унтраалга тоноглохыг зөвшөөрөх үү?",
      songoltuud: [
        "Хориглоно.",
        "IP44-өөс багагүй хамгаалалтын зэрэглэлтэй бол зөвшөөрнө.",
        "Өөр аргагүй үед IP44-өөс багагүй хамгаалалтын зэрэглэлтэй бол зөвшөөрнө.",
      ],
      hariu: 1,
    },
    {
      question:
        "Нэг ээлжиндээ 60-н хүний хоол бэлтгэх хэсэгчилэн цахилгаанжуулсан нийтийн хоолны газар ЦХНА-ны хэддүгээр зэргийн хэрэглэгч вэ?",
      songoltuud: ["I", "II", "III"],
      hariu: 2,
    },
    {
      question:
        "Кабелийг авто замтай зэрэгцээ тавихдаа авто замын захын ирмэгээс хамгийн багадаа хэдэн метр зайд ойртуулж тавихыг зөвшөөрөх вэ?",
      songoltuud: ["1.0м", "1.5м", "2.0м"],
      hariu: 1,
    },
    {
      question: "tgф  = b / g - Энэ томьёоны b юу вэ?",
      songoltuud: [
        "Хуурмаг дамжуулах чадвар",
        "Идэвхитэй дамжуулах чадвар",
        "Бүрэн дамжуулах чадвар",
      ],
      hariu: 1,
    },
    {
      question:
        "Трансформаторын ачаалагдах коэффициентийг хэдээр тогтоож өгсөн байдаг вэ?",
      songoltuud: [
        "0.3 < Kтр < 1.1",
        "0.3 < Kтр < 1.3",
        "0.4 < Kтр < 1.5",
        "0.5 < Kтр < 1.5",
      ],
      hariu: 2,
    },
    {
      question: "Гэрэлтүүлгийн ямар ямар төрлийн систем байдаг вэ?",
      songoltuud: [
        "Ажлын ба ослын",
        "Ерөнхий, орчны, хосолсон",
        "Аль нь ч биш",
      ],
      hariu: 2,
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

export default TestScreen11;

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
