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

const TestScreen5: FC = () => {
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
      question: "Гүйдэл хүчдэл хоорондоо ямар хамааралтай вэ?",
      songoltuud: [
        "Шууд пропорционал хамааралтай.",
        "Урвуу пропорционал хамааралтай.",
        "Тухайн тохиолдлоос хамаараад янз бүрээр хамаарч болно.",
      ],
      hariu: 1,
    },
    {
      question:
        "Хувьсах гүйдлийн үйлчлэх утга далайцын дээд утгатай ямар хамааралтай байдаг вэ?",
      songoltuud: [
        "Хоорондоо тэнцүү.",
        "1.732 дахин зөрүүтэй.",
        "1.414 дахин зөрүүтэй.",
      ],
      hariu: 3,
    },
    {
      question: "EXIT гэрлийг ямар өндөрт тоноглох вэ?",
      songoltuud: [
        "Өндрийг нормчлохгүй, хаалганы дээр тоноглоно.",
        "2.2м-ээс багагүй өндөрт тоноглоно.",
        "2м-ээс багагүй өндөрт тоноглоно.",
      ],
      hariu: 3,
    },
    {
      question:
        "Уурын зуух, халаалтын тогооны барилга ЦХНА-ны хэддүгээр зэрэглэлийн хэрэглэгч болох вэ?",
      songoltuud: [
        "10.6 МВт-аас дээш хүчин чадалтай зуухтай бол I зэргийн хэрэглэгч үгүй бол II зэргийн хэрэглэгч байна.",
        "11.6 МВт-аас дээш хүчин чадалтай зуухтай бол I зэргийн хэрэглэгч үгүй бол II зэргийн хэрэглэгч байна.",
        "I зэргийн хэрэглэгч байна.",
      ],
      hariu: 2,
    },
    {
      question:
        "Сууц, зуслангийн барилгын агуулах, туслах өрөөнүүдэд тавих розетканы хамгаалалтын зэрэглэл ямар байх шаардлагатай вэ?",
      songoltuud: [
        "IP44-өөс багагүй.",
        "IP54-өөс багагүй.",
        "Уг өрөөнүүдэд розетка тоноглох хориотой.",
      ],
      hariu: 3,
    },
    {
      question:
        "Орон сууцны барилгын ослын гэрэлтүүлэг ЦХНА-ны хэддүгээр зэргийн хэрэглэгч вэ?",
      songoltuud: ["I", "II", "III"],
      hariu: 1,
    },
    {
      question:
        "Орон сууцны барилгын сантехникийн тоног төхөөрөмж тэжээх радиал шугамын чадлын коэффициентийг тооцоонд хэдээр авах вэ?",
      songoltuud: ["0.9", "0.85", "0.8", "Хөдөлгүүрийн каталогийн өгөгдлөөр"],
      hariu: 4,
    },
    {
      question: "Ачаалал таслагчийн үүрэг юу вэ?",
      songoltuud: [
        "Хэт ачаалалтай үед хэлхээг автоматаар тасалж, хамгаалах үүрэгтэй.",
        "Ачаалалтай үед хэлхээг гараар тасалж, засвар үйлчилгээ хийхэд зориулж хүчдэлгүй болгох үүрэгтэй.",
        "Дээрх хоёр хоёулаа зөв.",
      ],
      hariu: 2,
    },
    {
      question:
        "Цахилгаан хэрэгслийн хүчдэлийн зөвшөөрөгдөх хэлбийлт хэдэн хувь байх вэ?",
      songoltuud: ["-5%-аас +5%", "-5%-аас +10%", "-2.5%-аас +5%"],
      hariu: 1,
    },
    {
      question:
        "Сантехникийн тоног төхөөрөмжийн шаардлагын коэффициентийг юунаас хамааруулж олох вэ?",
      songoltuud: [
        "Сантехникийн тоног төхөөрөмжийн суурилагдсан чадлаас",
        "Сантехникийн тоног төхөөрөмжийн тооноос",
        "Сантехникийн тоног төхөөрөмжийн нийт хүчний төхөөрөмжид эзлэх хувийн жингээс",
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

export default TestScreen5;

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
