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

const TestScreen9: FC = () => {
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
      question:
        "Ямар тохиолдолд хүчдэлийн алдагдлыг тооцохдоо С коэффициент хэрэглэх вэ?",
      songoltuud: [
        "Бүх тохиолдолд С коэффициентийг тооцож хүчдэлийн алдагдлыг тодорхойлно.",
        "Зөвхөн 0.4кВ-ын шугамын алдагдлыг тооцохдоо С коэффициент ашиглана.",
        "Хуурмаг чадлын нөлөөг тооцоогүй үед С коэффициентоор хүчдэлийн алдагдлыг тодорхойлно.",
      ],
      hariu: 3,
    },
    {
      question:
        "Хүчний трансформаторын индукцийн цахилгаан хөдөлгөгч хүчнүүд соронзон урсгалаасаа фазаараа ямар хамааралтай байх вэ?",
      songoltuud: [
        "Фазаараа давхцана.",
        "ЦХХ нь 90 градусаар түрүүлнэ.",
        "ЦХХ нь 90 градусаар хоцроно.",
      ],
      hariu: 3,
    },
    {
      question: "Идэвхитэй эсэргүүцэл гэж юу вэ?",
      songoltuud: [
        "Харилцан индукцийн цахилгаан хөдөлгөгч хүчний гүйдэлд саад учруулах үзэгдэл.",
        "Гадаргуугийн эффектийн нөлөөгөөр үүссэн цахилгаан хөдөлгөгч хүчний гүйдэлд саад учруулах үзэгдэл",
        "Цахилгаан хөдөлгөгч хүчний гүйдэлд саад учруулж, чадал, хүчдэлийн алдагдал үүсгэх үзэгдэл.",
      ],
      hariu: 2,
    },
    {
      question: "Цахилгааны өрөөний температур хэдэн градус байх ёстой вэ?",
      songoltuud: ["5 градусаас дээш.", "0 градусаас дээш.", "Нормчлохгүй."],
      hariu: 1,
    },
    {
      question: "Цахилгааны өрөөн дундуур ус хангамжийн шугам татаж болох уу?",
      songoltuud: [
        "Хатуу хориглоно.",
        "Өөр аргагүй үед вентиль, салаалагч, хаалт, фланец, люкгүй зөвхөн шугам хоолой татах бол зөвшөөрнө.",
        "Зөвшөөрнө.",
        "Вентиль, салаалагч, хаалт, фланец, люкгүй зөвхөн шугам хоолой татах бол зөвшөөрнө.",
      ],
      hariu: 2,
    },
    {
      question:
        "Их дэлгүүр, худалдааны төвийн барилга ЦХНА-ны хэддүгээр зэргийн хэрэглэгч вэ?",
      songoltuud: ["I", "II", "III"],
      hariu: 1,
    },
    {
      question:
        "Шуудуунд тавигдах 10кВ-ын хос кабелийн хоорондын зай хамгийн багадаа хэд байвал зохих вэ?",
      songoltuud: ["200мм", "150мм", "100мм"],
      hariu: 3,
    },
    {
      question:
        "Хамгаалах газардуулгыг ажлын нойлтуулгын системтэй огт холбоогүй тусад нь хийсэн газардуулгатай холбосон системийг юу гэж нэрлэх вэ?",
      songoltuud: ["TN-C-S", "TN-S", "TN-C", "TT"],
      hariu: 4,
    },
    {
      question:
        "Дамжуулагчийн эсэргүүцэл, ямар хэмжигдэхүүнүүдээс хамаарах вэ?",
      songoltuud: [
        "Материал, геометр шинж, орчны температураас хамаарна.",
        "Материал, хөндлөн огтлол, уртаас хамаарна.",
        "Материал, геометр шинжээс хамаарна.",
      ],
      hariu: 1,
    },
    {
      question:
        "Гэрэлтүүлэгдэж буй гадаргуугаас хүний харааны зүгт чиглэсэн гэрлийн хүчийг тэр гадаргуун талбайд харьцуулсан харьцааг юу гэж нэрлэдэг вэ?",
      songoltuud: ["Гэрэлтэлт", "Гэрлийн хүч", "Гэрлийн тодрол"],
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

export default TestScreen9;

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
