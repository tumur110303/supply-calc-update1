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

const TestScreen7: FC = () => {
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
      question:
        "6-35кВ-ын сүлжээнд ослын горимд хүчдэлийн зөвшөөрөгдөх алдагдал хэдэн хувь байх вэ?",
      songoltuud: ["5-7.5%", "6-8%", "10%"],
      hariu: 3,
    },
    {
      question:
        "Өөр чадалтай хүчний трансформаторуудыг зэрэгцээ ажиллуулж болох уу?",
      songoltuud: [
        "Ороомгуудын хүчдэлүүд нь тэнцүү бол болно.",
        "Болно.",
        "Болохгүй. Чадал хүчдэл нь тэнцүү байх шаардлагатай.",
      ],
      hariu: 1,
    },
    {
      question: "Амперметрийн эсэргүүцэл ямар хэмжээтэй байх вэ?",
      songoltuud: [
        "Тогтмол 5 Ом байх ёстой.",
        "Амперметрийн дотоод эсэргүүцийг асар их байхаар хийдэг.",
        "Амперметрийн дотоод эсэргүүцийг асар бага байхаар хийдэг.",
      ],
      hariu: 3,
    },
    {
      question:
        "Иргэний барилгад ил тавих хуваарилах самбарыг хамгийн багадаа ямар өндөрт тоноглох вэ?",
      songoltuud: ["1.5м", "1.8м", "2.2м"],
      hariu: 3,
    },
    {
      question:
        "Орон сууцны цахилгаан зуух тэжээх шугамд нэмж хэдэн розетка холбохыг зөвшөөрөх вэ?",
      songoltuud: [
        "Гал тогооны хэсэгт 2 розетка нэмж холбохыг зөвшөөрнө.",
        "Зөвшөөрөхгүй.",
        "Зөвхөн гал тогооны хэсгийн розеткыг тоо хамаарахгүй холбож болно.",
      ],
      hariu: 2,
    },
    {
      question:
        "20-н өрөөтэй зочид буудлын барилга ЦХНА-ны хэддүгээр зэргийн хэрэглэгч вэ?",
      songoltuud: ["I", "II", "III"],
      hariu: 2,
    },
    {
      question:
        "10кВ-ын шуудуунд тавигдах кабелиас дулааны шугам хүртэл хэдэн метр зайнд ойртуулж тавихыг зөвшөөрөх вэ?",
      songoltuud: ["1 метр", "1.5 метр", "2 метр"],
      hariu: 3,
    },
    {
      question:
        "Хамгаалах газардуулгыг ажлын нойлтуулгатай хамтатгасан (PEN) системийг юу гэж нэрлэх вэ?",
      songoltuud: ["TN-C-S", "TN-S", "TN-C"],
      hariu: 3,
    },
    {
      question:
        "Дамжуулагч материалын цахилгаан эсэргүүцэл температураас хэрхэн хамаардаг вэ?",
      songoltuud: [
        "Шууд хамааралтай.",
        "Урвуу хамааралтай.",
        "Хоорондоо хамааралгүй.",
      ],
      hariu: 1,
    },
    {
      question:
        "Цэвэрлэгээний төхөөрөмж залгах 1 ширхэг 220В-ын хамгаалагдсан розетка тэжээх шугамын чадлыг хэдэн Вт-аар авах вэ?",
      songoltuud: ["60-100 Вт", "2000 Вт", "500 Вт", "300 Вт"],
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

export default TestScreen7;

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
