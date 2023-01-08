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

const TestScreen10: FC = () => {
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
      question: "Индуктив чадал гэж юу вэ?",
      songoltuud: [
        "Цахилгаан энергийг өөр төрлийн энергид хувиргахад зарцуулах цахилгаан энергийн зарцуулалтын хурдыг индуктив чадал гэнэ.",
        "Өөр төрлийн энергийг цахилгаан энергид хувиргах энергийн зарцуулалтын хурдыг индуктив чадал гэнэ.",
        "Ашиггүй чадлыг индуктив чадал гэнэ.",
      ],
      hariu: 2,
    },
    {
      question:
        "Тэг утастай 3-н фазын тэгш биш хэмтэй ачааллын хамгийн их ачаалалтай фазын гүйдэл ямар үед нойлын дамжуулагчийн гүйдэлтэй тэнцэх вэ?",
      songoltuud: [
        "Үлдсэн хоёр фаз ачаалалгүй үед тэнцэнэ.",
        "Ямар ч үед тэнцэх боломжгүй.",
        "Угаас хамгийн их фазын гүйдэлтэй тэнцүү байдаг.",
      ],
      hariu: 1,
    },
    {
      question: "Багтаамжийн эсэргүүцэл гэж юу вэ?",
      songoltuud: [
        "Хуримтлуурт хуримтлагдсан цэнэгийн гүйдэлд саад учруулах үзэгдэл.",
        "Багтаамжийн орон зайд эзэлж суусан цэнэгийн гүйдэлд саад учруулах үзэгдэл.",
        "Дээрх хоёр хариулт ижил утгатай.",
        "Аль нь ч биш.",
      ],
      hariu: 3,
    },
    {
      question:
        "12-42В-ын хүчдэлтэй сүлжээний хүчдэлийн зөвшөөрөгдөх алдагдал эх үүсвэрээс хэрэглэгч хүртэл хэдэн хувь байхыг зөвшөөрөх вэ?",
      songoltuud: ["10%", "7.5%", "5%"],
      hariu: 1,
    },
    {
      question: "Цахилгааны өрөөн дундуур салхивчийн шугам татаж болох уу?",
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
        "45 хүн байнга байрлаж ажиллах сумын засаг даргын тамгын газар ЦХНА-ны хэддүгээр зэргийн хэрэглэгч вэ?",
      songoltuud: ["I", "II", "III"],
      hariu: 3,
    },
    {
      question:
        "0.4кВ-ын кабелиас барилга, байгууламжийн суурь, довжоо хүртэл хамгийн багадаа хэдэн метр зайд ойртуулж тавихыг зөвшөөрөх вэ?",
      songoltuud: ["0.4м", "0.5м", "0.6м"],
      hariu: 3,
    },
    {
      question:
        "Монгол улсад сүүлийн үед хамгаалах газардуулгын ямар системийг хэрэглэж байгаа вэ?",
      songoltuud: ["TN-C-S", "TN-S", "TT", "TN-C"],
      hariu: 3,
    },
    {
      question: "Хэлхээний бүрэн эсэргүүцэл гэж юу вэ?",
      songoltuud: [
        "Тухайн хэлхээнд байгаа бүх эсэргүүцлүүдийн үйлчлэх утга.",
        "Идэвхитэй эсэргүүцэл хуурмаг эсэргүүцлийн нийлбэр.",
        "Дээрх хоёр хоёулаа мөн.",
      ],
      hariu: 2,
    },
    {
      question: "Гэрэлтүүлгийг хэлбэрээр нь юу гэж ангилах вэ?",
      songoltuud: [
        "Ажлын ба ослын",
        "Ерөнхий, орчны, хосолсон",
        "Аль нь ч биш",
      ],
      hariu: 1,
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

export default TestScreen10;

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
