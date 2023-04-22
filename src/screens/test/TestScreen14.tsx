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

const TestScreen14: FC = () => {
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
        "Цахилгаан энергийн тэгштгэлээс хугацаагаар авсан уламжлал юуг илэрхийлэх вэ?",
      songoltuud: ["Хүчдэлийг", "Гүйдлийг", "Чадлыг"],
      hariu: 3,
    },
    {
      question: "Кирхгофын II хууль аль нь вэ?",
      songoltuud: [
        "Зангилаа руу орсон гарсан гүйдлүүдийн нийлбэр тэгтэй тэнцүү байна.",
        "Хүрээний эсэргүүцлүүд дээр унах хүчдэлүүдийн алгебр нийлбэр уг хүрээний эхэн дэх хүчдэлтэй тэнцүү байна.",
        "Хүрээний эсэргүүцлүүд дээр унах хүчдэлүүдийн алгебр нийлбэр уг хүрээний эхэн дэх цахилгаан хөдөлгөгч хүчтэй тэнцүү байна.",
      ],
      hariu: 2,
    },
    {
      question: "Цахилгаан соронзон индукцийг (B) ямар нэгжээр хэмжих вэ?",
      songoltuud: ["Генри", "Вб", "Тесла", "Вольт"],
      hariu: 3,
    },
    {
      question:
        "Цахилгаан халаагуур, халаах хэрэгслээс шатамхай материал хүртэл хамгийн багадаа хэдэн метр зайтай байх шаардлагатай вэ?",
      songoltuud: ["0.3 метр", "0.5 метр", "0.8 метр"],
      hariu: 1,
    },
    {
      question:
        "Зураг төслийн шатанд лифтний төхөөрөмжийн тэжээх шугамын огтлол, хамгаалах хэрэгслийн тавилыг сонгохдоо",
      songoltuud: [
        "Үйлдвэрлэгчийн гаргасан хүснэгтээс авч сонгоно.",
        "Зураг төслийн инженер тооцоогоор сонгоно.",
        "Дээрх хоёр шаардлагыг хоёуланг нь хангасан байхаар сонгоно.",
      ],
      hariu: 3,
    },
    {
      question:
        "Цахилгаан хангамжийн найдвартай ажиллагааны зэрэглэл юуг илэрхийлэх вэ?",
      songoltuud: [
        "Тухайн обьект хэдэн талын тэжээлтэй байхыг шаарддаг.",
        "Тухайн обьект сэлгэн залгагчтай байх эсэхийг эсвэл сэлгэн залгагчтай бол ямар сэлгэн залгагчтай байхыг сонгохыг шаарддаг.",
        "Тухайн обьектын цахилгаан эрчим хүчээр тасалдах зөвшөөрөгдөх хугацааг тодорхойлно.",
      ],
      hariu: 3,
    },
    {
      question:
        "Худалдааны газрын барилга дотор нь дэд станц барьж байгуулж болох уу?",
      songoltuud: [
        "Норм дүрмийн шаардлагыг хангасан тохиолдолд ажлын зургийн дагуу байрлуулж болно.",
        "Хуурай трансформатор хэрэглэх бол болно.",
        "Зөвшөөрөхгүй.",
      ],
      hariu: 1,
    },
    {
      question:
        "Асинхрон хөдөлгүүрийг асаах үед яагаад асаалтын гүйдэл үүсдэг вэ?",
      songoltuud: [
        "Тайван байдалд байгаа роторын голыг эргүүлж эхлэхийн тулд их хүч шаарддаг учраас.",
        "Индуктив эсэргүүцэл хараахан үүсч амжаагүй байдаг учраас.",
        "Дээрх хоёр хоёулаа мөн.",
      ],
      hariu: 2,
    },
    {
      question:
        "Тус бүр нь 220В-ын потенциалтай, фазаараа 120 градус өнцгөөр ялгаатай хоёр цэгийн хоорондох хүчдэл хэдэн Вольт байх вэ?",
      songoltuud: ["380 В", "220 В", "0 В"],
      hariu: 1,
    },
    {
      question:
        "Гадна гэрэлтүүлэгчээс 0.4кВ-ын цахилгаан дамжуулах агаарын шугамын утас хүртэл хэдэн метр ойртохыг зөвшөөрөх вэ?",
      songoltuud: ["0.5 метр", "0.6 метр", "0.7 метр"],
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

export default TestScreen14;

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
