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

const TestScreen8: FC = () => {
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
      question: "Хүчдэл юунаас болж алдагддаг вэ?",
      songoltuud: [
        "Идэвхитэй эсэргүүцлээс болж алдагддаг.",
        "Бүрэн эсэргүүцлээс болж алдагддаг.",
        "Гүйдлээс болж алдагддаг.",
      ],
      hariu: 2,
    },
    {
      question:
        "Хүчний трансформаторын давтамжийг 1.2 дахин ихэсгэвэл цахилгаан хөдөлгөгч хүчний үйлчлэх утга хэдэн хувиар хэрхэн өөрчлөгдөх вэ?",
      songoltuud: [
        "20%-иар буурна.",
        "20%-иар өснө.",
        "40%-иар буурна.",
        "40%-иар өснө.",
      ],
      hariu: 2,
    },
    {
      question:
        "3-н фазын хэлхээнд яагаад шугамын хүчдэл фазын хүчдэлээс 1.732 дахин их байдаг вэ?",
      songoltuud: [
        "Учир нь хүчдэл бол вектор хэмжигдэхүүн.",
        "Учир нь хүчдэл бол хоёр цэгийн хоорондох потенциалын ялгавараар тодорхойлогддог хэмжигдэхүүн.",
        "Аль нь ч биш.",
        "Дээрх хоёр хоёулаа зөв.",
      ],
      hariu: 4,
    },
    {
      question:
        "Иргэний барилгад зориулалтын цахилгааны өрөөнөөс өөр өрөө, тасалгаанд байрлуулах ерөнхий хуваарилах самбарын хамгаалалтын зэрэглэл ямар байх вэ?",
      songoltuud: [
        "IP44-өөс багагүй.",
        "IP31-ээс багагүй.",
        "IP54-өөс багагүй.",
      ],
      hariu: 2,
    },
    {
      question:
        "Олон нийтийн барилгын гэрэлтүүлгийн унтраалгыг шалнаас хэдэн метр өндөрт тоноглох нь тохиромжтой вэ?",
      songoltuud: ["1.0 метр", "1.5 метр", "2 метр"],
      hariu: 2,
    },
    {
      question: "ЦХНА-ны II зэргийн хэрэглэгч нь :",
      songoltuud: [
        "Заавал хоёр талын тэжээлтэй байна.",
        "24-н цагийн хугацаанд эрчим хүчээр тасалдахыг зөвшөөрнө.",
        "Үйлчилгээний хүн ирж засварлах эсвэл сэлгэн залгах хугацаанд л эрчим хүчээр тасалдахыг зөвшөөрнө.",
      ],
      hariu: 3,
    },
    {
      question:
        "10кВ-ын шуудуунд тавигдах кабелиас холбооны шугам хүртэл хэдэн метр зайнд ойртуулж тавихыг зөвшөөрөх вэ?",
      songoltuud: ["0.4 метр", "0.5 метр", "0.6 метр"],
      hariu: 2,
    },
    {
      question:
        "Хамгаалах газардуулгыг ажлын нойлтуулгаас тусдаа татсан боловч хоёуланг нь үүсгүүрийн нейтраль цэгт холбосон нэг эх үүсвэртэй системийг юу гэж нэрлэх вэ?",
      songoltuud: ["TN-C-S", "TN-S", "TN-C"],
      hariu: 2,
    },
    {
      question:
        "Дамжуулагч материалыг сунгаж татаад уртыг нь ихэсгэвэл эсэргүүцэл нь шугаман хамаарлаар өөрчлөгдөх үү?",
      songoltuud: [
        "Шугаман хамаарлаар ихсэнэ.",
        "Шугаман хамаарлаар багасна.",
        "Шугаман бус хамаарлаар өөрчлөгдөнө.",
      ],
      hariu: 3,
    },
    {
      question: "Гэрлийн урсгалын орон зайн нягтыг юу гэж нэрлэдэг вэ?",
      songoltuud: ["Гэрэлтэлт", "Гэрлийн хүч", "Гэрэл өгөлт"],
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

export default TestScreen8;

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
