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

const TestScreen15: FC = () => {
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
        "Цахилгаан цэнэгийн тэгштгэлээс хугацаагаар авсан уламжлал юуг илэрхийлэх вэ?",
      songoltuud: ["Хүчдэлийг", "Гүйдлийг", "Чадлыг"],
      hariu: 2,
    },
    {
      question: "Кирхгофын I хууль аль нь вэ?",
      songoltuud: [
        "Зангилаа руу орсон гарсан гүйдлүүдийн нийлбэр тэгтэй тэнцүү байна.",
        "Хүрээний эсэргүүцлүүд дээр унах хүчдэлүүдийн алгебр нийлбэр уг хүрээний эхэн дэх хүчдэлтэй тэнцүү байна.",
        "Хүрээний эсэргүүцлүүд дээр унах хүчдэлүүдийн алгебр нийлбэр уг хүрээний эхэн дэх цахилгаан хөдөлгөгч хүчтэй тэнцүү байна.",
      ],
      hariu: 1,
    },
    {
      question: "Цахилгаан соронзон нөлөөмжийг (L) ямар нэгжээр хэмжих вэ?",
      songoltuud: ["Генри", "Вб", "Тесла", "Вольт"],
      hariu: 1,
    },
    {
      question:
        "Агаарын трансформаторын дэд станцын трансформаторын гүйдэл дамжуулах хэсгийг газраас хамгийн багадаа хэдэн метр зайтай байрлуулах вэ?",
      songoltuud: ["4 метр", "4.5 метр", "5 метр"],
      hariu: 2,
    },

    // Энэнээс доош засаагүй...
    {
      question:
        "Барилга байгууламжийн доторх тоног төхөөрөмжийн газардуулгыг аянгын газардуулгатай холбож болох уу?",
      songoltuud: [
        "Болно.",
        "Болохгүй.",
        "Хамгаалж байгаа барилга байгууламж дээрээ аянга хүлээн авагчийг хийсэн бол болно.",
      ],
      hariu: 3,
    },
    {
      question: "Цахилгаан хангамжийн систем гэж юу вэ?",
      songoltuud: [
        "Цахилгаан эрчим хүчийг үйлдвэрлэх, хуваарилах, хувиргах, дамжуулах үйл явц нэгдсэн горимоор ажилладаг цахилгаан станц, дэд станц, цахилгаан дамжуулах шугам, дулааны сүлжээний нэгдлийг цахилгаан хангамжийн систем гэнэ.",
        "Цахилгаан эрчим хүчийг үйлдвэрлэх, дамжуулах, хуваарилах, хэрэглэх төхөөрөмжүүдийн цогцолборыг цахилгаан хангамжийн систем гэнэ.",
        "Цахилгаан эрчим хүчийг дамжуулах, хуваарилах үйл явц ажлын нэгдсэн горимоор холбогдсон дэд станц, цахилгаан дамжуулах шугамын нэгдлийг цахилгаан хангамжийн систем гэнэ.",
      ],
      hariu: 2,
    },
    {
      question:
        "Нүүлгэн шилжүүлэх болон аюулгүйн гэрэлтүүлгийг тэжээх шугамыг нэгтгэж болох уу?",
      songoltuud: [
        "Болохгүй.",
        "Болно.",
        "Өөр аргагүй тохиолдолд дүрмийн бус болгон нэгтгэхийг зөвшөөрнө.",
      ],
      hariu: 2,
    },
    {
      question:
        "Хөдөлгүүр тэжээх шугамын хамгаалах хэрэгслийг сонгохдоо аль тохиолдолд асаалтын гүйдлийг тооцох вэ?",
      songoltuud: [
        "Бүх тохиолдолд",
        "Зөвхөн гал хамгаалагчийн хайлах тавьцын гүйдлийг сонгохдоо",
        "Зөвхөн автомат таслуурын салгах гүйдлийг сонгохдоо",
      ],
      hariu: 2,
    },
    {
      question: "Гүйдлийн резонансын үед ямар үзэгдэл болох вэ?",
      songoltuud: [
        "Зэрэгцээ хэлхээний хуурмаг ба багтаамжийн дамжууламжуудын утга тэнцэнэ.",
        "Гүйдэл хүчдэл фазаараа давхцана.",
        "Хэлхээний бүрэн дамжууламж нь бодит дамжууламжтай тэнцэнэ.",
        "Дээрх бүгд биелэнэ.",
      ],
      hariu: 4,
    },
    {
      question:
        "Нэг гэрэлтүүлэгчийн цацаргах гэрлийн урсгал ямар үзүүлэлтүүдээс түлхүү хамаарах вэ?",
      songoltuud: [
        "Гэрлийн үүсгүүр, өнгө дамжуулалт, чадал",
        "Гэрлийн үүсгүүр, чадал",
        "Гэрлийн үүсгүүр, чадал, хүчдэл",
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

export default TestScreen15;

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
