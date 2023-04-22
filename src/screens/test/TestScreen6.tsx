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

const TestScreen6: FC = () => {
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
        "6-35кВ-ын сүлжээнд хэвийн горимд хүчдэлийн зөвшөөрөгдөх алдагдал хэдэн хувь байх вэ?",
      songoltuud: ["5-7.5%", "6-8%", "10%"],
      hariu: 2,
    },
    {
      question:
        "3-н фазын сүлжээнийн хувьсах гүйдлийн үйлчлэх утга далайцын дээд утгатай ямар хамааралтай байдаг вэ?",
      songoltuud: [
        "Хоорондоо тэнцүү.",
        "1.732 дахин зөрүүтэй.",
        "1.414 дахин зөрүүтэй.",
      ],
      hariu: 1,
    },
    {
      question:
        "380-ын хүчдэлтэй ямар хэрэглэгч рүү нойлын дамжуулагч татахгүй вэ?",
      songoltuud: [
        "Бүх 3-н фазын хөдөлгүүр рүү.",
        "Симметр ачаалалтай 3-н фазын хэрэглэгчид рүү.",
        "Төгсгөлийн үзүүрүүд нь од холбогдсон 3-н фазын хэрэглэгчид рүү",
        "Төгсгөлийн үзүүрүүд нь гурвалжин холбогдсон 3-н фазын хэрэглэгчид рүү",
      ],
      hariu: 2,
    },
    {
      question:
        "Ерөнхий хуваарилах самбараас гарсан босоо шугамын ачааллын гүйдэл хэдэн А-аас ихгүй байх ёстой вэ?",
      songoltuud: ["200A", "250A", "300A"],
      hariu: 2,
    },
    {
      question:
        "Орон сууцны цахилгаан зуух тэжээх зэс голтой шугамын хөндлөн огтлол хэдэн мм.кв-аас багагүй байх хэрэгтэй вэ?",
      songoltuud: ["2.5мм.кв", "4мм.кв", "6мм.кв"],
      hariu: 3,
    },
    {
      question:
        "Орон сууцны барилгын лифт ЦХНА-ны хэддүгээр зэргийн хэрэглэгч вэ?",
      songoltuud: ["I", "II", "III"],
      hariu: 1,
    },
    {
      question:
        "Барилгын гадна цахилгааны оролтын кабелийг газрын тэгшлэгдсэн түвшнээс доош хэдэн метрийн гүнд хамгаалах хоолойд хийж гүйцэтгэх вэ?",
      songoltuud: ["0.5-2м-ийн гүнд", "0.7-2м-ийн гүнд", "0.9-2м-ийн гүнд"],
      hariu: 1,
    },
    {
      question: "Автомат таслуур, гал хамгаалагчийн үүрэг юу вэ?",
      songoltuud: [
        "Цахилгаан хэрэгслийг шатаж, гэмтэхээс хамгаалах.",
        "Тэжээлийн шугамыг богино залгаа, хэт ачааллын гүйдлээс хамгаалах.",
        "Дээрх хоёр хоёулаа зөв.",
      ],
      hariu: 2,
    },
    {
      question: "Чадлын моментыг хэрхэн тодорхойлох вэ?",
      songoltuud: [
        "Чадлыг эсэргүүцлээр үржүүлж тодорхойлно.",
        "Чадлыг хугацаагаар үржүүлж тодорхойлно.",
        "Чадлыг мөрөөр үржүүлж тодорхойлно.",
      ],
      hariu: 3,
    },
    {
      question: "Нэг хөдөлгүүр тэжээх шугамын хувьд тооцооны ачаалал нь:",
      songoltuud: [
        "Суурилагдсан чадалтайгаа тэнцүү.",
        "Суурилагдсан чадлыг дахин давталтын коэффициент (ПВ)-р үржүүлсэнтэй тэнцүү.",
        "Суурилагдсан чадлын 90%-тай тэнцүү.",
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

export default TestScreen6;

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
