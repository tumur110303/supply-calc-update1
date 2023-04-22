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

const TestScreen13: FC = () => {
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
      question: "Гүйдэлд саад учруулах үзэгдлийг юу гэж нэрлэх вэ?",
      songoltuud: [
        "Идэвхитэй эсэргүүцэл",
        "Хуурмаг эсэргүүцэл",
        "Аль нь ч биш",
      ],
      hariu: 3,
    },
    {
      question: "Жоуль-Ленцийн хууль аль нь вэ?",
      songoltuud: ["Q = U * I * t", "Q = I * I * R * t", "Хоёулаа зөв"],
      hariu: 2,
    },
    {
      question: "Цахилгаан хөдөлгөгч хүчийг (E) ямар нэгжээр хэмжих вэ?",
      songoltuud: ["Генри", "Вб", "Тесла", "Вольт"],
      hariu: 4,
    },
    {
      question:
        "Гал эсэргүүцэх төхөөрөмжийн хуваарилах болон удирдлагын самбар ямар таних тэмдэгтэй байх шаардлагатай вэ?",
      songoltuud: [
        "Улаан өнгийн таних тэмдэгтэй байх юм уу улаан өнгөөр будсан байх шаардлагатай.",
        "'Галын төхөөрөмж тэжээх самбар' гэсэн плакаттай байх шаардлагатай.",
        "Гарсан шугамын эхэнд 'галын төхөөрөмж' гэсэн бичигтэй бирк хийгдсэн байх шаардлагатай.",
      ],
      hariu: 1,
    },
    {
      question:
        "УДДТ-ийн барилга тэжээх шугамд өөр барилга холбохыг зөвшөөрөх үү?",
      songoltuud: [
        "Зөвшөөрөхгүй.",
        "Зөвшөөрнө.",
        "УДДТ-ийн барилгаасаа бага чадалтай барилга холбохыг зөвшөөрнө.",
      ],
      hariu: 1,
    },
    {
      question:
        "9-н давхар орон сууцны барилгын лифт ЦХНА-ны хэддүгээр зэргийн хэрэглэгч вэ?",
      songoltuud: [
        "I",
        "II",
        "III",
        "Лифт нь өөрийн тог баригчгүй бол ЦХНА-ны I зэргийн хэрэглэгч",
      ],
      hariu: 4,
    },
    {
      question:
        "10кВ-ын ЦДАШ-аас барилга хүртэл 2.3 метр ойртсон бол ямар арга хэмжээ авах вэ?",
      songoltuud: [
        "Ямар ч арга хэмжээ авах шаардлагагүй. Зөвшөөрөгдөнө.",
        "АШ-ыг холдуулж зөөх шаардлагатай.",
        "Харьяа цахилгаан шугам сүлжээний байгууллага ба онцгой байдлын газраас зөвшөөрөл авах шаардлагатай. Хэрэв зөвшөөрөхгүй бол холдуулж, зөөн шилжүүлнэ.",
      ],
      hariu: 1,
    },
    {
      question: "Цахилгаан хэлхээний ерөнхий эсэргүүцэл гэж юу вэ?",
      songoltuud: [
        "Хэлхээнд холбогдсон эсэргүүцлүүдийн үйлчлэх утга.",
        "Идэвхитэй ба хуурмаг эсэргүүцлүүдийн нийлбэр.",
        "Дээрх хоёр хоёулаа мөн.",
      ],
      hariu: 1,
    },
    {
      question: "3-н фазын хэлхээний нойлын дамжуулагчаар ямар гүйдэл гүйх вэ?",
      songoltuud: [
        "A,B,C фазын гүйдлийн ялгавартай тэнцүү хэмжээний гүйдэл гүйнэ.",
        "A,B,C фазын гүйдлийн нийлбэртэй тэнцүү хэмжээний гүйдэл гүйнэ.",
        "Аль нь ч биш",
      ],
      hariu: 2,
    },
    {
      question:
        "Гадна гэрэлтүүлгийн тооцоонд шаардлагын коэффициентийг хэдээр авах вэ?",
      songoltuud: ["Дүрмийн дагуу хүснэгтээс авна.", "0.9", "0.85-1"],
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

export default TestScreen13;

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
